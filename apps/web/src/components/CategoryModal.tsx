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
  const { isOpen, onClose, setTitle, title } = useCategoryModal();
  const [isMounted, setIsMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<String | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleModalClose = () => {
    setError(null);
    setTitle(null);
    onClose();
  };

  const handleCheckTitle = async (_title: string) => {
    if (_title === undefined || _title === "" || _title === null) {
      return false;
    }

    try {
      setLoading(true);
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
    setLoading(false);
    return true;
  };

  const onSave = async () => {
    try {
      setLoading(true);

      if (!handleCheckTitle(title!)) {
        return;
      }

      await axios.post("/api/category", {
        title: title,
      });

      toast({
        description: "Category created successfully.",
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
          <DialogTitle className="text-center">Create Category</DialogTitle>
        </DialogHeader>
        <Separator />
        <div className="space-y-3">
          <Label className="text-sm">Title</Label>
          <Input
            placeholder="Latest"
            className={
              error ? "border-destructive ring-offset-destructive" : ""
            }
            onChange={(e) => setTitle(e.target.value)}
            onBlur={(e) => handleCheckTitle(e.target.value)}
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div className="flex justify-end pt-5">
            <Button
              onClick={onSave}
              disabled={loading || title === ""}
              variant="premium"
            >
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
