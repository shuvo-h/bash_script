import React from 'react';
import {Outlet} from 'react-router-dom';
import Footer from '../../components/sharedComponents/Footer';
import NavBar from '../../components/sharedComponents/NavBar';

const PrivateLayout = () => {
    return (
        <div>
            <NavBar></NavBar>
            <Outlet></Outlet>
            <Footer></Footer>
        </div>
    );
};

export default PrivateLayout;