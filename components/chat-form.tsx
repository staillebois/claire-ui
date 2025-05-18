"use client"

import { toast } from "sonner"
import { useImmer } from 'use-immer';
import { useState, useEffect, useRef } from "react"
import ChatMessages from '@/components/chat-messages';
import ChatInput from '@/components/chat-input';

export function ChatForm() {

  const ws = useRef<WebSocket | null>(null)

  const [messages, setMessages] = useImmer<Array<{
    role: 'user' | 'assistant';
    content: string;
    loading?: boolean;
    error?: boolean;
    sources?: string[];
  }>>([]);
  const [newMessage, setNewMessage] = useState('');
  const isLoading = messages.length > 0 && messages[messages.length - 1].loading === true;

  useEffect(() => {
    ws.current = new WebSocket("ws://localhost:8080/stream")

    ws.current.onopen = () => {
      console.log("WebSocket connection established")
    }

    ws.current.onmessage = (event) => {
      const message = event.data
      setMessages(draft => {
        if (draft.length > 0) {
          draft[draft.length - 1].content += message;
          draft[draft.length - 1].loading = false;
        }
      });
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

  async function submitNewMessage() {
    const trimmedMessage = newMessage.trim();
    if (!trimmedMessage || isLoading) return;

    setMessages(draft => [...draft,
      { role: 'user', content: trimmedMessage },
      { role: 'assistant', content: '', sources: [], loading: true }
    ]);
    setNewMessage('');
    try {
      if (ws.current?.readyState === WebSocket.OPEN) {
        ws.current.send(trimmedMessage)
      } else {
        throw new Error("WebSocket is not open")
      }
    } catch (error) {
      toast("Error submitting form", {
        description: (error as Error).message,
        icon: "❌",
      })
      setMessages(draft => {
        draft[draft.length - 1].loading = false;
        draft[draft.length - 1].error = true;
      });
    }
  }

  return (
    <div>
      {messages.length === 0 && (
        <div>{/* Chatbot welcome message */}</div>
      )}
      <ChatMessages
        messages={messages}
        isLoading={isLoading}
      />
      <ChatInput
        newMessage={newMessage}
        isLoading={isLoading}
        setNewMessage={setNewMessage}
        submitNewMessage={submitNewMessage}
      />
    </div>
  )
}
