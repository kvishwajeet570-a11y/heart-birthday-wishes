const { chromium } = require("playwright");
const path = require("path");

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });

  page.on("pageerror", error => console.log("PAGE ERROR:", error.message));
  page.on("console", msg => {
    if (msg.type() === "error") console.log("CONSOLE ERROR:", msg.text());
  });

  await page.goto("file://" + path.resolve("index.html").replace(/\\/g, "/"));
  await page.waitForTimeout(3000);

  console.log("TITLE:", await page.title());
  console.log("START BUTTON:", await page.locator("#startBtn").count());
  console.log("MUSIC ELEMENT:", await page.locator("#music").count());
  console.log("SLIDESHOW READY");

  await browser.close();
})();
