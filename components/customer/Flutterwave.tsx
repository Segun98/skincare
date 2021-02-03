import React, { Dispatch, SetStateAction } from "react";
import { useFlutterwave, closePaymentModal } from "flutterwave-react-v3";
import { useUser } from "@/Context/UserProvider";
import { useToken } from "@/Context/TokenProvider";
import { deleteAllFromCart, updateOrder } from "@/graphql/customer";
import { MutationUpdateOrderArgs, Orders } from "@/Typescript/types";
import { useMutation } from "@/utils/useMutation";
import { graphQLClient, restEndpoint } from "@/utils/client";
import Cookies from "js-cookie";
import axios from "axios";
import { Button, useToast } from "@chakra-ui/core";
import { gql } from "graphql-request";
import { useRouter } from "next/router";

//update available quantity in stock for ordered product
const updateQuantity = gql`
  mutation updateQuantity($id: ID!, $qty_ordered: Int) {
    updateQuantity(id: $id, qty_ordered: $qty_ordered) {
      message
    }
  }
`;

interface Iprops {
  order: Orders[];
  subtotal: number;
  delivery: number;
  setLoader: Dispatch<SetStateAction<boolean>>;
}

export const Flutterwave: React.FC<Iprops> = ({
  order,
  subtotal,
  delivery,
  setLoader,
}) => {
  const { Token } = useToken();
  const { User } = useUser();
  const toast = useToast();
  const router = useRouter();

  async function updateOrderFn(transaction_id: string) {
    setLoader(true);
    const variables: MutationUpdateOrderArgs = {
      order_id: order[0].order_id,
      transaction_id,
      delivery_fee: delivery,
      total_price: subtotal,
    };

    const { data, error } = await useMutation(updateOrder, variables, Token);

    //email to customer
    confirmationEmail();

    //email to vendor
    for await (const o of order) {
      confirmationEmailVendor(o);
    }

    if (data) {
      toast({
        title: "Payment Successful",
        description:
          "Your Order has been successfuly placed, track it in your Orders page",
        status: "success",
        duration: 5000,
        position: "top",
      });

      //clear cart
      await useMutation(deleteAllFromCart, {
        customer_id: Cookies.get("customer_id"),
        user_id: User["id"] ? User.id : null,
      });
      toast({
        title: "You are being redirected...",
        status: "info",
        duration: 3000,
        position: "top",
      });

      //update the quantity of products in stock for the ordered product(s)
      for await (const o of order) {
        try {
          await graphQLClient.request(updateQuantity, {
            id: o.product_id,
            qty_ordered: o.quantity,
          });
        } catch (err) {
          //
        }
      }

      router.push(`/customer/cart`).then(() => window.scrollTo(0, 0));
    }

    if (error) {
      toast({
        title: "An error occurred.",
        description: "check your internet connection and refresh.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }
  }

  //confirmation emails
  async function confirmationEmail() {
    try {
      //customer endpoint
      await axios.post(`${restEndpoint}/order_customer`, {
        to: order[0].customer_email,
        name: User.first_name,
        orderId: order[0].order_id,
        order,
      });
    } catch (error) {
      //eyahh
    }
  }

  async function confirmationEmailVendor(o: Orders) {
    try {
      //vendor endpoint
      await axios.post(`${restEndpoint}/order_vendor`, {
        to: o.vendor_email,
        order: o,
        orderId: o.order_id,
      });
    } catch (error) {
      //eyahh
    }
  }

  let amount = delivery + subtotal;

  const config = {
    public_key: process.env.FL_PUBLIC_KEY_TEST,
    tx_ref: order && order[0]?.order_id,
    amount,
    currency: "NGN",
    payment_options: "card,ussd",
    customer: {
      email: order && order[0]?.customer_email,
      phonenumber: order && order[0]?.customer_phone,
      name: User?.first_name + " " + User?.last_name,
    },
    customizations: {
      title: `Payment for Order ${order[0]?.order_id} on Tadlace`,
      description: "Payment for items in cart",
      logo:
        "https://st2.depositphotos.com/4403291/7418/v/450/depositphotos_74189661-stock-illustration-online-shop-log.jpg",
    },
  };

  const handleFlutterPayment = useFlutterwave(config);

  return (
    <form>
      <Button
        mt="8px"
        background="#F5A623"
        color="white"
        onClick={() => {
          handleFlutterPayment({
            callback: (res) => {
              updateOrderFn(order[0]?.order_id);
              closePaymentModal();
            },
            onClose: () => {
              toast({
                title: "Unsuccessful, Closed.",
                status: "info",
                isClosable: true,
              });
            },
          });
        }}
      >
        Pay With Flutterwave
      </Button>
    </form>
  );
};
