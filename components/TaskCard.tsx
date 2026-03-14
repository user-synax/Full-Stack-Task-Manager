import React from 'react';

interface Task {
  _id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
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
        return 'bg-green-500/10 text-green-400 border border-green-500/20';
      case 'in-progress':
        return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
      default:
        return 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20';
    }
  };

  return (
    <div className="bg-gray-900 shadow-xl rounded-xl p-6 border border-gray-800 hover:border-gray-700 transition-colors">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-white truncate flex-1">{task.title}</h3>
        <span className={`px-2 py-0.5 rounded text-xs font-medium uppercase tracking-wider ${getStatusColor(task.status)}`}>
          {task.status}
        </span>
      </div>
      <p className="text-gray-400 mb-6 whitespace-pre-wrap line-clamp-3 text-sm leading-relaxed">{task.description}</p>
      <div className="flex justify-between items-center text-xs text-gray-500 border-t border-gray-800 pt-4">
        <span>{new Date(task.createdAt).toLocaleDateString()}</span>
        <div className="space-x-4">
          <button
            onClick={() => onEdit(task)}
            className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(task._id)}
            className="text-red-400 hover:text-red-300 font-medium transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
