import { test, expect } from '@playwright/test'
import ownerspage from '../test-data/owners-page.json'
import ownersinfo from '../test-data/owners-info.json'

test.beforeEach(async ({ page }) => {
    await page.route('**/owners', async route => {
        await route.fulfill({
            body: JSON.stringify(ownerspage)
        })
    })
    await page.route('**/owners/2000', async route => {
        await route.fulfill({
            body: JSON.stringify(ownersinfo)
        })
    })
    await page.goto('/')
    await page.getByText('Owners').click()
    await page.getByRole('link', { name: 'Search' }).click()
})

test('mocking API request', async ({ page }) => {
    await expect(page.locator('tbody a')).toHaveCount(2)
    const firstOwnerRow = page.locator('tbody tr').first()
    const ownerName = await firstOwnerRow.locator('a').textContent()
    const ownerAddress = await firstOwnerRow.locator('td').nth(1).textContent()
    const ownerCity = await firstOwnerRow.locator('td').nth(2).textContent()
    const ownerTelephone = await firstOwnerRow.locator('td').nth(3).textContent()
    const ownerPets = await firstOwnerRow.locator('td').nth(4).locator('tr').allTextContents()
    expect(ownerPets).toHaveLength(2)
    await firstOwnerRow.locator('a').click()
    const ownerInformation = page.locator('table').first()
    await expect(ownerInformation.locator('tr').first().locator('td')).toHaveText(ownerName!)
    await expect(ownerInformation.locator('tr').nth(1).locator('td')).toHaveText(ownerAddress!)
    await expect(ownerInformation.locator('tr').nth(2).locator('td')).toHaveText(ownerCity!)
    await expect(ownerInformation.locator('tr').nth(3).locator('td')).toHaveText(ownerTelephone!)
    await expect(page.locator('app-pet-list').locator('//dd[1]')).toHaveText(ownerPets)
    const firstPetVisitList = page.locator('app-visit-list').first()
    await expect(firstPetVisitList.getByRole('button', { name: 'Edit Visit' })).toHaveCount(10)
})