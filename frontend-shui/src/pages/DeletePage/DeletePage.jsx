import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthToken } from '../../hooks/useAuthToken';
import { deleteYourOwnNote, getNoteById } from '../../api/notes';
import warningIcon from '../../assets/warning.gif';
import Header from '../../components/Header/Header';
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
        <section className="delete-note">
            <Header />
        <div className="delete-page">
            <div className="delete-page__container">
                <h2 className="delete-page__title">Delete your Note</h2>
                
                {deleteStatus === 'success' && (
                    <div className="delete-page__status delete-page__status--success">
                        <h3>The note has been deleted!</h3>
                        <p>You will be redirected automatically to the homepage.</p>
                    </div>
                )}
                
                {(deleteStatus === 'error' || error) && (
                    <div className="delete-page__status delete-page__status--error">
                        <h3>Something went wrong, Try agin later!</h3>
                        <p>{error || 'Something went wrong, Try agin later!'}</p>
                        <button onClick={handleCancel} className="delete-page__button delete-page__button--secondary">
                            Back
                        </button>
                    </div>
                )}
                
                {!deleteStatus && note && !error && (
                    <>
                        <div className="delete-page__note-preview">
                            <h3>You are about to delete:</h3>
                            <div className="delete-page__note">
                                <h4>{note.title}</h4>
                                <p>{note.content?.substring(0, 100)}...</p>
                                <small>Skapad: {new Date(note.createdAt).toLocaleDateString()}</small>
                            </div>
                        </div>
                        
                        <div className="delete-page__warning">
                            <img src={warningIcon} alt='Caution!' className='warning-icon'></img>
                            <p>Once you do this, you can’t reverse it.</p>
                        </div>
                        
                        <div className="delete-page__actions">
                            <button 
                                onClick={handleConfirmDelete} 
                                disabled={isDeleting}
                                className="delete-page__button delete-page__button--danger"
                            >
                                {isDeleting ? 'Raderar...' : 'Confirm'}
                            </button>
                            
                            <button 
                                onClick={handleCancel}
                                disabled={isDeleting}
                                className="delete-page__button delete-page__button--secondary"
                            >
                                Cancle
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
        </section>
    );
};

export default DeletePage;