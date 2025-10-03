import { useNavigate } from "react-router-dom";
import CreateNewNote from "../../components/CreateNewNote/CreateNewNote";
//import './postPage.css';

const PostPage = () => {
    const navigate = useNavigate();

    const handleNoteCreated = () => {
        console.log("A new note was created!");
        // Navigera tillbaka till notes list eller visa success meddelande
        navigate('/notes'); // eller vilken route du vill
    };

    return (
        <section className="post-page">
            <h1>Create New Note</h1>
            <CreateNewNote onNoteCreated={handleNoteCreated} />
        </section>
    );
};

export default PostPage;