import {
  Button,
  Skeleton,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  Text,
} from "@chakra-ui/core";
import { useEffect, useState } from "react";
import { Commas, truncate } from "@/utils/helpers";
import { Orders } from "@/Typescript/types";

interface IDashboardOrders {
  orders: Orders[];
  error: string;
  loading: boolean;
}
//Recent Orders displayed in /vendor/dashboard.
export const DashboardOrders = ({
  orders,
  error,
  loading,
}: IDashboardOrders) => {
  const [recentOrders, setRecentOrders] = useState<Orders[]>([]);

  useEffect(() => {
    if (orders) {
      setRecentOrders(orders.slice(0, 5));
    }
  }, [orders]);

  //Parse Date
  function toDate(d) {
    let date = new Date(parseInt(d));
    let format = new Intl.DateTimeFormat("en-us", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(date);

    return format || date.toLocaleString();
  }

  return (
    <div className="orders-table" style={{ overflowX: "auto" }}>
      {loading && (
        <Text as="div" className="skeleton">
          <Skeleton height="40px" my="10px" />
          <Skeleton height="40px" my="10px" />
          <Skeleton height="40px" my="10px" />
          <Skeleton height="40px" my="10px" />
          <Skeleton height="40px" my="10px" />
          <Skeleton height="40px" my="10px" />
          <Skeleton height="40px" my="10px" />
          <Skeleton height="40px" my="10px" />
        </Text>
      )}

      {error &&
        "Error fetching your orders, check your internet connection and refresh"}

      {!error && !loading && recentOrders.length === 0 ? (
        <Text as="div" textAlign="center">
          You Have No Orders...
        </Text>
      ) : null}

      {recentOrders.length > 0 && (
        <table style={{ width: "100%" }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Qty</th>
              <th>Total</th>
              <th>Req</th>
              <th>Status</th>
              <th>More</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((o: Orders) => (
              <tr key={o.order_id}>
                <td className="name">
                  {/* display "*" if order hasn't been delivered */}
                  <span
                    style={{
                      color: "red",
                      display:
                        o.orderStatus.canceled === "false" &&
                        o.orderStatus.delivered === "false" &&
                        o.orderStatus.in_transit === "false"
                          ? "block"
                          : "none",
                    }}
                  >
                    *
                  </span>
                  <span>{o.name} </span>
                </td>
                <td>{Commas(o.price)}</td>
                <td>{o.quantity}</td>
                <td>{Commas(o.subtotal)}</td>
                <td>{truncate(o.request, 60) || "none"}</td>
                <td>
                  {/* Canceled status  */}
                  {o.orderStatus.canceled === "true" ? "Cancelled" : ""}

                  {/* processing  */}
                  {o.orderStatus.delivered === "false" &&
                  o.orderStatus.in_transit === "false" &&
                  o.orderStatus.canceled === "false"
                    ? "Processing"
                    : ""}

                  {/* delivered shows "delivered", else in transit */}
                  {o.orderStatus.delivered === "true"
                    ? "Delivered"
                    : o.orderStatus.in_transit === "true"
                    ? "In Transit"
                    : ""}
                </td>
                <td>
                  <Popover placement="left" usePortal={true}>
                    <PopoverTrigger>
                      <Button
                        size="xs"
                        rightIcon="chevron-down"
                        style={{
                          background: "var(--deepblue)",
                          color: "white",
                        }}
                      >
                        More
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent zIndex={4}>
                      <PopoverArrow />
                      <PopoverCloseButton />
                      <PopoverHeader>
                        <Text as="span">
                          Order ID:{" "}
                          <Text as="span" color="var(--deepblue)">
                            {o.order_id}
                          </Text>
                          <Text as="span" padding="0 12px">
                            |
                          </Text>
                          <Text as="span" color="var(--deepblue)">
                            {toDate(o.created_at)}
                          </Text>
                        </Text>
                      </PopoverHeader>
                      <PopoverBody>
                        <div>
                          <Button
                            color="var(--deepblue)"
                            isDisabled={
                              o.orderStatus.delivered === "true" &&
                              o.orderStatus.canceled === "true"
                                ? true
                                : false
                            }
                            // onClick={() =>
                            //   router.push(
                            //     `/customer?returnId=${lookup[o][0].orderStatus.order_id}`
                            //   )
                            // }
                          >
                            Contact
                          </Button>
                        </div>
                      </PopoverBody>
                      <PopoverFooter fontSize="0.7rem">
                        Ensure your products are always readily available
                        {o.orderStatus.delivered === "true" &&
                        o.orderStatus.delivery_date
                          ? `| Delivered: ${toDate(
                              o.orderStatus.delivery_date
                            )}`
                          : ""}
                      </PopoverFooter>
                    </PopoverContent>
                  </Popover>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <style jsx>{`
        table {
          border-spacing: 5px;
        }
        tr:nth-child(even) {
          background-color: #f2f2f2;
        }
        td:nth-child(4) {
          color: var(--deepblue);
          font-weight: bold;
        }
        th {
          font-size: 0.8rem;
          background-color: #f2f2f2;
          text-align: center;
        }
        td {
          font-size: 0.8rem;
          padding: 5px;
          text-align: center;
        }
        .name {
          display: flex;
        }

        @media only screen and (min-width: 700px) {
          td {
            padding: 5px 10px;
          }
        }
        @media only screen and (min-width: 1000px) {
          td {
            padding: 10px 10px;
          }
        }
        @media only screen and (min-width: 1200px) {
          td {
            padding: 10px 10px;
            font-size: 1rem;
          }
          th {
            font-size: 1rem;
          }
        }

        @media only screen and (min-width: 1700px) {
          .orders-table {
            width: 70%;
          }
        }
      `}</style>
    </div>
  );
};
