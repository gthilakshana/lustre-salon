// src/utils/auth.js

export const getAuthToken = () => {
   
    const token = localStorage.getItem('token'); 
    
    
    return token; 
};