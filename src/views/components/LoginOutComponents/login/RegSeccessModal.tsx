import React from 'react';
import { useNavigate } from 'react-router-dom';

type RegModalPropType = {
    setIsRegModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const RegSeccessModal = ({setIsRegModalOpen}:RegModalPropType) => {
    const navigate = useNavigate();
    return (
        <div className='reg_modal_wrapper'>
            <div>
                <h2>Registration Successful</h2>
                <div>
                    <button className='btn_regular' onClick={()=>{setIsRegModalOpen(false); navigate("/login")}}>ok</button>
                </div>
            </div>
        </div>
    );
};

export default RegSeccessModal;