import {Button, Collapse, Divider, Flex, Form,  InputNumber, Switch} from "antd";
import {Radio} from 'antd';
import "./../App.scss"
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {setConfig} from "../js/globalSlice.js";

const BtnGroup = () => (
    <Form.Item layout={"vertical"} className={"space-x-2"}>
        <Flex className={"gap-2"}>
            <Button type="default" htmlType="reset"
                    className={"rounded-none border-[1px] border-slate-500 "}>
                默认
            </Button>
            <Button type="primary" htmlType="submit" className={"rounded-none "}>
                应用
            </Button>
        </Flex>
    </Form.Item>
)

function CommonConfig() {
    const config = useSelector((state) => state.configReducer.config)
    const dispatch = useDispatch();

    const onFinish = (values) => {
        let m = {common: values}
        dispatch(setConfig({...config, ...m}))
    };

    return (
        <div>
            <Form className={"flex flex-col gap-3 my-4"} onFinish={onFinish} requiredMark={false}
                  scrollToFirstError={{
                      behavior: 'instant',
                      block: 'center',
                      focus: true,
                  }}
                  initialValues={{cacheSingle: true, socketPort: 8079}}>

                <Form.Item label="窗口同步端口" name={"socketPort"}>
                    <InputNumber min={1025} max={35536}/>
                </Form.Item>
                <Form.Item label="要素缓存" name={"cacheSingle"}>
                    <Switch checkedChildren="开启" unCheckedChildren="关闭" defaultChecked/>
                </Form.Item>
                <Form.Item>
                    <Flex className={"gap-2"}>
                        <Button type="default" htmlType="reset"
                                className={"rounded-none border-[1px] border-slate-500 "}>
                            默认
                        </Button>
                        <Button type="primary" htmlType="submit" className={"rounded-none "}>
                            应用
                        </Button>
                    </Flex>
                </Form.Item>
            </Form>
        </div>
    )
}


function Experiment() {
    const [value1, setValue1] = useState('GCJ02');
    const config = useSelector((state) => state.configReducer.config)
    const dispatch = useDispatch();

    const plainOptions1 = ['GCJ02', 'WGS84'];
    const onChange1 = ({target: {value}}) => {
        setValue1(value);
    };

    const onFinish = (values) => {
        let m = {test: values}
        dispatch(setConfig({...config, ...m}))
    };

    return (
        <Form initialValues={{coordinate: plainOptions1[0]}} onFinish={onFinish}>
            <Form.Item label={<p className={"text-base"}>坐标系</p>} name={"coordinate"}
                       rules={[
                           {
                               required: true,
                               message: 'select your coordinate!',
                               enum: plainOptions1
                           }
                       ]}>
                <Radio.Group options={plainOptions1} onChange={onChange1} value={value1} rootClassName={"w-1/2"}/>
            </Form.Item>
            <BtnGroup/>
        </Form>
    )
}

export default function AppConfiguration() {
    const config = useSelector((state) => state.configReducer.config)

    useEffect(() => {
        console.log('effect:', config);
    }, [config]);
    const items = [
        {
            key: '1',
            label: '常规设置',
            children: <CommonConfig></CommonConfig>
            // children: <div>1</div>
        },
        // {
        //     key: '2',
        //     label: <div>实验性 <p className={"inline-flex text-xs p-1 text-red-500 text-center"}>*尚不可用</p></div>,
        //     children: <Experiment></Experiment>,
        // },
    ];

    return (
        <div className={"w-full h-svh overflow-y-auto p-2"}>
            <p className={"inline m-2 antialiased tracking-wider text-xl font-medium "}>应用设置</p>
            <p className={"inline-flex text-xs p-1 text-red-500 text-center"}>*尚不可用</p>
            <Divider className={" my-4  "}/>
            <Collapse items={items} defaultActiveKey={['1', '2']} className={"go-accordion"}/>
        </div>
    )
}