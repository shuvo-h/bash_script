import React, { useEffect, useState } from 'react';
import { NavigateFunction } from 'react-router-dom';
import AuthService from '../services/AuthService/Auth.Service';
import { LgoinType, UserLoginType } from '../types/userTypes';

export type AuthErrorMsg = {message: String};

const useAuthAccess = () => {
    const [user,setUser] = useState<UserLoginType>({} as UserLoginType );
    const [isLoading,setIsLoading] = useState<boolean>(true);
    const [authError,setAUthError] = useState<String>("");
    console.log(isLoading, "-> access log");
    
    useEffect(()=>{
        // describe the function to get user info by token
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        const fetchUser = async () =>{
            setIsLoading(true)
            setAUthError("")
            console.log("going to server with token");
            try {
                const user = await AuthService.keepUserLogin();
                console.log(user);
                    setUser(user)
                    setIsLoading(false)
                console.log(user,isLoading, "both one hand");
            } catch (error: any) {
                setAUthError(error.message)
            } finally{
                setAUthError("")
                setIsLoading(false)
            }
        }
        // just call the function and cath the error
        fetchUser().catch(err =>{
            setAUthError(err.message)
        })

    },[])
    console.log(user,"hook user");

    // login user function 
    const onSubmitLogin = async(e:React.FormEvent<HTMLFormElement>,loginInfo: LgoinType,navigate:NavigateFunction,locationFrom:any) =>{
        e.preventDefault();
        if (loginInfo.email && loginInfo.password) {
            try {
                setIsLoading(true)
                const userLogIn = await AuthService.login<UserLoginType>(loginInfo);
                if (userLogIn.user_id) {
                    setUser(userLogIn)
                    setAUthError("")
                    setIsLoading(false)
                    navigate(locationFrom,{replace: true})
                }
            } catch (error: any) {
                setAUthError(error.message)
                setIsLoading(false)
            }
            
        }

    }

    const handleLogOut = async() =>{
        setIsLoading(true);
        try {
            const removeUser = await AuthService.logOut();
            if (removeUser.message) {
                setUser({} as UserLoginType)
                setIsLoading(false);
                setAUthError("")
                return true
            }else{
                setIsLoading(false);

            }
            
        } catch (error:any) {
            setIsLoading(false);
            setAUthError(error.message)
        }
    }
    
    return {
        user,
        isLoading,
        authError, 
        handleLogOut,
        onSubmitLogin
    };
};

export default useAuthAccess;