import {Fragment, useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {geoformat} from "../js/geoformat.js";
import {setgeoValue} from "../js/slice.js";
import {Button, Dropdown, Menu, message, Splitter} from "antd";
import FormatBtn from "../component/FormatBtn.jsx";
import SaveBtn from "../component/SaveBtn.jsx";
import {IoShapesOutline} from "react-icons/io5";
import {LuTableProperties} from "react-icons/lu";
import LocalGeometry from "../component/LocalGeometry.jsx";
import LocalTable from "../component/LocalTable.jsx";
import VerificationBtn from "../component/verificationBtn.jsx";
import {BsGrid1X2Fill} from "react-icons/bs";
import "../App.scss"
import Editor, {loader} from "@monaco-editor/react";
import {MdPlaylistAddCheck} from "react-icons/md";


loader.config({
    "vs/nls": {availableLanguages: {"*": 'zh-cn'}},
    // paths: {
        // vs: "node_modules/monaco-editor/min/vs"
        // vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.46.0/min/vs',
    // }
});

loader.init()
    .then((monaco) => console.log('Here is the monaco instance', monaco))
    .catch(e => console.log("loading!!", e.message));

export default function JsonChange() {
    const [current, setCurrent] = useState('feature');
    const taVal = useSelector((state) => state.jsonReducer.taVal);
    const dispatch = useDispatch();

    const [editContent, setEditContent] = useState(taVal);

    const [sw, setSwitch] = useState(true);
    const [lay, setLay] = useState(true);


    useEffect(() => {
        try {
            let temp = JSON.parse(editContent);
            if (geoformat(temp).result) {
                dispatch(setgeoValue(editContent))
            } else {
                message.error("geojson 格式错误，不会同步")
            }
        } catch (e) {
            message.error(e.message + "-非json格式,不会同步")
        }


    }, [editContent]);


    const menuItems = [
        {
            label: '要素化',
            key: 'feature',
            icon: <IoShapesOutline className={"mx-2 size-4 inline-flex"}/>
        },
        {
            label: '表格化',
            key: 'table',
            icon: <LuTableProperties className={"mx-2 size-4 inline-flex"}/>
        },
    ]

    function valChange(newValue) {
        try {
            let temp = JSON.parse(newValue);
            if (geoformat(temp).result) {
                dispatch(setgeoValue(newValue))
            } else {
                message.error("geojson 格式错误，不会同步")
            }
        } catch (e) {
            message.error(e.message + "-非json格式,不会同步")
        }
    }


    const items = [
        {
            key: '1',
            label: (
                <button onClick={() => setLay(true)}>
                    <svg className="size-5" viewBox="0 0 1066 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
                         width="200" height="200">
                        <path
                            d="M938.666667 85.333333H170.666667a42.666667 42.666667 0 0 0-42.666667 42.666667v768a42.666667 42.666667 0 0 0 42.666667 42.666667h768a42.666667 42.666667 0 0 0 42.666666-42.666667V128a42.666667 42.666667 0 0 0-42.666666-42.666667zM384 853.333333H213.333333V170.666667h170.666667v682.666666z m512 0H469.333333v-298.666666h426.666667v298.666666z m0-384H469.333333V170.666667h426.666667v298.666666z"
                            fill="#000"></path>
                    </svg>
                </button>
            ),
        },
        {
            key: '2',
            label: (
                <button onClick={() => setLay(false)}>
                    <svg className="size-5" viewBox="0 0 1024 1024" version="1.1"
                         xmlns="http://www.w3.org/2000/svg" width="200" height="200">
                        <path
                            d="M896 85.333333H128a42.666667 42.666667 0 0 0-42.666667 42.666667v768a42.666667 42.666667 0 0 0 42.666667 42.666667h768a42.666667 42.666667 0 0 0 42.666667-42.666667V128a42.666667 42.666667 0 0 0-42.666667-42.666667zM341.333333 853.333333H170.666667V170.666667h170.666666v682.666666z m256 0h-170.666666V170.666667h170.666666v682.666666z m256 0h-170.666666V170.666667h170.666666v682.666666z"
                            fill="#000"></path>
                    </svg>
                </button>
            )
        }
    ];

    const verificate = () => {
        try {
            const {msg} = geoformat(JSON.parse(editContent))
            message.info(msg);
        } catch  {
            message.warning("格式错误");
        }
    }

    return (
        <div className={"h-dvh"}>
            <Splitter>
                <Splitter.Panel defaultSize="40%" max={"60%"} min={"10%"}>
                    <div className={"h-full flex flex-col"}>
                        <div
                            className={"w-full max-h-10 flex flex-row flex-nowrap space-x-[2px] flex-none overflow-clip items-center"}>
                            <FormatBtn/>
                            {/*<VerificationBtn data={editContent}/>*/}

                            <Button className={"px-2 rounded-none shadow-none"} type={"primary"} size={"small"}
                                    icon={<MdPlaylistAddCheck className={"size-6 "} title={"格式"}/>}
                                    onClick={verificate}>
                                格式校验
                            </Button>

                            <SaveBtn/>
                            <div className={"grow"}></div>

                            <Dropdown menu={{items}} placement={'bottom'}>
                                <a onClick={(e) => e.preventDefault()}>
                                    <BsGrid1X2Fill className="size-6 "/>
                                </a>
                            </Dropdown>
                        </div>
                        <div className={"grow monaco-table-height"}>
                            {/*<MonacoEditor/>*/}
                            <Editor defaultLanguage="json"
                                    onChange={setEditContent}
                                    value={editContent}
                                    options={{
                                        "contextmenu": true,
                                        "fontSize": 16,
                                        "overviewRulerBorder": false,
                                        "wordWrap": "on",
                                        "wordBasedSuggestionsOnlySameLanguage": false,
                                        "formatOnPaste": true,
                                        "formatOnType": true,
                                        "scrollBeyondLastLine": false,
                                        "smoothScrolling": true,
                                        "language": "json"
                                    }}/>
                        </div>
                    </div>
                </Splitter.Panel>
                <Splitter.Panel defaultSize="60%" min={"10%"} max={"90%"} className={"bg-white"}>
                    {lay ? <Fragment>
                            <Menu selectedKeys={[current]} mode="horizontal" items={menuItems}
                                  subMenuCloseDelay={0} onSelect={() => setSwitch(!sw)} className={"h-[2.7rem]"}
                                  onClick={(e) => setCurrent(e.key)}/> {
                            sw ? <LocalGeometry/> : <LocalTable/>
                        }
                        </Fragment> :
                        <Splitter>
                            <Splitter.Panel defaultSize="50%" max={"60%"} min={"20%"}>
                                <LocalGeometry/>
                            </Splitter.Panel>
                            <Splitter.Panel defaultSize="50%" min={"20%"} max={"90%"} className={"bg-white"}>
                                <LocalTable/>
                            </Splitter.Panel>
                        </Splitter>
                    }
                </Splitter.Panel>
            </Splitter>
        </div>
    )
}
