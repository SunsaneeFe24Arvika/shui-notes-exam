import { useNavigate } from 'react-router-dom';
import FooterItem from "./FooterItem";
import { useLocation } from "react-router-dom";
import { useAuthToken } from '../../hooks/useAuthToken';
import { useParams } from 'react-router-dom';
import { IoIosAddCircle } from "react-icons/io";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosAlbums } from "react-icons/io";
import { IoIosConstruct } from "react-icons/io";
import { IoIosTrash } from "react-icons/io";
import './footer.css';


const Footer = () => {
    const { id } = useParams();
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
        const id = location.pathname.split('/notes/')[1];
        navigate(`/notes/edit/${id}`);
    }

    const handlerDeleteNote = async () => {
    const id = location.pathname.split('/notes/')[1];
    
    if (!token) {
        alert('Du är inte inloggad. Logga in för att radera anteckningen.');
        return;
    }
    
    if (!id) {
        alert('Ingen giltig anteckning att radera.');
        return;
    }

    navigate(`/notes/delete/${id}`);
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
            action: isNoteDetailsPage ? handlerDeleteNote : () => navigate('/notes'),
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