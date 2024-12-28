import './App.css'
import ToolBar from "./component/ToolBar.jsx";
import {Fragment, useEffect} from "react";
import Content from "./component/Content.jsx";
import { ArchOption, Options as ElectronPackagerOptions, TargetPlatform } from '@electron/packager';

function App() {

    const OfficialArch = 'ia32' | 'x64' | 'armv7l' | 'arm64' | 'mips64el' | 'universal';

    useEffect(() => {
        document.body.style.height = "100vh";
        document.body.style.minWidth = "700px"
    }, [])


    return (
        <Fragment>
            <ToolBar></ToolBar>
            <div className={"w-full min-h-56 grid "}>
                <Content/>
            </div>
        </Fragment>
    )
}

export default App
