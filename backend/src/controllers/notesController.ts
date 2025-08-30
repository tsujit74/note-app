import { Request, Response } from "express";
import Note from "../models/Note";
import { AuthRequest } from "../middleware/authMiddleware";

// Create a note
export const createNote = async (req: AuthRequest, res: Response) => {
  const { title, content } = req.body;
  if (!title || !content)
    return res.status(400).json({ message: "Title and content are required" });

  try {
    const note = await Note.create({ user: req.userId, title, content });
    res.status(201).json(note);
  } catch (err) {
    res.status(500).json({ message: "Failed to create note", error: err });
  }
};

// Get all notes of the logged-in user
export const getNotes = async (req: AuthRequest, res: Response) => {
  try {
    const notes = await Note.find({ user: req.userId }).sort({ createdAt: -1 });
    res.status(200).json(notes);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch notes", error: err });
  }
};

// Delete a note by ID
export const deleteNote = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  try {
    const note = await Note.findOneAndDelete({ _id: id, user: req.userId });
    if (!note) return res.status(404).json({ message: "Note not found" });

    res.status(200).json({ message: "Note deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete note", error: err });
  }
};
