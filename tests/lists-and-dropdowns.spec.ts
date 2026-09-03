import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('.title')).toHaveText('Welcome to Petclinic')
  await page.getByText('Owners').click()
  await page.getByRole('link', { name: 'Search' }).click()
  await expect(page.getByRole('heading')).toHaveText('Owners')
})

test('Validate selected pet types from the list', async ({ page }) => {

  const ownerName = 'George Franklin'
  await page.getByRole('link', { name: ownerName }).click()
  await expect(page.locator('.ownerFullName')).toHaveText(ownerName)
  await page.getByRole('button', { name: 'Edit Pet' }).click()
  await expect(page.getByRole('heading')).toHaveText('Pet')
  await expect(page.locator('#owner_name')).toHaveValue(ownerName)
  await expect(page.locator('#type1')).toHaveValue('cat')

  for (const petTypeOption of await page.locator('option').all()) {
    const petType = await petTypeOption.getAttribute('value')
    await page.locator('select').selectOption(petType)
    await page.waitForTimeout(1000)
    await expect(page.locator('#type1')).toHaveValue(petType!)
  }
})

test('Validate the pet type update', async ({ page }) => {

  await page.getByRole('link', { name: 'Eduardo Rodriquez' }).click()
  const petName = 'Rosy'
  await page.locator('td', { hasText: petName }).getByRole('button', { name: 'Edit Pet' }).click()
  await expect(page.locator('#name')).toHaveValue(petName)
  await expect(page.locator('#type1')).toHaveValue('dog')
  await page.locator('select').selectOption('bird')
  await expect(page.locator('#type1')).toHaveValue('bird')
  await page.getByRole('button', { name: 'Update Pet' }).click()
  await expect(page.locator('td', { hasText: petName }).locator('dd').nth(2)).toHaveText('bird')

  //updating it back to its default value
  await page.locator('td', { hasText: petName }).getByRole('button', { name: 'Edit Pet' }).click()
  await expect(page.locator('#type1')).toHaveValue('bird')
  await page.locator('select').selectOption('dog')
  await page.getByRole('button', { name: 'Update Pet' }).click()
  await expect(page.locator('td', { hasText: petName }).locator('dd').nth(2)).toHaveText('dog')
})