import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthToken } from '../../hooks/useAuthToken';
import { deleteYourOwnNote } from '../../api/notes';

const DeleteNote = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { token } = useAuthToken();
    const [isDeleted, setIsDeleted] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState(null);

    const handleDelete = async () => {
        if (!token || !id) return;

        const confirmDelete = window.confirm('Är du säker på att du vill radera denna anteckning?');
        if (!confirmDelete) {
            navigate(-1);
            return;
        }

        try {
            setIsDeleting(true);
            await deleteYourOwnNote(token, id);
            setIsDeleted(true);
            
            // Navigera tillbaka efter 2 sekunder
            setTimeout(() => {
                navigate('/notes');
            }, 2000);
        } catch (err) {
            setError('Kunde inte radera anteckningen. Försök igen.');
            console.error('Error deleting note:', err);
        } finally {
            setIsDeleting(false);
        }
    };

    useEffect(() => {
        if (token && id) {
            handleDelete();
        }
    }, [token, id]);

    if (isDeleted) {
        return (
            <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center', 
                height: '50vh',
                textAlign: 'center'
            }}>
                <h2 style={{ color: 'green' }}>✅ Your note deleted successfully!</h2>
                <p>Redirecting to notes...</p>
            </div>
        );
    }

    if (isDeleting) {
        return (
            <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center', 
                height: '50vh'
            }}>
                <h2>Deleting note...</h2>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center', 
                height: '50vh',
                textAlign: 'center'
            }}>
                <h2 style={{ color: 'red' }}>❌ Error</h2>
                <p>{error}</p>
                <button onClick={() => navigate(-1)}>Go Back</button>
            </div>
        );
    }

    return null;
};

export default DeleteNote;