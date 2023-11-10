import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import { signIn } from "next-auth/react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { getUserFromToken } from "@genius-ai/lib/server";
import { toast, useClientSide } from "@genius-ai/lib/hooks";

import { NEXT_PUBLIC_WEBAPP_URL } from "@genius-ai/lib/constants";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  Input,
  Button,
  FormDescription,
} from "@genius-ai/ui";

import logoSvgImg from "@/assets/ai-logo.svg";
import googleSvgImg from "@/assets/google.svg";
import githubSvgImg from "@/assets/github.svg";
import githubWhiteSvgImg from "@/assets/github-white.svg";
import { signupSchema } from "@genius-ai/lib/validations";
import { classNames } from "@genius-ai/lib/utils";

type FormValues = {
  email: string;
  password: string;
  name: string;
};

export default function Signup(props: { source: string }) {
  const form = useForm<FormValues>({
    resolver: zodResolver(signupSchema),
  });

  const { theme } = useTheme();

  const isClientSide = useClientSide();

  const signUp: SubmitHandler<FormValues> = async (data) => {
    axios
      .post("/api/auth/signup", { source: props.source, ...data })
      .then(async () => {
        await signIn<"credentials">("credentials", {
          ...data,
          callbackUrl: `${NEXT_PUBLIC_WEBAPP_URL}`,
        });
      })
      .catch((err) => {
        if (err?.response?.data?.message) {
          toast({
            variant: "destructive",
            description: err.response.data.message,
          });
        } else {
          toast({
            variant: "destructive",
            description: "Something went wrong",
          });
        }
      });
  };

  return (
    <section className=" dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <p className="flex items-center mb-6 text-3xl font-semibold text-gray-900 dark:text-white">
          <Image className="w-8 h-8 mr-2" src={logoSvgImg} alt="logo" />
          Genius.ai
        </p>
        <div className="w-full bg-slate-100 rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-semibold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Create your account 🚀
            </h1>
            <Form {...form}>
              <form
                className="space-y-4 md:space-y-6"
                onSubmit={form.handleSubmit(signUp)}
              >
                <input type="hidden" name="remember" defaultValue="true" />
                <div>
                  <label
                    htmlFor="name"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Your name
                  </label>
                  <FormField
                    name="name"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <FormItem className="col-span-2 md:col-span-1">
                        <FormControl>
                          <Input
                            id="name"
                            type="text"
                            placeholder="Dhaval Patel"
                            className={classNames(
                              "dark:bg-background/30",
                              fieldState.error?.message
                                ? "border-destructive focus-visible:ring-destructive"
                                : ""
                            )}
                            {...field}
                          />
                        </FormControl>
                        {fieldState.error?.message && (
                          <FormDescription className="text-destructive">
                            {fieldState.error.message}
                          </FormDescription>
                        )}
                      </FormItem>
                    )}
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Your email
                  </label>
                  <FormField
                    name="email"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <FormItem className="col-span-2 md:col-span-1">
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="x@example.com"
                            autoComplete="email"
                            className={classNames(
                              "dark:bg-background/30",
                              fieldState.error?.message
                                ? "border-destructive focus-visible:ring-destructive"
                                : ""
                            )}
                            {...field}
                          />
                        </FormControl>
                        {fieldState.error?.message && (
                          <FormDescription className="text-destructive">
                            {fieldState.error.message}
                          </FormDescription>
                        )}
                      </FormItem>
                    )}
                  />
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Password
                  </label>

                  <FormField
                    name="password"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <FormItem className="col-span-2 md:col-span-1">
                        <FormControl>
                          <Input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            className={classNames(
                              "dark:bg-background/30",
                              fieldState.error?.message
                                ? "border-destructive focus-visible:ring-destructive"
                                : ""
                            )}
                            {...field}
                          />
                        </FormControl>
                        {fieldState.error?.message && (
                          <FormDescription className="text-destructive">
                            {fieldState.error.message}
                          </FormDescription>
                        )}
                      </FormItem>
                    )}
                  />
                </div>

                <Button className="w-full" size="lg" type="submit">
                  Create Account
                </Button>

                <div className="inline-flex items-center justify-center w-full">
                  <hr className="w-full h-px my-2 bg-gray-200 border-0 dark:bg-gray-700" />
                  <span className="absolute px-2 opacity-75 bg-white dark:bg-gray-800 text-gray-900 -translate-x-1/2 left-1/2 dark:text-white">
                    Or continue with
                  </span>
                </div>

                {/* ### Providers ###  */}

                <div>
                  <Button
                    className="w-full"
                    size="lg"
                    variant="outline"
                    type="button"
                    onClick={() => signIn("google")}
                  >
                    <Image
                      className="w-5 h-5"
                      src={googleSvgImg}
                      alt="Google"
                    />
                    <span className="mx-1" />
                    Google
                  </Button>

                  <Button
                    className="w-full mt-3"
                    size="lg"
                    variant="outline"
                    type="button"
                    onClick={() => signIn("github")}
                  >
                    {isClientSide && (
                      <Image
                        className="w-5 h-5"
                        src={
                          theme === "dark" ? githubWhiteSvgImg : githubSvgImg
                        }
                        alt="Github"
                      />
                    )}
                    <span className="mx-1" />
                    Github
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
        <p className="text-sm mt-3 font-light text-gray-500 dark:text-gray-400">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-primary-600 hover:underline dark:text-primary-500"
          >
            Login
          </Link>
        </p>
      </div>
    </section>
  );
}

export async function getServerSideProps(context: any) {
  const user = await getUserFromToken(context.req, context.res);
  if (user)
    return {
      redirect: {
        source: "/signup",
        destination: "/",
        permanent: false,
      },
    };

  return { props: {} };
}
