import axios from 'axios';

export const createNote = async (data, token) => {
    const response = await axios.post('https://vcjts99zb3.execute-api.eu-north-1.amazonaws.com/api/notes',
        data,
        {
            headers : {
                Authorization : token,
                'Content-Type' : 'application/json'
            }
        }
    )
    .then(response => { return response; })
    .catch(error => { return error; });

    if(response.status === 200) {
        return response;
    } else {
        return response.response ? response.response.data.message : response.data.message;
    }
}

export const getAllNotes = async (token) => {
    const response = await axios.get('https://vcjts99zb3.execute-api.eu-north-1.amazonaws.com/api/notes',
        {
            headers : {
                Authorization : token,
                'Content-Type' : 'application/json'
            }
        }
    )
    .then(response => { return response; })
    .catch(error => { return error; });

    if(response.status === 200) {
        return response;
    } else {
        return response.response ? response.response.data.message : response.data.message;
    }
}

export const getNotesByUsername = async (username, token) => {
    const response = await getAllNotes(token);
    
    if(response.status === 200) {
        // Filtrera anteckningar baserat på username
        const filteredNotes = response.data.filter(note => note.username === username);
        return {
            ...response,
            data: filteredNotes
        };
    } else {
        return response;
    }
}

export const getCurrentUserNotes = async (token) => {
    // Denna funktion returnerar alla anteckningar för den inloggade användaren
    // (som redan filtreras av backend baserat på token)
    return await getAllNotes(token);
}

export const editYourOwnNote = async (id, data, token) => {
    const response = await axios.patch(`https://vcjts99zb3.execute-api.eu-north-1.amazonaws.com/api/notes/${id}`,
        data,
        {
            headers: {
                Authorization: token,
                'Content-Type': 'application/json'
            }
        }
    )
    .then(response => { return response; })
    .catch(error => { return error; });

    if(response.status === 200) {
        return response;
    } else {
        return response.response ? response.response.data.message : response.data.message;
    }
}

export const deleteYourOwnNote = async (id, token) => {
    const response = await axios.delete(`https://vcjts99zb3.execute-api.eu-north-1.amazonaws.com/api/notes/${id}`,
        {
            headers : {
                Authorization : token,
                'Content-Type' : 'application/json'
            }
        }
    )
    .then(response => { return response; })
    .catch(error => { return error; });

    if(response.status === 200) {
        return response;
    } else {
        return response.response ? response.response.data.message : response.data.message;
    }
}