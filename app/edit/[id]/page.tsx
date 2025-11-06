"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Task, TaskFormData } from "@/types/task";
import { storage } from "@/lib/storage";
import TaskForm from "@/components/TaskForm";
import BackButton from "@/components/BackButton";

export default function EditTaskPage() {
  const router = useRouter();
  const params = useParams();
  const taskId = params.id as string;

  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const tasks = storage.getTasks();
    const foundTask = tasks.find((t) => t.id === taskId);
    setTask(foundTask || null);
    setLoading(false);
  }, [taskId]);

  const handleSubmit = (formData: TaskFormData) => {
    storage.updateTask(taskId, formData);
    router.push("/");
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
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <BackButton />
          </div>
        </header>
        <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Task Not Found</h2>
            <p className="text-gray-600">The task you're looking for doesn't exist.</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <BackButton />
          <h1 className="text-3xl font-bold text-gray-900 mt-4">Edit Task</h1>
          <p className="text-gray-600 mt-1">Update your task details</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <TaskForm task={task} onSubmit={handleSubmit} />
        </div>
      </main>
    </div>
  );
}