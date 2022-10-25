import UseModal from "@/utils/hooks/UseModal";
import {BsMessenger} from "react-icons/bs";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
const Messenger = () => {
    const [isShowing, toggle] = useState(false);
    const dropdownRef = useRef(null);
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        if (isShowing) toggle(false);
      }
    };
    // add click even for page
    document.addEventListener("click", handleOutsideClick, false);
    return () => {
      // remove click even for page !importan need remove
      document.removeEventListener("click", handleOutsideClick, false);
    };
  }, [isShowing]);
  const router = useRouter()
    return (
        <div ref={dropdownRef} className="relative">
        <div
            className="m-y-1 rounded-full bg-slate-200 p-4 hover:cursor-pointer hover:bg-slate-300 mr-2"
            id="dropdownDefault"
            onClick={() => {
            console.log("show dropdown");
            toggle((prev) => !prev);
            }}
            data-dropdown-toggle="dropdown"
        >
            <BsMessenger className="text-slate-700 " size={"30px"} />
        </div>
          <div>
            <div
              id="dropdown"
              className={`top-26 absolute mt-1 w-[500px] translate-x-[-80%] transform  flex-col space-y-4 rounded-lg bg-slate-100 p-4 shadow-lg
                          ${ isShowing ? "flex" : "hidden"}`}
            >
              <div className="flex flex-col space-y-2">
                {/* {MENUS.map((menu) => (
                  <DropdowItem
                    title={menu.title}
                    onclick={menu.onclick}
                    icon={menu.icon}
                  />
                ))} */}
                <button
                    onClick={() =>  router.push(`/messenger`)}
                >
                    click page chat
                </button>
              </div>
            </div>
          </div>
        
      </div>
    )
}

export default Messenger;