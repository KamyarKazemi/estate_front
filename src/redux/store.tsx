import { configureStore } from "@reduxjs/toolkit";

import sendCodeReducer from "./slices/sendCodeSlice";
import verifyCodeReducer from "./slices/verifyCodeSlice";
import completeRegisterReducer from "./slices/completeRegisterSlice";

export const store = configureStore({
  reducer: {
    sendCode: sendCodeReducer,
    verifycode: verifyCodeReducer,
    completeRegister: completeRegisterReducer,
  },
});
