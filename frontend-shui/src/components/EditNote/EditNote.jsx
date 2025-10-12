import { useState, useRef, useEffect } from 'react';
import './editNote.css';

function EditNote({ noteData, onSave }) {
  const [title, setTitle] = useState(noteData.title || '');
  const [content, setContent] = useState(noteData.content || '');
  const textareaRef = useRef(null);

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';
    }
  };

  useEffect(() => {
    adjustHeight();
  }, [content]);

  const handleContentChange = (e) => {
    setContent(e.target.value);
    // Kör adjustHeight efter state uppdatering
    setTimeout(adjustHeight, 0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ title, content }); 
  };

  return (
    <form onSubmit={handleSubmit} className="edit-note-form">
      <label className='label__title'>
        <h2 className="edit-note__title">Title:</h2>
        <input 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          required 
        />
      </label>

      <label className='label__content'>
        <h3 className="edit-note__subtitle">Content:</h3>
        <textarea 
          ref={textareaRef}
          value={content} 
          onChange={handleContentChange}
          style={{ minHeight: '100px', resize: 'none', overflow: 'hidden' }}
          required 
        />
      </label>

      <button className='edit-note__btn' type="submit">Save</button>
    </form>
  );
}

export default EditNote;