import { configureStore } from "@reduxjs/toolkit";
import { boardReducer } from "../../entities/board/lib/reducer";

export const globalStore = configureStore({
  reducer: boardReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});
