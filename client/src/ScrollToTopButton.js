import React, { useState, useEffect } from 'react';
import { FaArrowUp } from 'react-icons/fa'; // Assuming you're using react-icons for the arrow icon
import './App.css';

const ScrollToTopButton = () => {
    const [isVisible, setIsVisible] = useState(false);

    // Show button when page is scrolled down
    const toggleVisibility = () => {
        if (window.scrollY > 300) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    // Set up event listener
    useEffect(() => {
        window.addEventListener('scroll', toggleVisibility);
        return () => {
            window.removeEventListener('scroll', toggleVisibility);
        };
    }, []);

    // Scroll to top when button is clicked
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    return (
        <div>
            {isVisible && (
                <div className="scroll-to-top" onClick={scrollToTop}>
                    <FaArrowUp />
                </div>
            )}
        </div>
    );
};

export default ScrollToTopButton;
