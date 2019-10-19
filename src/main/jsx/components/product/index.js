import React, { Component } from 'react';
// import Pagination from "react-js-pagination";
import Pagination from "./pagination";


import * as ProductService from '../../services/ProductService.js';
import ProductRows from './productRows.jsx';

class ProductList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            products: [],
            type: 'all',
            category: 'every',
            keyword: '',
            pageNo: 1,
            activePage: 1
        }
        this.handleChangeSelectType = this.handleChangeSelectType.bind(this);
        this.handleChangeSelectCategory = this.handleChangeSelectCategory.bind(this);
        this.handleChangeInput = this.handleChangeInput.bind(this);
        this.handlePageChange = this.handlePageChange.bind(this);

    }


    getProductList(keyword1) {
        const promise = ProductService.getProductList();
        promise.then((products) => {
            this.setState({
                products: products,
                keyword : keyword1
            });
        }).catch(err => {
            console.log(err);
            return;
        })
    }

    handleChangeSelectType(e) {
        this.setState({ type: e.target.value });
    }

    handleChangeSelectCategory(e) {
        this.setState({ category: e.target.value });
    }

    handleChangeInput(e) {
        this.setState({ keyword: e.target.value });
    }

    handlePageChange(pageNumber) {
        console.log(`active page is ${pageNumber}`);
        this.setState({ activePage: pageNumber });
    }

    componentDidMount() {
        var keyword1 = $('#keyword').val();
        this.getProductList(keyword1);
    }

    render() {
        const { type, category, keyword } = this.state;
        var { products, activePage } = this.state;

        products = products.filter((product) => {
            return product.name.indexOf(keyword) > -1;
        });
        if (type != 'all') {
            products = products.filter((product) => {
                return product.type.indexOf(type) > -1;
            });
        }
        if (category != 'every') {
            products = products.filter((product) => {
                return product.category.indexOf(category) > -1;
            });
        }

        var totalItemsCount = products.length;
        if (totalItemsCount < 8) {
            activePage = 1;
        }
        var pageSize = 8;
        var startIndex = (activePage - 1) * pageSize;
        var endIndex = startIndex + pageSize;
        products = products.slice(startIndex, endIndex);
        var totalPages = Math.ceil(totalItemsCount / pageSize);

        return (
            <div className="container">
                {/* <!-- Product Sorting --> */}
                <div className="sorting_bar d-flex flex-md-row flex-column align-items-md-center justify-content-md-start">
                    <div className="sorting_container">
                        <div className="sorting">
                            <select name="type" id="type_form" className="custom-select" value={type} onChange={this.handleChangeSelectType}>
                                <option value="all" >전체</option>
                                <option value="흥정" >흥정</option>
                                <option value="일반">일반</option>
                            </select>
                            <select name="category" id="category_form" className="custom-select" value={category} onChange={this.handleChangeSelectCategory}>
                                <option value="every">전체</option>
                                <option value="전자제품" >전자제품</option>
                                <option value="의류/잡화" >의류/잡화</option>
                                <option value="생활용품" >생활용품</option>
                                <option value="기타" >기타</option>
                            </select>
                        </div>
                    </div>
                    <div className="sorting_container ml-md-auto">
                        <i className="fa fa-search p-3" htmlFor="search"></i>
                        <input type="text" className="search_input" id="search" name="keyword" value={keyword} placeholder="Search" required="required" onChange={this.handleChangeInput} />
                    </div>
                </div>
                <ProductRows products={products} type={type} category={category} keyword={keyword} />
                <Pagination
                    currentPage={activePage}
                    totalPages={totalPages}
                    changeCurrentPage={this.handlePageChange}
                // theme="bottom-border"
                />
            </div>
        );

    }
}
export default ProductList;