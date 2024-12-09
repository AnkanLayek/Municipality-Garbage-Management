import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPencil, faTrash, faAngleDown, faXmark, faPlus } from "@fortawesome/free-solid-svg-icons"
import tempIcon from "../assets/tempDustbinMarker.png";
import dustbinIcon from "../assets/dustbinMarker.png"
import NavBarComponent from "../components/NavBarComponent";
import AllPathsComponent from "../components/AllPathsComponent";
import MapComponent from "../components/MapComponent";
import RoutingComponent from "../components/RoutingComponent";
const backendURL = import.meta.env.VITE_BACKEND_URL


import { Marker, Popup, useMapEvent } from "react-leaflet";
import L from 'leaflet'
import 'leaflet-routing-machine'
import { socket } from "../App";

const AddDustbin = () => {
    const [pathId, setPathId] = useState();
    const [dustbins, setDustbins] = useState([]);
    const [checkPoints, setCheckPoints] = useState([]);
    const [addDustbin, setAddDustbin] = useState({allow: false});
    let [addDustbinFormData, setAddDustbinFormData] = useState({
        dustbinId: '',
        dustbinNo: '',
        pathId: ''
    });
    const [formPathId, setFromPathId] = useState('');
    const [formPathName, setFormPathName] = useState('')
    const [addNewPath, setAddNewPath] = useState(false)
    const [refreshPaths, setRefreshPaths] = useState(true);
    let [isBellowAspect, setIsBellowAspect] = useState();
    const [isBlured, setIsBlured] = useState(false)
    const [isExpanded, setIsExpanded] = useState(false);
    const navigate = useNavigate()

    const getQueryParameter = (name) => {
        const urlParams = new URLSearchParams(window.location.search);
        const params = urlParams.get(name);
        return params;
    }

    const handleNavigation = (pathId) => {
        setIsExpanded(false)
        navigate(`/addDustbin?pathId=${pathId}`)
    }

    const expandPathlist = () => {
        setIsExpanded(true)
        setIsBlured(true)
    }

    const shrinkPathlist = () => {
        setIsExpanded(false)
        setIsBlured(false)
    }

    // custom icon for temporaty checkpoint
    const tempMarker = new L.icon({
        iconUrl: tempIcon,
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
                    pathId,
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

    // fetch all checkpoints of the path
    const getAllCheckpoints = async (pathId) => {
        const response = await fetch(
            `${backendURL}/path/getAllPaths/${pathId}`,
            {
                method: 'GET'
            }
        );
        const data = await response.json();
        if(response.ok){
            setCheckPoints(data.path.checkPoints);
        }
    }

    const allowAddDustbin = () => {
        setAddDustbin(prevState => ({
            ...prevState,
            allow: true
        }));
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
        setPathId(pathId);
        if(pathId == null){
            setAddNewPath(true)
            setIsBlured(true)
            setCheckPoints([])
        }
        else{
            setAddNewPath(false)
            setIsBlured(false)
            getAllCheckpoints(pathId);
            getAllDustbins(pathId);
        }
    }, [useLocation().search]);

    useEffect(() => {
        const checkAspectRatio = () => {
            setIsBellowAspect( window.innerHeight < window.innerWidth );
        }

        checkAspectRatio();
        window.addEventListener('resize', checkAspectRatio);

        return () => window.removeEventListener('resize', checkAspectRatio);
    }, []);

    return (
        <>
            <div className='fixed w-full top-0 z-10'>
                <NavBarComponent />
            </div>
            <div className="flex justify-between mt-16 relative">
                { (isBellowAspect != undefined) ?
                    <>
                        {(isBellowAspect || isExpanded)
                            // side bar of path list container
                            ? <div className={`sidePathListContainer w-96 h-full bg-white ${!isBellowAspect ? 'absolute' : ''} z-[5] overflow-y-auto`}>    {/* index.css */}
                                {!isBellowAspect
                                    ? <div className="m-4 flex flex-row-reverse">
                                        <div className="w-9 h-9 p-2 text-xl border-2 border-black rounded-full flex justify-center items-center cursor-pointer"
                                            onClick={shrinkPathlist}>
                                            <FontAwesomeIcon icon={faXmark} />
                                        </div>
                                    </div>
                                    : <></>
                                }

                                {/* side bar of path list */}
                                <div className={`sidePathList  ${isBellowAspect ? 'h-[calc(100vh-4rem)]' : 'h-[calc(100vh-4rem-3.25rem)]'}`}>  {/* to handle the height*/}
                                    <div className="py-5">
                                        {/* create new path div */}
                                        {/* <div className="w-full px-5 mb-3 flex flex-col">
                                            <div
                                                className={`w-full h-40 ${(pathId == null) ? 'border-4' : 'border-2'} border-green-700 rounded-lg flex flex-col gap-2 justify-center items-center relative`}
                                                style={{boxShadow: "10px 10px 20px 4px rgb(0 0 0 / 0.1), -10px -10px 20px 4px rgb(0 0 0 / 0.1)"}}
                                                onClick={handleCreatePathClick}
                                            >
                                                <div className="h-20 w-20 text-4xl rounded-full bg-gray-300 overflow-hidden flex justify-center items-center">
                                                    <FontAwesomeIcon icon={faPlus} />
                                                </div>
                                                <div className="">Create New Path</div>
                                                
                                            </div>
                                        </div> */}

                                        {/* fetching all the paths */}
                                        <AllPathsComponent currentPathId={pathId} onPathClick={handleNavigation} refreshPaths={refreshPaths} />
                                    </div>
                                </div>
                            </div>

                            // expand path list button for mobiles only
                            : <div className="absolute top-0 left-0 w-10 h-10 bg-white flex justify-center items-center z-[3]"
                                onClick={expandPathlist}>
                                <FontAwesomeIcon icon={faAngleDown} />
                            </div>
                        }

                        {/* main page portion */}
                        <div className={`w-full flex ${ isBellowAspect ? 'flex-row' : 'flex-col' } relative`}>
                            {/* form for creating new path */}
                            {/* <div
                                className={`absolute z-[3] rounded-lg flex flex-col items-center p-5 left-1/2 -translate-x-1/2 transition-all duration-150
                                            ${addNewPath ? 'top-1/2 -translate-y-1/2' : 'top-0 -translate-y-full'}`}
                                style={{background: "linear-gradient(45deg, #e6f5e6, #b9ebb9)"}}
                            >
                                <h1 className="text-3xl mb-10">Create New Path</h1>
                                <form className="flex flex-col items-center"
                                    onSubmit={createPath}>
                                    <div className="inputsContainer flex flex-col gap-3">
                                        <div className="flex flex-col">
                                            <label htmlFor="pathId">Path ID</label>
                                            <input type="text" id='pathId' name="pathId"
                                                className="px-3 py-2 w-80 border-2 border-black rounded-md"
                                                onChange={(e) => setFromPathId(e.target.value)} />
                                        </div>
                                        <div className="flex flex-col">
                                            <label htmlFor="pathName">Path Name</label>
                                            <input type="text" id='pathName' name="pathName"
                                                className="px-3 py-2 w-80 border-2 border-black rounded-md"
                                                onChange={(e) => setFormPathName(e.target.value)} />
                                        </div>
                                    </div>
                                    
                                    <div className="inline-block w-32 mt-7 bg-green-700 py-2 text-lg font-medium text-white rounded-full text-center cursor-pointer">
                                        <input type="submit" value={'Create'} />
                                    </div>
                                </form>
                            </div> */}

                            {/* map portion */}
                            <div className={`map z-0 ${ isBellowAspect ? ('w-[58%] h-[calc(100vh-4rem)]') : ('h-[58vh] w-full')}`}>
                                <MapComponent>
                                    {/* Marker for all dustbins */}
                                    {dustbins.map((eachDustbin, idx) => (
                                        <Marker key={idx} position={[eachDustbin.coords.lat, eachDustbin.coords.lng]} icon={dustbinMarker}>
                                            <Popup>
                                                <div className="flex gap-2 justify-end mb-1">
                                                    <button><FontAwesomeIcon icon={faPencil} /></button>
                                                    <button dustbinid={eachDustbin.dustbinId} pathid={`${pathId}`} onClick={deleteDustbin}><FontAwesomeIcon icon={faTrash} /></button>
                                                </div>
                                                <pre>ID  : {eachDustbin.dustbinId}</pre>
                                                <pre>Lat : {eachDustbin.coords.lat}</pre>
                                                <pre>Lng : {eachDustbin.coords.lng}</pre>
                                            </Popup>
                                        </Marker>
                                    ))}

                                    {/* Temporary Marker for new dustbin */}
                                    {addDustbin.lat && addDustbin.lng && (
                                        <Marker icon={tempMarker} position={[addDustbin.lat, addDustbin.lng]}>
                                            <Popup>Add Dustbin Here ?</Popup>
                                        </Marker>
                                    )}

                                    {/* Marker for car */}
                                    {/* {carPosition.lat != undefined ?
                                        <Marker  position={[carPosition.lat, carPosition.lng]} icon={carMarker}>
                                            <Popup>
                                                
                                            </Popup>
                                        </Marker>
                                        : <></>
                                    } */}
                                    
                                    <RoutingComponent checkPoints={checkPoints} />
                                    <EventListenerComponent/>
                                </MapComponent>
                            </div>
                            
                            {/* control portion */}
                            <div className={`controls p-10 z-[1] ${ isBellowAspect ? 'w-[42%] h-[calc(100vh-4rem)]' : 'h-[43vh] w-full'}`} style={{ boxShadow: "-10px 0px 20px -5px rgba(0, 0, 0, 0.3)" }}>
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
                    </>

                    : <div></div>
                }
            </div>

            {/* blured layer */}
            <div
                className={`bluredLayer w-screen h-screen bg-black opacity-50 backdrop-blur-2xl absolute top-0 left-0 
                            ${(isBlured) ? 'block' : 'hidden'}
                            ${(!isBellowAspect && isExpanded) ? 'z-[4]' : 'z-[2]'}`}
                >
            </div>

        </>
    )
}

export default AddDustbin