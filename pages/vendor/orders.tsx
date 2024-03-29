import { List, ListItem } from "@chakra-ui/core";
import Head from "next/head";
import React, { useState } from "react";
import { Navigation } from "@/components/vendor/Navigation";
import { OrdersComponent } from "@/components/vendor/OrdersComponent";
import { ProtectRouteV } from "@/utils/ProtectedRouteV";
import { screenWidth } from "@/utils/helpers";

export const Orders = () => {
  const [orderLimit, setOrderLimit] = useState(15);
  return (
    <div className="orders-page">
      <Head>
        <title>Orders | Vendor | skincare</title>
      </Head>
      <div className="orders-layout">
        <Navigation />
        <main>
          <div className="order-status shadow">
            <List>
              <ListItem>
                * <strong>Cancelled</strong> signifies that admin or a customer
                has cancelled the order.
              </ListItem>
              <ListItem mt="2" mb="2">
                * <strong>Delivered</strong> signifies that your item has been
                delivered to your customer
              </ListItem>
              <ListItem>
                * <strong>Contact Us </strong> for more information
              </ListItem>
            </List>
          </div>
          <h1>All Orders</h1>
          <p
            style={{
              fontSize: "0.8rem",
            }}
          >
            <span
              style={{
                color: "red",
              }}
            >
              "*"
            </span>{" "}
            Signifies Pending,{" "}
            {screenWidth() < 900 && (
              <span className="scroll-right">scroll right for more info</span>
            )}
          </p>
          <OrdersComponent limit={orderLimit} setOrderLimit={setOrderLimit} />
        </main>
      </div>

      <style jsx>{`
        .orders-layout {
          display: flex;
        }
        .order-status {
          font-size: 0.9rem;
          margin: 45px 0 30px 0;
          /* box-shadow: var(--box) var(--softgrey); */
          padding: 5px;
          border-radius: 8px;
        }

        .order-status strong {
          color: var(--deepblue);
        }

        .orders-page h1 {
          margin: 10px 0 10px 0;
          color: var(--deepblue);
          font-weight: bold;
          font-size: 0.9rem;
        }

        .orders-layout main {
          margin: 0 auto;
          width: 90%;
        }
        @media only screen and (min-width: 700px) {
          .order-status {
            font-size: 1rem;
          }
          .orders-layout main {
            margin: 0 auto;
            width: 60%;
          }
        }
        @media only screen and (min-width: 1000px) {
          .scroll-right {
            display: none;
          }
        }
        @media only screen and (min-width: 1200px) {
          .order-status {
            padding: 10px;
          }

          .orders-layout main {
            width: 70%;
            margin-top: 20px;
          }
          .orders-page h1 {
            font-size: 1.2rem;
          }
        }
        @media only screen and (min-width: 1900px) {
          .orders-layout main {
            width: 80%;
          }
        }
        @media only screen and (min-width: 2200px) {
          .orders-layout main {
            width: 80%;
          }
        }
      `}</style>
    </div>
  );
};

export default ProtectRouteV(Orders);
