import App from './App.jsx'
import {createRoot} from "react-dom/client";
import configureStore from "./js/reduxStore.js";
import {Provider} from "react-redux";

createRoot(document.getElementById('root')).render(
    <Provider store={configureStore}>
    <App/>
</Provider>)
