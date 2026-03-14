"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import TaskCard from "@/components/TaskCard";
import TaskForm from "@/components/TaskForm";

interface Task {
  _id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  createdAt: string;
}

interface TaskFormData {
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [userName, setUserName] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Filter/Search/Sort states
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        page: page.toString(),
        limit: "9",
        ...(search && { search }),
        ...(status && { status }),
        ...(priority && { priority }),
        sortBy,
        sortOrder,
      });

      const res = await fetch(`/api/tasks?${query}`);
      if (res.status === 401) {
        router.push("/login");
        return;
      }
      const data = await res.json();
      if (data.success) {
        setTasks(data.data.tasks);
        setTotalPages(data.data.pagination.totalPages);
      }
    } catch (err) {
      console.error("Failed to fetch tasks", err);
    } finally {
      setLoading(false);
    }
  }, [page, search, status, priority, sortBy, sortOrder, router]);

  const fetchUser = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setUserName(data.data.name);
        }
      }
    } catch (err) {
      console.error("Failed to fetch user", err);
    }
  }, []);

  useEffect(() => {
    fetchUser();
    fetchTasks();
  }, [fetchTasks, fetchUser]);

  const handleCreateTask = async (formData: TaskFormData) => {
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        setIsFormOpen(false);
        fetchTasks();
      } else {
        throw new Error(data.message);
      }
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to create task");
      throw err;
    }
  };

  const handleUpdateTask = async (formData: TaskFormData) => {
    if (!editingTask) return;
    try {
      const res = await fetch(`/api/tasks/${editingTask._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        setEditingTask(null);
        fetchTasks();
      } else {
        throw new Error(data.message);
      }
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to update task");
      throw err;
    }
  };

  const handleDeleteTask = async (id: string) => {
    if (confirm("Are you sure you want to delete this task?")) {
      try {
        const res = await fetch(`/api/tasks/${id}`, { method: "DELETE" });
        const data = await res.json();
        if (data.success) {
          fetchTasks();
        } else {
          throw new Error(data.message);
        }
      } catch (err: unknown) {
        alert(err instanceof Error ? err.message : "Failed to delete task");
      }
    }
  };

  const handleLogout = async () => {
    document.cookie = "token=; Max-Age=0; path=/;";
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-[#333] text-white font-sans">
      <nav className="bg-[#444] border-b border-[#555] py-4 px-6 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-lg font-bold text-indigo-400">
            {userName ? `Welcome, ${userName}` : "Welcome"}
          </h1>
          <button
            onClick={handleLogout}
            className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-red-400 hover:cursor-pointer transition-colors"
          >
            Logout
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-8 px-6">
        {/* Filters & Actions Bar */}
        <div className="bg-[#444] p-4 rounded-lg border border-[#555] mb-8 space-y-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by title..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#333] border duration-300 border-[#555] rounded py-2 px-3 text-sm text-white focus:border-indigo-500 outline-none"
              />
            </div>
            <div className="flex flex-wrap gap-3">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="bg-[#333] border border-[#555] rounded py-2 px-3 text-sm text-white duration-300 focus:border-indigo-500 outline-none"
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="bg-[#333] border border-[#555] duration-300 rounded py-2 px-3 text-sm text-white focus:border-indigo-500 outline-none"
              >
                <option value="">All Priority</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-[#333] border border-[#555] duration-300 rounded py-2 px-3 text-sm text-white focus:border-indigo-500 outline-none"
              >
                <option value="createdAt">Sort by Date</option>
                <option value="dueDate">Sort by Due Date</option>
                <option value="title">Sort by Title</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                className="bg-[#333] border border-[#555] duration-300 rounded py-2 px-3 text-sm text-white hover:bg-[#555] transition-colors"
              >
                {sortOrder === "asc" ? "↑" : "↓"}
              </button>
            </div>
          </div>
          <div className="flex justify-end pt-2 border-t border-[#555]">
            <button
              onClick={() => setIsFormOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-700 hover:shadow-xl text-white text-xs font-black uppercase tracking-widest py-2.5 px-6 hover:cursor-pointer rounded shadow-sm transition-all"
            >
              Add New Task
            </button>
          </div>
        </div>

        {/* Task Form Modal */}
        {(isFormOpen || editingTask) && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 overflow-y-auto">
            <TaskForm
              initialData={editingTask || undefined}
              onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
              onCancel={() => {
                setIsFormOpen(false);
                setEditingTask(null);
              }}
            />
          </div>
        )}

        {/* Tasks Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="text-indigo-400 font-bold uppercase animate-pulse">
              Loading Tasks...
            </div>
          </div>
        ) : tasks.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onEdit={(t) => setEditingTask(t)}
                  onDelete={handleDeleteTask}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center items-center gap-4">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="px-4 py-2 border border-[#555] rounded text-xs font-bold uppercase text-gray-400 hover:text-white hover:bg-[#444] disabled:opacity-30 transition-all"
                >
                  Prev
                </button>
                <span className="text-xs font-bold uppercase text-gray-500">
                  {page} / {totalPages}
                </span>
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-4 py-2 border border-[#555] rounded text-xs font-bold uppercase text-gray-400 hover:text-white hover:bg-[#444] disabled:opacity-30 transition-all"
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20 bg-[#444] rounded-lg border border-[#555]">
            <p className="text-gray-400 font-bold uppercase text-sm">
              No tasks found
            </p>
            <button
              onClick={() => setIsFormOpen(true)}
              className="mt-4 text-indigo-400 hover:text-indigo-300 font-bold uppercase text-xs"
            >
              Create your first task
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
