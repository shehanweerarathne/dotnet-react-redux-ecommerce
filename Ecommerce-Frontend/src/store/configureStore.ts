import {configureStore} from "@reduxjs/toolkit";
import {basketSlice} from "../pages/basket/basketSlice";
import {counterSlice} from "../pages/contact/counterSlice";
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import {catalogSlice} from "../components/catalog/catalogSlice";
import {accountSlice} from "../pages/Account/accountSlice";



export const store = configureStore({
  reducer:{
    counter:counterSlice.reducer,
    basket: basketSlice.reducer,
    catalog: catalogSlice.reducer,
    account:accountSlice.reducer
  }
})
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = ()=> useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
