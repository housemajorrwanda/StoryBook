import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import {
  LuMic,
  LuVideo,
  LuUpload,
  LuX,
  LuCheck,
  LuBold,
  LuItalic,
  LuUnderline,
  LuList,
  LuListOrdered,
  LuQuote,
  LuAlignLeft,
  LuAlignCenter,
  LuAlignRight,
} from "react-icons/lu";
import { FormData } from "@/types/testimonies";
import AudioRecorderModal from "@/components/recording/AudioRecorderModal";
import VideoRecorderModal from "@/components/recording/VideoRecorderModal";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";

interface TestimonyContentStepProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}

// Toolbar button component
const ToolbarButton = ({
  onClick,
  isActive = false,
  disabled = false,
  children,
  title,
}: {
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  title: string;
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    title={title}
    className={`p-2 rounded-lg transition-all duration-200 cursor-pointer ${
      isActive
        ? "bg-gray-900 text-white shadow-md cursor-pointer"
        : disabled
        ? "text-gray-300 cursor-not-allowed"
        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 cursor-pointer"
    }`}
  >
    {children}
  </button>
);

export default function TestimonyContentStep({
  formData,
  setFormData,
}: TestimonyContentStepProps) {
  // Modal state
  const [isAudioModalOpen, setIsAudioModalOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  // Tiptap editor configuration
  const editor = useEditor({
    immediatelyRender: false, // Fix SSR hydration issues
    extensions: [
      StarterKit,
      TextStyle,
      Color,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-600 underline cursor-pointer",
        },
      }),
      Placeholder.configure({
        placeholder: `Share your story, memories, and experiences in detail...

You can use the formatting tools above to:
• Add headings to organize your story
• Use bold or italic for emphasis  
• Create lists for key points
• Add quotes using the blockquote tool
• Include dates, names, and locations`,
      }),
    ],
    content: formData.testimony || "",
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setFormData((prev) => ({
        ...prev,
        testimony: html,
      }));
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-lg max-w-none focus:outline-none p-6 min-h-[350px] text-gray-900",
      },
    },
  });

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (editor) {
        editor.destroy();
      }
    };
  }, [editor]);

  // File input refs
  const imageInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  // File upload handlers
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files).map((file) => ({
        file,
        description: "",
      }));
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...newImages],
      }));
    }
  };

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        audioFile: file,
      }));
    }
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        videoFile: file,
      }));
    }
  };

  const handleAudioRecordingComplete = (audioBlob: Blob) => {
    // Convert blob to File object
    const audioFile = new File(
      [audioBlob],
      `audio-recording-${Date.now()}.webm`,
      {
        type: audioBlob.type,
      }
    );

    setFormData((prev) => ({
      ...prev,
      audioFile: audioFile,
    }));
  };

  const handleVideoRecordingComplete = (videoBlob: Blob) => {
    // Convert blob to File object
    const videoFile = new File(
      [videoBlob],
      `video-recording-${Date.now()}.webm`,
      {
        type: videoBlob.type,
      }
    );

    setFormData((prev) => ({
      ...prev,
      videoFile: videoFile,
    }));
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const updateImageDescription = (index: number, description: string) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.map((img, i) =>
        i === index ? { ...img, description } : img
      ),
    }));
  };

  return (
    <>
      <style jsx global>{`
        /* Custom Tiptap Editor Styling */
        .ProseMirror {
          outline: none;
          font-family: inherit;
          font-size: 16px;
          line-height: 1.6;
          color: #111827;
        }

        .ProseMirror h1 {
          font-size: 1.875rem;
          font-weight: bold;
          line-height: 1.2;
          margin-top: 1.5rem;
          margin-bottom: 1rem;
        }

        .ProseMirror h2 {
          font-size: 1.5rem;
          font-weight: bold;
          line-height: 1.3;
          margin-top: 1.25rem;
          margin-bottom: 0.875rem;
        }

        .ProseMirror h3 {
          font-size: 1.25rem;
          font-weight: bold;
          line-height: 1.4;
          margin-top: 1rem;
          margin-bottom: 0.75rem;
        }

        .ProseMirror p {
          margin-bottom: 1rem;
        }

        .ProseMirror ul,
        .ProseMirror ol {
          margin-bottom: 1rem;
          padding-left: 1.5rem;
        }

        .ProseMirror li {
          margin-bottom: 0.25rem;
        }

        .ProseMirror blockquote {
          border-left: 4px solid #e5e7eb;
          padding-left: 1rem;
          margin: 1rem 0;
          font-style: italic;
          color: #6b7280;
        }

        .ProseMirror a {
          color: #3b82f6;
          text-decoration: underline;
        }

        .ProseMirror strong {
          font-weight: bold;
        }

        .ProseMirror em {
          font-style: italic;
        }

        .ProseMirror s {
          text-decoration: line-through;
        }

        .ProseMirror p.is-editor-empty:first-child::before {
          color: #9ca3af;
          content: attr(data-placeholder);
          float: left;
          height: 0;
          pointer-events: none;
        }
      `}</style>

      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
            Your Testimony
          </h2>
          <p className="text-lg text-gray-600">
            Share your story in your own words
          </p>
        </div>

        {/* Event Title - Required for all types */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Event Title *
          </label>
          <input
            type="text"
            value={formData.eventTitle || ""}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                eventTitle: e.target.value,
              }))
            }
            placeholder="Brief summary of the event (e.g., 'Attack on Nyanza Church', 'Rescue at roadblock')"
            className="w-full px-4 py-4 border-2 border-gray-200 outline-none rounded-xl focus:border-black focus:outline-none transition-colors duration-200 text-gray-900"
          />
        </div>

        {/* Type-specific content */}
        {formData.type === "written" && (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Full Testimony *
            </label>
            <div className="border-2 border-gray-200 rounded-xl overflow-hidden focus-within:border-black transition-colors duration-200">
              {editor && (
                <>
                  {/* Custom Toolbar */}
                  <div className="border-b border-gray-200 bg-gray-50 p-4 flex flex-wrap gap-2">
                    {/* Text Formatting */}
                    <div className="flex gap-1 border-r border-gray-300 pr-3 mr-3 cursor-pointer">
                      <ToolbarButton
                        onClick={() =>
                          editor.chain().focus().toggleBold().run()
                        }
                        isActive={editor.isActive("bold")}
                        title="Bold"
                      >
                        <LuBold className="w-4 h-4" />
                      </ToolbarButton>
                      <ToolbarButton
                        onClick={() =>
                          editor.chain().focus().toggleItalic().run()
                        }
                        isActive={editor.isActive("italic")}
                        title="Italic"
                      >
                        <LuItalic className="w-4 h-4" />
                      </ToolbarButton>
                      <ToolbarButton
                        onClick={() =>
                          editor.chain().focus().toggleStrike().run()
                        }
                        isActive={editor.isActive("strike")}
                        title="Strikethrough"
                      >
                        <LuUnderline className="w-4 h-4" />
                      </ToolbarButton>
                    </div>

                    {/* Headings */}
                    <div className="flex gap-1 border-r border-gray-300 pr-3 mr-3 cursor-pointer">
                      <ToolbarButton
                        onClick={() =>
                          editor
                            .chain()
                            .focus()
                            .toggleHeading({ level: 1 })
                            .run()
                        }
                        isActive={editor.isActive("heading", { level: 1 })}
                        title="Heading 1"
                      >
                        <span className="text-sm font-bold">H1</span>
                      </ToolbarButton>
                      <ToolbarButton
                        onClick={() =>
                          editor
                            .chain()
                            .focus()
                            .toggleHeading({ level: 2 })
                            .run()
                        }
                        isActive={editor.isActive("heading", { level: 2 })}
                        title="Heading 2"
                      >
                        <span className="text-sm font-bold">H2</span>
                      </ToolbarButton>
                      <ToolbarButton
                        onClick={() =>
                          editor
                            .chain()
                            .focus()
                            .toggleHeading({ level: 3 })
                            .run()
                        }
                        isActive={editor.isActive("heading", { level: 3 })}
                        title="Heading 3"
                      >
                        <span className="text-sm font-bold">H3</span>
                      </ToolbarButton>
                    </div>

                    {/* Lists */}
                    <div className="flex gap-1 border-r border-gray-300 pr-3 mr-3">
                      <ToolbarButton
                        onClick={() =>
                          editor.chain().focus().toggleBulletList().run()
                        }
                        isActive={editor.isActive("bulletList")}
                        title="Bullet List"
                      >
                        <LuList className="w-4 h-4" />
                      </ToolbarButton>
                      <ToolbarButton
                        onClick={() =>
                          editor.chain().focus().toggleOrderedList().run()
                        }
                        isActive={editor.isActive("orderedList")}
                        title="Numbered List"
                      >
                        <LuListOrdered className="w-4 h-4" />
                      </ToolbarButton>
                      <ToolbarButton
                        onClick={() =>
                          editor.chain().focus().toggleBlockquote().run()
                        }
                        isActive={editor.isActive("blockquote")}
                        title="Quote"
                      >
                        <LuQuote className="w-4 h-4" />
                      </ToolbarButton>
                    </div>

                    {/* Alignment */}
                    <div className="flex gap-1">
                      <ToolbarButton
                        onClick={() =>
                          editor.chain().focus().setTextAlign("left").run()
                        }
                        isActive={editor.isActive({ textAlign: "left" })}
                        title="Align Left"
                      >
                        <LuAlignLeft className="w-4 h-4" />
                      </ToolbarButton>
                      <ToolbarButton
                        onClick={() =>
                          editor.chain().focus().setTextAlign("center").run()
                        }
                        isActive={editor.isActive({ textAlign: "center" })}
                        title="Align Center"
                      >
                        <LuAlignCenter className="w-4 h-4" />
                      </ToolbarButton>
                      <ToolbarButton
                        onClick={() =>
                          editor.chain().focus().setTextAlign("right").run()
                        }
                        isActive={editor.isActive({ textAlign: "right" })}
                        title="Align Right"
                      >
                        <LuAlignRight className="w-4 h-4" />
                      </ToolbarButton>
                    </div>
                  </div>

                  {/* Editor Content */}
                  <EditorContent
                    editor={editor}
                    className="bg-white min-h-[350px]"
                  />
                </>
              )}

              {!editor && (
                <div className="h-[400px] bg-gray-50 rounded-xl animate-pulse flex items-center justify-center text-gray-500">
                  Loading editor...
                </div>
              )}
            </div>
          </div>
        )}

        {formData.type === "audio" && (
          <div className="space-y-8">
            {/* Record Audio Section */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Audio Recording
              </label>
              <div className="border border-gray-300 rounded-xl p-8 text-center hover:border-gray-400 transition-colors duration-200">
                <LuMic className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-gray-700 mb-2">
                  Record Audio Testimony
                </h4>
                <p className="text-gray-600 text-sm mb-6">
                  Use your microphone to record your testimony
                </p>
                <button
                  type="button"
                  onClick={() => setIsAudioModalOpen(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors duration-200 cursor-pointer"
                >
                  <LuMic className="w-5 h-5" />
                  Start Recording
                </button>
              </div>
            </div>

            <div className="text-center text-gray-500 font-medium">or</div>

            {/* Upload Audio Section */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Upload Audio File
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-gray-400 transition-colors duration-200">
                <LuMic className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-gray-700 mb-2">
                  Upload audio file
                </h4>
                <p className="text-gray-500 text-sm">MP3, WAV up to 50MB</p>
                {formData.audioFile ? (
                  <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                        <LuMic className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">
                          Audio recording ready
                        </p>
                        <p className="text-xs text-gray-600">
                          {formData.audioFile.name.includes("recording")
                            ? "Recorded audio"
                            : formData.audioFile.name}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({ ...prev, audioFile: null }))
                        }
                        className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
                      >
                        <LuX className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => audioInputRef.current?.click()}
                    className="mt-4 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 cursor-pointer"
                  >
                    Choose File
                  </button>
                )}
                <input
                  ref={audioInputRef}
                  type="file"
                  accept="audio/*"
                  onChange={handleAudioUpload}
                  className="hidden"
                />
              </div>
            </div>
          </div>
        )}

        {formData.type === "video" && (
          <div className="space-y-8">
            {/* Record Video Section */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Video Recording
              </label>
              <div className="border border-gray-300 rounded-xl p-8 text-center hover:border-gray-400 transition-colors duration-200">
                <LuVideo className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-gray-700 mb-2">
                  Record Video Testimony
                </h4>
                <p className="text-gray-600 text-sm mb-6">
                  Use your camera and microphone to record your testimony
                </p>
                <button
                  type="button"
                  onClick={() => setIsVideoModalOpen(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors duration-200 cursor-pointer"
                >
                  <LuVideo className="w-5 h-5" />
                  Start Recording
                </button>
              </div>
            </div>

            <div className="text-center text-gray-500 font-medium">or</div>

            {/* Upload Video Section */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Upload Video File
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-gray-400 transition-colors duration-200">
                <LuVideo className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-gray-700 mb-2">
                  Upload video file
                </h4>
                <p className="text-gray-500 text-sm mb-6">
                  MP4, MOV up to 200MB
                </p>
                {formData.videoFile ? (
                  <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                        <LuVideo className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">
                          Video recording ready
                        </p>
                        <p className="text-xs text-gray-600">
                          {formData.videoFile.name.includes("recording")
                            ? "Recorded video"
                            : formData.videoFile.name}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({ ...prev, videoFile: null }))
                        }
                        className="text-gray-500 hover:text-gray-700 transition-colors duration-200 cursor-pointer"
                      >
                        <LuX className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => videoInputRef.current?.click()}
                    className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors duration-200 cursor-pointer"
                  >
                    Upload Video
                  </button>
                )}
                <input
                  ref={videoInputRef}
                  type="file"
                  accept="video/*"
                  onChange={handleVideoUpload}
                  className="hidden"
                />
              </div>
            </div>
          </div>
        )}

        {/* Images Section - For all types */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Images <span className="text-gray-500 font-normal">(optional)</span>
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-gray-400 transition-colors duration-200">
            <button
              type="button"
              onClick={() => imageInputRef.current?.click()}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 cursor-pointer"
            >
              <LuUpload className="w-5 h-5 " />
              Upload Images
            </button>
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          {/* Display uploaded images with optional descriptions */}
          {formData.images.length > 0 && (
            <div className="mt-6 space-y-4">
              {formData.images.map((imageData, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start gap-4">
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-200 shrink-0">
                      <Image
                        src={URL.createObjectURL(imageData.file)}
                        alt={`Uploaded image ${index + 1}`}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-700">
                          {imageData.file.name}
                        </p>
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="text-red-600 hover:text-red-700 p-1 cursor-pointer"
                        >
                          <LuX className="w-4 h-4" />
                        </button>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Description (optional)
                        </label>
                        <input
                          type="text"
                          value={imageData.description}
                          onChange={(e) =>
                            updateImageDescription(index, e.target.value)
                          }
                          placeholder="Add a description for this image..."
                          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-black focus:outline-none transition-colors duration-200 text-gray-900"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Consent & Terms */}
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:bg-gray-100 transition-colors duration-200">
          <div className="flex items-start gap-4">
            <div className="relative flex items-start">
              <input
                type="checkbox"
                id="consent"
                checked={formData.consent || false}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    consent: e.target.checked,
                  }))
                }
                className="sr-only"
              />
              <label
                htmlFor="consent"
                className="relative flex items-center cursor-pointer group focus-within:ring-2 focus-within:ring-black focus-within:ring-offset-2 rounded-lg"
              >
                <div
                  className={`flex items-center justify-center w-6 h-6 rounded-lg border-2 transition-all duration-200 group-hover:scale-105 ${
                    formData.consent
                      ? "bg-black border-black shadow-md group-hover:shadow-lg"
                      : "bg-white border-gray-300 hover:border-gray-400 group-hover:shadow-sm"
                  }`}
                >
                  {formData.consent && (
                    <LuCheck className="w-4 h-4 text-white" />
                  )}
                </div>
              </label>
            </div>
            <div>
              <label
                htmlFor="consent"
                className="text-sm font-semibold text-gray-900 mb-2 block cursor-pointer hover:text-black transition-colors duration-200"
              >
                Consent & Terms
              </label>
              <div className="text-xs text-gray-600 space-y-1">
                <p>
                  I consent to the submission of this testimony for archival,
                  research, and educational purposes. I understand that:
                </p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>My testimony will be preserved in a digital archive</li>
                  <li>It may be used for historical research and education</li>
                  <li>I can request modifications or removal at any time</li>
                  <li>My privacy preferences will be respected</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Recording Modals */}
        <AudioRecorderModal
          isOpen={isAudioModalOpen}
          onClose={() => setIsAudioModalOpen(false)}
          onRecordingComplete={handleAudioRecordingComplete}
        />

        <VideoRecorderModal
          isOpen={isVideoModalOpen}
          onClose={() => setIsVideoModalOpen(false)}
          onRecordingComplete={handleVideoRecordingComplete}
        />
      </div>
    </>
  );
}
