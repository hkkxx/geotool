import {Button, InputNumber, message, Space} from "antd";
import {useState} from "react";
import {clsx} from "clsx";
import "./../App.scss"

export default function JWD() {
    const [order, setOrder] = useState(true);
    const [value1, setValue1] = useState(0);
    const [value2, setValue2] = useState({v1: 0, v2: 0, v3: 0});

    function convert() {
        const cal = (r) => r - (r % 1);
        if (order) {
            let r = Number(value1)
            if (isNaN(r)) {
                message.error("请输入数字")
            } else {
                let du = cal(r)
                let fen = cal(r % 1 * 60)
                let m = (r - du - fen / 60) * 60 % 1

                setValue2({v1: du, v2: fen, v3: m})
            }
        } else {
            let r1 = Number(value2.v1)
            let r2 = Number(value2.v2)
            let r3 = Number(value2.v3)
            if (isNaN(r1) || isNaN(r2) || isNaN(r3)) {
                message.error("请输入数字")
            } else {
                let r = r1 + r2 / 60 + r3 / 60 / 60
                setValue1(r)
            }
        }
    }

    return (

            <div className={" grid grid-rows-3 justify-items-center gap-1 m-auto "}>
                <div className={clsx("min-w-64 min-h-8 row-span-1 transition duration-700", {
                    "row-start-3": order,
                    "row-start-1": !order
                })}>
                    <Space.Compact size="middle" className={""}>
                        <InputNumber min={-200} max={200} controls={false}
                                     addonBefore="度"
                                     value={value2.v1}
                                     onChange={(value) => setValue2({...value2, v1: (value)})}/>
                        <InputNumber min={-200} max={200} controls={false}
                                     addonBefore="分"
                                     value={value2.v2}
                                     onChange={(value) => setValue2({...value2, v2: value})}/>
                        <InputNumber min={-200} max={200} controls={false}
                                     addonBefore="秒"
                                     value={value2.v3}
                                     onChange={(value) => setValue2({...value2, v3: value})}/>
                    </Space.Compact>
                </div>

                <div className={" space-x-2  text-center row-span-1  row-start-2"}>
                <span><Button type="primary" size={"middle"}
                              onClick={() => {
                                  console.log(order)
                                  setOrder(!order)
                              }}
                >交换位置</Button></span>
                    <span><Button size={"middle"} onClick={convert}>转换</Button></span>
                </div>

                <div className={clsx("min-w-48 row-span-1  ", {
                    "row-start-1 ": order,
                    "row-start-3": !order
                })}>
                    <InputNumber min={-200} max={200} value={value1} controls={false}
                                 onChange={setValue1}
                                 className={"w-full"}/>
                </div>
            </div>

    )
}

