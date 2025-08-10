"use client";

import { HTMLAttributes } from "react";

interface AnimatedGradientBackgroundProps
  extends HTMLAttributes<HTMLDivElement> {
  intensity?: "subtle" | "medium" | "strong";
  speed?: "slow" | "normal" | "fast";
}

export default function AnimatedGradientBackground({
  intensity = "medium",
  speed = "normal",
  className = "",
  ...props
}: AnimatedGradientBackgroundProps) {
  const intensitySettings = {
    subtle: "opacity-30",
    medium: "opacity-60",
    strong: "opacity-80",
  };

  const speedSettings = {
    slow: { duration: "20s", bounce: "15s" },
    normal: { duration: "12s", bounce: "8s" },
    fast: { duration: "6s", bounce: "4s" },
  };

  const currentSpeed = speedSettings[speed];

  return (
    <div
      className={`AnimatedGradientBackground absolute inset-0 pointer-events-none overflow-hidden ${className}`}
      {...props}
    >
      {/* Large liquid-like flowing blobs with theme colors */}
      <div
        className={`absolute -top-60 -left-60 w-64 h-64 bg-po1/20 rounded-full blur-3xl ${intensitySettings[intensity]}`}
        style={{
          animation: `liquid-flow-1 ${currentSpeed.duration} ease-in-out infinite`,
        }}
      />

      <div
        className={`absolute top-0 -right-40 w-64 h-64 bg-py1/20 rounded-full blur-3xl ${intensitySettings[intensity]}`}
        style={{
          animation: `liquid-flow-2 ${currentSpeed.bounce} ease-in-out infinite`,
          animationDelay: "2s",
        }}
      />

      <div
        className={`absolute -bottom-60 left-0 w-64 h-64 bg-pr1/20 rounded-full blur-3xl ${intensitySettings[intensity]}`}
        style={{
          animation: `liquid-flow-3 ${currentSpeed.duration} ease-in-out infinite`,
          animationDelay: "4s",
        }}
      />

      <div
        className={`absolute top-1/3 left-1/2 w-64 h-64 bg-po1/20 rounded-full blur-3xl ${intensitySettings[intensity]}`}
        style={{
          animation: `liquid-flow-4 ${currentSpeed.bounce} ease-in-out infinite`,
          animationDelay: "1s",
        }}
      />

      <style jsx>{`
        @keyframes liquid-flow-1 {
          0% {
            transform: translate(0px, 0px);
          }
          25% {
            transform: translate(80px, -60px);
          }
          50% {
            transform: translate(40px, 100px);
          }
          75% {
            transform: translate(-60px, 40px);
          }
          100% {
            transform: translate(0px, 0px);
          }
        }

        @keyframes liquid-flow-2 {
          0% {
            transform: translate(0px, 0px);
          }
          20% {
            transform: translate(-120px, 80px);
          }
          40% {
            transform: translate(60px, 140px);
          }
          60% {
            transform: translate(100px, -40px);
          }
          80% {
            transform: translate(-80px, -60px);
          }
          100% {
            transform: translate(0px, 0px);
          }
        }

        @keyframes liquid-flow-3 {
          0% {
            transform: translate(0px, 0px);
          }
          30% {
            transform: translate(100px, -80px);
          }
          60% {
            transform: translate(-80px, -100px);
          }
          90% {
            transform: translate(60px, 120px);
          }
          100% {
            transform: translate(0px, 0px);
          }
        }

        @keyframes liquid-flow-4 {
          0% {
            transform: translate(0px, 0px);
          }
          33% {
            transform: translate(-100px, 60px);
          }
          66% {
            transform: translate(80px, -80px);
          }
          100% {
            transform: translate(0px, 0px);
          }
        }
      `}</style>
    </div>
  );
}
