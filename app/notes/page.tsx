"use client";

import { useState, useEffect } from "react";
import { Note } from "@/types/note";
import { noteDatabase } from "@/lib/noteDatabase";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import NoteCard from "@/components/NoteCard";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Link from "next/link";

function NotesPageContent() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      const data = await noteDatabase.getNotes();
      setNotes(data);
    } catch (error) {
      console.error("Error loading notes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Filter notes by search
  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      searchText === "" ||
      note.title.toLowerCase().includes(searchText.toLowerCase()) ||
      note.content?.toLowerCase().includes(searchText.toLowerCase());
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Notes</h1>
              <p className="text-gray-600 mt-1">
                {user?.email}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium transition-colors"
              >
                Tasks
              </Link>
              <Link
                href="/notes"
                className="px-4 py-2 text-blue-600 font-medium border-b-2 border-blue-600"
              >
                Notes
              </Link>
              <button
                onClick={handleSignOut}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Add */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search notes..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-full px-4 py-3 pl-11 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              <svg
                className="w-5 h-5 text-gray-400 absolute left-3.5 top-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <Link
              href="/notes/add"
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium whitespace-nowrap"
            >
              + New Note
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-4">
              <div className="bg-blue-50 p-3 rounded-lg">
                <svg
                  className="w-6 h-6 text-blue-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Notes</p>
                <p className="text-2xl font-bold text-gray-900">{notes.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-4">
              <div className="bg-green-50 p-3 rounded-lg">
                <svg
                  className="w-6 h-6 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-600">Search Results</p>
                <p className="text-2xl font-bold text-gray-900">{filteredNotes.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Notes Grid */}
        {filteredNotes.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <svg
              className="w-16 h-16 text-gray-300 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {notes.length === 0 ? "No notes yet" : "No notes found"}
            </h3>
            <p className="text-gray-600">
              {notes.length === 0
                ? "Create your first note to get started"
                : "Try adjusting your search"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredNotes.map((note) => (
              <NoteCard key={note.id} note={note} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default function NotesPage() {
  return (
    <ProtectedRoute>
      <NotesPageContent />
    </ProtectedRoute>
  );
}