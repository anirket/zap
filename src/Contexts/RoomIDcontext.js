import React,{createContext, useState} from 'react'

export const RoomID = createContext();

const RoomIDcontext = (props) => {

    const [roomid,setroomid] = useState("");
    const [rooms,setrooms] = useState([]);
    const [messages, setmessages] = useState([])
    return (
        <RoomID.Provider value={{roomid,setroomid,rooms,setrooms,messages,setmessages}}>
            {props.children}
        </RoomID.Provider>
    )
}

export default RoomIDcontext
