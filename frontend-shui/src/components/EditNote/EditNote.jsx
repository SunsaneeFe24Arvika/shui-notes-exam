import { useState } from 'react';
import { useAuthToken } from '../../hooks/useAuthToken';
import { editYourOwnNoteNote } from '../../api/notes';
import NoteForm from '../NoteForm/NoteForm';

const EditNote = ({ note, onNoteUpdated }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { token } = useAuthToken();

    const handleUpdate = async (data) => {
        setLoading(true);
        setError('');

        try {
            const response = await editYourOwnNoteNote(note.id, data, token);
            if (response.success) {
                onNoteUpdated?.(response.data);
            } else {
                setError(response.message || 'Failed to update note');
            }
        } catch (err) {
            setError('Something went wrong.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="edit-note">
            <h2>Edit Note</h2>
            <NoteForm
                initialTitle={note.title}
                initialContent={note.content}
                onSubmit={handleUpdate}
                loading={loading}
                error={error}
                buttonText="Save Changes"
            />
        </div>
    );
};

export default EditNote;
