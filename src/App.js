import React from "react";
import { useState, useEffect } from "react";
import "./App.scss";
import axios from "axios";
import deliverooLogo from "/Users/user/leReacteur/react/deliveroo/deliveroo-frontend/src/assets/img/deliveroo-log.png";

const App = () => {
  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://backend-deliveroo-project.herokuapp.com/"
        );
        console.log(response.data);
        setData(response.data);
        setIsLoading(false);
      } catch (error) {
        console.log(error.response);
      }
    };
    fetchData();
  }, []);

  // ********************* AJOUTER ARTICLE AU PANIER *********************** //

  const addToCart = (meal) => {
    const newCart = [...cart];
    if (newCart.length === 0) {
      newCart.push({
        id: meal.id,
        title: meal.title,
        price: Number(meal.price),
        quantity: 1,
      });
    } else {
      let isPresent = false;
      for (let i = 0; i < newCart.length; i++) {
        if (newCart[i].id === meal.id) {
          isPresent = true;
          newCart[i].quantity++;
        }
      }
      isPresent === false &&
        newCart.push({
          id: meal.id,
          title: meal.title,
          price: Number(meal.price),
          quantity: 1,
        });
    }
    setCart(newCart);
  };

  //********************* AJOUTER QUANTITE AU PANIER *********************** //

  const addQuantity = (index) => {
    const newCart = [...cart];
    newCart[index].quantity++;
    setCart(newCart);
  };
  //********************* ENLEVER QUANTITE AU PANIER *********************** //
  const removeQuantity = (index) => {
    const newCart = [...cart];
    if (newCart[index].quantity > 1) {
      newCart[index].quantity--;
    } else if (newCart[index].quantity === 1) {
      newCart.splice(index, 1);
    }
    setCart(newCart);
  };
  return isLoading === true ? (
    <span>En cours de chargement...</span>
  ) : (
    <div>
      <header>
        <div className="banner">
          <div className="banner-center">
            <img className="logo" src={deliverooLogo} alt="deliveroo logo" />
          </div>
        </div>
        <div className="restaurant-info">
          <div className="restaurant-info-center">
            <div className="restaurant-info-text">
              <h1>{data.restaurant.name}</h1>
              <p>{data.restaurant.description}</p>
            </div>
            <div>
              <img
                className="restaurant-info-picture"
                src={data.restaurant.picture}
                alt="restaurant-picture"
              />
            </div>
          </div>
        </div>
      </header>
      <div className="Content">
        <div className="content-center">
          <div className="Menu">
            {data.categories.map((item, index) => {
              return (
                <div key={index} className="MenuItems">
                  <h2>{item.name}</h2>
                  <div className="MenuItems-items">
                    {item.meals.map((meal) => {
                      return (
                        <div className="MenuItem">
                          <div
                            key={meal.id}
                            className="MenuItem-card"
                            onClick={() => {
                              addToCart(meal);
                            }}
                          >
                            <div className="MenuItem-text">
                              <h3>{meal.title}</h3>
                              {meal.description && <p>{meal.description}</p>}

                              <div className="MenuItem-info">
                                <span className="MenuItem-price">
                                  {meal.price}€
                                </span>
                                {meal.popular && (
                                  <span className="MenuItem-popular">
                                    Populaire
                                  </span>
                                )}
                              </div>
                            </div>
                            {meal.picture && (
                              <div className="MenuItem-picture">
                                <img src={meal.picture} alt="" />
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="Cart">
            <div className="Cart-card">
              <div>
                {cart.map((label, index) => {
                  return (
                    <div key={label.id}>
                      <button
                        onClick={() => {
                          removeQuantity(index);
                        }}
                      >
                        -
                      </button>
                      <span>{label.quantity}</span>
                      <button
                        onClick={() => {
                          addQuantity(index);
                        }}
                      >
                        +
                      </button>
                      <span>{label.title}</span>
                      <span>{label.price * label.quantity}</span>
                    </div>
                  );
                })}
              </div>
              {/* <div>{price}</div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
