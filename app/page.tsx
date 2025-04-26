import { ChatForm } from "@/components/chat-form";

export default function Home() {
  return (
      <main className="flex flex-col min-h-screen justify-center p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <ChatForm />
      </main>
  );
}
