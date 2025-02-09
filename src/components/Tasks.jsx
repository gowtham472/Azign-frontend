import { useMemo } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

export default function Tasks({ tasks = [], toggleShowAll, showAll }) {
    // Cache filtered tasks to optimize rendering
    const taskList = useMemo(() => tasks.filter(t => t.SpCode && t.taskId), [tasks]);

    const getStatusClass = (status) => ({
        "In Progress": "status-in-progress",
        "Completed": "status-completed",
        "To Do": "status-to-do",
        "Pending": "status-pending",
    }[status] || "status-inactive");

    return (
        <div className="container">
            <h1>Your Tasks</h1>
            {taskList.length > 0 ? (
                <div>
                    {taskList.map((task) => (
                        <Link to={`/space/${task.SpCode}/tasks/${task.taskId}`} key={task._id}>
                            <li>
                                <h2>{task.taskId}</h2>
                                <p className={getStatusClass(task.status)}>
                                    {task.status}
                                </p>
                                <p className="deadline">
                                    <strong>Deadline:</strong> {task.deadline ? new Date(task.deadline).toLocaleDateString() : "No deadline"}
                                </p>
                            </li>
                        </Link>
                    ))}
                </div>
            ) : (
                <p>No tasks available.</p>
            )}
            <button className="view-all-btn" onClick={toggleShowAll}>
                {showAll ? "Show Less ←" : "View all →"}
            </button>
        </div>
    );
}

// Define PropTypes outside the component for performance optimization
Tasks.propTypes = {
    tasks: PropTypes.arrayOf(
        PropTypes.shape({
            _id: PropTypes.string.isRequired,
            taskId: PropTypes.string.isRequired,
            status: PropTypes.string.isRequired,
            deadline: PropTypes.string, // Can be optional, so no `.isRequired`
            SpCode: PropTypes.string.isRequired,
        })
    ),
    toggleShowAll: PropTypes.func.isRequired,
    showAll: PropTypes.bool.isRequired,
};
