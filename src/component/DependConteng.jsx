import {useState} from "react";
import {any2str, geoformat, geometryType, geotable} from "../js/geoformat";
import {Button, Flex, message, Popconfirm, Select, Splitter, Table} from "antd";
import {Editor} from "prism-react-editor";
import {useBracketMatcher} from "prism-react-editor/match-brackets"
import {useHightlightBracketPairs} from "prism-react-editor/highlight-brackets"
import {IndentGuides} from "prism-react-editor/guides"
import {useHighlightSelectionMatches, useSearchWidget} from "prism-react-editor/search"
import {useHighlightMatchingTags, useTagMatcher} from "prism-react-editor/match-tags"
import {useCursorPosition} from "prism-react-editor/cursor"
import {useDefaultCommands, useEditHistory} from "prism-react-editor/commands"
import {useCopyButton} from "prism-react-editor/copy-button"
// Adds comment toggling and auto-indenting for JSX
import "prism-react-editor/languages/json"
import "prism-react-editor/layout.css"
import "prism-react-editor/themes/github-light.css"
import "prism-react-editor/prism/languages/json"
import "prism-react-editor/search.css"
import "prism-react-editor/copy-button.css"
import "prism-react-editor/code-folding.css"
import "prism-react-editor/invisibles.css"
import "prism-react-editor/autocomplete.css"
import "prism-react-editor/autocomplete-icons.css"
import {io} from "socket.io-client";
import {ws} from "../js/localStorage.js";
import {useDispatch, useSelector} from "react-redux";
import {updateMianValue} from "../js/slice.js";

// eslint-disable-next-line react/prop-types
function MyExtensions({editor}) {
    useBracketMatcher(editor)
    useHightlightBracketPairs(editor)
    useTagMatcher(editor)
    useHighlightMatchingTags(editor)
    useSearchWidget(editor)
    useHighlightSelectionMatches(editor)
    useCopyButton(editor)
    useCursorPosition(editor)
    useDefaultCommands(editor)
    useEditHistory(editor, 10)
    return <IndentGuides editor={editor}/>
}

const client = io(ws.url, {
    path: ws.path
});
client.on("connection", (socket) => {
    console.log(socket.id); // x8WIv7-mJelg7on_ALbx
    socket.onmessage("accept", async (arg) => {
            console.log("___beidong___accept__" + arg);
            // dispatch(updateMianValue(arg))
        }
    );
});

export default function DependConteng() {
    const [pageTable, setPageTable] = useState([]);
    const [keyList, setKeyList] = useState([]);
    const [keyShow, setKeyShow] = useState([]);
    const [delinfo, setDelinfo] = useState({feature: null, skey: -1, info: ""})

    const pageback = useSelector((state) => state.jsonReducer.pageback);
    const dispatch = useDispatch();

    const editorChange = (value) => {
        try {
            let p = JSON.parse(value);
            if (geoformat(p)) {
                let {datasource, propKey} = geotable(p);
                setKeyList(propKey);
                setPageTable(datasource)

                dispatch(updateMianValue(value))
            } else {
                message.error("geojson格式不正确")
            }
        } catch (e) {
            message.error(e.message)
        }
    }

    function copyClick(key, m) {
        setDelinfo({skey: key, info: m})
    }

    async function copyOk(i) {
        let response = await client.timeout(1200).emitWithAck("call", "call")
            .catch(err => message.error(err))
        console.log("response:" + response);
        try {
            let contentback = JSON.parse(pageback.content);
            if (geoformat(response).result && geoformat(contentback).result) {
                let temp = null;
                for (let j of pageTable) {
                    for (let k of j.note) {
                        if (k.skey === i) {
                            temp = (contentback["features"])[i]
                            break
                        }
                    }
                    if (temp != null)
                        break;
                }
                response["features"].push((temp));
                client.emit("up", response);
            } else {
                message.error("主文本格式错误,无法复制")
            }
        } catch (e) {
            message.error(e)
        }
    }

    const columns = [
        {
            title: 'geometry',
            dataIndex: 'metry',
            key: 'metry',
            width: 100,
            filters: geometryType.flatMap((item) => {
                return {text: item, value: item}
            }),
            onFilter: (value, record) => record.metry.indexOf(value) === 0,
            filterMultiple: true,
            render: (value) =>
                <div className={"h-full px-1"}>
                    <p>{value}</p>
                </div>
        }, {
            title: '标记',
            dataIndex: 'note',
            key: 'note',
            render: (value) =>
                <div className={"px-3 flex-col h-full "}>
                    <p className={"bg-cyan-100  px-1.5 py-1 w-fit grow"}> count：{value.length}</p>
                </div>
        }
    ];

    const expandedTable = (record) => {
        let data = record.note.flatMap((item1, j) => {
                let dict = {"key": j, "operator": item1.skey};
                keyShow.map((item2) => dict[item2] = any2str(((item1.attr))[item2]))
                return dict
            }
        )

        let cols = keyShow.flatMap((item,) => {
            return {title: item, dataIndex: item, key: item}
        })
        if (keyShow.length > 0) {
            cols.push({
                title: "操作", dataIndex: "operator", key: "operator", width: 100, fixed: 'right',
                render: (value, record2) =>
                    <div className={"px-2 py-[1px]"}>
                        <Popconfirm
                            placement="topRight"
                            title={"确认复制要素"}
                            description={`详细信息:${delinfo.info}`}
                            onConfirm={() => copyOk(delinfo.skey)}
                            okText="Yes" cancelText="No">
                            <Button className={"text-white rounded px-1 bg-blue-500 hover:text-black"}
                                    onClick={() => copyClick(value, any2str(record2))}>复制到</Button>
                        </Popconfirm>
                    </div>
            })
        }
        if (keyShow.length < 1) {
            data = null
        }
        return <Table bordered={false} pagination={false} showHeader={true} size="small" columns={cols}
                      dataSource={data}/>
    }

    return (
        <div className={"p-[1px] min-h-56"}>
            <Splitter className={" shadow-sm border-[1px] shadow-gray-200"}>
                <Splitter.Panel defaultSize="30%" min="20%" max="70%">
                    <Flex justify="center" align="center" style={{height: '100%',}}>
                        <div className={" focus:border-0 self-stretch w-full overflow-auto  m-1 text-[1rem] "}>
                            <Editor language="json"
                                    value={pageback.content}
                                    wordWrap={true}
                                    insertSpaces={true}
                                    style={{"width": "100%"}}
                                    readOnly={false}
                                    onUpdate={editorChange}>
                                {editor => <MyExtensions editor={editor}/>}
                            </Editor>

                        </div>
                    </Flex>
                </Splitter.Panel>
                <Splitter.Panel max="70%">
                    <Flex justify="center"
                          align="start"
                          style={{height: '100%',}}>
                        <div className={"w-full  min-h-72  "}>
                            <div className={" sticky top-0  z-10"}>
                                <Select mode="multiple" allowClear showSearch
                                        className={"w-1/2 max-w-full my-1  "}
                                        placeholder="属性搜索"
                                        optionFilterProp="label"
                                        maxCount={5}
                                        filterSort={(optionA, optionB) => (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                                        }
                                        options={
                                            keyList.flatMap((item, index) => {
                                                return {value: index, label: item}
                                            })}
                                        onChange={(value, option) => {
                                            setKeyShow(option.flatMap((item) => item.label));
                                        }}/>
                            </div>
                            <Table dataSource={pageTable} pagination={false} columns={columns}
                                   size={"small"}
                                   expandable={{
                                       expandedRowRender: expandedTable,
                                       defaultExpandedRowKeys: ['0'], defaultExpandAllRows: true
                                   }}>
                            </Table>
                        </div>

                    </Flex>
                </Splitter.Panel>
            </Splitter>

        </div>
    )
}