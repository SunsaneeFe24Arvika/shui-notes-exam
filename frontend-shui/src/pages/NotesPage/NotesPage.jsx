import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthToken } from '../../hooks/useAuthToken';
import { getAllNotes } from '../../api/notes';
import NoteList from '../../components/NoteList/NoteList';
import Header from '../../components/Header/Header';
import NavBar from '../../components/NavBar/NavBar';
import Search from '../../components/Search/Search';
import './notesPage.css';

const NotesPage = () => {
    const [notes, setNotes] = useState([]);              
    const [filteredNotes, setFilteredNotes] = useState([]); 
    const [date, setDate] = useState("");                
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();
    const { token } = useAuthToken();

    useEffect(() => {
        if (token) {
            fetchNotes();
        }
    }, [token]);

        // Lägg till denna useEffect för att sätta initial filteredNotes
    useEffect(() => {
        if (notes.length > 0 && filteredNotes.length === 0 && !date) {
            setFilteredNotes(notes);
        }
    }, [notes]);

    const fetchNotes = async () => {
        try {
            setLoading(true);
            const response = await getAllNotes(token);
            const allNotes = response.data?.notes || [];

            // Sortera nyast först
            allNotes.sort((a, b) => {
                const dateA = new Date(a.createdAt || a.attributes?.createdAt);
                const dateB = new Date(b.createdAt || b.attributes?.createdAt);
                return dateB - dateA;
            });

            setNotes(allNotes);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching notes:', error);
            setLoading(false);
        }
    };

    const handleNoteSelect = (noteId) => {
        navigate(`/notes/${noteId}`);
    };

    return (
        <section className="noteslist-page">
            <Header />
            <NavBar />
            <h1 className="page-title">All Notes</h1>

            <Search
                date={date}
                setDate={setDate}
                notes={notes}
                setFilteredNotes={setFilteredNotes}
            />

            <div className="notes-container">
                {loading ? (
                    <p>Loading notes...</p>
                ) : (
                    <NoteList
                    notes={date ? filteredNotes : notes}
                    onNoteSelect={handleNoteSelect}
                />
                )}
            </div>
        </section>
    );
};

export default NotesPage;
