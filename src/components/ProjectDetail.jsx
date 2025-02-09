import { useParams, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useSpace } from '../contexts/SpaceContext'; // Assuming you have an AuthContext for user info
import axios from 'axios';

function ProjectDetail({ projects }) {
    const { projectCode, SpCode } = useParams();
    const { user } = useSpace();
    const project = projects.find(p => p.projectCode === projectCode);

    if (!project) return <div>Project not found!</div>;

    // Function to check if the comment is within the allowed delete time (e.g., 5 minutes)
    const canDeleteComment = (commentDate) => {
        const commentTime = new Date(commentDate).getTime();
        const currentTime = new Date().getTime();
        const timeDifference = currentTime - commentTime;
        const allowedDeleteTime = 5 * 60 * 1000; // 5 minutes in milliseconds
        return timeDifference <= allowedDeleteTime;
    };

    // Function to delete the comment
    const handleDelete = async (commentId) => {
        try {
            // Assuming the API endpoint for deleting comments is like this:
            const response = await axios.delete(`/api/space/${SpCode}/projects/${projectCode}/comments/delete/${commentId}`);
            
            if (response.status === 200) {
                // Remove the comment from the local state after successful deletion
                project.comments.filter((comment) => comment._id !== commentId);
                // Update the project state with the new comments list (optional)
                console.log('Comment deleted successfully');
                // Optionally, you can trigger a state update here to re-render
            } else {
                console.log('Failed to delete the comment');
            }
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    };

    return (
        <div className="container">
            <h2>{project.name}</h2>
            <p><strong>Description:</strong> {project.description}</p>
            <p><strong>Lead:</strong> {project.teamLead}</p>
            <p><strong>Members:</strong> {project.members.join(', ')}</p>
            <Link to={`/space/${SpCode}/projects/${projectCode}/update`} style={{ textDecoration: "none" }}>
                <button className="update-project-btn">Update Project</button>
            </Link>
            <div style={{ marginTop: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3>Comments</h3>
                <Link to={`/space/${SpCode}/projects/${projectCode}/comments`} style={{ textDecoration: "none" }}>
                    <button className="comment-btn">Create Comment</button>
                </Link>
            </div>

            <div>
                {project.comments.map((comment) => (
                    <li key={comment._id}>
                        <p>{comment.comment}</p>
                        <p><small>{new Date(comment.date).toLocaleDateString()}</small>
                            <small><strong> {new Date(comment.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong></small>
                        </p>
                    </li>
                ))}
            </div>
        </div>
    );
}

ProjectDetail.propTypes = {
    projects: PropTypes.arrayOf(PropTypes.shape({
        projectCode: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        teamLead: PropTypes.string.isRequired,
        members: PropTypes.arrayOf(PropTypes.string).isRequired,
        comments: PropTypes.arrayOf(PropTypes.shape({
            _id: PropTypes.string.isRequired,
            comment: PropTypes.string.isRequired,
            date: PropTypes.string.isRequired,  // Comment creation timestamp
        })).isRequired
    })).isRequired
};

export default ProjectDetail;
