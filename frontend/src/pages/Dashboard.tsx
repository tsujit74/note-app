import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useApi } from "../api/api";
import NoteForm from "../components/NoteForm";
import NoteList from "../components/NoteList";
import { useError } from "../contexts/ErrorContext";
import { useSuccess } from "../contexts/SuccessContext";
import { useAuth } from "../contexts/AuthContext";

interface Note {
  _id: string;
  title: string;
  content: string;
}

export default function Dashboard() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [name, setName] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const api = useApi();
  const { token, clearToken } = useAuth();
  const navigate = useNavigate();
  const { setErrors } = useError();
  const { addSuccess } = useSuccess();

  // Fetch user info & notes once on mount
  useEffect(() => {
    if (!token) {
      setErrors(["You must be logged in."]);
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const [notesRes, userRes] = await Promise.all([
          api.get("/notes"),
          api.get("/user/me"),
        ]);
        setNotes(notesRes.data || []);
        setName(userRes.data?.name || null);
        setEmail(userRes.data?.email || null);
      } catch (err: any) {
        setErrors([err.response?.data?.message || "Failed to fetch dashboard data."]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // Run only once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addNote = async (title: string, content: string) => {
    if (!title || !content) return setErrors(["Title and content required"]);
    try {
      const res = await api.post("/notes", { title, content });
      setNotes(prev => [...prev, res.data]);
      addSuccess("Note added");
    } catch (err: any) {
      setErrors([err.response?.data?.message || "Failed to add note"]);
    }
  };

  const deleteNote = async (id: string) => {
    try {
      await api.delete(`/notes/${id}`);
      setNotes(prev => prev.filter(n => n._id !== id));
      addSuccess("Note deleted");
    } catch (err: any) {
      setErrors([err.response?.data?.message || "Failed to delete note"]);
    }
  };

  const logout = () => {
    clearToken();
    addSuccess("Logged out");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <button
          onClick={logout}
          className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
        >
          Logout
        </button>
      </header>

      {/* User Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white p-6 rounded-2xl shadow-lg mb-6"
      >
        {loading ? (
          <p className="text-gray-500">Loading user info...</p>
        ) : (
          <>
            <h2 className="text-xl sm:text-2xl font-bold mb-1">
              Welcome, {name || "User"}!
            </h2>
            {email && <p className="text-gray-600">Email: {email}</p>}
          </>
        )}
      </motion.div>

      {/* Notes */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {loading ? (
          <p className="text-gray-500">Loading notes...</p>
        ) : (
          <>
            <NoteForm onAdd={addNote} />
            <NoteList notes={notes} onDelete={deleteNote} />
          </>
        )}
      </motion.div>
    </div>
  );
}
