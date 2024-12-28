import "./../App.css"
import {Fragment, lazy, Suspense, useEffect} from "react";
import {Alert, Spin} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {updateMianfn, updateMianValue} from "../js/slice";

export default function NewPage() {

    const pageback = useSelector((state) => state.jsonReducer.pageback);
    const dispatch = useDispatch();

    const DependConteng = lazy(() => import("../component/DependConteng.jsx"));

    const func = async () => {
        await window.geoScript.postData().then((result) => {
            dispatch(updateMianValue(JSON.parse(result)["content"]))
            dispatch(updateMianfn(JSON.parse(result)["fn"]))
            return
        }).finally(() => console.log("end"))
    }

    useEffect(() => {
        func();
    }, [])

    useEffect(() => {
        document.body.style.height = "100vh";
        document.body.style.width = "100%"
    }, [])


    return (
        <Fragment>
            <div className={"w-full h-8 grid grid-cols-12 grid-rows-1 gap-1 p-0.5"}>
                <Alert message={`打开文件:${pageback.fn}`} type="success" className={"w-full col-span-4"}/>
            </div>
            <div className={"w-full grid content-page "}>
                <Suspense fallback={<Spin/>}>
                    <DependConteng/>
                </Suspense>
            </div>
        </Fragment>
    )
}

