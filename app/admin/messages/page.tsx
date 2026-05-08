import { MessagesInbox } from "@/components/admin/MessagesInbox";
import { getContactMessages } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function AdminMessagesPage() {
  const messages = await getContactMessages();
  return <MessagesInbox messages={messages} />;
}
