import { useParams, Link } from 'react-router-dom';
import PropTypes from 'prop-types';

function ProjectDetail({ projects }) {
    const { projectCode, SpCode } = useParams();
    const project = projects.find(p => p.projectCode === projectCode);

    if (!project) return <div>Project not found!</div>;

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
