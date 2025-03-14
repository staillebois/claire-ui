"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useState } from "react"

const FormSchema = z.object({
  question: z.string().min(2, {
    message: "Question must be at least 2 characters.",
  }),
})

export function ChatForm() {

  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      question: "",
    },
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setLoading(true)
    try {
      const response = await fetch("http://localhost:8080/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Network response was not ok")
      }

      const result = await response.json()
      setResult(JSON.stringify(result, null, 2))
    } catch (error) {
      toast("Error submitting form", {
        description: (error as Error).message,
        icon: "❌",
      })
    } finally {
      setLoading(false)
      form.reset()
    }
  }

  return (
    <div>
      {result && (
        <div className="mb-4 p-4 border rounded">
          <h2 className="text-lg font-bold">Response:</h2>
          <pre className="whitespace-pre-wrap break-words">{result}</pre>
        </div>
      )}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex items-end space-x-4">
            <FormField
              control={form.control}
              name="question"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>How can I help you ?</FormLabel>
                  <FormControl>
                    <Input placeholder="Ask anything" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={loading}>
              {loading ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
