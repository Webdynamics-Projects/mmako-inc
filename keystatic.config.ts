import { config, collection, fields } from "@keystatic/core";

/**
 * Editing model for the Insights section.
 *
 * Entries are written as `.mdx` files into `content/insights/`, which is the
 * same folder and the same frontmatter the site already reads — Keystatic is
 * an editor over the existing content, not a second source of truth. Publishing
 * is therefore a commit, and a commit to `main` is a deploy.
 */

/* Local mode writes straight to the working copy, which is what we want when
   running the site locally. Deployed, the editor commits to GitHub on the
   author's behalf, so the client never touches a repository directly.

   The GitHub mode is chosen by whether its credentials are present, rather
   than by NODE_ENV. Selecting it on NODE_ENV alone fails the production build
   outright when the credentials are missing, which would take the whole site
   down over an editor that is not set up yet. This way a deploy always
   succeeds; until the three variables are configured, /keystatic is the only
   thing that does not work. DEPLOYMENT.md section 8 covers creating them. */
const hasGitHubApp = Boolean(
  process.env.KEYSTATIC_GITHUB_CLIENT_ID &&
    process.env.KEYSTATIC_GITHUB_CLIENT_SECRET &&
    process.env.KEYSTATIC_SECRET,
);

const storage = hasGitHubApp
  ? ({
      kind: "github",
      repo: { owner: "Webdynamics-Projects", name: "mmako-inc" },
    } as const)
  : ({ kind: "local" } as const);

export default config({
  storage,
  ui: {
    brand: { name: "Mmako Inc." },
    navigation: { Content: ["insights"] },
  },
  collections: {
    insights: collection({
      label: "Insights",
      path: "content/insights/*",
      slugField: "title",
      /* Writes the body as the file's Markdown, below the frontmatter, rather
         than as a quoted field inside it. */
      format: { contentField: "content" },
      entryLayout: "content",
      columns: ["title", "date"],
      schema: {
        title: fields.slug({
          name: {
            label: "Title",
            description: "Shown as the article heading and on the listing.",
            validation: { isRequired: true },
          },
          slug: {
            label: "URL",
            description:
              "The address of the article. Changing it after publishing breaks any existing link to the piece.",
          },
        }),
        date: fields.date({
          label: "Date",
          description: "Articles are listed newest first.",
          defaultValue: { kind: "today" },
          validation: { isRequired: true },
        }),
        category: fields.text({
          label: "Category",
          description:
            "The small gold label on the listing card, e.g. Commercial Contracts. Reuse an existing one where it fits.",
          validation: { isRequired: true },
        }),
        excerpt: fields.text({
          label: "Excerpt",
          description:
            "One or two sentences. Shown beneath the title on the listing, and used as the description in search results and link previews.",
          multiline: true,
          validation: { isRequired: true, length: { min: 40, max: 300 } },
        }),
        readTime: fields.text({
          label: "Reading time",
          description:
            "Optional. Left empty, it is worked out from the length of the article.",
        }),
        draft: fields.checkbox({
          label: "Draft",
          description:
            "While ticked, the article is saved but stays off the website.",
          defaultValue: false,
        }),
        content: fields.mdx({
          label: "Article",
          options: {
            image: {
              directory: "public/images/insights",
              publicPath: "/images/insights/",
            },
          },
        }),
      },
    }),
  },
});
