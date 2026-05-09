import { ImageResponse } from "next/og";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title") ?? "Portfolio";
  const subtitle = searchParams.get("subtitle") ?? "Computer Engineer";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "#0f0f0f",
          color: "#e8e8e8",
          padding: "72px",
          fontFamily: "Inter"
        }}
      >
        <div style={{ color: "#818cf8", fontSize: 28, marginBottom: 24 }}>{subtitle}</div>
        <div style={{ fontSize: 72, fontWeight: 700, lineHeight: 1.05 }}>{title}</div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
