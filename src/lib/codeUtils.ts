/**
 * Ensures that Tailwind CSS and common icon libraries are properly loaded in the HTML code.
 * Also adds error handling for broken images.
 */
export const ensureTailwindCDN = (htmlCode: string): string => {
    if (!htmlCode) return '';

    // Check for existing Tailwind script CDN using regex
    const hasTailwindScript = /<script[^>]*src=["']https:\/\/cdn\.tailwindcss\.com[^>]*>/.test(htmlCode);
    // Check for existing Tailwind CSS link
    const hasTailwindCSS = /<link[^>]*tailwindcss[^>]*>|cdn\.jsdelivr\.net\/npm\/tailwindcss/i.test(htmlCode);

    // CDN resources - Using Tailwind CSS v2.2.19 (CSS bundle works with COEP)
    // Note: Tailwind v3 Play CDN uses scripts which are blocked by COEP in sandboxed iframes
    const tailwindScript = '<script src="https://cdn.tailwindcss.com"></script>';
    // Tailwind CSS v2.2.19 precompiled CSS (no COEP issues)
    const tailwindCSSFallback = '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css">';
    
    // Custom CSS for v3 colors not available in v2 (neutral palette)
    const tailwindV3Colors = `<style>
        /* Tailwind v3 Neutral Colors - Not in v2.2.19 */
        .bg-neutral-50 { background-color: #fafafa; }
        .bg-neutral-100 { background-color: #f5f5f5; }
        .bg-neutral-200 { background-color: #e5e5e5; }
        .bg-neutral-300 { background-color: #d4d4d4; }
        .bg-neutral-400 { background-color: #a3a3a3; }
        .bg-neutral-500 { background-color: #737373; }
        .bg-neutral-600 { background-color: #525252; }
        .bg-neutral-700 { background-color: #404040; }
        .bg-neutral-800 { background-color: #262626; }
        .bg-neutral-900 { background-color: #171717; }
        .bg-neutral-950 { background-color: #0a0a0a; }
        .text-neutral-50 { color: #fafafa; }
        .text-neutral-100 { color: #f5f5f5; }
        .text-neutral-200 { color: #e5e5e5; }
        .text-neutral-300 { color: #d4d4d4; }
        .text-neutral-400 { color: #a3a3a3; }
        .text-neutral-500 { color: #737373; }
        .text-neutral-600 { color: #525252; }
        .text-neutral-700 { color: #404040; }
        .text-neutral-800 { color: #262626; }
        .text-neutral-900 { color: #171717; }
        .text-neutral-950 { color: #0a0a0a; }
        .border-neutral-50 { border-color: #fafafa; }
        .border-neutral-100 { border-color: #f5f5f5; }
        .border-neutral-200 { border-color: #e5e5e5; }
        .border-neutral-300 { border-color: #d4d4d4; }
        .border-neutral-400 { border-color: #a3a3a3; }
        .border-neutral-500 { border-color: #737373; }
        .border-neutral-600 { border-color: #525252; }
        .border-neutral-700 { border-color: #404040; }
        .border-neutral-800 { border-color: #262626; }
        .border-neutral-900 { border-color: #171717; }
        .border-neutral-950 { border-color: #0a0a0a; }
        /* Zinc colors as fallback */
        .bg-zinc-50 { background-color: #fafafa; }
        .bg-zinc-100 { background-color: #f4f4f5; }
        .bg-zinc-200 { background-color: #e4e4e7; }
        .bg-zinc-300 { background-color: #d4d4d8; }
        .bg-zinc-400 { background-color: #a1a1aa; }
        .bg-zinc-500 { background-color: #71717a; }
        .bg-zinc-600 { background-color: #52525b; }
        .bg-zinc-700 { background-color: #3f3f46; }
        .bg-zinc-800 { background-color: #27272a; }
        .bg-zinc-900 { background-color: #18181b; }
        .bg-zinc-950 { background-color: #09090b; }
    </style>`;
    const viewportMeta = '<meta name="viewport" content="width=device-width, initial-scale=1.0">';
    const googleFonts = '<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">';

    // Lucide icons CDN
    const lucideScript = '<script src="https://unpkg.com/lucide@latest/dist/umd/lucide.min.js"></script>';

    const baseStyles = `<style>
        body { font-family: "Inter", sans-serif; margin: 0; padding: 0; background-color: inherit; overflow-x: hidden; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(51, 65, 85, 0.5); border-radius: 9999px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(71, 85, 105, 0.8); }
        .gradient-bg { background: linear-gradient(to right, #6366F1, #8B5CF6); }
        .gradient-text { background: linear-gradient(to right, #6366F1, #8B5CF6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        /* Fallback for broken images */
        img { max-width: 100%; height: auto; }
        img[src=""], img:not([src]) { opacity: 0; }
    </style>`;

    // Script to initialize icons and handle broken images (including COEP-blocked images)
    const initScript = `<script>
        // Prevent multiple script injections
        if (typeof window.noirInitDone === 'undefined') {
            window.noirInitDone = true;
            
            // Placeholder SVG for broken/COEP-blocked images
            var placeholderSVG = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect fill="%23e5e7eb" width="100" height="100"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%236b7280" font-size="14">Image</text></svg>';
            
            function handleImageError(img) {
                // Try to show placeholder instead of hiding
                img.src = placeholderSVG;
                img.style.opacity = '1';
            }
            
            document.addEventListener('DOMContentLoaded', function() {
                // Initialize Lucide icons if available
                if (typeof lucide !== 'undefined' && lucide.createIcons) {
                    try {
                        lucide.createIcons();
                    } catch(e) { console.warn('Lucide init error:', e); }
                }
                
                // Handle images - add error handler and crossorigin for external images
                document.querySelectorAll('img').forEach(function(img) {
                    // Add crossorigin for external images (helps with some COEP issues)
                    if (img.src && !img.src.startsWith('data:') && !img.src.startsWith('blob:')) {
                        img.crossOrigin = 'anonymous';
                    }
                    
                    img.onerror = function() {
                        handleImageError(this);
                    };
                    
                    // Check if image already failed
                    if (img.complete && (img.naturalWidth === 0 || img.naturalHeight === 0)) {
                        handleImageError(img);
                    }
                });
                
                // Handle COEP-blocked images that return 200 but can't be displayed
                setTimeout(function() {
                    document.querySelectorAll('img').forEach(function(img) {
                        if (img.complete && img.naturalWidth === 0) {
                            handleImageError(img);
                        }
                    });
                }, 1000);
            });
            
            window.addEventListener('load', function() {
                if (typeof lucide !== 'undefined' && lucide.createIcons) {
                    try { lucide.createIcons(); } catch(e) {}
                }
            });
        }
    </script>`;

    // Build injection for head
    let headInjection = viewportMeta + '\n' + googleFonts + '\n';
    if (!hasTailwindCSS) {
        headInjection += tailwindCSSFallback + '\n';
        headInjection += tailwindV3Colors + '\n';
    }
    if (!hasTailwindScript) {
        headInjection += tailwindScript + '\n';
        headInjection += tailwindV3Colors + '\n';
    }
    // Add Lucide if not present
    if (!/<script[^>]*lucide/i.test(htmlCode)) {
        headInjection += lucideScript + '\n';
    }
    headInjection += baseStyles;

    // Check document structure
    const hasHtml = /<html/i.test(htmlCode);
    const hasHead = /<head[^>]*>/i.test(htmlCode);
    const hasBody = /<body[^>]*>/i.test(htmlCode);

    let result = htmlCode;

    if (hasHtml && hasHead) {
        // Inject into head
        if (result.includes('</head>')) {
            result = result.replace('</head>', `${headInjection}\n</head>`);
        } else {
            result = result.replace(/<head[^>]*>/i, (match) => `${match}\n${headInjection}`);
        }
    } else if (hasHtml) {
        // Has HTML but no HEAD
        result = result.replace(/<html[^>]*>/i, (match) => `${match}\n<head>\n${headInjection}\n</head>`);
    } else {
        // No HTML structure - wrap completely
        return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
${headInjection}
</head>
<body class="min-h-screen">
${htmlCode}
${initScript}
</body>
</html>`;
    }

    // Add init script before </body> if body exists
    if (hasBody && result.includes('</body>')) {
        result = result.replace('</body>', `${initScript}\n</body>`);
    } else if (!result.includes(initScript)) {
        // Append to end
        result += initScript;
    }

    return result;
};

/**
 * Prepares HTML code for iframe preview by stripping problematic CDN scripts
 * and using only precompiled CSS to avoid COEP blocking issues.
 */
export const prepareCodeForPreview = (htmlCode: string): string => {
    if (!htmlCode) return '';

    // Remove Tailwind script CDN (causes COEP blocking in iframes)
    let result = htmlCode.replace(/<script[^>]*src=["']https:\/\/cdn\.tailwindcss\.com[^>]*><\/script>/gi, '');

    // Also remove any tailwind.config inline scripts that depend on the CDN
    result = result.replace(/<script>\s*tailwind\.config\s*=[\s\S]*?<\/script>/gi, '');

    // Check if precompiled Tailwind CSS is present
    const hasTailwindCSS = /cdn\.jsdelivr\.net\/npm\/tailwindcss/i.test(result);

    // Tailwind CSS v2.2.19 precompiled CSS (no COEP issues in sandboxed iframes)
    const tailwindCSS = '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css">';
    
    // Custom CSS for v3 colors not available in v2 (neutral palette)
    const tailwindV3Colors = `<style>
        /* Tailwind v3 Neutral Colors - Not in v2.2.19 */
        .bg-neutral-50 { background-color: #fafafa; }
        .bg-neutral-100 { background-color: #f5f5f5; }
        .bg-neutral-200 { background-color: #e5e5e5; }
        .bg-neutral-300 { background-color: #d4d4d4; }
        .bg-neutral-400 { background-color: #a3a3a3; }
        .bg-neutral-500 { background-color: #737373; }
        .bg-neutral-600 { background-color: #525252; }
        .bg-neutral-700 { background-color: #404040; }
        .bg-neutral-800 { background-color: #262626; }
        .bg-neutral-900 { background-color: #171717; }
        .bg-neutral-950 { background-color: #0a0a0a; }
        .text-neutral-50 { color: #fafafa; }
        .text-neutral-100 { color: #f5f5f5; }
        .text-neutral-200 { color: #e5e5e5; }
        .text-neutral-300 { color: #d4d4d4; }
        .text-neutral-400 { color: #a3a3a3; }
        .text-neutral-500 { color: #737373; }
        .text-neutral-600 { color: #525252; }
        .text-neutral-700 { color: #404040; }
        .text-neutral-800 { color: #262626; }
        .text-neutral-900 { color: #171717; }
        .text-neutral-950 { color: #0a0a0a; }
        .border-neutral-50 { border-color: #fafafa; }
        .border-neutral-100 { border-color: #f5f5f5; }
        .border-neutral-200 { border-color: #e5e5e5; }
        .border-neutral-300 { border-color: #d4d4d4; }
        .border-neutral-400 { border-color: #a3a3a3; }
        .border-neutral-500 { border-color: #737373; }
        .border-neutral-600 { border-color: #525252; }
        .border-neutral-700 { border-color: #404040; }
        .border-neutral-800 { border-color: #262626; }
        .border-neutral-900 { border-color: #171717; }
        .border-neutral-950 { border-color: #0a0a0a; }
        /* Zinc colors as fallback */
        .bg-zinc-50 { background-color: #fafafa; }
        .bg-zinc-100 { background-color: #f4f4f5; }
        .bg-zinc-200 { background-color: #e4e4e7; }
        .bg-zinc-300 { background-color: #d4d4d8; }
        .bg-zinc-400 { background-color: #a1a1aa; }
        .bg-zinc-500 { background-color: #71717a; }
        .bg-zinc-600 { background-color: #52525b; }
        .bg-zinc-700 { background-color: #3f3f46; }
        .bg-zinc-800 { background-color: #27272a; }
        .bg-zinc-900 { background-color: #18181b; }
        .bg-zinc-950 { background-color: #09090b; }
    </style>`;
    const viewportMeta = '<meta name="viewport" content="width=device-width, initial-scale=1.0">';
    const googleFonts = '<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">';

    // Lucide icons CDN (unpkg works fine in iframes)
    const lucideScript = '<script src="https://unpkg.com/lucide@latest/dist/umd/lucide.min.js"></script>';

    const baseStyles = `<style>
        body { font-family: "Inter", sans-serif; margin: 0; padding: 0; background-color: inherit; overflow-x: hidden; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(51, 65, 85, 0.5); border-radius: 9999px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(71, 85, 105, 0.8); }
        .gradient-bg { background: linear-gradient(to right, #6366F1, #8B5CF6); }
        .gradient-text { background: linear-gradient(to right, #6366F1, #8B5CF6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        img { max-width: 100%; height: auto; }
        img[src=""], img:not([src]) { opacity: 0; }
    </style>`;

    const initScript = `<script>
        // Prevent multiple script injections
        if (typeof window.noirInitDone === 'undefined') {
            window.noirInitDone = true;
            
            // Placeholder SVG for broken/COEP-blocked images
            var placeholderSVG = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect fill="%23e5e7eb" width="100" height="100"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%236b7280" font-size="14">Image</text></svg>';
            
            function handleImageError(img) {
                img.src = placeholderSVG;
                img.style.opacity = '1';
            }
            
            document.addEventListener('DOMContentLoaded', function() {
                if (typeof lucide !== 'undefined' && lucide.createIcons) {
                    try { lucide.createIcons(); } catch(e) { console.warn('Lucide init error:', e); }
                }
                
                // Handle images with COEP error handling
                document.querySelectorAll('img').forEach(function(img) {
                    if (img.src && !img.src.startsWith('data:') && !img.src.startsWith('blob:')) {
                        img.crossOrigin = 'anonymous';
                    }
                    img.onerror = function() { handleImageError(this); };
                    if (!img.complete || img.naturalHeight === 0) { handleImageError(img); }
                });
                
                setTimeout(function() {
                    document.querySelectorAll('img').forEach(function(img) {
                        if (img.complete && img.naturalWidth === 0) {
                            handleImageError(img);
                        }
                    });
                }, 1000);
            });
            window.addEventListener('load', function() {
                if (typeof lucide !== 'undefined' && lucide.createIcons) {
                    try { lucide.createIcons(); } catch(e) {}
                }
            });
        }
    </script>`;

    // Build head injection
    let headInjection = viewportMeta + '\n' + googleFonts + '\n';
    if (!hasTailwindCSS) {
        headInjection += tailwindCSS + '\n';
        headInjection += tailwindV3Colors + '\n';
    }
    if (!/lucide/i.test(result)) {
        headInjection += lucideScript + '\n';
    }
    headInjection += baseStyles;

    const hasHtml = /<html/i.test(result);
    const hasHead = /<head[^>]*>/i.test(result);
    const hasBody = /<body[^>]*>/i.test(result);

    if (hasHtml && hasHead) {
        if (result.includes('</head>')) {
            result = result.replace('</head>', `${headInjection}\n</head>`);
        } else {
            result = result.replace(/<head[^>]*>/i, (match) => `${match}\n${headInjection}`);
        }
    } else if (hasHtml) {
        result = result.replace(/<html[^>]*>/i, (match) => `${match}\n<head>\n${headInjection}\n</head>`);
    } else {
        return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
${headInjection}
</head>
<body class="min-h-screen">
${result}
${initScript}
</body>
</html>`;
    }

    if (hasBody && result.includes('</body>')) {
        result = result.replace('</body>', `${initScript}\n</body>`);
    } else if (!result.includes(initScript)) {
        result += initScript;
    }

    return result;
};
