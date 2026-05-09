import { Resend } from "resend";
import { dataResponse, errorResponse, requireAdmin, validationErrorResponse } from "@/lib/api";
import { contactSchema } from "@/lib/validations";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await requireAdmin();
  if (!session) return errorResponse("Unauthorized", 401);

  try {
    const messages = await prisma.message.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return dataResponse(messages);
  } catch (error) {
    console.error(error);
    return errorResponse("Unable to fetch messages");
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = contactSchema.safeParse(body);

    if (!validated.success) {
      return validationErrorResponse(validated.error);
    }

    const message = await prisma.message.create({
      data: validated.data
    });

    // Send email notification — non-blocking; message is already saved
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
        to: process.env.ADMIN_EMAIL || "admin@example.com",
        subject: `New Contact Message: ${validated.data.subject}`,
        html: `
          <h2>New Message from ${validated.data.name}</h2>
          <p><strong>Email:</strong> ${validated.data.email}</p>
          <p><strong>Subject:</strong> ${validated.data.subject}</p>
          <p><strong>Message:</strong></p>
          <p>${validated.data.message}</p>
        `
      });
    } catch (emailError) {
      console.error("Failed to send email notification:", emailError);
    }

    return dataResponse(message, 201);
  } catch (error) {
    console.error(error);
    console.error("Failed to save contact message:", error);
    return errorResponse("Unable to send message", 500);
  }
}
