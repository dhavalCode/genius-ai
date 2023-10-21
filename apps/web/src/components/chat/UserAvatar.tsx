import { Avatar, AvatarImage } from "@genius-ai/ui";
import { useSession } from "next-auth/react";

const UserAvatar = () => {
  const { data: session } = useSession();

  const { image, email } = session?.user || { image: "", email: "" };

  return (
    <Avatar className="h-12 w-12">
      {image ? (
        <AvatarImage src={image ?? ""} />
      ) : (
        <div className="relative inline-flex h-11 w-11 items-center justify-center overflow-hidden bg-primary/10">
          <span className="font-medium text-gray-600 dark:text-gray-300">
            {email?.at(0)?.toUpperCase()}
          </span>
        </div>
      )}
    </Avatar>
  );
};

export default UserAvatar;
