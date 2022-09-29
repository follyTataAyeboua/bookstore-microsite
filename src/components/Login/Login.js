import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import AuthService from "../../services/auth.service";
import {Button, Col, Form} from "react-bootstrap";
import {UseNotification} from "../../hooks/useNotification";
import {useBetween} from "use-between";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const {setShow, setMessage} = useBetween(UseNotification);
    const [errors, setErrors] = useState({})

    const [validated, setValidated] = useState(false);

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        const newErrors = findFormErrors()
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setValidated(false);
        } else {
            setValidated(true);
            try {
                await AuthService.login(username, password).then(() => {
                        navigate(-1) || navigate('/home');
                        window.location.reload();
                    }, (error) => {

                        let errorMessage = "Username or password incorrect";
                        if (error?.response?.data[0]?.responseType === "ERROR") {
                            errorMessage = error?.response?.data[0]?.message;
                        }

                        setShow(true)
                        setMessage(errorMessage);
                    }
                );
            } catch (error) {

                let errorMessage = "Unexpected error. Please try again!";
                if (error?.response?.data[0]?.responseType === "ERROR") {
                    errorMessage = error?.response?.data[0]?.message;
                }

                setShow(true)
                setMessage(errorMessage);
            }
        }
    }

    const findFormErrors = () => {
        const newErrors = {}
        if (!username || username === '') newErrors.username = 'Username cannot be blank!'
        if (!password || password === '') newErrors.password = 'Password cannot be blank!'

        return newErrors
    }

    return (
        <article style={{ padding: "50px" }}>
            <Form noValidate validated={validated} onSubmit={handleLogin}>
                <h3>Login</h3>

                <Form.Group as={Col} md="4" className="mb-3" controlId="username">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        isInvalid={!!errors.username}/>
                    <Form.Control.Feedback type='invalid'>
                        {errors.username}
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group as={Col} md="4" className="mb-3" controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        isInvalid={!!errors.password}/>
                    <Form.Control.Feedback type='invalid'>
                        {errors.password}
                    </Form.Control.Feedback>
                </Form.Group>

                <Button variant="primary" type="submit">Submit</Button>
            </Form>
        </article>
    );
};

export default Login;