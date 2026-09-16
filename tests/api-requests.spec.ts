import { test, expect, request } from '@playwright/test'
import specialtiestoadd from '../test-data/specialties-to-add.json'
import vettoadd from '../test-data/vet-to-add.json'

test.beforeEach(async ({ page }) => {
    await page.goto('/')
})

test('Validation of delete speciality', async ({ request, page }) => {

    const addSpecialtyResponse = await request.post('https://petclinic-api.bondaracademy.com/petclinic/api/specialties', {
        data: specialtiestoadd
    })
    expect(addSpecialtyResponse.status()).toEqual(201)
    await page.getByText('Specialties').click()
    await expect(page.getByRole('textbox').last()).toHaveValue(specialtiestoadd.name)
    await page.getByRole('row', { name: specialtiestoadd.name }).getByRole('button', { name: 'Delete' }).click()
    await expect(page.getByRole('row', { name: specialtiestoadd.name })).toHaveCount(0)
})

test('Add and delete veterinarian', async ({ request, page }) => {
    const vetCreatedResponse = await request.post('https://petclinic-api.bondaracademy.com/petclinic/api/vets', {
        data: vettoadd
    })
    expect(vetCreatedResponse.status()).toEqual(201)
    const vetCreatedResponseBody = await vetCreatedResponse.json()
    const vetId = vetCreatedResponseBody.id
    const vetFullName = `${vetCreatedResponseBody.firstName} ${vetCreatedResponseBody.lastName}`
    expect(vetFullName).toEqual(`${vettoadd.firstName} ${vettoadd.lastName}`)
    await page.getByText('Veterinarians').click()
    await page.getByRole('link', { name: 'All' }).click()
    await expect(page.getByRole('row', { name: vetFullName }).locator('td').nth(1)).toBeEmpty()
    await page.getByRole('row', { name: vetFullName }).getByRole('button', { name: 'Edit Vet' }).click()
    await page.locator('.dropdown-display').click()
    await page.getByRole('checkbox', { name: 'dentistry' }).check()
    await page.locator('.dropdown-display').click()
    await page.getByRole('button', { name: 'Save Vet' }).click()
    const deleteVetResponse = await request.delete(`https://petclinic-api.bondaracademy.com/petclinic/api/vets/${vetId}`)
    expect(deleteVetResponse.status()).toEqual(204)
    const listOfVetsResponse = await request.get('https://petclinic-api.bondaracademy.com/petclinic/api/vets')
    expect(await listOfVetsResponse.json()).not.toContainEqual(
        expect.objectContaining({ "lastName": "ViaAPI" })
    )
})

test('New speciality is displayed', async ({ request, page }) => {
    const addSpecialtyResponse = await request.post('https://petclinic-api.bondaracademy.com/petclinic/api/specialties', {
        data: { "name": "api testing ninja" }
    })
    expect(addSpecialtyResponse.status()).toEqual(201)
    const addSpecialtyResponseBody = await addSpecialtyResponse.json()
    const specialityId = addSpecialtyResponseBody.id

    const addVetResponse = await request.post('https://petclinic-api.bondaracademy.com/petclinic/api/vets', {
        data: { "firstName": "Vet", "lastName": "ViaAPITwo", "id": null, "specialties": [{ "id": 5920, "name": "surgery" }] }
    })
    expect(addVetResponse.status()).toEqual(201)
    const addVetResponseBody = await addVetResponse.json()
    const vetId = addVetResponseBody.id

    await page.getByText('Veterinarians').click()
    await page.getByRole('link', { name: 'All' }).click()
    await expect(page.getByRole('row', { name: 'Vet ViaAPITwo' }).locator('td').nth(1)).toHaveText('surgery')
    await page.getByRole('row', { name: 'Vet ViaAPITwo' }).getByRole('button', { name: 'Edit Vet' }).click()
    await page.locator('.dropdown-display').click()
    await page.getByRole('checkbox', { name: 'Surgery' }).uncheck()
    await page.getByRole('checkbox', { name: 'api testing ninja' }).check()
    await page.locator('.dropdown-display').click()
    await page.getByRole('button', { name: 'Save Vet' }).click()
    await expect(page.getByRole('row', { name: 'Vet ViaAPITwo' }).locator('td').nth(1)).toHaveText('api testing ninja')

    const deleteVetResponse = await request.delete(`https://petclinic-api.bondaracademy.com/petclinic/api/vets/${vetId}`)
    expect(deleteVetResponse.status()).toEqual(204)

    const deleteSpecialityResponse = await request.delete(`https://petclinic-api.bondaracademy.com/petclinic/api/specialties/${specialityId}`)
    expect(deleteSpecialityResponse.status()).toEqual(204)

    await page.getByRole('link', { name: 'Specialties' }).click()
    await expect(page.getByRole('textbox').last()).not.toHaveValue('api testing ninja')
})
