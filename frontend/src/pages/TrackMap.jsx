import { useEffect, useState } from "react";
import MapComponent from "../components/MapComponent";
import { Marker, Popup, useMapEvent } from "react-leaflet";
import L from 'leaflet'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPencil, faTrash } from "@fortawesome/free-solid-svg-icons"
import carIcon from "../assets/carMarker.png"
import tempDustbinIcon from "../assets/tempDustbinMarker.png"
import dustbinIcon from "../assets/dustbinMarker.png"
import { socket } from "../App";
const backendURL = import.meta.env.VITE_BACKEND_URL

const TrackMap = () => {
    const getQueryParameter = (name) => {
        const urlParams = new URLSearchParams(window.location.search);
        const params = urlParams.get(name);
        return params;
    }

    const [carPosition, setCarPosition] = useState({lat: undefined, lng: undefined});
    const [pathId, setPathId] = useState();
    const [dustbins, setDustbins] = useState([]);
    let [addDustbin, setAddDustbin] = useState({allow: false});
    let [addDustbinFormData, setAddDustbinFormData] = useState({
        dustbinId: '',
        dustbinNo: '',
        pathId: ''
    });
    let [isBellowAspect, setIsBellowAspect] = useState();

    // custom icon for car
    const carMarker = new L.icon({
        iconUrl: carIcon,
        iconSize: [35, 35],
        iconAnchor: [25, 45],
        popupAnchor: [0, -45]
    });

    // custom icon for temporaty dustbin
    const tempAddDustbinMarker = new L.icon({
        iconUrl: tempDustbinIcon,
        iconSize: [30, 30],
        iconAnchor: [15, 22],
        popupAnchor: [0, -45]
    })

    // custom icon for dustbin
    const dustbinMarker = new L.icon({
        iconUrl: dustbinIcon,
        iconSize: [50, 50],
        iconAnchor: [25, 45],
        popupAnchor: [0, -45]
    })

    // fetch all dustbins of the path
    const getAllDustbins = async (pathId) => {
        const response = await fetch(
            `${backendURL}/dustbin/getAllDustbins/${pathId}`,
            {
                method: 'GET'
            }
        );
        const data = await response.json();
        if(response.ok){
            setDustbins(data.dustbins);
        }
    };

    const allowAddDustbin = () => {
        setAddDustbin(prevState => ({
            ...prevState,
            allow: true
        }));
    }

    // Handle the form inputs
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setAddDustbinFormData(prevData => ({
            ...prevData,
            [name]: value
        }))
    }

    // create new dustbin
    const addToDustbins = async (e) => {
        e.preventDefault();
        const response = await fetch(
            `${backendURL}/dustbin/createDustbin`,
            {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({
                    dustbinId: addDustbinFormData.dustbinId,
                    dustbinNo: addDustbinFormData.dustbinNo,
                    pathId: addDustbinFormData.pathId,
                    coords: {
                        lat: addDustbin.lat,
                        lng: addDustbin.lng
                    }
                })
            }
        )

        const data = await response.json();
        alert(data.message);
        if(response.ok){
            setAddDustbin({allow: false});
            setDustbins(prevDustbins => [ ...prevDustbins, data.addedDustbin ]);
        }
        setAddDustbinFormData({
            dustbinId: '',
            dustbinNo: '',
            pathId: ''
        });
    }

    const deleteDustbin = async (e) => {
        const dustbinId = e.currentTarget.getAttribute("dustbinid");
        const pathId = e.currentTarget.getAttribute("pathid");
        const response = await fetch(
            `${backendURL}/dustbin/deleteDustbin`,
            {
                method: 'DELETE',
                headers: {
                    "Content-type" : "application/json"
                },
                body: JSON.stringify({
                    dustbinId,
                    pathId
                })
            }
        )

        const data = await response.json();
        alert(data.message);
        if(response.ok){
            setDustbins(prevDustbins => prevDustbins.filter(dustbin => dustbin.dustbinId != dustbinId));
        }
    }

    // Event listeners on map
    const EventListenerComponent = () => {
        if(addDustbin.allow){
            useMapEvent("click", (e) => {
                console.log("Clicked on ", e.latlng);
                setAddDustbin({
                    lat: e.latlng.lat,
                    lng: e.latlng.lng,
                    allow: true
                })
            })
        }

        return null
    }

    useEffect(()=>{
        const pathId = getQueryParameter('pathId')
        getAllDustbins(pathId);
        setPathId(pathId)
    }, []);

    useEffect(() => {
        const checkAspectRatio = () => {
            setIsBellowAspect( window.innerHeight < window.innerWidth );
        }

        checkAspectRatio();
        window.addEventListener('resize', checkAspectRatio);

        return () => window.removeEventListener('resize', checkAspectRatio);
    }, []);


    socket.on("receive location", (data) => {
        // console.log(data.location);
        // console.log(pathId)
        if(data.pathId.pathId == pathId){
            setCarPosition({
                lat: data.location.latitude,
                lng: data.location.longitude
            })
        }
    })

    socket.on("driver disconnected", (data) => {
        console.log(data.pathId)
        if(data.pathId == pathId){
            setCarPosition({
                lat: undefined,
                lng: undefined
            })
        }
    })

    

    return (
        <>
            { (isBellowAspect != undefined) ?
                <div className={`flex ${ isBellowAspect ? 'flex-row' : 'flex-col' }`}>
                    <div className={`map ${ isBellowAspect ? ('w-[58vw] h-screen') : ('h-[58vh] w-full')}`}>
                        <MapComponent>
                            {/* Marker for all dustbins */}
                            {dustbins.map((eachDustbin, idx) => (
                                <Marker key={idx} position={[eachDustbin.coords.lat, eachDustbin.coords.lng]} icon={dustbinMarker}>
                                    <Popup>
                                        <div className="flex gap-2 justify-end mb-1">
                                            <button><FontAwesomeIcon icon={faPencil} /></button>
                                            <button dustbinid={eachDustbin.dustbinId} pathid="PATH001" onClick={deleteDustbin}><FontAwesomeIcon icon={faTrash} /></button>
                                        </div>
                                        <pre>ID  : {eachDustbin.dustbinId}</pre>
                                        <pre>No. : {eachDustbin.dustbinNo}</pre>
                                    </Popup>
                                </Marker>
                            ))}

                            {/* Temporary Marker for new dustbin */}
                            {addDustbin.lat && addDustbin.lng && (
                                <Marker icon={tempAddDustbinMarker} position={[addDustbin.lat, addDustbin.lng]}>
                                    <Popup>Add Dustbin Here ?</Popup>
                                </Marker>
                            )}

                            {/* Marker for car */}
                            {carPosition.lat != undefined ?
                                <Marker  position={[carPosition.lat, carPosition.lng]} icon={carMarker}>
                                    <Popup>
                                        
                                    </Popup>
                                </Marker>
                                : <></>
                            }
                            
                            <EventListenerComponent/>
                        </MapComponent>
                    </div>
                    
                    <div className={`controls p-10 z-[400] ${ isBellowAspect ? 'w-[42vw] h-screen' : 'h-[43vh] w-full'}`} style={{ boxShadow: "-10px 0px 20px -5px rgba(0, 0, 0, 0.3)" }}>
                        <div className="inline-block">
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
                                                type="text" placeholder="Path ID" name="pathId" value={addDustbinFormData.pathId}
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
                        </div>
                    </div>
                </div>

                : <div></div>
            }
        </>
    )
}

export default TrackMap