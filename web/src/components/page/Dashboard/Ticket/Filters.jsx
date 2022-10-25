import React, { useState } from "react";
import { Select } from "antd";
import { ALL_TICKET_TYPES } from "@/utils/constants/ticket_constants";

const DesktopFilter = (props) => {
  const ticketTypes = ALL_TICKET_TYPES;

  const [data, setData] = useState({
    title: "",
    type: "",
    status: "",
  });

  const handleChange = (key, value) => {
    setData({ ...data, [key]: value });
  };
  const submit = () => {
    props.onSubmit(data);
  };
  return (
    <div className={`flex bg-white py-4 ${props.className}`}>
      <div className="flex w-full flex-row justify-between gap-4">
        <div className="flex flex-row gap-8">
          {/* <div className="flex items-center w-auto gap-4">
            <div className="w-auto">Title:</div>
            <input
              name="title"
              placeholder="Title"
              value={data.title}
              onChange={(e) => handleChange("title", e.target.value)}
              className="flex-1 w-full max-w-xs p-2 border rounded-3xl input input-bordered focus:outline-none"
            />
          </div> */}
          <div className="mx-auto flex w-[92%] items-center rounded-full border bg-slate-50 hover:shadow-md md:w-full">
            <input
              className="w-full rounded-full bg-transparent py-[10px] pl-4 outline-none"
              type="text"
              name="title"
              placeholder="Title"
              value={data.title}
              onChange={(e) => handleChange(e)}
            />
          </div>

          {/* <div className="flex items-center w-auto gap-4">
            <div className="w-auto">Type:</div>
            <select
              onChange={(e) => {
                handleChange("type", e.target.value);
              }}
              style={{ flex: "1 0 8em", minWidth: "8em" }}
              className="flex-1 w-full max-w-xs rounded-3xl select select-bordered focus:border-none"
            >
              {ticketTypes &&
                ticketTypes.map((e, i) => (
                  <option key={i} value={e.value}>
                    {e.label}
                  </option>
                ))}
            </select>
          </div> */}
          <div className="mr-[-6rem] flex flex-row items-center justify-between">
            <div className="flex w-80 flex-1 items-center gap-4">
              <div className="w-auto">Type:</div>
              <select
                value={data.type}
                onChange={(e) => {
                  // const e = { target: { name: "status", value: value } };
                  // handleChange(e);
                  handleChange("status", e.target.value);
                  console.log(e.target.value);
                }}
                className="select select-bordered select-md w-40 max-w-xs rounded-3xl focus:border-none"
              >
                {ticketTypes &&
                  ticketTypes.map((e, i) => (
                    <option
                      key={i}
                      value={e.value}
                      className="flex justify-between"
                    >
                      {e.label}
                    </option>
                  ))}
              </select>
            </div>
          </div>
          <div className="flex flex-row items-center justify-between">
            <div className="flex w-80 flex-1 items-center gap-4">
              <div className="w-auto">Status:</div>
              <select
                value={data.status}
                onChange={(e) => {
                  // const e = { target: { name: "status", value: value } };
                  // handleChange(e);
                  handleChange("status", e.target.value);
                }}
                className="select select-bordered select-md w-40 max-w-xs rounded-3xl focus:border-none"
              >
                {status.map((e, i) => (
                  <option
                    key={i}
                    value={e.value}
                    className="flex justify-between"
                  >
                    {e.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="flex items-center text-right ">
          <button
            className="v-btn-primary"
            onClick={() => {
              submit();
            }}
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};
const MobileFilter = (props) => {
  const [usingFilter, setUsingFilter] = useState(false);
  const [ticketTypes, setTicketTypes] = useState(ALL_TICKET_TYPES);
  const [data, setData] = useState({
    title: "",
    type: "",
    status: "",
  });

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };
  const submit = () => {
    props.onSubmit(data);
  };
  return (
    <div className={`bg-smoke p-4  ${props.className}`}>
      {usingFilter && (
        <div className="flex flex-col gap-4 ">
          <div className="flex flex-col gap-4">
            <div className="flex w-full items-center">
              <div className="w-20 ">Title:</div>
              <input
                placeholder="Title"
                name="title"
                value={data.title}
                // onChange={filter}
                // style={{ flex: "1 0 5em" }}
                className="input-xs flex-1 rounded-3xl border border-gray-200 p-4 focus:outline-none"
                onChange={(e) => handleChange(e)}
              />
            </div>

            {/* Filter by type */}
            <div className="flex w-full items-center">
              <div className="w-20">Type:</div>
              <select
                name="type"
                value={data.type}
                style={{ flex: "1 0 8em", minWidth: "8em" }}
                className="flex-1 rounded-3xl border border-gray-200 p-1 focus:outline-none"
                onChange={(value, option) => {
                  const e = { target: { name: "type", value: value } };
                  handleChange(e);
                }}
              >
                {ALL_TICKET_TYPES.map((ticketType) => (
                  <option key={ticketType.value} value={ticketType.value}>
                    {ticketType.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col items-center justify-between gap-4">
              <div className="flex w-full flex-1 items-center">
                <div className="w-20">Status:</div>
                <select
                  name="status"
                  // defaultValue="all"
                  value={data.status}
                  className="flex-1 rounded-3xl border border-gray-200 p-1 focus:outline-none"
                  onChange={(value, option) => {
                    const e = { target: { name: "status", value: value } };
                    handleChange(e);
                  }}
                >
                  {status.map((e) => (
                    <option key={e} value={e.value}>
                      {e.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className="text-right ">
            <button
              className="v-btn-primary"
              onClick={() => {
                submit();
                setUsingFilter(!usingFilter);
              }}
            >
              Apply
            </button>
          </div>
        </div>
      )}

      {!usingFilter && (
        <div className="text-center">
          <button
            className="v-btn-primary"
            onClick={() => setUsingFilter(!usingFilter)}
          >
            Filter
          </button>
        </div>
      )}
    </div>
  );
};
export { DesktopFilter, MobileFilter };
const status = [
  {
    label: (
      <div className="flex justify-between gap-1">
        <div className="">All</div>
        <div className=""></div>
      </div>
    ),
    value: "",
  },
  {
    label: (
      <div className="flex justify-between gap-1">
        <div className="">Approved</div>
        <div className="">🟢</div>
      </div>
    ),
    value: "approved",
  },
  {
    label: (
      <div className="flex justify-between gap-1">
        <div className="">Pending</div>
        <div className="">🟡</div>
      </div>
    ),
    value: "pending",
  },
  {
    label: (
      <div className="flex justify-between gap-1">
        <div className="">Rejected</div>
        <div className="">🔴</div>
      </div>
    ),
    value: "rejected",
  },
  {
    label: (
      <div className="flex justify-between gap-1">
        <div className="">Cancelled</div>
        <div className="">⚪</div>
      </div>
    ),
    value: "cancelled",
  },
];
