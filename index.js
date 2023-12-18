const { existsSync, mkdirSync } = require('node:fs');
const { tmpdir } = require('node:os');
const { join } = require('node:path');
const { chromium } = require('playwright-core');

main();

async function main() {
  const userDataDir = join(tmpdir(), 'playwrightUserDataDir');
  const jsCode = ';Math.random = () => 123;';

  if (!existsSync(userDataDir)) mkdirSync(userDataDir);

  const chromeCtx = await chromium.launchPersistentContext(
    userDataDir,
    {
      headless: false,
      // it doesn't matter which browser we connect, the error is the same
      executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
      args: [
        '--no-first-run',
        '--restore-last-session',
      ],
    }
  );

  chromeCtx.on('page', (page) => {
    page.addInitScript(jsCode);
    page.evaluate(jsCode);
  });

  await chromeCtx.addInitScript(jsCode);
}
