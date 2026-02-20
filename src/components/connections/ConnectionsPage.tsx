"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Link2, AlertCircle, Share2 } from "lucide-react";
import { useMyConnections } from "@/hooks/useTestimonies";
import { isAuthenticated } from "@/lib/decodeToken";
import type { MyTestimonyConnection } from "@/types/testimonies";
import ConnectionGroup from "./ConnectionGroup";
import ConnectionsSkeleton from "./ConnectionsSkeleton";

function groupByTestimony(connections: MyTestimonyConnection[]) {
  const grouped = new Map<
    number,
    {
      testimony: { id: number; eventTitle: string };
      connections: MyTestimonyConnection[];
    }
  >();

  for (const conn of connections) {
    const key = conn.myTestimony.id;
    if (!grouped.has(key)) {
      grouped.set(key, {
        testimony: conn.myTestimony,
        connections: [],
      });
    }
    grouped.get(key)!.connections.push(conn);
  }

  return Array.from(grouped.values());
}

export default function ConnectionsPageContent() {
  const [authReady, setAuthReady] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setLoggedIn(isAuthenticated());
      setAuthReady(true);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  const { data, isLoading, error } = useMyConnections(loggedIn);

  // Wait for auth check
  if (!authReady) {
    return <ConnectionsSkeleton />;
  }

  // Not logged in
  if (!loggedIn) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-4">
        <div className="text-center max-w-sm">
          <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <Link2 className="w-7 h-7 text-gray-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Sign in to view connections
          </h2>
          <p className="text-sm text-gray-500 mb-6 leading-relaxed">
            Connections show how your testimonies relate to others through AI
            analysis. Sign in to see your connections.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
          >
            Sign in
          </Link>
        </div>
      </div>
    );
  }

  // Loading
  if (isLoading) {
    return <ConnectionsSkeleton />;
  }

  // Error
  if (error) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-4">
        <div className="text-center max-w-sm">
          <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-6 h-6 text-red-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Failed to load connections
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Something went wrong. Please try again later.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to stories
          </Link>
        </div>
      </div>
    );
  }

  const connections = data ?? [];
  const groups = groupByTestimony(connections);

  // Empty state
  if (groups.length === 0) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-4">
        <div className="text-center max-w-sm">
          <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <Link2 className="w-7 h-7 text-gray-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            No connections yet
          </h2>
          <p className="text-sm text-gray-500 mb-6 leading-relaxed">
            Once you share a testimony, our AI will discover connections with
            other stories. Start by sharing your testimony.
          </p>
          <Link
            href="/share-testimony"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
          >
            <Share2 className="w-4 h-4" />
            Share Testimony
          </Link>
        </div>
      </div>
    );
  }

  // Success
  return (
    <div className="min-h-screen bg-[#fafafa]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-20 py-8 md:py-12">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Home
        </Link>

        {/* Page header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center">
              <Link2 className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
              My Connections
            </h1>
          </div>
          <p className="text-gray-500 text-base md:text-lg mt-2 max-w-2xl">
            Testimonies that share connections with your stories, discovered
            through AI analysis.
          </p>
          <div className="flex items-center gap-4 mt-4 text-sm text-gray-400">
            <span>
              {groups.length}{" "}
              {groups.length === 1 ? "testimony" : "testimonies"} with
              connections
            </span>
            <span className="w-1 h-1 rounded-full bg-gray-300" />
            <span>
              {connections.length} total{" "}
              {connections.length === 1 ? "connection" : "connections"}
            </span>
          </div>
        </div>

        {/* Connection groups */}
        <div className="space-y-8">
          {groups.map((group) => (
            <ConnectionGroup key={group.testimony.id} group={group} />
          ))}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-xs text-gray-400">
            Connections are discovered using AI analysis of testimony content,
            dates, and locations.
          </p>
        </div>
      </div>
    </div>
  );
}
