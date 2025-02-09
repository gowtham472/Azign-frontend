import { useMemo } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

export default function Projects({ projects = [], toggleShowAll, showAll }) {
    const projectList = useMemo(() => projects.filter(p => p.SpCode && p.projectCode), [projects]);

    const getStatusClass = (status) => ({
        "Not Started": "status-not-started",
        "In Progress": "status-in-progress",
        "Completed": "status-completed",
        "On Hold": "status-on-hold",
        "Cancelled": "status-cancelled",
        "Active": "status-active",
        "Inactive": "status-inactive",
    }[status] || "status-unknown");

    return (
        <div className="container">
            <h1>Your Projects</h1>
            {projectList.length > 0 ? (
                <div>
                    {projectList.map((project) => (
                        <Link to={`/space/${project.SpCode}/projects/${project.projectCode}`} key={project._id}>
                            <li>
                                <h2>{project.name}</h2>
                                <p>{project.teamLead}</p>
                                <p className={getStatusClass(project.status)}>
                                    {project.status}
                                </p>
                            </li>
                        </Link>
                    ))}
                </div>
            ) : (
                <p>No projects available.</p>
            )}
            <button className="view-all-btn" onClick={toggleShowAll}>
                {showAll ? "Show Less ←" : "View all →"}
            </button>
        </div>
    );
}

Projects.propTypes = {
    projects: PropTypes.arrayOf(PropTypes.shape({
        _id: PropTypes.string.isRequired,
        projectCode: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        teamLead: PropTypes.string.isRequired,
        status: PropTypes.string.isRequired,
        SpCode: PropTypes.string.isRequired
    })),
    toggleShowAll: PropTypes.func.isRequired,
    showAll: PropTypes.bool.isRequired,
};
