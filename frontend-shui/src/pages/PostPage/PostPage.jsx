import { useNavigate } from "react-router-dom";
import CreateNewNote from "../../components/CreateNewNote/CreateNewNote";
import Header from "../../components/Header/Header";
import NavBar from "../../components/NavBar/NavBar";
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
        <Header />
        <section className="post-page">
            <NavBar />
            <h1 className="page-title">Create New Note</h1>
            <CreateNewNote onNoteCreated={handleNoteCreated} />
        </section>
        </>
        
    );
};

export default PostPage;