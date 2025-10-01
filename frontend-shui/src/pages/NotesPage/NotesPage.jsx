import { useState, useEffect } from 'react';
//import { useParams, useNavigate } from 'react-router-dom';
import { getAllNotes } from '../../api/notes'; 
import './notesPage.css';

const NotesPage = () => {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    useEffect(() => {
        const fetchNotes = async () => {
            try {
                setLoading(true);
                const result = await getAllNotes(); // Anropa som funktion
                setNotes(result.data || []);
            } catch (err) {
                setError('Failed to fetch notes');
            } finally {
                setLoading(false);
            }
        };
        
        fetchNotes();
    }, []);
    
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    
    return (
        <section className='noteslist-page'>
            <h1 className='page-title'>NOTES</h1>
            <div className='notes-container'>
                {notes.map(note => (
                    <div key={note.id} className='note-item'>
                        <h3>{note.title}</h3>
                        <p>{note.content}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default NotesPage;