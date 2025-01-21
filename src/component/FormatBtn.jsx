import {Button} from "antd";
import {BsTextParagraph} from "react-icons/bs";
import {useEffect} from "react";
import {useMonaco} from "@monaco-editor/react";

export default function FormatBtn() {
    const monaco = useMonaco();
    useEffect(() => {
        monaco?.languages.typescript.javascriptDefaults.setEagerModelSync(true);
        if (monaco) {
            console.log('here is the monaco instance:', monaco);
        }
    }, [monaco]);


    return (
        <Button className={"px-2 rounded-none shadow-none"} type={"primary"} size={"small"}
                icon={<BsTextParagraph className={"size-5"} title={"格式"}/>}
                onClick={() => monaco.editor.getEditors()[0].getAction('editor.action.formatDocument').run()}>
            格式化文档
        </Button>
    )
}