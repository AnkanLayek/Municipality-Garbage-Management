import { useEffect, useState } from "react"
import dotPointIcon from "../assets/dotPointMarker.png"
import MapComponent from "./MapComponent";
import RoutingComponent from "./RoutingComponent";
import { Marker } from "leaflet";
const backendURL = import.meta.env.VITE_BACKEND_URL

const AllPathsComponent = ({ currentPathId, onPathClick, refreshPaths, markerPoints=[] }) => {
    const [paths, setPaths] = useState([]);

    // custom icon for dot point
    const dotPointMarker = new L.icon({
        iconUrl: dotPointIcon,
        iconSize: [10, 10],
        iconAnchor: [5, 5],
        popupAnchor: [0, -45]
    });

    const getAllPaths = async () => {
        const response = await fetch(`${backendURL}/path/getAllPaths`, {
            method: 'GET'
        });
        const data = await response.json();
        if(response.ok){
            setPaths(data.paths)
        }
    }

    useEffect(() => {
        getAllPaths();
    },[refreshPaths, markerPoints])

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
                                {/* {(markerPoints.length > 0)
                                    ? <>
                                        {markerPoints.map((eachPoint) => {
                                            <Marker icon={dotPointMarker} position={[eachPoint.lat, eachPoint.lng]}></Marker>
                                        })}
                                    </>
                                    : <></>
                                } */}
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