"use client";

import { useRouter } from "next/navigation";
import { TaskFormData } from "@/types/task";
import { storage } from "@/lib/storage";
import TaskForm from "@/components/TaskForm";
import BackButton from "@/components/BackButton";

export default function AddTaskPage() {
  const router = useRouter();

  const handleSubmit = (formData: TaskFormData) => {
    const newTask = {
      id: crypto.randomUUID(),
      ...formData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    storage.addTask(newTask);
    router.push("/");
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
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <TaskForm onSubmit={handleSubmit} />
        </div>
      </main>
    </div>
  );
}