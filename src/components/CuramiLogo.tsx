import { cn } from "@/lib/utils";

const sizeMap = {
  sm: "w-8 h-8",
  md: "w-10 h-10",
  lg: "w-16 h-16",
};

interface CuramiLogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function CuramiLogo({ size = "md", className }: CuramiLogoProps) {
  return (
    <div className={cn("rounded-xl bg-primary flex items-center justify-center", sizeMap[size], className)}>
      <svg
        viewBox="0 0 64 64"
        fill="none"
        className="w-[60%] h-[60%]"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Spiral symbol */}
        <path
          d="M32 44c-6.627 0-12-5.373-12-12s5.373-12 12-12 12 5.373 12 12"
          stroke="white"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <path
          d="M32 38c-3.314 0-6-2.686-6-6s2.686-6 6-6 6 2.686 6 6"
          stroke="white"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <path
          d="M44 32c0 6.627-5.373 12-12 12"
          stroke="white"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
