import type { MenuItem } from "@/interface/types";
import {
	mdiViewDashboard,
	mdiAccountGroup,
	mdiCarSide,
	mdiMapMarkerPath,
	mdiStar,
	mdiTicket,
	mdiMessageText,
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
		name: "Quản lý Người dùng",
		path: "/admin/users",
		icon: mdiAccountGroup,
	},
	{
		id: "drivers",
		name: "Quản lý Tài xế",
		path: "/admin/drivers",
		icon: mdiCarSide,
	},
	{
		id: "rides",
		name: "Quản lý chuyến",
		path: "/admin/rides",
		icon: mdiMapMarkerPath,
	},
	{
		id: "ratings",
		name: "Quản lý đánh giá",
		path: "/admin/ratings",
		icon: mdiStar,
	},
	{
		id: "promo-codes",
		name: "Quản lý mã giảm giá",
		path: "/admin/promo-codes",
		icon: mdiTicket,
	},
	{
		id: "tickets",
		name: "Hỗ trợ khách hàng",
		path: "/admin/tickets",
		icon: mdiMessageText,
	},
];
