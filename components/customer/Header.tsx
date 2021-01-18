import {
  Icon,
  Input,
  InputGroup,
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Divider,
  useDisclosure,
  InputLeftElement,
} from "@chakra-ui/core";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useToken } from "@/Context/TokenProvider";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
// import axios from "axios";

import { useSelector, useDispatch } from "react-redux";
import { cartItems } from "@/redux/features/cart/fetchCart";

// import { logoutLink } from "./../../utils/client";
import { companyName } from "@/utils/helpers";
import { HeaderDrawer } from "./HeaderDrawer";

interface DefaultRootState {
  cart: any;
}
export const Header = () => {
  const { cartLength } = useSelector<DefaultRootState, any>(
    (state) => state.cart
  );
  const dispatch = useDispatch();

  const { Token } = useToken();
  const router = useRouter();
  const role = Cookies && Cookies.get("role");

  //search input state
  const [search, setSearch] = useState("");

  //chakraui stuff for drawer
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    if (!Cookies.get("customer_id")) {
      return;
    }
    dispatch(cartItems({ customer_id: Cookies.get("customer_id") }));
  }, [cartLength]);

  // //close menu when you click outside of the menu
  // useEffect(() => {
  //   if (typeof window === "object") {
  //     const body = document.body;
  //     body.addEventListener("click", (e) => {
  //       //@ts-ignore
  //       if (e.target.parentNode.nodeName === "NAV") {
  //         return;
  //       } else {
  //         if (IsOpen) {
  //           setIsOpen(false);
  //           return;
  //         }
  //       }
  //     });
  //   }
  // }, [IsOpen]);

  function handleSearch(e) {
    e.preventDefault();
    if (search.trim() !== "") {
      router.push(`/search?query=${search}`);
    }
  }

  const handleLogout = async () => {
    if (window.confirm("Are you sure you want to LogOut?")) {
      Cookies.remove("ecom");
      Cookies.remove("role");
      router.reload();

      // const instance = axios.create({
      //   withCredentials: true,
      // });

      // try {
      //   const res = await instance.post(logoutLink[0]);
      //   if (res.data) {
      //     router.reload();
      //     return;
      //   }
      // } catch (error) {
      //   console.log(error.message);
      // }
    }
  };

  return (
    <div>
      <div className="header-component">
        <header>
          <div className="header-wrap">
            <div className="header-wrap_left">
              {/* open menu button  */}
              <button
                aria-label="menu"
                aria-roledescription="menu"
                onClick={onOpen}
              >
                <img
                  src="/menu.svg"
                  alt="menu svg"
                  role="button"
                  style={{ cursor: "pointer" }}
                />
              </button>
              <div className="logo">
                <Link href="/">
                  <a title="logo">{companyName}</a>
                </Link>
              </div>
            </div>

            {/* SEARCH BAR FOR DESKTOP */}
            {router.pathname !== "/" && (
              <div className="large-bar">
                <form onSubmit={handleSearch}>
                  <InputGroup size="md">
                    <InputLeftElement
                      cursor="pointer"
                      onClick={handleSearch}
                      pointerEvents="all"
                      children={<Icon name="search" color="var(--deepblue)" />}
                    />

                    <Input
                      aria-label="search"
                      title="search"
                      type="search"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      name="search"
                      id="search"
                      placeholder="Search our 1000+ products"
                      borderRadius="12px"
                    />
                  </InputGroup>
                </form>
              </div>
            )}

            <div className="header-wrap_right">
              <div>
                <Popover usePortal>
                  <PopoverTrigger>
                    <button
                      className="profile-icon"
                      aria-label="open account popover"
                      aria-roledescription="open account popover"
                    >
                      <img
                        src="/profile.svg"
                        alt="profile"
                        role="button"
                        aria-label="profile menu"
                      />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent width="30" zIndex={999}>
                    <div className="pop-over-body">
                      {!Token && !role && (
                        <p
                          style={{
                            color: "var(--deepblue)",
                            textAlign: "center",
                            fontWeight: "bold",
                          }}
                        >
                          <Link href="/customer/login">
                            <a>Login</a>
                          </Link>
                        </p>
                      )}
                      {!Token && !role && (
                        <p
                          style={{
                            textAlign: "center",
                            fontWeight: "bold",
                          }}
                        >
                          Or
                        </p>
                      )}
                      {!Token && !role && (
                        <p
                          style={{
                            color: "var(--deepblue)",
                            textAlign: "center",
                            fontWeight: "bold",
                          }}
                        >
                          <Link href="/customer/register">
                            <a>Create Account</a>
                          </Link>
                        </p>
                      )}
                      {!Token && !role && <Divider />}
                      <div className="pop-over-body-rest">
                        {Token && role === "vendor" && (
                          <p>
                            <Link href="/vendor/dashboard">
                              <a>Dashboard</a>
                            </Link>
                          </p>
                        )}
                        <p>
                          <Link href="/customer/account">
                            <a>Account</a>
                          </Link>
                        </p>
                        <p>
                          <Link href="/customer/cart">
                            <a>Cart</a>
                          </Link>
                        </p>
                        <p>
                          <Link href="/customer/orders">
                            <a>Orders</a>
                          </Link>
                        </p>
                        <p>
                          <Link href="/customer#contact">
                            <a>Help</a>
                          </Link>
                        </p>
                        {Token && role && (
                          <Button
                            variantColor="blue"
                            width="100%"
                            display="block"
                            marginTop="5px"
                            onClick={handleLogout}
                          >
                            Logout
                          </Button>
                        )}
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              <div className="cart-icon">
                <Link href="/customer/cart">
                  <a title="visit cart">
                    <aside>{cartLength === 0 ? null : cartLength}</aside>
                    <img src="/shopping-cart.svg" alt="cart icon" />
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* MOBILE SEARCH BAR dont show in these routes  */}

        {router.pathname !== "/customer/login" &&
          router.pathname !== "/customer/register" &&
          router.pathname !== "/" && (
            <div className="search-bar">
              <form onSubmit={handleSearch}>
                <InputGroup size="md">
                  <InputLeftElement
                    onClick={handleSearch}
                    cursor="pointer"
                    children={<Icon name="search" color="var(--deepblue)" />}
                    borderTop="none"
                    color="var(--deepblue)"
                    pointerEvents="all"
                  />
                  <Input
                    aria-label="search"
                    title="search"
                    type="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    name="search"
                    id="search mobile"
                    placeholder="Search our 1000+ products"
                    borderRadius="12px"
                  />
                </InputGroup>
              </form>
            </div>
          )}
      </div>

      {/* MENU */}
      <HeaderDrawer isOpen={isOpen} onClose={onClose} />
    </div>
  );
};
