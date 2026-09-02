import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('.title')).toHaveText('Welcome to Petclinic')
  await page.getByText('Veterinarians').click()
  await page.locator('a', { hasText: 'All' }).click()
  await expect(page.locator('h2')).toHaveText('Veterinarians')
})

test('Validate selected specialities', async ({ page }) => {

  const veternaryToSelect = page.getByRole('row').filter({ hasText: 'Helen Leary' })
  await veternaryToSelect.getByRole('button', { name: 'Edit Vet' }).click()
  await page.waitForResponse('**/vets/**')

  const selectedSpecialties = page.locator('.selected-specialties')
  await expect(selectedSpecialties).toHaveText('radiology')

  await selectedSpecialties.click()
  const specialityCheckboxes = page.locator('.dropdown-content div')
  const radiologyCheckbox = specialityCheckboxes.locator('#radiology')
  const surgeryCheckbox = specialityCheckboxes.locator('#surgery')
  const dentistryCheckbox = specialityCheckboxes.locator('#dentistry')

  await expect(radiologyCheckbox).toBeChecked()
  await expect(surgeryCheckbox).not.toBeChecked()
  await expect(dentistryCheckbox).not.toBeChecked()

  await radiologyCheckbox.uncheck()
  await surgeryCheckbox.check()
  await selectedSpecialties.click()
  await expect(selectedSpecialties).toHaveText('surgery')

  await selectedSpecialties.click()
  await dentistryCheckbox.check()
  await selectedSpecialties.click()

  await expect(selectedSpecialties).toHaveText('surgery, dentistry')
})

test('Select all specialities', async ({ page }) => {

  const veternaryToSelect = page.getByRole('row').filter({ hasText: 'Rafael Ortega' })
  await veternaryToSelect.getByRole('button', { name: 'Edit Vet' }).click()
  await page.waitForResponse('**/vets/**')

  const selectedSpecialties = page.locator('.selected-specialties')
  await expect(selectedSpecialties).toHaveText('surgery')

  await selectedSpecialties.click()
  const specialityCheckboxes = page.locator('.dropdown-content div')
  const radiologyCheckbox = specialityCheckboxes.locator('#radiology')
  const surgeryCheckbox = specialityCheckboxes.locator('#surgery')
  const dentistryCheckbox = specialityCheckboxes.locator('#dentistry')

  await radiologyCheckbox.check()
  await dentistryCheckbox.check()

  await expect(radiologyCheckbox).toBeChecked()
  await expect(surgeryCheckbox).toBeChecked()
  await expect(dentistryCheckbox).toBeChecked()

  await selectedSpecialties.click()
  await expect(selectedSpecialties).toHaveText('surgery, radiology, dentistry')
})

test('Unselect all specialities', async ({ page }) => {

  const veternaryToSelect = page.getByRole('row').filter({ hasText: 'Linda Douglas' })
  await veternaryToSelect.getByRole('button', { name: 'Edit Vet' }).click()
  await page.waitForResponse('**/vets/**')

  const selectedSpecialties = page.locator('.selected-specialties')
  await expect(selectedSpecialties).toHaveText('dentistry, surgery')

  await selectedSpecialties.click()
  const specialityCheckboxes = page.locator('.dropdown-content div')
  const radiologyCheckbox = specialityCheckboxes.locator('#radiology')
  const surgeryCheckbox = specialityCheckboxes.locator('#surgery')
  const dentistryCheckbox = specialityCheckboxes.locator('#dentistry')

  await radiologyCheckbox.uncheck()
  await surgeryCheckbox.uncheck()
  await dentistryCheckbox.uncheck()

  await expect(radiologyCheckbox).not.toBeChecked()
  await expect(surgeryCheckbox).not.toBeChecked()
  await expect(dentistryCheckbox).not.toBeChecked()

  await expect(selectedSpecialties).toBeEmpty()
})


