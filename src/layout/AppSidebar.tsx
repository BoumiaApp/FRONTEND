import React from "react";
import { Link, useLocation } from "react-router";
import { useAuth } from "../context/AuthContext";

import {
  GridIcon,
  UserCircleIcon,
  BoxIcon,
} from "../icons";

const navItems = [
  {
    icon: <GridIcon />,
    name: "Dashboard",
    path: "/",
  },
  {
    icon: <UserCircleIcon />,
    name: "Users",
    path: "/users",
    adminOnly: true, // Only show for admin users
  },
  {
    icon: <BoxIcon />,
    name: "Products",
    path: "/products",
  },
  {
    icon: <BoxIcon />,
    name: "Product Groups",
    path: "/product-groups",
    adminOnly: false, // Only show for admin users
  },
  {
    icon: <UserCircleIcon />,
    name: "Clients",
    path: "/clients",
  },
  {
    icon: <UserCircleIcon />,
    name: "Warehouses",
    path: "/warehouses",
  },
];

export default function AppSidebar() {
  const location = useLocation();
  const { user } = useAuth();
  const isAdmin = user?.accessLevel === 10;

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700">
      <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
        <div className="flex items-center flex-shrink-0 px-4">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
            Boumia Admin
          </h1>
        </div>
        <nav className="mt-5 flex-1 px-2 space-y-1">
          {navItems.map((item) => {
            // Skip admin-only items for non-admin users
            if (item.adminOnly && !isAdmin) {
              return null;
            }

            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive
                    ? "bg-blue-100 text-blue-900 dark:bg-blue-900/30 dark:text-blue-300"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
