import type { Feature } from "./types";
import { BuildingIcon, CpuIcon } from "../icons/icons";

export const PARKING_IMG = "https://images.unsplash.com/photo-1715079166936-1577f93c44fc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080";

export const FEATURES: Feature[] = [
  {
    description: "Track parking availability instantly with IoT sensors",
    icon: <CpuIcon />,
    title: "Real-time Monitoring",
  },
  {
    description: "Easy access for building residents to manage slots",
    icon: <BuildingIcon />,
    title: "Resident Portal",
  },
];
export const ADMIN_EMAIL = String(
  import.meta.env.VITE_ADMIN_EMAIL ?? "admin@unosquare.com",
);
