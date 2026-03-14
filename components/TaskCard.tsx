import React from 'react';

interface Task {
  _id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  createdAt: string;
}

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-600 text-white';
      case 'in-progress':
        return 'bg-blue-600 text-white';
      default:
        return 'bg-gray-600 text-white';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-400 font-bold';
      case 'medium':
        return 'text-yellow-400 font-bold';
      default:
        return 'text-green-400 font-bold';
    }
  };

  return (
    <div className="bg-[#444] rounded-lg p-5 border border-[#555] shadow-sm flex flex-col h-full hover:border-[#777] transition-colors">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-white truncate flex-1 pr-2">{task.title}</h3>
        <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${getStatusColor(task.status)}`}>
          {task.status}
        </span>
      </div>
      
      <p className="text-gray-300 text-sm mb-4 flex-1 line-clamp-3 leading-relaxed">
        {task.description}
      </p>

      <div className="space-y-2 mb-4">
        <div className="text-xs flex items-center justify-between">
          <span className="text-gray-400">Priority:</span>
          <span className={`uppercase tracking-tighter ${getPriorityColor(task.priority)}`}>
            {task.priority}
          </span>
        </div>
        {task.dueDate && (
          <div className="text-xs flex items-center justify-between">
            <span className="text-gray-400">Due:</span>
            <span className="text-white font-medium">
              {new Date(task.dueDate).toLocaleDateString()}
            </span>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center text-[10px] text-gray-500 border-t border-[#555] pt-3">
        <span>Created: {new Date(task.createdAt).toLocaleDateString()}</span>
        <div className="flex gap-4">
          <button
            onClick={() => onEdit(task)}
            className="text-indigo-400 hover:text-indigo-300 font-bold uppercase tracking-wider"
            aria-label={`Edit task ${task.title}`}
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(task._id)}
            className="text-red-400 hover:text-red-300 font-bold uppercase tracking-wider"
            aria-label={`Delete task ${task.title}`}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
