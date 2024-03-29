import React, { useEffect, useState } from "react";
import { useToken } from "@/Context/TokenProvider";
import { useQuery } from "@/components/useQuery";
import { getOrder } from "@/graphql/customer";
import { Layout } from "@/components/Layout";
import { ConfirmOrder } from "@/components/customer/ConfirmOrder";
import { Orders } from "@/Typescript/types";
import { Commas, nairaSign } from "@/utils/helpers";
import { Spinner, useToast } from "@chakra-ui/core";
import Head from "next/head";
import { Flutterwave } from "@/components/customer/Flutterwave";
import Cookies from "js-cookie";

export async function getServerSideProps({ params }) {
  const variables = {
    order_id: params.id,
  };

  return {
    props: {
      variables,
    },
  };
}

const Pay = ({ variables }) => {
  if (typeof window === "object" && !Cookies.get("role")) {
    return <div>unauthorised</div>;
  }

  const toast = useToast();
  const { Token } = useToken();
  const [Loader, setLoader] = useState(false);

  //refetch query
  const [refetch, setRefetch] = useState(false);
  const [data, loading, error] = useQuery(getOrder, variables, Token, refetch);
  const order: Orders[] = data ? data.getOrder : null;

  useEffect(() => {
    setRefetch(!refetch);
  }, [error]);

  const subTotal =
    order && order.length > 0 ? order.reduce((a, c) => a + c.subtotal, 0) : 0;
  let delivery = order ? order.length * 1000 : 0;

  return (
    <Layout>
      <Head>
        <title>Payment | Secure | skincare</title>
        <script src="https://checkout.flutterwave.com/v3.js"></script>
      </Head>
      {error &&
        toast({
          title: "An Error Occured",
          description: "Check your internet connection and refresh",
          status: "error",
        })}
      {!order && <div className="space"></div>}

      {Loader && (
        <div className="opacity">
          <div className="spinner">
            <Spinner speed="1s" color="white"></Spinner>
          </div>
        </div>
      )}

      {order && (
        <div className="pay-wrap">
          <h1 className="heading">Order Summary</h1>
          <div className="summary-body">
            <section className="delivery pt-3 pb-3">
              <h2 className="pb-1">Delivery Address</h2>
              <p>&#8226; {order[0]?.customer_address}</p>
              <p>&#8226; {order[0]?.customer_phone}</p>
            </section>

            <h2 className="pb-1">Order Details</h2>
            {order.map((o) => (
              <section key={o.product_id}>
                <div className="details-grid">
                  <p>
                    {o.name} x {o.quantity}
                  </p>
                  <p>
                    {nairaSign} {Commas(o.price * o.quantity)}
                  </p>
                </div>

                {order && o.request && (
                  <div className="details-grid">
                    <p>Request </p>
                    <p>{o.request}</p>
                  </div>
                )}
              </section>
            ))}
          </div>

          <div className="details-grid">
            <p>Delivery</p>
            <p>
              {nairaSign} {Commas(delivery)}
            </p>
          </div>
          <div className="details-grid">
            <p>Subtotal </p>
            <p>
              {nairaSign} {Commas(subTotal + delivery)}
            </p>
          </div>
        </div>
      )}

      {order && (
        <div className="text-center pb-3 pt-3">
          <ConfirmOrder
            setLoader={setLoader}
            order={order}
            subtotal={subTotal}
            delivery={delivery}
          />
          <Flutterwave
            setLoader={setLoader}
            order={order}
            subtotal={subTotal}
            delivery={delivery}
          />
        </div>
      )}

      <style jsx>{`
        .pay-wrap {
          margin: 10px auto;
          width: 90%;
          border: 0.5px solid $softblue;
          border-radius: 12px;
          padding: 10px;
          box-shadow: var(--box) $var(--softgrey);
        }

        .heading {
          text-align: center;
          font-weight: bold;
          color: var(--deepblue);
          font-size: 1.3rem;
          padding: 10px 0;
        }
        .details-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          background: var(--softblue);
          border-bottom: 0.5px solid var(--softgrey);
          padding: 10px;
        }

        .details-grid p:last-child {
          font-weight: bold;
        }

        h2 {
          font-weight: bold;
        }

        @media only screen and (min-width: 700px) {
          .pay-wrap {
            width: 70%;
          }
        }

        @media only screen and (min-width: 1000px) {
          .pay-wrap {
            width: 60%;
            margin: 20px auto;
          }
          .heading {
            font-size: 1.5rem;
            padding: 20px 0;
          }
        }

        @media only screen and (min-width: 1400px) {
          .pay-wrap {
            width: 50%;
          }
          .heading {
            font-size: 1.8rem;
          }
        }
      `}</style>
    </Layout>
  );
};

export default Pay;
