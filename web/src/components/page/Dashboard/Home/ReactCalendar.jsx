import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import moment from "moment";
import { getCheckInStatus } from "@/api/service/auth.service";
import {
  fetchMyTickets,
  selectTickets,
} from "@/redux/feature/ticket/ticketSlice";
import { useSelector, useDispatch } from "react-redux";
import { convertCheckInListToArray } from "@/utils/helper/workcalendar";
import { getDateArray } from "@/utils/helper/workcalendar";
import Modal from "@/components/Common/Modal";
import UseModal from "@/utils/hooks/UseModal";
import { checkInInfoFormatter } from "@/utils/Formatter/CheckInInfo";
import "react-calendar/dist/Calendar.css";

function isSameDay(a, b) {
  return moment(a).isSame(moment(b), "date");
}
const checkInInfoInit = {
  id: "NULL",
  checkinImage: "NULL",
  checkinLatitude: "NULL",
  checkinLongitude: "NULL",
  checkoutImage: "NULL",
  checkoutLatitude: "NULL",
  checkoutLongitude: "NULL",
  checkInTime: new Date(Date.now()),
  checkOutTime: new Date(Date.now()),
  userId: "NULL",
};
const ReactCalendar = () => {
  const dispatch = useDispatch();
  const { isShowing, toggle } = UseModal();
  const [curDate, setCurDate] = useState(new Date());
  const [loadingInfo, setLoadingInfo] = useState(false);
  const [data, setData] = useState({
    accepted: [],
    denied: [],
    approved: [],
  });
  const [checkInInfo, setCheckInInfo] = useState();
  const tickets = useSelector(selectTickets);

  function tileClassName({ date, view }) {
    // Add class to tiles in month view only
    if (view === "month") {
      // Check if a date React-Calendar wants to check is on the list of dates to add class to
      if (data.accepted.find((dDate) => isSameDay(dDate, date))) {
        return "calendar-bg-green";
      }
      if (data.denied.find((dDate) => isSameDay(dDate, date))) {
        return "calendar-bg-red";
      }
      if (data.approved) {
        if (data.approved.find((dDate) => isSameDay(dDate, date))) {
          return "calendar-bg-gray hover:text-black";
        }
      }
    }
  }
  useEffect(() => {
    const approvedDays = [];
    tickets?.forEach((ticket) => {
      const res = getDateArray(ticket);
      return approvedDays.push(...res);
    });
    setData({ ...data, approved: approvedDays });
    const getStatus = async () => {
      const res = await getCheckInStatus();
      if (res) {
        const { accepted, denied } = convertCheckInListToArray(res.data);
        setData({ ...data, accepted, denied });
      }
    };
    getStatus();
  }, [tickets]);

  useEffect(() => {
    const fetchTicketData = async () => {
      dispatch(fetchMyTickets());
    };
    fetchTicketData();
  }, [curDate]);

  // useEffect(() => {
  //   fetchCheckInInfo();
  // }, [curDate]);

  const fetchCheckInInfo = async (date) => {
    try {
      const res = await getCheckInStatus({
        fromDate: moment(date).format("YYYY-MM-DD"),
        toDate: moment(date).add(1, "d").format("YYYY-MM-DD"),
      });

      setCheckInInfo(checkInInfoFormatter(res.data[0]));
    } catch (err) {
      console.error(err);
      setCheckInInfo(undefined);
    } finally {
      setLoadingInfo(false);
    }
  };
  const noInfoCard = <div className="p-20">No Info</div>;
  const infoCard = (
    <>
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-4">
          <div>CheckIn time:</div>
          <div>{checkInInfo && checkInInfo.checkInTime}</div>
        </div>
        <div className="max-w-xs">
          <img
            src={`${process.env.APP_URL}${
              checkInInfo && checkInInfo.checkInImage
            }`}
            className="aspect-video h-full w-full object-contain"
            crossOrigin="anonymous"
          />
        </div>
      </div>

      <div className="flex flex-col items-center">
        <div className="flex items-center gap-4">
          <div>CheckOut time:</div>
          <div>
            {checkInInfo &&
              checkInInfo.checkOutImage &&
              checkInInfo.checkOutTime}
          </div>
        </div>
        <div className="max-w-xs">
          {checkInInfo && checkInInfo.checkOutImage && (
            <img
              src={`${process.env.APP_URL}${checkInInfo.checkOutImage}`}
              className="aspect-video h-full w-full object-contain"
              crossOrigin="anonymous"
            />
          )}
        </div>
      </div>
    </>
  );

  const modalContent = (
    <div className={`card `}>
      <div
        style={{
          textAlign: "left",
          display: "flex",
          flexDirection: "column",
          gap: "1em",
        }}
        className="card-body"
      >
        <div className="flex min-w-mobile flex-col items-center justify-center">
          {loadingInfo ? (
            <div className="animate-spin text-3xl">⏳</div>
          ) : checkInInfo ? (
            infoCard
          ) : (
            noInfoCard
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Calendar
        onClickDay={(day, event) => {
          setCheckInInfo(null);
          setLoadingInfo(true);
          setCurDate(day);
          fetchCheckInInfo(day);
          toggle();
        }}
        value={curDate}
        tileClassName={tileClassName}
        className="name"
      />
      <Modal isShowing={isShowing} hide={toggle}>
        {modalContent}
      </Modal>
    </>
  );
};
export default ReactCalendar;
