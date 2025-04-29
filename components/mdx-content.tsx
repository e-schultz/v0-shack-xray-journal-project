"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface MDXContentProps {
  journalId: number
  xrayMode: boolean
}

export function MDXContent({ journalId, xrayMode }: MDXContentProps) {
  const [loading, setLoading] = useState(true)
  const [journal, setJournal] = useState<any>(null)

  useEffect(() => {
    async function fetchJournalContent() {
      setLoading(true)
      try {
        // In a real app, this would fetch from an API
        const journalData = getJournalData(journalId)
        setJournal(journalData)
      } catch (error) {
        console.error("Failed to fetch journal content:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchJournalContent()
  }, [journalId])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-pulse text-green-500">Loading journal entry...</div>
      </div>
    )
  }

  if (!journal) {
    return (
      <div className="p-6">
        <div className="text-red-500">Failed to load journal entry</div>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Header grid with visualization of concept connections */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <div className="md:col-span-2">
          <h2 className="text-2xl mb-2">
            <span className="text-cyan-400">[</span> {journal.title} <span className="text-cyan-400">]</span>
          </h2>
          <div className="text-sm text-gray-500 mb-4">{journal.date}</div>

          <div className="mb-6 border border-gray-800 p-4 bg-gray-900/20 rounded-sm">
            <div className="text-amber-400 mb-2">&gt; Journal Entry:</div>
            <div className="text-green-300">{journal.content}</div>
          </div>

          {xrayMode && (
            <div id="concept-connections" className="border-t border-pink-900/30 pt-4 mt-4">
              <div className="text-pink-400 mb-3">
                <span className="mr-2">◉</span>
                X-RAY ANALYSIS: CONCEPT CONNECTIONS
              </div>

              <div className="space-y-4">
                {journal.conceptConnections.map((connection: any, idx: number) => (
                  <div key={idx} className="border border-pink-800/30 p-3 rounded-sm bg-black">
                    <div className="flex items-center mb-2">
                      <span className="text-pink-500 mr-2">{connection.conceptCode || "{×}"}</span>
                      <h4 className="text-pink-300 font-bold">{connection.concept}</h4>
                    </div>
                    <p className="text-gray-400 mb-2 text-sm">{connection.description}</p>
                    <div className="bg-gray-900/30 p-2 text-xs border-l-2 border-cyan-700">
                      <span className="text-cyan-500 block mb-1">FLOAT Implementation:</span>
                      <span className="text-cyan-300">{connection.floatImplementation}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div>
          <div className="aspect-video bg-gray-900/30 rounded-sm border border-gray-800 mb-4 overflow-hidden">
            <img
              src={journal.imagePath || "/placeholder.svg"}
              alt={journal.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="border border-gray-800 p-3 rounded-sm">
            <h3 className="text-blue-400 text-sm mb-2">CONNECTED CONCEPTS:</h3>
            <div className="space-y-2">
              {journal.connectedConcepts.map((concept: any) => (
                <div
                  key={concept.id}
                  className={cn(
                    "p-2 border-l-2 text-sm",
                    xrayMode ? "border-pink-600 bg-pink-900/10" : "border-gray-700",
                  )}
                >
                  <div className="flex items-center">
                    {xrayMode && <span className="text-pink-500 mr-1">{concept.conceptCode}</span>}
                    <span className={xrayMode ? "text-pink-300" : "text-gray-300"}>{concept.title}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Philosophy section */}
      <div id="philosophy-implementation" className="mt-8">
        <h3 className="text-xl mb-4 border-b border-gray-800 pb-2">
          <span className="text-cyan-400">[</span> Philosophy Implementation <span className="text-cyan-400">]</span>
        </h3>

        <div className="grid md:grid-cols-2 gap-6">
          {journal.connectedConcepts.map((concept: any) => (
            <div
              key={concept.id}
              id={`concept-${concept.id}`}
              className={cn("border p-4 rounded-sm", xrayMode ? "border-pink-800" : "border-gray-800")}
            >
              <div className="flex items-center mb-3">
                {xrayMode && <span className="text-pink-500 mr-2">{concept.conceptCode}</span>}
                <h4 className={cn("font-bold", xrayMode ? "text-pink-300" : "text-cyan-400")}>{concept.title}</h4>
              </div>

              <p className="text-gray-400 mb-4 text-sm">{concept.description}</p>

              {xrayMode && (
                <div className="bg-gray-900/30 p-3 text-xs border-l-2 border-green-700">
                  <span className="text-green-500 block mb-1">FLOAT Implementation:</span>
                  <span className="text-green-300">{concept.floatImplementation}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* X-ray mode prompt/instruction */}
      <div className="mt-8 p-3 border border-gray-800 bg-gray-900/20 text-center">
        {xrayMode ? (
          <p className="text-cyan-400">
            X-Ray mode active.{" "}
            <span className="text-gray-400">
              Revealing connections between journal practices and FLOAT system concepts.
            </span>
          </p>
        ) : (
          <p className="text-gray-400">
            Type "<span className="text-green-400">xray</span>" or click X-RAY MODE to reveal conceptual connections.
          </p>
        )}
      </div>
    </div>
  )
}

// Mock data function - in a real app, this would be an API call
function getJournalData(journalId: number) {
  const journalEntries = [
    {
      id: 1,
      title: "Early Pattern Drawing",
      date: "June 2023",
      imagePath: "/chromatic-flow.png",
      content:
        "Started to connect the dots in this journal as a way to relax, and calm down anxiety attacks. The early drawings were angry scribbles - then I started to focus on slowing down my breath and trying to draw straight lines.",
      conceptConnections: [
        {
          concept: "Embracing Imperfection",
          conceptCode: "{∴}",
          description:
            "Finding calm through imperfect pattern creation became the foundation for accepting imperfection in all systems.",
          floatImplementation:
            "FLOAT's design prioritizes adaptability over perfection, allowing for imperfect inputs while maintaining functional structure.",
        },
        {
          concept: "Rhythmic Structure",
          conceptCode: "{⊡}",
          description:
            "The practice of drawing repetitive patterns established a core understanding of how rhythm and structure can contain chaos without eliminating it.",
          floatImplementation:
            "floatctl uses modular, repeatable patterns that can adapt to different content types while maintaining coherence.",
        },
      ],
      connectedConcepts: [
        {
          id: "adaptive-systems",
          title: "Adaptive Systems vs Rigid Structures",
          description:
            "Systems like shacks — adaptable, lived-in, resistant to collapse. Every element is designed for adaptability, survivability, and creative emergence — not for rigid control.",
          conceptCode: "{■}",
          floatImplementation:
            "FLOAT exists as a constellation of experimental implementations rather than a single monolithic product. Each implementation explores different aspects of the system, testing ideas and approaches in lightweight, adaptable forms.",
        },
        {
          id: "embracing-imperfection",
          title: "Embracing Imperfection",
          description:
            "Finding ways to make imperfection part of the whole, not throwing it away. This concept evolved from angry scribbles to calming straight lines in journals, overcoming perfectionism's paralysis.",
          conceptCode: "{∴}",
          floatImplementation:
            "floatctl intentionally preserves the 'rough edges' of thought capture, using them as features rather than bugs. The system treats imperfect inputs as valid and works with them rather than enforcing rigid structure.",
        },
      ],
    },
    // Additional journal entries would be here
    {
      id: 2,
      title: "CAN'T SIT STILL",
      date: "August 2023",
      imagePath: "/fluid-motion.png",
      content:
        "Maybe what I was trying to prove to myself is that I could ignore what works for me - and still be successful. That not doing it because of #ADHD would feel like a failure.",
      conceptConnections: [
        {
          concept: "Systems That Serve Humans",
          conceptCode: "{ψ}",
          description:
            "The recognition that fighting against your natural patterns leads to burnout inspired the principle that systems should adapt to humans, not the other way around.",
          floatImplementation:
            "FLOAT's knowledge structures adapt to different cognitive styles rather than enforcing rigid categorization.",
        },
        {
          concept: "Neurodivergent Design",
          conceptCode: "{∞}",
          description:
            "Acknowledging that ADHD is not a deficiency but a different operating system that requires compatible interfaces.",
          floatImplementation:
            "The CLI interface (floatctl) provides rapid context-switching and capture features specifically designed for ADHD thought patterns.",
        },
      ],
      connectedConcepts: [
        {
          id: "small-pieces",
          title: "Small Pieces, Loosely Joined",
          description:
            "FLOAT tools are utility-first — simple, modular pieces that can stand alone or compose into larger systems. Inspired by the Unix philosophy but adapted for cognitive workflows.",
          conceptCode: "{⊡}",
          floatImplementation:
            "The technical architecture of FLOAT follows this principle explicitly - small, focused components that can be composed and recombined as needed, rather than a monolithic system.",
        },
        {
          id: "building-resilience",
          title: "Building for Resilience",
          description:
            "When we get addicted to busy, all we get is noise, one fire to the next. No time to reflect, to learn, to grow. Systems should be designed to survive variance in skill, cognition, and human chaos.",
          conceptCode: "{ψ}",
          floatImplementation:
            "FLOAT assumes interruption, distraction, and inconsistent usage patterns as the default, not the exception. It's built to maintain functional utility even with sporadic use or partial adoption.",
        },
      ],
    },
    // More journal entries would follow...
    {
      id: 3,
      title: "Adaptation & Growth",
      date: "September 2023",
      imagePath: "/generative-bloom.png",
      content:
        "I had a coworker make an animated version of a few of these. I was drawing for myself, posting photos now and then - to have someone I respect as a designer do an animated version of these made me really happy. I thought I wasn't creative, and was nervous to share.",
      conceptConnections: [
        {
          concept: "Collaborative Evolution",
          conceptCode: "{∞}",
          description:
            "Sharing imperfect work and finding value in collaboration became central to the idea that systems should be collaborative and evolving rather than perfectly designed.",
          floatImplementation:
            "FLOAT's RitualAST framework explicitly incorporates others' perspectives and inputs as part of the knowledge structure.",
        },
        {
          concept: "Permeable Boundaries",
          conceptCode: "{⊡}",
          description:
            "The experience of sharing personal patterns and seeing them transformed demonstrated the value of systems with permeable boundaries.",
          floatImplementation:
            "FLOAT Concept Explorer allows multiple entry points and formats for knowledge, from structured data to conversation fragments.",
        },
      ],
      connectedConcepts: [
        {
          id: "small-pieces",
          title: "Small Pieces, Loosely Joined",
          description:
            "FLOAT tools are utility-first — simple, modular pieces that can stand alone or compose into larger systems. Inspired by the Unix philosophy but adapted for cognitive workflows.",
          conceptCode: "{⊡}",
          floatImplementation:
            "The technical architecture of FLOAT follows this principle explicitly - small, focused components that can be composed and recombined as needed, rather than a monolithic system.",
        },
        {
          id: "regenerative",
          title: "Regenerative vs Extractive",
          description:
            "The focus shifted from knowledge as static storage to knowledge as an active process of renewal and growth. This applies to both personal systems and larger organizational structures.",
          conceptCode: "{∞}",
          floatImplementation:
            "FLOAT's 'memory engine' doesn't just store information - it actively surfaces forgotten connections and insights through temporal cycles, deliberately bringing old ideas into new contexts.",
        },
      ],
    },
    {
      id: 4,
      title: "Dots & Patterns",
      date: "October 2023",
      imagePath: "/spilled-dots.png",
      content:
        "I remember sitting in Balzacs, having a orange citrus ginger drink. It kept spilling on the page - I almost wanted to start over, but reminded myself to accept imperfections.",
      conceptConnections: [
        {
          concept: "Environmental Integration",
          conceptCode: "{∴}",
          description:
            "Embracing accidents and incorporating them into the whole directly translated to the philosophy of building systems that can adapt to unexpected inputs and changes.",
          floatImplementation:
            "floatctl processes 'glitch events' as features rather than bugs, incorporating them into the knowledge structure.",
        },
        {
          concept: "Resilient Design",
          conceptCode: "{ψ}",
          description:
            "Learning to work with unexpected elements rather than rejecting them builds more adaptable and resilient structures.",
          floatImplementation:
            "FLOAT uses a 'bloom from rot' pattern that transforms errors and disruptions into new conceptual connections.",
        },
      ],
      connectedConcepts: [
        {
          id: "embracing-imperfection",
          title: "Embracing Imperfection",
          description:
            "Finding ways to make imperfection part of the whole, not throwing it away. This concept evolved from angry scribbles to calming straight lines in journals, overcoming perfectionism's paralysis.",
          conceptCode: "{∴}",
          floatImplementation:
            "floatctl intentionally preserves the 'rough edges' of thought capture, using them as features rather than bugs. The system treats imperfect inputs as valid and works with them rather than enforcing rigid structure.",
        },
        {
          id: "regenerative",
          title: "Regenerative vs Extractive",
          description:
            "The focus shifted from knowledge as static storage to knowledge as an active process of renewal and growth. This applies to both personal systems and larger organizational structures.",
          conceptCode: "{∞}",
          floatImplementation:
            "FLOAT's 'memory engine' doesn't just store information - it actively surfaces forgotten connections and insights through temporal cycles, deliberately bringing old ideas into new contexts.",
        },
      ],
    },
    {
      id: 5,
      title: "Frame & Imperfections",
      date: "November 2023",
      imagePath: "/imperfect-geometric-frame.png",
      content: "HAVE A ROUGH FRAME WORK TO GUIDE YOU BUT ACCEPT THE IMPERFECTIONS",
      conceptConnections: [
        {
          concept: "Shacks vs. Cathedrals",
          conceptCode: "{■}",
          description:
            "This direct insight from your journal became a cornerstone of the approach - creating guiding structures while embracing variance.",
          floatImplementation:
            "The entire FLOAT architecture follows this principle: FloatAST provides the framework while allowing for imperfect, evolving implementations.",
        },
        {
          concept: "Minimal Viable Structure",
          conceptCode: "{⊡}",
          description:
            "The concept that the minimum structure needed is the one that prevents collapse while enabling function.",
          floatImplementation:
            "floatctl's design principle of 'just enough structure to be useful' guides all feature development.",
        },
      ],
      connectedConcepts: [
        {
          id: "adaptive-systems",
          title: "Adaptive Systems vs Rigid Structures",
          description:
            "Systems like shacks — adaptable, lived-in, resistant to collapse. Every element is designed for adaptability, survivability, and creative emergence — not for rigid control.",
          conceptCode: "{■}",
          floatImplementation:
            "FLOAT exists as a constellation of experimental implementations rather than a single monolithic product. Each implementation explores different aspects of the system, testing ideas and approaches in lightweight, adaptable forms.",
        },
        {
          id: "building-resilience",
          title: "Building for Resilience",
          description:
            "When we get addicted to busy, all we get is noise, one fire to the next. No time to reflect, to learn, to grow. Systems should be designed to survive variance in skill, cognition, and human chaos.",
          conceptCode: "{ψ}",
          floatImplementation:
            "FLOAT assumes interruption, distraction, and inconsistent usage patterns as the default, not the exception. It's built to maintain functional utility even with sporadic use or partial adoption.",
        },
      ],
    },
  ]

  return journalEntries.find((entry) => entry.id === journalId) || journalEntries[0]
}
