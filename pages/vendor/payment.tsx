import { Navigation } from "@/components/vendor/Navigation";
import React, { useEffect } from "react";
import { ProtectRouteV } from "@/utils/ProtectedRouteV";
import { useDispatch, useSelector } from "react-redux";
import { useToken } from "@/Context/TokenProvider";
import {
  IOrderInitialState,
  ordersThunk,
} from "@/redux/features/orders/fetchOrders";

interface DefaultOrderState {
  orders: IOrderInitialState;
}

export const Payment = () => {
  // Redux stuff
  const dispatch = useDispatch();

  const { orders, error } = useSelector<DefaultOrderState, IOrderInitialState>(
    (state) => state.orders
  );

  //Token from context
  const { Token } = useToken();

  useEffect(() => {
    if (Token) {
      dispatch(ordersThunk(Token, { limit: null }));
    }
  }, [Token]);

  //delivered orders
  const delivered = orders.filter((o) => o.orderStatus.delivered === "true");

  //Getting Revenue
  const subtotal = delivered.map((d) => d.subtotal);

  //ensure subtotal has run before reducing
  const revenue = subtotal.length > 0 ? subtotal.reduce((a, c) => a + c) : 0;
  return (
    <div className="payment_layout">
      <section>
        <Navigation />
      </section>

      <main>
        <header>
          <p>We charge 1.5% on every order</p>
          <p>Withdraw from your wallet anytime</p>
        </header>

        <section>Revenue: {revenue}</section>
      </main>

      <style jsx>{`
        .payment_layout {
          display: flex;
        }
      `}</style>
    </div>
  );
};

export default ProtectRouteV(Payment);
