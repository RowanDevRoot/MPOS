import { html, fixture, assert, fixtureCleanup } from '@open-wc/testing';

import '../bbva-list-multistep-description.js';

suite('bbva-list-multistep-description', () => {
  let el;

  teardown(() => fixtureCleanup());
  suite('default use', () => {
    setup(async () => {
      el = await fixture(html`
        <bbva-list-multistep-description>
          <span>Lorem ipsum dolor sit amet.</span>
        </bbva-list-multistep-description>
      `);
      await el.updateComplete;
    });

    test('a11y', () => assert.isAccessible(el));

    test('SHADOW DOM - Structure test', () => {
      assert.shadowDom.equalSnapshot(el);
    });

    test('LIGHT DOM - Structure test', () => {
      assert.lightDom.equalSnapshot(el);
    });
  });

});
