import {Button, message} from "antd";
import {geoformat} from "../js/geoformat.js";
import {MdPlaylistAddCheck} from "react-icons/md";

export default function VerificationBtn({data}) {

    const verificate = () => {
        try {
            const {msg} = geoformat(JSON.parse(data))
            message.info(msg);
        } catch (e) {
            message.warning(e,"格式错误");
        }
    }

    return (
        <Button className={"px-2 rounded-none shadow-none"} type={"primary"} size={"small"}
                icon={<MdPlaylistAddCheck className={"size-6 "} title={"格式"}/>}
                onClick={verificate}>
            格式校验
        </Button>
    )

}