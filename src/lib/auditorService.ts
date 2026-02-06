export interface AuditResult {
    score: number;
    issues: {
        type: 'seo' | 'accessibility' | 'best-practice';
        severity: 'low' | 'medium' | 'high';
        message: string;
        suggestion: string;
    }[];
    metrics: {
        totalTags: number;
        imageCount: number;
        hasAltTags: boolean;
        headingStructure: boolean;
    };
}

export const auditorService = {
    async auditCode(html: string): Promise<AuditResult> {
        const issues: AuditResult['issues'] = [];
        let score = 100;

        // 1. Basic SEO Checks
        if (!html.includes('<title>')) {
            issues.push({
                type: 'seo',
                severity: 'high',
                message: 'Missing <title> tag',
                suggestion: 'Add a descriptive title inside the <head> section.'
            });
            score -= 15;
        }

        if (!html.includes('<meta name="description"')) {
            issues.push({
                type: 'seo',
                severity: 'medium',
                message: 'Missing meta description',
                suggestion: 'Add a meta description to improve search engine snippets.'
            });
            score -= 10;
        }

        // 2. Accessibility Checks
        const imgTags = html.match(/<img/g) || [];
        const altTags = html.match(/alt=/g) || [];
        
        if (imgTags.length > altTags.length) {
            issues.push({
                type: 'accessibility',
                severity: 'high',
                message: `${imgTags.length - altTags.length} images missing alt text`,
                suggestion: 'Add alt="..." attributes to all images for screen readers.'
            });
            score -= (imgTags.length - altTags.length) * 5;
        }

        if (!html.includes('<h1')) {
            issues.push({
                type: 'accessibility',
                severity: 'medium',
                message: 'Missing <h1> tag',
                suggestion: 'Ensure each page has one primary heading for structure.'
            });
            score -= 10;
        }

        // 3. Best Practices
        if (html.includes('style="')) {
            issues.push({
                type: 'best-practice',
                severity: 'low',
                message: 'Inline styles detected',
                suggestion: 'Move styles to Tailwind classes or a separate CSS block.'
            });
            score -= 5;
        }

        return {
            score: Math.max(0, score),
            issues,
            metrics: {
                totalTags: (html.match(/<[a-zA-Z]/g) || []).length,
                imageCount: imgTags.length,
                hasAltTags: imgTags.length === altTags.length,
                headingStructure: html.includes('<h1')
            }
        };
    }
};
