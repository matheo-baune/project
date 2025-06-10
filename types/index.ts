// Define the types for the gift list management application

// User model
export interface User {
  id: string;
  name: string;
  email: string;
}

// Group model
export interface Group {
  id: string;
  name: string;
  members: User[];
  createdBy: string; // User ID
}

// Event model
export interface Event {
  id: string;
  name: string;
  date: string; // ISO date string
  groupId: string;
  createdBy: string; // User ID
}

// Gift model
export interface Gift {
  id: string;
  title: string;
  link?: string;
  image?: string;
  price?: number;
  reservedBy?: string; // Name of the person who reserved the gift
  eventId: string;
  createdBy: string; // User ID
}

// Reservation model
export interface Reservation {
  giftId: string;
  reservedBy: string;
  reservedAt: string; // ISO date string
}