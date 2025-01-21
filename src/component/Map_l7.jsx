import {GaodeMap} from "@antv/l7-maps";
import {LarkMap,  MouseLocationControl,  ScaleControl, ZoomControl} from '@antv/larkmap';
import AMapLoader from "@amap/amap-jsapi-loader";
import {message} from "antd";
import { useRef} from "react";

const key = ""
const getMapInstance =  () => {
    return AMapLoader.load({
        "key": key,
        // "version": "2.0",
        "plugins": [],
    }).then((AMap) => {
        console.log("14");
        return new GaodeMap({
            mapInstance: new AMap.Map('locamap', {
                viewMode: '2D', // 2D 模式
                zoom: 5,  //初始化地图层级
                center: [116.397428, 39.90923],
                mapStyle: "amap://styles/fresh"
            })
        });
    }).catch((e) => {
        message.error("地图加载失败")
        console.error(e); //加载错误提示
    });
};

export default function Map_l7() {
    const mapRef = useRef(null);

    const config = {
        mapType: 'Gaode',
        mapOptions: {
            style: 'light',
            center: [120.210792, 30.246026],
        },
        // style:{width :'500px' ,height:"500px"},
        logoVisible: false,
    };

    return (
        <LarkMap id="locamap" className={"w-full h-full"}
                 ref={mapRef} {...config}
                 map={getMapInstance} mapType="Gaode" preserveDrawingBuffer={true}>

            <MouseLocationControl className={"bg-black "} />
            <ZoomControl/>
            <ScaleControl metric={true} position={"bottomleft"}/>
        </LarkMap>
    )
}
