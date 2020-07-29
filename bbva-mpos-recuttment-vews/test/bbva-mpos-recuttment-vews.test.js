import { html, fixture, assert, fixtureCleanup } from '@open-wc/testing';
import '../bbva-mpos-recuttment-vews.js';

suite('<bbva-mpos-recuttment-vews>', () => {
  let el;

  teardown(() => fixtureCleanup());

  setup(async () => {
    el = await fixture(html`<bbva-mpos-recuttment-vews></bbva-mpos-recuttment-vews>`);
    await el.updateComplete;
  });

  test('instantiating the element with default properties works', () => {
    const element = el.shadowRoot.querySelector('p');
    assert.equal(element.innerText, 'Welcome to Cells');
  });

});





