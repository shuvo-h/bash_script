import React, { useState } from 'react';
import  './LogReg.css';
import { NavLink } from 'react-router-dom';
import AuthService from '../../../../services/AuthService/Auth.Service';
import { RegistrationType } from '../../../../types/userTypes';
import RegSeccessModal from './RegSeccessModal';

type regFieldError = {
    value: string
    msg: string
    param: string
    location: string
}

export type ResponseRegisterType = {
    error: {
        name: regFieldError,
        email: regFieldError,
        password: regFieldError,
        common: {msg: String}
    },
    id: String,
    message: String
}


const RegistrationForm = () => {
    const [registrationInfo,setRegistrationInfo] = useState<RegistrationType>({} as RegistrationType);
    const [regSuccessr,setRegSuccess] = useState<ResponseRegisterType>({} as ResponseRegisterType);
    const [isRegModalOpen,setIsRegModalOpen] = useState<boolean>(false);

    console.log(registrationInfo);
    console.log(regSuccessr);

    const onChangeRegistrationInfo = (e:  React.ChangeEvent<HTMLInputElement>) =>{
        
        // return if input field name don't match
        if(e.target.name === "email" || e.target.name === "password" || e.target.name === "name" ) {
            console.log(e.target.value);
            const tempLoginfo = {...registrationInfo};
            tempLoginfo[e.target.name] = e.target.value;
            setRegistrationInfo(tempLoginfo);
        };
    }

    const onSUbmitRegistration = async(e:React.FormEvent<HTMLFormElement>) =>{
        e.preventDefault();
        try {
            const registerRes = await AuthService.registerMember<ResponseRegisterType>(registrationInfo)
            console.log(registerRes);
            
            setRegSuccess(registerRes);
            if (registerRes.id) {
                setIsRegModalOpen(true);
                setRegistrationInfo({} as RegistrationType)
            }
        } catch (error) {
            console.log(error);
        }
        
    }

    return (
        <div>
            <div className='logReg_container'>
                <h2 className='text_center'>Fill up the form to join with us</h2>
                <form onSubmit={onSUbmitRegistration} className="reg_form">
                    <label htmlFor="">Name: <br />
                        <input onChange={e=>onChangeRegistrationInfo(e)} type="text"  name="name" placeholder='Full Name'  />
                        <p>{regSuccessr.error?.name &&  regSuccessr.error?.name?.msg}</p>
                    </label>
                    <br />
                    <label htmlFor="">Email or Username: <br />
                        <input onChange={e=>onChangeRegistrationInfo(e)} type="email"  name="email" placeholder='email or username'  required/>
                         {/* <p>{ regSuccessr.error?.email?.msg}</p> */}
                         <p>{ regSuccessr.error?.email?.msg ? regSuccessr.error?.email?.msg : " "}</p>
                    </label>
                    <br />
                    <label htmlFor="">Password: <br />
                        <input onChange={e=>onChangeRegistrationInfo(e)} type="password"  name="password"  placeholder='password' />
                         <p>{regSuccessr.error?.password && regSuccessr.error?.password?.msg}</p>
                    </label>
                    <br />
                        <p className='text_center'>{regSuccessr.error?.common && regSuccessr.error?.common?.msg}</p>
                    <div>
                         <br />
                        <button className='btn_regular' type="submit">Submit</button>
                    </div>
                </form>
                <div>
                    <p className='text_center'>Already have an account? <NavLink to={"/login"}>Login here</NavLink> </p> 
                </div>
            </div>
                {
                    isRegModalOpen && <div className='reg_modal_container'>
                        <RegSeccessModal setIsRegModalOpen={setIsRegModalOpen}></RegSeccessModal>
                    </div>
                }
        </div>
    );
};

export default RegistrationForm;