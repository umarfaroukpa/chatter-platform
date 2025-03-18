'use client';

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';

const ReactMarkdown = dynamic(() => import('react-markdown'), { ssr: false });

// Common emoji sets
const EMOJI_SETS = {
    'Smileys': ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇'],
    'Gestures': ['👍', '👎', '👌', '✌️', '🤞', '🤘', '🤙', '👈', '👉', '👆'],
    'Hearts': ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '💔', '❣️', '💕'],
    'Animals': ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯'],
    'Food': ['🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐', '🍈']
};

export default function RichTextEditor({ value = '', onChange }) {
    const [content, setContent] = useState(value);
    const [showPreview, setShowPreview] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [activeEmojiSet, setActiveEmojiSet] = useState('Smileys');
    const textareaRef = useRef(null);

    useEffect(() => {
        if (value !== content) {
            setContent(value);
        }
    }, [value, content]);

    const handleContentChange = (e) => {
        const newContent = e.target.value;
        setContent(newContent);
        onChange(newContent);
    };

    const insertEmoji = (emoji) => {
        if (textareaRef.current) {
            const textarea = textareaRef.current;
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;

            const newContent = content.substring(0, start) + emoji + content.substring(end);
            setContent(newContent);
            onChange(newContent);

            // Set cursor position after the inserted emoji
            setTimeout(() => {
                textarea.selectionStart = start + emoji.length;
                textarea.selectionEnd = start + emoji.length;
                textarea.focus();
            }, 0);
        }
    };

    const toggleBold = () => {
        if (textareaRef.current) {
            const textarea = textareaRef.current;
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;

            if (start === end) {
                // No selection, insert placeholder
                const newContent = content.substring(0, start) + '**bold text**' + content.substring(end);
                setContent(newContent);
                onChange(newContent);
            } else {
                // Wrap selection in bold markers
                const newContent = content.substring(0, start) + '**' + content.substring(start, end) + '**' + content.substring(end);
                setContent(newContent);
                onChange(newContent);
            }
        }
    };

    const toggleItalic = () => {
        if (textareaRef.current) {
            const textarea = textareaRef.current;
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;

            if (start === end) {
                // No selection, insert placeholder
                const newContent = content.substring(0, start) + '*italic text*' + content.substring(end);
                setContent(newContent);
                onChange(newContent);
            } else {
                // Wrap selection in italic markers
                const newContent = content.substring(0, start) + '*' + content.substring(start, end) + '*' + content.substring(end);
                setContent(newContent);
                onChange(newContent);
            }
        }
    };

    const insertLink = () => {
        const url = prompt('Enter URL:', 'https://');
        const text = prompt('Enter link text:', 'Link text');

        if (url && text && textareaRef.current) {
            const textarea = textareaRef.current;
            const start = textarea.selectionStart;

            const markdownLink = `[${text}](${url})`;
            const newContent = content.substring(0, start) + markdownLink + content.substring(start);

            setContent(newContent);
            onChange(newContent);
        }
    };

    return (
        <div className="border border-gray-300 rounded-md overflow-hidden">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-1 bg-gray-50 p-2 border-b border-gray-300">
                <button
                    type="button"
                    onClick={toggleBold}
                    className="p-1 hover:bg-gray-200 rounded"
                    title="Bold"
                >
                    <span className="font-bold">B</span>
                </button>
                <button
                    type="button"
                    onClick={toggleItalic}
                    className="p-1 hover:bg-gray-200 rounded"
                    title="Italic"
                >
                    <span className="italic">I</span>
                </button>
                <button
                    type="button"
                    onClick={insertLink}
                    className="p-1 hover:bg-gray-200 rounded"
                    title="Insert Link"
                >
                    🔗
                </button>
                <div className="relative">
                    <button
                        type="button"
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        className="p-1 hover:bg-gray-200 rounded"
                        title="Insert Emoji"
                    >
                        😀
                    </button>

                    {showEmojiPicker && (
                        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10 w-64">
                            <div className="flex overflow-x-auto border-b border-gray-300 p-1">
                                {Object.keys(EMOJI_SETS).map(setName => (
                                    <button
                                        key={setName}
                                        onClick={() => setActiveEmojiSet(setName)}
                                        className={`px-2 py-1 text-sm whitespace-nowrap ${activeEmojiSet === setName ? 'bg-blue-100 rounded' : ''}`}
                                    >
                                        {setName}
                                    </button>
                                ))}
                            </div>
                            <div className="p-2 flex flex-wrap">
                                {EMOJI_SETS[activeEmojiSet].map(emoji => (
                                    <button
                                        key={emoji}
                                        onClick={() => {
                                            insertEmoji(emoji);
                                            setShowEmojiPicker(false);
                                        }}
                                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded"
                                    >
                                        {emoji}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                <div className="ml-auto">
                    <button
                        type="button"
                        onClick={() => setShowPreview(!showPreview)}
                        className={`px-2 py-1 text-sm border rounded ${showPreview ? 'bg-blue-100 border-blue-300' : 'border-gray-300'}`}
                    >
                        {showPreview ? 'Edit' : 'Preview'}
                    </button>
                </div>
            </div>

            {/* Editor/Preview Area */}
            <div className="min-h-[200px]">
                {showPreview ? (
                    <div className="p-4 prose max-w-none min-h-[200px]">
                        <ReactMarkdown>{content}</ReactMarkdown>
                    </div>
                ) : (
                    <textarea
                        ref={textareaRef}
                        value={content}
                        onChange={handleContentChange}
                        className="w-full min-h-[200px] p-4 resize-y focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="Write your post content here... You can use Markdown formatting!"
                    />
                )}
            </div>
        </div>
    );
}