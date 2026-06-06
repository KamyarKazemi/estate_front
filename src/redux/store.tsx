import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";

// import sendCodeReducer from "./slices/sendCodeSlice";
// import verifyCodeReducer from "./slices/verifyCodeSlice";
// import completeRegisterReducer from "./slices/completeRegisterSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    // sendCode: sendCodeReducer,
    // verifycode: verifyCodeReducer,
    // completeRegister: completeRegisterReducer,
  },
});
