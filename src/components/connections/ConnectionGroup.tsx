"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { MyTestimonyConnection } from "@/types/testimonies";
import { generateTestimonySlug } from "@/utils/testimony.utils";
import ConnectionCard from "./ConnectionCard";

interface ConnectionGroupProps {
  group: {
    testimony: { id: number; eventTitle: string };
    connections: MyTestimonyConnection[];
  };
}

export default function ConnectionGroup({ group }: ConnectionGroupProps) {
  const slug = generateTestimonySlug(
    group.testimony.id,
    group.testimony.eventTitle,
  );

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      {/* Group header */}
      <div className="px-5 sm:px-6 py-4 sm:py-5 border-b border-gray-100 bg-gray-50/50">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">
              Your Testimony
            </p>
            <Link
              href={`/testimonies/${slug}`}
              className="group/title inline-flex items-center gap-2 max-w-full"
            >
              <h2 className="text-base sm:text-lg font-bold text-gray-900 group-hover/title:text-gray-600 transition-colors truncate">
                {group.testimony.eventTitle}
              </h2>
              <ChevronRight className="w-4 h-4 text-gray-400 group-hover/title:text-gray-600 shrink-0" />
            </Link>
          </div>
          <span className="text-xs font-medium text-gray-400 bg-gray-100 px-3 py-1.5 rounded-full shrink-0">
            {group.connections.length}{" "}
            {group.connections.length === 1 ? "connection" : "connections"}
          </span>
        </div>
      </div>

      {/* Connection cards */}
      <div className="p-4 sm:p-6 space-y-4">
        {group.connections.map((conn, idx) => (
          <ConnectionCard
            key={`${conn.connectedTestimony.id}-${idx}`}
            connection={conn}
          />
        ))}
      </div>
    </div>
  );
}
