import NoteList from '../../components/NoteList/NoteList';
import './notesPage.css';
import NavBar from '../../components/NavBar/NavBar';

const NotesPage = () => {
    return (
        <section className='noteslist-page'>
            <h1 className='page-title'>NOTES</h1>
            <div className='notes-container'>
                <NoteList />
            </div>
            <NavBar />
        </section>
    );
}

export default NotesPage;