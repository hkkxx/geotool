import {useContext, useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Flex,  Splitter} from "antd";
import {SocketContext} from "../js/content.js";
import SaveBtn from "../component/SaveBtn.jsx";
import FormatBtn from "../component/FormatBtn.jsx";
import MonacoEditor from "../component/MonacoEditor.jsx";
import VerificationBtn from "../component/verificationBtn.jsx";

export default function JsonEditor() {
    const taVal = useSelector((state) => state.jsonReducer.taVal);
    const dispatch = useDispatch();
    const socket = useContext(SocketContext);

    useEffect(() => {
        //传送对象
        socket.emit("up", JSON.parse(taVal));
    }, [taVal]);

    return (
        <Splitter className={"w-full h-full"}>
            <Splitter.Panel defaultSize="40%" max={"60%"} min={"10%"}>
                <Flex vertical={true} className={"h-full"}>
                    <div className={" inline-flex items-center h-10  space-x-1"}>
                        <FormatBtn/>
                        <VerificationBtn val={taVal}/>
                        <SaveBtn/>
                    </div>
                    <MonacoEditor/>
                </Flex>
            </Splitter.Panel>
            <Splitter.Panel defaultSize="60%" min={"10%"} max={"90%"} className={"bg-white"}>
                <div className={"w-full h-full bg-cyan-100"}>
                    <div className={"w-full h-full min-h-48 min-w-48"}>
                        {/*<Map_l7/>*/}
                    </div>
                </div>
            </Splitter.Panel>
        </Splitter>
    )
}
