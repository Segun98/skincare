import React from "react";
import { MutationAddToCartArgs, ProductsRes } from "@/Typescript/types";
import { Dispatch } from "react";
import { SetStateAction } from "react";
import Cookies from "js-cookie";
import { useToken } from "@/Context/TokenProvider";
import { Button, useToast } from "@chakra-ui/core";
import { useMutation } from "@/utils/useMutation";
import { addToCart } from "@/graphql/customer";
import { useRouter } from "next/router";
import { v4 as uuidv4 } from "uuid";
import { useLocalStorage } from "../useLocalStorage";
import { useUser } from "@/Context/UserProvider";
interface Iprops {
  product: ProductsRes;
  setLoading: Dispatch<SetStateAction<boolean>>;
  loading: boolean;
  quantity: number;
}
export const AddToCart: React.FC<Iprops> = ({
  product,
  loading,
  setLoading,
  quantity,
}) => {
  const router = useRouter();
  const toast = useToast();
  const { Token } = useToken();
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
      router
        .push(`/${product.creator.business_name_slug}`)
        .then(() =>
          toast({
            title: `Item Added to Cart!`,
            description: `Open Cart (top-right icon) to Checkout`,
            status: "success",
            isClosable: true,
            duration: 7000,
          })
        )
        .then(() => window.scrollTo(0, 0));
      return;
    }
    if (error) {
      setLoading(false);
      //handled this error cos chakra ui "status" should be "info"
      if (error.response?.errors[0].message === "Item is already in Cart") {
        router
          .push(`/${product.creator.business_name_slug}`)
          .then(() =>
            toast({
              title: "Item Is Already In Cart",
              description: `Open Cart (top-right icon) to Checkout`,
              isClosable: true,
              status: "info",
              duration: 3000,
            })
          )
          .then(() => window.scrollTo(0, 0));

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
  const [savedItem, addToSavedItems] = useLocalStorage();
  function addToLocalStorage() {
    //@ts-ignore
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
    <Button
      variantColor="blue"
      border="none"
      isLoading={loading ? true : false}
      style={{ backgroundColor: "var(--deepblue" }}
      onClick={() => {
        if (product.in_stock === "false") {
          addToLocalStorage();
          toast({
            title: "This Product is Currently Out of Stock!",
            description: "It has been added to Wishlist in your Account page",
            status: "info",
            duration: 5000,
            position: "bottom",
            isClosable: true,
          });
          return;
        }
        if (product.creator.online === "false") {
          addToLocalStorage();
          toast({
            title: "The Vendor is Currently OFFLINE",
            description:
              "This Item Has Been addedd to your Wishlist. Please Try Again Later",
            status: "info",
            duration: 5000,
            position: "bottom",
            isClosable: true,
          });
          return;
        }
        addCart(product.id, product.creator_id, quantity);
      }}
    >
      Add To Cart
    </Button>
  );
};
