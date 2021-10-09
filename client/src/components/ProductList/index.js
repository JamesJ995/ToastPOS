import React, { useEffect } from 'react';
import ProductItem from '../ProductItem';
import { useStoreContext } from '../../utils/GlobalState';
import { UPDATE_PRODUCTS } from '../../utils/actions';
import { useQuery } from '@apollo/client';
import { QUERY_PRODUCTS } from '../../utils/queries';
import { idbPromise } from '../../utils/helpers';
// import spinner from '../../assets/spinner.gif';
import Spinner from 'react-bootstrap/Spinner';
import Cart from '../Cart';
import CategoryMenu from '../CategoryMenu';

function ProductList() {
  const [state, dispatch] = useStoreContext();

  const { currentCategory } = state;

  const { loading, data } = useQuery(QUERY_PRODUCTS);

  useEffect(() => {
    if (data) {
      dispatch({
        type: UPDATE_PRODUCTS,
        products: data.products,
      });
      data.products.forEach((product) => {
        idbPromise('products', 'put', product);
      });
    } else if (!loading) {
      idbPromise('products', 'get').then((products) => {
        dispatch({
          type: UPDATE_PRODUCTS,
          products: products,
        });
      });
    }
  }, [data, loading, dispatch]);

  function filterProducts() {
    if (!currentCategory) {
      return state.products;
    }

    return state.products.filter(
      (product) => product.category._id === currentCategory
    );
  }

  return (
    <div>
      
    <div className="row d-flex">
    <div className="col-12 col-xl-3">
      <Cart />
    </div>
    <div className="col-12 col-md-9 p-0">
    <div className="my-2">

    <CategoryMenu />

      {state.products.length ? (
        <div className="flex-row">
          {filterProducts().map((product) => (
            <ProductItem
              key={product._id}
              _id={product._id}
              image={product.image}
              name={product.name}
              price={product.price}
              quantity={product.quantity}
            />
          ))}
          
        </div>
        
      ) : (
        <h3>Add some products first!</h3>
      )}
      {loading ? <Spinner animation="border" role="status">
                      <span className="visually-hidden">Loading...</span>
                  </Spinner> : null}

    </div>
    </div>
  </div>
    
    </div>
  );
}

export default ProductList;
