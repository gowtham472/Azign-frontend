import { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import '../App.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ProjectComment() {
    const [comment, setComment] = useState('');
    const { SpCode, projectCode } = useParams();
    const navigate = useNavigate();
    const BASE_URL = "https://azign-backend.onrender.com";
    const handleSubmit = async (e) => {
        e.preventDefault();
        const newComment = { comment };

        try {
            await axios.post(`${BASE_URL}/api/space/${SpCode}/projects/${projectCode}/comments`, newComment);
            toast.success('Comment added successfully!');  // Success notification
            navigate(`/space/${SpCode}/projects/${projectCode}`);
        } catch (error) {
            console.error('Error adding comment to project:', error);
            toast.error('Error adding comment to project!');  // Error notification
        }
    };

    return (
        <div>
            <h1>Add Comment to Project</h1>
            <div className="form-container">
                <form onSubmit={handleSubmit}>
                    <label>Comment:</label>
                    <textarea 
                        value={comment} 
                        onChange={(e) => setComment(e.target.value)} 
                        required 
                    />
                    <button type="submit">Add Comment</button>
                </form>
            </div>
            <ToastContainer 
                position="top-right" // Position of the notifications
                autoClose={5000} // Duration the notification will stay on screen
                hideProgressBar={false} // Show or hide the progress bar
                newestOnTop={false} // Whether to display the latest notification on top
                closeOnClick // Close the toast on click
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </div>
    );
}
