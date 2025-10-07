import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NoteList from '../../components/NoteList/NoteList';
import { useAuthToken } from '../../hooks/useAuthToken';
import { getAllNotes } from '../../api/notes';
import './notesPage.css';
import Footer from '../../components/Footer/Footer';
import Header from '../../components/Header/Header';
import NavBar from '../../components/NavBar/NavBar';

const NotesPage = () => {
    const [notes, setNotes] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { token } = useAuthToken();
    const navigate = useNavigate();

    useEffect(() => {
        if (token) {
            fetchNotes(); // Hämta anteckningar
            
        }
    }, [token]);

    const fetchNotes = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await getAllNotes(token);
            
            if (response.status === 200) {
                setNotes(response.data.notes || []);
            } else {
                setError('Failed to fetch notes');
            }
        } catch (err) {
            console.error('Error fetching notes:', err);
            setError('An error occurred while fetching notes');
        } finally {
            setLoading(false);
        }
    };


    const handleNoteSelect = (noteId) => {
        navigate(`/notes/${noteId}`);
    };

    const handleRefreshNotes = () => {
        fetchNotes();
    };

    if (loading) return <div className="loading">Loading notes...</div>;
    
    return (
        <section className='noteslist-page'>
            <Header />
            <NavBar />
            <h1 className='page-title'>NOTE</h1>
            
            {error && (
                <div className="error-message">
                    {error}
                    <button onClick={handleRefreshNotes} className="retry-btn">
                        Try Again
                    </button>
                </div>
            )}
            
            <div className='notes-container'>
                <NoteList 
                    notes={notes} 
                    onNoteSelect={handleNoteSelect}
                    onRefresh={handleRefreshNotes}
                />
            </div>
            
            
        </section>
    );
};

export default NotesPage;