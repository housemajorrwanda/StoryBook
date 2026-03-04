"use client";

interface EmbedViewerProps {
  embedUrl: string;
  title?: string;
}

export default function EmbedViewer({ embedUrl, title }: EmbedViewerProps) {
  return (
    <iframe
      src={embedUrl}
      title={title ?? "Embedded Virtual Tour"}
      className="w-full h-full border-0"
      allowFullScreen
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; xr-spatial-tracking"
      loading="lazy"
    />
  );
}
