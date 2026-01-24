import { useState, useRef } from 'react';
import { Upload, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

interface ImageUploadProps {
    onImageSelect: (base64: string) => void;
    inputId?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelect, inputId }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setIsDragging(true);
        } else if (e.type === 'dragleave') {
            setIsDragging(false);
        }
    };

    const processFile = (file: File) => {
        if (!file.type.startsWith('image/')) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            const result = reader.result as string;
            setPreview(result);
            onImageSelect(result);
        };
        reader.readAsDataURL(file);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            processFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            processFile(e.target.files[0]);
        }
    };

    const clearImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setPreview(null);
        onImageSelect('');
        if (inputRef.current) inputRef.current.value = '';
    };

    return (
        <div className="w-full">
            <input
                ref={inputRef}
                id={inputId}
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleChange}
            />

            <AnimatePresence mode="wait">
                {preview ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="relative group rounded-xl overflow-hidden border border-white/10 aspect-video bg-black/50"
                    >
                        <img
                            src={preview}
                            alt="Upload preview"
                            className="w-full h-full object-contain"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button
                                onClick={clearImage}
                                className="p-3 bg-red-500/20 text-red-400 rounded-full hover:bg-red-500/40 transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        onClick={() => inputRef.current?.click()}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        className={clsx(
                            "relative group cursor-pointer rounded-xl border-2 border-dashed transition-all duration-300 aspect-video flex flex-col items-center justify-center gap-4",
                            isDragging
                                ? "border-primary bg-primary/5"
                                : "border-white/10 hover:border-white/20 hover:bg-white/5 bg-surface/50"
                        )}
                    >
                        <div className={clsx(
                            "p-4 rounded-full transition-colors",
                            isDragging ? "bg-primary/20 text-primary" : "bg-white/5 text-gray-400 group-hover:text-white"
                        )}>
                            <Upload className="w-8 h-8" />
                        </div>
                        <div className="text-center">
                            <h3 className="text-lg font-medium text-white mb-1">
                                Upload detailed design
                            </h3>
                            <p className="text-sm text-gray-400">
                                Drag & drop or click to browse
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
