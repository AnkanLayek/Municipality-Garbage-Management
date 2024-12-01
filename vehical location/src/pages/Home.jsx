import { useEffect, useState } from "react";
import MapComponent from "../components/MapComponent";
import { Marker, Popup, useMapEvent } from "react-leaflet";
import L from 'leaflet'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPencil, faTrash } from "@fortawesome/free-solid-svg-icons"
// import tempDustbinIcon from "../assets/tempDustbinMarker.png"
import dustbinIcon from "../assets/dustbinMarker.png"
import dustbinIcon1 from '../assets/dustbin1.png'
import carIcon from "../assets/carMarker.png"
import { io } from "socket.io-client";
import { socket } from "../App";
const backendURL = import.meta.env.VITE_BACKEND_URL

function Home() {
    const [pathId, setPathId] = useState();
    const [driver, setDriver] = useState();
    const [vehical, setVehical] = useState();
    const [dustbins, setDustbins] = useState([]);
    const [assignment, setAssignment] = useState();

    const [isBellowAspect, setIsBellowAspect] = useState();
    const [mapCenter, setMapCenter] = useState({ lat: 23.526208, lng: 86.923270});
    const [carPosition, setCarPosition] = useState({lat: undefined, lng: undefined})
    const [isStarted, setIsStarted] = useState(false);
    const [watchId, setWatchId] = useState();

    // custom icon for dustbin
    const dustbinMarker = new L.icon({
        iconUrl: dustbinIcon,
        iconSize: [50, 50],
        iconAnchor: [25, 45],
        popupAnchor: [0, -45]
    });

    // custom icon for car
    const carMarker = new L.icon({
        iconUrl: carIcon,
        iconSize: [35, 35],
        iconAnchor: [25, 45],
        popupAnchor: [0, -45]
    });

    const startJrny = () => {
        setIsStarted(true);
        const id = navigator.geolocation.watchPosition((position)=>{
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            socket.emit("send location", {location: position.coords, pathId: pathId});
            setMapCenter({lat: lat, lng: lng});
            setCarPosition({lat: lat, lng: lng})
        });

        setWatchId(id);

        return () => navigator.geolocation.clearWatch(id);
    }

    const endJrny = () => {
        setIsStarted(false);
        navigator.geolocation.clearWatch(watchId);
        setCarPosition({lat: undefined, lng: undefined});
        socket.emit("stop location", {pathId: pathId})
    }

    const getAssignDetails = async () => {
        const response = await fetch(
            `${backendURL}/assign/getAllAssigns/PATH001?populatePath=true&populateDustbin=true`,
            {
                method: 'GET',
            }
        )

        const data = await response.json();
        if(response.ok){
            setAssignment(data.assignment);
            setPathId(data.assignment.pathId);
            setDriver(data.assignment.driverUsername);
            setVehical(data.assignment.vehicalReg);
            setDustbins(data.assignment.pathId.dustbins);
        }
    }

    useEffect(() => {
        const checkAspectRatio = () => {
            setIsBellowAspect( window.innerHeight / window.innerWidth < 1 )
        }

        checkAspectRatio();
        window.addEventListener('resize', checkAspectRatio);

        return () => window.removeEventListener('resize', checkAspectRatio);
    }, []);

    useEffect(() => {
        getAssignDetails();
    },[]);

    return (
        <>
            { (isBellowAspect != undefined) ?
                <div className={`flex ${ isBellowAspect ? 'flex-row' : 'flex-col' }`}>
                    <div className={`map ${ isBellowAspect ? 'w-[58vw] h-screen' : 'h-[58vh] w-full'}`}>
                        <MapComponent center={mapCenter}>
                            {/* Marker for all dustbins */}
                            {dustbins.map((eachDustbin, idx) => (
                                <Marker key={idx} position={[eachDustbin.coords.lat, eachDustbin.coords.lng]} icon={dustbinMarker}>
                                    <Popup>
                                        {/* <div className="flex gap-2 justify-end mb-1">
                                            <button><FontAwesomeIcon icon={faPencil} /></button>
                                            <button dustbinid={eachDustbin.dustbinId} pathid="PB101" onClick={deleteDustbin}><FontAwesomeIcon icon={faTrash} /></button>
                                        </div> */}
                                        <pre>ID  : {eachDustbin.dustbinId}</pre>
                                        <pre>No. : {eachDustbin.dustbinNo}</pre>
                                    </Popup>
                                </Marker>
                            ))}

                            {/* Marker for car */}
                            {carPosition.lat != undefined ?
                                <Marker  position={[carPosition.lat, carPosition.lng]} icon={carMarker}>
                                    <Popup>
                                        
                                    </Popup>
                                </Marker>
                                : <></>
                            }
                            

                            {/* Temporary Marker for new dustbin */}
                            {/* {addDustbin.lat && addDustbin.lng && (
                                <Marker icon={tempAddDustbinMarker} position={[addDustbin.lat, addDustbin.lng]}>
                                    <Popup>Add Dustbin Here ?</Popup>
                                </Marker>
                            )} */}
                            
                            {/* <EventListenerComponent/> */}
                        </MapComponent>
                    </div>
                    
                    <div className={`controls p-10 z-[400] ${ isBellowAspect ? 'w-[42vw] h-screen' : 'h-[43vh] w-full'}`} style={{ boxShadow: "-10px 0px 20px -5px rgba(0, 0, 0, 0.3)" }}>
                        {/* <div className="inline-block">
                            { addDustbin.allow
                                ? addDustbin.lat
                                    ? <div>
                                        <div>Add dustbin at {addDustbin.lat}, {addDustbin.lng} ?</div>
                                        <form onSubmit={addToDustbins} className="my-10">
                                            <input
                                                className="border-black border-2 rounded-md mr-1 mb-1 px-2"
                                                type="text" placeholder="Dustbin ID" name="dustbinId" value={addDustbinFormData.dustbinId}
                                                onChange={handleInputChange} />
                                            <input
                                                className="border-black border-2 rounded-md mr-1 mb-1 px-2"
                                                type="number" placeholder="Dustbin No" name="dustbinNo" value={addDustbinFormData.dustbinNo}
                                                onChange={handleInputChange} />
                                            <input
                                                className="border-black border-2 rounded-md mr-1 mb-1 px-2"
                                                type="text" placeholder="path ID" name="pathId" value={addDustbinFormData.pathId}
                                                onChange={handleInputChange} />
                                            <div className="flex gap-2 mt-10">
                                                <button type="submit" className="w-32 text-center text-white text-lg px-5 py-2 bg-green-700 rounded-full cursor-pointer">Add</button>
                                                <div onClick={ () => setAddDustbin({allow: true}) } className="w-32 text-center text-white text-lg px-5 py-2 bg-red-700 rounded-full cursor-pointer">Cancel</div>
                                            </div>
                                        </form>
                                    </div> 
                                    
                                    : <div>
                                        <div>Drop pin to add...</div>
                                        <div onClick={ () => setAddDustbin({allow: false}) } className="w-32 text-center text-white text-lg px-5 py-2 bg-red-700 rounded-full cursor-pointer">Cancel</div>
                                    </div>
                                : <div className="px-5 py-3 border-black border-2 rounded-full cursor-pointer" onClick={allowAddDustbin}>Add Dustbin</div>
                            }
                        </div> */}
                        {isStarted
                            ?<div className="w-52 text-center text-white text-xl px-5 py-3 bg-red-600 rounded-full cursor-pointer" onClick={endJrny}>
                                End Journey
                            </div>
                            : <div className="w-52 text-center text-white text-xl px-5 py-3 bg-sky-600 rounded-full cursor-pointer" onClick={startJrny}>
                                Start Journey
                            </div>
                        }
                        
                    </div>
                </div>

                : <div></div>
            }
        </>
    )
}

export default Home