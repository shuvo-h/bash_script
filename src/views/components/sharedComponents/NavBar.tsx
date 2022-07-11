import React, { useState } from 'react';
import {Link, NavLink} from 'react-router-dom';
import useAuth from '../../../hooks/useAuth';
import AuthService from '../../../services/AuthService/Auth.Service';
import { LogOutType } from '../../../types/userTypes';

import "./navBar.css"

const NavBar = () => {
    const {user, handleLogOut} = useAuth();
    
    const navList = [
        {navStatus:"public", title:"Home",      endpoint:"/"},
        {navStatus:"public", title:"Contact",   endpoint:"/contact"},
        {navStatus:"public", title:"About",     endpoint:"/about"},
        {navStatus:"private",title:"My Orders", endpoint:"/my-order"},
    ]
   

    return (
        <nav>
            <div className='nav'>
                <div>
                    Logo
                </div>
                <div className='nav_btns'>
                    {
                        navList.map((navItem, idx) => {
                            if (navItem.navStatus === "private" && user.user_id) {
                                return <div key={`nav-${idx}`}><NavLink className={({isActive})=> isActive ? "btn_active":"btn" } to={navItem.endpoint}>{navItem.title}</NavLink></div>
                            }else if(navItem.navStatus === "public"){
                                return <div key={`nav-${idx}`}><NavLink className={({isActive})=> isActive ? "btn_active":"btn" } to={navItem.endpoint}>{navItem.title}</NavLink></div>
                            }else{
                                return null;
                            }
                        })
                    }
                    {
                        user.user_id ?  <div onClick={handleLogOut} ><NavLink className={({isActive})=> isActive ? "btn_active":"btn" } to={"/login"}>Logout</NavLink></div>
                        : <div><NavLink className={({isActive})=> isActive ? "btn_active":"btn" } to={"/login"}>Login</NavLink></div>
                    }
                </div>
            </div>
        </nav>
    );
};

export default NavBar;