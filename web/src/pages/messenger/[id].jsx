import ListUserChat from "@/components/page/Messenger/ListUserChat";
import Content from "@/components/page/Messenger/Content";
import DashboardLayout from "@/layout/DashboardLayout";
import {FiPhoneCall, FiCamera} from "react-icons/fi";
import {io} from "socket.io-client";
import { Input } from "@/components/Common/Input";
import { useEffect } from "react";
import Cookies from "js-cookie";
const token = Cookies.get("AUTH_TOKEN");
const socket = io("localhost:4005", {
  transports: ["websocket"],
  extraHeaders: {
    Authorization: `Bearer ${token ? token : ""}`,
  }
}) 
const MessengerPage = () => {

  
    socket.on("connect", () => {

      console.log("connected");
      console.log(socket.id);
   
    });

    console.log("render mess")
 

  
  return (
    <div className="card m-8 w-full">
      {/* <div className="flex flex-grow">
        <div className="ml-2 my-2 w-1/3 rounded-l-lg border-2 border-solid border-slate-300">
          <div className="flex border-b-2 border-slate-300">
            <img
              src="https://cdnsg.kilala.vn/data/upload/article/5884/My%20Neighbor%20Totoro%20(19).jpg"
              alt="avatar"
              className="m-4 h-[65px] w-[65px] rounded-full"
            />
            <div className="my-4 mr-2 flex w-full items-center ">
              <div className="mx-auto flex h-full items-center rounded-full border p-2 hover:shadow-md md:w-full">
                <IconSearch />
                <input
                  className="ml-2 flex-1"
                  placeholder="Search or start a new chat"
                />
              </div>
            </div>
          </div>
          <ListUserChat />
        </div>
        <div className="mr-2 my-2 flex-col flex-1 rounded-r-lg border-2 border-l-0 border-solid border-slate-300">
          <div className="flex border-b-2 border-slate-300">
            <img
              src="https://ss-images.saostar.vn/wp700/2019/08/01/5744647/67943796_2411808385576541_7075669379882418176_n.jpg"
              alt="avatar"
              className="m-4 h-[65px] w-[65px] rounded-full"
            />
            <p className="flex-1 text-3xl font-bold my-5 ">{"Tham Son"}</p>
            <div className="my-4 mr-2 flex flex-1 text-right justify-end">
              <button> <FiPhoneCall className="mr-4 text-slate-500 hover:text-black" size={"35px"}/> </button>
              <button> <FiCamera className="mr-4 text-slate-500 hover:text-black" size={"35px"}/> </button>
              <button> call </button>
            </div>
          </div>
          <Content/>
          <div className="flex-1 flex w-full border-t-2 border-slate-300 border-solid ">
            <input
                className="v-input w-4/5 p-3 my-1 mx-6"
                placeholder="Type your message or use speech to text"
            />
            <button className="flex-1 w-4/5 mr-2 my-1 border border-solid border-teal-600 rounded-lg hover:bg-teal-600 hover:text-white">
                Send
            </button>
          </div>
        </div>
      </div> */}
    </div>
  );
};

MessengerPage.layout = DashboardLayout;

export default MessengerPage;

const IconSearch = () => {
  return (
    <div class="pl-5">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-5 w-5 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    </div>
  );
};
