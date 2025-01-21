import {MdFileUpload} from "react-icons/md";
import {Upload, Radio, message, Button, Spin} from 'antd';
import {Suspense,  useEffect, useState} from "react";
import {geoformat} from "../js/geoformat.js";
import {setgeoValue} from "../js/slice.js";
import {useDispatch, useSelector} from "react-redux";
import HistoryFile from "../component/HistoryFiles.jsx";
import {useNavigate} from "react-router";

const {Dragger} = Upload;

export default function Add() {
    const [newVla, setNewVla] = useState({content: "", fn: ""});
    const [loadType, setLoadType] = useState('1');
    const [fileFlag, setFileFlag] = useState(false);
    const taVal = useSelector((state) => state.jsonReducer.taVal);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [historyFile, setHistoryFile] = useState([ '11111']);

    const options = [{label: '覆盖', value: '1',}, {label: '追加', value: '2',}, {label: '分页', value: '3',},];
    useEffect(() => {
        if (localStorage.getItem("hisfiles")) {
            let temp = Array.from(JSON.parse(localStorage.getItem("hisfiles")));
            setHistoryFile(temp);
        } else {
            setHistoryFile([]);
        }
    }, [])

    useEffect(() => {
        localStorage.setItem("hisfiles", JSON.stringify(historyFile));
    }, [historyFile]);

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
            if (info.fileList !== 1) {
                setFileFlag(false)
            }
            if (status === 'uploading') {
                console.log("文件字节大小:" + info.file.size);
                setFileFlag(false)
            }
            if (status === 'done') {
                setFileFlag(true)
                // message.success(`${info.file.name} 文件加载成功`);
            } else if (status === 'error') {
                setFileFlag(false)
                message.error(`${info.file.name} 文件加载失败.`);
            }
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },
    };

    const onChange = ({target: {value}}) => {
        setLoadType(value);
    };

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


    function loadOk() {
        if (geoformat(newVla.content)) {
            message.success("文件验证成功")
            setHistoryFile([...historyFile, newVla.fn])
            switch (loadType) {
                case '1': {
                    dispatch(setgeoValue(newVla.content))
                    navigate("/change")
                    break;
                }
                case '2': {
                    let update = JSON.stringify(merge2(newVla.content, taVal))
                    dispatch(setgeoValue(update))
                    navigate("/change")
                    break;
                }
                case "3"://分页
                    window.geoScript.newPage2(JSON.stringify(newVla))
                    break
            }
        } else {
            message.error("文件验证失败")
        }
    }

    return (
        <div className={"w-full gap-1 flex flex-row  bg-white "}>

            <div className={"w-1/2 min-h-96 p-3 content-center "}>

                <div
                    className={"w-full h-52 min-h-56 grow grid grid-cols-12 grid-flow-row transition gap-3 items-start"}>
                    <div className={"h-full col-span-12"}>
                        <div className={"h-full p-1 rounded-none flex flex-col gap-2"}>
                            <Dragger accept={".json,.geojson"} maxCount={1}
                                     {...props}
                                     className={"w-full h-full rounded-none flex flex-col "}>
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
                                    onChange={onChange}
                                    value={loadType}
                                    optionType="button"
                                    buttonStyle="solid"/>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={"w-full "}>
                    <Button type="primary" className={"float-end"} onClick={loadOk}
                            disabled={!fileFlag}>确定添加</Button>
                </div>
            </div>

            <div className={"w-1/2 h-full px-8 py-3 space-y-1"}>
                <Suspense fallback={<Spin/>}>
                    <HistoryFile historyFile={historyFile}></HistoryFile>
                </Suspense>
            </div>
        </div>
    )
}