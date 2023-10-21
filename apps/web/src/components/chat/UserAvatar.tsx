import { Avatar, AvatarImage } from "@genius-ai/ui";
import { useSession } from "next-auth/react";

const UserAvatar = () => {
  const { data: session } = useSession();

  const { image } = session?.user || { image: "", name: "" };

  return (
    <Avatar className="h-12 w-12">
      <AvatarImage src={image ?? ""} />
    </Avatar>
  );
};

export default UserAvatar;
