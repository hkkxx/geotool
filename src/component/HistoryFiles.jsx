import {IoIosLink} from "react-icons/io";
import {Fragment} from "react";


export default function HistoryFile({historyFile}) {

    function laodFile(e) {
        console.log(e);
    }

    return (
        <Fragment>
            <h1 className={"text-lg font-semibold underline underline-offset-4 py-1 "}>历史记录:</h1>
            {
                historyFile.length > 0 ? historyFile.map((item, index) =>

                    <div key={index}
                         className={"w-full px-2  bg-blue-100 hover:bg-blue-200 flex flex-row rounded-sm items-center transition duration-75 select-none "}>
                        <button className={"grow text-start"} onClick={() => laodFile(item)}>
                            <p>{item}</p>
                        </button>
                        <IoIosLink className={"size-4"}/>
                    </div>
                ) : undefined
            }
        </Fragment>
    )

}