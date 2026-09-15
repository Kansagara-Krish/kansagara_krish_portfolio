"use client";

import { motion, useScroll, useSpring, HTMLMotionProps, Variants } from "framer-motion";
import { ReactNode } from "react";

export type AnimationType = 
  | "fade-up"
  | "fade-down"
  | "fade-left"
  | "fade-right"
  | "zoom-in"
  | "blur-up"
  | "fade";

interface ScrollRevealProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  animation?: AnimationType;
  delay?: number;
  duration?: number;
  distance?: number;
  className?: string;
  viewportOnce?: boolean;
  threshold?: number;
}

const getVariants = (animation: AnimationType, distance: number): Variants => {
  switch (animation) {
    case "fade-up":
      return {
        hidden: { opacity: 0, y: distance, filter: "blur(4px)" },
        visible: { opacity: 1, y: 0, filter: "blur(0px)" },
      };
    case "fade-down":
      return {
        hidden: { opacity: 0, y: -distance, filter: "blur(4px)" },
        visible: { opacity: 1, y: 0, filter: "blur(0px)" },
      };
    case "fade-left":
      return {
        hidden: { opacity: 0, x: -distance, filter: "blur(4px)" },
        visible: { opacity: 1, x: 0, filter: "blur(0px)" },
      };
    case "fade-right":
      return {
        hidden: { opacity: 0, x: distance, filter: "blur(4px)" },
        visible: { opacity: 1, x: 0, filter: "blur(0px)" },
      };
    case "zoom-in":
      return {
        hidden: { opacity: 0, scale: 0.94, filter: "blur(4px)" },
        visible: { opacity: 1, scale: 1, filter: "blur(0px)" },
      };
    case "blur-up":
      return {
        hidden: { opacity: 0, y: distance / 1.5, filter: "blur(8px)" },
        visible: { opacity: 1, y: 0, filter: "blur(0px)" },
      };
    case "fade":
    default:
      return {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
      };
  }
};

export function ScrollReveal({
  children,
  animation = "fade-up",
  delay = 0,
  duration = 0.55,
  distance = 28,
  className,
  viewportOnce = false, // Animates on both scroll down & scroll up
  threshold = 0.1,
  ...props
}: ScrollRevealProps) {
  const variants = getVariants(animation, distance);

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: viewportOnce, amount: threshold, margin: "0px 0px -30px 0px" }}
      variants={variants}
      transition={{
        duration,
        delay,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

interface StaggerContainerProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  staggerDelay?: number;
  className?: string;
  viewportOnce?: boolean;
}

export function StaggerContainer({
  children,
  staggerDelay = 0.08,
  className,
  viewportOnce = false, // Animates on both scroll down & scroll up
  ...props
}: StaggerContainerProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: viewportOnce, amount: 0.08, margin: "0px 0px -25px 0px" }}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

interface StaggerItemProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  className?: string;
  distance?: number;
  duration?: number;
}

export function StaggerItem({
  children,
  className,
  distance = 24,
  duration = 0.5,
  ...props
}: StaggerItemProps) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: distance, filter: "blur(4px)" },
        visible: {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          transition: {
            duration,
            ease: [0.21, 0.47, 0.32, 0.98],
          },
        },
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/**
 * Global smooth glowing scroll progress bar on top of the screen
 */
export function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <div className="fixed top-0 left-0 right-0 z-[999] h-[3px] pointer-events-none bg-transparent">
      <motion.div
        className="h-full w-full origin-left bg-gradient-to-r from-primary via-primary/90 to-primary shadow-[0_0_12px_rgba(var(--primary-rgb,59,130,246),0.8)]"
        style={{ scaleX }}
      />
    </div>
  );
}
