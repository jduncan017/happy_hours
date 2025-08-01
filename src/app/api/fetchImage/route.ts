import { NextResponse } from "next/server";

// api/fetchImage.js
export async function GET(req: Request) {
  const url = req.headers.get("xurl");
  function getBaseUrl(url: string): string {
    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname;
    const protocol = parsedUrl.protocol;

    // Combine protocol and hostname to form the base URL
    return `${protocol}//${hostname}`;
  }

  if (!url) {
    return NextResponse.json({ error: "no url provided" }, { status: 400 });
  }

  try {
    const baseUrl = getBaseUrl(url);
    const response = await fetch(baseUrl);
    const html = await response.text();
    const metaTags = html.match(/<meta[^>]+>/g);

    if (!metaTags) {
      return NextResponse.json(
        { error: "metaTags not found" },
        { status: 400 }
      );
    }

    const ogImageTag = metaTags.find(
      (tag) =>
        tag.includes('property="og:image"') || tag.includes('name="og:image"')
    );

    if (!ogImageTag) {
      return NextResponse.json(
        { error: "ogImageTag not found" },
        { status: 400 }
      );
    }

    const ogImageUrlMatch = ogImageTag.match(/content="([^"]+)"/);
    if (!ogImageUrlMatch) {
      return NextResponse.json(
        { error: "ogImageUrl not found" },
        { status: 400 }
      );
    }

    const ogImageUrl = ogImageUrlMatch[1];

    return NextResponse.json({ ogImageUrl }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch or process the image URL" },
      { status: 500 }
    );
  }
}
