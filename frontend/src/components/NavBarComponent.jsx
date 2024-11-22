import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBell, faUser } from "@fortawesome/free-solid-svg-icons"
import { useNavigate } from "react-router-dom"
import { faEdit, faXmark } from "@fortawesome/free-solid-svg-icons"
import { useEffect, useState } from "react"


const NavBarComponent = () => {
    const navigate = useNavigate();

    const [token, setToken] = useState(null);
    const [fullName, setFullName] = useState(null);
    const [username, setUsername] = useState(null);
    const [email,setEmail] = useState(null);
    const [expanded, setExpanded] = useState(false);

    const expandProfile = () => {
        const profileDetails = document.querySelector(".profileDetails");
        const profileIcon = document.querySelector(".profileIcon");
        if(expanded){
            profileDetails.classList.remove("right-0")
            profileDetails.classList.add("right-[-24rem]")
            profileDetails.style.boxShadow = ""
            setExpanded(false);
        }
        else{
            profileDetails.classList.remove("right-[-24rem]")
            profileDetails.classList.add("right-0")
            profileDetails.style.boxShadow = "10px 10px 20px 4px rgb(0 0 0 / 0.1), -10px -10px 20px 4px rgb(0 0 0 / 0.1)"
            setExpanded(true)
        }
    }

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if(storedToken){
            try{
                const parsedToken = JSON.parse(storedToken);
                setToken(parsedToken);
                setFullName(parsedToken.fullName);
                setUsername(parsedToken.username);
                setEmail(parsedToken.email);
            } catch(err) {
                console.log("Error while parsing token", err)
            }
            
        }
    }, [])

    const reloadPage = () => {
        window.location.reload()
    }

    const navigateDashboard = () => {
        navigate("/dashboard")
    }

    const navigateAssign = () => {
        navigate("/assign")
    }

    return (
        <>
            <div className="w-full h-16 text-white bg-green-800 px-3 flex items-center justify-between">
                <p className="text-3xl font-bold">
                    Municipality Garbage Management
                </p>
                {((localStorage.getItem("token") != '') && (localStorage.getItem("token") != null))
                    ? <div className="flex gap-5 items-center">
                        <FontAwesomeIcon icon={faBell} className="text-2xl" />
                        <button className="w-24 py-1 text-lg border-[1px] border-white rounded-md" onClick={navigateDashboard}>Dashboard</button>
                        <button className="w-24 py-1 text-lg border-[1px] border-white rounded-md">Manage</button>
                        <button className="w-24 py-1 text-lg border-[1px] border-white rounded-md" onClick={navigateAssign}>Assign</button>
                        <div className="profileIcon w-9 h-9 text-green-800 text-xl bg-white rounded-full flex justify-center items-center cursor-pointer"
                            onClick={expandProfile}>
                            <FontAwesomeIcon
                                icon={ expanded ? faXmark : faUser}
                            />
                        </div>
                    </div>
                    : <></>

                }
            </div>

            {/* expand profile */}
            <div className="profileDetails absolute top-16 right-[-24rem] w-96 p-5 bg-white rounded-lg flex flex-col gap-10 items-center">
                <div className="bg-gray-500 h-44 w-44 rounded-full"></div>
                <div className="w-full">
                    <div className="text-2xl font-bold text-green-700 mb-2">
                        <b>Name :</b> {fullName}
                    </div>
                    <div className="text-lg mb-2">
                        <b>Username :</b> {username}
                    </div>
                    <div className="text-lg mb-2">
                        <b>Email ID :</b> {email}
                    </div>
                    <div className="text-lg mb-2">
                        <b>Phone No. :</b> {}
                    </div>
                </div>
                <div>
                    <button
                        className="inline-block w-32 bg-green-700 py-2 text-lg font-medium text-white rounded-full"
                    >
                        <FontAwesomeIcon icon={faEdit} className="mr-2"/>
                        Edit
                    </button>
                    <button
                        className="inline-block w-32 bg-green-700 py-2 text-lg font-medium text-white rounded-full"
                    >
                        <FontAwesomeIcon icon={faEdit} className="mr-2"/>
                        Edit
                    </button>
                </div>
                
            </div>
        </>
    )
}

export default NavBarComponent