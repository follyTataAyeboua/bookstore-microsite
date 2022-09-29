import React, {useEffect, useState} from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import AuthService from "../../services/auth.service";
import BookService from "../../services/book.service";
import {useNavigate, useSearchParams} from "react-router-dom";
import {Button, Col, Form, InputGroup, Row} from "react-bootstrap";
import {useBetween} from "use-between";
import {UseNotification} from "../../hooks/useNotification";

const PARAMS = {
    'id': 'id',
    'title': 'title',
    'description': 'description',
    'price': 'price'
}

const EditBook = () => {

    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [currentUser, setCurrentUser] = useState(undefined);
    const [id, setId] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState(0);

    const [errors, setErrors] = useState({})
    const [validated, setValidated] = useState(false);

    const {setShow, setMessage} = useBetween(UseNotification);

    useEffect(() => {
        const user = AuthService.getCurrentUser();

        if (user) {
            console.log(user)
            setCurrentUser(user);
        }
    }, []);

    useEffect(() => {
        const currentParams = Object.fromEntries([...searchParams]);

        if (currentParams[PARAMS.id]) {
            setId(currentParams[PARAMS.id]);
        } else {
            setId("");
        }

        if (currentParams[PARAMS.title]) {
            setTitle(currentParams[PARAMS.title]);
        } else {
            setTitle("");
        }

        if (currentParams[PARAMS.description]) {
            setDescription(currentParams[PARAMS.description]);
        } else {
            setDescription("");
        }

        if (currentParams[PARAMS.price]) {
            setPrice(currentParams[PARAMS.price]);
        } else {
            setPrice("");
        }
    }, [searchParams]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const newErrors = findFormErrors()
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setValidated(false);
        } else {
            setValidated(true);

            try {
                if (id) {
                    await BookService.updateBook(id, title, description, price).then((response) => {
                            setShow(true)
                            setMessage("Updated book: " + title);
                            setTimeout(() => {
                                navigate("/")
                                window.location.reload();
                            }, 1000);
                        }, (error) => {
                        console.log(JSON.stringify(error))

                        if (error.message === 'Network Error') {
                                let errorMessage = "Session expired. You will be redirected to login page!";
                                if (error?.response?.data?.responseType === "ERROR") {
                                    errorMessage = error?.response?.data?.message;
                                }
                                setShow(true)
                                setMessage(errorMessage);
                                setTimeout(() => {
                                    AuthService.logout();
                                    navigate("/login");
                                }, 3000);
                            } else {
                                console.log(JSON.stringify(error))
                                let errorMessage = "Unexpected error. Please try again!";
                                if (error?.response?.data[0]?.responseType === "ERROR") {
                                    errorMessage = error?.response?.data[0]?.message;
                                }
                                setShow(true);
                                setMessage(errorMessage);
                            }
                        }
                    );
                } else {
                    await BookService.createBook(title, description, price).then((response) => {
                            setShow(true);
                            setMessage("Created book: " + title);
                            setTimeout(() => {
                                navigate("/home");
                                window.location.reload();
                            }, 3000);

                        }, (error) => {
                            if (error.message === 'Network Error') {

                                let errorMessage = "Session expired. You will be redirected to login page!";
                                if (error?.response?.data[0]?.responseType === "ERROR") {
                                    errorMessage = error?.response?.data[0]?.message;
                                }

                                setShow(true)
                                setMessage(errorMessage);
                                setTimeout(() => {
                                    AuthService.logout();
                                    navigate("/login");
                                }, 3000);
                            } else {

                                let errorMessage = "Unexpected error. Please try again!";
                                if (error?.response?.data[0]?.responseType === "ERROR") {
                                    errorMessage = error?.response?.data[0]?.message;
                                }

                                setShow(true);
                                setMessage(errorMessage);
                            }
                        }
                    );
                }
            } catch (error) {

                if (error.message === 'Network Error') {

                    let errorMessage = "Session expired. You will be redirected to login page!";
                    if (error?.response?.data[0]?.responseType === "ERROR") {
                        errorMessage = error?.response?.data[0]?.message;
                    }

                    setShow(true)
                    setMessage(errorMessage);
                    setTimeout(() => {
                        navigate("/login");
                    }, 3000);
                } else {

                    let errorMessage = "Unexpected error. Please try again!";
                    if (error?.response?.data[0]?.responseType === "ERROR") {
                        errorMessage = error?.response?.data[0]?.message;
                    }

                    setShow(true)
                    setMessage(errorMessage);
                }
            }
        }
    };

    const findFormErrors = () => {
        const newErrors = {}
        // title errors
        if (!title || title === '') newErrors.title = 'Title cannot be blank!'
        else if (title.length < 3) newErrors.title = 'Title is too short!'
        else if (title.length > 255) newErrors.title = 'Title is too long!'

        // description errors
        if (!description || description === '') newErrors.description = 'Description cannot be blank!'
        else if (description.length < 20) newErrors.description = 'Description is too short!'
        else if (description.length > 65535) newErrors.description = 'Description is too long!'

        // price errors
        if (!price) newErrors.price = 'Price cannot be blank!'

        return newErrors
    }

    return (
        <article style={{ padding: "50px" }}>
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <h3>{!id ? "Add new book" : "Update book"}</h3>
                <Row className="mb-3">
                    <Form.Group as={Col} md="6" controlId="title">
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                            required
                            type="text"
                            placeholder="Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            isInvalid={!!errors.title}/>
                        <Form.Control.Feedback type='invalid'>
                            {errors.title}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Row>
                <Row className="mb-3">
                    <Form.Group as={Col} md="6" controlId="Description">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            required
                            type="textarea"
                            as="textarea" rows={3}
                            placeholder="Short description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            isInvalid={!!errors.description}/>
                        <Form.Control.Feedback type='invalid'>
                            {errors.description}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Row>

                <Row className="mb-3">
                    <Form.Group as={Col} md="6" controlId="price">
                        <Form.Label>Price</Form.Label>
                        <InputGroup hasValidation>
                            <InputGroup.Text id="inputGroupPrepend">$</InputGroup.Text>
                            <Form.Control
                                type="number"
                                placeholder="Price"
                                aria-describedby="inputGroupPrepend"
                                required
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                isInvalid={!!errors.price}/>
                            <Form.Control.Feedback type='invalid'>
                                {errors.price}
                            </Form.Control.Feedback>
                        </InputGroup>
                    </Form.Group>
                </Row>

                <Button type="submit">Submit book</Button>
            </Form>
        </article>
    );
}

export default EditBook;
