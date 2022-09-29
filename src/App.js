import React, {useEffect, useState} from "react";
import {Link, Navigate, Route, Routes, useNavigate} from "react-router-dom";
import { useBetween } from "use-between";
import AuthService from "./services/auth.service";
import Login from "./components/Login/Login";
import Signup from "./components/Signup/Signup";
import Home from "./components/Home/Home";
import "bootstrap/dist/css/bootstrap.min.css";
import EditBook from "./components/Book/EditBook";
import ViewBook from "./components/Book/ViewBook";
import Toast from "react-bootstrap/Toast";
import ToastContainer from 'react-bootstrap/ToastContainer';

import {UseNotification} from "./hooks/useNotification";
import NotFound from "./components/Missing/NotFound";


function App() {

    const [currentUser, setCurrentUser] = useState(undefined);
    const { show, setShow, message } = useBetween(UseNotification);


    const navigate = useNavigate();

    useEffect(() => {
        const user = AuthService.getCurrentUser();

        if (user) {
            setCurrentUser(user);
        }
    }, []);

    const logOut = () => {
        AuthService.logout();
        navigate('/home');
    };

    return (
        <div>
            <nav className="navbar navbar-expand navbar-green bg-light">
                <div className="navbar-nav mr-auto">
                    <li className="nav-item">
                        <Link to={"/home"} className="nav-link">BookStore</Link>
                    </li>

                    {currentUser && (
                        <li className="nav-item">
                            <Link to={"/book/edit"} className="nav-link">Add book</Link>
                        </li>
                    )}
                </div>

                {currentUser ? (
                    <div className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <span className="nav-link">Hi {currentUser.username}!</span>
                        </li>
                        <li className="nav-item">
                            <a href={"/logout"} className="nav-link" onClick={logOut}>
                                Logout
                            </a>
                        </li>
                    </div>
                ) : (
                    <div className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <Link to={"/login"} className="nav-link">
                                Login
                            </Link>
                        </li>

                        <li className="nav-item">
                            <Link to={"/signup"} className="nav-link">
                                Sign up
                            </Link>
                        </li>
                    </div>
                )}
            </nav>

            <div className="container mt-3" >
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/home" element={<Home/>}/>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/logout" element={<Navigate to="/home"/>}/>
                    <Route path="/signup" element={<Signup/>}/>
                    <Route path="/book/edit" element={<EditBook/>}/>
                    <Route path="/book/view" element={<ViewBook/>}/>
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </div>

            <ToastContainer position="top-end" className="p-3">
                    <Toast onClose={() => setShow(false)} show={show} delay={3000} autohide className="p-3" position={'top-start'}>
                        <Toast.Body>{message}</Toast.Body>
                    </Toast>
            </ToastContainer>
        </div>
    );
}

export default App;
