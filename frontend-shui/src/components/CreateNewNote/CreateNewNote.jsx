import { useState } from 'react'
import { useAuthToken } from '../../hooks/useAuthToken';
import { createNote } from "../../api/notes";
import './createNewNote.css';

const CreateNewNote = ({ onNoteCreated }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { token } = useAuthToken();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!title.trim() || !content.trim()) {
            setError('Both title and content are required');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const noteData = {
                title: title.trim(),
                content: content.trim()
            };

            const response = await createNote(noteData, token);
            
            if (response.success) {
                // Reset form
                setTitle('');
                setContent('');
                
                // Callback to parent component
                if (onNoteCreated) {
                    onNoteCreated(response.data); // Skicka med den skapade noten
                }
            } else {
                // Hantera när response.success är false
                setError(response.message || 'Failed to create note');
            }
        } catch (err) {
            setError('Failed to create note. Please try again.');
            console.error('Error creating note:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="create-note">
            <h2 className="create-note__title">Share what is in your mind!</h2>
            
            {error && <div className="create-note__error">{error}</div>}
            
            <form onSubmit={handleSubmit} className="create-note__form">
                <div className="create-note__field">
                    <label htmlFor="title" className="create-note__label">Title:</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="create-note__input"
                        placeholder="Enter note title"
                        disabled={loading}
                        required
                    />
                </div>

                <div className="create-note__field">
                    <label htmlFor="content" className="create-note__label">Content:</label>
                    <textarea
                        id="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="create-note__textarea"
                        placeholder="Enter note content"
                        disabled={loading}
                        required
                    />
                </div>

                <button 
                    type="submit" 
                    className="create-note__submit"
                    disabled={loading}
                >
                    {loading ? 'Creating...' : 'Create Note'}
                </button>
            </form>
        </div>
    );
};

export default CreateNewNote;

