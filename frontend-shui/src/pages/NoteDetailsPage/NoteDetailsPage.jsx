import NoteDetails from "../../components/NoteById/NoteById";
import Footer from "../../components/Footer/Footer";

const NoteDetailsPage = () => {
    const handleNoteAction = (data) => {
        // Hantera data från NoteDetails
        console.log(data);
    };

    return (
        <>
        <section className="note-detail__page">
            <h1 className="note-detail__title">NOTE</h1>
            <NoteDetails onAction={handleNoteAction} />
        </section>
        <Footer />

        </>
    )
}

export default NoteDetailsPage;