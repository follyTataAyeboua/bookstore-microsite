import React, {useEffect, useState} from "react";
import BookService from "../../services/book.service";
import {useNavigate, useSearchParams} from "react-router-dom";
import AuthService from "../../services/auth.service";
import BookDetail from "./BookDetail";
import {useBetween} from "use-between";
import {UseNotification} from "../../hooks/useNotification";


const PARAMS = {
    'id': 'id'
}

const ViewBook = () => {

    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const {setShow, setMessage} = useBetween(UseNotification);

    const [currentBook, setCurrentBook] = useState(undefined);
    const [currentUser, setCurrentUser] = useState(undefined);


    useEffect(() => {
        const user = AuthService.getCurrentUser();
        if (user) {
            setCurrentUser(user);
        }
    }, []);

    useEffect(() => {
        const currentParams = Object.fromEntries([...searchParams]);

        if (currentParams[PARAMS.id]) {
            BookService.readBook(currentParams[PARAMS.id]).then((response) => {
                setCurrentBook(response.data);
            }).catch(error => {

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
                    }, 1000);
                } else {

                    let errorMessage = "Unexpected error. Please try again!";
                    if (error?.response?.data[0]?.responseType === "ERROR") {
                        errorMessage = error?.response?.data[0]?.message;
                    }

                    setShow(true)
                    setMessage(errorMessage);
                }

            })
        } else {
            navigate("/home");
        }
    }, [searchParams]);

    return (
        <article style={{ padding: "50px" }}>
            <h3>Book Details</h3>
            {currentBook && currentUser ? <BookDetail book={currentBook} user={currentUser}/> : <div></div>}
        </article>
    );
};

export default ViewBook;
