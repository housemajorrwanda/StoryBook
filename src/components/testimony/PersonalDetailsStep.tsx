import React, { useEffect } from "react";
import {
  LuCalendar,
  LuPlus,
  LuX,
  LuChevronDown,
  LuMapPin,
} from "react-icons/lu";
import { FormData } from "@/types/testimonies";

interface PersonalDetailsStepProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}

export default function PersonalDetailsStep({
  formData,
  setFormData,
}: PersonalDetailsStepProps) {
  const relatives = formData.relatives || [];

  useEffect(() => {
    if (!formData.relatives || formData.relatives.length === 0) {
      setFormData((prev) => ({
        ...prev,
        relatives: [{ value: "", name: "" }],
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const relationshipOptions = [
    { value: "brother", label: "Brother" },
    { value: "sister", label: "Sister" },
    { value: "father", label: "Father" },
    { value: "mother", label: "Mother" },
    { value: "son", label: "Son" },
    { value: "daughter", label: "Daughter" },
    { value: "uncle", label: "Uncle" },
    { value: "aunt", label: "Aunt" },
    { value: "cousin", label: "Cousin" },
    { value: "grandfather", label: "Grandfather" },
    { value: "grandmother", label: "Grandmother" },
    { value: "nephew", label: "Nephew" },
    { value: "niece", label: "Niece" },
    { value: "neighbor", label: "Neighbor" },
    { value: "other", label: "Other" },
  ];

  const addRelative = () => {
    setFormData((prev) => ({
      ...prev,
      relatives: [...(prev.relatives || []), { value: "", name: "" }],
    }));
  };

  const removeRelative = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      relatives: (prev.relatives || []).filter((_, i) => i !== index),
    }));
  };

  const updateRelative = (
    index: number,
    field: "value" | "name",
    newValue: string
  ) => {
    setFormData((prev) => {
      const currentRelatives = prev.relatives || [];
      const updatedRelatives = currentRelatives.map((rel, i) => {
        if (i === index) {
          return { ...rel, [field]: newValue.trim() };
        }
        return rel;
      });

      return {
        ...prev,
        relatives: updatedRelatives,
      };
    });
  };

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

      {/* Full Name */}
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
          placeholder="Enter your full name"
          className="w-full px-3 sm:px-4 py-3 sm:py-4 border border-gray-300 rounded-lg sm:rounded-xl focus:border-black focus:outline-none transition-all duration-200 text-gray-900 bg-white hover:border-gray-400 text-sm sm:text-base"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
            How are you connected to these events? *
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
              required
              className="w-full px-3 sm:px-4 py-3 sm:py-4 border border-gray-300 rounded-lg sm:rounded-xl focus:border-black focus:outline-none transition-all duration-200 text-gray-900 bg-white hover:border-gray-400 cursor-pointer appearance-none text-sm sm:text-base"
            >
              <option value="">Select your connection to these events</option>
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
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 sm:pr-4 pointer-events-none">
              <LuChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
            Where did this happen? *
          </label>
          <div className="relative">
            <input
              type="text"
              value={formData.location}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  location: e.target.value,
                }))
              }
              placeholder="e.g., Kigali, Nyamata, or specific location"
              className="w-full px-3 sm:px-4 py-3 sm:py-4 pl-10 sm:pl-11 border border-gray-300 rounded-lg sm:rounded-xl focus:border-black focus:outline-none transition-all duration-200 text-gray-900 bg-white hover:border-gray-400 text-sm sm:text-base"
            />
            <LuMapPin className="absolute left-3 sm:left-4 top-3 sm:top-4 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
            Date of Event From *
          </label>
          <div className="relative">
            <input
              type="date"
              value={formData.dateOfEventFrom || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  dateOfEventFrom: e.target.value,
                }))
              }
              required
              className="w-full px-3 sm:px-4 py-3 sm:py-4 border border-gray-300 rounded-lg sm:rounded-xl focus:border-black focus:outline-none transition-all duration-200 text-gray-900 bg-white hover:border-gray-400 text-sm sm:text-base"
            />
            <LuCalendar className="absolute right-3 sm:right-4 top-3 sm:top-4 w-4 h-4 sm:w-5 sm:h-5 text-gray-500 pointer-events-none" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
            Date of Event To *
          </label>
          <div className="relative">
            <input
              type="date"
              value={formData.dateOfEventTo || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  dateOfEventTo: e.target.value,
                }))
              }
              min={formData.dateOfEventFrom || undefined}
              required
              className="w-full px-3 sm:px-4 py-3 sm:py-4 border border-gray-300 rounded-lg sm:rounded-xl focus:border-black focus:outline-none transition-all duration-200 text-gray-900 bg-white hover:border-gray-400 text-sm sm:text-base"
            />
            <LuCalendar className="absolute right-3 sm:right-4 top-3 sm:top-4 w-4 h-4 sm:w-5 sm:h-5 text-gray-500 pointer-events-none" />
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <label className="block text-sm font-semibold text-gray-700">
            Names of Relatives *
          </label>
          <button
            type="button"
            onClick={addRelative}
            className="inline-flex items-center gap-2 text-sm font-semibold text-black hover:text-gray-800 cursor-pointer p-2 hover:bg-gray-100 rounded-lg duration-300 transition-all"
          >
            <LuPlus className="w-4 h-4" />
            Add Relative
          </button>
        </div>
        <div className="space-y-3">
          {relatives.map((relative, index) => {
            const rel = relative as { value?: string; name?: string };
            return (
              <div
                key={index}
                className="flex items-center gap-2 w-full border border-gray-300 rounded-lg sm:rounded-xl bg-white p-2"
              >
                <div className="relative w-32 sm:w-40 shrink-0">
                  <select
                    value={rel.value || ""}
                    onChange={(e) =>
                      updateRelative(index, "value", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-black focus:outline-none transition-all duration-200 text-gray-900 bg-white text-sm cursor-pointer appearance-none"
                  >
                    <option value="">Relationship</option>
                    {relationshipOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <LuChevronDown className="w-3 h-3 text-gray-400" />
                  </div>
                </div>
                <input
                  type="text"
                  value={rel.name || ""}
                  onChange={(e) =>
                    updateRelative(index, "name", e.target.value)
                  }
                  placeholder="Name"
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:border-black focus:outline-none transition-all duration-200 text-gray-900 bg-white text-sm"
                />
                {relatives.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeRelative(index)}
                    className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors cursor-pointer shrink-0"
                    aria-label="Remove relative"
                  >
                    <LuX className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
