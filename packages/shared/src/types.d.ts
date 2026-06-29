export interface HumanitarianProvider {
    id: string;
    display_name: string;
    website: string;
    description: string;
    logo: string;
    status: 'active' | 'inactive' | 'degraded';
    adapter: string;
    capabilities: string[];
}
export interface NormalizedSearchResult {
    provider: string;
    provider_id: string;
    type: string;
    title: string;
    subtitle?: string;
    status?: string;
    location?: [number, number];
    last_update?: string;
    confidence?: number;
    url: string;
    thumbnail?: string;
    metadata?: Record<string, any>;
}
export interface SubmissionPackage {
    type: string;
    payload: Record<string, any>;
    timestamp: string;
}
//# sourceMappingURL=types.d.ts.map