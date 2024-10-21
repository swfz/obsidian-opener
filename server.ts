import { log } from "./logger.ts";

function isValidObsidianURL(url: string): boolean {
  try {
    const redirectURL = new URL(url);

    if (
      redirectURL.protocol !== "obsidian:" || redirectURL.hostname !== "open"
    ) {
      return false;
    }

    const fileParam = redirectURL.searchParams.get("file");
    const vaultParam = redirectURL.searchParams.get("vault");

    return fileParam !== null && vaultParam !== null;
  } catch (e) {
    return false;
  }
}

const handleRequest = async (req: Request): Promise<Response> => {
  const url = new URL(req.url);

  await log(req, {});

  const redirectParam = url.searchParams.get("redirect");

  // リダイレクトパラメータが存在し、かつ有効なobsidian URLである場合のみリダイレクト
  if (redirectParam && isValidObsidianURL(redirectParam)) {
    return Response.redirect(redirectParam, 302);
  }

  return new Response(
    "Invalid or missing redirect parameter. Only obsidian://open URLs are allowed.",
    {
      status: 400,
    },
  );
};

Deno.serve({ port: 8002 }, handleRequest);
