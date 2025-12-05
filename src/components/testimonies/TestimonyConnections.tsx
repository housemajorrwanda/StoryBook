"use client";

import Link from "next/link";
import { LuLink2, LuUser, LuMapPin, LuMail, LuArrowRight, LuSparkles } from "react-icons/lu";
import { TestimonyConnection } from "@/types/testimonies";

interface TestimonyConnectionsProps {
  connections: TestimonyConnection[];
  currentTestimonyId?: number;
}

export default function TestimonyConnections({
  connections,
}: TestimonyConnectionsProps) {
  if (!connections || connections.length === 0) {
    return null;
  }

  // Get connection type badge color
  const getConnectionTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "strong":
        return "bg-green-100 text-green-700 border-green-200";
      case "moderate":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "weak":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "fallback":
        return "bg-gray-100 text-gray-700 border-gray-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  // Format accuracy score
  const formatAccuracyScore = (score: number) => {
    if (score === 0) return "N/A";
    return `${(score * 100).toFixed(0)}%`;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 bg-linear-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <LuSparkles className="w-6 h-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 text-xl">AI Connections</h3>
            <p className="text-sm text-gray-600 mt-1">
              Related testimonies discovered by AI ({connections.length})
            </p>
          </div>
        </div>
      </div>

      {/* Connections List */}
      <div className="p-6 space-y-4">
        {connections.map((connection) => (
          <Link
            key={connection.id}
            href={`/testimonies/${connection.id}`}
            className="block group"
          >
            <div className="p-5 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 bg-white group-hover:bg-blue-50/30">
              <div className="flex items-start justify-between gap-4">
                {/* Left: Content */}
                <div className="flex-1 min-w-0">
                  {/* Connection Type Badge */}
                  <div className="flex items-center gap-2 mb-3">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getConnectionTypeColor(
                        connection.connectionDetails.connectionType
                      )}`}
                    >
                      <LuLink2 className="w-3 h-3" />
                      {connection.connectionDetails.connectionType === "fallback"
                        ? "Related"
                        : connection.connectionDetails.connectionType}
                    </span>
                    {connection.connectionDetails.accuracyScore > 0 && (
                      <span className="text-xs text-gray-500 font-medium">
                        {formatAccuracyScore(connection.connectionDetails.accuracyScore)} match
                      </span>
                    )}
                  </div>

                  {/* Event Title */}
                  <h4 className="font-bold text-gray-900 text-lg mb-2 group-hover:text-blue-700 transition-colors line-clamp-2">
                    {connection.eventTitle}
                  </h4>

                  {/* Event Description */}
                  {connection.eventDescription && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {connection.eventDescription}
                    </p>
                  )}

                  {/* Connection Reason */}
                  {connection.connectionDetails.connectionReason && (
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                      <span className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                      <span>{connection.connectionDetails.connectionReason}</span>
                    </div>
                  )}

                  {/* Contact Info (if public) */}
                  {connection.contactInfo && (
                    <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <LuUser className="w-4 h-4 text-gray-400" />
                        <span className="font-medium">{connection.contactInfo.fullName}</span>
                      </div>
                      {connection.contactInfo.residentPlace && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <LuMapPin className="w-4 h-4 text-gray-400" />
                          <span>{connection.contactInfo.residentPlace}</span>
                        </div>
                      )}
                      {connection.contactInfo.email && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <LuMail className="w-4 h-4 text-gray-400" />
                          <span className="truncate max-w-[200px]">{connection.contactInfo.email}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Right: Arrow */}
                <div className="shrink-0">
                  <div className="w-10 h-10 rounded-full bg-gray-100 group-hover:bg-blue-100 flex items-center justify-center transition-colors">
                    <LuArrowRight className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Footer Info */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          Connections are discovered using AI analysis. Click any connection to view the related testimony.
        </p>
      </div>
    </div>
  );
}

