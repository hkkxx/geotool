import {createRoot} from "react-dom/client";
import {Provider} from "react-redux";
import configureStore from "../js/reduxStore";
import NewPage from "./paging.jsx";

createRoot(document.getElementById("root")).render(
    <Provider store={configureStore}>
        <NewPage/>
    </Provider>
);