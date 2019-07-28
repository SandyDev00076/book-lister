import React, { Component } from 'react';
import './NavBar.css';
import { FormControl, Badge } from 'react-bootstrap';

export default class NavBarComponent extends Component {
    state = {

    }

    render() {
        return (
            <div className="navbarcontainer">
                <span className="protitle">book-lister <span className="credits">by sanjeet tiwari</span></span>
                <FormControl className="searchbook" placeholder="Search by name and authors.." onChange={(event) => this.getResult(event.target.value)}/>
                <div className="cart" onClick={this.showCart}>
                    <i className="fas fa-shopping-cart"></i>
                    &nbsp;
                    CART
                    &nbsp;
                    <Badge variant="dark">{this.props.cartCount}</Badge>
                </div>
            </div>
        )
    }

    showCart = () => {
        this.props.onShowCart();
    }

    getResult = (queryStr) => {
        this.props.onSearch(queryStr);
    }
}