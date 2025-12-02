"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { useCreateEducation } from "@/hooks/education/use-education-content";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Upload, Plus, X } from "lucide-react";
import Link from "next/link";

interface EducationFormData {
  title: string;
  description: string;
  content: string;
  type: string;
  category: string;
  tags: string[];
  status: string;
  isPublished: boolean;
  image?: File | null;
  video?: File | null;
  audio?: File | null;
}

const FileUpload = ({
  onFileSelect,
  accept,
  label,
  currentFile,
  type,
}: {
  onFileSelect: (file: File) => void;
  accept: string;
  label: string;
  currentFile?: File | null;
  type: "image" | "video" | "audio";
}) => {
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center">
      <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
      <p className="text-sm font-medium text-gray-900 mb-1">{label}</p>
      <p className="text-xs text-gray-500 mb-3">
        {currentFile
          ? `Selected: ${currentFile.name}`
          : `Click to browse ${type} file`}
      </p>
      <input
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
        id={`file-upload-${type}`}
      />
      <label
        htmlFor={`file-upload-${type}`}
        className="px-3 py-1.5 text-sm rounded-md bg-gray-100 text-gray-900 hover:bg-gray-200 transition-colors font-medium cursor-pointer inline-block"
      >
        {currentFile ? "Change File" : "Browse"}
      </label>
    </div>
  );
};

export default function CreateEducation() {
  const { mutate: createEducation, isPending } = useCreateEducation();
  const router = useRouter();

  const [formData, setFormData] = useState<EducationFormData>({
    title: "",
    description: "",
    content: "",
    type: "article",
    category: "history",
    tags: [],
    status: "draft",
    isPublished: false,
    image: null,
    video: null,
    audio: null,
  });

  const [tagInput, setTagInput] = useState("");

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  const handleRemoveTag = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index),
    }));
  };

  const handleImageUpload = (file: File) => {
    setFormData((prev) => ({ ...prev, image: file }));
  };

  const handleVideoUpload = (file: File) => {
    setFormData((prev) => ({ ...prev, video: file }));
  };

  const handleAudioUpload = (file: File) => {
    setFormData((prev) => ({ ...prev, audio: file }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const payload = new FormData();

    // Append required fields
    payload.append("title", formData.title);
    payload.append("content", formData.content);
    payload.append("type", formData.type);

    // Append optional fields
    if (formData.description) {
      payload.append("description", formData.description);
    } else {
      payload.append("description", "");
    }

    if (formData.category) {
      payload.append("category", formData.category);
    } else {
      payload.append("category", "");
    }

    if (formData.tags.length > 0) {
      payload.append("tags", JSON.stringify(formData.tags));
    } else {
      payload.append("tags", "[]");
    }

    if (formData.status) {
      payload.append("status", formData.status);
    } else {
      payload.append("status", "");
    }

    payload.append("isPublished", formData.isPublished.toString());

    // Append files
    if (formData.image) {
      payload.append("image", formData.image);
    }

    if (formData.video) {
      payload.append("video", formData.video);
    }

    if (formData.audio) {
      payload.append("audio", formData.audio);
    }

    try {
      await createEducation(payload);
      toast.success("Education content created successfully!");
      router.push("/dashboard/education");
    } catch (error) {
      console.error("Failed to create education content:", error);
      toast.error("Failed to create education content");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Create Education Content
          </h1>
          <p className="text-gray-600 mb-8">
            Fill in the details below to create new educational content
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title - Required */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter content title"
                className="w-full px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                required
              />
            </div>

            {/* Description */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter a brief description"
                rows={3}
                className="w-full px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Content - Required */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Content *
              </label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                placeholder="Enter the main content (HTML supported)"
                rows={8}
                className="w-full px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent resize-none font-mono text-sm"
                required
              />
            </div>

            {/* Type and Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Type - Required */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Type *
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                >
                  <option value="article">Article</option>
                  <option value="interactive">Interactive</option>
                  <option value="timeline">Timeline</option>
                  <option value="video">Video</option>
                  <option value="audio">Audio</option>
                </select>
              </div>

              {/* Category */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                >
                  <option value="history">History</option>
                  <option value="prevention">Prevention</option>
                  <option value="reconciliation">Reconciliation</option>
                  <option value="education">Education</option>
                  <option value="audio">Audio</option>
                </select>
              </div>
            </div>

            {/* Tags */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Tags
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="Enter a tag and press Add or Enter"
                  className="flex-1 px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition-colors font-medium"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <div
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm"
                  >
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(index)}
                      className="hover:text-gray-900"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                {formData.tags.length === 0 && (
                  <p className="text-gray-500 text-sm">
                    No tags added yet. Examples: genocide, rwanda, history
                  </p>
                )}
              </div>
            </div>

            {/* Status and Published */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Status */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              {/* Published Checkbox */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <label className="flex items-center gap-3 cursor-pointer h-full">
                  <input
                    type="checkbox"
                    name="isPublished"
                    checked={formData.isPublished}
                    onChange={handleInputChange}
                    className="w-5 h-5 rounded border-gray-300 cursor-pointer focus:ring-gray-500"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-900">
                      Publish immediately
                    </span>
                    <p className="text-xs text-gray-500 mt-1">
                      Content will be publicly available
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Media Uploads - Conditional based on type */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Media Files
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Image Upload - Available for all types */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Featured Image (Optional)
                  </label>
                  <FileUpload
                    onFileSelect={handleImageUpload}
                    accept="image/*"
                    label="Upload Featured Image"
                    currentFile={formData.image}
                    type="image"
                  />
                </div>

                {/* Video Upload - Available for video and interactive types */}
                {(formData.type === "video" ||
                  formData.type === "interactive" ||
                  formData.type === "timeline") && (
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Video File
                    </label>
                    <FileUpload
                      onFileSelect={handleVideoUpload}
                      accept="video/*"
                      label="Upload Video"
                      currentFile={formData.video}
                      type="video"
                    />
                  </div>
                )}

                {/* Audio Upload - Available for audio type */}
                {formData.type === "audio" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Audio File
                    </label>
                    <FileUpload
                      onFileSelect={handleAudioUpload}
                      accept="audio/*"
                      label="Upload Audio"
                      currentFile={formData.audio}
                      type="audio"
                    />
                  </div>
                )}
              </div>

              {/* Helper text based on type */}
              <p className="text-xs text-gray-500 mt-4">
                {formData.type === "article" &&
                  "Article content supports images and text."}
                {formData.type === "video" &&
                  "Video content supports video files and optional featured images."}
                {formData.type === "audio" &&
                  "Audio content supports audio files and optional featured images."}
                {formData.type === "interactive" &&
                  "Interactive content supports video, images, and rich HTML content."}
                {formData.type === "timeline" &&
                  "Timeline content supports images and video to illustrate historical events."}
              </p>
            </div>

            {/* Form Actions */}
            <div className="flex gap-4 justify-end pt-6">
              <Link
                href="/dashboard/education"
                className="px-6 py-3 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors font-medium text-gray-900"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isPending}
                className="px-6 py-3 cursor-pointer rounded-lg bg-gray-600 text-white hover:bg-gray-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending ? "Creating..." : "Create Content"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
