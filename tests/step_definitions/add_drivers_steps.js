const { Given, When, Then } = require('@cucumber/cucumber');
const puppeteer = require('puppeteer');
const { expect } = require('chai');

let browser, page;

Given('I am on the admin login page', async () => {
  browser = await puppeteer.launch({ headless: true });
  page = await browser.newPage();
  await page.goto('http://localhost:3000/admin/login'); // Update with your actual local URL
});

When('I log in with the password {string}', async (password) => {
  await page.type('input[name="password"]', password);
  await page.click('button[type="submit"]');
  await page.waitForNavigation();
});

When(
  'I add a driver named {string} with age range {string} and skill level {string}',
  async (name, ageRange, skillLevel) => {
    await page.goto('http://localhost:3000/admin/addDriver'); // Adjust URL if needed
    await page.type('input[name="name"]', name);
    await page.select('select[name="ageRange"]', ageRange);
    await page.select('select[name="skillLevel"]', skillLevel);
    await page.click('button[type="submit"]');
    await page.waitForNavigation();
  }
);

Then('the spectator page should display the drivers sorted by their total scores', async () => {
  await page.goto('http://localhost:3000'); // Spectator page URL
  const driverNames = await page.$$eval('table tr td:first-child', (elements) =>
    elements.map((el) => el.textContent.trim())
  );

  const expectedDrivers = ['Driver1', 'Driver2', 'Driver3', 'Driver4'];
  expect(driverNames).to.have.members(expectedDrivers);

  await browser.close();
});