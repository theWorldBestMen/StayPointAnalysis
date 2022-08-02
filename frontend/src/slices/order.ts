import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// store -> reducer(root, state) -> user slice, order slice
// state.user
// state.order
// state.ui -> initialState: loading : false ...

// action: state를 바꾸는 행위/동작
// dispatch: 그 액션을 실제로 실행하는 함수
// reducer: 액션이 실제로 실행되면 state를 바꾸는 로직

export interface Order {
  orderId: string;
  start: {
    latitude: number;
    longitude: number;
  };
  end: {
    latitude: number;
    longitude: number;
  };
  price: number;
}

interface InitialState {
  orders: Order[];
  deliveries: Order[];
}

const initialState: InitialState = {
  orders: [],
  deliveries: [],
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    addOrder(state, action: PayloadAction<Order>) {
      state.orders.push(action.payload);
    },
    acceptOrder(state, action: PayloadAction<string>) {
      const index = state.orders.findIndex((v) => v.orderId === action.payload);
      if (index !== -1) {
        state.deliveries.push(state.orders[index]);
        state.orders.splice(index, 1);
      }
    },
    rejectOrder(state, action: PayloadAction<string>) {
      const index = state.orders.findIndex((v) => v.orderId === action.payload);
      if (index !== -1) {
        state.orders.splice(index, 1);
      }
      const delivery = state.deliveries.findIndex(
        (v) => v.orderId === action.payload
      );
      if (delivery !== -1) {
        state.deliveries.splice(delivery, 1);
      }
    },
  },
  extraReducers: (builder) => {},
});

export default orderSlice;
