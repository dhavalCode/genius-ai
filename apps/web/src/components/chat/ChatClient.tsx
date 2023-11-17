import { useCompletion } from "ai/react";
import { FormEvent, useState } from "react";
import { Brain, Message } from "@prisma/client";
import { useRouter } from "next/navigation";

import ChatForm from "@/components/chat/ChatForm";
import ChatHeader from "@/components/chat/ChatHeader";
import ChatMessages from "@/components/chat/ChatMessages";
import { ChatMessageProps } from "@/components/chat/ChatMessage";

interface ChatClientProps {
  brain: Brain & {
    messages: Message[];
    _count: {
      messages: number;
    };
  };
  isPro: boolean;
}

const ChatClient = ({ brain, isPro }: ChatClientProps) => {
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessageProps[]>(brain.messages);

  const { input, isLoading, handleInputChange, handleSubmit, setInput } =
    useCompletion({
      api: `/api/chat/${brain.id}`,
      onFinish(_prompt, completion) {
        const systemMessage: ChatMessageProps = {
          role: "system",
          content: completion,
        };

        setMessages((current) => [...current, systemMessage]);
        setInput("");

        router.refresh();
      },
    });

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    const userMessage: ChatMessageProps = {
      role: "user",
      content: input,
    };

    setMessages((current) => [...current, userMessage]);

    handleSubmit(e);
  };

  return (
    <div className="flex flex-col h-screen max-h-screen p-4 space-y-2">
      <ChatHeader brain={brain} isPro={isPro} />
      <ChatMessages brain={brain} isLoading={isLoading} messages={messages} />
      <ChatForm
        isLoading={isLoading}
        input={input}
        handleInputChange={handleInputChange}
        onSubmit={onSubmit}
      />
    </div>
  );
};

export default ChatClient;
