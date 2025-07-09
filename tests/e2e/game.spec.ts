import { test, expect } from '@playwright/test';

const defaultRows = 5;
const defaultColors = 6;
const defaultFields = 4;

test.beforeEach(async ({ page }) => {
  // Configure localStorage to have the default settings provided
  await page.addInitScript(() => {
    window.localStorage.clear();
    window.localStorage.setItem(
      'settings',
      JSON.stringify({
        roundsCount: defaultRows,
        fields: defaultFields,
        allowColorDuplicate: false,
        colors: ['red', 'blue', 'green', 'yellow', 'purple', 'orange'],
        soundEnabled: false,
      })
    );
  });
});

test('should be able to play a round of Mastermind', async ({ page }) => {
  await test.step('Open the game', async () => {
    await page.goto('/');
  });

  await test.step('Wait until board game is loaded', async () => {
    await page.waitForSelector('[data-element-id="solution"]');
  });

  await test.step('Verify the first results are not set yet', async () => {
    for (let i = 0; i < 4; i++) {
      // Verify the color picker is visible
      const colorPicker = page
        .locator(`[data-element-id="round-0"]`)
        .locator(`[data-element-id="result-${i}"]`);
      await expect(colorPicker).toBeVisible();
      const colorPickerAttribute = await colorPicker.getAttribute('data-result');
      expect(colorPickerAttribute).toBe('unset');
    }
  });

  await test.step('Drag and drop colors to the fields', async () => {
    for (let i = 0; i < 4; i++) {
      const colorPicker = page.locator(`[id="color-picker-${i}"]`);
      const targetField = page.locator(`[id="field-${i}"]`);

      await expect(colorPicker).toBeVisible();
      await expect(targetField).toBeVisible();

      // Pause before each drag operation
      await page.pause();

      await expect
        .poll(
          async () => {
            await page.waitForTimeout(100);
            console.log('Dragging color to target field...');
            await colorPicker.dragTo(targetField);

            const attribute = await targetField.getAttribute('data-color');
            return attribute !== null && attribute !== undefined;
          },
          {
            message: 'Expect a color has been set via drag and drop',
            timeout: 5000,
            intervals: [100, 200, 500],
          }
        )
        .toBeTruthy();
    }
  });

  await test.step('Click the check button', async () => {
    const checkButton = page.locator('[data-element-id="check-button"]');
    await expect(checkButton).toBeVisible();
    await checkButton.click();
  });

  await test.step('Verify the results were set', async () => {
    for (let i = 0; i < 4; i++) {
      // Verify the color picker is visible
      const colorPicker = page
        .locator(`[data-element-id="round-0"]`)
        .locator(`[data-element-id="result-${i}"]`);
      await expect(colorPicker).toBeVisible();
      const colorPickerAttribute = await colorPicker.getAttribute('data-result');
      expect(colorPickerAttribute).not.toBe('unset');
    }
  });
});

test('should load the default settings', async ({ page }) => {
  await test.step('Open the game', async () => {
    await page.goto('/');
  });

  await test.step('Wait until board game is loaded', async () => {
    await page.waitForSelector('[data-element-id="solution"]');
  });

  await test.step(`Verify that exactly ${defaultRows} rows are shown`, async () => {
    for (let i = 0; i < defaultRows; i++) {
      // Verify rows are visible
      await expect(page.locator(`[data-element-id="round-${i}"]`)).toBeVisible();
    }
    await expect(page.locator(`[data-element-id="round-${defaultRows}"]`)).not.toBeVisible();
  });

  await test.step(`Verify that exactly ${defaultFields} field per row are shown`, async () => {
    for (let i = 0; i < defaultFields; i++) {
      // Verify rows are visible
      await expect(page.locator(`[data-element-id="field-${i}"]`)).toBeVisible();
    }
    await expect(page.locator(`[data-element-id="field-${defaultFields}"]`)).not.toBeVisible();
  });

  await test.step(`Verify that exactly ${defaultColors} colors are shown and no duplicates`, async () => {
    const foundColors = [];
    for (let i = 0; i < defaultColors; i++) {
      // Verify rows are visible
      const color = page.locator(`[data-element-id="color-picker-${i}"]`);
      await expect(color).toBeVisible();
      // get attribute value for data-color-picker and save it to a list
      foundColors.push(await color.getAttribute('data-color-picker'));
    }
    await expect(
      page.locator(`[data-element-id="color-picker-${defaultColors}"]`)
    ).not.toBeVisible();
    // foundColors should not have any duplicates
    const uniqueColors = new Set(foundColors);
    expect(uniqueColors.size).toBe(foundColors.length);
  });

  await test.step('Drag and drop colors to the fields', async () => {
    for (let i = 0; i < 4; i++) {
      const colorPicker = page.locator(`[id="color-picker-${i}"]`);
      const targetField = page.locator(`[id="field-${i}"]`);

      // Pause before each drag operation
      await page.pause();

      // Perform drag and drop
      await expect(colorPicker).toBeVisible();
      await colorPicker.dragTo(targetField);

      await expect(targetField).toBeVisible();
    }
    for (let i = 0; i < 4; i++) {
      const targetField = page.locator(`[id="field-${i}"]`);
      await expect(targetField).toHaveAttribute('data-color', /.+/);
    }
  });

  await test.step('Click the check button', async () => {
    const checkButton = page.locator('[data-element-id="check-button"]');
    await expect(checkButton).toBeVisible();
    await checkButton.click();
  });

  await test.step('Verify the results were set', async () => {
    for (let i = 0; i < 4; i++) {
      // Verify the color picker is visible
      const colorPicker = page
        .locator(`[data-element-id="round-0"]`)
        .locator(`[data-element-id="result-${i}"]`);
      await expect(colorPicker).toBeVisible();
      const colorPickerAttribute = await colorPicker.getAttribute('data-result');
      expect(colorPickerAttribute).not.toBe('unset');
    }
  });
});

test('verify config dialog', async ({ page }) => {
  await test.step('Open the game', async () => {
    await page.goto('/');
  });

  await test.step('Wait until board game is loaded', async () => {
    await page.waitForSelector('[data-element-id="options.dialog"]');
  });

  await test.step('Open the config dialog', async () => {
    const button = page.locator('[data-element-id="options.dialog"]');
    await expect(button).toBeVisible();
    await button.click();
  });

  await test.step('Verify the dialog settings', async () => {
    await expect(page.locator('[data-element-id="cfg.rounds"]')).toHaveValue(String(defaultRows));
    await expect(page.locator('[data-element-id="cfg.fields"]')).toHaveValue(String(defaultFields));
    await expect(page.locator('[data-element-id="cfg.colorCount"]')).toHaveValue(
      String(defaultColors)
    );
    await expect(page.locator('[data-element-id="cfg.allowColorDuplicates"]')).not.toBeChecked();
  });

  await test.step('Change the settings to not allowed settings and validate', async () => {
    const confirmButton = page.locator('[data-element-id="overlay.confirm"]');

    await test.step('Validate rounds settings', async () => {
      const invalidRounds = [-1, 0, 3, 4, 31, 32];
      for (const value of invalidRounds) {
        await page.locator('[data-element-id="cfg.rounds"]').fill(String(value));
        await expect(confirmButton).toBeDisabled();
      }
      const validRounds = [5, 6, 29, 30];
      for (const value of validRounds) {
        await page.locator('[data-element-id="cfg.rounds"]').fill(String(value));
        await expect(confirmButton).toBeEnabled();
      }
    });

    await test.step('Validate fields settings', async () => {
      const invalidFields = [-1, 0, 2, 6, 7];
      for (const value of invalidFields) {
        await page.locator('[data-element-id="cfg.fields"]').fill(String(value));
        await expect(confirmButton).toBeDisabled();
      }
      const validFields = [3, 4, 5];
      for (const value of validFields) {
        await page.locator('[data-element-id="cfg.fields"]').fill(String(value));
        await expect(confirmButton).toBeEnabled();
      }
    });

    await test.step('Validate switch allowDuplicates', async () => {
      await page.locator('[data-element-id="cfg.allowColorDuplicates"]').check();
      await expect(confirmButton).toBeEnabled();
    });

    await test.step('Validate colors should be two more than fields count', async () => {
      // still 5 fields, so 7 or colors should be allowed
      await page.locator('[data-element-id="cfg.colorCount"]').fill('9');
      await expect(confirmButton).toBeDisabled();
      await page.locator('[data-element-id="cfg.colorCount"]').fill('8');
      await expect(confirmButton).toBeEnabled();
      await page.locator('[data-element-id="cfg.colorCount"]').fill('7');
      await expect(confirmButton).toBeEnabled();
      // six colors not allowed
      await page.locator('[data-element-id="cfg.colorCount"]').fill('6');
      await expect(confirmButton).toBeDisabled();
      // but when changing to 4 fields it should be allowed with 6 colors
      await page.locator('[data-element-id="cfg.fields"]').fill('4');
      await expect(confirmButton).toBeEnabled();
      // 5 colors should not be allowed
      await page.locator('[data-element-id="cfg.colorCount"]').fill('5');
      await expect(confirmButton).toBeDisabled();
      // but when changing to 3 fields it should be allowed with 5 colors
      await page.locator('[data-element-id="cfg.fields"]').fill('3');
      await expect(confirmButton).toBeEnabled();
    });

    await test.step('After closing the dialog, the new config should be visible and game started', async () => {
      await confirmButton.click();

      await test.step(`Verify that exactly 30 rows are shown`, async () => {
        for (let i = 0; i < 30; i++) {
          await expect(page.locator(`[data-element-id="round-${i}"]`)).toBeVisible();
        }
      });

      await test.step(`Verify that exactly 3 field per row are shown`, async () => {
        for (let i = 0; i < 3; i++) {
          await expect(page.locator(`[data-element-id="field-${i}"]`)).toBeVisible();
        }
      });

      await test.step(`Verify that exactly 5 colors are shown`, async () => {
        for (let i = 0; i < 5; i++) {
          await expect(page.locator(`[data-element-id="color-picker-${i}"]`)).toBeVisible();
        }
      });

      await test.step(`Verify that new game started`, async () => {
        // new color should be visible in first row
        for (let i = 0; i < 3; i++) {
          const locator = page
            .locator(`[data-element-id="round-0"]`)
            .locator(`[data-element-id="field-${i}"]`);
          await expect(locator).toBeVisible();
          await expect(locator).not.toHaveAttribute('data-color');
        }

        for (let i = 0; i < 3; i++) {
          // Verify no results filled yet
          const colorPicker = page
            .locator(`[data-element-id="round-0"]`)
            .locator(`[data-element-id="result-${i}"]`);
          await expect(colorPicker).toBeVisible();
          const colorPickerAttribute = await colorPicker.getAttribute('data-result');
          expect(colorPickerAttribute).toBe('unset');
        }
      });
    });
  });
});
