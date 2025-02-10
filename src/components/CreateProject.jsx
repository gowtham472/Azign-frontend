import { useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';


export default function CreateProject() {
    const [projectCode, setProjectCode] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [teamLead, setTeamLead] = useState('');
    const [members, setMembers] = useState('');
    const [status, setStatus] = useState('In Progress');
    const { SpCode } = useParams();
    const navigate = useNavigate();
    const BASE_URL = "https://azign-backend.onrender.com";
    const handleSubmit = async (e) => {
        e.preventDefault();
        const project = {
            SpCode,
            projectCode,
            name,
            status,
            description,
            teamLead,
            members: members.split(',').map(member => member.trim()),
            
        };

        try {
            await axios.post(`${BASE_URL}/api/space/${SpCode}/projects/create`, project);
            navigate(`/space/${SpCode}`);
        } catch (error) {
            console.error('Error creating project:', error);
        }
    };

    return (
        <div>
            <h1>Create Project</h1>
            <div className="form-container">
                <form onSubmit={handleSubmit}>
                    <label>Project Code:</label>
                    <input type="text" value={projectCode} onChange={(e) => setProjectCode(e.target.value)} required />
                    <label>Name:</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                    <label>Description:</label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
                    <label>Team Lead:</label>
                    <input type="text" value={teamLead} onChange={(e) => setTeamLead(e.target.value)} required />
                    <label>Members (comma separated):</label>
                    <input type="text" value={members} onChange={(e) => setMembers(e.target.value)} />
                    <label>Status:</label>
                    <select value={status} onChange={(e) => setStatus(e.target.value)} required>
                        <option value="">Select Status</option>
                        <option value="Not Started">Not Started</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                        <option value="On Hold">On Hold</option>
                    </select>
                    <button type="submit">Create Project</button>
                </form>
            </div>
        </div>
    );
}