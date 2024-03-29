import React, { Dispatch, SetStateAction } from "react";
import {
  MutationAddToCartArgs,
  ProductsRes,
  UsersRes,
} from "@/Typescript/types";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import { useToken } from "@/Context/TokenProvider";
import { Icon, useToast } from "@chakra-ui/core";
import { useMutation } from "@/utils/useMutation";
import { addToCart } from "@/graphql/customer";
import { cartItems } from "@/redux/features/cart/fetchCart";
import { v4 as uuidv4 } from "uuid";
import { useLocalStorage } from "@/components/useLocalStorage";
import { useUser } from "@/Context/UserProvider";

interface Iprops {
  onOpen: any;
  product: ProductsRes;
  setLoading: Dispatch<SetStateAction<boolean>>;
  loading: boolean;
  user: UsersRes;
}
export const StoreAddToCart: React.FC<Iprops> = ({
  product,
  onOpen,
  setLoading,
  user,
}) => {
  const toast = useToast();
  const { Token } = useToken();
  const dispatch = useDispatch();
  const { User } = useUser();

  //add to cart
  async function addCart(
    product_id: string,
    prod_creator_id: string,
    quantity: number
  ) {
    setLoading(true);

    //generate customer id
    let customer_id = "";
    const check = Cookies.get("customer_id");
    if (check) {
      customer_id = check;
    } else {
      customer_id = uuidv4();

      Cookies.set("customer_id", customer_id, {
        expires: 365,
      });
    }

    const variables: MutationAddToCartArgs = {
      customer_id,
      product_id,
      prod_creator_id,
      quantity,
      user_id: User["id"] ? User.id : null,
    };

    const { data, error } = await useMutation(addToCart, variables, Token);
    if (data) {
      setLoading(false);

      dispatch(
        cartItems({
          customer_id: Cookies.get("customer_id"),
          user_id: User["id"] ? User.id : null,
          prod_creator_id: user.id,
        })
      );
      toast({
        title: "Item Added to Cart!",
        description: `Proceed to checkout`,
        status: "success",
        duration: 3000,
        position: "bottom",
        isClosable: true,
      });
      onOpen();
    }
    if (error) {
      setLoading(false);
      if (error.response?.errors[0].message === "Item is already in Cart") {
        toast({
          title: "Item Is Already In Cart",
          isClosable: true,
          duration: 3000,
          status: "info",
        });
        onOpen();
        return;
      }
      toast({
        title: "An Error occurred while adding to cart.",
        description: "Check Your Internet Connection and Refresh",
        status: "info",
        duration: 7000,
        isClosable: true,
      });
    }
  }

  //save item to local storage
  const [_, addToSavedItems] = useLocalStorage();

  function addToLocalStorage() {
    addToSavedItems(
      product.images[0],
      product.name,
      product.price,
      product.id,
      product.creator_id,
      product.name_slug
    );
  }

  return (
    <button
      aria-label="add to cart"
      title="add to cart"
      onClick={() => {
        if (product.in_stock === "false") {
          addToLocalStorage();
          toast({
            title: "This Product is Currently Out of Stock!",
            description:
              "It has been added to your wishlist in your Account page",
            status: "info",
            duration: 5000,
            position: "bottom",
            isClosable: true,
          });
          return;
        }

        addCart(product.id, product.creator_id, 1);
      }}
    >
      <Icon name="small-add" color="var(--primary)" size="22px" />
    </button>
  );
};
