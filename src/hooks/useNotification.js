import {useState} from "react";

export const UseNotification = () => {
    const [show, setShow] = useState(false);
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");
    return {show, setShow, title, setTitle, message, setMessage};
};