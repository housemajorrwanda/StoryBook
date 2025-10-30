import React from "react";
import { LuCalendar, LuChevronDown } from "react-icons/lu";
import { FormData } from "@/types/testimonies";

interface PersonalDetailsStepProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}

export default function PersonalDetailsStep({
  formData,
  setFormData,
}: PersonalDetailsStepProps) {
  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="text-center">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2 sm:mb-3 px-2">
          Personal Information
        </h2>
        <p className="text-sm sm:text-base md:text-lg text-gray-600 px-4 leading-relaxed">
          Help us understand your connection to the events
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
            Full Name *
          </label>
          <input
            type="text"
            value={formData.fullName}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                fullName: e.target.value,
              }))
            }
            placeholder="Your full name"
            className="w-full px-3 sm:px-4 py-3 sm:py-4 border border-gray-300 rounded-lg sm:rounded-xl focus:border-black focus:outline-none transition-all duration-200 text-gray-900 bg-white hover:border-gray-400 text-sm sm:text-base"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
            Your Role *
          </label>
          <div className="relative">
            <select
              value={formData.relationToEvent}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  relationToEvent: e.target.value,
                }))
              }
              className="w-full px-3 sm:px-4 py-3 sm:py-4 border border-gray-300 rounded-lg sm:rounded-xl focus:border-black focus:outline-none transition-all duration-200 text-gray-900 bg-white hover:border-gray-400 cursor-pointer appearance-none text-sm sm:text-base"
            >
              <option value="">Choose your role</option>
              {formData.type === "written" && (
                <>
                  <option value="survivor">Survivor</option>
                  <option value="witness">Direct Witness</option>
                  <option value="family_member">Family Member</option>
                  <option value="community_member">Community Member</option>
                  <option value="rescuer">Helper/Rescuer</option>
                  <option value="other">Other</option>
                </>
              )}
              {formData.type === "audio" && (
                <>
                  <option value="survivor">Survivor Testimony</option>
                  <option value="witness">Witness Account</option>
                  <option value="family_member">Family Story</option>
                  <option value="community_member">Community Voice</option>
                  <option value="rescuer">Rescue Story</option>
                  <option value="other">Other Story</option>
                </>
              )}
              {formData.type === "video" && (
                <>
                  <option value="survivor">Visual Testimony</option>
                  <option value="witness">Recorded Witness</option>
                  <option value="family_member">Family Documentary</option>
                  <option value="community_member">Community Record</option>
                  <option value="rescuer">Rescue Documentation</option>
                  <option value="other">Other Recording</option>
                </>
              )}
              {!formData.type && (
                <>
                  <option value="survivor">Survivor</option>
                  <option value="witness">Witness</option>
                  <option value="family_member">Family Member</option>
                  <option value="community_member">Community Member</option>
                  <option value="rescuer">Helper/Rescuer</option>
                  <option value="other">Other</option>
                </>
              )}
            </select>
            {/* Custom dropdown arrow */}
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 sm:pr-4 pointer-events-none">
              <LuChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
            Location *
          </label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                location: e.target.value,
              }))
            }
            placeholder="City, Region, or Specific Place"
            className="w-full px-3 sm:px-4 py-3 sm:py-4 border border-gray-300 rounded-lg sm:rounded-xl focus:border-black focus:outline-none transition-all duration-200 text-gray-900 bg-white hover:border-gray-400 text-sm sm:text-base"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
            Date of Event *
          </label>
          <div className="relative">
            <input
              type="date"
              value={formData.dateOfEvent}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  dateOfEvent: e.target.value,
                }))
              }
              className="w-full px-3 sm:px-4 py-3 sm:py-4 border border-gray-300 rounded-lg sm:rounded-xl focus:border-black focus:outline-none transition-all duration-200 text-gray-900 bg-white hover:border-gray-400 text-sm sm:text-base"
            />
            <LuCalendar className="absolute right-3 sm:right-4 top-3 sm:top-4 w-4 h-4 sm:w-5 sm:h-5 text-gray-500 pointer-events-none" />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
          Names of Relatives{" "}
          <span className="text-gray-500 font-normal">(optional)</span>
        </label>
        <textarea
          value={formData.relativesNames}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              relativesNames: e.target.value,
            }))
          }
          placeholder="Names of family members affected (helps with connections)"
          rows={3}
          className="w-full px-3 sm:px-4 py-3 sm:py-4 border border-gray-300 rounded-lg sm:rounded-xl focus:border-black focus:outline-none transition-all duration-200 text-gray-900 bg-white hover:border-gray-400 resize-none text-sm sm:text-base leading-relaxed"
        />
      </div>
    </div>
  );
}
