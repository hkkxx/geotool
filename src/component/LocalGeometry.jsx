import { useEffect, useState} from "react";
import {Button, message, Popconfirm, Select, Table} from "antd";
import {any2str, geoformat, geometryType, geotable} from "../js/geoformat.js";
import {useDispatch, useSelector} from "react-redux";
import {setgeoValue} from "../js/slice.js";

export default function LocalGeometry() {
    const [localFeactures, setLocalFeatures] = useState({dict: [], keys: []});
    const [keyValue, setKeyValue] = useState([]);
    const [keyShow, setKeyShow] = useState([]);
    const [delinfo, setDelinfo] = useState({skey: -1, info: ""});
    const taVal = useSelector((state) => state.jsonReducer.taVal);
    const dispatch = useDispatch();

    useEffect(() => {
        try {
            let temp = JSON.parse(taVal);
            if (geoformat(temp).result) {
                let {datasource, propKey} = geotable(temp);
                setLocalFeatures({dict: datasource, keys: propKey})
            } else {
                message.warning("geojson 格式错误，不会同步")
            }
        } catch (e) {
            message.warning(e.message + "-非json格式,不会同步")
        }
    }, [taVal]);


    const columns = [{
        title: 'geometry',
        dataIndex: 'metry',
        key: 'metry',
        width: 200,
        filters: geometryType.flatMap((item) => {
            return {text: item, value: item}
        }),
        onFilter: (value, record) => record.metry.indexOf(value) === 0,
        filterMultiple: true,
        render: (value) => <div className={"h-full px-2  "}>{value}</div>,
    }, {
        title: '标记',
        dataIndex: 'note',
        key: 'note',
        render: (value) => <div className={" px-3  space-y-1 "}>
            <p className={"bg-cyan-100  p-1.5 w-fit grow"}> count：{value.length}</p>
        </div>
    }];

    // 确认删除
    function delOk() {
        let temp = JSON.parse(taVal)
        if (geoformat(temp)) {
            temp["features"] = temp["features"].filter((item, index) => index !== delinfo.skey)
            dispatch(setgeoValue(JSON.stringify(temp)))
        } else {
            message.error("当前文本格式错误")
        }
    }

    function delClick(key, m) {
        setDelinfo({skey: key, info: m})
    }

    function copyClick(key, m) {
        setDelinfo({skey: key, info: m})
    }

    // 确认重复
    function copyOk() {
        try {
            let temp = JSON.parse(taVal)
            if (geoformat(temp).result) {
                temp["features"].push((temp["features"])[delinfo.skey]);
                temp["features"].push((temp["features"])[delinfo.skey]);
                temp["features"].push((temp["features"])[delinfo.skey]);
                temp["features"].push((temp["features"])[delinfo.skey]);
                temp["features"].push((temp["features"])[delinfo.skey]);
                temp["features"].push((temp["features"])[delinfo.skey]);
                dispatch(setgeoValue(JSON.stringify(temp)))
            } else {
                message.error("当前文本格式错误")
            }
        } catch (e) {
            message.error(e)
        }
    }

    const expandedColumns = (record) => {
        let cols = keyShow.flatMap((item,) => {
            let filterFlag = true;
            let filtersList = new Set();
            for (let k of record.note) {
                if (Array.isArray((k.attr)[item])) {
                    filterFlag = false;
                    continue;
                }
                if ((k.attr)[item]) {
                    filtersList.add({text: (k.attr)[item].toString(), value: (k.attr)[item].toString()})
                }
            }
            return {
                title: item,
                dataIndex: item,
                key: item,
                filters: filterFlag ? Array.from(filtersList) : undefined,
                onFilter: (value, record) => record[item].indexOf(value) === 0,
                render: (value, record2) => <p className={"truncate  min-w-16 max-w-96 mr-1 "}>{value}</p>
            }
        })
        if (keyShow.length > 0) {
            cols.push({
                title: "操作",
                dataIndex: "operator",
                key: "operator",
                width: 150,
                fixed: 'right',
                render: (value, record2) =>
                    <div>
                        <Popconfirm
                            placement="topRight"
                            title={"确认复制要素"}
                            fresh={true}
                            description={<div
                                className={"max-h-20 max-w-md p-0 m-0 overflow-y-auto text-wrap "}>详细信息:{delinfo.info}</div>}
                            onConfirm={delOk}
                            okText="Yes" cancelText="No">
                            <Button className={" text-white rounded px-1.5 bg-cyan-500 hover:text-black "}
                                    onClick={() => delClick(value, any2str(record2))}>
                                DEL<p className={"text-black"}>{value}</p></Button>
                        </Popconfirm>
                        <Popconfirm
                            placement="topRight"
                            title={"确认复制要素"}
                            fresh={true}
                            description={<div
                                className={"max-h-20 max-w-md p-0 m-0 overflow-y-auto text-wrap "}>详细信息:{delinfo.info}</div>}
                            onConfirm={copyOk}
                            okText="Yes" cancelText="No">
                            <Button className={" text-white rounded px-1.5 bg-blue-500 hover:text-black "}
                                    onClick={() => copyClick(value, any2str(record2))}>
                                重复</Button>
                        </Popconfirm>
                    </div>
            })
        }
        return cols;
    }

    const expandedData = (record) => {
        if (keyShow.length < 1) {
            return null
        }
        return record.note.flatMap((item1, j) => {
            let dict = {"key": j, "operator": item1.skey};
            keyShow.map((item2) => dict[item2] = any2str(((item1.attr))[item2]))
            return dict
        });
    }

    const expandTable = (record) => {
        const cols = expandedColumns(record)
        const data = expandedData(record)
        return <Table bordered={false} pagination={false} showHeader={true} size="small"
                      scroll={{x: "max-content", y: 600, scrollToFirstRowOnChange: true}}
                      columns={cols} dataSource={data}/>
    }

    const selectOptions = localFeactures.keys.flatMap((item, index) => {
        return {value: index, label: item}
    })


    return (
        <div className={"w-full  h-[80dvh]"}>
            <div className={" w-full h-[2rem]  space-x-1 my-1 "}>
                <Select mode="multiple" allowClear showSearch
                        className={"min-w-56 max-w-full "}
                        placeholder="属性搜索"
                        optionFilterProp="label"
                        maxCount={7}
                        value={keyValue}
                        filterSort={(optionA, optionB) => (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())}
                        options={selectOptions}
                        onChange={(value, option) => {
                            setKeyValue(option.flatMap((item) => item.value))
                            setKeyShow(option.flatMap((item) => item.label));
                        }}/>
            </div>
            <div className={" gothis  content-geometry-feacture"}>
                <Table dataSource={localFeactures.dict} pagination={false} columns={columns} size={"small"}
                       scroll={{y: "100%"}}
                       expandable={{
                           expandedRowRender: expandTable,
                           defaultExpandedRowKeys: ['0'],
                           defaultExpandAllRows: true
                       }}>
                </Table>
            </div>
        </div>
    )
}
