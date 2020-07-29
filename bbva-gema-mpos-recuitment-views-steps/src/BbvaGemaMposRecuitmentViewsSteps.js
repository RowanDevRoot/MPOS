import { LitElement, html, } from 'lit-element';
import { getComponentSharedStyles } from '@bbva-web-components/bbva-core-lit-helpers';
import styles from './BbvaGemaMposRecuitmentViewsSteps-styles.js';
/**
This component ...

Example:

```html
<bbva-gema-mpos-recuitment-views-steps></bbva-gema-mpos-recuitment-views-steps>
```

##styling-doc

@customElement bbva-gema-mpos-recuitment-views-steps
@polymer
@LitElement
@demo demo/index.html
*/
export class BbvaGemaMposRecuitmentViewsSteps extends LitElement {
  static get is() {
    return 'bbva-gema-mpos-recuitment-views-steps';
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
      getComponentSharedStyles('bbva-gema-mpos-recuitment-views-steps-shared-styles')
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
