import { BsFillPersonLinesFill } from "react-icons/bs";
import { AiOutlineMenu } from "react-icons/ai";
import { FaTwitter, FaGithub } from "react-icons/fa";
import { useAuth0 } from '@auth0/auth0-react';
import { BrowserRouter as Router, Link, Route, Switch } from "react-router-dom";
import Mainpage from './Components/Mainpage';
import Room from './Components/Room';

import RoomIDcontext from './Contexts/RoomIDcontext';
import Joinroom from './Components/Joinroom';

function App() {

    const {
        isAuthenticated,
        user,
        loginWithRedirect,
        logout,
    } = useAuth0();

    function toggle() {
        let menu = document.querySelector(".menu");
        menu.classList.toggle("hidden")
    }
    return (
        <>
            <RoomIDcontext>
                <Router>

                    {/* NAVBAR SECTION */}
                    <nav className="bg-gray-100">
                        {/* laptop */}
                        <div className="text-black">
                            <div className="flex justify-between p-4 items-center ">
                                <div className="flex text-center items-center pl-2">
                                    <img className="h-12" src="./logo.png" alt="" /><h1 className=" text-xl pl-2">Zap</h1>
                                </div>
                                <div className=" w-5/12 justify-between pr-2 items-center hidden md:flex">
                                    <Link to="/"> <div className="text-lg cursor-pointer">Home</div></Link>
                                    {isAuthenticated ? (<button className="bg-yellow-300 p-3 text-lg tracking-wider outline-none border-none hover:bg-yellow-400 rounded-md" onClick={() => logout()}>LOGOUT</button>) : (<button className="bg-yellow-300 p-3 text-lg tracking-wider outline-none border-none hover:bg-yellow-400 rounded-md" onClick={() => loginWithRedirect()}>LOGIN</button>)}

                                </div>
                                <div className="md:hidden flex items-center">
                                    <div className="w-8 h-8 text-2xl outline-none border-none burger" onClick={() => toggle()}>
                                        <AiOutlineMenu />
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* mobile menu */}
                        <div className="hidden menu">
                            <Link to="/"><li className="block py-2 px-4 text-sm hover:bg-gray-200">Home</li></Link>
                            {isAuthenticated ? (<li className="block py-2 px-4 text-sm tracking-wider hover:bg-gray-200" onClick={() => logout()}>Logout</li>) : (<li className="block py-2 px-4 text-sm tracking-wider hover:bg-gray-200" onClick={() => loginWithRedirect()}>Login</li>)}
                        </div>
                    </nav>
                    {isAuthenticated && <div className=" z-10 w-full absolute right-0 px-4 py-2 rounded-b-lg flex justify-between items-center sm:w-96 bg-gray-100 border-t-2 border-gray-700    "><div>{user.name}</div> <img className="h-10 rounded-full" src={user.picture} alt="" /></div>}

                    {/* MAIN SECTION */}

                    <div className="mainpage  bg-red-500 p-4 flex justify-center items-center flex-col relative">
                        {/* authenticated and main home page render where you can create or join room */}
                        <Switch>
                            <Route exact path="/" component={Mainpage} />
                            <Route exact path="/room" component={Room}></Route>
                            <Route exact path="/joinroom" component={Joinroom}></Route>
                        </Switch>
                        {/* FOOTER SECTION */}
                        <footer className="w-screen bg-gray-800 text-white justify-around items-center absolute bottom-0 p-2 flex pt-4">© 2021 ARK <div className="social-icons flex justify-between w-14 text-xl"><a href=""><FaTwitter /></a><a href=""><FaGithub /></a></div></footer>

                    </div>

                </Router>
            </RoomIDcontext>
        </>
    )
}

export default App
