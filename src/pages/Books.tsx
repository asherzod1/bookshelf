import React, {useEffect, useState} from 'react';
import "./books.css"
import {DeleteOutlined, EditOutlined, LogoutOutlined, PlusOutlined, UserOutlined} from "@ant-design/icons";
import axios from "axios";
import {BASE_URL, getKey, getSecret} from "../api/host";
import {MD5} from "crypto-js";
import {Input, message, Modal, Select, Spin} from 'antd';
import {useNavigate} from "react-router-dom";


interface Book {
    "id": number,
    "isbn": string,
    "title": string,
    "cover": string,
    "author": string,
    "published": number,
    "pages": number
}

interface BookType {
    book: Book;
    status: number;
}

interface User{
    id: number,
    name: string,
    email: string,
    key: string,
    secret: string
}
const signInGenerator = (method:string, url:string, data:object | null) => {
    if(data !== null){
        return MD5(method + url + JSON.stringify(data) + getSecret()).toString()
    }
    return MD5(method + url + getSecret()).toString()
}

const Books: React.FC = () => {
    const [books, setBooks] = React.useState([])
    const [createBookModal, setCreateBookModal] = useState(false);
    const [editBookModal, setEditBookModal] = useState(false);
    const [editBookId, setEditBookId] = useState(0);
    const [editBookStatus, setEditBookStatus] = useState('');
    const [isbn, setIsbn] = useState('')
    const [loading, setLoading] = useState(true)
    const [searchBooks, setSearchBooks] = useState([])
    const [user, setUser] = useState<User>({
        id: 0,
        name: '',
        email: '',
        key: '',
        secret: ''
    })
    const [title, setTitle] = useState('Your Books')
    const showCreateBookModal = () => {
        setCreateBookModal(true);
    };

    const getBooks = () => {
        setLoading(true)
        axios.get(`${BASE_URL}/books`, {headers: {
                Key: getKey().toString(),
                Sign: signInGenerator('GET', '/books', null)
            }}).then(res => {
            console.log(res.data)
            setBooks(res.data.data)
            setLoading(false)
        })
            .catch((err)=>{
                if(err.config.status === 401){
                    message.error("Unauthorized")
                }
                message.error("Connection problem or Server error")
            })
    }

    const postBook = (newIsbn:string, callback:()=>void) => {
        if(newIsbn === ''){
            return message.error("Please enter isbn")
        }
        axios.post(`${BASE_URL}/books`, {"isbn":newIsbn}, {headers: {
                Key: getKey().toString(),
                Sign: signInGenerator('POST', '/books', {"isbn":newIsbn})
            }}).then(res => {
            console.log(res)
            message.success("Book Added Successfully")
            // setCreateBookModal(false);
            callback()
            setIsbn('')
        })
            .catch((error)=>{
                console.log(error)
                message.error(error.response.data?.message)
            })
    }

    const createBook = () => {
        postBook(isbn, getBooks)
        setCreateBookModal(false);
    };

    const cancelCreateBook = () => {
        setCreateBookModal(false);
        setIsbn('')
    };

    const showEditBookModal = (id:number, status:number) => {
        console.log(editBookStatus)
        setEditBookModal(true);
        setEditBookId(id)
        setEditBookStatus(status.toString())
    };

    const editBook = () => {
        console.log(isbn)
        axios.patch(`${BASE_URL}/books/${editBookId}`, {"status":Number(editBookStatus)}, {headers: {
                Key: getKey().toString(),
                Sign: signInGenerator('PATCH', `/books/${editBookId}`, {"status":Number(editBookStatus)})
            }}).then(res => {
            console.log(res)
            message.success("Book Edited Successfully")
            getBooks()
            setEditBookModal(false);
            setEditBookId(0)
            setEditBookStatus('')
        })
            .catch(()=>{
                message.error("Connection problem or Server error")
            })

    };
    const cancelEditBook = () => {
        setEditBookModal(false);
    };

    const isbnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIsbn(e.target.value)
        console.log(e.target.value)
    }

    const bookStatusChange = (value: string) => {
        console.log(`selected ${value}`);
        setEditBookStatus(value)
    };

    const getUserMe = () => {
        axios.get(`${BASE_URL}/myself`, {headers: {
                Key: getKey().toString(),
                Sign: signInGenerator('GET', '/myself', null)
            }}).then(res => {
            console.log(res.data)
            setUser(res.data.data)
        })
            .catch((err)=>{
                if(err.config.status === 401){
                    message.error("Unauthorized")
                }
                message.error("Connection problem or Server error")
            })
    }
    const  deleteBook = (id:number) => {
        axios.delete(`${BASE_URL}/books/${id}`, {headers: {
                Key: getKey().toString(),
                Sign: signInGenerator('DELETE', `/books/${id}`, null)
            }}).then(res => {
            console.log(res.data)
            message.success("Book Deleted Successfully")
            getBooks()
        })
            .catch(()=>{
                message.error("Connection problem or Server error")
            })
    }

    const [searchValue, setSearchValue] = useState('')
    const searchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(e.target.value === ''){
            getBooks()
            setTitle('Your Books')
        }
        setSearchValue(e.target.value)
    }
    const searchBook = () => {
        setLoading(true)
        console.log(searchValue)
        axios.get(`${BASE_URL}/books/${searchValue}`, {headers: {
                Key: getKey().toString(),
                Sign: signInGenerator('GET', `/books/${searchValue}`, null)
            }}).then(res => {
            console.log(res)
            setSearchBooks(res.data.data)
            setLoading(false)
            setTitle(`Search Result for ${searchValue}`)
        })
    }
    const navigate = useNavigate()
    const logout = () => {
        localStorage.removeItem('key')
        localStorage.removeItem('secret')
        navigate("/")
    }

    useEffect(()=>{
        getUserMe()
        getBooks()
    },[])
    return (
        <div>
            <nav className="navbar navbar-light justify-content-between mt-3">
                <div className="container">
                    <h2 className="navbar-brand">Hello <i style={{color:"#00A000"}}>{user.name}</i> welcome to Bookshelf! Your email: {user.email}</h2>
                    <div className="d-flex user-me">
                        <button className="btn user-me-button"><UserOutlined /></button>
                        <div className="user-dropdown">
                            <button onClick={()=>logout()} className="btn btn-danger d-flex align-items-center"><LogoutOutlined /></button>
                        </div>
                    </div>
                </div>
            </nav>
            <div className="container">
                <div className="d-flex justify-content-between mb-4 align-items-end">
                    <h3 className="books-header text-center mt-4 mb-1">
                        {title}:
                    </h3>
                    <div className="d-flex align-items-end">
                        <input onChange={(e)=>searchChange(e)} className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" />
                        <button onClick={()=>searchBook()} className="btn btn-outline-success my-2 my-sm-0 mx-2" type="submit">Search</button>
                        <button className="btn btn-success" onClick={()=>showCreateBookModal()}>
                            AddBook
                        </button>
                    </div>
                </div>
                {
                    loading ?
                        <div className="d-flex justify-content-center align-items-center" style={{height:"50vh"}}>
                            <div>
                                <Spin spinning={loading} size="large" />
                            </div>
                        </div>
                        :
                        <div className="card-deck">
                            {
                                title !== "Your Books" ?
                                    searchBooks?.map((book:Book) => (
                                        <div className="card">
                                            <div className="card__img">
                                                <img style={{width:'100%'}} className="card-img-top" src={book?.cover} alt="This book doesn't have cover" />
                                            </div>
                                            <div className="card-body">
                                                <h5 className="card-title">{book?.title}</h5>
                                                <p className="card-text">Author: {book?.author}</p>
                                                <p className="card-text">ISBN: {book?.isbn}</p>
                                            </div>
                                            <div className="card-footer">
                                                <div className="d-flex justify-content-between">
                                                    <button onClick={()=>postBook(book?.isbn, ()=>{})} className="btn btn-success w-100 d-flex align-items-center justify-content-center">
                                                        <PlusOutlined style={{marginRight:"10px"}} /> Add to my bookshelf
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                    : books?.length < 1 ?
                                        <h5 className="d-flex justify-content-center mt-5"> You have no books yet</h5>
                                    :
                                    books?.map((book:BookType) => (
                                        <div className="card">
                                            <div className="card__img">
                                                <div className={`status status${book.status}`}>
                                                    {book.status === 0 ? "New" : book.status === 1 ? "Reading" : "Finished"}
                                                </div>
                                                <img style={{width:'100%'}} className="card-img-top" src={book?.book?.cover} alt="This book doesn't have cover" />
                                            </div>
                                            <div className="card-body">
                                                <h5 className="card-title">{book?.book?.title}</h5>
                                                <p className="card-text">Author: {book?.book?.author}</p>
                                                <p className="card-text">ISBN: {book?.book?.isbn}</p>
                                            </div>
                                            <div className="card-footer">
                                                <div className="d-flex justify-content-between">
                                                    <button onClick={()=>showEditBookModal(book.book.id, book.status)} className="btn btn-warning d-flex align-items-center">
                                                        <EditOutlined />
                                                    </button>
                                                    <button onClick={()=>deleteBook(book.book.id)} className="btn btn-danger d-flex align-items-center">
                                                        <DeleteOutlined />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                            }
                        </div>
                }
            </div>
            <Modal title="Enter book isbn" open={createBookModal} onOk={createBook} onCancel={cancelCreateBook} centered>
                <Input value={isbn} onChange={(e)=>isbnChange(e)} placeholder="Enter book isbn" ></Input>
            </Modal>
            <Modal title="Change book status" open={editBookModal} onOk={editBook} onCancel={cancelEditBook} centered>
                <Select
                    value={editBookStatus}
                    style={{ width: 120 }}
                    onChange={bookStatusChange}
                    options={[
                        { value: '0', label: 'New' },
                        { value: '1', label: 'Reading' },
                        { value: '2', label: 'Finished' },
                    ]}
                />
            </Modal>
        </div>

    );
}

export default Books;
