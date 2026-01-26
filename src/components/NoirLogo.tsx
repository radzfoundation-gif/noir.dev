
export const NoirLogo = ({ className = "size-12" }: { className?: string }) => (
    <div className={`flex items-center justify-center overflow-hidden shrink-0 ${className}`}>
        <img src="/logo.png" alt="Noir Logo" className="w-full h-full object-contain" />
    </div>
);
