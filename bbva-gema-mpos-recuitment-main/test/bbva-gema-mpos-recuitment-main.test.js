import { html, fixture, assert, fixtureCleanup } from '@open-wc/testing';
import '../bbva-gema-mpos-recuitment-main.js';

suite('<bbva-gema-mpos-recuitment-main>', () => {
  let el;

  teardown(() => fixtureCleanup());

  setup(async () => {
    el = await fixture(html`<bbva-gema-mpos-recuitment-main></bbva-gema-mpos-recuitment-main>`);
    await el.updateComplete;
  });

  test('instantiating the element with default properties works', () => {
    const element = el.shadowRoot.querySelector('p');
    assert.equal(element.innerText, 'Welcome to Cells');
  });

});





