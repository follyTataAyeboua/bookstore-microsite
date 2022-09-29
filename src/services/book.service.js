import api from "./api";

const getBookCount = () => {
    return api.get("/api/book/count");
};

const getAllBooks = (page = 0, sizePerPage = 0) => {
    return api.get("/api/book/books?page=" + page + "&size=" + sizePerPage);
};

const createBook = (title, description, price) => {
    return api.post("/api/book/create", {title, description, price}).then((response) => {
        return response.data;
    });
};

const readBook = (id) => {
    return api.get("/api/book/" + id);
};

const updateBook = (id, title, description, price) => {
    return api.put("/api/book/update", {id, title, description, price}).then((response) => {
        return response.data;
    });
};

const deleteBook = (id) => {
    return api.delete("/api/book/delete/" + id).then((response) => {
        return response.data;
    });
};

const BookService = {
    getBookCount,
    getAllBooks,
    createBook,
    readBook,
    updateBook,
    deleteBook
};

export default BookService;