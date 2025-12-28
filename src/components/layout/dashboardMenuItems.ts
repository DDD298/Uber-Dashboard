import type { MenuItem } from "@/interface/types";
import {
	mdiViewDashboard,
	mdiAccountGroup,
	mdiSchool,
	mdiAlphaTCircle
} from "@mdi/js";

export const getDashboardMenuItems = (): MenuItem[] => [
	{
		id: "dashboard",
		name: "Overview",
		path: "/admin",
		icon: mdiViewDashboard,
	},
	{
		id: "user-management",
		name: "User Management",
		path: "/admin/users",
		icon: mdiAccountGroup,
	},
	{
		id: "department-management",
		name: "Department Management",
		path: "/admin/departments",
		icon: mdiSchool,
	},
	{
		id: "topic-management",
		name: "Topic Management",
		path: "/admin/topics",
		icon: mdiAlphaTCircle,
	},
];
