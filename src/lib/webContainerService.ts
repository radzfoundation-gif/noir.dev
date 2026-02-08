import { WebContainer } from '@webcontainer/api';

export interface TerminalLine {
    type: 'system' | 'command' | 'output' | 'success' | 'error';
    text: string;
    timestamp: Date;
}

type OutputListener = (line: TerminalLine) => void;

class WebContainerService {
    private instance: WebContainer | null = null;
    private listeners: OutputListener[] = [];
    private isBooting = false;

    /**
     * Subscribe to terminal output
     */
    subscribe(listener: OutputListener): () => void {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    /**
     * Emit a terminal line to all listeners
     */
    private emit(line: Omit<TerminalLine, 'timestamp'>) {
        const fullLine: TerminalLine = { ...line, timestamp: new Date() };
        this.listeners.forEach(l => l(fullLine));
    }

    /**
     * Boot WebContainer instance
     */
    async boot(): Promise<boolean> {
        if (this.instance) {
            this.emit({ type: 'system', text: '✓ Sandbox already running' });
            return true;
        }

        if (this.isBooting) {
            this.emit({ type: 'system', text: '⏳ Sandbox is booting...' });
            return false;
        }

        try {
            this.isBooting = true;
            this.emit({ type: 'system', text: '⚡ Acquiring sandbox...' });

            this.instance = await WebContainer.boot();

            this.emit({ type: 'success', text: '✓ Acquired sandbox' });
            this.isBooting = false;
            return true;
        } catch (error) {
            this.isBooting = false;
            const message = error instanceof Error ? error.message : 'Unknown error';
            this.emit({ type: 'error', text: `✗ Failed to boot sandbox: ${message}` });
            return false;
        }
    }

    /**
     * Write files to the WebContainer filesystem
     */
    async writeFiles(files: Record<string, string>): Promise<void> {
        if (!this.instance) {
            throw new Error('WebContainer not initialized');
        }

        this.emit({ type: 'command', text: `Writing ${Object.keys(files).length} files...` });

        const fileTree: Record<string, { file: { contents: string } }> = {};

        for (const [path, contents] of Object.entries(files)) {
            fileTree[path] = { file: { contents } };
            this.emit({ type: 'output', text: `  + ${path}` });
        }

        await this.instance.mount(fileTree);
        this.emit({ type: 'success', text: '✓ Files written' });
    }

    /**
     * Spawn a process and stream output
     */
    async spawn(command: string, args: string[] = []): Promise<number> {
        if (!this.instance) {
            throw new Error('WebContainer not initialized');
        }

        const fullCommand = `${command} ${args.join(' ')}`.trim();
        this.emit({ type: 'command', text: `$ ${fullCommand}` });

        const process = await this.instance.spawn(command, args);

        // Stream stdout
        process.output.pipeTo(
            new WritableStream({
                write: (data) => {
                    // Split by newlines and emit each line
                    const lines = data.split('\n').filter((l: string) => l.trim());
                    lines.forEach((line: string) => {
                        this.emit({ type: 'output', text: line });
                    });
                },
            })
        );

        const exitCode = await process.exit;

        if (exitCode === 0) {
            this.emit({ type: 'success', text: `✓ ${command} completed` });
        } else {
            this.emit({ type: 'error', text: `✗ ${command} failed with code ${exitCode}` });
        }

        return exitCode;
    }

    /**
     * Install npm dependencies
     */
    async installDependencies(): Promise<boolean> {
        const exitCode = await this.spawn('npm', ['install']);
        return exitCode === 0;
    }

    /**
     * Start dev server
     */
    async startDevServer(): Promise<string | null> {
        if (!this.instance) {
            throw new Error('WebContainer not initialized');
        }

        this.emit({ type: 'command', text: '$ npm run dev' });

        const serverProcess = await this.instance.spawn('npm', ['run', 'dev']);

        // Stream output
        serverProcess.output.pipeTo(
            new WritableStream({
                write: (data) => {
                    const lines = data.split('\n').filter((l: string) => l.trim());
                    lines.forEach((line: string) => {
                        this.emit({ type: 'output', text: line });
                    });
                },
            })
        );

        // Wait for server to be ready
        return new Promise((resolve) => {
            this.instance!.on('server-ready', (_port, url) => {
                this.emit({ type: 'success', text: `✓ Server ready at ${url}` });
                resolve(url);
            });

            // Timeout after 30 seconds
            setTimeout(() => {
                this.emit({ type: 'error', text: '✗ Server startup timeout' });
                resolve(null);
            }, 30000);
        });
    }

    /**
     * Destroy the WebContainer instance
     */
    async destroy(): Promise<void> {
        if (this.instance) {
            this.emit({ type: 'system', text: '🛑 Destroying sandbox...' });
            await this.instance.teardown();
            this.instance = null;
            this.emit({ type: 'success', text: '✓ Sandbox destroyed' });
        }
    }

    /**
     * Check if WebContainer is running
     */
    isRunning(): boolean {
        return this.instance !== null;
    }
}

// Singleton instance
export const webContainerService = new WebContainerService();
