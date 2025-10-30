import React, { useRef } from "react";
import Image from "next/image";
import { LuMic, LuVideo, LuUpload, LuX } from "react-icons/lu";
import { FormData } from "@/types/testimonies";

interface TestimonyContentStepProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}

export default function TestimonyContentStep({
  formData,
  setFormData,
}: TestimonyContentStepProps) {
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
          className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-black focus:outline-none transition-colors duration-200 text-gray-900"
        />
      </div>

      {/* Type-specific content */}
      {formData.type === "written" && (
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Full Testimony *
          </label>
          <textarea
            value={formData.testimony}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                testimony: e.target.value,
              }))
            }
            placeholder="Share your story, memories, and experiences..."
            rows={12}
            className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-black focus:outline-none transition-colors duration-200 text-gray-900 resize-none"
          />
        </div>
      )}

      {formData.type === "audio" && (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Audio Recording
            </label>
            <div className="border-2 border-gray-300 rounded-xl p-8 text-center">
              <button
                type="button"
                className="inline-flex items-center gap-3 px-8 py-4 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors duration-200 text-lg cursor-pointer"
                onClick={() => {
                  alert(
                    "Audio recording functionality would be implemented here"
                  );
                }}
              >
                <div className="w-3 h-3 bg-white rounded-full"></div>
                Start Audio Recording
              </button>
            </div>
          </div>

          <div className="text-center text-gray-500 font-medium">or</div>

          <div>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-gray-400 transition-colors duration-200">
              <LuMic className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-gray-700 mb-2 cursor-pointer">
                Upload audio file
              </h4>
              <p className="text-gray-500 text-sm">MP3, WAV up to 50MB</p>
              {formData.audioFile ? (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-700 font-medium">
                    Selected: {formData.audioFile.name}
                  </p>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, audioFile: null }))
                    }
                    className="mt-2 text-red-600 hover:text-red-700 text-sm cursor-pointer"
                  >
                    Remove file
                  </button>
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
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Video Recording
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-gray-400 transition-colors duration-200">
            <LuVideo className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-gray-700 mb-2">
              Upload video file
            </h4>
            <p className="text-gray-500 text-sm mb-6">MP4, MOV up to 200MB</p>
            {formData.videoFile ? (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700 font-medium mb-2">
                  Selected: {formData.videoFile.name}
                </p>
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, videoFile: null }))
                  }
                  className="text-red-600 hover:text-red-700 text-sm cursor-pointer"
                >
                  Remove file
                </button>
              </div>
            ) : (
              <div className="flex justify-center gap-4">
                <button
                  type="button"
                  onClick={() => videoInputRef.current?.click()}
                  className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors duration-200 cursor-pointer"
                >
                  Upload Video
                </button>
                <button
                  type="button"
                  onClick={() => {
                    alert(
                      "Video recording functionality would be implemented here"
                    );
                  }}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 transition-colors duration-200 cursor-pointer"
                >
                  Record Now
                </button>
              </div>
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
      <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
        <div className="flex items-start gap-3">
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
            className="mt-1 w-5 h-5 text-black border-2 border-gray-300 rounded focus:ring-black focus:ring-2"
          />
          <div>
            <label
              htmlFor="consent"
              className="text-sm font-semibold text-gray-900 mb-2 block cursor-pointer"
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
    </div>
  );
}
