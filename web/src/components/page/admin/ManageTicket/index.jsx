import { useState } from "react";
import { useGetTicketQuery } from "src/rest/ticket/ticket.query";
import {
  DesktopFilter,
  MobileFilter,
} from "@/components/Common/Table/TableFilter";
import {
  ALL_TICKET_TYPES,
  STATUS_TICKET,
  TICKET_STATUS,
  TICKET_STATUS_COLOR,
} from "@/utils/constants/ticket_constants";
import Link from "next/link";

import CustomTable from "@/components/Common/Table/CustomTable";
import { useRouter } from "next/router";

const ApproveTicket = () => {
  const [filterOptions, setFilterOptions] = useState({
    search: "",
    type: "",
    status: "",
  });

  const [sortOption, setSortOption] = useState({
    sortBy: "createdAt",
    orderBy: false,
  });
  const sortOptions = `limit=10&page=1&search=${
    filterOptions.search || ""
  }&ticketType=${filterOptions.type || ""}&ticketStatus=${
    filterOptions.status || ""
  }&sortField=${sortOption.sortBy}&sortType=${sortOption.orderBy}
  `;
  const { data: Tickets } = useGetTicketQuery(sortOptions);
  const [ticketTypes, setTicketTypes] = useState(ALL_TICKET_TYPES);
  const [ticketStatus, setTicketStatus] = useState(STATUS_TICKET);
  const dataSort = [
    {
      name: "search",
      type: "input",
      style: "w-full rounded-full bg-transparent py-[10px] pl-4 outline-none",
      value: "",
      data: [],
    },
    {
      name: "type",
      type: "select",
      style: "flex flex-row items-center justify-between mr-[-6rem]",
      value: "",
      data: ticketTypes,
    },
    {
      name: "status",
      type: "select",
      style: "flex flex-row items-center justify-between",
      value: "",
      data: ticketStatus,
    },
  ];
  const router = useRouter();

  console.log(Tickets);
  const columns = [
    {
      title: "ID",
      key: "id",
      render: (obj) => {
        return (
          <Link href={`admin/ticket/${obj.id}`}>
            <div className="cursor-pointer text-blue-300">{obj.id}</div>
          </Link>
        );
      },
    },
    {
      title: "Created By",
      key: "author",
      render: (obj) => {
        return (
          <Link href={`http://localhost:3005/`}>
            <div className="cursor-pointer text-blue-300">
              {obj.author.firstName + " " + obj.author.lastName}
            </div>
          </Link>
        );
      },
    },
    {
      title: "Title",
      key: "title",
    },
    {
      title: "Type",
      key: "type",
    },
    {
      title: "Status",
      key: "status",
      render: (obj) => {
        const color = TICKET_STATUS_COLOR[obj.status.toString().toUpperCase()];
        return (
          <div
            className={`w-fit rounded-xl bg-[${color.background}] px-3 text-[${color.text}]`}
          >
            {obj.status}
          </div>
        );
      },
    },
    {
      title: "Created At",
      key: "createdAt",
      sortable: true,
    },
    {
      title: "Action",
      key: "action",
      render: (obj) => (
        <div className="flex">
          <div>
            <button
              className="v-btn-secodary"
              onClick={() => router.push(`/admin/ticket/${obj.id}`)}
            >
              Detail
            </button>
          </div>
        </div>
      ),
    },
  ];
  return (
    <div className="m-4 flex-1 flex-col gap-8">
      <div
        className="m-1 flex flex-col overflow-auto rounded-lg "
        style={{
          backgroundColor: "#fff",
          boxShadow: "10px 10px 15px -3px rgba(0,0,0,0.2)",
        }}
      >
        <div className="card-body">
          <div className="flex max-h-[56px] w-full items-center justify-between bg-white py-10">
            <div style={{ fontSize: "2em", fontWeight: "bolder" }}>
              Manager Ticket
            </div>
          </div>
          <DesktopFilter
            onSubmit={(filterOptions) => setFilterOptions(filterOptions)}
            className="hidden lg:flex"
            dataSort={dataSort}
          />
          <MobileFilter
            onSubmit={(filterOptions) => setFilterOptions(filterOptions)}
            className="lg:hidden"
            dataSort={dataSort}
          />
          {Tickets && columns && (
            <CustomTable dataSource={Tickets} columns={columns} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ApproveTicket;
