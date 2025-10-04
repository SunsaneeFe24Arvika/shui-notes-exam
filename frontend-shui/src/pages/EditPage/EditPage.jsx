import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getNoteById } from '../../api/notes';
import { useAuthToken } from '../../hooks/useAuthToken';
import EditNote from '../../components/EditNote/EditNote';

const EditPage = () => {
  const { id } = useParams();
  console.log('Editing note ID:', id);
  
  const { token } = useAuthToken();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const response = await getNoteById(id, token);
        setNote(response.data); // 🔹 här lägger vi anteckningen i state
      } catch (error) {
        console.error('Could not fetch note', error);
      } finally {
        setLoading(false);
      }
    };
    fetchNote();
  }, [id, token]);

  if (loading) return <p>Loading...</p>;
  if (!note) return <p>No note found</p>;

  return (
    <EditNote
      note={note}
      onNoteUpdated={() => console.log('Note updated!')}
      onCancel={() => console.log('Cancelled!')}
    />
  );
};

export default EditPage;
