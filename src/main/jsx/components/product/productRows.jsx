import React, { Component, Fragment } from 'react';

import dateFormat from 'dateformat';
import NumberFormat from 'react-number-format';

class ProductRows extends Component {
    render() {
        const { products,type, category, keyword, pageNo } = this.props;
        var productRows;

        
        if (products.length <= 0) {
            productRows =
                <div className="align-items-center text-center py-5 col-12">
                    등록된 상품이 없습니다.
                </div>
        } else {
            productRows = products.map(product => {

                return (
                    // <!-- Product -->
                    <div className="product col-3" key={product.productNo}>
                        <div className="product_image" >
                            <img src={`/files/product-files/${product.file.saveFileName}`} />
                        </div>
                        <div className={`product_extra product_${product.type == '흥정' ? 'sale' : 'hot'}`}>
                            <a href="categories">{product.type == '흥정' ? '흥정' : '일반'}</a>
                        </div>
                        <div className="product_content">
                            <div className="row justify-content-between">
                                <a className="col" href={`/member/store/${product.seller}`} style={{ color: 'gray' }}>{product.sellerNick}</a>
                                <div className="text-right col">{dateFormat(product.regDate, 'yyyy-mm-dd')}</div>
                            </div>
                            <div className="row justify-content-between">
                                <div className="text-right col">{product.category}</div>
                            </div>
                            <div className="row justify-content-between">
                                <div className="product_title col title" >
                                    <a href={`/product/detail/${product.productNo}`}>{product.name}</a>
                                </div>
                                <div className="product_price col"><NumberFormat value={product.price} displayType="text" thousandSeparator={true} />원</div>
                            </div>
                        </div>
                    </div>
                );
            });
        }
        return (<div className="row">{productRows}</div>);
    }

}
export default ProductRows;