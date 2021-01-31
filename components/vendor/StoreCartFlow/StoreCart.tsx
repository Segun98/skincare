import { Button, Icon, Spinner, useToast } from "@chakra-ui/core";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { deleteFromCart, updateCart } from "@/graphql/customer";
import { cartItems } from "@/redux/features/cart/fetchCart";
import { Cart } from "@/Typescript/types";
import { Commas, nairaSign } from "@/utils/helpers";
import { useMutation } from "@/utils/useMutation";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { useToken } from "@/Context/TokenProvider";
import { useUser } from "@/Context/UserProvider";

interface IProps {
  cart: Cart[];
}
export const StoreCart: React.FC<IProps> = ({ cart }) => {
  const toast = useToast();
  const dispatch = useDispatch();
  const router = useRouter();
  const { Token } = useToken();
  const role = Cookies.get("role");
  const { User } = useUser();
  //update cart quantity loading state
  const [loadingCart, setLoadingCart] = useState(false);

  //cart items subtotal
  const subTotal = cart.reduce((a, c) => a + c.product.price * c.quantity, 0);

  //update quantity of an item
  const updateCartFn = async (id, quantity) => {
    setLoadingCart(true);
    const { data, error } = await useMutation(updateCart, {
      id,
      quantity,
    });
    if (data) {
      dispatch(
        cartItems({
          customer_id: Cookies.get("customer_id"),
          user_id: User["id"] ? User.id : null,
        })
      );
      setLoadingCart(false);
      toast({
        title: "Quantity Updated",
        status: "info",
        duration: 1000,
        position: "top",
      });
    }
    if (error) {
      setLoadingCart(false);
      toast({
        title: "Updating Cart Item Quantity Failed",
        description: "check your internet connection and refresh.",
        status: "error",
        isClosable: true,
        position: "top",
      });
    }
  };

  //delete from cart
  const deleteCartFn = async (id) => {
    setLoadingCart(true);
    const { data, error } = await useMutation(deleteFromCart, {
      id,
    });
    if (data.deleteFromCart) {
      setLoadingCart(false);
      dispatch(
        cartItems({
          customer_id: Cookies.get("customer_id"),
          user_id: User["id"] ? User.id : null,
        })
      );
      toast({
        title: "Item Removed From Cart",
        status: "info",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }
    if (error) {
      setLoadingCart(false);
      toast({
        title: "Failed To Remove From Cart",
        description: "check your internet connection and refresh.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }
  };

  return (
    <section className="cart-section" id="cart-top">
      <div className="cart-wrap">
        <div className="cart-item-title">
          <div>Product</div>
          <div>Total</div>
          <div>Remove</div>
        </div>
        <hr />
        {cart && cart.length === 0 && (
          <div style={{ textAlign: "center" }}>No item in your cart...</div>
        )}

        {/* LOADING INDICATOR WHEN UPDATE QUANTITY  */}
        {loadingCart && (
          <div className="center">
            <Spinner speed="0.5s"></Spinner>
          </div>
        )}

        {cart &&
          cart.map((c: Cart) => (
            <div key={c.id} className="cart-item">
              <div className="item-details">
                <p className="name">{c.product.name}</p>
                <p className="price">
                  {nairaSign} {Commas(c.product.price)}
                </p>
                <div className="qty-btn">
                  <button
                    title="decrement quantity"
                    aria-label="decrement quantity"
                    aria-roledescription="decrement quantity"
                    onClick={() => {
                      if (c.quantity === 1) {
                        return;
                      }
                      updateCartFn(c.id, c.quantity - 1);
                    }}
                  >
                    <Icon name="minus" color="black" />
                  </button>
                  <aside className="cart-item-qty">{c.quantity}</aside>
                  <button
                    title="increment quantity"
                    aria-label="increment quantity"
                    aria-roledescription="increment quantity"
                    onClick={() => {
                      if (c.quantity >= c.product.available_qty) {
                        return;
                      }
                      updateCartFn(c.id, c.quantity + 1);
                    }}
                  >
                    <Icon name="small-add" color="black" size="22px" />
                  </button>
                </div>
              </div>

              <div className="subtotal">
                {nairaSign} {Commas(c.product.price * c.quantity)}
              </div>

              <button
                title="delete cart item"
                aria-label="delete cart item"
                aria-roledescription="delete cart item"
                onClick={() => {
                  deleteCartFn(c.id);
                }}
              >
                <Icon name="close" size="12px" />
              </button>
            </div>
          ))}

        {/* subtotal and checkout  */}
        {cart && cart.length > 0 && (
          <div className="cart-item-title">
            <div></div>
            <div>
              <span>Subtotal:</span>
              <br />
              <span style={{ color: "var(--deepblue)" }}>
                {nairaSign} {Commas(subTotal)}
              </span>
            </div>

            <Button
              className="order-btn"
              color="white"
              size="xs"
              background="var(--deepblue)"
              onClick={() => {
                if (!Token || !role) {
                  toast({
                    title: "Almost There! You need to Login before checkout",
                    description: "Redirecting",
                    status: "info",
                    position: "top",
                    duration: 7000,
                  });

                  setTimeout(() => {
                    router.push(`/customer/login?redirect=checkout`);
                  }, 1000);

                  return;
                }
                router.push(`/product/checkout`);
              }}
            >
              Checkout
            </Button>
          </div>
        )}
      </div>
      <style jsx>{`
        .center {
          text-align: center;
          /* position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%); */
        }
        .cart-item-title,
        .cart-item {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          row-gap: 8px;
          font-size: 0.9rem;
          place-items: center;
        }

        .cart-item {
          margin: 10px 0;
          padding: 5px 0;
          border-bottom: 1px solid var(--softgrey);
        }

        .qty-btn {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .qty-btn button {
          border: 0.5px solid var(--softgrey);
          border-radius: 50%;
          padding: 1px;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .qty-btn .cart-item-qty {
          padding: 0 8px;
        }
      `}</style>
    </section>
  );
};
