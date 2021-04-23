import React, { useContext } from 'react'
import { AiOutlinePlus } from "react-icons/ai";
import { VscTriangleRight } from "react-icons/vsc";
import { useAuth0 } from '@auth0/auth0-react';
import { Link } from 'react-router-dom'
import { RoomID } from '../Contexts/RoomIDcontext';

const Mainpage = () => {
    const {
        isLoading,
        isAuthenticated,
        loginWithRedirect,
    } = useAuth0();
    const {roomid,setroomid} = useContext(RoomID);
    if (isLoading) {
        return (<h1 className="text-2xl">LOADING...</h1>)
    }
    return (
        <>
            {isAuthenticated && !isLoading ? (
                <>
                    <h1 className="text-5xl  w-40   flex items-start absolute top-20 tracking-wider text-white  header font-thin  justify-around md:text-7xl md:w-52 mt-10 md:mt-0"><img className="h-14 md:h-20" src="./logo.png" alt="" /> ZAP</h1>
                    <div className="flex items-center justify-around w-full  p-10 mt-20 flex-col md:flex-row">
                        <Link to="/room"><button className="md:text-2xl text-xl bg-gray-700 md:p-5 p-3 font-thin text-white tracking-wider  rounded-lg flex items-center justify-around md:w-64 w-52 mt-10 md:mt-0"><AiOutlinePlus />Create a room </button></Link>
                        <div className="flex mt-10 md:mt-0">
                            <input  onChange={(e)=>{setroomid(e.target.value)}} type="text" placeholder="Enter Room ID"  value={roomid} className="p- outline-none border-none md:p-5 p-3 rounded-tl-lg rounded-bl-lg" />
                            <Link to="/joinroom" className="bg-gray-300  rounded-tr-lg rounded-br-lg hover:bg-gray-400"><button className="text-2xl p-3 md:pt-5 md:pb-5"><VscTriangleRight /></button></Link>
                        </div>
                    </div>
                </>
            ) : (
                // Unauthenticated and prompt to logIn
                <>
                    <h1 className="text-5xl  w-40   flex items-start absolute top-20 tracking-wider text-white  header font-thin  justify-around md:text-7xl md:w-52"><img className="h-14 md:h-20" src="./logo.png" alt="" /> ZAP</h1>
                    <h3 className="md:text-2xl text-xl text-center text-white tracking-widest font-thin m">A ONE STOP SOLUTION  TO<br /><br /> CREATE OR JOIN EXISTING <span className="text-gray-800 font-normal">'CHAT ROOMS'</span></h3>
                    <br />
                    <button className="bg-gray-800  text-white  p-3 bottom-28 absolute md:p-5  md:bottom-32 md:text-lg rounded-md hover:bg-gray-600 tracking-wider" onClick={() => loginWithRedirect()}>LOGIN HERE TO CONTINUE</button>
                </>)}
        </>
    )
}

export default Mainpage
