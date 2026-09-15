/**
 * Chromium-backed renderer shared by every generator in the kit.
 *
 * Playwright is an optional tool used only to BUILD the kit. Every generated
 * asset is committed, so nobody needs this installed to use the kit.
 */
import { chromium } from "playwright";

const CHROMIUM_PATH = process.env.CHROMIUM_PATH;

let browser;
export async function getBrowser() {
  if (!browser) {
    browser = await chromium.launch(
      CHROMIUM_PATH ? { executablePath: CHROMIUM_PATH } : {},
    );
  }
  return browser;
}

export async function closeBrowser() {
  if (browser) {
    await browser.close();
    browser = undefined;
  }
}

const FONT_LINK = `
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300..700&family=Inter:wght@200..700&display=swap" rel="stylesheet">
`;

function wrap(body, css = "") {
  return `<!doctype html><html><head><meta charset="utf-8">${FONT_LINK}
<style>*{box-sizing:border-box}html,body{margin:0;padding:0}${css}</style>
</head><body>${body}</body></html>`;
}

/** Screenshots an element (or the page) to PNG. */
export async function renderPng(
  { body, css = "", selector = null, width = 1200, height = 1200, transparent = true, scale = 2 },
) {
  const page = await (await getBrowser()).newPage({
    viewport: { width, height },
    deviceScaleFactor: scale,
  });
  await page.setContent(wrap(body, css), { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(350);
  const target = selector ? page.locator(selector) : page;
  const buffer = await target.screenshot({ omitBackground: transparent });
  await page.close();
  return buffer;
}

/** Renders to a print-ready PDF at an exact physical page size. */
export async function renderPdf({ body, css = "", widthMm, heightMm }) {
  const page = await (await getBrowser()).newPage();
  await page.setContent(wrap(body, css), { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(350);
  const buffer = await page.pdf({
    width: `${widthMm}mm`,
    height: `${heightMm}mm`,
    printBackground: true,
    margin: { top: "0mm", right: "0mm", bottom: "0mm", left: "0mm" },
  });
  await page.close();
  return buffer;
}
