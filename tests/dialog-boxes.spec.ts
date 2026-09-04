import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('.title')).toHaveText('Welcome to Petclinic')
  await page.getByText('Pet Types').click()
  await expect(page.getByRole('heading')).toHaveText('Pet Types')
})

test('Add and delete pet type', async ({ page }) => {
  const newPetType = 'pig'
  await page.getByRole('button', { name: 'Edit' }).isVisible()
  await page.getByRole('button', { name: 'Add' }).click()
  await expect(page.getByRole('heading').nth(1)).toHaveText('New Pet Type')
  await expect(page.locator('label', { hasText: 'Name' })).toBeVisible()
  await expect(page.locator('#name')).toBeVisible()
  await page.locator('#name').fill(newPetType)
  await page.getByRole('button', { name: 'Save' }).click()
  await page.waitForResponse('https://petclinic-api.bondaracademy.com/petclinic/api/pettypes')
  await expect(page.getByRole('textbox').last()).toHaveValue(newPetType)

  // Click on Ok on web browser delete dialog box
  page.on('dialog', dialog => {
    expect(dialog.message()).toEqual('Delete the pet type?')
    dialog.accept()
  })
  await page.getByRole('button', { name: 'Delete' }).last().click()

  await expect(page.getByRole('textbox').last()).not.toHaveValue(newPetType)
});