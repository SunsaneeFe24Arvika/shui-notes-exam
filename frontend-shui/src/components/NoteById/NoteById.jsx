import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuthToken } from '../../hooks/useAuthToken';
import { getNoteById } from '../../api/notes';

function NoteDetails() {
  const { id } = useParams();
  const { token } = useAuthToken();
  const [note, setNote] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNote = async () => {
      const result = await getNoteById(id, token);

      if (result.success) {
        setNote(result.data.note || result.data);
      } else {
        setError(result.message);
      }
    };

    if (id && token) fetchNote();
  }, [id, token]);

  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!note) return <p>Laddar anteckning...</p>;

  return (
    <div className="note-details">
      <h2>{note.title}</h2>
      <p>{note.content}</p>
      <small>Skapad av {note.username}</small>
    </div>
  );
}

export default NoteDetails;
