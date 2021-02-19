import { useToken } from "@/Context/TokenProvider";
import { Layout } from "@/components/Layout";
import React, { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import Link from "next/link";
import { useUser } from "@/Context/UserProvider";
import {
  FormControl,
  InputGroup,
  Input,
  Icon,
  InputLeftElement,
  Button,
  useToast,
  Textarea,
} from "@chakra-ui/core";
import { PurchaseSteps } from "@/components/customer/PurchaseSteps";
import { useMutation } from "@/utils/useMutation";
import Head from "next/head";
import { Commas } from "@/utils/helpers";
import { updateProfile } from "@/graphql/vendor";

export const Account = () => {
  const { Token } = useToken();
  const { User, setUserDependency, userDependency } = useUser();
  const toast = useToast();
  const role = Cookies && Cookies.get("role");

  //Input Fileds Values
  const [readOnly, setReadOnly] = useState(true);
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    setPhone(User.phone || "");
    setAddress(User.customer_address || "");
  }, [User, Token]);

  //notification to insert your contact
  //show notification once
  const count = useRef(0);
  useEffect(() => {
    if (Token && role && role === "customer" && User.id) {
      if (!User.phone || !User.customer_address) {
        if (count.current < 1) {
          toast({
            title:
              "Please add your contact and shipping address for a faster checkout experience",
            status: "info",
            duration: 7000,
            isClosable: true,
            position: "top-right",
          });
          count.current++;
        }
      }
    }
  }, [User?.phone, User?.customer_address]);

  async function updateAccount(e) {
    e.preventDefault();

    const variables = {
      first_name: User.first_name,
      last_name: User.last_name,
      phone,
      customer_address: address,
    };
    const { data, error } = await useMutation(updateProfile, variables, Token);
    if (data) {
      toast({
        title: "Account Updated Successfully",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
      //update user in useEffect
      setUserDependency(!userDependency);
      setReadOnly(true);
    }
    if (error) {
      toast({
        title: "Failed To Update Your Account",
        description: "Check Your Internet Connection and Refresh",
        status: "error",
        duration: 3000,
      });
    }
  }

  //get Saved Items from Local Storage
  const [savedItem, setSavedItem] = useState(getStorageItem);
  useEffect(() => {
    getStorageItem();
  }, []);

  function getStorageItem() {
    if (typeof window === "object") {
      const storageItem = JSON.parse(localStorage.getItem("savedItem"));
      return storageItem || [];
    }
  }
  //runs when savedItem state changes, mostly used to delete an item from localstorage after adding to Cart
  useEffect(() => {
    if (typeof window === "object") {
      localStorage.setItem("savedItem", JSON.stringify(savedItem));
    }
  }, [savedItem]);

  //delete from saved item
  function removeSavedItem(product_id) {
    const newSaved = savedItem.filter((s) => s.product_id !== product_id);
    setSavedItem(newSaved);
  }

  return (
    <Layout>
      <Head>
        <title>Account | Tadlace</title>
      </Head>
      {!Token && !role && (
        <div className="indicator">
          <div className="status">
            <div>Looks Like You're Not Logged in</div>
            <br />
            <div style={{ textAlign: "center" }}>
              <div className="unauthorised">
                <Link href="/customer/login">
                  <a>LogIn</a>
                </Link>
              </div>
            </div>
            <div style={{ textAlign: "center" }}>
              <p className="unauthorised">Or</p>
            </div>
            <div style={{ textAlign: "center" }}>
              <div className="unauthorised">
                <Link href="/customer/register">
                  <a>SignUp</a>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* vendors trying to access this Page  */}
      {Token && role === "vendor" && (
        <div className="indicator">
          <div className="status">
            <div>
              This Page is Unauthorised For Vendors, Visit Your Account{" "}
            </div>
            <br />
            <div style={{ textAlign: "center" }}>
              <div className="unauthorised">
                <Link href="/vendor/account">
                  <a>Account</a>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      <main>
        {Token && User["first_name"] && role === "customer" && (
          <div className="account-wrap">
            <div className="heading">
              <h1></h1>
              <button
                title="edit profile"
                aria-label="edit profile"
                onClick={() => setReadOnly(!readOnly)}
                style={{ color: "var(--deepblue)", fontWeight: "bold" }}
              >
                Edit <Icon name="edit" />
              </button>
            </div>

            <section className="account-info">
              <h2>Name</h2>
              <p>
                {User.first_name} {User.last_name}
              </p>
              <h2>Email</h2>
              <p>{User.email}</p>
            </section>
            <form onSubmit={updateAccount}>
              <FormControl>
                <div>
                  <h2>Phone Number</h2>
                  <InputGroup>
                    <InputLeftElement
                      children={<Icon name="phone" color="gray.300" />}
                    />
                    <Input
                      isRequired
                      aria-label="phone number"
                      border={readOnly ? "none" : "1px"}
                      isReadOnly={readOnly}
                      autoFocus={readOnly ? false : true}
                      placeholder="Click Edit to add Phone Number"
                      width="100%"
                      type="tel"
                      name="Phone"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                      }}
                    />
                  </InputGroup>
                </div>

                <div>
                  <h2>Shipping Address</h2>
                  <Textarea
                    border={readOnly ? "none" : "1px"}
                    isRequired
                    aria-label="Address"
                    isReadOnly={readOnly}
                    placeholder="Click Edit to add Address"
                    id="Address"
                    name="Address"
                    value={address}
                    onChange={(e) => {
                      setAddress(e.target.value);
                    }}
                  ></Textarea>
                </div>
              </FormControl>
              <div style={{ textAlign: "center" }}>
                {!readOnly && (
                  <Button
                    type="submit"
                    background="var(--deepblue)"
                    color="white"
                    size="sm"
                  >
                    Update
                  </Button>
                )}
              </div>
            </form>

            {/* SAVD ITEMS  */}
            <h3 id="wishlist">Wishlist</h3>
            <hr />
            {savedItem.length === 0 ? (
              <p>
                No Item... add products here by clicking the heart icon on a
                product's page
              </p>
            ) : null}
            <div className="saved-item-wrap">
              {savedItem.map((s, i) => (
                <div className="saved-item" key={s.product_id}>
                  <div className="main-saved">
                    <Link
                      href={`/product/${s.name_slug}`}
                      as={`/product/${s.name_slug}`}
                    >
                      <a>
                        <img src={s.images} alt={`${s.name}`} />
                        <hr />
                        <div className="saved-desc">
                          <h2>{s.name}</h2>
                          <p>&#8358; {Commas(s.price)}</p>
                        </div>
                      </a>
                    </Link>
                  </div>
                  <div className="saved-btns">
                    <button
                      onClick={() => removeSavedItem(s.product_id)}
                      className="ml-2"
                    >
                      <Icon name="delete" color="var(--deepblue)" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        <PurchaseSteps />
      </main>
      <style jsx>{`
        .heading {
          display: flex;
          justify-content: space-between;
        }
        .unauthorised {
          margin-top: 20px;
        }
        .unauthorised a {
          background: var(--deepblue);
          color: white;
          padding: 10px 30px;
          margin-top: 20px;
        }
        .account-wrap {
          margin: 10px auto;
          width: 85%;
        }

        .account-wrap h1 {
          font-weight: bold;
          margin: 15px 0 8px 0;
          font-size: 1.2rem;
        }

        .account-wrap h3 {
          font-weight: bold;
          margin: 5px 0;
          color: Var(--deepblue);
        }

        .account-wrap h2 {
          margin: 5px 0;
          color: Var(--deepblue);
          font-weight: bold;
        }
        .account-wrap p {
          margin: 2px 0;
        }
        .account-info h3 {
          font-weight: bold;
          margin: 5px 0;
          color: Var(--deepblue);
        }
        form div {
          margin: 10px 0;
        }

        /* SAVED ITEMS  */

        .saved-item-wrap {
          display: grid;
          grid-template-columns: 1fr 1fr;
        }

        .saved-item {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          width: 130px;
          margin: 8px;
          font-size: 0.9rem;
        }

        .main-saved {
          box-shadow: var(--box) var(--softgrey);
          border-radius: 5px;
        }

        .saved-item img {
          height: 100px;
          width: 100%;
          object-fit: contain;
        }

        .saved-item a {
          color: var(--deepblue);
          font-size: 0.8rem;
        }
        .saved-item .saved-desc {
          text-align: center;
        }

        .saved-desc h2 {
          font-style: italic;
        }

        .saved-desc p {
          font-weight: bold;
        }
        .saved-btns {
          display: flex;
          justify-content: center;
          margin: 5px 0;
          align-items: center;
        }
        /* notification */
        .indicator {
          margin: auto;
          width: 90%;
        }
        .status {
          padding: 10px;
          border-radius: 10px;
          font-size: 1.1rem;
        }
        @media only screen and (min-width: 700px) {
          .indicator {
            width: 70%;
          }
        }

        @media only screen and (min-width: 700px) {
          .saved-item-wrap {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
          }
        }

        @media only screen and (min-width: 1200px) {
          .account-wrap {
            margin: 30px auto;
            width: 60%;
          }
          .saved-item-wrap {
            display: grid;
            grid-template-columns: repeat(6, 1fr);
          }
        }
        @media only screen and (min-width: 1800px) {
          .account-wrap {
            width: 40%;
          }
        }
      `}</style>
    </Layout>
  );
};
export default Account;
