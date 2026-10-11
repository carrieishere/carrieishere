"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import { DynamicLine } from "@/components/chat/DynamicLine";
import { InteractiveChatModal } from "@/components/chat/InteractiveChatModal";
import { useDynamicLine } from "@/hooks/useDynamicLine";

interface ChatEasterEggContextValue {
  isChatOpen: boolean;
  openChat: () => void;
  closeChat: () => void;
  toggleChat: () => void;
  setChatUnlocked: (unlocked: boolean) => void;
  anchorRef: RefObject<HTMLSpanElement>;
}

const ChatEasterEggContext = createContext<ChatEasterEggContextValue | null>(null);

export function useChatEasterEgg() {
  return useContext(ChatEasterEggContext);
}

export function ChatEasterEggProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const unlockedRef = useRef(false);
  const anchorRef = useRef<HTMLSpanElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const line = useDynamicLine(anchorRef, closeButtonRef, isOpen);

  const openChat = useCallback(() => {
    if (!unlockedRef.current) return;
    setIsOpen(true);
  }, []);
  const closeChat = useCallback(() => {
    setIsOpen(false);
  }, []);
  const toggleChat = useCallback(() => {
    if (!unlockedRef.current) return;
    setIsOpen((open) => !open);
  }, []);
  const setChatUnlocked = useCallback((unlocked: boolean) => {
    unlockedRef.current = unlocked;
    if (!unlocked) setIsOpen(false);
  }, []);

  const value = useMemo(
    () => ({
      isChatOpen: isOpen,
      openChat,
      closeChat,
      toggleChat,
      setChatUnlocked,
      anchorRef,
    }),
    [isOpen, openChat, closeChat, toggleChat, setChatUnlocked],
  );

  return (
    <ChatEasterEggContext.Provider value={value}>
      {children}
      {isOpen ? (
        <>
          <InteractiveChatModal closeButtonRef={closeButtonRef} onClose={closeChat} />
          <DynamicLine {...line} />
        </>
      ) : null}
    </ChatEasterEggContext.Provider>
  );
}
