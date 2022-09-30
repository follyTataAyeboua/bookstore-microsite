import React, {useEffect, useState} from "react";
import BookService from "../../services/book.service";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.css';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import filterFactory from 'react-bootstrap-table2-filter';
import {MdExpandMore, MdOutlineExpandLess} from "react-icons/md";
import AuthService from "../../services/auth.service";
import BookDetail from "../Book/BookDetail";
import {useBetween} from "use-between";
import {UseNotification} from "../../hooks/useNotification";
import ToolkitProvider, {Search} from 'react-bootstrap-table2-toolkit';

const {SearchBar} = Search;

const Home = () => {
    const {setShow, setMessage} = useBetween(UseNotification);

    const [books, setBooks] = useState([]);
    const [currentUser, setCurrentUser] = useState(undefined);

    useEffect(() => {
        const user = AuthService.getCurrentUser();

        if (user) {
            setCurrentUser(user);
        }
    }, []);

    useEffect(() => {
        try {
            BookService.getAllBooks().then((response) => {
                    setBooks(response.data);
                }, (error) => {

                    let errorMessage = "Unexpected error. Pleaser try again!";
                    if (error?.response?.data[0]?.responseType === "ERROR") {
                        errorMessage = error?.response?.data[0]?.message;
                    }

                    setShow(true)
                    setMessage(errorMessage);
                    setBooks([]);
                }
            );
        } catch (error) {

            let errorMessage = "Unexpected error. Pleaser try again!";
            if (error?.response?.data[0]?.responseType === "ERROR") {
                errorMessage = error?.response?.data[0]?.message;
            }

            setShow(true)
            setMessage(errorMessage);
            setBooks([]);
        }

    }, []);

    const columns = [{
        dataField: 'title',
        text: 'Title',
        sort: true
    }, {
        dataField: 'price',
        text: 'Price',
        formatter: priceFormatter,
        sort: true
    }, {
        dataField: 'authorDto',
        text: 'Author',
        formatter: authorFormatter,
        sort: true
    }];

    const expandRow = {
        renderer: row => (
            <BookDetail book={row} user={currentUser} view={true}/>
        ),
        showExpandColumn: true,
        expandHeaderColumnRenderer: ({isAnyExpands}) => {
            if (isAnyExpands) {
                return <b><MdOutlineExpandLess/></b>;
            }
            return <b><MdExpandMore/></b>;
        },
        expandColumnRenderer: ({expanded}) => {
            if (expanded) {
                return (
                    <b>-</b>
                );
            }
            return (
                <b>...</b>
            );
        }
    };

    function priceFormatter(cell, row) {
        return (
            <span>$ {cell} </span>
        );
    }

    function authorFormatter(cell, row) {
        return (<span>{row.authorDto.firstname} {row.authorDto.lastname} </span>);
    }

    return (

        <article style={{ padding: "50px" }}>

            <ToolkitProvider
                bootstrap4
                keyField="id"
                data={books}
                columns={columns}
                filter={filterFactory()}
                search>
                {
                    props => (
                        <div>
                            <h3>List of books</h3>
                            <SearchBar {...props.searchProps}  style={{width: '75rem', margin:'auto'}} srText={"Search book by title"}/>
                            <hr/>
                            <BootstrapTable
                                {...props.baseProps}
                                noDataIndication="No Book found"
                                expandRow={expandRow}
                                pagination={paginationFactory({sizePerPage: 5})}/>
                        </div>
                    )
                }
            </ToolkitProvider>
        </article>
    );
};

export default Home;