"use client";

import { Priority, Status } from "@/types/task";
import Link from "next/link";

interface FilterBarProps {
  searchText: string;
  statusFilter: Status | "all";
  priorityFilter: Priority | "all";
  onSearchChange: (text: string) => void;
  onStatusFilterChange: (status: Status | "all") => void;
  onPriorityFilterChange: (priority: Priority | "all") => void;
}

export default function FilterBar({
  searchText,
  statusFilter,
  priorityFilter,
  onSearchChange,
  onStatusFilterChange,
  onPriorityFilterChange,
}: FilterBarProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
      <div className="flex flex-col gap-6">
        {/* Search bar */}
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchText}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full px-4 py-3 pl-11 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            <svg
              className="w-5 h-5 text-gray-400 absolute left-3.5 top-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <Link
            href="/add"
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium whitespace-nowrap"
          >
            + New Task
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-3">
          {/* Status filter */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-700 min-w-[60px]">Status</span>
            <div className="flex gap-2 flex-wrap">
              {(["all", "todo", "in-progress", "done"] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => onStatusFilterChange(status)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    statusFilter === status
                      ? "bg-blue-500 text-white shadow-sm"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {status === "all"
                    ? "All"
                    : status === "in-progress"
                    ? "In Progress"
                    : status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Priority filter */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-700 min-w-[60px]">Priority</span>
            <div className="flex gap-2 flex-wrap">
              {(["all", "low", "medium", "high"] as const).map((priority) => (
                <button
                  key={priority}
                  onClick={() => onPriorityFilterChange(priority)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    priorityFilter === priority
                      ? "bg-blue-500 text-white shadow-sm"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {priority.charAt(0).toUpperCase() + priority.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}