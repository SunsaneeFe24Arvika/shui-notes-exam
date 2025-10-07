import { useNavigate } from 'react-router-dom';
import FooterItem from "./FooterItem";
import { useLocation } from "react-router-dom";
import { useAuthToken } from '../../hooks/useAuthToken';
import { deleteYourOwnNote } from '../../api/notes';
import { IoIosAddCircle } from "react-icons/io";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosAlbums } from "react-icons/io";
import { IoIosConstruct } from "react-icons/io";
import { IoIosTrash } from "react-icons/io";
import './footer.css';


const Footer = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { token } = useAuthToken();

    // Kontrollera om vi är på NoteDetailsPage
    const isNoteDetailsPage = location.pathname.startsWith('/notes/') && location.pathname !== '/notes';

    const handlerBackClick = () => {
        if (window.history.length > 2) {
            navigate(-1)
        } else if (location.pathname.startsWith('/notes/')) { 
            navigate('/notes');
        }
    }

    const handlerEditClick = () => {
        // Antag att du vill gå till edit-sidan för den aktuella noten
        const noteId = location.pathname.split('/notes/')[1];
        navigate(`/notes/edit/${noteId}`);
    }

    const handlerDeleteClick = async () => {
        const noteId = location.pathname.split('/notes/')[1];
        navigate(`/notes/${noteId}/delete`);
        
        if (!token || !noteId) {
            alert('Kunde inte radera anteckningen. Försök igen.');
            return;
        }

        const confirmDelete = window.confirm('Är du säker på att du vill radera denna anteckning?');
        if (!confirmDelete) return;

        try {
            await deleteYourOwnNote(token, noteId);
            navigate('/notes');
        } catch (err) {
            alert('Kunde inte radera anteckningen. Försök igen.');
            console.error('Error deleting note:', err);
        }
    }

    const footerItem = [
        {
            name: "back",
            action: handlerBackClick,
            icon: <IoIosArrowBack />
        },
        {
            name: isNoteDetailsPage ? "edit" : "add",
            action: isNoteDetailsPage ? handlerEditClick : () => navigate('/create-note'),
            icon: isNoteDetailsPage ? <IoIosConstruct /> : <IoIosAddCircle />
        },
        {
            name: isNoteDetailsPage ? "delete" : "account",
            action: isNoteDetailsPage ? handlerDeleteClick : () => navigate('/notes'),
            icon: isNoteDetailsPage ? <IoIosTrash /> : <IoIosAlbums />
        }
    ];

    return (
        <footer className="footer">
            <ul className="footer__list">
                {footerItem.map((item, index) => {
                    return <FooterItem key={index} footerItem={item} />
                })}
            </ul>
        </footer>
    );
}

export default Footer;