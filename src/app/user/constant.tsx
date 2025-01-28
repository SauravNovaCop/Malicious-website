import {
  HomeIcon,
  Car,
  User,
  FileText,
  Settings,
  CreditCard,
  History,
} from "lucide-react";
import { SideNavItem } from "@/types/types";

export const SIDENAV_ITEMS: SideNavItem[] = [
  {
    title: "Home",
    path: "/user/dashboard",
    icon: <HomeIcon width="24" height="24" />,
  },
  {
    title: "Profile",
    path: "/user/profile",
    icon: <User width="24" height="24" />,
  },
  {
    title: "History",
    path: "/user/history",
    icon: <History width="24" height="24" />,
  },
];
