import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';


        const Navbar = () => {
            return (
                <nav className="navbar navbar-dark navbar-expand-lg">
                    <div className="container-fluid">
                        <div className="row no-gutters">
                            <div className="col-lg-2">
                                <header>
                                    <a href="./" className="logotype logotype-white" role="banner">Sweco</a>
                                </header>
                            </div>

                            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarExample" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                                <span className="btn-nav-box">
                                    <span className="btn-nav-inner"></span>
                                </span>
                            </button>

                            <div className="col-lg-10">
                                <div className="collapse navbar-collapse" id="navbarExample">
                                    <div className="navbar-nav ml-auto">
                                        <ul className="nav">
                                            <li className="nav-item dropdown">
                                                <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Modeller</a>
                                                <div className="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdown">
                                                    <a className="dropdown-item" href="SGU3">Linjesänka </a>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>
            );
        };

        export default Navbar;