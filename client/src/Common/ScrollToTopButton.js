import React, { useState, useEffect } from 'react';
import { FaArrowUp } from 'react-icons/fa';
import '../Pages/Home/style.css';

const ScrollToTopButton = () => {
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => {
        if (window.scrollY > 300) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', toggleVisibility);
        return () => {
            window.removeEventListener('scroll', toggleVisibility);
        };
    }, []);

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
