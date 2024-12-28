import './../App.css'
import {message, Upload, Modal, Radio} from 'antd';
import {MdFileUpload} from "react-icons/md";
import {useEffect, useState} from "react";
import {clsx} from "clsx";
import {geoformat} from "../js/geoformat";
import {useDispatch, useSelector} from "react-redux";
import {setgeoValue} from "../js/slice.js";
import {io} from "socket.io-client";
import {ws} from "../js/localStorage.js";

function merge2(n1, o2) {
    try {
        let n = JSON.parse(n1);
        let o = JSON.parse(o2);
        if (geoformat(n) && geoformat(o)) {
            let nf = n["features"] != null && Array.isArray(n["features"])
            let of = o["features"] != null && Array.isArray(o["features"])
            if (nf && of) {
                let na = Array.from(n["features"])
                let oa = Array.from(o["features"])
                let oo = o;
                oo["features"] = oa.concat(na);
                return oo
            }
            message.error("格式错误1,无法合并")
            return ""
        } else {
            message.error("格式错误2，无法合并")
            return ""
        }
    } catch (e) {
        console.error(e)
        message.error("解析错误，无法合并")
    }

}

const socket1 = io(ws.url, {path: ws.path});

export default function ToolBar() {
    const [newVla, setNewVla] = useState({content: "", fn: ""});

    const [open, setOpen] = useState(false);
    const {Dragger} = Upload;
    const [loadType, setLoadType] = useState('1');
    const [checkButton, setCheckButton] = useState(true);

    const taVal = useSelector((state) => state.jsonReducer.taVal);
    const dispatch = useDispatch();

    const options = [{label: '覆盖', value: '1',}, {label: '追加', value: '2',}, {label: '分页', value: '3',},];

    const props = {
        customRequest: function req(options) {
            const {onProgress, onError, onSuccess, file} = options;
            onProgress({percent: 10}, file)
            file.text().then(res => {
                setNewVla({content: res, fn: file.name});
                onProgress({percent: 100}, file)
                onSuccess({data: file})
            }).catch(onError)
        },
        onChange(info) {
            const {status} = info.file;
            if (status === 'uploading') {
                console.log("文件字节大小:" + info.file.size);
            }
            if (status === 'done') {
                message.success(`${info.file.name} 文件加载成功`);
            } else if (status === 'error') {
                message.error(`${info.file.name} 文件加载失败.`);
            }
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },
    };

    const onChange4 = ({target: {value}}) => {
        setLoadType(value);
    };
    useEffect(() => {
        socket1.on('connect_error', (socket) => {
            console.log("main bar error:" + socket);

        });
        socket1.on("error", (error) => {
            console.log("main bar  error:" + error)
            socket1.connect()
        });
        socket1.on("disconnect", (error) => {
            console.log("main bar  disconnect:" + error)
            socket1.connect()
        });

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

    function loadOk() {
        setOpen(false)
        if (geoformat(newVla.content)) {
            message.success("文件验证成功")
            setCheckButton(false)
            switch (loadType) {
                case '1': {
                    dispatch(setgeoValue(newVla.content))
                    break;
                }
                case '2': {
                    let update = JSON.stringify(merge2(newVla.content, taVal))
                    dispatch(setgeoValue(update))
                    break;
                }
                case "3":
                    //分页
                    window.geoScript.newPage2(JSON.stringify(newVla))
                    break
            }
        } else {
            message.error("文件验证失败")
            setCheckButton(true)
        }
    }

    const valCheck = () => {
        try {
            let p = JSON.parse(taVal)
            if (geoformat(p)) {
                message.success("格式正确")
            } else {
                message.error("格式错误")
            }
        } catch (e) {
            console.error(e)
            message.error("格式错误")
        }
    }

    const callfs = () => {
        window.geoScript.downFile(taVal)
    }

    return (
        <div className={"w-full grid grid-cols-12 grid-rows-2 gap-1  p-0.5"} id={"toolbar"}>
            <div className={"col-start-1 row-start-1 col-span-4 row-span-2  "}>
                <button
                    className={"place-self-auto h-full w-full text-center text-gray-600 bg-amber-100 border-gray-800 border-[1px] rounded-sm px-3 py-1 hover:bg-amber-50  transition-colors duration-75 "}
                    onClick={() => setOpen(true)}>上传geojson
                </button>
                <Modal
                    title="上传"
                    centered
                    open={open}
                    onOk={loadOk}
                    onCancel={() => setOpen(false)}
                    maskClosable={true}
                    destroyOnClose={true}
                    className={" mt-6 w-full min-w-[700px] "}>
                    <div
                        className={"w-full h-full min-h-56 grow grid grid-cols-12 grid-flow-row transition gap-3 items-start"}>
                        <div className={"h-full col-span-12"}>
                            <div className={"h-full p-1 rounded-none flex flex-col gap-2"}>

                                <Dragger accept={".json,.geojson"} maxCount={1}
                                         {...props}
                                         className={"w-7/12 h-full rounded-none flex flex-col "}>
                                    <div className={"grid grid-cols-12 w-full"}>
                                        <div className={"col-span-5"}>
                                        <span className="ant-upload-drag-icon">
                                            <MdFileUpload className={"size-14"}/></span>
                                        </div>
                                        <div className={"col-span-7 text-start"}>
                                            <p className="ant-upload-text">点击上传<br/>拖拽放入文件</p>
                                            <p className="ant-upload-hint">仅支持.json .geojson后缀文件</p>
                                        </div>
                                    </div>
                                </Dragger>

                                <div className={"h-min"}>
                                    <Radio.Group
                                        options={options}
                                        onChange={onChange4}
                                        value={loadType}
                                        optionType="button"
                                        buttonStyle="solid"/>
                                </div>

                            </div>
                        </div>
                    </div>
                </Modal>

            </div>
            <div className={"col-start-5 row-start-1 col-span-2  row-span-1 "}>
                <button
                    className={"h-full w-full text-center bg-amber-100 border-gray-800 border-[1px] rounded-sm px-3 py-1 hover:bg-amber-50 transition-colors duration-75 "}
                    onClick={() => window.geoScript.newPage()}>
                    经纬度转换
                </button>
            </div>

            <div className={"col-start-5 row-start-2 col-span-2  row-span-1 "}>
                <button
                    className={clsx("h-full w-full text-center bg-amber-100 border-gray-800 border-[1px] rounded-sm px-3 py-1 hover:bg-amber-50 transition-colors duration-75   ", {"cursor-no-drop": checkButton})}
                    disabled={checkButton} onClick={valCheck}>
                    geojson验证
                </button>
            </div>

            <div className={"col-start-7 row-start-2 col-span-2 row-span-1 "}>
                <button
                    className={clsx("h-full w-full text-center bg-amber-100 border-gray-800 border-[1px] rounded-sm px-3 py-1 hover:bg-amber-50 transition-colors duration-75   ", {"cursor-no-drop": false})}
                    disabled={false} onClick={callfs}>
                    保存文件
                </button>
            </div>
        </div>
    )
}