import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { getProject } from '../api/projectApi.js'
import { getComments, createComment, updateComment, deleteComment } from '../api/commentApi.js'
import { getLikeStatus, toggleLike } from '../api/likeApi.js'
import ProjectDetails from '../components/project/ProjectDetails.jsx'
import CommentForm from '../components/comments/CommentForm.jsx'
import CommentList from '../components/comments/CommentList.jsx'
import useAuth from '../hooks/useAuth.js'
import { useToast } from '../context/ToastContext.jsx'

function ProjectSkeleton() {
  return (
    <div className="space-y-12 w-full max-w-5xl mx-auto">
      {/* Hero Skeleton */}
      <div className="rounded-2xl overflow-hidden shadow-sm" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        <div className="h-[420px] skeleton" />
        <div className="p-8 space-y-6">
          <div className="space-y-4 max-w-2xl">
            <div className="h-6 w-32 skeleton rounded-md" />
            <div className="h-10 w-full skeleton rounded-lg" />
            <div className="h-10 w-3/4 skeleton rounded-lg" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 mt-8" style={{ borderTop: '1px solid var(--border)' }}>
            {[1, 2, 3, 4].map(i => <div key={i} className="h-20 skeleton rounded-xl" />)}
          </div>
        </div>
      </div>
      
      {/* Comments Skeleton */}
      <div className="space-y-4">
        <div className="h-8 w-40 skeleton rounded-md mb-6" />
        <div className="h-32 skeleton rounded-xl" />
        <div className="space-y-4 mt-8">
          {[1, 2].map(i => (
            <div key={i} className="flex gap-4 p-4 rounded-xl" style={{ border: '1px solid var(--border)' }}>
              <div className="h-10 w-10 rounded-full skeleton shrink-0" />
              <div className="space-y-2 flex-1">
                <div className="h-4 w-32 skeleton rounded" />
                <div className="h-4 w-full skeleton rounded" />
                <div className="h-4 w-5/6 skeleton rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function NotFoundState({ error }) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center relative">
      <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center opacity-40">
        <div className="hero-orb-blue" style={{ width: 400, height: 400 }} />
      </div>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-5 p-10 rounded-3xl relative z-10"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', backdropFilter: 'blur(24px)' }}
      >
        <div className="text-6xl mb-2">🔭</div>
        <div>
          <h2 className="heading-md mb-2">Project not found</h2>
          <p className="body-md" style={{ color: 'var(--text-2)' }}>{error || 'This project may have been removed or never existed.'}</p>
        </div>
        <Link to="/" className="btn-gradient inline-flex mt-4">Browse other projects</Link>
      </motion.div>
    </div>
  )
}

export default function ProjectPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { success, error: toastError, info } = useToast()

  const [project, setProject]   = useState(null)
  const [comments, setComments] = useState([])
  const [liked, setLiked]       = useState(false)
  const [loading, setLoading]   = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [editingComment, setEditingComment] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError('')
    Promise.all([getProject(id), getComments(id)])
      .then(([proj, comms]) => {
        if (cancelled) return
        setProject(proj)
        setComments(Array.isArray(comms) ? comms : [])
      })
      .catch(() => { if (!cancelled) setError('Failed to load project.') })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [id])

  useEffect(() => {
    if (!user || !id) return
    getLikeStatus(id).then((d) => setLiked(d?.liked ?? false)).catch(() => {})
  }, [id, user])

  const handleLike = async () => {
    if (!user) { navigate('/login', { state: { from: { pathname: `/projects/${id}` } } }); return }
    const was = liked
    setLiked(!was)
    setProject((p) => ({ ...p, likes: (p.likes || 0) + (was ? -1 : 1) }))
    try {
      const data = await toggleLike(id)
      setLiked(data.liked)
      setProject((p) => ({ ...p, likes: data.likes ?? p.likes }))
      if (data.liked) info('Liked! 🎉')
    } catch {
      setLiked(was)
      setProject((p) => ({ ...p, likes: (p.likes || 0) + (was ? 1 : -1) }))
      toastError('Failed to update like.')
    }
  }

  const handleCommentSubmit = async (content) => {
    if (!user) { navigate('/login', { state: { from: { pathname: `/projects/${id}` } } }); return }
    setSubmitting(true)
    try {
      if (editingComment) {
        const updated = await updateComment(editingComment._id || editingComment.id, { content })
        setComments((p) => p.map((c) => (c._id || c.id) === (editingComment._id || editingComment.id) ? (updated ?? { ...c, content }) : c))
        setEditingComment(null)
        success('Comment updated.')
      } else {
        const created = await createComment(id, { content })
        setComments((p) => [created, ...p])
        info('Comment posted.')
      }
    } catch (err) {
      toastError(err.response?.data?.message || 'Failed to post comment.')
    } finally {
      setSubmitting(false) }
  }

  const handleEditComment = (c) => {
    setEditingComment(c)
    document.getElementById('comment-area')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleDeleteComment = async (c) => {
    if (!window.confirm('Delete this comment?')) return
    try {
      await deleteComment(c._id || c.id)
      setComments((p) => p.filter((x) => (x._id || x.id) !== (c._id || c.id)))
      success('Comment deleted.')
    } catch { toastError('Failed to delete.') }
  }

  if (loading) return <ProjectSkeleton />

  if (!project) return <NotFoundState error={error} />

  return (
    <div className="space-y-12 pb-16 page-enter max-w-5xl mx-auto w-full">
      <ProjectDetails project={project} onLike={handleLike} liked={liked} commentsCount={comments.length} />

      {/* ── Comments Section ── */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5, ease: 'easeOut' }}
        className="space-y-6"
      >
        <div className="flex items-center gap-3">
          <h2 className="heading-md">Discussion</h2>
          <span className="badge" style={{ fontSize: 13, padding: '4px 10px' }}>{comments.length}</span>
        </div>

        {/* Comment Form Area */}
        <div id="comment-area" className="scroll-mt-24">
          <AnimatePresence mode="wait">
            {user ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl p-5 shadow-sm relative overflow-hidden"
                style={{ background: 'var(--bg-card)', border: editingComment ? '1px solid var(--accent-border)' : '1px solid var(--border)', backdropFilter: 'blur(12px)' }}
              >
                {editingComment && (
                  <div className="absolute top-0 left-0 w-full h-1" style={{ background: 'linear-gradient(90deg, var(--accent), var(--violet))' }} />
                )}
                
                {editingComment && (
                  <div className="flex items-center justify-between pb-3 mb-3" style={{ borderBottom: '1px solid var(--border)' }}>
                    <div className="flex items-center gap-2 text-[13px] font-semibold" style={{ color: 'var(--accent)' }}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Z" /></svg>
                      Editing comment
                    </div>
                    <button onClick={() => setEditingComment(null)} className="btn-icon" style={{ height: 24, width: 24 }}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                )}
                <CommentForm
                  key={editingComment?._id || 'new'}
                  initialValue={editingComment?.content || ''}
                  onSubmit={handleCommentSubmit}
                  submitting={submitting}
                  isEditing={!!editingComment}
                  onCancelEdit={() => setEditingComment(null)}
                />
              </motion.div>
            ) : (
              <motion.div
                key="signin"
                className="rounded-2xl px-6 py-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 text-center sm:text-left shadow-sm"
                style={{ background: 'var(--bg-elevated)', border: '1px dashed var(--border-strong)' }}
              >
                <div>
                  <p className="text-base font-semibold" style={{ color: 'var(--text-1)' }}>Join the discussion</p>
                  <p className="caption mt-1">Sign in to leave a comment or ask a question.</p>
                </div>
                <Link to="/login" state={{ from: { pathname: `/projects/${id}` } }} className="btn-gradient inline-flex shrink-0">
                  Sign in to comment
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Comment List */}
        <div className="mt-8">
          <CommentList comments={comments} currentUser={user} onEdit={handleEditComment} onDelete={handleDeleteComment} />
        </div>
      </motion.section>
    </div>
  )
}
