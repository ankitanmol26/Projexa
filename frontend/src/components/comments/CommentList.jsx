import EmptyState from '../common/EmptyState.jsx'
import CommentCard from './CommentCard.jsx'

export default function CommentList({ comments, currentUser, onEdit, onDelete }) {
  if (!comments || comments.length === 0) {
    return <EmptyState title="No comments yet" description="Be the first to leave feedback on this project." />
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <CommentCard key={comment._id || comment.id} comment={comment} currentUser={currentUser} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  )
}
