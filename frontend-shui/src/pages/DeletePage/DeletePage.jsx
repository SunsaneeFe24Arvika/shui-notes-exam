import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthToken } from '../../hooks/useAuthToken';
import { deleteYourOwnNote, getNoteById } from '../../api/notes';
import './deletePage.css';

const DeletePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { token } = useAuthToken();
    const [note, setNote] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteStatus, setDeleteStatus] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchNote = async () => {
            try {
                const result = await getNoteById(id, token);
                if (result.success) {
                    setNote(result.data.note || result.data);
                } else {
                    setError(result.message);
                }
            } catch (error) {
                console.error('Error fetching note:', error);
                setError('Failed to load note');
            }
        };

        if (token && id) {
            fetchNote();
        }
    }, [token, id]);

    const handleConfirmDelete = async () => {
        setIsDeleting(true);
        setError(null);
        
        try {
            const result = await deleteYourOwnNote(id, token);
            
            if (result.success) {
                setDeleteStatus('success');
                // Vänta 2 sekunder innan navigering
                setTimeout(() => {
                    navigate('/notes');
                }, 2000);
            } else {
                setDeleteStatus('error');
                setError(result.message);
                setIsDeleting(false);
            }
            
        } catch (error) {
            console.error('Error deleting note:', error);
            setDeleteStatus('error');
            setError('Failed to delete note');
            setIsDeleting(false);
        }
    };

    const handleCancel = () => {
        navigate(-1);
    };

    if (!note && !deleteStatus && !error) {
        return <div className="delete-page__loading">Laddar...</div>;
    }

    return (
        <div className="delete-page">
            <div className="delete-page__container">
                <h2 className="delete-page__title">Radera anteckning</h2>
                
                {deleteStatus === 'success' && (
                    <div className="delete-page__status delete-page__status--success">
                        <h3>✅ Anteckningen har raderats!</h3>
                        <p>Du kommer att omdirigeras automatiskt...</p>
                    </div>
                )}
                
                {(deleteStatus === 'error' || error) && (
                    <div className="delete-page__status delete-page__status--error">
                        <h3>❌ Fel vid radering</h3>
                        <p>{error || 'Kunde inte radera anteckningen. Försök igen.'}</p>
                        <button onClick={handleCancel} className="delete-page__button delete-page__button--secondary">
                            Tillbaka
                        </button>
                    </div>
                )}
                
                {!deleteStatus && note && !error && (
                    <>
                        <div className="delete-page__note-preview">
                            <h3>Du är på väg att radera:</h3>
                            <div className="delete-page__note">
                                <h4>{note.title}</h4>
                                <p>{note.content?.substring(0, 100)}...</p>
                                <small>Skapad: {new Date(note.createdAt).toLocaleDateString()}</small>
                            </div>
                        </div>
                        
                        <div className="delete-page__warning">
                            <p>⚠️ Den här åtgärden kan inte ångras!</p>
                        </div>
                        
                        <div className="delete-page__actions">
                            <button 
                                onClick={handleConfirmDelete} 
                                disabled={isDeleting}
                                className="delete-page__button delete-page__button--danger"
                            >
                                {isDeleting ? 'Raderar...' : 'Ja, radera anteckningen'}
                            </button>
                            
                            <button 
                                onClick={handleCancel}
                                disabled={isDeleting}
                                className="delete-page__button delete-page__button--secondary"
                            >
                                Avbryt
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default DeletePage;