"use client"

import { AnimatedThemeToggler } from "@/components/custom/animated-theme-toggler"
import { ThemeColorToggle } from "@/components/custom/theme-color-toggle"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useUsername } from "@/hooks/use-username"
import { client } from "@/lib/client"
import { useRealtime } from "@/lib/realtime-client"
import { cn } from "@/lib/utils"
import { useMutation, useQuery } from "@tanstack/react-query"
import { format } from "date-fns"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"

function formatTimeRemaining(seconds: number) {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, "0")}`
}

const Page = () => {
  const params = useParams()
  const roomId = params.roomId as string

  const router = useRouter()

  const { username } = useUsername()
  const [input, setInput] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  const [copyStatus, setCopyStatus] = useState("COPY")
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null)

  useQuery({
    queryKey: ["ttl", roomId],
    queryFn: async () => {
      const res = await client.room.ttl.get({ query: { roomId } })
      setTimeRemaining(res.data?.ttl ?? null)
      return res.data
    },
  })

  useEffect(() => {
    if (timeRemaining === null || timeRemaining < 0) return

    if (timeRemaining === 0) {
      router.push("/?destroyed=true")
      return
    }

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(interval)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [timeRemaining, router])

  const { data: messages, refetch } = useQuery({
    queryKey: ["messages", roomId],
    queryFn: async () => {
      const res = await client.messages.get({ query: { roomId } })
      return res.data
    },
  })

  const { mutate: sendMessage, isPending } = useMutation({
    mutationFn: async ({ text }: { text: string }) => {
      await client.messages.post({ sender: username, text }, { query: { roomId } })

      setInput("")
    },
  })

  useRealtime({
    channels: [roomId],
    events: ["chat.message", "chat.destroy"],
    onData: ({ event }) => {
      if (event === "chat.message") {
        refetch()
      }

      if (event === "chat.destroy") {
        router.push("/?destroyed=true")
      }
    },
  })

  const { mutate: destroyRoom } = useMutation({
    mutationFn: async () => {
      await client.room.delete(null, { query: { roomId } })
    },
  })

  useEffect(() => {
    const leaveRoom = () => {
      // Use keepalive to allow this request during tab close/navigation
      fetch(`/api/room/leave?roomId=${roomId}`, {
        method: "DELETE",
        keepalive: true,
      }).catch(() => {
        /* best-effort */
      })
    }

    // Handle tab close and page navigation
    window.addEventListener("beforeunload", leaveRoom)
    // pagehide fires on navigation away from the page
    window.addEventListener("pagehide", leaveRoom)

    return () => {
      window.removeEventListener("beforeunload", leaveRoom)
      window.removeEventListener("pagehide", leaveRoom)
      // Don't call leaveRoom() here - it would run on component unmount
      // which happens during React Strict Mode remounts
    }
  }, [roomId])

  const copyLink = () => {
    const url = window.location.href
    navigator.clipboard.writeText(url)
    setCopyStatus("COPIED!")
    setTimeout(() => setCopyStatus("COPY"), 2000)
  }

  const handleSendMessage = () => {
    if (!input.trim()) return

    sendMessage({ text: input })
    inputRef.current?.focus()
  }

  return (
    <main className="flex flex-col h-screen max-h-screen overflow-hidden bg-background text-foreground">
      <header className="border-b p-4 flex items-center justify-between bg-background">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground/60 uppercase">Room ID</span>
            <div className="flex items-center gap-2">
              <span className="font-bold text-primary truncate">
                {roomId.slice(0, 10) + "..."}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={copyLink}
                className="h-5 text-[10px] px-2"
              >
                {copyStatus}
              </Button>
            </div>
          </div>

          <Separator orientation="vertical" className="h-8!" />

          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground/60 uppercase">Self-Destruct</span>
            <span
              className={cn(
                "text-sm font-bold flex items-center gap-2",
                timeRemaining !== null && timeRemaining < 60
                  ? "text-destructive"
                  : "text-amber-500"
              )}
            >
              {timeRemaining !== null ? formatTimeRemaining(timeRemaining) : "--:--"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => destroyRoom()}
          >
            <span className="group-hover:animate-pulse">💣</span>
            DESTROY NOW
          </Button>

          <Separator orientation="vertical" className="h-5 bg-border" />

          <ThemeColorToggle />
          <AnimatedThemeToggler />
        </div>
      </header>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
        {messages?.messages.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground/60 text-sm font-mono">
              No messages yet, start the conversation.
            </p>
          </div>
        )}

        {messages?.messages.map((msg) => (
          <div key={msg.id} className="flex flex-col items-start">
            <div className="max-w-[80%] group">
              <div className="flex items-baseline gap-3 mb-1">
                <span
                  className={cn(
                    "text-xs font-bold",
                    msg.sender === username ? "text-primary" : "text-blue-500"
                  )}
                >
                  {msg.sender === username ? "YOU" : msg.sender}
                </span>

                <span className="text-[10px] text-muted-foreground/60">
                  {format(msg.timestamp, "HH:mm")}
                </span>
              </div>

              <p className="text-sm text-foreground leading-relaxed break-all">
                {msg.text}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t bg-background">
        <div className="flex gap-4">
          <div className="flex-1 relative group">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary animate-pulse">
              {">"}
            </span>
            <input
              autoFocus
              type="text"
              value={input}
              onKeyDown={(e) => {
                if (e.key === "Enter" && input.trim()) {
                  sendMessage({ text: input })
                  inputRef.current?.focus()
                }
              }}
              placeholder="Type message..."
              onChange={(e) => setInput(e.target.value)}
              className="w-full border border-border focus:outline-none transition-colors text-foreground placeholder:text-muted-foreground/50 py-3 pl-8 pr-4 text-sm"
            />
          </div>

          <button
            onClick={handleSendMessage}
            disabled={!input.trim() || isPending}
            className="bg-primary text-primary-foreground px-6 text-sm font-bold hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            SEND
          </button>
        </div>
      </div>
    </main>
  )
}

export default Page
