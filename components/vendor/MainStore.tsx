import { Icon, useToast, useDisclosure, Spinner } from "@chakra-ui/core";
import { gql } from "graphql-request";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useToken } from "@/Context/TokenProvider";
import { MutationDeleteProductArgs, UsersRes } from "@/Typescript/types";
import { Commas } from "@/utils/helpers";
import { useMutation } from "@/utils/useMutation";
import { StoreDrawer } from "./StoreCartFlow/StoreDrawer";
import { useSelector, useDispatch } from "react-redux";
import { cartItems } from "@/redux/features/cart/fetchCart";
import Cookies from "js-cookie";
import { StoreAddToCart } from "./StoreCartFlow/StoreAddToCart";
import { useUser } from "@/Context/UserProvider";
import { CopyToClipboard } from "react-copy-to-clipboard";

interface StoreProps {
  user: UsersRes;
  // handleDelete: (id: string, creator_id: string, name: string) => void;
}
export const MainStore: React.FC<StoreProps> = ({ user }) => {
  //for chakra ui drawer
  const { isOpen, onOpen, onClose } = useDisclosure();
  //loading cart
  const [loading, setLoading] = useState(false);

  //CART FROM REDUX STORE
  const { cartLength, cart } = useSelector<any, any>((state) => state.cart);
  const dispatch = useDispatch();

  const router = useRouter();
  //from context
  const { Token } = useToken();
  const { User } = useUser();
  const toast = useToast();

  //fetch cart items
  useEffect(() => {
    if (!Cookies.get("customer_id") && !User["id"]) {
      return;
    }
    dispatch(
      cartItems({
        customer_id: Cookies.get("customer_id"),
        user_id: User["id"] ? User.id : null,
        prod_creator_id: user.id,
      })
    );
  }, [cartLength, User]);

  // Delete Product
  const handleDelete = async (id, creator_id, name) => {
    const variables: MutationDeleteProductArgs = {
      id,
      creator_id,
    };

    const deleteProduct = gql`
      mutation deleteProduct($id: ID!, $creator_id: String!) {
        deleteProduct(id: $id, creator_id: $creator_id) {
          message
        }
      }
    `;

    if (
      window.confirm(`Are you sure you want to Delete This Product : ${name} ?`)
    ) {
      const { data, error } = await useMutation(
        deleteProduct,
        variables,
        Token
      );

      if (data) {
        toast({
          title: "Your Product Has Been Deleted",
          status: "success",
          duration: 5000,
        });
        router.reload();
      }
      if (error) {
        toast({
          title: "An Error Ocurred",
          description: error.response?.errors[0].message
            ? error.response?.errors[0].message
            : "An error occurred, check your internet connection",
          status: "error",
        });
      }
    }
  };

  return (
    <section className="main-store">
      <header>
        <div>
          <div className="store-name" style={{ display: "flex" }}>
            <img src="/home-alt.svg" alt="profile" />{" "}
            <span>{user.business_name}</span>
          </div>
          <div className="store-bio">
            <img src="/notes.svg" alt="profile" />{" "}
            {user.business_bio || "This is " + user.business_name + " bio"}
          </div>
          <div className="store-location">
            <Icon name="phone" mr="10px" ml="5px" />
            {user.phone || "080123456789"}
          </div>
          <div className="share">
            <img src="/share.svg" alt="share store" className="mr-1" />
            <div className="share-btns">
              <div className="twitter">
                <a
                  href={`https://twitter.com/intent/tweet?url=https://skincare-project.vercel.app/${user.business_name_slug}&text=${user.business_name} %7C ${user.business_bio}&via=skincarestore`}
                  target="_blank"
                >
                  <img src="/twitter.svg" alt="Twitter Icon" />
                </a>
              </div>

              <div>
                <a
                  href={`https://web.facebook.com/sharer.php?u=https://skincare-project.vercel.app/${user.business_name_slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src="/facebook.svg" alt="Facebook Icon" />
                </a>
              </div>
              <CopyToClipboard
                text={`https://skincare-project.vercel.app/${user.business_name_slug}`}
                onCopy={() => {
                  toast({
                    title: "Store Link Copied to clipboard!",
                    isClosable: true,
                  });
                }}
              >
                <img
                  src="/copy.svg"
                  alt="copy to clipboard"
                  title="copy store link to clipboard"
                />
              </CopyToClipboard>
            </div>
          </div>
          {user && user.id === user.jwt_user_id ? (
            <div className="views">
              <img
                src="/eye.svg"
                alt="store impressiond"
                title="store impressions"
              />
              {user.views}
            </div>
          ) : (
            ""
          )}
        </div>
        {/* ONLY SHOW EDIT BUTTON TO STORE OWNER */}
        <div>
          {user && user.id === user.jwt_user_id ? (
            <div className="edit-btn">
              <button
                aria-label="edit account"
                title="edit account"
                style={{
                  color: "var(--deepblue)",
                  fontWeight: "bold",
                }}
              >
                <Link href="/vendor/account">
                  <a>
                    <Icon name="edit" />
                  </a>
                </Link>
              </button>
            </div>
          ) : (
            // SHOW CART ICON TO THE PUBLIC
            <div>
              <button
                aria-label="open cart"
                title="Cart"
                onClick={onOpen}
                className="cart-store-icon"
              >
                <img src="/shopping-cart.svg" alt="open cart icon" />
                <h1>{cartLength === 0 ? "" : cartLength}</h1>
              </button>
              <StoreDrawer
                onClose={onClose}
                isOpen={isOpen}
                cart={cart}
                user={user}
              />
            </div>
          )}
        </div>
      </header>
      <hr />
      {/* END OF HEADER  */}

      {/* LOADER WHEN ADDNG TO CART  */}
      {loading && (
        <div className="center">
          <Spinner
            speed="0.8s"
            thickness="4px"
            emptyColor="gray.200"
            color="var(--primary)"
            size="xl"
          ></Spinner>
        </div>
      )}

      <div className="store-products">
        <div className="store-products_head">
          <h1>{user && user.usersProducts.length} Products In Store</h1>
        </div>

        {/* IF NO PRODUCT IN STORE */}
        <div>
          {user && user.usersProducts.length === 0 && (
            <div>
              {/* MESSAGE FOR STORE OWNER */}
              {user.id === user.jwt_user_id ? (
                <div
                  className="status"
                  style={{ color: "black", background: "white" }}
                >
                  Your Store is empty, Add a new product,{" "}
                  <Link href="/store/new-item">
                    <a style={{ color: "var(--pink)" }}>Click Here</a>
                  </Link>
                </div>
              ) : (
                <p className="space"></p>
              )}
            </div>
          )}
        </div>

        {/* STORE PRODUCTS  */}

        <div className="store-products_wrap">
          {user &&
            user.usersProducts.map((p) => (
              <div className="store-item" key={p.id}>
                {/* Inventory status , visible only to store owner (user.id === user.jwt_user_id) */}
                {user && user.id === user.jwt_user_id ? (
                  <div
                    className="product-status pl-3"
                    style={{ color: "white" }}
                  >
                    {p.available_qty === 0 || p.in_stock === "false" ? (
                      <span style={{ color: "red", fontWeight: "bold" }}>
                        Out of stock!!
                      </span>
                    ) : (
                      `${p.available_qty} in stock`
                    )}
                  </div>
                ) : (
                  ""
                )}

                <Link
                  href={`/product/${p.name_slug}`}
                  as={`/product/${p.name_slug}`}
                >
                  <a>
                    <img src={p.images[0]} alt={`${p.name}`} loading="lazy" />
                    <hr />
                    <div className="store-desc">
                      <h2>{p.name}</h2>
                      <p>&#8358; {Commas(p.price)}</p>
                    </div>
                  </a>
                </Link>
                {/* ONLY SHOW PRODUCT EDIT BUTTON TO STORE OWNER */}

                {user && user.id === user.jwt_user_id ? (
                  <div className="edit-btn">
                    <button
                      title="edit product"
                      style={{
                        color: "var(--deepblue)",
                        fontWeight: "bold",
                      }}
                    >
                      <Link href={`/store/edit/${p.id}`}>
                        <a>Edit</a>
                      </Link>
                    </button>
                    <button
                      title="delete product"
                      onClick={() => handleDelete(p.id, p.creator_id, p.name)}
                      style={{
                        color: "red",
                        fontWeight: "bold",
                      }}
                    >
                      Delete
                    </button>
                  </div>
                ) : (
                  //Add to cart button
                  <div className="store-add-cart">
                    <StoreAddToCart
                      onOpen={onOpen}
                      product={p}
                      loading={loading}
                      setLoading={setLoading}
                      user={user}
                    />
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>
    </section>
  );
};
