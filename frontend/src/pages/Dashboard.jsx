import React, { useState, useEffect, useRef } from 'react';
import AssignCardComponent from '../components/AssignCardComponent';
import NavBarComponent from '../components/NavBarComponent';
import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css'
import '../styles/Dashboard.css'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons"

// const divStyle = {
//   display: 'flex',
//   alignItems: 'center',
//   justifyContent: 'center',
//   backgroundSize: 'cover',
//   height: 'auto'
// }

const Dashboard = () => {
  const [profiles, setProfiles] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingNotifications, setLoadingNotifications] = useState(true);
  const slideContainerRef = useRef(null);
  const driverSlideRef = useRef(null);
  const [currIdx, setCurrIdx] = useState(0);

  const nextSlide = () => {
    const nextIdx = (currIdx + 1) % profiles.length;
    setCurrIdx(nextIdx);
  }

  const prevSlide = () => {
    let prevIdx;
    if(currIdx == 0){
      prevIdx = profiles.length - 1;
    }
    else {
      prevIdx = currIdx - 1;
    }
    setCurrIdx(prevIdx);
  }








  const fetchProfiles = async () => {
    try {
      const response = await fetch('http://localhost:3000/assign/getAllAssigns?populateArea=true&populateDustbin=true&populateDriver=true&populateVehicle=true', {
        method: 'GET',
        // headers: headers
      });
      const data = await response.json();
      setProfiles(data.assignments);
      console.log(data.assignments);
      // slideShow();
    } catch (error) {
      console.error('Error fetching profiles:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // localStorage.setItem("token", "Admin");
    fetchProfiles(); // Fetch profiles initially
  }, []); // Empty dependency array to run only once on mount

  // return profiles;

  return (
    <div className="">
      <div className='fixed w-full top-0 z-10'>
        <NavBarComponent />
      </div>
      <div className="flex justify-between mt-16">
        <div className="w-[60%] px-5 py-3">
          <section className="notification">
            <h2 className='text-3xl font-semibold'>Tracking Status</h2>
          </section>
        </div>
        <div className="w-[40%] px-5 py-3 relative">
          <div className="flex flex-col items-center relative  w-full h-full">
            <h2 className='text-3xl font-semibold mb-4'>Assignments</h2>
            {/* <Slide> */}
                {profiles.map((eachProfile, idx) => (
                  <div key={idx} className={`slide  ${idx == currIdx ? "active" : ""}`} >
                    <AssignCardComponent
                        key={eachProfile._id}
                        areaName={eachProfile.areaId.areaName}
                        areaId={eachProfile.areaId.areaId}
                        dustbinNo={eachProfile.areaId.noOfDustbins}
                        driverName={eachProfile.driverUsername.fullName}
                        vehicleNo={eachProfile.vehicleReg.vehicleReg}
                        className='driverSlides visible'
                        // {...console.log(eachProfile)}
                    />
                  </div>
                ))}
            {/* </Slide> */}

            <button className='text-6xl text-gray-500 rounded-l-md absolute top-1/2 right-0 -translate-y-1/2 px-3 py-3'
              onClick={nextSlide}
            >
              <FontAwesomeIcon icon={faChevronRight}/>
            </button>
            <button className='text-6xl text-gray-500 rounded-l-md absolute top-1/2 left-0 -translate-y-1/2 px-3 py-3'
              onClick={prevSlide}
            >
              <FontAwesomeIcon icon={faChevronLeft}/>
            </button>

          </div>
        </div>
      </div>
      {/* {slideShow()} */}
    </div>
  );
};


export default Dashboard;
