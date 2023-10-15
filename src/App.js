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
                        <footer className="hidden w-screen bg-gray-800 text-white justify-around items-center absolute bottom-0 pb-4 md:flex pt-4">© 2023 ARK <div className="social-icons flex justify-between w-14 text-xl"><a href="https://twitter.com/anirket"><FaTwitter /></a><a href="https://github.com/anirket"><FaGithub /></a></div></footer>
                    </div>

                </Router>
            </RoomIDcontext>
        </>
    )
}

export default App
