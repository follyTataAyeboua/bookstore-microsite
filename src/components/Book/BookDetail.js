import React, {useState} from "react";
import {Button, Card, Modal} from "react-bootstrap";
import {AiFillDelete} from "react-icons/ai";
import { BsFillPenFill} from "react-icons/bs";
import {FcViewDetails} from "react-icons/fc";
import BookService from "../../services/book.service";
import {useNavigate} from "react-router-dom";
import {useBetween} from "use-between";
import {UseNotification} from "../../hooks/useNotification";

const BookDetail = (props) => {

    const navigate = useNavigate();

    const {book, user, view = false} = props
    const [currentBook] = useState(book);
    const [currentUser] = useState(user);
    const [currentView] = useState(view);
    const [showBookDetailModal, setShowBookDetailModal] = useState(false);

    const {setShow, setMessage} = useBetween(UseNotification);

    const handleCloseBookDetailModal = () => setShowBookDetailModal(false);
    const handleShowBookDetailModal = (book) => {
        navigate("/book/view?id=" + book.id);
    }

    const handleDelete = (currentBook) => {
        BookService.deleteBook(currentBook?.id).then((response) => {
            setShow(true)
            setMessage("Deleted book " + currentBook?.title);
            setTimeout(() => {
                navigate("/")
                window.location.reload();
            }, 1000);

        }, (error) => {
            console.log(JSON.stringify(error))
            let errorMessage = "Unable to delete book " + currentBook?.title + ". Please try again!"
            if(error?.response?.data[0]?.responseType === "ERROR") {
                errorMessage = error?.response?.data[0]?.message;
            }
            setShow(true)
            setMessage(errorMessage);
        });
    }

    return (
        <div>
            <Card style={{width: 'auto', marginTop: '1.8rem'}}>
                <Card.Body>
                    <Card.Title><strong>Title:</strong> {currentBook.title}</Card.Title>
                    <Card.Subtitle><strong>Author:</strong> {currentBook?.authorDto?.firstname} {currentBook?.authorDto?.lastname}
                    </Card.Subtitle>
                    <Card.Subtitle className="mb-2 text-muted">
                        <strong>Price:</strong><span>${currentBook.price}</span>
                    </Card.Subtitle>
                    <Card.Text>
                        <strong>Description:</strong> {currentBook.description}
                    </Card.Text>
                </Card.Body>
                <Card.Body>
                    {currentUser && currentBook.authorDto.username === currentUser.username &&
                    <div>
                        {currentView &&
                        <Card.Link
                            onClick={() => handleShowBookDetailModal(currentBook)}><FcViewDetails/></Card.Link>}
                        <Card.Link
                            href={"/book/edit?id=" + currentBook?.id + "&title=" + currentBook?.title + "&description=" + currentBook?.description + "&price=" + currentBook?.price}><BsFillPenFill/></Card.Link>
                        <Card.Link onClick={() => handleDelete(currentBook)}><AiFillDelete/></Card.Link>
                    </div>
                    }
                    {((!currentUser || currentBook.authorDto.username !== currentUser.username && currentView) &&
                        <Card.Link onClick={() => handleShowBookDetailModal(currentBook)}><FcViewDetails/></Card.Link>)}

                </Card.Body>
            </Card>

            <Modal show={showBookDetailModal} onHide={handleCloseBookDetailModal} size="lg"
                   aria-labelledby="contained-modal-title-vcenter"
                   centered>
                <Modal.Header closeButton>
                    <Modal.Title>{currentBook?.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Card>
                        <Card.Body>
                            <Card.Title>{currentBook?.authorDto?.firstname} {currentBook?.authorDto?.lastname}</Card.Title>
                            <Card.Subtitle className="mb-2 text-muted">${currentBook?.price}</Card.Subtitle>
                            <Card.Text>{currentBook?.description} </Card.Text>
                        </Card.Body>
                        <Card.Body>
                            {currentUser && currentBook?.authorDto?.username === currentUser.username &&
                            <div>
                                <Card.Link
                                    href={"/book/edit?id=" + currentBook?.id + "&&title=" + currentBook?.title + "&description=" + currentBook?.description}>
                                    <BsFillPenFill/>
                                </Card.Link>
                                <Card.Link onClick={() => handleDelete(currentBook)}><AiFillDelete/></Card.Link>
                            </div>
                            }
                        </Card.Body>
                    </Card>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseBookDetailModal}>Close</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default BookDetail;