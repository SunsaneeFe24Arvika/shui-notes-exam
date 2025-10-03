import { useState, useEffect } from 'react';

const NoteForm = ({ 
  initialData = { title: '', content: '' }, 
  onSubmit, 
  submitButtonText = 'Submit',
  isEditing = false 
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fyll i formuläret med initial data
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setContent(initialData.content || '');
    }
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      setError('Both title and content are required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await onSubmit({ title: title.trim(), content: content.trim() });
      
      // Reset form bara om det inte är editing mode
      if (!isEditing) {
        setTitle('');
        setContent('');
      }
    } catch (err) {
      setError('Failed to save note. Please try again.');
      console.error('Error saving note:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="note-form">
      {error && <div className="error-message">{error}</div>}
      
      <div className="form-field">
        <label htmlFor="title">Title:</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="form-input"
          placeholder="Enter note title"
          disabled={loading}
          required
        />
      </div>

      <div className="form-field">
        <label htmlFor="content">Content:</label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="form-textarea"
          placeholder="Enter note content"
          rows="6"
          disabled={loading}
          required
        />
      </div>

      <button 
        type="submit" 
        className="form-submit"
        disabled={loading}
      >
        {loading ? 'Saving...' : submitButtonText}
      </button>
    </form>
  );
};

export default NoteForm;