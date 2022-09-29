import React, {useState} from "react";
import AuthService from "../../services/auth.service";
import {useNavigate} from "react-router-dom";
import {Button, Col, Form, InputGroup, Row} from "react-bootstrap";
import {useBetween} from "use-between";
import {UseNotification} from "../../hooks/useNotification";

const Signup = () => {

    const [username, setUsername] = useState("");
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [errors, setErrors] = useState({})
    const [validated, setValidated] = useState(false);

    const navigate = useNavigate();
    const {setShow, setMessage} = useBetween(UseNotification);

    const findFormErrors = () => {
        const newErrors = {}
        // username errors
        if (!username || username === '') newErrors.username = 'Username cannot be blank!'
        else if (username.length < 3) newErrors.username = 'Username is too short!'
        else if (username.length > 20) newErrors.username = 'Username is too long!'

        // firstname errors
        if (!firstname || firstname === '') newErrors.firstname = 'First name cannot be blank!'
        else if (firstname.length < 3) newErrors.firstname = 'First name is too short!'
        else if (firstname.length > 20) newErrors.firstname = 'First name is too long!'

        // lastname errors
        if (!lastname || lastname === '') newErrors.lastname = 'Last name cannot be blank!'
        else if (lastname.length < 3) newErrors.lastname = 'Last name is too short!'
        else if (lastname.length > 20) newErrors.lastname = 'Last name is too long!'

        // email errors
        const regEx = /[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,8}(.[a-z{2,8}])?/g;
        if (!email || email === '') newErrors.email = 'Email cannot be blank!'
        else if (!regEx.test(email)) newErrors.email = 'Email is not valid!'

        // password errors
        const strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
        if (!password || password === '') newErrors.password = 'Password cannot be blank!'
        else if (!strongRegex.test(password)) newErrors.password = 'Password must contain at least 1 lowercase, 1 uppercase, 1 digit and 1 special character, alphabetical character!'

        // confirm password errors
        if (!confirmPassword || confirmPassword.localeCompare(password) !== 0) newErrors.confirmPassword = 'Passwords are different!'

        return newErrors
    }

    const handleSignup = async (e) => {
        e.preventDefault();

        const newErrors = findFormErrors()
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setValidated(false);
        } else {
            setValidated(true);
            try {
                await AuthService.signup(username, firstname, lastname, email, password).then((response) => {
                        setShow(true)
                        setMessage("Welcome onboard " + firstname + " " + lastname);
                        setTimeout(() => {
                            navigate("/home");
                            window.location.reload();
                        }, 1000);
                    }, (error) => {

                        let errorMessage = "Unexpected error. Please try again!";
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

    return (
        <article style={{ padding: "50px" }}>
            <Form noValidate validated={validated} onSubmit={handleSignup}>
                <h3>Sign up</h3>

                <Row className="mb-3">
                    <Form.Group as={Col} md="5" controlId="username">
                        <Form.Label>Username</Form.Label>
                        <Form.Control
                            required
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            isInvalid={!!errors.username}/>
                        <Form.Control.Feedback type='invalid'>
                            {errors.username}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Row>

                <Row className="mb-3">
                    <Form.Group as={Col} md="5" controlId="firstname">
                        <Form.Label>First name</Form.Label>
                        <Form.Control
                            required
                            type="text"
                            placeholder="firstname"
                            value={firstname}
                            onChange={(e) => setFirstname(e.target.value)}
                            isInvalid={!!errors.firstname}/>
                        <Form.Control.Feedback type='invalid'>
                            {errors.firstname}
                        </Form.Control.Feedback> </Form.Group>
                </Row>

                <Row className="mb-3">
                    <Form.Group as={Col} md="5" controlId="lastname">
                        <Form.Label>Last name</Form.Label>
                        <Form.Control
                            required
                            type="text"
                            placeholder="lastname"
                            value={lastname}
                            onChange={(e) => setLastname(e.target.value)}
                            isInvalid={!!errors.lastname}/>
                        <Form.Control.Feedback type='invalid'>
                            {errors.lastname}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Row>

                <Row className="mb-3">
                    <Form.Group as={Col} md="5" controlId="email">
                        <Form.Label>Email</Form.Label>
                        <InputGroup hasValidation>
                            <InputGroup.Text id="inputGroupPrepend">@</InputGroup.Text>
                            <Form.Control
                                type="text"
                                placeholder="Email"
                                aria-describedby="inputGroupPrepend"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                isInvalid={!!errors.email}/>
                            <Form.Control.Feedback type='invalid'>
                                {errors.email}
                            </Form.Control.Feedback>
                        </InputGroup>
                    </Form.Group>
                </Row>

                <Row className="mb-3">
                    <Form.Group as={Col} md="5" controlId="password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            required
                            type="password"
                            placeholder="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            isInvalid={!!errors.password}/>
                        <Form.Control.Feedback type='invalid'>
                            {errors.password}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Row>

                <Row className="mb-3">
                    <Form.Group as={Col} md="5" controlId="confirmPassword">
                        <Form.Label>Confirm password</Form.Label>
                        <Form.Control
                            required
                            type="password"
                            placeholder="Confirm password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            isInvalid={!!errors.confirmPassword}/>
                        <Form.Control.Feedback type='invalid'>
                            {errors.confirmPassword}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Row>

                <Button type="submit">Sign up</Button>
            </Form>
        </article>
    );
};

export default Signup;