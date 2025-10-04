import FooterItem from "./FooterItem";
import { useNavigate } from "react-router-dom"; 
import { useLocation } from "react-router-dom";
import { IoIosAddCircle } from "react-icons/io";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosAlbums } from "react-icons/io";
import { IoIosConstruct } from "react-icons/io";
import { IoIosTrash } from "react-icons/io";
import './footer.css';


const Footer = () => {
    const navigate = useNavigate();
    const location = useLocation();

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
        navigate(`/edit-note/${noteId}`);
    }

    const handlerDeleteClick = () => {
        // Implementera delete-funktionalitet här
        const noteId = location.pathname.split('/notes/')[1];
        // Kalla på delete-funktion och navigera tillbaka
        console.log(`Delete note with ID: ${noteId}`);
        // Efter delete, navigera tillbaka till notes-listan
        navigate('/notes');
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