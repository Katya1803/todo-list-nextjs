"use client";

import { useState, useEffect } from "react";
import { Task, Priority, Status } from "@/types/task";
import { storage } from "@/lib/storage";
import TaskCard from "@/components/TaskCard";
import FilterBar from "@/components/FilterBar";

export default function HomePage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<Status | "all">("all");
  const [priorityFilter, setPriorityFilter] = useState<Priority | "all">("all");
  const [sortBy, setSortBy] = useState<"createdAt" | "dueDate">("createdAt");

  // Load tasks from localStorage on mount
  useEffect(() => {
    const loadedTasks = storage.getTasks();
    setTasks(loadedTasks);
  }, []);

  // Filter and sort tasks
  const filteredTasks = tasks
    .filter((task) => {
      // Search filter
      const matchesSearch =
        searchText === "" ||
        task.title.toLowerCase().includes(searchText.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchText.toLowerCase());

      // Status filter
      const matchesStatus = statusFilter === "all" || task.status === statusFilter;

      // Priority filter
      const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    })
    .sort((a, b) => {
      if (sortBy === "createdAt") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else {
        // Sort by due date
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
    });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Task Manager</h1>
          <p className="text-gray-600 mt-1">Organize your work and life</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter Bar */}
        <FilterBar
          searchText={searchText}
          statusFilter={statusFilter}
          priorityFilter={priorityFilter}
          onSearchChange={setSearchText}
          onStatusFilterChange={setStatusFilter}
          onPriorityFilterChange={setPriorityFilter}
        />

        {/* Sort Options */}
        <div className="mb-6 flex items-center gap-3">
          <span className="text-sm font-medium text-gray-700">Sort by:</span>
          <button
            onClick={() => setSortBy("createdAt")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              sortBy === "createdAt"
                ? "bg-blue-500 text-white shadow-sm"
                : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
            }`}
          >
            Created Date
          </button>
          <button
            onClick={() => setSortBy("dueDate")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              sortBy === "dueDate"
                ? "bg-blue-500 text-white shadow-sm"
                : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
            }`}
          >
            Due Date
          </button>
        </div>

        {/* Task List */}
        {filteredTasks.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {tasks.length === 0 ? "No tasks yet" : "No tasks found"}
            </h3>
            <p className="text-gray-600">
              {tasks.length === 0
                ? "Create your first task to get started"
                : "Try adjusting your filters"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}