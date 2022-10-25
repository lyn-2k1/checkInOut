import ListUserChat from "@/components/page/Messenger/ListUserChat";
import Content from "@/components/page/Messenger/Content";
import DashboardLayout from "@/layout/DashboardLayout";
import {FiPhoneCall, FiCamera} from "react-icons/fi";


const MessengerPage = () => {
  
  return (
    <div className="card m-8 w-full">
      <div className="flex flex-grow">
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
        <div className="mr-2 my-2 flex-1 rounded-r-lg border-2 border-l-0 border-solid border-slate-300">
          <Content/> 
          
        </div>
      </div>
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
