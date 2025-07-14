// Define the types for the gift list management application

// User model
export interface User {
    id: string;
    firstname: string;
    lastname: string;
    username: string;
    email: string;
    avatar?: string; // URL to the user's avatar image
    isAdmin?: boolean; // Flag to indicate if user has admin privileges
    createdAt?: string; // ISO date string for when the user was created
}

// Group model
export interface Group {
    id: string;
    name: string;
    members: User[];
    createdBy: string; // User ID
    background?: string; // URL to the group's background image
}

// Event model
export interface Event {
    id: string;
    name: string;
    date: string; // ISO date string
    groupId: string;
    createdBy: string; // User ID
    background?: string; // URL to the event's background image
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
    createdAt: string;
}

// Reservation model
export interface Reservation {
    giftId: string;
    reservedBy: string;
    reservedAt: string; // ISO date string
}
