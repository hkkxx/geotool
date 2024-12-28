import "./../App.css"
import {Flex, message, Modal, Select, Splitter, Table} from "antd";
import {Editor} from "prism-react-editor"
import {useBracketMatcher} from "prism-react-editor/match-brackets"
import {useHightlightBracketPairs} from "prism-react-editor/highlight-brackets"
import {IndentGuides} from "prism-react-editor/guides"
import {useHighlightSelectionMatches, useSearchWidget} from "prism-react-editor/search"
import {useHighlightMatchingTags, useTagMatcher} from "prism-react-editor/match-tags"
import {useCursorPosition} from "prism-react-editor/cursor"
import {useDefaultCommands, useEditHistory} from "prism-react-editor/commands"
import {useCopyButton} from "prism-react-editor/copy-button"
// Adding the JSX grammar
import "prism-react-editor/prism/languages/json"
// Adds comment toggling and auto-indenting for JSX
import "prism-react-editor/languages/json"
import "prism-react-editor/layout.css"
import "prism-react-editor/themes/github-light.css"
// Required by the basic setup
import "prism-react-editor/search.css"
import "prism-react-editor/copy-button.css"
import "prism-react-editor/code-folding.css"
import "prism-react-editor/invisibles.css"
import "prism-react-editor/autocomplete.css"
import "prism-react-editor/autocomplete-icons.css"
import {any2str, geoformat, geometryType, geotable} from "../js/geoformat";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {setgeoValue} from "../js/slice.js";
import {io} from "socket.io-client";
import {ws} from "../js/localStorage.js";

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

const socket1 = io(ws.url, {
    path: ws.path
});

export default function Content() {
    const [localTable, setLocalTable] = useState({dict: [], keys: []});
    const [keyShow, setKeyShow] = useState([]);
    const [delinfo, setDelinfo] = useState({skey: -1, info: ""});
    const [isDel2Open, setIsDel2Open] = useState(false);

    const taVal = useSelector((state) => state.jsonReducer.taVal);
    const dispatch = useDispatch();

    useEffect(() => {
        editorChange(taVal);
    }, [taVal])


    useEffect(() => {
        socket1.on('connect_error', (socket) => {
            console.log("main bar error:" + socket);

        });
        socket1.on("error", (error) => {
            console.log("main socket error:" + error)
            socket1.connect()
        });
        socket1.on("disconnect", (error) => {
            console.log("main socket disconnect:" + error)
            socket1.connect()
        });
    }, []);


    const editorChange = (value) => {
        try {
            let {datasource, propKey} = geotable(JSON.parse(value));
            setLocalTable({dict: datasource, keys: propKey})
            console.log("main update");
            dispatch(setgeoValue(value))
        } catch (e) {
            message.error(e.message)
        }
    }

    function delClick(key, m) {
        setDelinfo({skey: key, info: m})
        setIsDel2Open(true)
    }

// 确认删除
    function delOk(i) {
        let temp = JSON.parse(taVal)
        if (geoformat(temp)) {
            temp["features"] = temp["features"].filter((item, index) => index !== i)
            dispatch(setgeoValue(temp))
        } else {
            message.error("当前文本格式错误")
        }
        setIsDel2Open(false)
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
                <div className={"h-full px-2 m-1  space-y-1 "}>
                    <p>{value}</p>
                </div>
        },
        {
            title: '标记',
            dataIndex: 'note',
            key: 'note',
            render: (value) =>
                <div className={"px-3 m-1 flex-col space-y-1 h-full "}>
                    <p className={"bg-cyan-100  p-1.5 w-fit grow"}> count：{value.length}</p>
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
                    <div className={"px-2"}>
                        <button className={" text-white rounded px-1.5 bg-cyan-500 hover:text-black "}
                                onClick={() => delClick(value, any2str(record2))
                                }>
                            DEL{value}
                        </button>
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
        <div className={"p-[1px] min-h-56"} id={"core"}>
            <Splitter className={"content shadow-sm border-[1px] shadow-gray-200"}>
                <Splitter.Panel defaultSize="40%" min="30%" max="70%">
                    <Flex justify="center" align="center" style={{height: '100%',}}>
                        <div className={" focus:border-0 self-stretch w-full overflow-auto  m-1 text-[1rem] "}>
                            <Editor language="json"
                                    value={taVal}
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
                                            localTable.keys.flatMap((item, index) => {
                                                return {value: index, label: item}
                                            })}
                                        onChange={(value, option) => {
                                            setKeyShow(option.flatMap((item) => item.label));
                                        }}/>
                            </div>
                            <Table dataSource={localTable.dict} pagination={false} columns={columns}
                                   size={"middle"}
                                   expandable={{
                                       expandedRowRender: expandedTable,
                                       defaultExpandedRowKeys: ['0'], defaultExpandAllRows: true
                                   }}>
                            </Table>
                            <Modal mask={false}
                                   destroyOnClose={true}
                                   title={"确认删除要素"} open={isDel2Open}
                                   onOk={() => delOk(delinfo.skey)}
                                   onCancel={() => setIsDel2Open(false)}>
                                <p>{`详细信息:${delinfo.info}`}</p>
                            </Modal>
                        </div>
                    </Flex>
                </Splitter.Panel>
            </Splitter>

        </div>
    )
}
