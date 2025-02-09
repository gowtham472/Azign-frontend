import { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import '../App.css';
import { useSpace } from '../contexts/SpaceContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function TaskComment() {
    const { userName } = useSpace();
    const [text, setText] = useState('');
    const { SpCode, taskId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const BASE_URL = "https://azign-backend.onrender.com";

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const comment = {
            author: userName,
            text
        };

        try {
            await axios.post(`${BASE_URL}/api/space/${SpCode}/tasks/${taskId}/comments`, comment);
            toast.success('Comment added successfully!');
            navigate(`/space/${SpCode}/tasks/${taskId}`);
        } catch (error) {
            console.error('Error adding comment to task:', error);
            toast.error('Error adding comment to task!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>Add Comment to Task</h1>
            <div className="form-container">
                <form onSubmit={handleSubmit}>
                    <label>Author:</label>
                    <input type="text" value={userName} readOnly /> {/* Read-only author */}
                    <label>Comment:</label>
                    <textarea value={text} onChange={(e) => setText(e.target.value)} required />
                    <button type="submit" disabled={loading}>
                        {loading ? 'Submitting...' : 'Add Comment'}
                    </button>
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
