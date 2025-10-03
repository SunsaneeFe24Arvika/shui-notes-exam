import { useState } from "react";
import { Edit3, Trash2 } from "lucide-react";
import './noteDetail.css';

const NoteDetail = ({ note, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedNote, setEditedNote] = useState({ title: "", content: "" });
  const [error, setError] = useState("");

  const handleEdit = () => {
    setIsEditing(true);
    setEditedNote({ title: note.title, content: note.content });
    setError("");
  };

  const handleSave = async () => {
    if (!editedNote.title.trim() || !editedNote.content.trim()) {
      setError("Title and content are required.");
      return;
    }

    try {
      await onUpdate(note.id, editedNote);
      setIsEditing(false);
      setError("");
    } catch (err) {
      setError("Failed to update note.");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedNote({ title: "", content: "" });
    setError("");
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      onDelete(note.id);
    }
  };

  return (
    <div className="note-detail">
      {isEditing ? (
        <div className="edit-form">
          <h2>Edit Note</h2>
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-field">
            <label htmlFor="title">Title:</label>
            <input
              id="title"
              type="text"
              value={editedNote.title}
              onChange={(e) =>
                setEditedNote({ ...editedNote, title: e.target.value })
              }
              className="edit-input"
            />
          </div>
          
          <div className="form-field">
            <label htmlFor="content">Content:</label>
            <textarea
              id="content"
              value={editedNote.content}
              onChange={(e) =>
                setEditedNote({ ...editedNote, content: e.target.value })
              }
              rows="6"
              className="edit-textarea"
            />
          </div>
          
          <div className="edit-actions">
            <button onClick={handleSave} className="save-btn">
              💾 Save
            </button>
            <button onClick={handleCancel} className="cancel-btn">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="note-view">
          <div className="note-header">
            <h1 className="note-title">{note.title}</h1>
            <div className="note-actions">
              <button className="icon-btn edit-btn" onClick={handleEdit}>
                <Edit3 size={20} />
              </button>
              <button className="icon-btn delete-btn" onClick={handleDelete}>
                <Trash2 size={20} />
              </button>
            </div>
          </div>
          <div className="note-content">
            <p>{note.content}</p>
          </div>
          <div className="note-meta">
            <small>Created: {new Date(note.createdAt).toLocaleDateString()}</small>
          </div>
        </div>
      )}
    </div>
  );
};

export default NoteDetail;