import React,{ createContext } from 'react';
import { NavigateFunction } from 'react-router-dom';
import useAuthAccess from '../hooks/useAuthAccess';
import { LgoinType, UserLoginType } from '../types/userTypes';

type ProviderPropType = {
    children: JSX.Element
}
// auth context type will be useAuthAccess return type
type AuthContextType = {
     user: UserLoginType ; 
     isLoading: boolean; 
     authError: String;
     handleLogOut: () => void 
     onSubmitLogin: (e: React.FormEvent<HTMLFormElement>, loginInfo: LgoinType, navigate:NavigateFunction, locationFrom: String) => void
}

export const AuthContextLog = createContext<AuthContextType>({} as AuthContextType);

const AuthProvider = ({children}:ProviderPropType) => {
    const alluserInfo = useAuthAccess();
    return (
        <AuthContextLog.Provider value={alluserInfo}>
            {children}
        </AuthContextLog.Provider>
    );
};

export default AuthProvider;