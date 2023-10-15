import React, { useEffect, useState, useContext, useRef } from 'react'
import { useAuth0 } from '@auth0/auth0-react';
import '../index.css'
import uuid from 'react-uuid'
import io from "socket.io-client";
import { RoomID } from '../Contexts/RoomIDcontext';
import { IoIosArrowDropright, IoIosArrowDropleft } from 'react-icons/io';
import { FiSend } from "react-icons/fi";
import { MdContentCopy } from "react-icons/md";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Notifications, { notify } from 'react-notify-toast';
let socket, roomid;
const CONNECTION_PORT = "https://zap-server.onrender.com/";

function Room() {

    const {
        isLoading,
        isAuthenticated,
        user,
        loginWithRedirect,
    } = useAuth0();

    const inputRef = useRef(null);
    const { rooms, setrooms, messages, setmessages } = useContext(RoomID);
    const [onlinedivtoggle, setonlinedivtoggle] = useState(false);
    const [inputfield, setinputfield] = useState("")
    const [users, setusers] = useState([])
    const msg = [];
    const [userarraylist, setuserarraylist] = useState([]);


    useEffect(() => {
        socket = io(CONNECTION_PORT);
    }, [])



    useEffect(() => {
        // make new room
        // Socket connection
        if (isAuthenticated) {
            let { name, sub } = user
            roomid = uuid()
            socket.emit('join-room', {
                roomid,
                name,
                sub
            });
            inputRef.current.focus();
        }

        // Notify when person creates new room and add it to state called rooms
        socket.on('newroomadded', (data) => {
            setrooms(rooms.concat(data));
        })
        socket.on('room-created', (data) => {
            if (!rooms.includes(data)) {
                setrooms(rooms.concat(data))
            }
        })
        socket.on('userlist', (userlist) => {
            setuserarraylist(userlist);
        })
        socket.on('newlist', (data) => {
            setuserarraylist(data);
        })
        socket.on('message', (data) => {
            displaymsg(data);
        })
        return () => {
            socket.off('message')
            socket.off('room-created')
            socket.off('newroomadded')
        }
    }, [])

    useEffect(() => {
        userarraylist.map((user) => {
            if (user.id == roomid) {
                setusers(user.users)
            }
        })
    }, [userarraylist])

    function displaymsg(data) {
        msg.push(data);
        setmessages([msg]);
        const messagediv = document.querySelector(".messagediv");
        messagediv.scrollTop = messagediv.scrollHeight;
    }
    function showtoast() {
        notify.show('RoomID Copied!', 'success', 3000);
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
    //recieve message

    // send message
    function sendmessage(e) {
        e.preventDefault();
        let { name, sub } = user;
        if (inputfield.trim()) {
            const time = new Date().toLocaleTimeString();
            let msgobj = {
                name,
                input: inputfield,
                roomid,
                sub,
                time
            }

            socket.emit('new-message', msgobj)
            displaymsg(msgobj);

            setinputfield("")
        }
    }
    if (isLoading) {
        return (<h1 className="text-2xl">LOADING...</h1>)
    }
    return (
        <div>
            <Notifications />
            {isAuthenticated ?
                (<>
                    {/* <div className="bg-gray-700 px-5 w-96 pr-0 py-2 text-sm md:hidden text-white mt-2"><span className="font-semibold">Room ID : </span> {roomid}</div> */}
                    <CopyToClipboard text={roomid} onCopy={() => showtoast()}>
                        <button className="copyclipboarddiv bg-gray-700 px-0 w-96 pr-0 py-2 text-sm md:absolute md:z-50   text-white mt-2 flex items-center justify-center outline-none border-none rounded-tl-lg" >
                            <span className="px-2">
                                Click here to copy RoomID to clipboard
                                       </span>
                            <MdContentCopy className="text-lg" />
                        </button>
                    </CopyToClipboard>
                    <div className="messagediv w-96 h-96 overflow-scroll bg-white rounded-lg relative mt-1">

                        {/* hidden here */}
                        <span className="onlineactive fixed right-3   text-2xl  z-20 flex items-center md:justify-center bg-white md:p-3 md:w-52 md:rounded-tr-lg border-l-2 border-b-2 border-gray-300 w-96 justify-between px-10 py-2 ">
                            <span className="text-xl mr-2 flex items-center justify-center">
                                <div className="h-3 w-3  bg-green-400 mr-3 rounded-full"></div>Online {users.length}
                            </span>
                            <span className="toggleslider">
                                {onlinedivtoggle ? (<IoIosArrowDropleft onClick={() => toggleonlinediv()} className="cursor-pointer text-3xl " />) : (<IoIosArrowDropright onClick={() => toggleonlinediv()} className="cursor-pointer text-3xl " />)}
                            </span>
                        </span>

                        {/* all messages go here */}
                        <div className="messages pt-16 pl-8 pb-12">
                            {
                                messages.map((messagecontent) => (
                                    messagecontent.map((msg, index) => {
                                        if (msg.sub != user.sub) {
                                            return (
                                                <div key={index} className="bg-gray-400 mt-2  w-60  rounded-tl-lg rounded-tr-lg rounded-br-lg ">
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
                                                <div key={index} className="bg-black mt-2  w-60  rounded-tl-lg rounded-tr-lg rounded-bl-lg ml-20 ">
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
                    <div className="onlinediv h-96 bg-white w-52  absolute  right-1 top-20  rounded-tr-lg rounded-br-lg overflow-y-scroll border-l-2 border-gray-300  z-10 hidden">
                        {
                            users.map((user) => (
                                <div key={user.id} className="bg-gray-200 p-2 text-gray-800 mb-1" >{user.name}</div>
                            ))
                        }

                    </div>
                    <form className="input-text" onSubmit={(e) => sendmessage(e)}>
                        <input ref={inputRef} placeholder="Type Message here..." type="text" className="inputfield outline-none rounded-bl-lg border-t-2 p-3 px-5 md:px-3 border-gray-800 w-80 " value={inputfield} onChange={(e) => setinputfield(e.target.value)} />
                        <button type="submit" className="border-gray-800 border-t-2 sendbutton bg-gray-600 p-4 absolute text-white text-lg">
                            <FiSend />
                        </button>

                    </form>
                </>)
                :
                (<>
                    <h1 className="text-5xl  flex items-center absolute top-20 w-80 mr-7 tracking-wider text-white  header font-thin  justify-center   md:text-7xl md:ml-20"><img className="h-14 md:h-20" src="./logo.png" alt="" /> ZAP</h1>
                    <h3 className="md:text-2xl text-xl text-center text-white tracking-widest font-thin m">A ONE STOP SOLUTION  TO<br /><br /> CREATE OR JOIN EXISTING <span className="text-gray-800 font-normal">'CHAT ROOMS'</span></h3>
                    <br />
                    <button className="bg-gray-800  text-white  p-3 bottom-28 ml-10 absolute md:p-5  md:bottom-32 md:text-lg rounded-md hover:bg-gray-600 tracking-wider md:ml-28" onClick={() => loginWithRedirect()}>LOGIN HERE TO CONTINUE</button>
                </>)
            }
        </div >
    )
}

export default Room
