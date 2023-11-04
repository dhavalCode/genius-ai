import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { NEXT_PUBLIC_WEBAPP_URL } from "@genius-ai/lib/constants";
import { signIn } from "next-auth/react";
import { useClientSide, useToast } from "@genius-ai/lib/hooks";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  Input,
  Button,
} from "@genius-ai/ui";

import logoSvgImg from "@/assets/ai-logo.svg";
import googleSvgImg from "@/assets/google.svg";
import githubSvgImg from "@/assets/github.svg";
import githubWhiteSvgImg from "@/assets/github-white.svg";

interface LoginValues {
  email: string;
  password: string;
}

export default function Login() {
  const router = useRouter();
  const methods = useForm<LoginValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const { toast } = useToast();
  const { theme } = useTheme();
  const isClientSide = useClientSide();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  let callbackUrl =
    typeof router.query?.callbackUrl === "string"
      ? router.query.callbackUrl
      : "";

  // If not absolute URL, make it absolute
  if (!/^https?:\/\//.test(callbackUrl)) {
    callbackUrl = `${NEXT_PUBLIC_WEBAPP_URL}/${callbackUrl}`;
  }

  const onSubmit = async (values: LoginValues) => {
    setErrorMessage(null);
    const res = await signIn<"credentials">("credentials", {
      ...values,
      callbackUrl,
      redirect: false,
    });
    if (!res) {
      setErrorMessage("Error");
    } else if (!res.error) {
      // we're logged in, let's do a hard refresh to the original url
      router.push(callbackUrl);
    } else {
      if (res.status == 401) {
        toast({
          variant: "destructive",
          description: "Invalid email or password.",
          duration: 3000,
        });

        // toast.error("Invalid email or password.");
      } else {
        // toast.error("Could not login.");
        toast({
          variant: "destructive",
          description: "Could not login.",
          duration: 3000,
        });
      }
    }
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <a
          href="#"
          className="flex items-center mb-6 text-3xl font-semibold text-gray-900 dark:text-white"
        >
          <Image className="w-8 h-8 mr-2" src={logoSvgImg} alt="logo" />
          Genius AI
        </a>
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-semibold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Welcome back
            </h1>
            <Form {...methods}>
              <form
                className="space-y-4 md:space-y-6"
                onSubmit={methods.handleSubmit(onSubmit)}
              >
                <input type="hidden" name="remember" defaultValue="true" />
                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Your email
                  </label>
                  <FormField
                    name="email"
                    control={methods.control}
                    render={({ field }) => (
                      <FormItem className="col-span-2 md:col-span-1">
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="x@example.com"
                            autoComplete="email"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  {/* <Input
                    placeholder="x@example.com"
                    {...register("email")}
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                  /> */}

                  {/*                 <input
                  type="email"
                  name="email"
                  id="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="name@company.com"
                /> */}
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
                    control={methods.control}
                    render={({ field }) => (
                      <FormItem className="col-span-2 md:col-span-1">
                        <FormControl>
                          <Input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            autoComplete="current-password"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {/* <Input
                    {...register("password")}
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="focus:border-neon focus:ring-neon relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:outline-none sm:text-sm"
                    placeholder="Password"
                  /> */}

                  {/* <input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="••••••••"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  /> */}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="remember"
                        aria-describedby="remember"
                        type="checkbox"
                        className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label
                        htmlFor="remember"
                        className="text-gray-500 dark:text-gray-300"
                      >
                        Remember me
                      </label>
                    </div>
                  </div>
                  <a
                    href="#"
                    className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500"
                  >
                    Forgot password?
                  </a>
                </div>

                <Button className="w-full" size="lg" type="submit">
                  Sign In
                </Button>

                {/* <button
                type="submit"
                className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                Sign in
              </button> */}
                <div className="inline-flex items-center justify-center w-full">
                  <hr className="w-full h-px my-2 bg-gray-200 border-0 dark:bg-gray-700" />
                  <span className="absolute px-2 opacity-75 bg-white dark:bg-gray-800 text-gray-900 -translate-x-1/2 left-1/2 dark:text-white">
                    Or sign in with
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
          Don’t have an account yet?{" "}
          <Link
            href="/signup"
            className="font-medium text-primary-600 hover:underline dark:text-primary-500"
          >
            Sign up
          </Link>
        </p>
      </div>
    </section>
  );
}
