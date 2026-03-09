import { cn } from "@/lib/utils";
import logo from "@/assets/cuidare-logo.png";

const sizeMap = {
  sm: "w-8 h-8",
  md: "w-10 h-10",
  lg: "w-16 h-16",
};

const imgSizeMap = {
  sm: "w-[60%] h-[60%]",
  md: "w-[60%] h-[60%]",
  lg: "w-[65%] h-[65%]",
};

interface CuidareLogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function CuidareLogo({ size = "md", className }: CuidareLogoProps) {
  return (
    <div className={cn("rounded-xl bg-primary flex items-center justify-center", sizeMap[size], className)}>
      <img
        src={logo}
        alt="Cuidare"
        className={cn("object-contain invert", imgSizeMap[size])}
      />
    </div>
  );
}
