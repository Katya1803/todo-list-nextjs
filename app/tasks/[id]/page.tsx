"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Task } from "@/types/task";
import { database } from "@/lib/database";
import BackButton from "@/components/BackButton";
import ConfirmDialog from "@/components/ConfirmDialog";
import { ProtectedRoute } from "@/components/ProtectedRoute";

function TaskDetailPageContent() {
  const router = useRouter();
  const params = useParams();
  const taskId = params.id as string;

  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  useEffect(() => {
    loadTask();
  }, [taskId]);

  const loadTask = async () => {
    try {
      const data = await database.getTask(taskId);
      setTask(data);
    } catch (err) {
      console.error("Error loading task:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await database.deleteTask(taskId);
      router.push("/");
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  const handleToggleStatus = async () => {
    if (!task) return;
    const newStatus = task.status === "done" ? "todo" : "done";
    
    try {
      await database.updateTask(taskId, { status: newStatus });
      const updatedTask = await database.getTask(taskId);
      setTask(updatedTask);
    } catch (err) {
      console.error("Error updating task:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <BackButton />
          </div>
        </header>
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Task Not Found</h2>
            <p className="text-gray-600">The task you're looking for doesn't exist.</p>
          </div>
        </main>
      </div>
    );
  }

  const isOverdue = task.due_date && new Date(task.due_date) < new Date() && task.status !== "done";
  const isDone = task.status === "done";

  const priorityConfig = {
    low: { bg: "bg-green-50", text: "text-green-700", border: "border-green-200" },
    medium: { bg: "bg-yellow-50", text: "text-yellow-700", border: "border-yellow-200" },
    high: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200" },
  };

  const statusConfig = {
    todo: { bg: "bg-gray-50", text: "text-gray-700" },
    "in-progress": { bg: "bg-blue-50", text: "text-blue-700" },
    done: { bg: "bg-green-50", text: "text-green-700" },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ConfirmDialog
        isOpen={isConfirmOpen}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setIsConfirmOpen(false)}
      />

      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <BackButton />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Header Section */}
          <div className={`p-8 ${isOverdue ? "bg-amber-50" : ""}`}>
            <div className="flex items-start justify-between mb-4">
              <h1
                className={`text-3xl font-bold ${
                  isDone ? "line-through text-gray-400" : "text-gray-900"
                }`}
              >
                {task.title}
              </h1>
              <button
                onClick={handleToggleStatus}
                className={`p-2 rounded-lg transition-colors ${
                  isDone
                    ? "bg-green-100 text-green-600 hover:bg-green-200"
                    : "bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-green-600"
                }`}
                title={isDone ? "Mark as incomplete" : "Mark as done"}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </button>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-3">
              <span
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  statusConfig[task.status].bg
                } ${statusConfig[task.status].text}`}
              >
                {task.status === "in-progress"
                  ? "In Progress"
                  : task.status.charAt(0).toUpperCase() + task.status.slice(1)}
              </span>
              <span
                className={`px-4 py-2 rounded-lg text-sm font-medium border ${
                  priorityConfig[task.priority].bg
                } ${priorityConfig[task.priority].text} ${priorityConfig[task.priority].border}`}
              >
                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
              </span>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-8 space-y-8">
            {/* Description */}
            {task.description && (
              <div>
                <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
                  Description
                </h2>
                <p
                  className={`text-gray-700 leading-relaxed ${
                    isDone ? "line-through text-gray-400" : ""
                  }`}
                >
                  {task.description}
                </p>
              </div>
            )}

            {/* Metadata Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Due Date */}
              {task.due_date && (
                <div>
                  <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
                    Due Date
                  </h2>
                  <div className="flex items-center gap-2">
                    <svg
                      className={`w-5 h-5 ${isOverdue ? "text-red-500" : "text-gray-400"}`}
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
                    <span className={`text-gray-900 ${isOverdue ? "text-red-600 font-medium" : ""}`}>
                      {new Date(task.due_date).toLocaleDateString()}
                      {isOverdue && " (Overdue)"}
                    </span>
                  </div>
                </div>
              )}

              {/* Created Date */}
              <div>
                <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
                  Created
                </h2>
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-gray-900">
                    {new Date(task.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-gray-50 px-8 py-6 flex gap-3">
            <Link
              href={`/edit/${task.id}`}
              className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium text-center"
            >
              Edit Task
            </Link>
            <button
              onClick={() => setIsConfirmOpen(true)}
              className="flex-1 px-6 py-3 bg-white border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-medium"
            >
              Delete Task
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function TaskDetailPage() {
  return (
    <ProtectedRoute>
      <TaskDetailPageContent />
    </ProtectedRoute>
  );
}