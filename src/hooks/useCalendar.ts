import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../api/apiClient";
import { Calendar, Event } from "../types";

export const useCalendar = () => {
  const queryClient = useQueryClient();

  const getUserCalendars = () => {
    return useQuery({
      queryKey: ["calendars"],
      queryFn: async () => {
        const { data } = await apiClient.get<Calendar[]>("/calendar/list");
        return data;
      },
    });
  };

  const createCalendar = useMutation({
    mutationFn: async (data: Partial<Calendar>) => {
      return apiClient.post("/calendar/create", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["calendars"] });
    },
  });

  const getCalendarEvents = (calendarId: string) => {
    return useQuery({
      queryKey: ["events", calendarId],
      queryFn: async () => {
        const { data } = await apiClient.get<Event[]>(
          `/event/list/${calendarId}`,
        );
        return data;
      },
    });
  };

  const createEvent = useMutation({
    mutationFn: async ({
      calendarId,
      data,
    }: {
      calendarId: string;
      data: Partial<Event>;
    }) => {
      return apiClient.post(`/event/create/${calendarId}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });

  const getPublicCalendars = () => {
    return useQuery({
      queryKey: ["public-calendars"],
      queryFn: async () => {
        const { data } = await apiClient.get<Calendar[]>(
          "/calendar/list/public",
        );
        return data;
      },
    });
  };

  const followCalendar = useMutation({
    mutationFn: async (calendarId: string) => {
      return apiClient.put("/calendar/follow", { calendarId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["calendars"] });
    },
  });

  const unfollowCalendar = useMutation({
    mutationFn: async (calendarId: string) => {
      return apiClient.delete("/calendar/unfollow", {
        data: { calendarId },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["calendars"] });
    },
  });

  const editCalendar = useMutation({
    mutationFn: async ({
      calendarId,
      data,
    }: {
      calendarId: string;
      data: Partial<Calendar>;
    }) => {
      return apiClient.put(`/calendar/edit/${calendarId}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["calendars"] });
    },
  });

  const editEvent = useMutation({
    mutationFn: async ({
      calendarId,
      data,
    }: {
      calendarId: string;
      data: Partial<Event>;
    }) => {
      return apiClient.put(`/calendar/${calendarId}/event`, data);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["events", variables.calendarId],
      });
    },
  });

  const deleteEvent = useMutation({
    mutationFn: async ({
      calendarId,
      eventId,
    }: {
      calendarId: string;
      eventId: string;
    }) => {
      return apiClient.delete("/event/delete", {
        data: { calendarId, eventId },
      });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["events", variables.calendarId],
      });
    },
  });

  const createDefaultCalendar = useMutation({
    mutationFn: async (userName: string) => {
      return apiClient.post("/calendar/create", {
        name: `${userName}のカレンダー`,
        ownerName: userName,
        isPublic: false,
        users: [],
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["calendars"] });
    },
  });

  return {
    getUserCalendars,
    createCalendar,
    getCalendarEvents,
    createEvent,
    getPublicCalendars,
    followCalendar,
    unfollowCalendar,
    editCalendar,
    editEvent,
    deleteEvent,
    createDefaultCalendar,
  };
};
