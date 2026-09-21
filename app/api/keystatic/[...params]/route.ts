import { makeRouteHandler } from "@keystatic/next/route-handler";
import config from "@/keystatic.config";

/* Serves the editor's reads and writes, and handles the GitHub sign-in
   exchange when the editor is running against the repository. */
export const { POST, GET } = makeRouteHandler({ config });
