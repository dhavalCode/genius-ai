import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
} from "@genius-ai/ui";
import { Button } from "@genius-ai/ui";
import { Separator } from "@genius-ai/ui";

import { useCategoryModal } from "@genius-ai/lib/hooks";
import { useToast } from "@genius-ai/lib/hooks";

export const CategoryModal = () => {
  const {
    isOpen,
    onClose,
    setCategoryTitle,
    categoryTitle,
    categoryId,
    setCategoryId,
  } = useCategoryModal();
  const [isMounted, setIsMounted] = useState(false);
  const [title, setTitle] = useState(categoryTitle);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<String | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTitle(categoryTitle ?? "");
    }
  }, [isOpen]);

  const handleModalClose = () => {
    onClose();
    setTimeout(() => {
      setCategoryId(null);
      setError(null);
      setCategoryTitle(null);
    }, 200);
  };

  const handleCheckTitle = async (_title: string) => {
    if (_title === undefined || _title === "" || _title === null) {
      return false;
    }

    if (_title.toLowerCase() === categoryTitle?.toLocaleLowerCase()) {
      return true;
    }

    try {
      const response = await axios.get(
        `/api/category/check-title?title=${_title}`
      );

      if (!response?.data) {
        throw new Error();
      }

      if (response.data.exist === true) {
        setError("Title already exist in our records");
        return false;
      }
    } catch (error) {
      toast({
        description: "Something went wrong while checking title",
        variant: "destructive",
      });
      handleModalClose();
      return false;
    }

    setError(null);
    return true;
  };

  const onSave = async () => {
    const sanitizeTitle = title?.trim();
    try {
      setLoading(true);

      if (!(await handleCheckTitle(sanitizeTitle!))) {
        return;
      }

      await axios.put("/api/category", {
        title: sanitizeTitle,
        ...(categoryId && {
          categoryId,
        }),
      });

      toast({
        description: categoryId
          ? "Category updated successfully."
          : "Category created successfully.",
        variant: "default",
      });

      handleModalClose();

      router.push("/");
    } catch (error) {
      toast({
        description: "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isMounted) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleModalClose}>
      <DialogContent>
        <DialogHeader className="space-y-4">
          <DialogTitle className="text-center">
            {categoryId ? "Update" : "Create"} Category
          </DialogTitle>
        </DialogHeader>
        <Separator />
        <div className="space-y-3">
          <Label className="text-sm">Title</Label>
          <Input
            value={title ?? ""}
            placeholder="Latest"
            className={
              error ? "border-destructive ring-offset-destructive" : ""
            }
            onChange={(e) => setTitle(e.target.value)}
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div className="flex justify-end pt-5">
            <Button
              onClick={onSave}
              disabled={loading || title === ""}
              variant="premium"
            >
              {loading ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
