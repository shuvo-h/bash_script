import React, { useContext } from 'react';
import { AuthContextLog } from '../contexts/AuthProvider';

const useAuth = () => {

    return useContext(AuthContextLog);
};

export default useAuth;