import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthToken } from "../../hooks/useAuthToken";
import { getNoteById, editYourOwnNote, deleteYourOwnNote } from "../../api/notes";
import { ArrowLeft, Edit3, Trash2, Save, X } from "lucide-react";
import NoteForm from "../../components/NoteForm/NoteForm"; 
import './noteDetailsPage.css';
//import './noteDetailPage.css';

const NoteDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuthToken();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (token && id) {
      fetchNote();
    }
  }, [id, token]);

  const fetchNote = async () => {
    try {
      setLoading(true);
      setError("");
      
      const response = await getNoteById(id, token);

      if (response.success) {
        setNote(response.data);
      } else {
        setError(response.message || "Note not found.");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while fetching the note.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (updatedData) => {
    try {
      const result = await editYourOwnNote(id, updatedData, token);
      
      if (result.status === 200) {
        setNote({ ...note, ...updatedData });
        setIsEditing(false);
        return Promise.resolve();
      } else {
        throw new Error("Failed to update note");
      }
    } catch (error) {
      setError("Failed to update note");
      return Promise.reject(error);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this note?")) {
      return;
    }

    try {
      const result = await deleteYourOwnNote(id, token);
      
      if (result.status === 200) {
        navigate("/notes");
      } else {
        setError("Failed to delete note.");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while deleting.");
    }
  };

  const handleBack = () => {
    navigate("/notes");
  };

  const handleEdit = () => {
    setIsEditing(true);
    setError("");
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setError("");
  };

  if (loading) return <div className="loading">Loading note...</div>;
  if (error && !note) return (
    <div className="error-page">
      <div className="error-message">{error}</div>
      <button onClick={handleBack} className="back-btn">
        ← Back to Notes
      </button>
    </div>
  );
  if (!note) return (
    <div className="error-page">
      <div className="error-message">Note not found.</div>
      <button onClick={handleBack} className="back-btn">
        ← Back to Notes
      </button>
    </div>
  );

  return (
    <div className="note-detail-page">
      <div className="note-header">
        <button className="back-btn" onClick={handleBack}>
          <ArrowLeft size={18} /> Back to Notes
        </button>
        
        <div className="note-actions">
          {!isEditing ? (
            <>
              <button className="edit-btn" onClick={handleEdit}>
                <Edit3 size={18} /> Edit
              </button>
              <button className="delete-btn" onClick={handleDelete}>
                <Trash2 size={18} /> Delete
              </button>
            </>
          ) : (
            <button className="cancel-btn" onClick={handleCancelEdit}>
              <X size={18} /> Cancel
            </button>
          )}
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {isEditing ? (
        <div className="edit-mode">
          <h2>Edit Note</h2>
          <NoteForm
            initialData={{
              title: note.title,
              content: note.content
            }}
            onSubmit={handleUpdate}
            submitButtonText="Save Changes"
            isEditing={true}
          />
        </div>
      ) : (
        <div className="view-mode">
          <h1 className="note-title">{note.title}</h1>
          <div className="note-content">
            <p>{note.content}</p>
          </div>
          <div className="note-meta">
            <small>Created: {new Date(note.createdAt).toLocaleDateString()}</small>
            {note.updatedAt && note.updatedAt !== note.createdAt && (
              <small>Updated: {new Date(note.updatedAt).toLocaleDateString()}</small>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NoteDetailsPage;