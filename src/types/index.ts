export interface User {
  userId: string;
  displayName: string;
  email: string;
  accessLevel: string;
}

export interface Event {
  eventId: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  location: string;
  allDay: boolean;
}

export interface Calendar {
  calendarId: string;
  sortKey: string;
  name: string;
  isPublic: boolean;
  ownerUserId: string;
  ownerName: string;
  users: User[];
  events: Event[];
}
