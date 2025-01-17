// components/RichTextEditor.tsx
'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

const ReactMarkdown = dynamic(() => import('react-markdown'), { ssr: false });

export default function RichTextEditor() {
    const [content, setContent] = useState('');

    return (
        <div>
            <textarea
                className="w-full h-60 p-4 border"
                placeholder="Write your post in Markdown..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
            />
            <div className="mt-4 p-4 border">
                <ReactMarkdown>{content}</ReactMarkdown>
            </div>
        </div>
    );
}
