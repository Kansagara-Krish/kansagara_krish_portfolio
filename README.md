# My Portfolio

A production-grade personal portfolio built with Next.js 14, TypeScript, Tailwind CSS, Prisma, PostgreSQL, NextAuth v5, Framer Motion, Tiptap, Resend, and Uploadthing.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env` from `.env.example` and fill in `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD`.

3. Push the schema and seed demo data:

```bash
npm run db:push
npm run db:seed
```

4. Start development:

```bash
npm run dev
```

The public site runs at `http://localhost:3000`. The admin panel runs at `http://localhost:3000/admin` and redirects unauthenticated visitors to `/admin/login`.

## Notes

- Contact messages are always stored in PostgreSQL. Emails are sent when `RESEND_API_KEY` is configured.
- Uploadthing image uploads require `UPLOADTHING_SECRET` and `UPLOADTHING_APP_ID`.
- Resume downloads are tracked through `PATCH /api/settings`.
