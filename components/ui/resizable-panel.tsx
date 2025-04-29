"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback } from "react"
import { cn } from "@/lib/utils"

interface ResizablePanelProps {
  children: React.ReactNode
  defaultSize: number
  minSize?: number
  maxSize?: number
  className?: string
}

export function ResizablePanel({
  children,
  defaultSize = 25,
  minSize = 15,
  maxSize = 50,
  className,
}: ResizablePanelProps) {
  const [size, setSize] = useState(defaultSize)
  const [isDragging, setIsDragging] = useState(false)
  const startXRef = useRef(0)
  const startSizeRef = useRef(defaultSize)
  const panelRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      setIsDragging(true)
      startXRef.current = e.clientX
      startSizeRef.current = size
    },
    [size],
  )

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return

      const containerWidth = window.innerWidth
      const deltaX = e.clientX - startXRef.current
      const deltaPercentage = (deltaX / containerWidth) * 100
      const newSize = Math.max(minSize, Math.min(maxSize, startSizeRef.current + deltaPercentage))

      setSize(newSize)
    },
    [isDragging, maxSize, minSize],
  )

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  // Add event listeners when dragging starts
  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)

      // Add a cursor style to the body during dragging
      document.body.style.cursor = "ew-resize"
      document.body.style.userSelect = "none"
    } else {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)

      // Reset cursor style
      document.body.style.cursor = ""
      document.body.style.userSelect = ""
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
      document.body.style.cursor = ""
      document.body.style.userSelect = ""
    }
  }, [isDragging, handleMouseMove, handleMouseUp])

  return (
    <div ref={panelRef} className={cn("relative flex flex-col", className)} style={{ width: `${size}%` }}>
      {children}
      <div
        className={cn(
          "absolute top-0 right-0 w-2 h-full cursor-ew-resize z-10 hover:bg-green-700/50",
          isDragging ? "bg-green-600" : "bg-green-900",
        )}
        onMouseDown={handleMouseDown}
      />
    </div>
  )
}
