export const ITEM_HOVER_HINTS = {
  laptop: "Just some work, nothing special.",
  notebook: "Hey, don't touch that. Kinda personal.",
  flower1: "I like flowers",
  flower2: "You want one?",
  camera: "Sometimes I just like wandering around.",
  earphones: "I luv music. How about you?",
  pick: "So here it is! I'm always losing my picks.",
  lipBalm: "Yeah, daily essentials.",
  perfume: "Been wearing this one a lot lately.",
} as const;

export type ItemHoverHintId = keyof typeof ITEM_HOVER_HINTS;

/** 首页物品 id → 提示词。bag 本身不入表，耳机走独立热区。 */
export const HOMEPAGE_ITEM_HINT_KEY: Record<string, ItemHoverHintId> = {
  laptop: "laptop",
  notebook: "notebook",
  flower1: "flower1",
  flower2: "flower2",
  camera: "camera",
  pick: "pick",
  lipbalm: "lipBalm",
  perfume: "perfume",
};
