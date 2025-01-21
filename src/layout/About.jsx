
export default function About() {

    return (

        <div className={"w-fit flex-col flex  m-10 "}>
            <div>node:{window.versions!==undefined?window.versions.node(): '*.*'}</div>
            <div>chrome:{window.versions!==undefined?window.versions.chrome(): '*.*'}</div>
            <div>electron:{window.versions!==undefined?window.versions.electron(): '*.*'}</div>
        </div>
    )
}