"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useChatEasterEgg } from "@/components/chat/ChatEasterEggProvider";
import { SpeechCapsule } from "@/components/SpeechCapsule";
import {
  ITEM_HOVER_HINTS,
  type ItemHoverHintId,
} from "@/lib/itemHoverHints";
import type { ModalType } from "@/types";

interface ItemHoverHintActions {
  showHint: (id: ItemHoverHintId) => void;
  hideHint: () => void;
}

const noopActions: ItemHoverHintActions = {
  showHint: () => {},
  hideHint: () => {},
};

const ItemHoverHintActionsContext =
  createContext<ItemHoverHintActions>(noopActions);

const ItemHoverHintViewContext = createContext<{
  showBubble: boolean;
  text: string;
}>({ showBubble: false, text: "" });

/** 物品层只用这个：引用稳定，悬停不会拖着整页物品重绘。 */
export function useShowItemHint() {
  return useContext(ItemHoverHintActionsContext);
}

export function ItemHoverHintProvider({
  children,
  sceneReady,
  activeModal,
}: {
  children: ReactNode;
  sceneReady: boolean;
  activeModal: ModalType;
}) {
  const isChatOpen = useChatEasterEgg()?.isChatOpen === true;
  const blocked = !sceneReady || activeModal !== "NONE" || isChatOpen;

  const timerRef = useRef<number>(0);
  const blockedRef = useRef(blocked);
  blockedRef.current = blocked;
  const [showBubble, setShowBubble] = useState(false);
  const [text, setText] = useState("");

  const hideHint = useCallback(() => {
    window.clearTimeout(timerRef.current);
    setShowBubble(false);
  }, []);

  const showHint = useCallback((id: ItemHoverHintId) => {
    if (blockedRef.current) return;
    window.clearTimeout(timerRef.current);
    setText(ITEM_HOVER_HINTS[id]);
    setShowBubble(true);
    timerRef.current = window.setTimeout(() => {
      setShowBubble(false);
    }, 5000);
  }, []);

  useEffect(() => {
    if (!blocked) return;
    hideHint();
  }, [blocked, hideHint]);

  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  const actions = useMemo(
    () => ({ showHint, hideHint }),
    [showHint, hideHint],
  );

  const view = useMemo(
    () => ({ showBubble: showBubble && !blocked, text }),
    [showBubble, blocked, text],
  );

  return (
    <ItemHoverHintActionsContext.Provider value={actions}>
      <ItemHoverHintViewContext.Provider value={view}>
        {children}
      </ItemHoverHintViewContext.Provider>
    </ItemHoverHintActionsContext.Provider>
  );
}

/** 全站唯一订阅气泡文案的节点。 */
export function TitleHoverBubble() {
  const { showBubble, text } = useContext(ItemHoverHintViewContext);

  return (
    <AnimatePresence>
      {showBubble && text ? (
        <motion.div
          key={text}
          initial={{ opacity: 0, y: 5, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 5, scale: 0.9 }}
          transition={{ duration: 0.15 }}
          aria-live="polite"
          className="pointer-events-none absolute left-60 -top-10 z-20 ml-2"
        >
          <SpeechCapsule>{text}</SpeechCapsule>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
