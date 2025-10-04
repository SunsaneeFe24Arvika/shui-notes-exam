import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'; // Lägg till denna import
import { useAuthToken } from '../../hooks/useAuthToken';
import './noteList.css';
import { getAllNotes } from '../../api/notes';

const NoteList = ({ type, notes: propNotes, onNoteSelect }) => { // Lägg till props för flexibilitet
    const [notes, setNotes] = useState([]); 
    const { token } = useAuthToken();
    const navigate = useNavigate(); // Lägg till navigate hook

    useEffect(() => {
        // Använd notes från props om de finns, annars hämta själv
        if (propNotes) {
            setNotes(propNotes);
        } else if (token) {
            fetchNotes();
        }
    }, [token, propNotes]);
    
    useEffect(() => {
        console.log(notes);        
    }, [notes]);
    
    const fetchNotes = async () => {
        try {
            const response = await getAllNotes(token);
            if (response.data && response.data.notes) {
                setNotes(response.data.notes);
            }
        } catch (error) {
            console.error('Error fetching notes:', error);
        }
    }

    // Handler funktion för att navigera till note details
    const handleNoteClick = (noteId) => {
        console.log('Navigating to note:', noteId); // Debug log
        
        if (onNoteSelect) {
            // Använd callback från parent om den finns
            onNoteSelect(noteId);
        } else {
            // Fallback navigation
            navigate(`/notes/${noteId}`);
        }
    };

    if (!notes || notes.length === 0) {
        return (
            <div className="notes-list-empty">
                <p>No notes available.</p>
            </div>
        );
    }

    return (
        <ul className="notes__list">
            {
                notes.map((note, index) => {
                    return (
                        <li 
                            key={note.id || index} 
                            className="notes__item clickable" // Lägg till clickable class
                            onClick={() => handleNoteClick(note.id)} // Lägg till click handler
                            role="button" // För tillgänglighet
                            tabIndex={0} // Gör klickbar med tangentbord
                            onKeyDown={(e) => { // Tangentbordsnavigation
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
                                    {new Date(note.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                            <h2 className="notes__title">{note.title || `Note #${index + 1}`}</h2>
                            <p className="notes__content">
                                {note.content && note.content.length > 150 
                                    ? note.content.substring(0, 150) + '...' 
                                    : note.content
                                }
                            </p>
                            <div className="notes__actions">
                                <span className="view-hint">Edit your note →</span>
                            </div>
                        </li>
                    )
                })
            }
        </ul>
    )
}

export default NoteList;