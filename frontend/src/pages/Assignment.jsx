import NavBarComponent from "../components/NavBarComponent"

const Assignment = () => {
    return (
        <>
            <div className='fixed w-full top-0 z-10'>
                <NavBarComponent />
            </div>
            <div className="mt-16 px-5 py-3">
                <h2 className='text-3xl font-semibold'>Assign Drivers and Vehicles</h2>
            </div>
        </>
    )
}

export default Assignment