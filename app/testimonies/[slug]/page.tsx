"use client";

import { notFound } from "next/navigation";
import { use } from "react";
import TestimonyDetail from "@/components/testimonies/TestimonyDetail";
import { parseTestimonySlug } from "@/utils/testimony.utils";

interface TestimonyPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function TestimonyPage({ params }: TestimonyPageProps) {
  const { slug } = use(params);
  const id = parseTestimonySlug(slug);

  if (!id) {
    notFound();
  }

  return <TestimonyDetail id={id} />;
}
