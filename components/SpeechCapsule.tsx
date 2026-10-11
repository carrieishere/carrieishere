import type { ReactNode } from "react";

/** Loading 页 “Hi, I'm right here.” 胶囊气泡。Hover 提示复用同一套视觉。 */
export const SPEECH_CAPSULE_CLASS =
  "whitespace-nowrap rounded-full bg-[#e6e6e6] px-[1.05rem] py-[0.55rem] tracking-wide font-creato-medium text-[0.82rem] leading-none text-black";

export function SpeechCapsuleTail() {
  return (
    <span
      aria-hidden
      className="absolute left-[12px] -bottom-[3px] h-[9px] w-[9px] rotate-[40deg] rounded-[1px] bg-[#e6e6e6]"
    />
  );
}

export function SpeechCapsule({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`relative ${SPEECH_CAPSULE_CLASS} ${className}`}>
      {children}
      <SpeechCapsuleTail />
    </div>
  );
}
