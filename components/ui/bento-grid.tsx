import { type ComponentPropsWithoutRef, type ReactNode } from "react"
import { ArrowRightIcon } from "@radix-ui/react-icons"
import { motion } from "framer-motion"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Noise } from "@/components/ui/noise"

interface BentoGridProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode
  className?: string
}

interface BentoCardProps extends ComponentPropsWithoutRef<"div"> {
  name: string
  className: string
  background: ReactNode
  Icon: React.ElementType
  description: string
  href?: string
  cta?: string
  children?: ReactNode
}

const BentoGrid = ({ children, className, ...props }: BentoGridProps) => {
  return (
    <div
      className={cn(
        "grid w-full auto-rows-[22rem] grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mx-auto max-w-7xl",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

const BentoCard = ({
  name,
  className,
  background,
  Icon,
  description,
  href,
  cta,
  children,
  ...props
}: BentoCardProps) => (
  <LiquidGlassCard
    shadowIntensity="xs"
    glowIntensity="none"
    borderRadius="12px"
    blurIntensity="md"
    className={cn(
      "group relative flex flex-col justify-between overflow-hidden bg-white/5",
      className
    )}
    {...props}
  >
    <div className="absolute inset-0 z-0">
      {background}
    </div>
    
    <div className="relative z-30 flex h-full flex-col p-6 text-white">
      <div className="flex flex-col gap-1">
        <Icon className="h-8 w-8 text-white/80 mb-2" />
        <h3 className="text-xl font-bold tracking-tight text-white uppercase opacity-90">
          {name}
        </h3>
        <p className="text-sm font-medium text-white/60">
          {description}
        </p>
      </div>

      <div className="flex-1" />

      {children && (
        <div className="mt-4 pointer-events-auto">
          {children}
        </div>
      )}

      {href && cta && (
        <div className="mt-4">
          <Button
            variant="ghost"
            asChild
            size="sm"
            className="h-9 rounded-full bg-white/10 hover:bg-white/20 px-4 text-xs font-bold text-white transition-all border border-white/5"
          >
            <a href={href} target="_blank">
              {cta}
              <ArrowRightIcon className="ms-1 h-3 w-3" />
            </a>
          </Button>
        </div>
      )}
    </div>
  </LiquidGlassCard>
)

import { LiquidGlassCard } from "@/components/ui/liquid-glass";

const springTransition = {
  type: "spring",
  stiffness: 300,
  damping: 30,
};

export const BentoGridItem = ({
  className,
  title,
  description,
  header,
  icon,
  layoutId,
}: {
  className?: string;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  header?: React.ReactNode;
  icon?: React.ReactNode;
  layoutId?: string;
}) => {
  return (
    <LiquidGlassCard
      layoutId={layoutId}
      transition={springTransition}
      className={cn(
        "group/bento flex flex-col justify-between overflow-hidden bg-white/5",
        className,
      )}
      blurIntensity="lg"
      shadowIntensity="xs"
      glowIntensity="none"
      borderRadius="12px"
    >
      <div className="relative z-30 flex h-full flex-col p-6 text-white">
        {header}
        <div className="mt-auto">
          <div className="flex items-center gap-2">
             {icon}
             <div className="font-bold text-white uppercase tracking-tight text-sm opacity-80">
              {title}
            </div>
          </div>
          {description && (
            <div className="mt-1 text-xs font-medium text-white/50">
              {description}
            </div>
          )}
        </div>
      </div>
    </LiquidGlassCard>
  );
};

export { BentoCard, BentoGrid }
