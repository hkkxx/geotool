import { Form, Input, message, Select, Table} from "antd";
import {createContext, useContext, useEffect, useRef, useState} from "react";
import {geoformat, geotable2, tablegeo2} from "../js/geoformat.js";
import {setgeoValue} from "../js/slice.js";
import {useDispatch, useSelector} from "react-redux";

export default function LocalTable() {
    const [localTable, setLcalTable] = useState({dict: [], keys: []});
    const [keyValue, setKeyValue] = useState([]);
    const [keyShow, setKeyShow] = useState([]);
    const EditableContext = createContext(null);
    const taVal = useSelector((state) => state.jsonReducer.taVal);
    const dispatch = useDispatch();

    useEffect(() => {
        try {
            let temp = JSON.parse(taVal);
            if (geoformat(temp).result) {
                let {datasource2, propKey2} = geotable2(temp)
                setLcalTable({dict: datasource2, keys: propKey2})
            } else {
                message.warning("geojson 格式错误，不会同步")
            }
        } catch (e) {
            message.warning(e.message + "-非json格式,不会同步")
        }
    }, [taVal]);


    const EditableRow = ({index, ...props}) => {
        const [form] = Form.useForm();
        return (
            <Form form={form} component={false}>
                <EditableContext.Provider value={form}>
                    <tr {...props} />
                </EditableContext.Provider>
            </Form>
        );
    };

    const EditableCell = ({
                              title,
                              editable,
                              children,
                              dataIndex,
                              record,
                              handleSave,
                              ...restProps
                          }) => {
        const [editing, setEditing] = useState(false);
        const inputRef = useRef(null);
        const form = useContext(EditableContext);

        useEffect(() => {
            if (editing) {
                inputRef.current?.focus();
            }
        }, [editing]);

        const toggleEdit = () => {
            setEditing(!editing);
            form.setFieldsValue({
                [dataIndex]: record[dataIndex],
            });
        };
        const save = async () => {
            try {
                const values = await form.validateFields();
                toggleEdit();
                handleSave({
                    ...record,
                    ...values,
                });
            } catch (errInfo) {
                console.log('Save failed:', errInfo);
            }
        };

        let childNode = children;
        if (editable) {
            childNode = editing ? (
                <Form.Item className={"m-0"} name={dataIndex}>
                    <Input ref={inputRef} onPressEnter={save} onBlur={save}/>
                </Form.Item>
            ) : (
                <div className="editable-cell-value-wrap"
                     style={{paddingInlineEnd: 24,}}
                     onClick={toggleEdit}>
                    {children}
                </div>
            );
        }
        return <td {...restProps}>{childNode}</td>;
    };

    const components = {
        body: {
            row: EditableRow,
            cell: EditableCell,
        },
    };

    const handleSave = (row) => {
        const newData = localTable.dict;
        const index = newData.findIndex((item) => row.key === item.key);
        const item = newData[index];
        // newData.splice(index, 1, row);
        newData.splice(index, 1, {
            ...item,
            ...row,
        });
        let t = tablegeo2(taVal, newData);
        dispatch(setgeoValue(t))
    };

    const selectOptions = localTable.keys.flatMap((item, index) => {
        return {value: index, label: item}
    })

    const tabColumn = localTable.keys.flatMap((i) =>
        ({
            title: i,
            dataIndex: i,
            key: i,
            fixed: i === "key" ? "right" : undefined,
            render: (value) => <p className={" p-1.5 min-w-10 max-w-[10rem] truncate "}> {value}</p>,
            editable: i !== "key",
            onCell: (record) => ({
                record,
                editable: i !== "key",
                dataIndex: i,
                title: i,
                handleSave,
            }),
            onFilter: (value, record) => {
                console.log('++++', record);
                return record.indexOf(value) === 0
            },
            filterMultiple: true,
            sorter: (a, b) => {
                if (a[i] === undefined || b[i] === undefined) {
                    return 0
                } else {
                    return a[i] > b[i]
                }
            },
            hidden: keyShow.includes(i),
        })
    )

    const tab2Column = () => {
        const columns = []
        for (let i of localTable.keys) {
            columns.push({
                title: i,
                dataIndex: i,
                key: i,
                fixed: i === "key" ? "right" : undefined,
                render: (value) => <p className={" p-1.5 min-w-10 max-w-[10rem] truncate "}> {value}</p>,
                editable: i !== "key",
                onCell: (record) => ({
                    record,
                    editable: i !== "key",
                    dataIndex: i,
                    title: i,
                    handleSave,
                }),
                onFilter: (value, record) => {
                    console.log('++++', record);
                    return record.indexOf(value) === 0
                },
                filterMultiple: true,
                sorter: (a, b) => {
                    if (a[i] === undefined || b[i] === undefined) {
                        return 0
                    } else {
                        return a[i] > b[i]
                    }
                },
                hidden: keyShow.includes(i),
            })
        }
        return columns
    }

    return (
        <div className={"gothis2  content-geometry-table"}>
            <div className={"w-full h-[2rem] my-[1px]  inline-flex gap-1"}>
                <Select mode="multiple" allowClear showSearch size={"small"}
                        className={"w-3/12"}
                        placeholder="属性隐藏"
                        optionFilterProp="label"
                        value={keyValue}
                        filterSort={(optionA, optionB) => (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())}
                        options={selectOptions}
                        onChange={(value, option) => {
                            setKeyValue(option.flatMap((item) => item.value))
                            setKeyShow(option.flatMap((item) => item.label));
                        }}/>
                {/*<Button className={"px-2 rounded-none shadow-none"} type={"primary"}*/}
                {/*        icon={<BsTextParagraph className={"size-5"} title={"对齐属性"}/>}>对齐属性</Button>*/}
            </div>
            <Table dataSource={localTable.dict} pagination={false} rowClassName={"bg-white "}
                   components={components} showSorterTooltip={false}
                   scroll={{x: "max-content", y: "100%"}} size={"small"}
                   showHeader={true} bordered={true} columns={tabColumn}></Table>
        </div>
    )
}
