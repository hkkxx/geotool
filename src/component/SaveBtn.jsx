import {Button, notification} from "antd";
import {BsSave2} from "react-icons/bs";
import {useSelector} from "react-redux";
import {Fragment} from "react";

export default function SaveBtn() {
    const taVal = useSelector((state) => state.jsonReducer.taVal);
    const [api, contextHolder] = notification.useNotification();

    const callfs = async () => {
        let res = {};
        await window.geoScript.downFile(taVal).then((result) => {
            console.log(result);
            res =result
        });
        if(res.code===0){
            api.open({
                message: '保存成功',
                description: '文件路径:' + res.msg,
                duration: 2,
                showProgress: true,
                pauseOnHover: true,
                maxCount: 3,
            });
        }

    }

    return (
        <Fragment>
            {contextHolder}
            <Button className={" px-2 rounded-none shadow-none"} type={"primary"} size={"small"}
                    icon={<BsSave2 className={"size-4 "} title={"格式"}/>}
                    onClick={callfs}
            >保存文件
            </Button>
        </Fragment>

    )
}
