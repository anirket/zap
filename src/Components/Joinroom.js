import React, { useEffect, useState, useContext, useRef } from 'react'
import { useAuth0 } from '@auth0/auth0-react';
import '../index.css'
import io from "socket.io-client";
import { RoomID } from '../Contexts/RoomIDcontext';
import { IoIosArrowDropright, IoIosArrowDropleft } from 'react-icons/io';
import { FiSend } from "react-icons/fi";
import { MdContentCopy } from "react-icons/md";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Notifications, { notify } from 'react-notify-toast';
import { Link } from 'react-router-dom'
let socket, name, sub;
const CONNECTION_PORT = "https://zap-server.onrender.com/";

function Joinroom() {
    const {
        isLoading,
        user,
        isAuthenticated,
        loginWithRedirect,
    } = useAuth0();
    // Socket connection
    useEffect(() => {
        socket = io(CONNECTION_PORT);
    }, [])
    const inputRef = useRef(null);
    const [messages, setmessages] = useState([]);
    const msg = [];
    const { roomid } = useContext(RoomID);
    const [userarraylist, setuserarraylist] = useState([]);
    const [roomexists, setrommexists] = useState(true);

    useEffect(() => {
        if (isAuthenticated) {
            name = user.name;
            sub = user.sub;
            socket.emit('getrooms');
            socket.on('roomarray', (roomarray) => {
                if (roomarray.includes(roomid)) {
                    socket.emit('join-room', {
                        roomid,
                        name,
                        sub
                    });

                }
                else {
                    setrommexists(false);
                    //here the person entered random room which doesnt exist
                    console.log("nope doesnt exist");
                }
            })
          
        }
        socket.on('message', (data) => {
            displaymsg(data);
        })
        socket.on('userlist', (userlist) => {
            setuserarraylist(userlist);
            socket.emit('updatedlist', userlist);
        })
        socket.on('newlist', (data) => {
            setuserarraylist(data);
        })

    }, [])

    useEffect(() => {
        userarraylist.map((user) => {
            if (user.id == roomid) {
                setusers(user.users)
            }
        })
    }, [userarraylist])

    const [onlinedivtoggle, setonlinedivtoggle] = useState(false);
    const [inputfield, setinputfield] = useState("")
    const [users, setusers] = useState([])

    function displaymsg(data) {
        msg.push(data);
        setmessages([msg]);
        const messagediv = document.querySelector(".messagediv");
        messagediv.scrollTop = messagediv.scrollHeight;
    }


    if (isLoading) {
        return (<h1 className="text-2xl">LOADING...</h1>)
    }
    if(!roomexists){
        return(<>
        <h1 className="text-2xl">
            No room found like that!
        </h1>
        <Link to="/"><button className="bg-gray-800 p-4 text-2xl mt-24 text-white rounded-lg">Go Back</button></Link>

        </>)
    }

    function sendmessage(e) {
        e.preventDefault();
        if (inputfield.trim()) {
            const time = new Date().toLocaleTimeString();
            socket.emit('new-message', {
                name,
                input: inputfield,
                roomid,
                sub,
                time
            })
            setinputfield("")
        }
    }
    function toggleonlinediv() {
        const onlinediv = document.querySelector('.onlinediv');
        onlinediv.classList.toggle("hidden")
        if (onlinediv.classList.contains('hidden')) {
            setonlinedivtoggle(true);
        }
        else {
            setonlinedivtoggle(false);
        }
    }
    function showtoast() {
        notify.show('RoomID Copied!', 'success', 3000);
    }


    return (
        <div className='relative'>
            <Notifications />
            {isAuthenticated ?
                (<>
                    <CopyToClipboard text={roomid} onCopy={() => showtoast()}>
                    <button className="copyclipboarddiv bg-gray-700 px-0 w-96 pr-0 py-2 text-sm md:absolute md:z-50   text-white mt-2 flex items-center justify-center outline-none border-none rounded-tl-lg rounded-tr-lg" >
                            <span className="px-2">
                                Click here to copy RoomID to clipboard
                            </span>
                            <MdContentCopy className="text-lg" />
                        </button>
                    </CopyToClipboard>
                    <div className="messagediv w-96 h-96 overflow-scroll bg-white rounded-lg relative mt-1">

                        {/* hidden here */}
                        <div className='md:flex justify-end'>
                            <div className="onlineactive fixed text-2xl  z-20 flex items-center md:justify-center bg-white md:p-3 md:w-52 md:rounded-tr-lg border-l-2 border-b-2 border-gray-300 w-96 justify-between py-2 px-5">
                                <span className="text-xl mr-2 flex items-center justify-center">
                                    <div className="h-3 w-3  bg-green-400 mr-3 rounded-full"></div>Online {users.length}
                                </span>
                                <span className="toggleslider">
                                    {onlinedivtoggle ? (<IoIosArrowDropleft onClick={() => toggleonlinediv()} className="cursor-pointer text-3xl " />) : (<IoIosArrowDropright onClick={() => toggleonlinediv()} className="cursor-pointer text-3xl " />)}
                                </span>
                            </div>
                        </div>

                        {/* all messages go here */}
                        <div className="messages pt-16 pl-8 pb-12">
                        {
                                messages.map((messagecontent) => (
                                    messagecontent.map((msg, index) => {
                                        if (msg.sub != user.sub) {
                                            return (
                                                <div key={index} className="bg-gray-400 mt-2  w-60  rounded-tl-lg rounded-tr-lg rounded-br-lg">
                                                    <div className="flex bg-gray-200 items-center justify-between px-2 rounded-tl-lg rounded-tr-lg text-sm py-1 font-semibold">
                                                        <div>{msg.name}</div>
                                                        <div>{msg.time}</div>
                                                    </div>
                                                    <div className="p-4 text-white">
                                                        {msg.input}
                                                    </div>
                                                </div>)
                                        }
                                        else {
                                            return (
                                                <div key={index} className="bg-black mt-2  w-60  rounded-tl-lg rounded-tr-lg rounded-bl-lg mr-4 ml-20 md:ml-[200px]">
                                                    <div className="flex bg-gray-200 items-center justify-between px-2 rounded-tl-lg rounded-tr-lg text-sm py-1 font-semibold">
                                                        <div>You</div>
                                                        <div>{msg.time}</div>
                                                    </div>
                                                    <div className="p-4 text-white">

                                                        {msg.input}
                                                    </div>
                                                </div>)
                                        }
                                    })
                                )
                                )
                            }
                        </div>
                    </div>
                    <div className="onlinediv h-[336px] bg-white w-52  absolute  right-[1px] top-[96px] md:h-[492px] md:top-2 overflow-y-scroll border-l-2 border-gray-300  z-10 hidden">
                        {
                            users.map((user) => (
                                <div key={user.id} className="bg-gray-200 p-2 text-gray-800 mb-1" >{user.name}</div>
                            ))
                        }

                    </div>
                    <div className="w-full h-[50px]">
                        <form className="input-text h-[50px] flex items-center" onSubmit={(e) => sendmessage(e)}>
                            <input ref={inputRef} placeholder="Type Message here..." type="text" className="inputfield outline-none rounded-bl-lg border-t-2 p-3 px-5 md:px-3 border-gray-800 w-full" value={inputfield} onChange={(e) => setinputfield(e.target.value)} />
                            <button type="submit" className="border-gray-800 border-t-2 sendbutton bg-gray-600 h-[50px] px-4 text-white text-lg">
                                <FiSend />
                            </button>
                        </form>
                    </div>
                </>)
                :
                (<>
                   <div className='flex justify-center w-full'>
                        <h1 className="text-5xl  flex items-center top-20 w-80 tracking-wider text-white  header font-thin  justify-center   md:text-7xl"><img className="h-14 md:h-20" src="./logo.png" alt="" /> ZAP</h1>
                    </div>
                    <h3 className="md:text-2xl text-xl text-center text-white tracking-widest mt-20 font-thin m">A ONE STOP SOLUTION  TO<br /><br /> CREATE OR JOIN EXISTING <span className="text-gray-800 font-normal">'CHAT ROOMS'</span></h3>
                    <br />
                    <div className='w-full flex justify-center items-center mt-20'>
                        <button className="bg-gray-800  text-white  p-3 bottom-28  md:p-5  md:bottom-32 md:text-lg rounded-md hover:bg-gray-600 tracking-wider" onClick={() => loginWithRedirect()}>LOGIN HERE TO CONTINUE</button>
                    </div>
                </>)}
        </div>
    )
}

export default Joinroom
