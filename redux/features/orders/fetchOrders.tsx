import { createSlice } from "@reduxjs/toolkit";
import { Orders } from "@/Typescript/types";
import { graphQLClient } from "@/utils/client";

interface orderProp {
  getVendorOrders?: Orders[];
  getCustomerOrders?: Orders[];
}
export interface IOrderInitialState {
  orders: orderProp;
  loading: boolean;
  error: string;
}

let initialState: IOrderInitialState = {
  orders: {},
  loading: false,
  error: "",
};
const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    loader(state) {
      state.loading = true;
    },
    getOrders(state, action: { payload: orderProp; type: string }) {
      let data = action.payload;
      state.orders = data;
      state.loading = false;
    },
    errorResponse(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export default orderSlice.reducer;
export const { getOrders, errorResponse, loader } = orderSlice.actions;

// get cart items thunk
export function ordersThunk(Token, ordersQuery, variables) {
  return async (dispatch) => {
    try {
      dispatch(loader());
      if (Token) {
        graphQLClient.setHeader("authorization", `bearer ${Token}`);
      }
      const res = await graphQLClient.request(ordersQuery, variables);
      dispatch(getOrders(res));
    } catch (err) {
      let error = err?.response?.errors[0].message || err.message;
      if (Token && err) {
        dispatch(errorResponse(error));
      }
      if (err.message === "Network request failed") {
        dispatch(errorResponse(error));
      }
    }
  };
}
