import {MdOutlineRotate90DegreesCcw} from "react-icons/md";
import "../App.scss"
import {HiOutlineInformationCircle} from "react-icons/hi";
import {CgFormatCenter} from "react-icons/cg";
import {Divider, message} from "antd";
import {GoGear} from "react-icons/go";
import {IoAdd} from "react-icons/io5";
import {Link, Outlet} from "react-router";
import {useDispatch, useSelector} from "react-redux";
import {setgeoValue} from "../js/slice";
import {io} from "socket.io-client";
import {ws} from "../js/socketContent.js";
import {SocketContext} from "../js/content";
import {useEffect} from "react";
import {setConfig} from "../js/globalSlice.js";
import {VscGitPullRequestGoToChanges} from "react-icons/vsc";

const socket1 = io(ws.url, {
    path: ws.path,
    reconnectionAttempts: 4,
    reconnection: true,
    autoConnect: true
})

export default function App() {
    const taVal = useSelector((state) => state.jsonReducer.taVal);
    const dispatch = useDispatch();

    message.config({
        maxCount: 3,
    });

    useEffect(() => {
        socket1.on("accept", (data) => {
                console.log("main accept:" + data);
                dispatch(setgeoValue(JSON.stringify(data)))
            }
        )
    }, []);

    useEffect(() => {
        //传送对象
        socket1.emit("up", JSON.parse(taVal));
    }, [taVal]);

    useEffect(() => {
        //       paresProp();
    }, []);

    function paresProp() {
        let content = window.appConfig.parseProp();
        console.log(content);
        dispatch(setConfig(content));
    }

    return (
        <SocketContext.Provider value={socket1}>
            <div className={"flex flex-row  w-dvw h-dvh m-0 p-0"}>

                <div className={"w-16 flex-initial h-full bg-amber-300  py-3 "}>
                    <div className={"h-full  flex flex-col gap-1 items-center"}>
                        <p className={""}>GEO</p>

                        <Divider className={"my-1 "}/>
                        <div className={" flex flex-col gap-1 items-center"}>
                            <Link to={"/add"}>
                                <div className={" rounded-full hover:bg-amber-200 duration-200"}>
                                    <IoAdd title={"添加文化"} className={"size-11 p-1 "}/>
                                </div>

                            </Link>

                            <div className={"p-1"}>
                                <Link to={"/change"}>
                                    <div className={" rounded-full  p-1 hover:bg-amber-200 duration-200"}>
                                        <VscGitPullRequestGoToChanges title={"多文件编辑"}
                                                                      className={"size-11 p-1 "}/>
                                    </div>

                                </Link>
                            </div>
                            {/*<div className={"p-1"}>*/}
                            {/*    <Link to={"/editor"}>*/}
                            {/*        <div className={" rounded-full  p-1 hover:bg-amber-200 duration-200"}>*/}
                            {/*            <CgFormatCenter title={"文件编辑"} className={"size-11 p-1 "}/>*/}
                            {/*        </div>*/}
                            {/*    </Link>*/}
                            {/*</div>*/}
                        </div>
                        <Divider className={"my-1 "}/>
                        <div className={"flex flex-col flex-wrap"}>
                            <button onClick={() => window.geoScript.newPage()}>
                                <div className={" rounded-xl  hover:bg-yellow-100 duration-200"}>
                                    <MdOutlineRotate90DegreesCcw title={"经纬度转换"} className={"size-10 p-1 "}/>
                                </div>
                            </button>
                        </div>

                        <div className={"grow  flex flex-col  justify-end mt-3 "}>
                            <Divider/>

                            {/*<div className={"p-1"}>*/}
                            {/*    <Link to={"/configuration"}>*/}
                            {/*        <GoGear title={"config"}*/}
                            {/*                className={"p-2 size-11 rounded-full hover:bg-amber-200 duration-200 "}/>*/}
                            {/*    </Link>*/}
                            {/*</div>*/}

                            <div className={"p-1"}>
                                <Link to={"/me"}>
                                    <HiOutlineInformationCircle title={"me"}
                                                                className={"p-2 size-11 rounded-full hover:bg-amber-200 duration-200 "}/>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={"content-change  "}>
                    <Outlet></Outlet>
                </div>
            </div>
        </SocketContext.Provider>
    )
}


