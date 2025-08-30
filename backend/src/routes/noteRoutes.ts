import express from "express";
import { createNote, getNotes, deleteNote } from "../controllers/notesController";

const router = express.Router();

// All routes are protected by authMiddleware in index.ts
router.post("/", createNote);      // Create a new note
router.get("/", getNotes);         // Get all notes of logged-in user
router.delete("/:id", deleteNote); // Delete a note by ID

export default router;
