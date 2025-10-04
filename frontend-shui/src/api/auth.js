import axios from 'axios';

export const apiLogin = async (data) => {
    try {
        const response = await axios.post(
            'https://vcjts99zb3.execute-api.eu-north-1.amazonaws.com/api/auth/login', 
            data
        );
        
        if (response.status === 200) {
            return response;
        } else {
            throw new Error(response.data?.message || 'Login failed');
        }
    } catch (error) {
        // Axios error har response property för HTTP errors
        if (error.response) {
            throw new Error(error.response.data?.message || 'Login failed');
        } else {
            throw new Error('Network error');
        }
    }
}

export const apiRegister = async (data) => {
    try {
        const response = await axios.post(
            'https://vcjts99zb3.execute-api.eu-north-1.amazonaws.com/api/auth/register',
            data
        );
        
        if (response.status === 201) {
            return response;
        } else {
            throw new Error(response.data?.message || 'Registration failed');
        }
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data?.message || 'Registration failed');
        } else {
            throw new Error('Network error');
        }
    }
}

// export const getUserProfile = async (token) => {
//     try {
//         const response = await fetch(`https://vcjts99zb3.execute-api.eu-north-1.amazonaws.com/api/user/profile`, {
//             method: 'GET',
//             headers: {
//                 'Authorization': `Bearer ${token}`,
//                 'Content-Type': 'application/json',
//             },
//         });
        
//         const data = await response.json();
//         return { status: response.status, data };
//     } catch (error) {
//         console.error('Error getting user profile:', error);
//         throw error;
//     }
// };