import {createBrowserRouter, createHashRouter, RouterProvider} from "react-router";
import {createRoot} from "react-dom/client";
import AppConfiguration from "./layout/Configuration.jsx";
import App from "./layout/App.jsx";
import Add from "./layout/Add.jsx";
import JsonChange from "./layout/JsonChange.jsx";
import configureStore from "./js/reduxStore.js";
import {Provider} from "react-redux";
import About from "./layout/About.jsx";

const appRouter = createHashRouter([
    {
        path: "/",
        element: <App></App>,
        children: [
            {
                index: true,
                element: <JsonChange/>,
            }, {
                path: "/add",
                element:
                    <Add/>
            }, {
                //     path: "/editor",
                //     element: <JsonEditor/>
                // }, {
                path: "/change",
                element: <JsonChange/>
            },
            {
                path: "/configuration",
                element: <AppConfiguration/>
            },
            {
                path: "/me",
                element: <About/>
            }
        ]
    },
    {
        path: "about",
        element: <div>About</div>,
    },
]);


createRoot(document.getElementById("root")).render(
    <Provider store={configureStore}>
        <RouterProvider router={appRouter}/>
    </Provider>
)