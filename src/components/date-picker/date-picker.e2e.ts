import { newE2EPage } from '@stencil/core/testing';

describe('date-picker', () => {
  it('renders', async () => {
    const page = await newE2EPage();

    await page.setContent('<date-picker></date-picker>');
    const element = await page.find('date-picker');
  });

  it('renders changes to the name data', async () => {
    const page = await newE2EPage();

    await page.setContent('<date-picker></date-picker>');
    const component = await page.find('date-picker');
    const element = await page.find('date-picker >>> div');
    expect(element.textContent).toEqual(`Hello, World! I'm `);

    component.setProperty('first', 'James');
    await page.waitForChanges();
    expect(element.textContent).toEqual(`Hello, World! I'm James`);

    component.setProperty('last', 'Quincy');
    await page.waitForChanges();
    expect(element.textContent).toEqual(`Hello, World! I'm James Quincy`);

    component.setProperty('middle', 'Earl');
    await page.waitForChanges();
    expect(element.textContent).toEqual(`Hello, World! I'm James Earl Quincy`);
  });
});
