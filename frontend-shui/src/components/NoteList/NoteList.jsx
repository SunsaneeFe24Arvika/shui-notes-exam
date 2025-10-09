import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useAuthToken } from '../../hooks/useAuthToken';
import './noteList.css';
import { getAllNotes } from '../../api/notes';

const NoteList = ({ type, notes: propNotes, onNoteSelect, onRefresh, username, date }) => {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const { token } = useAuthToken();
    const navigate = useNavigate();
    const currentUser = useAuthToken(state => state.user);

    useEffect(() => {
        if (propNotes) {
            // Om notes skickas som props, använd dem direkt
            setNotes(propNotes);
            setLoading(false);
        } else if (token) {
            fetchNotes();
        }
    }, [token, propNotes, username, date]);

    const fetchNotes = async () => {
        try {
            setLoading(true);
            const response = await getAllNotes(token);
            let allNotes = response.data?.notes || [];

            // Filtrera baserat på username om det finns
            if (username) {
                allNotes = allNotes.filter(note => 
                    note.PK === `USER#${username}` || note.username === username
                );
            }

            // Filtrera baserat på datum om det finns
            if (date) {
                allNotes = allNotes.filter(note => 
                    note.createdAt?.startsWith(date) || 
                    note.attributes?.createdAt?.startsWith(date)
                );
            }

            // Sortera efter datum (nyast först)
            allNotes.sort((a, b) => {
                const dateA = new Date(a.createdAt || a.attributes?.createdAt);
                const dateB = new Date(b.createdAt || b.attributes?.createdAt);
                return dateB - dateA;
            });

            setNotes(allNotes);
            setLoading(false);

            // Anropa onRefresh callback om den finns
            if (onRefresh) {
                onRefresh(allNotes);
            }
        } catch (error) {
            console.error('Error fetching notes:', error);
            setLoading(false);
        }
    };

    // Exponera refresh-funktionen
    const refreshNotes = () => {
        if (token) {
            fetchNotes();
        }
    };

    // Handler funktion för att navigera till note details
    const handleNoteClick = (noteId) => {
        console.log('Navigating to note:', noteId);
        
        if (onNoteSelect) {
            // Använd callback från parent om den finns
            onNoteSelect(noteId);
        } else {
            // Fallback navigation
            navigate(`/notes/${noteId}`);
        }
    };

    if (loading) return <h2>Page is loading...</h2>;
    
    if (!notes || notes.length === 0) {
        return (
            <div className="notes-list-empty">
                <p>No notes available.</p>
            </div>
        );
    }

    return (
        <ul className="notes__list">
            {notes.map((note, index) => {
                return (
                    <li 
                        key={note.id || index} 
                        className="notes__item clickable"
                        onClick={() => handleNoteClick(note.id)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                handleNoteClick(note.id);
                            }
                        }}
                    >
                        <div className="notes__header">
                            <h3 className="notes__creator">
                                {note.username || 'Unknown User'}
                            </h3>
                            <p className="notes__date">
                                {new Date(note.createdAt || note.attributes?.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                        <h2 className="notes__title">{note.title || `Note #${index + 1}`}</h2>
                        <p className="notes__content">
                            {note.content && note.content.length > 150 
                                ? note.content.substring(0, 150) + '...' 
                                : note.content
                            }
                        </p>
                    </li>
                )
            })}
        </ul>
    );
};

export default NoteList;