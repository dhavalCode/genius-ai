"use-client";
import React from "react";
import { MoreVertical, Edit, Trash } from "lucide-react";
import { classNames, makeShortText } from "@genius-ai/lib/utils";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@genius-ai/ui";
import { Category } from "@prisma/client";

import { useCategoryModal, useClientSide } from "@genius-ai/lib/hooks";

interface CategoryItemProps {
  handleClick: (id: string | undefined) => void;
  item: Category;
  active: Boolean;
  isDesignMode: Boolean;
  handleDelete: (_id: string) => void;
}

function CategoryItem({
  handleClick,
  item,
  active,
  isDesignMode,
  handleDelete,
}: CategoryItemProps) {
  const {
    onOpen: onCategoryModalOpen,
    setCategoryTitle,
    setCategoryId,
  } = useCategoryModal();
  const isClientSide = useClientSide();
  return (
    <button
      onClick={() => handleClick(item.id)}
      className={classNames(
        `
            flex 
            justify-between
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
        active ? "bg-primary/25" : "bg-primary/10"
      )}
      key={item.id}
    >
      <span className="justify-self-start">{makeShortText(item.name, 20)}</span>
      {isDesignMode && isClientSide && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="secondary"
              size="icon"
              className="bg-transparent text-sm h-5 w-5 ml-2"
              type="button"
            >
              <MoreVertical className="h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                setCategoryTitle(item.name);
                setCategoryId(item.id);
                onCategoryModalOpen();
              }}
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(item.id);
              }}
            >
              <Trash className="w-4 h-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </button>
  );
}

export default CategoryItem;
