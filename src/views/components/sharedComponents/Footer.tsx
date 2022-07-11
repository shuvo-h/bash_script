import React from 'react';
import "./footer.css";
import { IconContext } from "react-icons";
import { SiYoutubemusic } from 'react-icons/si';
import { FaTwitter } from 'react-icons/fa';
import { FaInstagramSquare } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className='pub_footer'>
            <h3>Graphics maker</h3>
            <div>
                <IconContext.Provider value={{ color: "rgba(255,6,250,0.9)", size:"30", className: "global-class-name footerIcon" }}>
                    <SiYoutubemusic></SiYoutubemusic>
                </IconContext.Provider>
                <IconContext.Provider value={{ color: "skyblue", size:"30", className: "global-class-name footerIcon" }}>
                    <FaTwitter></FaTwitter>
                </IconContext.Provider>
                <IconContext.Provider value={{ color: "rgba(255,0,0,0.6)", size:"30", className: "global-class-name footerIcon" }}>
                    <FaInstagramSquare></FaInstagramSquare>
                </IconContext.Provider>
            </div>
            <div>
                <p> &copy; copyright 2022</p>
            </div>
        </footer>
    );
};

export default Footer;