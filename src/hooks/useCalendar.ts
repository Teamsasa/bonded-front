import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../api/apiClient";
import { Calendar, Event } from "../types";

export const useCalendar = () => {
  const queryClient = useQueryClient();

  const getUserCalendars = (userId: string) => {
    return useQuery({
      queryKey: ["calendars", userId],
      queryFn: async () => {
        const { data } = await apiClient.get<Calendar[]>(
          `/calendar/list/${userId}`,
        );
        return data;
      },
    });
  };

  const createCalendar = useMutation({
    mutationFn: async ({
      userId,
      data,
    }: {
      userId: string;
      data: Partial<Calendar>;
    }) => {
      return apiClient.post(`/calendar/create/${userId}`, data);
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
          "/calendar/public/list",
        );
        return data;
      },
    });
  };

  return {
    getUserCalendars,
    createCalendar,
    getCalendarEvents,
    createEvent,
    getPublicCalendars,
  };
};
