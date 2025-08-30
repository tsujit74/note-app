import NoteCard from "./NoteCard";

interface Note {
  _id: string;
  title: string;
  content: string;
}

interface NoteListProps {
  notes: Note[];
  onDelete: (id: string) => void;
}

export default function NoteList({ notes, onDelete }: NoteListProps) {
  if (notes.length === 0)
    return <p className="mt-4 text-gray-500">No notes added yet.</p>;

  return (
    <div className="mt-4 space-y-3">
      {notes.map((note) => (
        <NoteCard
          key={note._id}
          title={note.title}
          content={note.content}
          onDelete={() => onDelete(note._id)}
        />
      ))}
    </div>
  );
}
