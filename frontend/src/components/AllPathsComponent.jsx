import { useEffect, useState } from "react"
import MapComponent from "./MapComponent";
import RoutingComponent from "./RoutingComponent";

const AllPathsComponent = ({ currentPathId, onPathClick, refreshPaths }) => {
    const [paths, setPaths] = useState([])

    const getAllPaths = async () => {
        const response = await fetch("http://localhost:3000/path/getAllPaths", {
            method: 'GET'
        });
        const data = await response.json();
        if(response.ok){
            setPaths(data.paths)
            
        }
    }

    useEffect(() => {
        getAllPaths();
    },[refreshPaths])

    return (
        <>
            <div className="w-full px-5 flex flex-col gap-3">
                {paths.map((eachPath, idx) => (
                    <div key={idx}
                        className={`w-full h-40  ${(currentPathId == eachPath.pathId) ? 'border-4' : 'border-2' } border-green-700 rounded-lg relative`}
                        style={{boxShadow: "10px 10px 20px 4px rgb(0 0 0 / 0.1), -10px -10px 20px 4px rgb(0 0 0 / 0.1)"}}
                        onClick={() => {onPathClick(eachPath.pathId)}}
                    >
                        <div className="h-full w-full rounded-lg overflow-hidden">
                            <MapComponent zoom={11} allowWheelZoom={false} allowDblClickZoom={false} allowDragging={false}>
                                <RoutingComponent checkPoints={eachPath.checkPoints} weight={3}/>
                            </MapComponent>
                        </div>
                        <div className="absolute bottom-0 z-[1]">Path ID : {eachPath.pathId}</div>
                        {/* <div>Checkpoints No. : {eachPath.checkPoints.length}</div>
                        <div>Dustbins No. : {eachPath.dustbins.length}</div> */}
                    </div>
                ))}
            </div>
        </>
    )
}

export default AllPathsComponent