"use client";

import { useState } from "react";

interface EmojiPickerProps {
    onEmojiSelect: (emoji: string) => void;
}

export const EmojiPicker = ({ onEmojiSelect }: EmojiPickerProps) => {
    // Common emojis grouped by category
    const emojiGroups = [
        {
            name: "Faces",
            emojis: ["😀", "😂", "😊", "😍", "🥰", "😎", "🤔", "😁", "🙂", "😢"]
        },
        {
            name: "Hands",
            emojis: ["👍", "👎", "👏", "🙌", "👋", "✌️", "🤝", "👊", "✋", "🤞"]
        },
        {
            name: "Objects",
            emojis: ["❤️", "🔥", "⭐", "🎉", "🎂", "🍕", "☕", "🍺", "🏆", "💯"]
        }
    ];

    const [activeCategory, setActiveCategory] = useState(emojiGroups[0].name);

    return (
        <div className="bg-white border rounded-lg shadow-lg p-2 w-64">
            {/* Category Tabs */}
            <div className="flex border-b mb-2">
                {emojiGroups.map(group => (
                    <button
                        key={group.name}
                        className={`px-2 py-1 text-sm ${activeCategory === group.name
                            ? 'border-b-2 border-blue-500 text-blue-500'
                            : 'text-gray-500 hover:text-gray-700'}`}
                        onClick={() => setActiveCategory(group.name)}
                    >
                        {group.name}
                    </button>
                ))}
            </div>

            {/* Emoji Grid */}
            <div className="grid grid-cols-5 gap-1">
                {emojiGroups.find(g => g.name === activeCategory)?.emojis.map(emoji => (
                    <button
                        key={emoji}
                        className="text-xl p-1 hover:bg-gray-100 rounded"
                        onClick={() => onEmojiSelect(emoji)}
                    >
                        {emoji}
                    </button>
                ))}
            </div>
        </div>
    );
};