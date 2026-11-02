const { chromium } = require("playwright");
const path = require("path");

(async () => {
  const browser = await chromium.launch({
    headless: true,
    args: ["--autoplay-policy=no-user-gesture-required"]
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    recordVideo: {
      dir: path.resolve("build/video"),
      size: { width: 1280, height: 720 }
    }
  });

  const page = await context.newPage();

  page.on("pageerror", e => console.log("PAGE ERROR:", e.message));

  await page.goto("file://" + path.resolve("index.html").replace(/\\/g, "/"));
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all([...document.images].map(img =>
      img.decode().catch(() => {})
    ));
    const panel = document.getElementById("recordPanel");
    if (panel) panel.style.display = "none";
  });

  await page.waitForTimeout(1000);
  await page.locator("#startBtn").click();

  console.log("Recording started. Slideshow duration: 65 seconds.");
  await page.waitForTimeout(68000);

  const video = page.video();
  await context.close();
  const videoPath = await video.path();

  await browser.close();
  console.log("RAW VIDEO:", videoPath);
})();
