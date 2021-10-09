import React, { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { useStoreContext } from '../../utils/GlobalState';
import {
  UPDATE_CATEGORIES,
  UPDATE_CURRENT_CATEGORY,
} from '../../utils/actions';
import { QUERY_CATEGORIES } from '../../utils/queries';
import { idbPromise } from '../../utils/helpers';
import Nav from 'react-bootstrap/Nav'
function CategoryMenu() {
  const [state, dispatch] = useStoreContext();

  const { categories } = state;

  const { loading, data: categoryData } = useQuery(QUERY_CATEGORIES);

  useEffect(() => {
    if (categoryData) {
      dispatch({
        type: UPDATE_CATEGORIES,
        categories: categoryData.categories,
      });
      categoryData.categories.forEach((category) => {
        idbPromise('categories', 'put', category);
      });
    } else if (!loading) {
      idbPromise('categories', 'get').then((categories) => {
        dispatch({
          type: UPDATE_CATEGORIES,
          categories: categories,
        });
      });
    }
  }, [categoryData, loading, dispatch]);

  const handleClick = (id) => {
    dispatch({
      type: UPDATE_CURRENT_CATEGORY,
      currentCategory: id,
    });
  };

  const style = {
    tabs :{
      background: "#f4f4f4",
      fontSize: "2rem",
      color: "orange"
    },
    sticky: {
      top: "3.7em",
      position:"fixed",
      width: "100%",
      zIndex: 33
    }
  }

  return (
<div>
    
    <Nav justify variant="tabs" defaultActiveKey="/home" style={style.sticky}>
    {categories.map((item) => (
      <Nav.Item style={style.tabs}>
        <Nav.Link  key={item._id}
          onClick={() => {
            handleClick(item._id);
          }}> {item.name}</Nav.Link>
      </Nav.Item>
      ))}
    </Nav>
  </div>

    
  );
}

export default CategoryMenu;

