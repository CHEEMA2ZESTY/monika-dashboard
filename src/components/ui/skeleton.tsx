// src/components/ui/skeleton.tsx
import React from "react";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-gray-700 rounded-md ${className ?? ""}`}
      aria-busy="true"
      aria-label="Loading"
    />
  );
}
