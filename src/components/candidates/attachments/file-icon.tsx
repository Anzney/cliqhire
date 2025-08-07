// utils/getFileIcon.tsx

import {
  File,
  FileImage,
  FileText,
  FileVideo,
  FileAudio,
  FileArchive,
  FileCode,
} from "lucide-react";

/**
 * Returns a JSX icon based on the file extension.
 * @param fileName Optional file name to extract extension from.
 * @returns JSX Element - Lucide icon for the file type.
 */
export const getFileIcon = (fileName?: string): JSX.Element => {
  if (!fileName || typeof fileName !== "string") {
    return <File className="h-4 w-4 text-gray-500" />;
  }

  const extension = fileName.split(".").pop()?.toLowerCase();

  if (!extension) {
    return <File className="h-4 w-4 text-gray-500" />;
  }

  switch (extension) {
    // 🖼️ Image files
    case "jpg":
    case "jpeg":
    case "png":
    case "gif":
    case "webp":
      return <FileImage className="h-4 w-4 text-blue-500" />;

    // 📄 Document files
    case "pdf":
      return <FileText className="h-4 w-4 text-red-500" />;
    case "doc":
    case "docx":
    case "txt":
    case "odt":
      return <FileText className="h-4 w-4 text-sky-500" />;

    // 🎬 Video files
    case "mp4":
    case "mov":
    case "avi":
      return <FileVideo className="h-4 w-4 text-purple-500" />;

    // 🎧 Audio files
    case "mp3":
    case "wav":
    case "m4a":
      return <FileAudio className="h-4 w-4 text-green-500" />;

    // 📦 Archive files
    case "zip":
    case "rar":
    case "7z":
      return <FileArchive className="h-4 w-4 text-yellow-500" />;

    // 🧑‍💻 Code files
    case "js":
    case "ts":
    case "jsx":
    case "tsx":
    case "html":
    case "css":
    case "json":
      return <FileCode className="h-4 w-4 text-indigo-500" />;

    // 🗃️ Default fallback
    default:
      return <File className="h-4 w-4 text-gray-500" />;
  }
};
