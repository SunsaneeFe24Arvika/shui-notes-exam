import {useEffect, useState} from 'react'
import { useAuthToken } from '../../hooks/useAuthToken';
import './noteList.css';
import { getAllNotes } from '../../api/notes';

const NoteList = ({type}) => {
    const [notes, setNotes] = useState([]); 
    const { token } = useAuthToken();

    useEffect(() => {
        fetchNotes();
    }, [token]);
    
    useEffect(() => {
        console.log(notes);        
    }, [notes]);
    
    const fetchNotes = async () => {
        const response = await getAllNotes(token);
        setNotes(response.data.notes);
    }

    return (
        <ul className="notes__list">
            {
                notes && notes.map((note, index) => {
                    return (
                        <li key={note.id || index} className="notes__item">
                            <div className="notes__header">
                                <h3 className="notes__creator">
                                    By: {note.username || 'Unknown User'}
                                </h3>
                                <p className="notes__date">
                                    {new Date(note.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                            <h2 className="notes__title">{note.title || `Note #${index + 1}`}</h2>
                            <p className="notes__content">{note.content}</p>
                        </li>
                    )
                })
            }
        </ul>
    )
}

export default NoteList;