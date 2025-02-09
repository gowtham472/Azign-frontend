import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

export default function UpdateProject() {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [teamLead, setTeamLead] = useState('');
    const [members, setMembers] = useState('');
    const [status, setStatus] = useState('In Progress');
    const { SpCode, projectCode } = useParams();
    const navigate = useNavigate();
    const BASE_URL = "https://azign-backend.onrender.com";

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/api/space/${SpCode}/projects/${projectCode}`);
                const project = response.data;
                setName(project.name);
                setDescription(project.description);
                setTeamLead(project.teamLead);
                setMembers(project.members.join(', '));
            } catch (error) {
                console.error('Error fetching project:', error);
            }
        };
        fetchProject();
    }, [SpCode, projectCode]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const updatedProject = {
            name,
            description,
            teamLead,
            status,
            members: members.split(',').map(member => member.trim())
        };

        try {
            await axios.put(`${BASE_URL}/api/space/${SpCode}/projects/${projectCode}/update`, updatedProject);
            navigate(`/space/${SpCode}`);
        } catch (error) {
            console.error('Error updating project:', error);
        }
    };

    return (
        <div>
            <h1>Update Project</h1>
            <div className="form-container">
                <form onSubmit={handleSubmit}>
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
                        <option value="Not Started">Not Started</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                        <option value="On Hold">On Hold</option>
                    </select>
                    <button type="submit">Update Project</button>
                </form>
            </div>
        </div>
    );
}