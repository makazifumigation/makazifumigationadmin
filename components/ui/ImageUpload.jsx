"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { uploadImage } from "@/lib/storage";

export default function ImageUpload({
  value,
  onChange,
  folder = "uploads",
  label = "Image",
  required = false,
}) {
  const [preview, setPreview] = useState(value || "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  // Sync preview with value prop when it changes externally
  useEffect(() => {
    setPreview(value || "");
  }, [value]);

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");
    setUploading(true);

    // Show preview immediately
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);

    try {
      // Upload to Firebase Storage
      const downloadURL = await uploadImage(file, folder);
      setPreview(downloadURL);
      onChange(downloadURL);
    } catch (err) {
      setError(err.message || "Failed to upload image");
      setPreview(value || "");
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview("");
    onChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-[#1a1a1a] mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      {preview ? (
        <div className="relative">
          <div className="relative w-full h-64 rounded-lg overflow-hidden border border-[#e7e7e7]">
            <Image
              src={preview}
              alt="Preview"
              fill
              className="object-cover"
              unoptimized
            />
          </div>
          <div className="mt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="text-sm text-[#5bad6a] hover:underline disabled:opacity-50"
            >
              {uploading ? "Uploading..." : "Change Image"}
            </button>
            <button
              type="button"
              onClick={handleRemove}
              disabled={uploading}
              className="text-sm text-red-600 hover:underline disabled:opacity-50"
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-[#e7e7e7] rounded-lg p-8 text-center cursor-pointer hover:border-[#5bad6a] transition-colors"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            disabled={uploading}
          />
          <div className="space-y-2">
            <svg
              className="mx-auto h-12 w-12 text-[#6d6d6d]"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p className="text-sm text-[#6d6d6d]">
              {uploading ? "Uploading..." : "Click to upload an image"}
            </p>
            <p className="text-xs text-[#6d6d6d]">
              PNG, JPG, GIF up to 5MB
            </p>
          </div>
        </div>
      )}

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}

