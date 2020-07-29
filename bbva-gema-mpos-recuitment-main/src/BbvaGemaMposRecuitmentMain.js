import { LitElement, html, } from 'lit-element';
import { getComponentSharedStyles } from '@bbva-web-components/bbva-core-lit-helpers';
import styles from './BbvaGemaMposRecuitmentMain-styles.js';
import '@bbva-web-components/bbva-header-main';
/**
This component ...

Example:

```html
<bbva-gema-mpos-recuitment-main></bbva-gema-mpos-recuitment-main>
```

##styling-doc

@customElement bbva-gema-mpos-recuitment-main
@polymer
@LitElement
@demo demo/index.html
*/
export class BbvaGemaMposRecuitmentMain extends LitElement {
  static get is() {
    return 'bbva-gema-mpos-recuitment-main';
  }

  // Declare properties
  static get properties() {
    return {
      name: { type: String, },
    };
  }

  // Initialize properties
  constructor() {
    super();
    this.name = 'Cells';
  }

  static get styles() {
    return [
      styles,
      getComponentSharedStyles('bbva-gema-mpos-recuitment-main-shared-styles')
    ]
  }

  // Define a template
  render() {
    return html`
      <slot></slot>
      <p>Welcome to ${this.name}</p>
    `;
  }
}
