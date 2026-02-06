import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { supabase } from './supabase';

export type DeployPlatform = 'vercel' | 'netlify' | 'github-pages';

export interface DeployConfig {
    platform: DeployPlatform;
    projectName: string;
    framework: string;
}

// UTF-8 safe base64 encoding helper
const encodeBase64Utf8 = (str: string): string => {
    // Convert string to UTF-8 bytes, then to base64
    const bytes = new TextEncoder().encode(str);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
};

export const deploymentService = {
    // Get saved integration token from Supabase
    async getSavedToken(platform: DeployPlatform): Promise<string | null> {
        try {
            const provider = platform === 'github-pages' ? 'github' : platform;

            const { data, error } = await supabase
                .from('integrations')
                .select('config')
                .eq('provider', provider)
                .eq('is_active', true)
                .single();

            if (error || !data) {
                return null;
            }

            return data.config?.token || null;
        } catch (error) {
            console.error('Failed to get saved token:', error);
            return null;
        }
    },

    // Check if user has saved token for platform
    async hasSavedToken(platform: DeployPlatform): Promise<boolean> {
        const token = await this.getSavedToken(platform);
        return token !== null;
    },
    // Generate configuration files based on platform
    getConfigFile(platform: DeployPlatform): { name: string, content: string } {
        switch (platform) {
            case 'vercel':
                return {
                    name: 'vercel.json',
                    content: JSON.stringify({
                        "version": 2,
                        "builds": [
                            { "src": "index.html", "use": "@vercel/static" }
                        ],
                        "routes": [
                            { "src": "/(.*)", "dest": "/index.html" }
                        ]
                    }, null, 2)
                };
            case 'netlify':
                return {
                    name: 'netlify.toml',
                    content: `[build]
  publish = "."
  command = "echo 'Building...'"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200`
                };
            default:
                return {
                    name: 'README.md',
                    content: '# Deployment\n\nUpload these files to your host.'
                };
        }
    },

    // Create a deployable ZIP package
    async downloadDeployPackage(code: string, config: DeployConfig) {
        const zip = new JSZip();

        // Add Source Code
        zip.file("index.html", code);

        // Add Config File
        const configFile = this.getConfigFile(config.platform);
        zip.file(configFile.name, configFile.content);

        // Add Package.json (basic)
        zip.file("package.json", JSON.stringify({
            name: config.projectName.toLowerCase().replace(/\s+/g, '-'),
            version: "1.0.0",
            scripts: {
                "start": "serve",
                "build": "echo 'Build complete'"
            },
            dependencies: {
                "serve": "^14.0.0"
            }
        }, null, 2));

        const content = await zip.generateAsync({ type: "blob" });
        saveAs(content, `${config.projectName}-deploy-ready.zip`);
    },

    // Deploy to platform API
    async *deployToPlatform(code: string, config: DeployConfig, apiToken?: string) {
        yield `Initializing deployment to ${config.platform}...`;

        // If no token provided, try to get saved token
        let token = apiToken;
        if (!token) {
            yield 'Checking for saved credentials...';
            const savedToken = await this.getSavedToken(config.platform);
            if (!savedToken) {
                throw new Error(`No API token found for ${config.platform}. Please add your token in Settings > Integrations.`);
            }
            token = savedToken;
        }

        try {
            switch (config.platform) {
                case 'vercel':
                    yield* this.deployToVercel(code, config, token);
                    break;
                case 'netlify':
                    yield* this.deployToNetlify(code, config, token);
                    break;
                case 'github-pages':
                    yield* this.deployToGitHubPages(code, config, token);
                    break;
                default:
                    throw new Error(`Unsupported platform: ${config.platform}`);
            }
        } catch (error) {
            throw new Error(`Deployment failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    },

    sanitizeProjectName(name: string): string {
        // General sanitization for deployment platforms
        // - Must be lowercase
        // - Only letters, digits, and hyphens (most restrictive but safest)
        // - Cannot start/end with hyphen
        // - No consecutive hyphens
        // - Max 63 characters (DNS safe)

        return name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')    // Replace non-alphanumeric with hyphens
            .replace(/^-+|-+$/g, '')        // Remove leading/trailing hyphens
            .replace(/-+/g, '-')            // Replace multiple hyphens with single
            .slice(0, 63);                 // Max 63 chars for DNS safety
    },

    async *deployToVercel(code: string, config: DeployConfig, apiToken: string) {
        yield 'Creating Vercel project...';

        // Sanitize project name for Vercel
        const sanitizedName = this.sanitizeProjectName(config.projectName);

        if (!sanitizedName || sanitizedName.length < 1) {
            throw new Error('Project name is invalid or empty after sanitization');
        }

        // Try to create project
        const createProjectRes = await fetch('https://api.vercel.com/v9/projects', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: sanitizedName,
                framework: null,
            }),
        });

        if (createProjectRes.status === 409) {
            // Project already exists - throw specific error for UI to handle
            throw new Error(`PROJECT_EXISTS:${sanitizedName}`);
        }

        if (!createProjectRes.ok) {
            const error = await createProjectRes.json();
            throw new Error(error.error?.message || 'Failed to create Vercel project');
        }

        const project = await createProjectRes.json();
        yield 'Project created, uploading files...';

        // Create deployment with files
        const deploymentRes = await fetch(`https://api.vercel.com/v13/deployments`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: project.name,
                project: project.id,
                files: [
                    {
                        file: 'index.html',
                        data: encodeBase64Utf8(code),
                        encoding: 'base64',
                    }
                ],
            }),
        });

        if (!deploymentRes.ok) {
            const error = await deploymentRes.json();
            throw new Error(error.error?.message || 'Failed to create deployment');
        }

        const deployment = await deploymentRes.json();
        yield `Deploying to ${deployment.url}...`;

        // Poll for deployment status
        let status = deployment.readyState;
        const maxAttempts = 30;
        let attempts = 0;

        while (status !== 'READY' && status !== 'ERROR' && attempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 2000));

            const checkRes = await fetch(`https://api.vercel.com/v13/deployments/${deployment.id}`, {
                headers: { 'Authorization': `Bearer ${apiToken}` },
            });

            if (checkRes.ok) {
                const data = await checkRes.json();
                status = data.readyState;

                if (status === 'BUILDING') {
                    yield 'Building project...';
                } else if (status === 'QUEUED') {
                    yield 'Waiting in queue...';
                }
            }

            attempts++;
        }

        if (status === 'READY') {
            yield `Deployment successful! Live at: https://${deployment.url}`;
            return { url: `https://${deployment.url}`, deploymentId: deployment.id };
        } else if (status === 'ERROR') {
            throw new Error('Deployment failed during build');
        } else {
            throw new Error('Deployment timeout');
        }
    },

    async *deployToNetlify(code: string, config: DeployConfig, apiToken: string) {
        yield 'Creating Netlify site...';

        // Create site
        const createSiteRes = await fetch('https://api.netlify.com/api/v1/sites', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: this.sanitizeProjectName(config.projectName),
            }),
        });

        if (!createSiteRes.ok) {
            const error = await createSiteRes.json();
            throw new Error(error.message || 'Failed to create Netlify site');
        }

        const site = await createSiteRes.json();
        yield 'Site created, deploying files...';

        // Deploy files
        const zip = new JSZip();
        zip.file('index.html', code);
        const zipBlob = await zip.generateAsync({ type: 'blob' });

        const formData = new FormData();
        formData.append('file', zipBlob, 'deploy.zip');

        const deployRes = await fetch(`https://api.netlify.com/api/v1/sites/${site.id}/deploys`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiToken}`,
            },
            body: formData,
        });

        if (!deployRes.ok) {
            const error = await deployRes.json();
            throw new Error(error.message || 'Failed to deploy to Netlify');
        }

        const deploy = await deployRes.json();
        yield `Deploying to ${site.url}...`;

        // Poll for deployment status
        let state = deploy.state;
        const maxAttempts = 30;
        let attempts = 0;

        while (state !== 'ready' && state !== 'error' && attempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 2000));

            const checkRes = await fetch(`https://api.netlify.com/api/v1/sites/${site.id}/deploys/${deploy.id}`, {
                headers: { 'Authorization': `Bearer ${apiToken}` },
            });

            if (checkRes.ok) {
                const data = await checkRes.json();
                state = data.state;

                if (state === 'building') {
                    yield 'Building site...';
                } else if (state === 'uploading') {
                    yield 'Uploading files...';
                }
            }

            attempts++;
        }

        if (state === 'ready') {
            yield `Deployment successful! Live at: ${deploy.ssl_url || deploy.url}`;
            return { url: deploy.ssl_url || deploy.url, deployId: deploy.id };
        } else if (state === 'error') {
            throw new Error('Deployment failed');
        } else {
            throw new Error('Deployment timeout');
        }
    },

    async *deployToGitHubPages(code: string, config: DeployConfig, apiToken: string) {
        yield 'Creating GitHub repository...';

        const repoName = this.sanitizeProjectName(config.projectName);

        // Create repo
        const createRepoRes = await fetch('https://api.github.com/user/repos', {
            method: 'POST',
            headers: {
                'Authorization': `token ${apiToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: repoName,
                private: false,
                auto_init: true,
            }),
        });

        if (!createRepoRes.ok) {
            const error = await createRepoRes.json();
            throw new Error(error.message || 'Failed to create GitHub repository');
        }

        const repo = await createRepoRes.json();
        yield 'Repository created, uploading files...';

        // Get the current commit SHA
        const refRes = await fetch(`https://api.github.com/repos/${repo.owner.login}/${repoName}/git/refs/heads/main`, {
            headers: { 'Authorization': `token ${apiToken}` },
        });

        if (!refRes.ok) {
            throw new Error('Failed to get repository reference');
        }

        const ref = await refRes.json();
        const baseTreeSha = ref.object.sha;

        // Create blob for index.html
        const blobRes = await fetch(`https://api.github.com/repos/${repo.owner.login}/${repoName}/git/blobs`, {
            method: 'POST',
            headers: {
                'Authorization': `token ${apiToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                content: encodeBase64Utf8(code),
                encoding: 'base64',
            }),
        });

        if (!blobRes.ok) {
            throw new Error('Failed to create file blob');
        }

        const blob = await blobRes.json();
        yield 'Creating commit...';

        // Create tree
        const treeRes = await fetch(`https://api.github.com/repos/${repo.owner.login}/${repoName}/git/trees`, {
            method: 'POST',
            headers: {
                'Authorization': `token ${apiToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                base_tree: baseTreeSha,
                tree: [
                    {
                        path: 'index.html',
                        mode: '100644',
                        type: 'blob',
                        sha: blob.sha,
                    },
                ],
            }),
        });

        if (!treeRes.ok) {
            throw new Error('Failed to create tree');
        }

        const tree = await treeRes.json();

        // Create commit
        const commitRes = await fetch(`https://api.github.com/repos/${repo.owner.login}/${repoName}/git/commits`, {
            method: 'POST',
            headers: {
                'Authorization': `token ${apiToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: 'Deploy to GitHub Pages',
                tree: tree.sha,
                parents: [baseTreeSha],
            }),
        });

        if (!commitRes.ok) {
            throw new Error('Failed to create commit');
        }

        const commit = await commitRes.json();

        // Update reference
        const updateRefRes = await fetch(`https://api.github.com/repos/${repo.owner.login}/${repoName}/git/refs/heads/main`, {
            method: 'PATCH',
            headers: {
                'Authorization': `token ${apiToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                sha: commit.sha,
            }),
        });

        if (!updateRefRes.ok) {
            throw new Error('Failed to update reference');
        }

        yield 'Enabling GitHub Pages...';

        // Enable GitHub Pages
        const pagesRes = await fetch(`https://api.github.com/repos/${repo.owner.login}/${repoName}/pages`, {
            method: 'POST',
            headers: {
                'Authorization': `token ${apiToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                source: {
                    branch: 'main',
                    path: '/',
                },
            }),
        });

        if (!pagesRes.ok && pagesRes.status !== 409) { // 409 means already enabled
            const error = await pagesRes.json();
            console.warn('Failed to enable Pages:', error);
        }

        yield `Deployment successful! Live at: https://${repo.owner.login}.github.io/${repoName}/`;
        return {
            url: `https://${repo.owner.login}.github.io/${repoName}/`,
            repoUrl: repo.html_url
        };
    }
};
