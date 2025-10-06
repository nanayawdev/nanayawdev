"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

interface DotGridProps {
  dotSize?: number;
  gap?: number;
  baseColor?: string;
  activeColor?: string;
  proximity?: number;
  speedTrigger?: number;
  shockRadius?: number;
  shockStrength?: number;
  maxSpeed?: number;
  resistance?: number;
  returnDuration?: number;
  className?: string;
  style?: React.CSSProperties;
}

export default function DotGrid({
  dotSize = 5,
  gap = 15,
  baseColor = "#271e37",
  activeColor = "#5227ff",
  proximity = 120,
  speedTrigger = 100,
  shockRadius = 250,
  shockStrength = 5,
  maxSpeed = 5000,
  resistance = 750,
  returnDuration = 1.5,
  className = "",
  style = {}
}: DotGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const dotsRef = useRef<HTMLDivElement[]>([]);
  const mouseRef = useRef({ x: 0, y: 0, prevX: 0, prevY: 0, speed: 0 });
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Create dots
    const dots: HTMLDivElement[] = [];
    const containerRect = container.getBoundingClientRect();
    const cols = Math.ceil(containerRect.width / gap) + 1;
    const rows = Math.ceil(containerRect.height / gap) + 1;

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const dot = document.createElement("div");
        dot.style.position = "absolute";
        dot.style.width = `${dotSize}px`;
        dot.style.height = `${dotSize}px`;
        dot.style.backgroundColor = baseColor;
        dot.style.borderRadius = "50%";
        dot.style.left = `${j * gap}px`;
        dot.style.top = `${i * gap}px`;
        dot.style.transition = "all 0.1s ease-out";
        dot.style.pointerEvents = "none";
        container.appendChild(dot);
        dots.push(dot);
      }
    }

    dotsRef.current = dots;

    // Mouse move handler
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Calculate speed
      const deltaX = x - mouseRef.current.x;
      const deltaY = y - mouseRef.current.y;
      const speed = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      mouseRef.current.speed = speed;

      mouseRef.current.prevX = mouseRef.current.x;
      mouseRef.current.prevY = mouseRef.current.y;
      mouseRef.current.x = x;
      mouseRef.current.y = y;

      // Update dots
      dots.forEach((dot) => {
        const dotRect = dot.getBoundingClientRect();
        const dotX = dotRect.left - rect.left + dotSize / 2;
        const dotY = dotRect.top - rect.top + dotSize / 2;
        
        const distance = Math.sqrt(
          Math.pow(dotX - x, 2) + Math.pow(dotY - y, 2)
        );

        if (distance < proximity) {
          const intensity = 1 - distance / proximity;
          const moveX = (dotX - x) * intensity * 0.1;
          const moveY = (dotY - y) * intensity * 0.1;
          
          gsap.to(dot, {
            x: moveX,
            y: moveY,
            backgroundColor: activeColor,
            scale: 1 + intensity * 0.5,
            duration: 0.1,
            ease: "power2.out"
          });
        } else {
          gsap.to(dot, {
            x: 0,
            y: 0,
            backgroundColor: baseColor,
            scale: 1,
            duration: 0.3,
            ease: "power2.out"
          });
        }
      });
    };

    // Click handler for shockwave effect
    const handleClick = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      dots.forEach((dot) => {
        const dotRect = dot.getBoundingClientRect();
        const dotX = dotRect.left - rect.left + dotSize / 2;
        const dotY = dotRect.top - rect.top + dotSize / 2;
        
        const distance = Math.sqrt(
          Math.pow(dotX - x, 2) + Math.pow(dotY - y, 2)
        );

        if (distance < shockRadius) {
          const intensity = 1 - distance / shockRadius;
          const moveX = (dotX - x) * intensity * shockStrength;
          const moveY = (dotY - y) * intensity * shockStrength;
          
          gsap.to(dot, {
            x: moveX,
            y: moveY,
            backgroundColor: activeColor,
            scale: 1 + intensity * 2,
            duration: 0.2,
            ease: "power2.out"
          });

          gsap.to(dot, {
            x: 0,
            y: 0,
            backgroundColor: baseColor,
            scale: 1,
            duration: returnDuration,
            ease: "power2.out",
            delay: 0.2
          });
        }
      });
    };

    // Inertia effect
    const animateInertia = () => {
      if (mouseRef.current.speed > speedTrigger) {
        const inertiaX = (mouseRef.current.x - mouseRef.current.prevX) * (mouseRef.current.speed / maxSpeed);
        const inertiaY = (mouseRef.current.y - mouseRef.current.prevY) * (mouseRef.current.speed / maxSpeed);

        dots.forEach((dot) => {
          const dotRect = dot.getBoundingClientRect();
          const dotX = dotRect.left - container.getBoundingClientRect().left + dotSize / 2;
          const dotY = dotRect.top - container.getBoundingClientRect().top + dotSize / 2;
          
          const distance = Math.sqrt(
            Math.pow(dotX - mouseRef.current.x, 2) + Math.pow(dotY - mouseRef.current.y, 2)
          );

          if (distance < proximity) {
            const intensity = 1 - distance / proximity;
            const moveX = inertiaX * intensity * (resistance / 1000);
            const moveY = inertiaY * intensity * (resistance / 1000);
            
            gsap.to(dot, {
              x: moveX,
              y: moveY,
              backgroundColor: activeColor,
              scale: 1 + intensity * 0.3,
              duration: 0.1,
              ease: "power2.out"
            });

            gsap.to(dot, {
              x: 0,
              y: 0,
              backgroundColor: baseColor,
              scale: 1,
              duration: returnDuration,
              ease: "power2.out",
              delay: 0.1
            });
          }
        });
      }

      animationRef.current = requestAnimationFrame(animateInertia);
    };

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("click", handleClick);
    animateInertia();

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("click", handleClick);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      // Clean up dots
      dots.forEach(dot => dot.remove());
    };
  }, [
    dotSize,
    gap,
    baseColor,
    activeColor,
    proximity,
    speedTrigger,
    shockRadius,
    shockStrength,
    maxSpeed,
    resistance,
    returnDuration
  ]);

  return (
    <div
      ref={containerRef}
      className={`dot-grid-container ${className}`}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 1,
        ...style
      }}
    />
  );
}
