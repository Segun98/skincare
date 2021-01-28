import { Navigation } from "@/components/vendor/Navigation";
import React, { useEffect } from "react";
import { ProtectRouteV } from "@/utils/ProtectedRouteV";
import { useToken } from "@/Context/TokenProvider";
import { Commas, nairaSign } from "@/utils/helpers";
import useSWR, { mutate } from "swr";
import { getVendorOrders, withdrawalsQuery } from "@/graphql/vendor";
import queryFunc from "@/utils/fetcher";
import { useUser } from "@/Context/UserProvider";
import { useQuery } from "@/components/useQuery";
import { Withdraw } from "@/components/vendor/Withdraw";

export const Payment = () => {
  //Token from context
  const { Token } = useToken();
  const { User } = useUser();

  //fetch orders
  const { data: orders, isValidating } = useSWR(`getVendorOrders`, () =>
    queryFunc(getVendorOrders, { limit: null }, Token)
  );

  //fetch withdrawals
  //returns a string: -- data.withdrawals.message --
  const [data] = useQuery(
    withdrawalsQuery,
    { user_id: User["id"] },
    Token,
    isValidating
  );

  //refetch when token loads
  useEffect(() => {
    mutate(`getVendorOrders`);
  }, [Token, User["id"]]);

  //delivered orders
  const delivered =
    orders &&
    orders.getVendorOrders.filter((o) => o.orderStatus.delivered === "true");

  //arra of revenue
  const subtotal = orders && delivered.map((d) => d.subtotal);

  //ensure subtotal has run before adding up revenue
  const gross_revenue =
    orders && subtotal.length > 0 ? subtotal.reduce((a, c) => a + c) : 0;

  //deduction of 6%
  let deduction = (6 / 100) * gross_revenue;

  //net revenue
  const net_revenue = gross_revenue - deduction;

  //withdrawals by vendor

  const withdrawals = data && parseInt(data?.withdrawals.message);

  //wallet balance

  const wallet_balance = net_revenue - withdrawals;

  return (
    <div className="payment_layout">
      <head>
        <title>Withdraw from wallet | vendor | Tadlace</title>
      </head>
      <section>
        <Navigation />
      </section>
      {data && (
        <main>
          <header>
            <div>
              <h1>Hi {User?.business_name},</h1>
              <p>{User.business_name && `Your wallet`}</p>
            </div>
            <div></div>
          </header>
          <section className="boxes">
            <div className="total-revenue">
              <h1>Net Revenue</h1>
              <hr />
              <p>
                {nairaSign} {Commas(net_revenue)}
              </p>
            </div>
            <div className="withdrawals">
              <h1>Withdrawals</h1>
              <hr />
              <p>
                {nairaSign} {Commas(withdrawals)}
              </p>
            </div>
            <div className="wallet-balance">
              <h1>Wallet Balance</h1>
              <hr />
              <p>
                {nairaSign} {Commas(wallet_balance)}
              </p>
            </div>
          </section>

          <section>
            <Withdraw balance={wallet_balance} />
          </section>
        </main>
      )}
      <style jsx>{`
        .payment_layout {
          display: flex;
        }

        main {
          color: var(--text);
          margin: 0 auto;
          width: 90%;
        }

        header {
          display: flex;
          justify-content: space-between;
          margin-top: 40px;
        }
        header h1 {
          font-size: 1.2rem;
          font-weight: bold;
        }
        header p {
          margin: 5px 0;
          color: var(--text);
        }

        .boxes {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin: 10px 0;
        }

        .boxes div {
          box-shadow: var(--box) var(--softgrey);
          border-radius: 5px;
        }

        .boxes h1 {
          color: #2a69ac;
          font-size: 0.9rem;
          padding: 5px;
        }

        .boxes p {
          text-align: center;
          padding: 20px 0;
          font-weight: bold;
        }

        @media only screen and (min-width: 700px) {
          main {
            width: 60%;
          }

          .boxes {
            gap: 15px;
          }
        }

        @media only screen and (min-width: 1200px) {
          main {
            margin-right: 15%;
            width: 60%;
          }

          .boxes {
            gap: 20px;
          }

          .boxes h1 {
            padding: 10px;
            font-size: 1.1rem;
          }

          .boxes p {
            font-size: 1.8rem;
          }
        }

        @media only screen and (min-width: 1800px) {
          main {
            margin-right: 28%;
            width: 60%;
          }

          .boxes {
            gap: 35px;
          }

          .boxes h1 {
            padding: 12px;
            font-size: 1.2rem;
          }

          .boxes p {
            font-size: 1.9rem;
            padding: 25px 0;
          }
        }
      `}</style>
    </div>
  );
};

export default ProtectRouteV(Payment);
