import { NEXT_PUBLIC_WEBAPP_URL } from "../constants";

export { default as classNames } from "../utils/classNames";

export function absoluteUrl(path: string) {
  return `${NEXT_PUBLIC_WEBAPP_URL}${path}`;
}
