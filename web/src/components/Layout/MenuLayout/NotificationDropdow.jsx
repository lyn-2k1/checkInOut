import { IoIosNotificationsOutline } from "react-icons/io";
import { GrNotification } from "react-icons/gr";
import { HiBell } from "react-icons/hi";
import { useState, useEffect, useRef } from "react";
import { useGetMeNotificationQuery } from "@/rest/notification/notification.query";
import NotificationItem from "./NotificationItem";
import { useGetMeQuery } from "@/rest/auth/auth.query";

const NotificationDropdow = (props) => {
  const [isShowing, toggle] = useState(false);
  const dropdownMenuRef = useRef(null);
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (
        dropdownMenuRef.current &&
        !dropdownMenuRef.current.contains(e.target)
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
  const { data: ListNotification } = useGetMeNotificationQuery();
  const [Notifications, setNotifications] = useState([]);
  useEffect(() => {
    if (!ListNotification) return;
    setNotifications(ListNotification?.reverse());
    console.log(Notifications);
  }, [ListNotification]);
  const { data: Auth } = useGetMeQuery();
  console.log("ListNOTIFICATION", ListNotification);
  return (
    <div ref={dropdownMenuRef} className="relative mr-3 text-right">
      {ListNotification?.length > 0 ? (
        <div className="absolute top-0 right-0 h-[25px] w-[25px] rounded-full bg-red-500 p-1 text-center text-sm text-white">
          <p className="font-semibold text-gray-100">
            {ListNotification?.length}
          </p>
        </div>
      ) : (
        <div></div>
      )}
      <div
        className="m-y-1 rounded-full bg-slate-200 p-4 hover:cursor-pointer hover:bg-slate-300"
        id="dropdownDefault"
        onClick={() => {
          console.log("show dropdown");
          toggle((prev) => !prev);
        }}
        data-dropdown-toggle="dropdown"
      >
        <HiBell className="text-slate-700 " size={"30px"} />
      </div>
      <div
        id="dropdown"
        className={`top-26 absolute mt-2 flex w-[400px] translate-x-[-85%] transform  flex-col space-y-4 rounded-lg bg-slate-50 p-4 shadow-lg ${
          isShowing ? "" : "hidden"
        }`}
      >
        {ListNotification?.length > 0 ? (
          <div className="v-scrollbar flex h-[500px] flex-col space-y-2">
            {ListNotification?.map((notification) => (
              <NotificationItem notification={notification} />
            ))}
          </div>
        ) : (
          <div className="m-y-auto h-[50px] text-center text-3xl">
            No Notification
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationDropdow;
