import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { globalStore } from "./app/store/reducer";
import { App } from "./app/App";
import "./app/styles/index.scss";

createRoot(document.getElementById("root")!).render(
  <Provider store={globalStore}>
    <App />
  </Provider>
);
