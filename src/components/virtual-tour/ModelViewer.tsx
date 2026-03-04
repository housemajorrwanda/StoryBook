"use client";

import { useEffect } from "react";

// TypeScript declaration for the <model-viewer> web component
declare global {
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          src?: string;
          alt?: string;
          "camera-controls"?: boolean | "";
          "auto-rotate"?: boolean | "";
          ar?: boolean | "";
          "shadow-intensity"?: string;
          "environment-image"?: string;
          exposure?: string;
          style?: React.CSSProperties;
          loading?: "auto" | "lazy" | "eager";
          poster?: string;
        },
        HTMLElement
      >;
    }
  }
}

const MODEL_VIEWER_SCRIPT =
  "https://ajax.googleapis.com/ajax/libs/model-viewer/3.5.0/model-viewer.min.js";

interface ModelViewerComponentProps {
  modelUrl: string;
  title?: string;
}

export default function ModelViewerComponent({ modelUrl, title }: ModelViewerComponentProps) {
  useEffect(() => {
    if (document.querySelector(`script[src="${MODEL_VIEWER_SCRIPT}"]`)) return;
    const script = document.createElement("script");
    script.type = "module";
    script.src = MODEL_VIEWER_SCRIPT;
    document.head.appendChild(script);
  }, []);

  return (
    <div className="w-full h-full bg-gray-950 relative">
      {/* @ts-expect-error model-viewer is a custom element */}
      <model-viewer
        src={modelUrl}
        alt={title ?? "3D Model"}
        camera-controls=""
        auto-rotate=""
        shadow-intensity="1"
        exposure="1"
        loading="eager"
        style={{ width: "100%", height: "100%", background: "transparent" }}
      />
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/50 text-xs select-none pointer-events-none">
        Drag to rotate • Scroll to zoom • Right-click to pan
      </div>
    </div>
  );
}
