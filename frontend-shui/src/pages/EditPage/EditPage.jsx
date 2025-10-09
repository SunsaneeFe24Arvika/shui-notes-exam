import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthToken } from '../../hooks/useAuthToken';
import { getNoteById } from '../../api/notes';
import { editYourOwnNote } from '../../api/notes';
import EditNote from '../../components/EditNote/EditNote'; 
import logo from '../../assets/shui-logo.png';
import Footer from '../../components/Footer/Footer';


function EditNotePage() {
  const { id } = useParams();
  const { token } = useAuthToken();
  const navigate = useNavigate();

  const [note, setNote] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    const fetchNote = async () => {
      const result = await getNoteById(id, token);
      if (result.success) {
        setNote(result.data.note || result.data);
      } else {
        setError(result.message);
      }
      setLoading(false);
    };

    if (id && token) fetchNote();
  }, [id, token]);

  
  // const handleSave = async (updatedData) => {
  //   const result = await editYourOwnNote(id, updatedData, token);
  //   if (result.success) {
  //     navigate(`/notes/${id}`); 
  //   } else {
  //     setError(result.message);
  //   }
  // };

  const handleSave = async (updatedData) => {
  console.log('Data som skickas:', updatedData); // Debug log
  console.log('Note ID:', id); // Debug log
  console.log('Token:', token); // Debug log
  
  const result = await editYourOwnNote(id, updatedData, token);
  console.log('API response:', result); // Debug log
  
  if (result.success) {
    navigate(`/notes`); 
  } else {
    setError(result.message);
  }
};

  if (loading) return <p>Laddar...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!note) return null;

  return (
    <>
    <figure>
      <img src={logo} alt="shui logo" className="shui-logo" />  
    </figure>
    <section className='edit-page'>
      <h1 className='page-title'>Edit your note</h1>
      <EditNote noteData={note} onSave={handleSave} />
    </section>
    <Footer />
    </>
    
  );
}

export default EditNotePage;
