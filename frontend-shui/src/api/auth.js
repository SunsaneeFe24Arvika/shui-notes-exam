import axios from 'axios';

export const apiLogin = async (data) => {
    const response = await axios.post('https://vcjts99zb3.execute-api.eu-north-1.amazonaws.com/api/auth/login', 
        data
    )
    .then(response => { return response; })
    .catch(error => { return error });

    if(response.status === 200) {
        return response;
    } else {
        return response.deta.message;
    }
}

export const apiRegister = async (data) => {
    const response = await axios.post('https://vcjts99zb3.execute-api.eu-north-1.amazonaws.com/api/auth/register',
        data
    )
    .then(response => { return response; })
    .catch(error => { return error});

    if(response.status === 201) {
        return response;
    } else {
        return response.data.message;
    }
}