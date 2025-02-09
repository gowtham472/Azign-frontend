import { useParams, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import '../App.css';

function TaskDetail({ tasks }) {
    const { taskId, SpCode } = useParams();
    const task = tasks.find(t => t.taskId === taskId);

    if (!task) return <div>Task not found!</div>;

    return (
        <div className='container'>
            <h2>{task.title}</h2>
            <p><strong>Description:</strong> {task.description}</p>
            <p><strong>Assigned To:</strong> {task.assignedTo}</p>
            <p><strong>Assigned By:</strong> {task.assignedBy}</p>
            <p><strong>Status:</strong> {task.status}</p>
            <p><strong>Deadline:</strong> {new Date(task.deadline).toLocaleDateString([], { year: '2-digit', month: '2-digit', day: '2-digit' })}</p>
            <Link to={`/space/${SpCode}/tasks/${taskId}/update`} style={{ textDecoration: "none" }}>
                <button className="update-task-btn">Update Task</button>
            </Link>
            <div style={{ marginTop: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3>Comments</h3>
                <Link to={`/space/${SpCode}/tasks/${taskId}/comments`} style={{ textDecoration: "none" }}>
                    <button className="comment-btn">Create Comment</button>
                </Link>
            </div>
            
            <div>
                {task.comments && task.comments.length > 0 ? (
                    task.comments.map((comment) => (
                        <li key={comment.commentId}>
                            <p><strong>{comment.author}</strong><br /> </p>
                            <p><small>{new Date(task.deadline).toLocaleDateString([], { year: '2-digit', month: '2-digit', day: '2-digit' })}  <strong>{new Date(comment.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong></small></p>
                            <p>{comment.text}</p>
                        </li>
                    ))
                ) : (
                    <p>No comments available.</p>
                )}
            </div>
        </div>
    );
}
TaskDetail.propTypes = {
    tasks: PropTypes.arrayOf(
        PropTypes.shape({
            taskId: PropTypes.string.isRequired,
            title: PropTypes.string.isRequired,
            description: PropTypes.string.isRequired,
            assignedTo: PropTypes.string.isRequired,
            assignedBy: PropTypes.string.isRequired,
            status: PropTypes.string.isRequired,
            deadline: PropTypes.string.isRequired,
        })
    ).isRequired,
};

export default TaskDetail;