"use client"

import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState, useEffect, useRef, FormEvent } from "react"

export function ChatForm() {

  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [input, setInput] = useState<string>("")
  const ws = useRef<WebSocket | null>(null)

  useEffect(() => {
    ws.current = new WebSocket("ws://localhost:8080/stream")

    ws.current.onopen = () => {
      console.log("WebSocket connection established")
    }

    ws.current.onmessage = (event) => {
      const message = event.data
      setResult((prevResult) => (prevResult ? prevResult + message : message))
    }

    ws.current.onerror = (error) => {
      console.error("WebSocket error:", error)
      toast("WebSocket error", {
        description: "An error occurred with the WebSocket connection.",
        icon: "❌",
      })
    }

    ws.current.onclose = () => {
      console.log("WebSocket connection closed")
    }

    return () => {
      ws.current?.close()
    }
  }, [])

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    try {
      if (ws.current?.readyState === WebSocket.OPEN) {
        ws.current.send(input)
      } else {
        throw new Error("WebSocket is not open")
      }
    } catch (error) {
      toast("Error submitting form", {
        description: (error as Error).message,
        icon: "❌",
      })
    } finally {
      setLoading(false)
      setInput("")
    }
  }

  return (
    <div>
      {result && (
        <div className="mb-4 p-4 border rounded h-2/3 overflow-y-auto">
          <h2 className="text-lg font-bold">Response:</h2>
          <pre className="whitespace-pre-wrap break-words">{result}</pre>
        </div>
      )}
      <form onSubmit={onSubmit}>
        <div className="flex items-end space-x-4">
          <Input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything" 
            className="bg-white/10 rounded-full"
          />
          <Button type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </form>
    </div>
  )
}
