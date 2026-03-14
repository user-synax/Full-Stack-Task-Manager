'use client';

import React, { useState } from 'react';

interface TaskFormProps {
  initialData?: {
    _id?: string;
    title: string;
    description: string;
    status: 'pending' | 'in-progress' | 'completed';
    priority?: 'low' | 'medium' | 'high';
    dueDate?: string;
  };
  onSubmit: (data: {
    title: string;
    description: string;
    status: 'pending' | 'in-progress' | 'completed';
    priority: 'low' | 'medium' | 'high';
    dueDate: string;
  }) => Promise<void>;
  onCancel: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    status: initialData?.status || 'pending',
    priority: initialData?.priority || 'medium',
    dueDate: initialData?.dueDate ? new Date(initialData.dueDate).toISOString().split('T')[0] : '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await onSubmit(formData);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-[#444] rounded-lg p-6 border border-[#555] shadow-lg max-w-lg w-full">
      <h2 className="text-xl font-bold mb-6 text-white border-b border-[#555] pb-2">
        {initialData?._id ? 'Edit Task' : 'New Task'}
      </h2>
      
      {error && (
        <div className="bg-red-900/50 text-red-200 p-3 rounded mb-6 text-sm border border-red-700">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-xs font-bold uppercase text-gray-400 mb-1">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="block w-full bg-[#333] border border-[#555] rounded py-2 px-3 text-white focus:border-indigo-500 outline-none"
            placeholder="e.g. Finish project documentation"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-xs font-bold uppercase text-gray-400 mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            value={formData.description}
            onChange={handleChange}
            required
            className="block w-full bg-[#333] border border-[#555] rounded py-2 px-3 text-white focus:border-indigo-500 outline-none"
            placeholder="Add some details..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="status" className="block text-xs font-bold uppercase text-gray-400 mb-1">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="block w-full bg-[#333] border border-[#555] rounded py-2 px-3 text-white focus:border-indigo-500 outline-none"
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div>
            <label htmlFor="priority" className="block text-xs font-bold uppercase text-gray-400 mb-1">
              Priority
            </label>
            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="block w-full bg-[#333] border border-[#555] rounded py-2 px-3 text-white focus:border-indigo-500 outline-none"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="dueDate" className="block text-xs font-bold uppercase text-gray-400 mb-1">
            Due Date (Optional)
          </label>
          <input
            type="date"
            id="dueDate"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            className="block w-full bg-[#333] border border-[#555] rounded py-2 px-3 text-white focus:border-indigo-500 outline-none [color-scheme:dark]"
          />
        </div>
      </div>

      <div className="mt-8 flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-[#555] rounded text-sm font-bold uppercase text-gray-400 hover:text-white transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-indigo-600 rounded text-sm font-bold uppercase text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-sm"
        >
          {loading ? 'Saving...' : 'Save Task'}
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
