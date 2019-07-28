import React, { Component } from 'react';
import './ListPage.css';
// import axios from 'axios';
import books from '../../assets/books.json';
import StarRatings from 'react-star-ratings';
import { Button, Modal, Dropdown } from 'react-bootstrap';
import NavBarComponent from '../NavBar/NavBar';

export default class ListPage extends Component {
    state = {
        books: [],
        booksToDisplay: [],
        limit: 100,
        offset: 0,
        cartCount: 0,
        showCartFlag: false
    }

    render() {
        return (
            <div className="listcontainer">
                <NavBarComponent onSearch={this.searchAccordingTo} cartCount={this.state.cartCount} onShowCart={this.showCart}/>
                <div className="upperpanel">
                    <span>
                        Showing {this.state.offset*this.state.limit} - {(this.state.offset*this.state.limit) + 99} from {this.state.books.length}
                    </span>
                    <div className="workpanel">
                        <Dropdown>
                            <Dropdown.Toggle variant="primary" id="dropdown-basic">
                                Sort By
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item onClick={() => this.sortBooksBy('title')}>Title</Dropdown.Item>
                                <Dropdown.Item onClick={() => this.sortBooksBy('ratings')}>Ratings</Dropdown.Item>
                                <Dropdown.Item onClick={() => this.sortBooksBy('authors')}>Authors</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                        &nbsp;
                        <Button variant="info" onClick={this.goToPreviousPage} disabled={(this.state.offset === 0)}>
                            <i className="fas fa-chevron-left"></i>
                            &nbsp;
                            Previous Page
                        </Button>
                        &nbsp;
                        <Button variant="success" onClick={this.goToNextPage} disabled={((this.state.offset + this.state.limit) > this.state.books.length)}>
                            Next Page
                            &nbsp;
                            <i className="fas fa-chevron-right"></i>
                        </Button>
                    </div>
                </div>
                {this.state.booksToDisplay.map(book => {
                    if (book)
                    return (
                        <div className="book" key={book.isbn}>
                            <div className="namingdetails">
                                <span className="language">{(book.language_code === 'eng') ? 'English' : (book.language_code === 'en-US') ? 'English-US' : book.language_code}</span>
                                <br />
                                <span className="booktitle">{book.title}</span>
                                <br />
                                <span style={{ color: 'grey' }}>by</span> <span className="authors">{book.authors}</span>
                            </div>
                            <div className="ratingdetails">
                                {(typeof(book.average_rating) === 'number') ? 
                                <StarRatings
                                rating={book.average_rating}
                                starRatedColor="blue"
                                numberOfStars={5}
                                starDimension="30px"
                                starSpacing="5px"
                                />
                                : null }
                                <br />
                                <span className="avgrating">{book.average_rating}</span>
                                &nbsp;
                                <span className="ratingcount">({book.ratings_count})</span>
                            </div>
                            <div className="pricingdetails">
                                <span className="bookprice">&#x20B9;{book.price}</span>
                                <br />
                                {(book.added_to_cart)
                                ?
                                <Button variant="outline-success" onClick={() => this.removeFromCart(book)}>
                                    <i className="fas fa-check"></i>
                                    &nbsp;
                                    Added To Cart
                                </Button> 
                                :
                                <Button variant="outline-info" onClick={() => this.addToCart(book)}>
                                    <i className="fas fa-shopping-cart"></i>
                                    &nbsp;
                                    Add To Cart
                                </Button>}
                            </div>
                        </div>
                    )
                })}
                <Modal show={this.state.showCartFlag} onHide={this.hideCart}>
                    <Modal.Header>
                        <Modal.Title>
                            <i className="fas fa-shopping-cart"></i>
                            &nbsp;
                            Your Cart
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <span className="cartcount">{this.state.cartCount}</span> books in the cart.
                        <br />
                        {this.state.books.filter(book => book.added_to_cart).map(book => {
                            return (
                                <div className="cartbook">
                                    <div className="cartbookdetails">
                                        {book.title}
                                        <br />
                                        by <span className="cartbookauthors">{book.authors}</span>
                                    </div>
                                    <div className="cartbookactions">
                                        <span className="cartbookprice">&#x20B9;{book.price}</span>
                                        &nbsp;
                                        <div className="delcartbook" onClick={() => this.removeFromCart(book)}>
                                            <i className="fas fa-trash-alt"></i>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </Modal.Body>
                    <Modal.Footer>
                        <div className="cartfooter">
                            <Button variant="danger" onClick={this.hideCart}>Close</Button>
                            <Button variant="success" onClick={this.checkOut} disabled={(this.state.cartCount === 0)}>
                                <span>&#x20B9;{this.getTotalPrice()}</span>
                                &nbsp;- Checkout
                            </Button>
                        </div>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }

    componentDidMount() {
        // Since CORS is not handled on the backend resource, 
        // it will not allow it to call the requested resource
        // axios.get('http://starlord.hackerearth.com/books').then(res => {
        //     console.log(res);
        // });
        // rather displaying from the downloaded json.
        this.getBooks(books);
    }

    renderNewBooks = () => {
        let booksToDisplay = [];
        let { offset, limit } = this.state;
        const startIndex = offset*limit;
        for (let i = startIndex; i < startIndex + this.state.limit; i++) {
            booksToDisplay.push(this.state.books[i]);
        }
        this.setState({ booksToDisplay });
    }

    searchAccordingTo = (queryStr) => {
        if (!queryStr) this.getBooks(books);
        else {
            let booksAfterSearching = books.filter(book => {
                const booktitle = book.title.toString().toLowerCase();
                const authors = book.authors.toString().toLowerCase();
                if (booktitle.includes(queryStr.toLowerCase()) || authors.includes(queryStr.toLowerCase()))
                    return true;
                else return false;
            });
            this.getBooks(booksAfterSearching);
        }
    }

    getBooks = (books) => {
        this.setState({ books }, () => {
            this.renderNewBooks();
        });
    }

    addToCart = (book) => {
        let books = this.state.books;
        const toAdd = books.findIndex(b => b.isbn === book.isbn);
        books[toAdd].added_to_cart = true;
        this.getBooks(books);
        this.setState({ cartCount: this.state.cartCount + 1 });
    }

    removeFromCart = (book) => {
        let books = this.state.books;
        const toAdd = books.findIndex(b => b.isbn === book.isbn);
        books[toAdd].added_to_cart = false;
        this.getBooks(books);
        this.setState({ cartCount: this.state.cartCount - 1 });
    }

    showCart = () => {
        this.setState({ showCartFlag: true });
    }

    hideCart = () => {
        this.setState({ showCartFlag: false });
    }

    checkOut = () => {
        this.hideCart();
    }

    getTotalPrice = () => {
        let sum = 0;
        this.state.books.filter(book => book.added_to_cart).forEach(book => {
            sum += book.price;
        }, this);
        return sum;
    }

    sortBooksBy = (key) => {
        let sortedBooks = [];
        switch(key) {
            case 'title': {
                sortedBooks = this.state.books.sort((a, b) => a.title.toString().localeCompare(b.title.toString()));
            }
            break;
            case 'ratings': {
                sortedBooks = this.state.books.sort((a, b) => b.average_rating - a.average_rating);
            }
            break;
            case 'authors': {
                sortedBooks = this.state.books.sort((a, b) => a.authors.toString().localeCompare(b.authors.toString()));
            }
            break;
            default: console.error('Invalid sorting parameter');
        }
        this.getBooks(sortedBooks);
    }

    goToNextPage = () => {
        this.setState({ offset: this.state.offset + 1 }, () => {
            this.renderNewBooks();
        });
    }

    goToPreviousPage = () => {
        this.setState({ offset: this.state.offset - 1 }, () => {
            this.renderNewBooks();
        });
    }
}