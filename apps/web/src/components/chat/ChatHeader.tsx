import axios from "axios";
import { ChevronLeft, Edit, MoreVertical, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { Brain, Message } from "@prisma/client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Button,
} from "@genius-ai/ui";
import BotAvatar from "./BotAvatar";

import { useProModal, useToast } from "@genius-ai/lib/hooks";

interface ChatHeaderProps {
  brain: Brain & {
    messages: Message[];
    _count: {
      messages: number;
    };
  };
  isPro: boolean;
}

const ChatHeader = ({ brain, isPro }: ChatHeaderProps) => {
  const router = useRouter();
  const { toast } = useToast();

  const { onOpen: onProModalOpen } = useProModal();

  const onDelete = async () => {
    if (!isPro) {
      onProModalOpen();
      return;
    }

    try {
      await axios.delete(`/api/brain/${brain.id}`);
      toast({
        description: "Successfully deleted.",
      });
      router.refresh();
      router.push("/");
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Something went wrong.",
      });
    }
  };

  const onEdit = () => {
    if (!isPro) {
      onProModalOpen();
      return;
    }

    router.push(`/brain/${brain.id}`);
  };

  return (
    <div className="flex w-full justify-between items-center border-b border-primary/10 pb-4">
      <div className="flex gap-x-2 items-center">
        <Button onClick={() => router.back()} size="icon" variant="ghost">
          <ChevronLeft className="h-8 w-8" />
        </Button>
        <BotAvatar src={brain.src} />
        <div className="flex flex-col gap-y-1">
          <div className="flex items-center gap-x-2">
            <p className="font-bold">{brain.name}</p>
          </div>
          <p className="text-xs text-muted-foreground">{brain.description}</p>
        </div>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" size="icon">
            <MoreVertical />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={onEdit}>
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onDelete} className="text-destructive">
            <Trash className="w-4 h-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ChatHeader;
