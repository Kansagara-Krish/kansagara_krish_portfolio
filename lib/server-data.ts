import { headers } from "next/headers";
import { getBaseUrl } from "@/lib/utils";

type ApiSuccess<T> = { data: T };

export async function fetchApi<T>(path: string, fallback: T, init?: RequestInit): Promise<T> {
  try {
    const headerList = await headers();
    const response = await fetch(`${getBaseUrl(headerList)}/api${path}`, {
      cache: "no-store",
      headers: {
        cookie: headerList.get("cookie") ?? "",
        ...(init?.headers ?? {})
      },
      ...init
    });
    if (!response.ok) {
      console.error(`fetchApi failed for ${path}: ${response.status} ${response.statusText}`);
      return fallback;
    }
    const json = (await response.json()) as ApiSuccess<T>;
    return json.data;
  } catch (error) {
    console.error(`fetchApi error for ${path}:`, error);
    return fallback;
  }
}
