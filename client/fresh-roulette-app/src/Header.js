import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <header>
            <nav className="navbar sticky-top navbar-expand-lg navbar-light" style={{ backgroundColor: '#9ECE1A' }}>
                <div className="container-fluid">
                    <div className="navbar-brand">
                        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                        <p className="logo" style={{ fontSize: '335%', paddingTop: '30px' }}>Fresh</p>
                        <p className="logo" style={{ fontSize: '205%' }}>Roulette</p>
                        </Link>
                    </div>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <Link to="/about" className="btn btn-outline-success me-2" aria-current="page">
                                    About
                                </Link>
                            </li>
                            <li className="nav-item">
                                {/* <a className="nav-link active" aria-current="page" href="#"> */}
                                    <button className="btn btn-outline-success me-2">Reviews & Ratings</button>
                                    {/* </a> */}
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </header>
    );
};


export default Header;
