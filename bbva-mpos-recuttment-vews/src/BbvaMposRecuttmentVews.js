import { LitElement, html, } from 'lit-element';
import { getComponentSharedStyles } from '@bbva-web-components/bbva-core-lit-helpers';
import styles from './BbvaMposRecuttmentVews-styles.js';
import '@bbva-web-components/bbva-header-main';
/**
This component ...

Example:

```html
<bbva-mpos-recuttment-vews></bbva-mpos-recuttment-vews>
```

##styling-doc

@customElement bbva-mpos-recuttment-vews
@polymer
@LitElement
@demo demo/index.html
*/
export class BbvaMposRecuttmentVews extends LitElement {
  static get is() {
    return 'bbva-mpos-recuttment-vews';
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
      getComponentSharedStyles('bbva-mpos-recuttment-vews-shared-styles')
    ]
  }

  // Define a template
  render() {
    return html`
    <bbva-header-main
 
  icon-right1="coronita:menu"
  text="Header main"></bbva-header-main>
      <slot></slot>
      <p>Welcome to ${this.name}</p>
    `;
  }
}
