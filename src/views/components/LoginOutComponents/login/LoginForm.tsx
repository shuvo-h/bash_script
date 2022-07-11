import React, { useEffect, useMemo, useState } from 'react';
import "./LogReg.css"
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import AuthService from '../../../../services/AuthService/Auth.Service';
import { LgoinType, UserLoginType } from '../../../../types/userTypes';
import useAuth from '../../../../hooks/useAuth';



const LoginForm = () => {
    const {user,onSubmitLogin} = useAuth();
    const navigate = useNavigate()
    const location = useLocation();
    
    const [loginInfo,setLoginInfo] = useState<LgoinType>({} as LgoinType);
    console.log(user," in log page");
    useEffect(()=>{
        if (user.user_id) {
            navigate("/")
        }
    },[])
    
    // without typescript, use this location path
    // const locationFrom = location?.state?.from?.pathname || "/"
    const locationFrom = useMemo(() => {   // // with typescript, use this location path
        const state = location.state as { from: string };
      
        if (state && state.from) {
          return state.from;
        }
      
        return '/';
      }, [location]);

    const onChangeLoginInfo = (e:  React.ChangeEvent<HTMLInputElement>):void =>{
        // return if input field name don't match
        if(e.target.name === "email" || e.target.name === "password" ) {
            console.log(e.target.value);
            const tempLoginfo = {...loginInfo};
            tempLoginfo[e.target.name] = e.target.value;
            setLoginInfo(tempLoginfo);
        };
    }

    
   
    
    
    return (
        <div className='logReg_container'>
            <h2 className='text_center'>Welcome To ArtLog</h2>
            <form className="reg_form" onSubmit={(e)=>onSubmitLogin(e,loginInfo,navigate,locationFrom)}>
                <label htmlFor="">Email:
                    <input onChange={e=>onChangeLoginInfo(e)} type="email"  name="email" placeholder='email'  />
                </label>
                <label htmlFor="">Password:
                    <input onChange={e=>onChangeLoginInfo(e)} type="password"  name="password"  placeholder='password' />
                </label>
                <div>
                    <button className='btn_regular' type="submit">Login</button>
                </div>
            </form>
            <div>
                <p className='text_center'>Don't have an account? <NavLink to={"/registration"}>Register here</NavLink> </p>
            </div>
        </div>
    );
};

export default LoginForm;

