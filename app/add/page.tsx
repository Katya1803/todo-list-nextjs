"use client";

import { useRouter } from "next/navigation";
import { TaskFormData } from "@/types/task";
import { database } from "@/lib/database";
import TaskForm from "@/components/TaskForm";
import BackButton from "@/components/BackButton";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useState } from "react";

function AddTaskPageContent() {
  const router = useRouter();
  const [error, setError] = useState("");

  const handleSubmit = async (formData: TaskFormData) => {
    try {
      await database.addTask(formData);
      router.push("/");
    } catch (err: any) {
      setError(err.message || "Failed to create task");
      console.error("Error creating task:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <BackButton />
          <h1 className="text-3xl font-bold text-gray-900 mt-4">Create New Task</h1>
          <p className="text-gray-600 mt-1">Add a new task to your list</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <TaskForm onSubmit={handleSubmit} />
        </div>
      </main>
    </div>
  );
}

export default function AddTaskPage() {
  return (
    <ProtectedRoute>
      <AddTaskPageContent />
    </ProtectedRoute>
  );
}