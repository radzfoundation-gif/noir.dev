import React from 'react';
import { Check, Code2, Sparkles, Brain, Search } from 'lucide-react';
import { GridLoader } from './GridLoader';

interface StreamingStepsProps {
    analysis: string;
    thinking: string;
    steps: { title: string; desc: string }[];
    isGenerating: boolean;
    isCodeVisible: boolean;
    currentImage: string | null;
    currentPrompt: string;
}

export const StreamingSteps: React.FC<StreamingStepsProps> = ({
    analysis,
    thinking,
    steps,
    isGenerating,
    isCodeVisible,
    currentImage,
    currentPrompt
}) => {
    // Helper to render a step item
    const StepItem = ({
        icon: Icon,
        label,
        content,
        isActive,
        isCompleted,
        color = "text-neutral-400",
        bgColor = "bg-transparent"
    }: {
        icon: any,
        label: string,
        content?: string | React.ReactNode,
        isActive: boolean,
        isCompleted: boolean,
        color?: string,
        bgColor?: string
    }) => (
        <div className="flex gap-4 relative group">
            {/* Timeline Line - Removed for transparency */}
            {/* <div className="absolute left-[11px] top-8 bottom-[-16px] w-[2px] bg-neutral-800 group-last:hidden" /> */}

            {/* Icon */}
            <div className={`
                relative z-10 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 transition-all duration-300
                ${params(isActive, isCompleted, bgColor)}
            `}>
                {isActive ? (
                    <GridLoader size={12} color="#a3e635" />
                ) : isCompleted ? (
                    <Check size={12} className="text-lime-400" />
                ) : (
                    <Icon size={12} className={color} />
                )}
            </div>

            {/* Content */}
            <div className="flex-1 pb-6">
                <p className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${isActive ? 'text-lime-400' : 'text-neutral-500'}`}>
                    {label}
                </p>
                {content && (
                    <div className="text-sm text-neutral-300 leading-relaxed font-light">
                        {content}
                    </div>
                )}
            </div>
        </div>
    );

    // State Derived Logic
    const hasAnalysis = !!analysis;
    const hasThinking = !!thinking;
    const hasSteps = steps.length > 0;
    const hasCode = isCodeVisible; // Or code content length > 0

    // Strict Sequence Logic
    // 1. Request: Always done
    // 2. Analyze: Active if generating & no thinking yet. Done if thinking starts.
    const analyzeActive = isGenerating && !hasThinking;
    const analyzeDone = hasThinking || (hasAnalysis && !isGenerating);

    // 3. Think: Active if generating & thinking started & no steps/code yet. Done if steps/code starts.
    const thinkActive = isGenerating && hasThinking && !hasSteps && !hasCode;
    const thinkDone = hasSteps || hasCode || (hasThinking && !isGenerating);

    // 4. Steps: Active if generating & steps started & no code yet. Done if code starts.
    const stepsActive = isGenerating && hasSteps && !hasCode;

    // 5. Code: Active if generating & code started. Done if stopped.
    const codeActive = isGenerating && hasCode;
    const codeDone = hasCode && !isGenerating;

    // Helper functions
    const params = (active: boolean, completed: boolean, bg: string) => {
        if (active) return 'bg-lime-500/10 ring-2 ring-lime-500/20 shadow-[0_0_15px_rgba(132,204,22,0.3)]';
        if (completed) return 'bg-lime-500/20 text-lime-400';
        return bg;
    }

    return (
        <div className="p-4 space-y-4">
            {/* 1. Request Analysis */}
            {(currentImage || currentPrompt) && (
                <StepItem
                    icon={Search}
                    label="Request"
                    isActive={false}
                    isCompleted={true}
                    content={
                        <div className="space-y-2 mt-2">
                            {currentPrompt && <p className="text-white/80 italic">"{currentPrompt}"</p>}
                            {currentImage && (
                                <img src={currentImage} alt="Reference" className="w-full max-w-[200px] rounded-lg border border-neutral-800" />
                            )}
                        </div>
                    }
                />
            )}

            {/* 2. Visual Analysis (if image) */}
            {(currentImage) && (
                <StepItem
                    icon={Sparkles}
                    label="Analyze"
                    isActive={analyzeActive}
                    isCompleted={analyzeDone}
                    content={analysis || (analyzeActive && "Analyzing visual structure...")}
                />
            )}

            {/* 3. Thinking */}
            <StepItem
                icon={Brain}
                label="Think"
                isActive={thinkActive}
                isCompleted={thinkDone}
                content={thinking || (thinkActive && "Reasoning about architecture...") || (analyzeActive && "Waiting for analysis...")}
            />

            {/* 4. Plan Steps */}
            {(hasSteps || stepsActive) && (
                <div className="pl-2 ml-3 space-y-2">
                    {steps.map((step, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-neutral-400">
                            <div className="w-4 h-4 rounded-full bg-transparent flex items-center justify-center shrink-0 mt-0.5 text-[10px]">{idx + 1}</div>
                            <span>{step.title}</span>
                        </div>
                    ))}
                </div>
            )}

            {/* 5. Code Generation */}
            <StepItem
                icon={Code2}
                label="Code"
                isActive={codeActive}
                isCompleted={codeDone}
                content={hasCode ? (codeActive ? "Generating solution..." : "Implementation complete") : ""}
            />
        </div>
    );
};

export default StreamingSteps;
