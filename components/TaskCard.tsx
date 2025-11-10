"use client";

import { Task } from "@/types/task";
import Link from "next/link";

interface TaskCardProps {
  task: Task;
}

export default function TaskCard({ task }: TaskCardProps) {
  const now = new Date();
  let isOverdue = false;

  if (task.due_date) {
    const due = new Date(task.due_date);
    due.setHours(23, 59, 59, 999);
    isOverdue = now > due && task.status !== "done";
  }
  const isDone = task.status === "done";

  const priorityConfig = {
    low: { border: "border-l-green-400", badge: "bg-green-50 text-green-700" },
    medium: { border: "border-l-yellow-400", badge: "bg-yellow-50 text-yellow-700" },
    high: { border: "border-l-red-400", badge: "bg-red-50 text-red-700" },
  };

  const statusConfig = {
    todo: { badge: "bg-gray-100 text-gray-700" },
    "in-progress": { badge: "bg-blue-100 text-blue-700" },
    done: { badge: "bg-green-100 text-green-700" },
  };

  return (
    <Link href={`/tasks/${task.id}`}>
      <div
        className={`group bg-white rounded-xl border border-gray-100 hover:border-gray-200 shadow-sm hover:shadow-md transition-all p-5 cursor-pointer border-l-4 ${
          priorityConfig[task.priority].border
        } ${isOverdue ? "bg-amber-50" : ""}`}
      >
        {/* Title */}
        <h3
          className={`font-semibold text-lg mb-2 group-hover:text-blue-600 transition-colors ${
            isDone ? "line-through text-gray-400" : "text-gray-900"
          }`}
        >
          {task.title}
        </h3>

        {/* Description */}
        {task.description && (
          <p
            className={`text-sm mb-4 line-clamp-2 ${
              isDone ? "line-through text-gray-400" : "text-gray-600"
            }`}
          >
            {task.description}
          </p>
        )}

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span
            className={`px-2.5 py-1 rounded-md text-xs font-medium ${
              statusConfig[task.status].badge
            }`}
          >
            {task.status === "in-progress" ? "In Progress" : task.status.charAt(0).toUpperCase() + task.status.slice(1)}
          </span>
          <span
            className={`px-2.5 py-1 rounded-md text-xs font-medium ${
              priorityConfig[task.priority].badge
            }`}
          >
            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
          </span>
        </div>

        {/* Due date */}
        {task.due_date && (
          <div className="flex items-center gap-2 text-xs">
            <svg
              className={`w-4 h-4 ${isOverdue ? "text-red-500" : "text-gray-400"}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className={isOverdue ? "text-red-600 font-medium" : "text-gray-500"}>
              {new Date(task.due_date).toLocaleDateString()}
              {isOverdue && " - Overdue"}
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}