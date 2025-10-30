"use client";

import React, { useState } from "react";
import Link from "next/link";
import { LuChevronLeft, LuChevronRight, LuArrowLeft } from "react-icons/lu";
import SubmissionTypeStep from "@/components/testimony/SubmissionTypeStep";
import PersonalDetailsStep from "@/components/testimony/PersonalDetailsStep";
import TestimonyContentStep from "@/components/testimony/TestimonyContentStep";
import { FormData } from "@/types/testimonies";

export default function ShareStoryPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    type: null,
    identity: null,
    fullName: "",
    relationToEvent: "",
    relativesNames: "",
    location: "",
    dateOfEvent: "",
    testimony: "",
    eventTitle: "",
    consent: false,
    images: [],
    audioFile: null,
    videoFile: null,
  });

  const steps = [
    { number: 1, label: "Type", title: "Choose Submission Type" },
    { number: 2, label: "Details", title: "Personal Information" },
    { number: 3, label: "Testimony", title: "Share Your Story" },
  ];

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    console.log("Form submitted:", formData);
    window.location.href = "/";
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.type !== null && formData.identity !== null;
      case 2:
        return (
          formData.fullName && formData.relationToEvent && formData.location
        );
      case 3:
        // Validate required fields for all types
        const hasEventTitle = formData.eventTitle.trim().length > 0;
        const hasConsent = formData.consent;

        // Validate type-specific content
        let hasContent = false;
        switch (formData.type) {
          case "written":
            hasContent = formData.testimony.trim().length > 0;
            break;
          case "audio":
          case "video":
            // For now, we'll consider these valid if the basic fields are filled
            // In a real app, you'd check if audio/video files are uploaded
            hasContent = true;
            break;
          default:
            hasContent = false;
        }

        return hasEventTitle && hasConsent && hasContent;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Navigation */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors duration-200 cursor-pointer"
          >
            <LuArrowLeft className="w-5 h-5" />
            <span className="font-semibold">Back to Home</span>
          </Link>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="font-bold text-gray-900">StoryBook</span>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Share Your Testimony
          </h1>
          <p className="text-lg text-gray-500 max-w-3xl mx-auto">
            Your story matters. Help preserve history and connect families by
            sharing your experiences from the 1994 genocide against the Tutsi in
            Rwanda.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-12">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center">
              <div className="flex items-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 ${
                    currentStep === step.number
                      ? "bg-black text-white shadow-lg scale-110"
                      : currentStep > step.number
                      ? "bg-black text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {step.number}
                </div>
                <div className="ml-3 text-left">
                  <p className="text-sm font-semibold text-gray-900">
                    {step.label}
                  </p>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`h-1 w-20 rounded-full transition-all duration-300 mx-4 ${
                    currentStep > step.number ? "bg-black" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-200">
          <div className="p-8 md:p-12">
            {/* Step 1: Type Selection */}
            {currentStep === 1 && (
              <SubmissionTypeStep
                formData={formData}
                setFormData={setFormData}
              />
            )}

            {/* Step 2: Details Form */}
            {currentStep === 2 && (
              <PersonalDetailsStep
                formData={formData}
                setFormData={setFormData}
              />
            )}

            {/* Step 3: Testimony */}
            {currentStep === 3 && (
              <TestimonyContentStep
                formData={formData}
                setFormData={setFormData}
              />
            )}
          </div>

          {/* Footer Navigation */}
          <div className="border-t border-gray-200 px-8 md:px-12 py-6 bg-gray-50 rounded-b-3xl flex justify-between items-center">
            {currentStep > 1 ? (
              <button
                onClick={handleBack}
                className="flex items-center gap-2 px-6 py-3 text-gray-700 hover:text-gray-900 font-semibold transition-colors duration-200 cursor-pointer"
              >
                <LuChevronLeft className="w-5 h-5" />
                Back
              </button>
            ) : (
              <div />
            )}

            {currentStep < 3 ? (
              <button
                onClick={handleNext}
                disabled={!isStepValid()}
                className="flex items-center gap-2 px-8 py-3 bg-black text-white font-semibold rounded-xl hover:bg-gray-800 transition-all duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer"
              >
                Continue
                <LuChevronRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!isStepValid()}
                className="px-8 py-3 bg-black text-white font-semibold rounded-xl hover:bg-gray-800 transition-all duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer"
              >
                Submit Testimony
              </button>
            )}
          </div>
        </div>

        {/* Footer Message */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">
            Your testimony is important. Thank you for sharing your story with
            us.
          </p>
        </div>
      </div>
    </div>
  );
}
