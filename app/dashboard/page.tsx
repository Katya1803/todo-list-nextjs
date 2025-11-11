"use client";

import { useState, useEffect } from "react";
import { Task, Priority, Status } from "@/types/task";
import { database } from "@/lib/taskDatabase";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Link from "next/link";

function DashboardPageContent() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<Status | "all">("all");
  const [priorityFilter, setPriorityFilter] = useState<Priority | "all">("all");

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const data = await database.getTasks();
      setTasks(data);
    } catch (error) {
      console.error("Error loading tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Apply filters
  const filteredTasks = tasks.filter((task) => {
    const matchesStatus = statusFilter === "all" || task.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter;
    return matchesStatus && matchesPriority;
  });

  // Calculate statistics
  const stats = {
    total: filteredTasks.length,
    todo: filteredTasks.filter((t) => t.status === "todo").length,
    inProgress: filteredTasks.filter((t) => t.status === "in-progress").length,
    done: filteredTasks.filter((t) => t.status === "done").length,
    overdue: filteredTasks.filter((t) => {
    if (!t.due_date || t.status === "done") return false;
    const due = new Date(t.due_date);
    due.setHours(23, 59, 59, 999);
    return new Date() > due;
    }).length,
    high: filteredTasks.filter((t) => t.priority === "high").length,
    medium: filteredTasks.filter((t) => t.priority === "medium").length,
    low: filteredTasks.filter((t) => t.priority === "low").length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-1">Welcome, {user?.email}</p>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium transition-colors"
              >
                Task List
              </Link>
              <Link
                href="/calendar"
                className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium transition-colors"
              >
                Calendar
              </Link>
              <button
                onClick={handleSignOut}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
            
            {/* Status Filter */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-700 min-w-[60px]">Status</span>
              <div className="flex gap-2 flex-wrap">
                {(["all", "todo", "in-progress", "done"] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
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

            {/* Priority Filter */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-700 min-w-[60px]">Priority</span>
              <div className="flex gap-2 flex-wrap">
                {(["all", "low", "medium", "high"] as const).map((priority) => (
                  <button
                    key={priority}
                    onClick={() => setPriorityFilter(priority)}
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

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Tasks */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Tasks</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
          </div>

          {/* To Do */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">To Do</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.todo}</p>
              </div>
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* In Progress */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">{stats.inProgress}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Done */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Done</p>
                <p className="text-3xl font-bold text-green-600 mt-2">{stats.done}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Priority & Overdue Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Priority Breakdown */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">By Priority</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-gray-700">High</span>
                </div>
                <span className="text-2xl font-bold text-gray-900">{stats.high}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-gray-700">Medium</span>
                </div>
                <span className="text-2xl font-bold text-gray-900">{stats.medium}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700">Low</span>
                </div>
                <span className="text-2xl font-bold text-gray-900">{stats.low}</span>
              </div>
            </div>
          </div>

          {/* Overdue Tasks */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Overdue Tasks</h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-red-100 rounded-lg flex items-center justify-center">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-4xl font-bold text-red-600">{stats.overdue}</p>
                  <p className="text-sm text-gray-600 mt-1">Tasks past due date</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardPageContent />
    </ProtectedRoute>
  );
}