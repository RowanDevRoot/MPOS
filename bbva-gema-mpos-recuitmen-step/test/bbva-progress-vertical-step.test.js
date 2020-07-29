import { html, fixture, assert, fixtureCleanup, oneEvent } from '@open-wc/testing';

import '../bbva-progress-vertical-step.js';

suite('bbva-progress-vertical-step', () => {
  let el;

  teardown(() => fixtureCleanup());

  setup(async () => {
    el = await fixture(
      html`
        <bbva-progress-vertical-step></bbva-progress-vertical-step>
      `,
    );
    el.steps = [
      {
        title: 'Shipped',
        date: 'April 23, 1995',
        subtitle: 'Subtitle',
        content:
          'Lorem ipsum dolor sit amet consectetur adipiscing elit senectus justo sollicitudin non.',
        linkText: 'Button',
        status: 'completed',
      },
      {
        title: 'Delivery attempt',
        date: 'April 29, 1995',
        subtitle: 'Subtitle',
        content:
          'Lorem ipsum dolor sit amet consectetur adipiscing elit senectus justo sollicitudin non.',
        link: 'https://www.bbva.es',
        linkText: 'BBVA',
        status: 'error',
        notificationIcon: 'coronita:alert',
        notificationText: 'Error!',
      },
      {
        title: 'Delivered',
        date: 'May 7, 1995',
        subtitle: 'Subtitle',
        content:
          'Lorem ipsum dolor sit amet consectetur adipiscing elit senectus justo sollicitudin non.',
        link: 'https://www.bbva.es',
        linkText: 'Link',
        status: 'pending',
      },
    ];
    await el.updateComplete;
  });

  test('a11y', function() {
    return assert.isAccessible(el);
  });

  test('throws an event when clicking a button', async () => {
    const button = el.shadowRoot.querySelector('button');
    setTimeout(() => button.click());
    await oneEvent(el, 'progress-vertical-step-link-click');
  });

  suite('a11y', () => assert.isAccessible(el));

  suite('Semantic Dom', () => {
    test('DOM - Structure test', () => {
      assert.dom.equalSnapshot(el);
    });

    test('SHADOW DOM - Structure test', () => {
      assert.shadowDom.equalSnapshot(el, { ignoreAttributes: ['id'] });
    });

    test('LIGHT DOM - Structure test', () => {
      assert.lightDom.equalSnapshot(el);
    });
  });
});
