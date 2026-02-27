const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true }); // true for GitHub Actions
  const page = await browser.newPage();

  // List of all URLs
  const urls = [
    "https://sanand0.github.io/tdsdata/js_table/?seed=13",
    "https://sanand0.github.io/tdsdata/js_table/?seed=14",
    "https://sanand0.github.io/tdsdata/js_table/?seed=15",
    "https://sanand0.github.io/tdsdata/js_table/?seed=16",
    "https://sanand0.github.io/tdsdata/js_table/?seed=17",
    "https://sanand0.github.io/tdsdata/js_table/?seed=18",
    "https://sanand0.github.io/tdsdata/js_table/?seed=19",
    "https://sanand0.github.io/tdsdata/js_table/?seed=20",
    "https://sanand0.github.io/tdsdata/js_table/?seed=21",
    "https://sanand0.github.io/tdsdata/js_table/?seed=22"
  ];

  let totalSum = 0;

  for (const url of urls) {
    console.log(`Loading ${url}`);
    await page.goto(url);

    // Wait for tables to load (simple but safe)
    await page.waitForSelector('table');

    // Run JS inside the browser to get all numbers from all tables
    const numbers = await page.evaluate(() => {
      const allNumbers = [];

      // Get all <table> elements
      const tables = document.querySelectorAll('table');

      for (const table of tables) {
        const cells = table.querySelectorAll('td, th');
        for (const cell of cells) {
          const text = cell.textContent.trim();
          const num = parseFloat(text);
          if (!isNaN(num)) {
            allNumbers.push(num);
          }
        }
      }

      return allNumbers;
    });

    // Add these numbers to the total
    const sum = numbers.reduce((sum, num) => sum + num, 0);
    totalSum += sum;

    console.log(`Sum from ${url}: ${sum}`);
  }

  console.log(`FINAL TOTAL SUM: ${totalSum}`);
  await browser.close();
})();