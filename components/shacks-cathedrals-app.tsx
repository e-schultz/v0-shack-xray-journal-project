"use client"

import { useState, useEffect } from "react"
import { ResizablePanel } from "@/components/ui/resizable-panel"
import { Terminal } from "@/components/terminal"
import { MDXContent } from "@/components/mdx-content"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff, Menu } from 'lucide-react'
import { useMediaQuery } from "@/hooks/use-media-query"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

export function ShacksCathedralsApp() {
  const [xrayMode, setXrayMode] = useState(false)
  const [selectedJournalId, setSelectedJournalId] = useState(1)
  const [terminalHistory, setTerminalHistory] = useState<
    Array<{ text: string; isClickable?: boolean; onClick?: () => void }>
  >([
    { text: "FLOAT.ShacksCathedrals v0.3.4 initialized" }, 
    { text: "Type 'help' for available commands" },
    { text: "Shacks not Cathedrals: A modular approach to knowledge management" }
  ])
  const [terminalInput, setTerminalInput] = useState("")
  const isMobile = useMediaQuery("(max-width: 768px)")
  const [bootSequence, setBootSequence] = useState(true)

  // Boot sequence effect
  useEffect(() => {
    if (bootSequence) {
      const bootMessages = [
        "Initializing FLOAT memory engine...",
        "Loading FloatAST data structures...",
        "Connecting to RitualAST framework...",
        "Establishing dual-layer architecture...",
        "Concept Layer: ACTIVE",
        "Projection Layer: READY",
        "X-Ray Mode: AVAILABLE",
        "FLOAT Concept Explorer ready for interaction."
      ]
      
      let delay = 300
      bootMessages.forEach((message) => {
        setTimeout(() => {
          addToTerminal(message)
        }, delay)
        delay += 300
      })
      
      setTimeout(() => {
        setBootSequence(false)
      }, delay)
    }
  }, [bootSequence])

  const toggleXRayMode = () => {
    if (!xrayMode) {
      addToTerminal("Activating X-Ray mode...")
      addToTerminal("Loading FloatAST node structures...")
      addToTerminal("Revealing connections between Concept and Projection layers...")
    } else {
      addToTerminal("Deactivating X-Ray mode...")
      addToTerminal("Returning to standard Projection Layer view...")
    }
    setXrayMode(!xrayMode)
  }

  const addToTerminal = (text: string, isClickable = false, onClick?: () => void) => {
    setTerminalHistory((prev) => [...prev, { text, isClickable, onClick }])
  }

  const handleTerminalSubmit = (input: string) => {
    addToTerminal(`> ${input}`)

    const cmd = input.toLowerCase().trim()

    if (cmd === "help" || cmd === "/help") {
      addToTerminal("Available commands:")
      addToTerminal("  xray - Toggle X-Ray mode")
      addToTerminal("  view [number] - View journal entry (1-5)")
      addToTerminal("  clear - Clear terminal")
      addToTerminal("  about - About this project")
      addToTerminal("  philosophy - Explain Shacks not Cathedrals")
    } else if (cmd === "xray") {
      toggleXRayMode()
    } else if (cmd === "clear") {
      setTerminalHistory([])
    } else if (cmd === "about") {
      addToTerminal("FLOAT Concept Explorer - A Journey from Journal to Philosophy")
      addToTerminal("Version 0.3.4 - FLOAT Memory Engine Active")
      addToTerminal("© 2025 Evan Schultz")
    } else if (cmd === "philosophy") {
      addToTerminal("Shacks not Cathedrals Philosophy:")
      addToTerminal("Prioritizing adaptability, modularity, and resilience over rigid perfection.")
      addToTerminal("Systems should be like shacks — adaptable, lived-in, resistant to collapse.")
      addToTerminal("Every element is designed for adaptability, survivability, and creative emergence.")
      addToTerminal("FLOAT embodies this through its dual-layer architecture and X-ray mode.")
    } else if (cmd.startsWith("view ")) {
      const num = Number.parseInt(cmd.split(" ")[1])
      if (num >= 1 && num <= 5) {
        setSelectedJournalId(num)
        addToTerminal(`Navigating to journal entry ${num}...`)
      } else {
        addToTerminal("Error: Journal entry not found. Valid range is 1-5.")
      }
    } else {
      addToTerminal(`Command not recognized: ${input}`)
    }

    setTerminalInput("")
  }

  return (
    <div className="flex flex-col h-screen bg-black text-green-400 font-mono">
      {/* Header */}
      <header className="border-b border-green-800 p-4 flex justify-between items-center">
        <div className="flex items-center">
          <div className="mr-2 text-pink-500">∞</div>
          <h1 className="text-xl font-bold">
            <span className="text-pink-500">FLOAT.ShacksCathedrals</span> <span className="text-gray-600">v0.3.4</span>
          </h1>
        </div>
        <div className="flex space-x-4">
          {isMobile && (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="bg-black border-green-800 text-green-400 p-0">
                <div className="h-full flex flex-col">
                  <div className="p-4 border-b border-green-900">
                    <h3 className="text-xs text-pink-400 mb-2">JOURNAL ENTRIES:</h3>
                    <JournalNavigation
                      selectedJournalId={selectedJournalId}
                      setSelectedJournalId={setSelectedJournalId}
                    />
                  </div>
                  <div className="flex-1 p-4 overflow-auto">
                    <Terminal
                      history={terminalHistory}
                      input={terminalInput}
                      setInput={setTerminalInput}
                      onSubmit={handleTerminalSubmit}
                      compact
                    />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          )}
          <Button
            onClick={toggleXRayMode}
            variant="outline"
            className={cn(
              "border-gray-700 transition-colors",
              xrayMode && "bg-pink-900/30 text-pink-400 border-pink-700",
            )}
          >
            {xrayMode ? (
              <>
                <EyeOff className="mr-2 h-4 w-4" /> X-RAY ACTIVE
              </>
            ) : (
              <>
                <Eye className="mr-2 h-4 w-4" /> X-RAY MODE
              </>
            )}
          </Button>
        </div>
      </header>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left panel - Terminal */}
        {!isMobile && (
          <ResizablePanel defaultSize={30} minSize={20} maxSize={50} className="h-full">
            <div className="h-full border-r border-green-900 bg-black overflow-hidden flex flex-col">
              <div className="p-3 flex-grow overflow-auto">
                <Terminal
                  history={terminalHistory}
                  input={terminalInput}
                  setInput={setTerminalInput}
                  onSubmit={handleTerminalSubmit}
                />
              </div>

              {/* Navigation */}
              <div className="p-3 border-t border-green-900">
                <h3 className="text-xs text-pink-400 mb-2">JOURNAL ENTRIES:</h3>
                <JournalNavigation selectedJournalId={selectedJournalId} setSelectedJournalId={setSelectedJournalId} />
              </div>
            </div>
          </ResizablePanel>
        )}

        {/* Right panel - Content */}
        <div className="flex-1 overflow-auto bg-black">
          <MDXContent journalId={selectedJournalId} xrayMode={xrayMode} />
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-green-900 p-3 text-xs text-gray-600">
        <div className="flex justify-between items-center">
          <div>FLOAT.ShacksCathedrals © 2025</div>
          <div>
            <span className="text-pink-500">{"{∴}"}</span> recursive_memory::active • 
            <span className="text-pink-500">{"{⊡}"}</span> connection::secure • 
            <span className="text-pink-500">{"{■}"}</span> terminal::ready
          </div>
        </div>
      </footer>
    </div>
  )
}

function JournalNavigation({
  selectedJournalId,
  setSelectedJournalId,
}: {
  selectedJournalId: number
  setSelectedJournalId: (id: number) => void
}) {
  const journalEntries = [
    { id: 1, title: "Early Pattern Drawing", sigil: "{∴}" },
    { id: 2, title: "CAN'T SIT STILL", sigil: "{ψ}" },
    { id: 3, title: "Adaptation & Growth", sigil: "{∞}" },
    { id: 4, title: "Dots & Patterns", sigil: "{∴}" },
    { id: 5, title: "Frame & Imperfections", sigil: "{■}" },
  ]

  return (
    <div className="space-y-1">
      {journalEntries.map((entry) => (
        <button
          key={entry.id}
          onClick={() => setSelectedJournalId(entry.id)}
          className={cn(
            "w-full text-left px-2 py-1 text-sm rounded-sm",
            selectedJournalId === entry.id
              ? "bg-green-900/20 text-green-300 border-l-2 border-green-500"
              : "hover:bg-gray-900",
          )}
        >
          <span className="text-gray-500 mr-2">{entry.id}:</span>
          <span className="text-pink-500 mr-1">{entry.sigil}</span> {entry.title}
        </button>
      ))}
    </div>
  )
}
