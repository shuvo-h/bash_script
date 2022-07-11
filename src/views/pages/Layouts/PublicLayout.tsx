import React from 'react';
import {Outlet} from 'react-router-dom';
import Footer from '../../components/sharedComponents/Footer';
import NavBar from '../../components/sharedComponents/NavBar';

const PublicLayout = () => {
    return (
        <div>
            <div>
                <NavBar></NavBar>
            </div>
            <div>
                <Outlet></Outlet>
            </div>
            <div>
                <Footer></Footer>
            </div>
        </div>
    );
};

export default PublicLayout;