import { Bars3Icon } from "@heroicons/react/24/outline";
import { UserIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { Link, useLocation } from "@remix-run/react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useCurrentUserContext } from "~/api/auth";

interface IHeader {
    mode?: string
}

export default function Header(props: IHeader) {
    const location = useLocation()
    const ctx = useCurrentUserContext()
    const [activeLink, setActiveLink] = useState<string>()

    useEffect(() => {
        setActiveLink(location.pathname)
        ,[location.pathname]
    })


    const [dropdownOpen, setDropdownOpen] = useState<boolean>(false)
    const { mode } = props


    return (
    <header 
        className={`w-full h-auto  ${mode === 'light'? 'text-gray-900 shadow bg-opacity-50' : 'text-white shadow'} `} 
        
    >
        <div className="hidden md:flex w-full container mx-auto justify-between py-3 items-center ">
            <Link to="/" className="">
                <img className="h-10 w-auto drop-shadow" src={mode === 'light' ? "/images/rasp-logo-purple.png":"/images/rasp-logo-white.png"} alt="rasp" />
            </Link>

            <span className="hidden md:flex space-x-1 md:space-x-4">
                <Link className={`transition ease-in-out delay-100 hover:border-b ${activeLink === "/about-us" ? " text-purple-600 border-b" : ""}`} to="/about-us"> About </Link>
                <Link className={`transition ease-in-out delay-100 hover:border-b ${activeLink === "/blog" ? "  text-purple-600 border-b" : ""}`} to="/blog"> Blog </Link>
                <Link className={`transition ease-in-out delay-100 hover:border-b ${activeLink === "/contact" ? " text-purple-600 border-b" : ""}`} to="/contact"> Contact</Link>
                <Link className={`transition ease-in-out delay-100 hover:border-b ${activeLink === "/explore" ? " text-purple-600 border-b" : ""}`} to="/explore"> Explore</Link>
            </span> 

            {
                !ctx ? (
                    <span className="hidden text-gray-900 font-medium md:flex items-center p-2 bg-white rounded-md">
                        <Link to="/get-started" className="mx-2 h-auto flex  text-xs md:text-md items-start text-start">Get Started</Link>
                    </span>
                ) :
                (
                    <div className="flex gap-1 items-center justify-start">
                        <p className="font-medium">{ctx.display_name}</p>
                        <span className="w-8 h-8 border-2 border-black rounded-full p-1">
                            <UserIcon className="w-full h-full text-black" />
                        </span>
                    </div>
                )
            }
            
        </div>
        
        {/* Mobile header  TODO:  {dropdownOpen ? style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)'}}}*/}
        <div 
            className="flex md:hidden w-full  px-4  py-2   justify-between items-center" 
            style={{backgroundColor: 'rgba(255, 255, 255, 0.5)'}}
        >
            <Link to="/" className="text-white">
            <img className="h-10 w-auto drop-shadow" src={mode=== 'light' ? "/images/rasp-logo-purple.png":"images/rasp-logo-white.png"} alt="rasp" />
            </Link>


            {/* Dropdown menu control */}
            <span className=""> 
                { dropdownOpen ? 
                    <XMarkIcon className="drop-shadow w-8 h-8 text-white" onClick={() => setDropdownOpen(!dropdownOpen)} /> 
                    :
                    <Bars3Icon className="drop-shadow w-8 h-8 text-white" onClick={() => setDropdownOpen(!dropdownOpen)} />                        
                }
                
                
            </span>

        </div>

        <AnimatePresence>
            {dropdownOpen ?
            <motion.div 
                initial={{ opacity: 0}}
                animate= {{ opacity: 1}}
                exit={{opacity:0, height:0}}
                transition={{ease: "easeInOut", duration: 0.5}}

                className="w-full h-auto z-20" style={{backgroundColor: 'rgba(255, 255, 255, 0.1)'}}>
                    <div className="w-full py-2 px-4 flex justify-between  items-center">
                        <Link to="/get-started" className="h-auto flex  text-xs md:text-md items-start text-start font-medium text-purple-600 ">Get Started</Link>
                        <span className="w-8 h-8 border-2 border-black rounded-full p-1">
                            <UserIcon className="w-full h-full text-black" />
                        </span>
                    </div>
                
                    <div className="w-full ml-4 flex-col justify-center items-center space-y-1 ">
                        <Link className="block transition py-2 ease-in-out delay-100 hover:font-bold hover:scale-105 " to="/about-us"> About </Link>
                        <Link className="block transition py-2 ease-in-out delay-100 hover:font-bold hover:scale-105 " to="/blog"> Blog </Link>
                        <Link className="block transition py-2 ease-in-out delay-100 hover:font-bold hover:scale-105 " to="/contact"> Contact</Link>
                        <Link className="block transition py-2 ease-in-out delay-100 hover:font-bold hover:scale-105 " to="/explore"> Explore</Link>
                    </div>
            </motion.div>
            : ""}
        </AnimatePresence>



    </header>
    )
}