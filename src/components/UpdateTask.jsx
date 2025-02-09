import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

export default function UpdateTask() {
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [priority, setPriority] = useState("");
  const [assignedBy, setAssignedBy] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const { SpCode, taskId } = useParams();
  const navigate = useNavigate();
  const BASE_URL = "https://azign-backend.onrender.com";

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/space/${SpCode}/tasks/${taskId}`);
        const task = response.data;
        setTitle(task.title);
        setStatus(task.status);
        setAssignedTo(task.assignedTo);
        setPriority(task.priority);
        setAssignedBy(task.assignedBy);
        setDescription(task.description);
        setDeadline(task.deadline.split("T")[0]);
      } catch (error) {
        console.error("Error fetching task:", error);
      }
    };
    fetchTask();
  }, [SpCode, taskId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedTask = {
      title,
      status,
      assignedTo,
      priority,
      assignedBy,
      description,
      deadline,
    };

    try {
      await axios.put(
        `/api/space/${SpCode}/tasks/${taskId}/update`,
        updatedTask
      );
      navigate(`/space/${SpCode}`);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  return (
    <div>
      <h1>Update Task</h1>
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <label>Status:</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)} required>
                        <option value="To Do">To Do</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                        <option value="Pending">Pending</option>
            </select>
          <label>Assigned To:</label>
          <input
            type="text"
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
            required
          />
          <label>Priority:</label>
          <select value={priority} onChange={(e) => setPriority(e.target.value)} required>
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                    </select>
          <label>Assigned By:</label>
          <input
            type="text"
            value={assignedBy}
            onChange={(e) => setAssignedBy(e.target.value)}
            required
          />
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <label>Deadline:</label>
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            required
          />
          <button type="submit">Update Task</button>
        </form>
      </div>
    </div>
  );
}
