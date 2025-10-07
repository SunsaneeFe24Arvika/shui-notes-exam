import { useNavigate } from "react-router-dom";
import CreateNewNote from "../../components/CreateNewNote/CreateNewNote";
import Footer from "../../components/Footer/Footer";
import './postPage.css';

const PostPage = () => {
    const navigate = useNavigate();

    const handleNoteCreated = () => {
        console.log("A new note was created!");
        // Navigera tillbaka till notes list eller visa success meddelande
        navigate('/notes'); // eller vilken route du vill
    };

    return (
        <>
        <section className="post-page">
            <h1 className="page-title">Create New Note</h1>
            <CreateNewNote onNoteCreated={handleNoteCreated} />
        </section>
        <Footer />
        </>
        
    );
};

export default PostPage;