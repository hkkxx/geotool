import {createRoot} from "react-dom/client";
import "../App.css"

export function AboutInfo() {

    return (
        <div className={"w-full h-full items-center flex-col flex"}>
            <div>node:{window.versions.node()}</div>
            <div>chrome:{window.versions.chrome()}</div>
            <div>electron:{window.versions.electron()}</div>
        </div>
    )
}


createRoot(document.getElementById("root")).render(<AboutInfo/>);