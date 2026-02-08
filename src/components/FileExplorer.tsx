import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileCode, FileJson, FileType, Folder, FolderOpen, ChevronRight, ChevronDown } from 'lucide-react';

interface FileNode {
    name: string;
    type: 'file' | 'folder';
    children?: FileNode[];
    content?: string;
    path: string;
}

interface FileExplorerProps {
    files: Record<string, string>;
    onSelectFile: (path: string, content: string) => void;
    selectedFile: string | null;
}

const FileIcon = ({ name }: { name: string }) => {
    if (name.endsWith('.jsx') || name.endsWith('.tsx')) return <FileCode size={14} className="text-blue-400" />;
    if (name.endsWith('.js') || name.endsWith('.ts')) return <FileCode size={14} className="text-yellow-400" />;
    if (name.endsWith('.css')) return <FileType size={14} className="text-pink-400" />;
    if (name.endsWith('.html')) return <FileType size={14} className="text-orange-400" />;
    if (name.endsWith('.json')) return <FileJson size={14} className="text-green-400" />;
    return <FileType size={14} className="text-neutral-400" />;
};

const FileTreeItem = ({
    node,
    depth = 0,
    onSelect,
    selectedPath
}: {
    node: FileNode;
    depth?: number;
    onSelect: (node: FileNode) => void;
    selectedPath: string | null;
}) => {
    const [isOpen, setIsOpen] = useState(true);
    const isSelected = selectedPath === node.path;

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (node.type === 'folder') {
            setIsOpen(!isOpen);
        } else {
            onSelect(node);
        }
    };

    return (
        <div>
            <div
                onClick={handleClick}
                className={`
          flex items-center gap-1.5 py-1 px-2 cursor-pointer transition-colors text-sm
          ${isSelected ? 'bg-blue-500/10 text-blue-400' : 'text-neutral-400 hover:text-neutral-200 hover:bg-white/5'}
        `}
                style={{ paddingLeft: `${depth * 12 + 8}px` }}
            >
                <span className="opacity-70">
                    {node.type === 'folder' && (
                        isOpen ? <ChevronDown size={12} /> : <ChevronRight size={12} />
                    )}
                </span>

                {node.type === 'folder' ? (
                    isOpen ? <FolderOpen size={14} className="text-blue-300" /> : <Folder size={14} className="text-blue-300" />
                ) : (
                    <FileIcon name={node.name} />
                )}

                <span className="truncate">{node.name}</span>
            </div>

            <AnimatePresence>
                {node.type === 'folder' && isOpen && node.children && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        {node.children.map((child) => (
                            <FileTreeItem
                                key={child.path}
                                node={child}
                                depth={depth + 1}
                                onSelect={onSelect}
                                selectedPath={selectedPath}
                            />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export const FileExplorer: React.FC<FileExplorerProps> = ({ files, onSelectFile, selectedFile }) => {
    // Convert flat files object to tree structure
    const buildTree = (): FileNode[] => {
        const root: FileNode[] = [];

        Object.keys(files).sort().forEach(path => {
            const parts = path.split('/');
            let currentLevel = root;

            parts.forEach((part, index) => {
                const isFile = index === parts.length - 1;
                const existingNode = currentLevel.find(n => n.name === part);

                if (existingNode) {
                    if (!isFile && existingNode.children) {
                        currentLevel = existingNode.children;
                    }
                } else {
                    const newNode: FileNode = {
                        name: part,
                        type: isFile ? 'file' : 'folder',
                        path: parts.slice(0, index + 1).join('/'),
                        content: isFile ? files[path] : undefined,
                        children: isFile ? undefined : []
                    };

                    currentLevel.push(newNode);
                    if (!isFile && newNode.children) {
                        currentLevel = newNode.children;
                    }
                }
            });
        });

        return root;
    };

    const tree = buildTree();

    if (Object.keys(files).length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-neutral-500 text-sm p-4 text-center">
                <FolderOpen size={32} className="mb-2 opacity-20" />
                <p>No files generated yet</p>
            </div>
        );
    }

    return (
        <div className="h-full overflow-y-auto custom-scrollbar pt-2 pb-4">
            {tree.map(node => (
                <FileTreeItem
                    key={node.path}
                    node={node}
                    onSelect={(n) => n.content && onSelectFile(n.path, n.content)}
                    selectedPath={selectedFile}
                />
            ))}
        </div>
    );
};
