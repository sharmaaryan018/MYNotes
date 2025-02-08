import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import {Toaster} from "react-hot-toast";
import NotesProvider from "./services/contextApi/NotesContext"; // Import NotesProvider
import { Provider } from "react-redux";
import store from "./utility/store";


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
  <Provider store ={store}>
    <NotesProvider> {/* Wrap App with NotesProvider */}
      <App />
      <Toaster />
    </NotesProvider>
    </Provider>
  </BrowserRouter>
);
