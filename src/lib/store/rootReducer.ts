import { UnknownAction, combineReducers } from "@reduxjs/toolkit";
import { rtkQueryErrorLogger } from "./rtkApiMiddlewear";
import sdkSlice from "./rtk/rtkSdkInstance";

const rootReducer = combineReducers({
  [sdkSlice.reducerPath]: sdkSlice.reducer,
});

export const apiMiddleWares = [rtkQueryErrorLogger, sdkSlice.middleware];

const resettableRootReducer = (
  state: ReturnType<typeof rootReducer> | undefined,
  action: UnknownAction
) => {
  return rootReducer(state, action);
};

export default resettableRootReducer;
