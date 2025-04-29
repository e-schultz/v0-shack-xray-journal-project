"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

interface TerminalProps {
  history: Array<{
    text: string
    isClickable?: boolean
    onClick?: () => void
  }>
  input: string
  setInput: (input: string) => void
  onSubmit: (input: string) => void
  compact?: boolean
}

export function Terminal({ history, input, setInput, onSubmit, compact = false }: TerminalProps) {
  const [cursorVisible, setCursorVisible] = useState(true)
  const terminalRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-scroll to bottom when history changes
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [history])

  // Cursor blink effect
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setCursorVisible((prev) => !prev)
    }, 530)

    return () => clearInterval(blinkInterval)
  }, [])

  // Focus input when terminal is clicked
  useEffect(() => {
    const handleClick = () => {
      if (inputRef.current) {
        inputRef.current.focus()
      }
    }

    const terminal = terminalRef.current
    if (terminal) {
      terminal.addEventListener("click", handleClick)
      return () => terminal.removeEventListener("click", handleClick)
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return
    onSubmit(input)
  }

  return (
    <div className="flex flex-col h-full">
      <div className="text-xs text-gray-600 border-b border-gray-800 pb-2 mb-2 flex justify-between">
        <span>FLOAT.terminal | Connected</span>
        <span>{new Date().toISOString().split("T")[0]}</span>
      </div>

      <div
        ref={terminalRef}
        className={cn("flex-grow overflow-y-auto mb-3 font-mono", compact ? "text-xs" : "text-sm")}
      >
        {history.map((item, i) => (
          <div
            key={i}
            className={cn(
              "my-1",
              item.text.startsWith(">") && "text-blue-400",
              item.isClickable &&
                "terminal-clickable text-cyan-400 hover:text-cyan-300 hover:bg-gray-900 cursor-pointer pl-1",
            )}
            onClick={item.onClick}
            style={{
              transition: "all 0.2s ease",
            }}
          >
            {item.isClickable && (
              <span style={{ opacity: 0 }} className="hover:opacity-100">
                →{" "}
              </span>
            )}
            {item.text}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex border-t border-green-900 pt-2">
        <span className="text-pink-500 mr-2">&gt;</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-grow bg-transparent outline-none font-mono"
          placeholder="Type a command..."
        />
        <span className="w-2 h-4 bg-green-400 ml-1" style={{ opacity: cursorVisible ? 1 : 0 }}></span>
      </form>

      <div className="text-xs text-gray-600 mt-4 pt-2 border-t border-gray-800">Type "help" for available commands</div>
    </div>
  )
}
