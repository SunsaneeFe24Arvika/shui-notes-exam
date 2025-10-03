import { useState } from 'react';

const NoteForm = ({ initialTitle = '', initialContent = '', onSubmit, loading, error, buttonText }) => {
    const [title, setTitle] = useState(initialTitle);
    const [content, setContent] = useState(initialContent);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title.trim() || !content.trim()) return;
        onSubmit({ title: title.trim(), content: content.trim() });
    };

    return (
        <form onSubmit={handleSubmit} className="note-form">
            {error && <div className="note-form__error">{error}</div>}

            <div className="note-form__field">
                <label htmlFor="title">Title:</label>
                <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    disabled={loading}
                    required
                />
            </div>

            <div className="note-form__field">
                <label htmlFor="content">Content:</label>
                <textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows="5"
                    disabled={loading}
                    required
                />
            </div>

            <button type="submit" disabled={loading}>
                {loading ? 'Saving...' : buttonText}
            </button>
        </form>
    );
};

export default NoteForm;
