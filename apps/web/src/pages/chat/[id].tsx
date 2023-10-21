import { getUserFromToken } from "@genius-ai/lib/server";

import ChatClient from "@/components/chat/ChatClient";
import {
  BrainWithMessagesType,
  getBrainDataWithMessages,
} from "@genius-ai/lib/query";

interface ChatIdPageProps {
  initialData: BrainWithMessagesType;
}

const ChatIdPage = (props: ChatIdPageProps) => {
  const { initialData } = props;

  return <ChatClient brain={initialData} />;
};

export async function getServerSideProps(context: any) {
  const user = await getUserFromToken(context.req, context.res);
  if (!user)
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  let initialData: BrainWithMessagesType | null = null;

  let brainId = "";

  if (context.query["id"]) {
    brainId = context.query["id"] as string;
  }

  try {
    initialData = await getBrainDataWithMessages(
      brainId,
      context.req,
      context.res
    );
  } catch (error) {
    initialData = null;
  }

  if (!initialData) {
    return {
      redirect: {
        destination: "/",
        permanent: true,
      },
    };
  }

  return { props: { initialData: JSON.parse(JSON.stringify(initialData)) } };
}

export default ChatIdPage;
