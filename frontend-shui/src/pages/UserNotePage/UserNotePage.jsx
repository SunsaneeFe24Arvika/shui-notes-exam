import NoteList from "../../components/NoteList/NoteList";
import { useParams } from "react-router-dom";
import Header from "../../components/Header/Header";
import NavBar from "../../components/NavBar/NavBar";
import Footer from "../../components/Footer/Footer";

const UserNotePage = () => {
    const { username } = useParams();

    return (
        <section className="user-note__page">
            <Header />
            <NavBar />
            <h1 className="user-note__title">Howdie, { username }!</h1>
            <div className="notes-container__user">
                <NoteList username={ username }/>
            </div>

        </section>
    )
}

export default UserNotePage;