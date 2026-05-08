import { Resend } from "resend";
import { prisma } from "@/lib/prisma";
import { dataResponse, errorResponse, requireAdmin, validationErrorResponse } from "@/lib/api";
import { contactSchema } from "@/lib/validations";

export async function GET() {
  try {
    const session = await requireAdmin();
    if (!session) return errorResponse("Unauthorized", 401);
    const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } });
    return dataResponse(messages);
  } catch {
    return errorResponse("Unable to fetch messages");
  }
}

export async function POST(request: Request) {
  try {
    const parsed = contactSchema.safeParse(await request.json());
    if (!parsed.success) return validationErrorResponse(parsed.error);

    const message = await prisma.contactMessage.create({ data: parsed.data });
    const settings = await prisma.siteSettings.upsert({
      where: { id: "singleton" },
      update: {},
      create: { id: "singleton" }
    });

    if (process.env.RESEND_API_KEY?.startsWith("re_")) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: "Portfolio <onboarding@resend.dev>",
        to: settings.email,
        subject: `Portfolio contact: ${parsed.data.subject}`,
        reply_to: parsed.data.email,
        text: `${parsed.data.name} <${parsed.data.email}> wrote:\n\n${parsed.data.message}`
      });
    }

    return dataResponse(message, 201);
  } catch {
    return errorResponse("Unable to send message");
  }
}
