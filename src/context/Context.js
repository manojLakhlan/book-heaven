import React, { createContext, useReducer, useEffect } from "react";
import reducer from "./Reducer";


const GetBooks = () => {
  return new Promise((resolve, reject) => {
    let url = 'https://api.nexaflow.xyz/api/page/64e39ab64094f20f34a10067';
    url += '?websiteId=64e3992d4094f20f34a1005f';
    fetch(url, {
      method: 'GET',
      headers: {
        'x-api-key': 'ZOy0VIMib968YCuP',
      }
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((responseJSON) => {
        resolve(responseJSON.blocks[0].blockData.Books_);
      })
      .catch((error) => {
        reject(error);
      });
  });
};


const initialState = {
  books: [],
  searchString: null,
  searchedBooks: [],
  carts: []
};

export const Context = createContext(initialState);

export const Provider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  useEffect(() => {
    GetBooks()
      .then((result) => {
        dispatch({
          type: "FETCH_BOOKS",
          payload: eval(result),
        });
        
        //setLoading(false);
      })
      .catch((error) => {
        console.error('Error:', error);
       // setLoading(false);
      });

    if (localStorage.getItem("carts") !== null) {
      const fetchedCarts = JSON.parse(localStorage.getItem("carts"));
      fetchCarts(fetchedCarts);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("carts", JSON.stringify(state.carts));
  }, [state.carts]);

  //actions
  const fetchCarts = fetchedCarts => {
    dispatch({
      type: "FETCH_CART",
      payload: fetchedCarts
    });
  };

  const addCart = id => {
    dispatch({
      type: "ADD_CART",
      payload: id
    });
  };

  const updateCart = (id, quantity) => {
    dispatch({
      type: "UPDATE_CART",
      payload: { id, quantity }
    });
  };

  const removeCart = id => {
    dispatch({
      type: "REMOVE_CART",
      payload: id
    });
  };

  const getSearchString = searchString => {
    dispatch({
      type: "GET_SEARCHED_STRING",
      payload: searchString
    });
  };

  const getSearchedBooks = searchString => {
    getSearchString(searchString);
    dispatch({
      type: "GET_SEARCHED_BOOKS",
      payload: searchString
    });
  };

  const clearSearch = () => {
    dispatch({
      type: "CLEAR_SEARCH"
    });
  };

  return (
    <Context.Provider
      value={{
        books: state.books,
        carts: state.carts,
        searchedBooks: state.searchedBooks,
        searchString: state.searchString,
        addCart,
        updateCart,
        removeCart,
        getSearchString,
        getSearchedBooks,
        clearSearch,
        fetchCarts
      }}
    >
      {children}
    </Context.Provider>
  );
};