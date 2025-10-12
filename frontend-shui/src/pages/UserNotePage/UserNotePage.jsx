import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthToken } from '../../hooks/useAuthToken';
import { getAllNotes } from '../../api/notes';
import NoteList from "../../components/NoteList/NoteList";
import Header from "../../components/Header/Header";
import NavBar from "../../components/NavBar/NavBar";
//import './userNotePage.css';

const UserNotePage = () => {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const { username } = useParams();
    const { token } = useAuthToken();
    const navigate = useNavigate();

    useEffect(() => {
        if (token && username) {
            fetchUserNotes();
        }
    }, [token, username]);

    const fetchUserNotes = async () => {
        try {
            setLoading(true);
            const response = await getAllNotes(token);
            const allNotes = response.data?.notes || [];
            
            // Filtrera på username
            const userNotes = allNotes.filter(
                note => note.PK === `USER#${username}` || note.username === username
            );

            // Sortera efter datum (nyast först)
            userNotes.sort((a, b) => {
                const dateA = new Date(a.createdAt || a.attributes?.createdAt);
                const dateB = new Date(b.createdAt || b.attributes?.createdAt);
                return dateB - dateA;
            });
            
            setNotes(userNotes);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching user notes:', error);
            setLoading(false);
        }
    };

    const handleUsername = (username) => {
        navigate(`/notes/user/${username}`);
    };

    return (
        <section className="user-note__page">
            <Header />
            <NavBar />
            <h1 className="page-title">Howdy! {username}</h1>
            
            <div className="notes-container">
                {loading ? (
                    <p>Loading notes...</p>
                ) : (
                    <NoteList 
                        notes={notes}
                        onNoteSelect={handleUsername}
                    />
                )}
            </div>
        </section>
    );
};

export default UserNotePage;