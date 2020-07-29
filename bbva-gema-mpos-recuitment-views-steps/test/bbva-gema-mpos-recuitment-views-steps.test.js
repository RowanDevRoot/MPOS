import { html, fixture, assert, fixtureCleanup } from '@open-wc/testing';
import '../bbva-gema-mpos-recuitment-views-steps.js';

suite('<bbva-gema-mpos-recuitment-views-steps>', () => {
  let el;

  teardown(() => fixtureCleanup());

  setup(async () => {
    el = await fixture(html`<bbva-gema-mpos-recuitment-views-steps></bbva-gema-mpos-recuitment-views-steps>`);
    await el.updateComplete;
  });

  test('instantiating the element with default properties works', () => {
    const element = el.shadowRoot.querySelector('p');
    assert.equal(element.innerText, 'Welcome to Cells');
  });

});





