import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getProject } from '../api/projectApi.js'
import { getComments, createComment, updateComment, deleteComment } from '../api/commentApi.js'
import { toggleLike, getLikeStatus } from '../api/likeApi.js'
import ProjectDetails from '../components/project/ProjectDetails.jsx'
import CommentForm from '../components/comments/CommentForm.jsx'
import CommentList from '../components/comments/CommentList.jsx'
import useAuth from '../hooks/useAuth.js'

export default function ProjectPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [project, setProject] = useState(null)
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [editingComment, setEditingComment] = useState(null)
  const [liked, setLiked] = useState(false)

  // Load project + comments once when ID changes
  useEffect(() => {
    let cancelled = false

    const loadDetails = async () => {
      setLoading(true)
      setError('')
      try {
        const [projectData, commentData] = await Promise.all([
          getProject(id),
          getComments(id),
        ])
        if (cancelled) return
        setProject(projectData)
        setComments(Array.isArray(commentData) ? commentData : [])
      } catch {
        if (!cancelled) setError('Unable to load the project details.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadDetails()
    return () => { cancelled = true }
  }, [id])

  // Separately fetch like status once user is known
  useEffect(() => {
    if (!user || !id) return
    getLikeStatus(id)
      .then((data) => setLiked(data?.liked ?? false))
      .catch(() => {}) // non-critical
  }, [id, user])

  const handleLike = async () => {
    if (!user) {
      navigate('/login', { state: { from: { pathname: `/projects/${id}` } } })
      return
    }
    // Optimistic update
    const wasLiked = liked
    setLiked(!wasLiked)
    setProject((prev) => ({
      ...prev,
      likes: (prev.likes ?? 0) + (wasLiked ? -1 : 1),
    }))
    try {
      const data = await toggleLike(id)
      // Sync with server truth
      setLiked(data.liked)
      setProject((prev) => ({ ...prev, likes: data.likes ?? prev.likes }))
    } catch {
      // Revert on error
      setLiked(wasLiked)
      setProject((prev) => ({
        ...prev,
        likes: (prev.likes ?? 0) + (wasLiked ? 1 : -1),
      }))
      setError('Unable to update like status.')
    }
  }

  const handleCommentSubmit = async (content) => {
    if (!user) {
      navigate('/login', { state: { from: { pathname: `/projects/${id}` } } })
      return
    }
    setSubmitting(true)
    try {
      if (editingComment) {
        const updated = await updateComment(editingComment._id || editingComment.id, { content })
        setComments((prev) =>
          prev.map((item) =>
            item._id === editingComment._id ? updated ?? { ...item, content } : item
          )
        )
        setEditingComment(null)
      } else {
        const created = await createComment(id, { content })
        setComments((prev) => [created, ...prev])
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to submit your comment.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleEditComment = (comment) => {
    setEditingComment(comment)
    // Scroll to comment form
    document.getElementById('comment-form-area')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleCancelEdit = () => setEditingComment(null)

  const handleDeleteComment = async (comment) => {
    if (!window.confirm('Delete this comment?')) return
    try {
      await deleteComment(comment._id || comment.id)
      setComments((prev) =>
        prev.filter((item) => item._id !== comment._id && item.id !== comment.id)
      )
    } catch {
      setError('Unable to delete the comment.')
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="surface-card h-96 animate-pulse rounded-[40px]" />
        <div className="surface-card h-48 animate-pulse rounded-[32px]" />
      </div>
    )
  }

  if (!project) {
    return (
      <div className="glass-card rounded-[32px] p-8 text-center" style={{ color: 'var(--text-secondary)' }}>
        Project not found.
      </div>
    )
  }

  return (
    <div className="space-y-10">
      {error && (
        <div className="rounded-2xl border border-rose-400/30 bg-rose-400/10 p-4 text-sm text-rose-500">
          {error}
        </div>
      )}

      <ProjectDetails
        project={project}
        onLike={handleLike}
        liked={liked}
        commentsCount={comments.length}
      />

      <div className="space-y-6">
        {/* Comment heading */}
        <div>
          <h2 className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>
            Comments ({comments.length})
          </h2>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            Leave feedback or respond to the student.
          </p>
        </div>

        {/* Comment form */}
        <div id="comment-form-area">
          <CommentForm
            key={editingComment?._id || 'new'}
            initialValue={editingComment?.content || ''}
            onSubmit={handleCommentSubmit}
            submitting={submitting}
            placeholder={editingComment ? 'Edit your comment…' : 'Write a comment…'}
            isEditing={!!editingComment}
            onCancelEdit={handleCancelEdit}
          />
        </div>

        {/* Comment list */}
        <CommentList
          comments={comments}
          currentUser={user}
          onEdit={handleEditComment}
          onDelete={handleDeleteComment}
        />
      </div>
    </div>
  )
}
