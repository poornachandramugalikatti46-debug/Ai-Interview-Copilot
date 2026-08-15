import { io } from "socket.io-client";
import { getApiOrigin } from "./api/axios";

// Create a single socket instance with stable options to avoid
// repeated connect/disconnects (HMR, tracking prevention, polling issues).
const SOCKET_URL = getApiOrigin();

export const socket = io(SOCKET_URL, {
	path: "/socket.io",
	transports: ["websocket"],
	withCredentials: true,
	// don't auto connect if you want to control lifecycle in your app
	// autoConnect: false,
	reconnectionAttempts: 5,
	reconnectionDelay: 1000,
});