import Editor from "@monaco-editor/react";
import {geoformat} from "../js/geoformat.js";
import {setgeoValue} from "../js/slice.js";
import {message} from "antd";
import {useDispatch, useSelector} from "react-redux";


export default function MonacoEditor() {
    const taVal = useSelector((state) => state.jsonReducer.taVal);
    const dispatch = useDispatch();
    console.log('up');

    const valChange = (newValue) => {
        try {
            let temp = JSON.parse(newValue);
            if (geoformat(temp).result) {
                dispatch(setgeoValue(newValue))
            } else {
                message.error("geojson 格式错误，不会同步")
            }
        } catch (e) {
            message.error(e.message + "-非json格式,不会同步")
        }
    }

    return (
        <Editor defaultLanguage="json"
                onChange={valChange}
                value={taVal}
                options={{
                    "contextmenu": true,
                    "fontSize": 16,
                    "overviewRulerBorder": false,
                    "wordWrap": "on",
                    "wordBasedSuggestionsOnlySameLanguage": false,
                    "formatOnPaste": true,
                    "formatOnType": true,
                    "scrollBeyondLastLine": false,
                    "smoothScrolling": true
                }}/>
    )
}