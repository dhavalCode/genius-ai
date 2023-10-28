import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import { signIn } from "next-auth/react";
import { SubmitHandler, useForm } from "react-hook-form";

import { NEXT_PUBLIC_WEBAPP_URL } from "@genius-ai/lib/constants";
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

type FormValues = {
  email: string;
  password: string;
  apiError: string;
  name: string;
};

export default function Signup(props: { source: string }) {
  const form = useForm<FormValues>({});
  const {
    register,
    trigger,
    formState: { errors, isSubmitting },
  } = form;

  const { theme } = useTheme();

  /* const handleErrors = async (resp: Response) => {
    if (!resp.ok) {
      const err = await resp.json();
      throw new Error(err.message);
    }
  }; */

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
        //  TODO Toast Add
        form.setError("apiError", { message: err.message });
      });
  };

  function renderApiError() {
    if (!errors.apiError) return;
    return (
      <div className="rounded-md bg-red-50 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            {/* <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" /> */}
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              {errors.apiError && <div>{errors.apiError?.message}</div>}
            </h3>
          </div>
        </div>
      </div>
    );
  }

  function renderFormValidation() {
    if (!errors.password && !errors.email) return;
    return (
      <div className="rounded-md bg-red-50 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            {/* <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" /> */}
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              {errors.password && <div>{errors.password?.message}</div>}
            </h3>
            <h3 className="text-sm font-medium text-red-800">
              {errors.email && <div>{errors.email?.message}</div>}
            </h3>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <p className="flex items-center mb-6 text-3xl font-semibold text-gray-900 dark:text-white">
          <Image className="w-8 h-8 mr-2" src={logoSvgImg} alt="logo" />
          Genius AI
        </p>
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-semibold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Create your account
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
                    render={({ field }) => (
                      <FormItem className="col-span-2 md:col-span-1">
                        <FormControl>
                          <Input
                            id="name"
                            type="text"
                            placeholder="Dhaval Patel"
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
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Your email
                  </label>
                  <FormField
                    name="email"
                    control={form.control}
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
                    control={form.control}
                    render={({ field }) => (
                      <FormItem className="col-span-2 md:col-span-1">
                        <FormControl>
                          <Input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            {...field}
                          />
                        </FormControl>
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
                  >
                    <Image
                      className="w-5 h-5"
                      src={theme === "dark" ? githubWhiteSvgImg : githubSvgImg}
                      alt="Google"
                    />
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
