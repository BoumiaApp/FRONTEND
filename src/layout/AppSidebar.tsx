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
    icon: <GridIcon />,
    name: "New Sale",
    path: "/newSale",
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
    <div className="flex flex-col h-full bg-gray-100 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700">
      {/* Sidebar Header */}
      <div className="flex items-center justify-center h-16 bg-gray-200 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-600">
        <h1 className="text-lg font-bold text-gray-800 dark:text-white">
          Boumia Admin
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          // Skip admin-only items for non-admin users
          if (item.adminOnly && !isAdmin) {
            return null;
          }

          const isActive = location.pathname === item.path;

          return (
            <div key={item.name}>
              <a
                href={item.path}
                className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-blue-500 text-white"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="text-sm font-medium">{item.name}</span>
              </a>
            </div>
          );
        })}
      </nav>


    </div>
  );
}
