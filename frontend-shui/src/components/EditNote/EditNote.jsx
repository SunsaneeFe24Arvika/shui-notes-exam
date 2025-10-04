import { useState, useEffect } from 'react';
import { useAuthToken } from '../../hooks/useAuthToken';
import { editYourOwnNote, getNoteById } from '../../api/notes'; 
import './editNote.css';

const EditNote = ({ noteId, onNoteUpdated, onCancel }) => {
    const [note, setNote] = useState(null);
    const [editedNote, setEditedNote] = useState({
        title: '',
        content: ''
    });
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [error, setError] = useState('');
    const { token } = useAuthToken();

    // Hämta anteckningen baserat på noteId
    // ...existing code...
    // Hämta anteckningen baserat på noteId
    useEffect(() => {
        const fetchNote = async () => {
            if (!noteId || !token) {
                console.log('Missing noteId or token:', { noteId, token: !!token });
                setFetchLoading(false);
                return;
            }
            
            console.log('Fetching note with ID:', noteId);
            setFetchLoading(true);
            setError('');
            
            try {
                const fetchedNote = await getNoteById(noteId, token);
                console.log('Fetched note:', fetchedNote);
                setNote(fetchedNote);
                setEditedNote({
                    title: fetchedNote.title || '',
                    content: fetchedNote.content || ''
                });
            } catch (err) {
                console.error('Fetch note error:', err);
                setError(`Failed to load note: ${err.message}`);
            } finally {
                setFetchLoading(false);
            }
        };

        fetchNote();
    }, [noteId, token]);

    

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!editedNote.title.trim() || !editedNote.content.trim()) {
            setError('Title and content are required');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await editYourOwnNote(noteId, editedNote, token);
            if (response.status === 200) {
                onNoteUpdated?.({ ...note, ...editedNote });
            } else {
                setError('Failed to update note');
            }
        } catch (err) {
            console.error('Update error:', err);
            setError('Something went wrong.');
        } finally {
            setLoading(false);
        }
    };

    if (fetchLoading) {
        return <div className="edit-note loading">Loading note...</div>;
    }

    if (!note) {
        return <div className="edit-note error">Note not found</div>;
    }

    return (
        <div className="edit-note">
            <div className="edit-header">
                <h2>Edit Note</h2>
            </div>

            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit} className="edit-form">
                <div className="form-field">
                    <label htmlFor="edit-title">Title:</label>
                    <input
                        type="text"
                        id="edit-title"
                        value={editedNote.title}
                        onChange={(e) => setEditedNote({ ...editedNote, title: e.target.value })}
                        className="edit-input"
                        disabled={loading}
                        required
                    />
                </div>

                <div className="form-field">
                    <label htmlFor="edit-content">Content:</label>
                    <textarea
                        id="edit-content"
                        value={editedNote.content}
                        onChange={(e) => setEditedNote({ ...editedNote, content: e.target.value })}
                        className="edit-textarea"
                        rows="6"
                        disabled={loading}
                        required
                    />
                </div>

                <div className="edit-actions">
                    <button type="submit" className="save-btn" disabled={loading}>
                        {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                    {onCancel && (
                        <button type="button" onClick={onCancel} className="cancel-btn" disabled={loading}>
                            Cancel
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default EditNote;