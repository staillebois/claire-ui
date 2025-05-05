import { ChatForm } from "@/components/chat-form";

export default function Home() {
  return (
      <main>
          <div className='flex flex-col min-h-full w-full max-w-3xl mx-auto px-4'>
          <header className='sticky top-0 shrink-0 z-20  backdrop-blur rounded-b-2xl'>
            <div className='flex flex-col h-full w-full gap-1 p-4'>
              <h1 className='font-urbanist text-[1.65rem] font-semibold'>clAIre: speak with your RSS</h1>
            </div>
          </header>
          <ChatForm />
        </div>
      </main>
  );
}
