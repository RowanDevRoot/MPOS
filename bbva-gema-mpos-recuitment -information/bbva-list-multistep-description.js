import { LitElement, html } from 'lit-element';
import { getComponentSharedStyles } from '@cells-components/cells-lit-helpers/cells-lit-helpers.js';
import styles from './bbva-list-multistep-description-styles.js';
import '@bbva-web-components/bbva-header-main';
import '@bbva-web-components/bbva-list-link-icon';
import '@bbva-web-components/bbva-list-multistep';
import '@bbva-web-components/bbva-button-default';
import '@bbva-web-components/bbva-link';
import '@bbva-web-components/bbva-list-bullet';

export class BbvaListMultistepDescription extends LitElement {
  static get is() {
    return 'bbva-list-multistep-description';
  }

  static get properties() {
    return {};
  }

  connectedCallback() {
    /* istanbul ignore else */
    if (super.connectedCallback) {
      super.connectedCallback();
    }
  }

  static get styles() {
    return [styles, getComponentSharedStyles('bbva-list-multistep-description-shared-styles')];
  }

  render() {
    return html`
      <div class="slot-container">
        <slot></slot>
        <slot></slot>
        <slot></slot>
        <slot></slot>       
      </div>
    `;
  }
}

customElements.define(BbvaListMultistepDescription.is, BbvaListMultistepDescription);
