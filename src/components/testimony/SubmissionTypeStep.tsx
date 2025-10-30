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
    <div className="space-y-6 sm:space-y-8 md:space-y-10">
      <div className="text-center">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2 sm:mb-4 px-2">
          Choose Submission Type
        </h2>
        <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto px-4 leading-relaxed">
          Select the format that feels most comfortable for sharing your
          important testimony
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
        {[
          {
            type: "written" as StoryType,
            icon: LuFileText,
            title: "Written Testimony",
            desc: "Write your testimony in detail",
          },
          {
            type: "audio" as StoryType,
            icon: LuMic,
            title: "Audio Recording",
            desc: "Record your spoken testimony",
          },
          {
            type: "video" as StoryType,
            icon: LuVideo,
            title: "Video Testimony",
            desc: "Film your video testimony",
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
              className={`relative w-full p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl border text-left transition-all duration-300 group cursor-pointer ${
                formData.type === option.type
                  ? "border-gray-300 bg-gray-300 text-black shadow-lg scale-[1.02]"
                  : "border-gray-200 bg-white hover:border-gray-400 hover:shadow-md hover:scale-[1.01]"
              }`}
            >
              {/* Icon */}
              <div
                className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 mb-3 sm:mb-4 md:mb-6 transition-all duration-300 ${
                  formData.type === option.type
                    ? "text-black"
                    : "text-gray-600 group-hover:text-black"
                }`}
              >
                <option.icon className="w-full h-full" />
              </div>

              {/* Content */}
              <h3
                className={`text-base sm:text-lg md:text-xl font-semibold mb-1 sm:mb-2 md:mb-3 transition-colors duration-300 ${
                  formData.type === option.type ? "text-black" : "text-gray-900"
                }`}
              >
                {option.title}
              </h3>
              <p
                className={`text-xs sm:text-sm transition-colors duration-300 leading-relaxed ${
                  formData.type === option.type
                    ? "text-gray-700"
                    : "text-gray-600"
                }`}
              >
                {option.desc}
              </p>

              {/* Selection Indicator */}
              {formData.type === option.type && (
                <div className="absolute top-3 sm:top-4 right-3 sm:right-4 w-5 h-5 sm:w-6 sm:h-6 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-200">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-black rounded-full"></div>
                </div>
              )}
            </button>
          </div>
        ))}
      </div>

      <div className="space-y-3 sm:space-y-4">
        <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 px-2">
          Identity Preference
        </h3>
        <div className="space-y-3 sm:space-y-4">
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
              className={`w-full p-4 sm:p-5 md:p-6 rounded-lg sm:rounded-xl border text-left transition-all duration-300 group cursor-pointer ${
                formData.identity === option.value
                  ? "border-gray-300 bg-gray-200 shadow-lg scale-[1.01]"
                  : "border-gray-200 bg-white hover:border-gray-400 hover:bg-gray-50 hover:shadow-md hover:scale-[1.005]"
              }`}
            >
              <div className="flex items-center space-x-3 sm:space-x-4 md:space-x-5">
                <div className="relative flex items-center justify-center shrink-0">
                  <div
                    className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 transition-all duration-300 ${
                      formData.identity === option.value
                        ? "border-gray-400 bg-white scale-110"
                        : "border-gray-300 group-hover:border-gray-500"
                    }`}
                  >
                    {formData.identity === option.value && (
                      <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-black rounded-full mx-auto mt-0.5"></div>
                    )}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h4
                    className={`font-semibold text-sm sm:text-base md:text-lg mb-0.5 sm:mb-1 transition-colors duration-300 ${
                      formData.identity === option.value
                        ? "text-black"
                        : "text-gray-900 group-hover:text-black"
                    }`}
                  >
                    {option.title}
                  </h4>
                  <p
                    className={`text-xs sm:text-sm transition-colors duration-300 leading-relaxed ${
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
