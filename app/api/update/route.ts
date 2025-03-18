import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const articles = [
            { id: 1, title: "New AI Model Released by Anthropic", url: "https://example.com/ai-news", source: "Tech Crunch" },
            { id: 2, title: "The Future of Web Development: What's Next?", url: "https://example.com/web-dev", source: "Wired" },
            { id: 3, title: "Cybersecurity Trends for Developers", url: "https://example.com/security", source: "TechRadar" },
            { id: 4, title: "React 20 Features: What's New", url: "https://example.com/react", source: "Medium" },
            { id: 5, title: "The Rise of No-Code Development Platforms", url: "https://example.com/no-code", source: "Forbes Tech" },
            { id: 6, title: "Machine Learning for Frontend Developers", url: "https://example.com/ml-frontend", source: "Dev.to" },
            { id: 7, title: "Web Performance Optimization Techniques", url: "https://example.com/performance", source: "Smashing Magazine" },
            { id: 8, title: "TypeScript 5.5: Latest Features", url: "https://example.com/typescript", source: "Microsoft Blog" }
        ];

        return NextResponse.json({
            success: true,
            articles
        });
    } catch (error) {
        console.error("Error in tech news API:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch tech news" },
            { status: 500 }
        );
    }
}