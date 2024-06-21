import { DeviceTabletIcon } from "@heroicons/react/24/solid";
import { Link, Outlet } from "@remix-run/react";
import { motion } from "framer-motion";
import { useState } from "react";
import Footer from "~/components/footer";
import Header from "~/components/header";
import PropertyCard, { IProperty } from "~/components/property-card";
import Sidebar from "~/components/sidebar";

export default function Explore() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
      };
      
    return <div className="w-full relative ">
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
          
        <Header mode="light" />

        <button 
          className="bg-purple-600 absolute z-400 top-3 right-12 md:right-36 lg:right-[150px] text-white opacity-100 rounded-lg p-2 hover:bg-purple-700"
          onClick={toggleSidebar}
        >
          {isSidebarOpen ? <DeviceTabletIcon className="w-4 h-4 rotate-90 text-white"/>: <DeviceTabletIcon className="w-4 h-5 rotate-90 text-white"/>}
        </button>
        <section className="bg-slate-50 w-full flex  ">
          <Outlet />
        </section>
      
      </div>
}

