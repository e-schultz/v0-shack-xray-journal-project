"use client"

import { useEffect, useRef } from "react"
import { Terminal } from "xterm"
import { FitAddon } from "xterm-addon-fit"
import "xterm/css/xterm.css"

interface XtermComponentProps {
  onCommand?: (command: string) => void
  initialText?: string[]
}

export function XtermComponent({ onCommand, initialText = [] }: XtermComponentProps) {
  const terminalRef = useRef<HTMLDivElement>(null)
  const xtermRef = useRef<Terminal | null>(null)
  const fitAddonRef = useRef<FitAddon | null>(null)
  const commandBufferRef = useRef<string>("")

  useEffect(() => {
    // Initialize xterm.js
    if (!terminalRef.current) return

    const term = new Terminal({
      cursorBlink: true,
      fontFamily: "JetBrains Mono, monospace",
      fontSize: 14,
      theme: {
        background: "#000000",
        foreground: "#00ff00",
        cursor: "#00ff00",
        cursorAccent: "#000000",
        selection: "rgba(0, 255, 0, 0.3)",
      },
    })

    const fitAddon = new FitAddon()
    term.loadAddon(fitAddon)

    term.open(terminalRef.current)
    fitAddon.fit()

    xtermRef.current = term
    fitAddonRef.current = fitAddon

    // Write initial text
    initialText.forEach((line) => {
      term.writeln(line)
    })

    term.writeln("")
    term.write("> ")

    // Handle user input
    term.onKey(({ key, domEvent }) => {
      const printable = !domEvent.altKey && !domEvent.ctrlKey && !domEvent.metaKey

      if (domEvent.keyCode === 13) {
        // Enter key
        term.writeln("")
        if (commandBufferRef.current.trim() && onCommand) {
          onCommand(commandBufferRef.current)
        }
        commandBufferRef.current = ""
        term.write("> ")
      } else if (domEvent.keyCode === 8) {
        // Backspace
        if (commandBufferRef.current.length > 0) {
          commandBufferRef.current = commandBufferRef.current.slice(0, -1)
          term.write("\b \b")
        }
      } else if (printable) {
        commandBufferRef.current += key
        term.write(key)
      }
    })

    // Handle window resize
    const handleResize = () => {
      if (fitAddonRef.current) {
        fitAddonRef.current.fit()
      }
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      term.dispose()
    }
  }, [initialText, onCommand])

  return <div ref={terminalRef} className="h-full w-full" />
}
