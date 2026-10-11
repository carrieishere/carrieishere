"use client";

import { ChevronDown } from "lucide-react";

function SectionLabel({ children }: { children: string }) {
  return (
    <p className="mb-2 flex items-center gap-1 text-sm font-semibold text-gray-800">
      <ChevronDown size={14} />
      {children}
    </p>
  );
}

function ImageSlot({ className }: { className: string }) {
  return <div className={`rounded-lg bg-neutral-200 ${className}`} />;
}

export function ProjectWindowBody() {
  return (
    <div className="space-y-5 text-[13px] leading-relaxed text-gray-600">
      <div className="space-y-3">
        <p>
          Project notes and captions will live here. This block is a layout
          placeholder for the written introduction.
        </p>
        <p>
          Additional paragraphs can stack in this scrollable column without
          changing the window chrome.
        </p>
      </div>

      <div>
        <SectionLabel>Details:</SectionLabel>
        <p>
          <span className="font-medium text-gray-800">Type: </span>
          Art Direction &gt; Cover Design &gt; Typography &gt; Photography
        </p>
      </div>

      <div>
        <SectionLabel>Preview:</SectionLabel>
        <ImageSlot className="aspect-[16/10] w-full" />
      </div>
    </div>
  );
}

export function SimpleWindowBody({ label }: { label: string }) {
  return (
    <div className="space-y-3 text-[13px] leading-relaxed text-gray-600">
      <p>{label} window layout is ready. Content can be added in this slot.</p>
      <ImageSlot className="aspect-[16/10] w-full" />
    </div>
  );
}
