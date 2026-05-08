import { MessagesInbox } from "@/components/admin/MessagesInbox";
import { fetchApi } from "@/lib/server-data";
import type { ContactMessageDTO } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminMessagesPage() {
  const messages = await fetchApi<ContactMessageDTO[]>("/messages", []);
  return <MessagesInbox messages={messages} />;
}
