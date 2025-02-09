import { useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import '../App.css';

export default function CreateTask() {
    const [taskId, setTaskId] = useState('');
    const [projectId, setProjectId] = useState('');
    const [title, setTitle] = useState('');
    const [status, setStatus] = useState('To Do');
    const [assignedTo, setAssignedTo] = useState('');
    const [priority, setPriority] = useState('Low');
    const [assignedBy, setAssignedBy] = useState('');
    const [description, setDescription] = useState('');
    const [deadline, setDeadline] = useState('');
    const { SpCode } = useParams();
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const formattedDeadline = new Date(deadline).toISOString(); // Ensure valid date format
    
        const task = {
            SpCode,
            taskId,
            projectId,
            title,
            status,
            assignedTo,
            priority,
            assignedBy,
            description,
            deadline: formattedDeadline
        };
    
        try {
            const response = await axios.post(`/api/space/${SpCode}/tasks/create`, task);
            console.log("Response:", response.data);
            navigate(`/space/${SpCode}`);
        } catch (error) {
            console.error("Error creating task:", error.response?.data || error.message);
            alert(`Error creating task: ${error.response?.data?.error || error.message}`);
        }
    };
    

    return (
        <div>
            <h1>Create Task</h1>
            <div className="form-container">
                <form onSubmit={handleSubmit}>
                    <label>Task ID:</label>
                    <input type="text" value={taskId} onChange={(e) => setTaskId(e.target.value)} required />
                    <label>Project ID:</label>
                    <input type="text" value={projectId} onChange={(e) => setProjectId(e.target.value)} required />
                    <label>Title:</label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
                    <label>Status:</label>
                    <select value={status} onChange={(e) => setStatus(e.target.value)} required>
                        <option value="To Do">To Do</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                        <option value="Pending">Pending</option>
                    </select>
                    <label>Assigned To:</label>
                    <input type="text" value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} required />
                    <label>Priority:</label>
                    <select value={priority} onChange={(e) => setPriority(e.target.value)} required>
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                    </select>
                    <label>Assigned By:</label>
                    <input type="text" value={assignedBy} onChange={(e) => setAssignedBy(e.target.value)} required />
                    <label>Description:</label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
                    <label>Deadline:</label>
                    <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} required />
                    <button type="submit">Create Task</button>
                </form>
            </div>
        </div>
    );
}