import { useMutation, useQuery } from "@tanstack/react-query";
import { TicketService } from "./ticket.service";

import {
  AdminTicketInfoFormatter,
  TicketInfoFormatter,
} from "@/utils/Formatter/TicketInfo";
import { USER_TICKET } from "@/utils/constants/react-query";

export const useGetMeTicketQuery = () => {
  return useQuery(["get-me-ticket"], () => {
    return TicketService.getMyTicket();
  });
};

export const useGetTicketQuery = (sort) => {
  return useQuery(["get-ticket", sort], () => TicketService.getTicket(sort), {
    cacheTime: 0,
    select: (tickets) =>
      tickets.map((ticket) => AdminTicketInfoFormatter(ticket)),
  });
};

export const useGetMyTicketWithSortQuery = (sortOptions) => {
  return useQuery(
    [USER_TICKET.WITH_SORT, sortOptions],
    () => TicketService.getMyTicketWithSort(sortOptions),
    {
      cacheTime: 0,
      select: ({ data, total, page, size }) => {
        const tickets = data.map((ticket) => TicketInfoFormatter(ticket));
        return { tickets, total, page, size };
      },
    }
  );
};

export const useGetTicketQueryId = (id) => {
  return useQuery(["get-ticket-id"], () => {
    return TicketService.getTicketId(id);
  });
};
export const useGetTicketTypeQuery = () => {
  return useQuery([
    "get-ticket-type",
    () => {
      return TicketService.getTicketType();
    },
  ]);
};
export const useGetTicketInfoQuery = (id) => {
  return useQuery(
    [USER_TICKET.TICKET_INFO, id],
    () => {
      return TicketService.getTicketId(id);
    },
    {
      select: (data) => TicketInfoFormatter(data),
    }
  );
};

export const useAddTicketMutation = () => {
  return useMutation((ticketInfo) => TicketService.addTicket(ticketInfo));
};
export const useUpdateTicketInfoQuery = () => {
  return useMutation((id, ticketInfo) =>
    TicketService.updateTicketInfo(id, ticketInfo)
  );
};
export const useCancelTicketMutation = () => {
  return useMutation((id) => TicketService.cancelTicket(id));
};
export const useApproveTicketMutation = () => {
  return useMutation((id) => {
    return TicketService.approveTicket(id);
  });
};

export const useRejectTicketMutation = () => {
  return useMutation((id) => {
    return TicketService.rejectTicket(id);
  });
};
export const useDeleteTicketMutation = () => {
  return useMutation((id) => {
    return TicketService.deleteTicket(id);
  });
};
