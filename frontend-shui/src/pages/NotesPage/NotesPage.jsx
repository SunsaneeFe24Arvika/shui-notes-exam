import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NoteList from '../../components/NoteList/NoteList';
import './notesPage.css';
import Header from '../../components/Header/Header';
import NavBar from '../../components/NavBar/NavBar';

const NotesPage = () => {
    const [notes, setNotes] = useState([]);
    const navigate = useNavigate();

    const handleNoteSelect = (noteId) => {
        navigate(`/notes/${noteId}`);
    };

    const handleRefreshNotes = (updatedNotes) => {
        setNotes(updatedNotes);
    };

    return (
        <section className="noteslist-page">
            <Header />
            <NavBar />
            
            <h1 className="page-title">All Notes</h1>

            <div className="notes-container">
                <NoteList 
                    onNoteSelect={handleNoteSelect}
                    onRefresh={handleRefreshNotes}
                />
            </div>
        </section>
    );
};

export default NotesPage;