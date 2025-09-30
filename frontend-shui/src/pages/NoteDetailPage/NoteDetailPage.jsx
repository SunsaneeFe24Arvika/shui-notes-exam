// import { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { editYourOwnNote, deleteYourOwnNote, getAllNotes } from '../NotesPage/NotesPage';
// import './noteDetailPage.css';

// const NoteDetailPage = () => {
//     const { id } = useParams();
//     const navigate = useNavigate();
//     const [note, setNote] = useState(null);
//     const [isEditing, setIsEditing] = useState(false);
//     const [editedNote, setEditedNote] = useState({ title: '', content: '' });

//     useEffect(() => {
//         fetchNote();
//     }, [id]);

//     const fetchNote = async () => {
//         const token = localStorage.getItem('token');
//         const response = await getAllNotes(token);
//         if (response.status === 200) {
//             const foundNote = response.data.find(note => note.id === id);
//             setNote(foundNote);
//         }
//     };

//     const handleEdit = () => {
//         setIsEditing(true);
//         setEditedNote({ title: note.title, content: note.content });
//     };

//     const handleSave = async () => {
//         const token = localStorage.getItem('token');
//         const result = await editYourOwnNote(id, editedNote, token);
//         if (result.status === 200) {
//             setNote({ ...note, ...editedNote });
//             setIsEditing(false);
//         }
//     };

//     const handleDelete = async () => {
//         const token = localStorage.getItem('token');
//         const result = await deleteYourOwnNote(id, token);
//         if (result.status === 200) {
//             navigate('/notes');
//         }
//     };

//     return (
//         <div className="note-detail-page">
//             <button onClick={() => navigate('/notes')}>← Tillbaka till anteckningar</button>
            
//             {note && (
//                 <div className="note-detail">
//                     {isEditing ? (
//                         <div className="edit-form">
//                             <input 
//                                 value={editedNote.title}
//                                 onChange={(e) => setEditedNote({...editedNote, title: e.target.value})}
//                             />
//                             <textarea 
//                                 value={editedNote.content}
//                                 onChange={(e) => setEditedNote({...editedNote, content: e.target.value})}
//                             />
//                             <button onClick={handleSave}>Spara</button>
//                             <button onClick={() => setIsEditing(false)}>Avbryt</button>
//                         </div>
//                     ) : (
//                         <div className="note-view">
//                             <h1>{note.title}</h1>
//                             <p>{note.content}</p>
//                             <button onClick={handleEdit}>Redigera</button>
//                             <button onClick={handleDelete}>Ta bort</button>
//                         </div>
//                     )}
//                 </div>
//             )}
//         </div>
//     );
// };


// export default NoteDetailPage;