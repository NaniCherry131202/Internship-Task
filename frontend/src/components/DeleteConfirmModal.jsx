import React from 'react';

const DeleteConfirmModal = ({ onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="delete-modal bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-lg shadow-lg transform transition-all duration-300 hover:shadow-2xl hover:shadow-purple-200">
        <h2 className="text-xl font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
          Are you sure you want to delete this task?
        </h2>
        <div className="flex space-x-4">
          <button
            onClick={onConfirm}
            className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-full hover:from-red-400 hover:to-pink-400 transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95"
          >
            Delete
          </button>
          <button
            onClick={onCancel}
            className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 text-white px-4 py-2 rounded-full hover:from-gray-400 hover:to-gray-500 transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;