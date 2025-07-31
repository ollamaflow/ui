import {
  Dispatch,
  isRejectedWithValue,
  Middleware,
  MiddlewareAPI,
  UnknownAction,
} from "@reduxjs/toolkit";
import { message } from "antd";

export const errorHandler = (err: any, dispatch: Dispatch<UnknownAction>) => {
  const error = err?.payload || {};
  //eslint-disable-next-line no-console
  console.log(error, "chk errorHandler error");
  if (error?.Message) {
    message.error(error?.Message);
  } else if (error?.Description) {
    message.error(error?.Description);
  } else if (error?.message) {
    message.error(error?.message);
  } else if (error?.data == "Network Error") {
    message.error("Network Error");
  } else {
    message.error("Something went wrong.");
  }
  if (error.Error === "NotAuthorized") {
    message.error("Session expired. Redirecting to login page...");
    // setTimeout(() => {
    //   dispatch(logOut());
    // }, 3000);
  }
};

export const rtkQueryErrorLogger: Middleware =
  (api: MiddlewareAPI) => (next: (action: any) => any) => (action: any) => {
    const { dispatch } = api;
    // RTK Query uses `createAsyncThunk` from redux-toolkit under the hood, so we're able to utilize these matchers!
    if (isRejectedWithValue(action)) {
      errorHandler(action, dispatch);
    }

    return next(action);
  };
