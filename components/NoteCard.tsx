"use client";

import { Note } from "@/types/note";
import Link from "next/link";

interface NoteCardProps {
  note: Note;
}

export default function NoteCard({ note }: NoteCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Link href={`/notes/${note.id}`}>
      <div className="group bg-white rounded-xl border border-gray-100 hover:border-gray-200 shadow-sm hover:shadow-md transition-all p-5 cursor-pointer">
        {/* Title */}
        <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600 transition-colors text-gray-900">
          {note.title}
        </h3>

        {/* Content Preview */}
        {note.content && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-3">
            {note.content}
          </p>
        )}

        {/* Date */}
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span>{formatDate(note.created_at)}</span>
        </div>
      </div>
    </Link>
  );
}