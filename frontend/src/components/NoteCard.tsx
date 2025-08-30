import React from "react";

interface NoteCardProps {
  title: string;
  content: string;
  onDelete: () => void;
}

const NoteCard: React.FC<NoteCardProps> = ({ title, content, onDelete }) => {
  return (
    <div className="border rounded-lg p-4 shadow-md bg-white flex justify-between items-start">
      <div>
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-gray-700">{content}</p>
      </div>
      <button
        onClick={onDelete}
        className="ml-4 bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
      >
        Delete
      </button>
    </div>
  );
};

export default NoteCard;
