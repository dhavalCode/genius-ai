import axios from "axios";
import qs from "query-string";
import { PlusCircle } from "lucide-react";
import { Category } from "@prisma/client";
import { useRouter, useSearchParams } from "next/navigation";

import { classNames } from "@genius-ai/lib/utils";
import { toast, useCategoryModal } from "@genius-ai/lib/hooks";
import CategoryItem from "./CategoryItem";

interface CategoriesProps {
  data: Category[];
  isDesignMode: Boolean;
}

export const Categories = ({ data, isDesignMode }: CategoriesProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { onOpen: onCategoryOpen } = useCategoryModal();

  const categoryId = searchParams?.get("categoryId");

  const onClick = (id: string | undefined) => {
    const query = { categoryId: id };

    const url = qs.stringifyUrl(
      {
        url: window.location.href,
        query,
      },
      { skipNull: true }
    );

    router.push(url);
  };

  const handleDelete = async (_id: string) => {
    try {
      await axios.delete(`/api/category/${_id}`);

      toast({
        description: "Category deleted successfully.",
        variant: "default",
      });

      router.push("/");
    } catch (error) {
      toast({
        description: "Something went wrong",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full overflow-x-auto space-x-2 flex p-1">
      <button
        onClick={() => onClick(undefined)}
        className={classNames(
          `
          flex 
          items-center 
          text-center 
          text-xs 
          md:text-sm 
          px-2 
          md:px-4 
          py-2 
          md:py-3 
          rounded-md 
          bg-primary/10 
          hover:opacity-75 
          transition
        `,
          !categoryId ? "bg-primary/25" : "bg-primary/10"
        )}
      >
        All
      </button>
      {data.map((item) => (
        <CategoryItem
          key={item.id}
          item={item}
          handleClick={onClick}
          active={item.id === categoryId}
          isDesignMode={isDesignMode}
          handleDelete={handleDelete}
        />
      ))}
      {isDesignMode && (
        <button
          onClick={onCategoryOpen}
          className="flex items-center text-center text-xs md:text-sm px-2 md:px-4 py-2 md:py-3 rounded-md bg-transparent hover:opacity-75 transition"
        >
          <PlusCircle />
        </button>
      )}
    </div>
  );
};
