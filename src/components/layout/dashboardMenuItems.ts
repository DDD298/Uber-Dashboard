import type { MenuItem } from "@/interface/types";
import {
	mdiViewDashboard,
	mdiAccountGroup,
	mdiCarSide,
	mdiMapMarkerPath,
	mdiStar,
	mdiAlertCircle,
	mdiTicket,
	mdiCog
} from "@mdi/js";

export const getDashboardMenuItems = (): MenuItem[] => [
	{
		id: "dashboard",
		name: "Dashboard",
		path: "/admin",
		icon: mdiViewDashboard,
	},
	{
		id: "users",
		name: "Users",
		path: "/admin/users",
		icon: mdiAccountGroup,
	},
	{
		id: "drivers",
		name: "Drivers",
		path: "/admin/drivers",
		icon: mdiCarSide,
	},
	{
		id: "rides",
		name: "Rides",
		path: "/admin/rides",
		icon: mdiMapMarkerPath,
	},
	{
		id: "ratings",
		name: "Ratings",
		path: "/admin/ratings",
		icon: mdiStar,
	},
	{
		id: "warnings",
		name: "Warnings",
		path: "/admin/warnings",
		icon: mdiAlertCircle,
	},
	{
		id: "tickets",
		name: "Support Tickets",
		path: "/admin/tickets",
		icon: mdiTicket,
	},
	{
		id: "settings",
		name: "Settings",
		path: "/admin/settings",
		icon: mdiCog,
	},
];
