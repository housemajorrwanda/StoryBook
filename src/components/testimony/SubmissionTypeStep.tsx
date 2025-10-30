import React from "react";
import { LuFileText, LuMic, LuVideo } from "react-icons/lu";
import { FormData, StoryType, IdentityPreference } from "@/types/testimonies";

interface SubmissionTypeStepProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}

export default function SubmissionTypeStep({
  formData,
  setFormData,
}: SubmissionTypeStepProps) {
  return (
    <div className="space-y-10">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-200 rounded-2xl mb-6">
          <LuFileText className="w-8 h-8 text-gray-700" />
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Choose Submission Type
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Select the format that feels most comfortable for sharing your
          important testimony
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3">
        {[
          {
            type: "written" as StoryType,
            icon: LuFileText,
            title: "Written Testimon",
            desc: "Write your testimony",
          },
          {
            type: "audio" as StoryType,
            icon: LuMic,
            title: "Audio Recording",
            desc: "Record your testimony",
          },
          {
            type: "video" as StoryType,
            icon: LuVideo,
            title: "Video Testimony",
            desc: "Film your testimony",
          },
        ].map((option) => (
          <div
            key={option.type}
            className="relative group transition-all duration-300"
          >
            <button
              onClick={() =>
                setFormData((prev) => ({ ...prev, type: option.type }))
              }
              className={`relative p-8 rounded-2xl border text-left transition-all duration-300 group cursor-pointer ${
                formData.type === option.type
                  ? "border-gray-300 bg-gray-300 text-black shadow-lg"
                  : "border-gray-200 bg-white hover:border-gray-400 hover:shadow-md"
              }`}
            >
              {/* Icon */}
              <div
                className={`w-12 h-12 mb-6 transition-all duration-300 ${
                  formData.type === option.type
                    ? "text-black"
                    : "text-gray-600 group-hover:text-black"
                }`}
              >
                <option.icon className="w-full h-full" />
              </div>

              {/* Content */}
              <h3
                className={`text-xl font-semibold mb-3 transition-colors duration-300 ${
                  formData.type === option.type ? "text-black" : "text-gray-900"
                }`}
              >
                {option.title}
              </h3>
              <p
                className={`text-sm transition-colors duration-300 ${
                  formData.type === option.type
                    ? "text-gray-700"
                    : "text-gray-600"
                }`}
              >
                {option.desc}
              </p>

              {/* Selection Indicator */}
              {formData.type === option.type && (
                <div className="absolute top-4 right-4 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-200">
                  <div className="w-3 h-3 bg-black rounded-full"></div>
                </div>
              )}
            </button>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <h3 className="text-2xl font-semibold text-gray-900">
          Identity Preference
        </h3>
        <div className="space-y-4">
          {[
            {
              value: "public" as IdentityPreference,
              title: "Public Identity",
              desc: "Your name will be displayed with your testimony",
            },
            {
              value: "anonymous" as IdentityPreference,
              title: "Anonymous",
              desc: "Your testimony will be shared without your name",
            },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  identity: option.value,
                }))
              }
              className={`w-full p-6 rounded-xl border text-left transition-all duration-300 group cursor-pointer ${
                formData.identity === option.value
                  ? "border-gray-300 bg-gray-200 shadow-lg"
                  : "border-gray-200 bg-white hover:border-gray-400 hover:bg-gray-50 hover:shadow-md"
              }`}
            >
              <div className="flex items-center space-x-5">
                <div className="relative flex items-center justify-center">
                  <div
                    className={`w-6 h-6 rounded-full border-2 transition-all duration-300 ${
                      formData.identity === option.value
                        ? "border-gray-400 bg-white scale-110"
                        : "border-gray-300 group-hover:border-gray-500"
                    }`}
                  >
                    {formData.identity === option.value && (
                      <div className="w-3 h-3 bg-black rounded-full mx-auto mt-0.5"></div>
                    )}
                  </div>
                </div>
                <div className="flex-1">
                  <h4
                    className={`font-semibold text-lg mb-1 transition-colors duration-300 ${
                      formData.identity === option.value
                        ? "text-black"
                        : "text-gray-900 group-hover:text-black"
                    }`}
                  >
                    {option.title}
                  </h4>
                  <p
                    className={`text-sm transition-colors duration-300 ${
                      formData.identity === option.value
                        ? "text-black"
                        : "text-gray-600 group-hover:text-gray-700"
                    }`}
                  >
                    {option.desc}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
