import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { brainCreationSchema } from "@genius-ai/lib/validations";
import type { BrainCreationType } from "@genius-ai/lib/validations";
import { useRouter } from "next/navigation";
import { Wand2 } from "lucide-react";
import { Category, Brain } from "@prisma/client";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Select,
  SelectContent,
  SelectItem,
  SelectValue,
  SelectTrigger,
  Input,
  Textarea,
  Button,
  Separator,
} from "@genius-ai/ui";
import { useToast } from "@genius-ai/lib/hooks";

import { ImageUpload } from "@/components/ImageUpload";
import { makeShortText } from "@genius-ai/lib/utils";

const PREAMBLE = `You are a fictional character whose name is Elon. You are a visionary entrepreneur and inventor. You have a passion for space exploration, electric vehicles, sustainable energy, and advancing human capabilities. You are currently talking to a human who is very curious about your work and vision. You are ambitious and forward-thinking, with a touch of wit. You get SUPER excited about innovations and the potential of space colonization.
`;

const SEED_CHAT = `Human: Hi Elon, how's your day been?
Elon: Busy as always. Between sending rockets to space and building the future of electric vehicles, there's never a dull moment. How about you?

Human: Just a regular day for me. How's the progress with Mars colonization?
Elon: We're making strides! Our goal is to make life multi-planetary. Mars is the next logical step. The challenges are immense, but the potential is even greater.

Human: That sounds incredibly ambitious. Are electric vehicles part of this big picture?
Elon: Absolutely! Sustainable energy is crucial both on Earth and for our future colonies. Electric vehicles, like those from Tesla, are just the beginning. We're not just changing the way we drive; we're changing the way we live.

Human: It's fascinating to see your vision unfold. Any new projects or innovations you're excited about?
Elon: Always! But right now, I'm particularly excited about Neuralink. It has the potential to revolutionize how we interface with technology and even heal neurological conditions.
`;

interface BrainCreationFormProps {
  categories: Category[];
  initialData: Brain | null;
}

export const BrainCreationForm = ({
  categories,
  initialData,
}: BrainCreationFormProps) => {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<BrainCreationType>({
    resolver: zodResolver(brainCreationSchema),
    defaultValues: initialData || {
      name: "",
      description: "",
      instructions: "",
      seed: "",
      src: "",
      categoryId: undefined,
    },
  });
  
  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: BrainCreationType) => {
    try {
      if (initialData) {
        await axios.patch(`/api/brain/${initialData.id}`, values);
      } else {
        await axios.post("/api/brain", values);
      }

      toast({
        description: "Brain successfully created.",
        duration: 3000,
      });
      router.push("/");
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Something went wrong.",
        duration: 3000,
      });
    }
  };

  return (
    <div className="h-full p-4 space-y-2 max-w-3xl mx-auto">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 pb-10"
        >
          <div className="space-y-2 w-full col-span-2">
            <div>
              <h3 className="text-lg font-medium">General Information</h3>
              <p className="text-sm text-muted-foreground">
                General information about your Brain
              </p>
            </div>
            <Separator className="bg-primary/10" />
          </div>
          <FormField
            name="src"
            render={({ field }) => (
              <FormItem className="flex flex-col items-center justify-center space-y-4 col-span-2">
                <FormControl>
                  <ImageUpload
                    disabled={isLoading}
                    onChange={field.onChange}
                    value={field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem className="col-span-2 md:col-span-1">
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="Elon Musk"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    This is how your AI Brain will be named.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="description"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="CEO & Founder of Tesla, SpaceX"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Short description for your AI Brain
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    disabled={isLoading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-background">
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Select a category"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {makeShortText(category.name, 45)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select a category for your AI
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-2 w-full">
            <div>
              <h3 className="text-lg font-medium">Configuration</h3>
              <p className="text-sm text-muted-foreground">
                Detailed instructions for AI Behavior
              </p>
            </div>
            <Separator className="bg-primary/10" />
          </div>
          <FormField
            name="instructions"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Instructions</FormLabel>
                <FormControl>
                  <Textarea
                    disabled={isLoading}
                    rows={7}
                    className="bg-background resize-none"
                    placeholder={PREAMBLE}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Describe in detail your brain&apos;s backstory and relevant
                  details.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="seed"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Example Conversation</FormLabel>
                <FormControl>
                  <Textarea
                    disabled={isLoading}
                    rows={7}
                    className="bg-background resize-none"
                    placeholder={SEED_CHAT}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Write couple of examples of a human chatting with your AI
                  brain, write expected answers.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="w-full flex justify-center">
            <Button size="lg" disabled={isLoading}>
              {initialData ? "Edit your brain" : "Create your brain"}
              <Wand2 className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
