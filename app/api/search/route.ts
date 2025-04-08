// /app/api/chat/route.ts
import { getGroupConfig } from '@/app/actions';
import { serverEnv } from '@/env/server';
import { xai } from '@ai-sdk/xai';
import { cohere } from '@ai-sdk/cohere'
import { mistral } from "@ai-sdk/mistral";
import CodeInterpreter from '@e2b/code-interpreter';
import FirecrawlApp from '@mendable/firecrawl-js';
import { tavily } from '@tavily/core';
import {
    convertToCoreMessages,
    smoothStream,
    streamText,
    tool,
    createDataStreamResponse,
    customProvider,
    generateObject,
    NoSuchToolError,
    generateText
} from 'ai';
import Exa from 'exa-js';
import { z } from 'zod';
import MemoryClient from 'mem0ai';
import { OpenAIStream } from 'openai-stream';
import openai from '@/lib/openai';

const scira = customProvider({
    languageModels: {
        'scira-default': xai('grok-2-1212'),
        'scira-vision': xai('grok-2-vision-1212'),
        'scira-cmd-a': cohere('command-a-03-2025'),
        'scira-mistral': mistral('mistral-small-latest'),
    }
})

interface XResult {
    id: string;
    url: string;
    title: string;
    author?: string;
    publishedDate?: string;
    text: string;
    highlights?: string[];
    tweetId: string;
}

interface MapboxFeature {
    id: string;
    name: string;
    formatted_address: string;
    geometry: {
        type: string;
        coordinates: number[];
    };
    feature_type: string;
    context: string;
    coordinates: number[];
    bbox: number[];
    source: string;
}

interface GoogleResult {
    place_id: string;
    formatted_address: string;
    geometry: {
        location: {
            lat: number;
            lng: number;
        };
        viewport: {
            northeast: {
                lat: number;
                lng: number;
            };
            southwest: {
                lat: number;
                lng: number;
            };
        };
    };
    types: string[];
    address_components: Array<{
        long_name: string;
        short_name: string;
        types: string[];
    }>;
}

interface VideoDetails {
    title?: string;
    author_name?: string;
    author_url?: string;
    thumbnail_url?: string;
    type?: string;
    provider_name?: string;
    provider_url?: string;
}

interface VideoResult {
    videoId: string;
    url: string;
    details?: VideoDetails;
    captions?: string;
    timestamps?: string[];
    views?: string;
    likes?: string;
    summary?: string;
}

function sanitizeUrl(url: string): string {
    return url.replace(/\s+/g, '%20');
}

async function isValidImageUrl(url: string): Promise<{ valid: boolean; redirectedUrl?: string }> {
    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000);

        const response = await fetch(url, {
            method: 'HEAD',
            signal: controller.signal,
            headers: {
                'Accept': 'image/*',
                'User-Agent': 'Mozilla/5.0 (compatible; ImageValidator/1.0)'
            },
            redirect: 'follow' // Ensure redirects are followed
        });

        clearTimeout(timeout);

        // Log response details for debugging
        console.log(`Image validation [${url}]: status=${response.status}, content-type=${response.headers.get('content-type')}`);

        // Capture redirected URL if applicable
        const redirectedUrl = response.redirected ? response.url : undefined;

        // Check if we got redirected (for logging purposes)
        if (response.redirected) {
            console.log(`Image was redirected from ${url} to ${redirectedUrl}`);
        }

        // Handle specific response codes
        if (response.status === 404) {
            console.log(`Image not found (404): ${url}`);
            return { valid: false };
        }

        if (response.status === 403) {
            console.log(`Access forbidden (403) - likely CORS issue: ${url}`);

            // Try to use proxy instead of whitelisting domains
            try {
                // Attempt to handle CORS blocked images by trying to access via proxy
                const controller = new AbortController();
                const proxyTimeout = setTimeout(() => controller.abort(), 5000);

                const proxyResponse = await fetch(`/api/proxy-image?url=${encodeURIComponent(url)}`, {
                    method: 'HEAD',
                    signal: controller.signal
                });

                clearTimeout(proxyTimeout);

                if (proxyResponse.ok) {
                    const contentType = proxyResponse.headers.get('content-type');
                    const proxyRedirectedUrl = proxyResponse.headers.get('x-final-url') || undefined;

                    if (contentType && contentType.startsWith('image/')) {
                        console.log(`Proxy validation successful for ${url}`);
                        return {
                            valid: true,
                            redirectedUrl: proxyRedirectedUrl || redirectedUrl
                        };
                    }
                }
            } catch (proxyError) {
                console.error(`Proxy validation failed for ${url}:`, proxyError);
            }
            return { valid: false };
        }

        if (response.status >= 400) {
            console.log(`Image request failed with status ${response.status}: ${url}`);
            return { valid: false };
        }

        // Check content type to ensure it's actually an image
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.startsWith('image/')) {
            console.log(`Invalid content type for image: ${contentType}, url: ${url}`);
            return { valid: false };
        }

        return { valid: true, redirectedUrl };
    } catch (error) {
        // Check if error is related to CORS
        const errorMsg = error instanceof Error ? error.message : String(error);

        if (errorMsg.includes('CORS') || errorMsg.includes('blocked by CORS policy')) {
            console.error(`CORS error for ${url}:`, errorMsg);

            // Try to use proxy instead of whitelisting domains
            try {
                // Attempt to handle CORS blocked images by trying to access via proxy
                const controller = new AbortController();
                const proxyTimeout = setTimeout(() => controller.abort(), 5000);

                const proxyResponse = await fetch(`/api/proxy-image?url=${encodeURIComponent(url)}`, {
                    method: 'HEAD',
                    signal: controller.signal
                });

                clearTimeout(proxyTimeout);

                if (proxyResponse.ok) {
                    const contentType = proxyResponse.headers.get('content-type');
                    const proxyRedirectedUrl = proxyResponse.headers.get('x-final-url') || undefined;

                    if (contentType && contentType.startsWith('image/')) {
                        console.log(`Proxy validation successful for ${url}`);
                        return { valid: true, redirectedUrl: proxyRedirectedUrl };
                    }
                }
            } catch (proxyError) {
                console.error(`Proxy validation failed for ${url}:`, proxyError);
            }
        }

        // Log the specific error
        console.error(`Image validation error for ${url}:`, errorMsg);
        return { valid: false };
    }
}


const extractDomain = (url: string): string => {
    const urlPattern = /^https?:\/\/([^/?#]+)(?:[/?#]|$)/i;
    return url.match(urlPattern)?.[1] || url;
};

const deduplicateByDomainAndUrl = <T extends { url: string }>(items: T[]): T[] => {
    const seenDomains = new Set<string>();
    const seenUrls = new Set<string>();

    return items.filter(item => {
        const domain = extractDomain(item.url);
        const isNewUrl = !seenUrls.has(item.url);
        const isNewDomain = !seenDomains.has(domain);

        if (isNewUrl && isNewDomain) {
            seenUrls.add(item.url);
            seenDomains.add(domain);
            return true;
        }
        return false;
    });
};

// Modify the POST function to use the new handler
export async function POST(req: Request) {
    try {
        const input = await req.json();
        const { messages, group = 'web' } = input;

        console.log('Search request:', {
            group,
            messageCount: messages.length
        });

        const { tools, systemPrompt } = await getGroupConfig(group);
        
        if (!tools || tools.length === 0) {
            console.error('No tools configured for group:', group);
            throw new Error(`No tools configured for group: ${group}`);
        }

        console.log('Using tools:', tools);

        const dataStream = new TransformStream();
        const encoder = new TextEncoder();
        const writer = dataStream.writable.getWriter();

        const stream = OpenAIStream(
            await openai.chat.completions.create({
                model: 'gpt-4-turbo-preview',
                messages: [
                    { role: 'system', content: systemPrompt },
                    ...convertToCoreMessages(messages)
                ],
                stream: true,
                temperature: 0.5,
                tools: tools.map(tool => ({
                    type: 'function',
                    function: {
                        name: tool,
                        parameters: {}
                    }
                }))
            }),
            {
                async onFinal() {
                    await writer.close();
                },
                async onResponse(response) {
                    console.log('Got response:', {
                        group,
                        toolsUsed: response.tools?.length || 0
                    });
                },
                onError(error) {
                    console.error('Stream error:', error);
                    writer.abort(error);
                }
            }
        );

        return new Response(stream);
    } catch (error) {
        console.error('Search error:', error);
        return new Response(
            JSON.stringify({
                error: 'An error occurred during search',
                details: error instanceof Error ? error.message : 'Unknown error'
            }),
            {
                status: 500,
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
    }
}

extreme_search: tool({
    description: 'Perform an extreme search with multiple sources.',
    parameters: z.object({
        query: z.string().describe('The search query'),
        depth: z.enum(['basic', 'advanced']).describe('Search depth').default('advanced'),
    }),
    execute: async ({ query, depth }) => {
        try {
            console.log('Starting extreme search:', { query, depth });
            
            // Validate all required API keys
            const requiredKeys = {
                TAVILY_API_KEY: serverEnv.TAVILY_API_KEY,
                EXA_API_KEY: serverEnv.EXA_API_KEY,
                XAI_API_KEY: serverEnv.XAI_API_KEY
            };

            const missingKeys = Object.entries(requiredKeys)
                .filter(([_, value]) => !value)
                .map(([key]) => key);

            if (missingKeys.length > 0) {
                throw new Error(`Missing required API keys: ${missingKeys.join(', ')}`);
            }

            // Initialize API clients
            const tvly = tavily({ apiKey: serverEnv.TAVILY_API_KEY });
            const exa = new Exa(serverEnv.EXA_API_KEY);

            // Perform searches in parallel
            const [webResults, academicResults] = await Promise.all([
                tvly.search(query, {
                    searchDepth: depth,
                    includeAnswer: true,
                }).catch(error => {
                    console.error('Tavily search error:', error);
                    return { results: [] };
                }),
                exa.searchAndContents(query, {
                    type: 'keyword',
                    numResults: 5,
                    includeDomains: [
                        'arxiv.org',
                        'scholar.google.com',
                        'researchgate.net',
                        'academia.edu'
                    ]
                }).catch(error => {
                    console.error('Exa search error:', error);
                    return { results: [] };
                })
            ]);

            return {
                web: webResults.results.map(r => ({
                    title: r.title || '',
                    url: r.url || '',
                    content: r.content || ''
                })),
                academic: academicResults.results.map(r => ({
                    title: r.title || '',
                    url: r.url || '',
                    content: r.text || ''
                }))
            };
        } catch (error) {
            console.error('Extreme search error:', error);
            throw error;
        }
    }
}),