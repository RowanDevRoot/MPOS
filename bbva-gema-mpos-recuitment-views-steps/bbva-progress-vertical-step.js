import { LitElement, html } from 'lit-element';
import { getComponentSharedStyles } from '@cells-components/cells-lit-helpers/cells-lit-helpers.js';
import { CellsI18nMixin as cellsI18nMixin } from '@cells-components/cells-i18n-mixin';
import '@bbva-web-components/bbva-date';
import '@bbva-web-components/bbva-link';
import '@bbva-web-components/bbva-notification-help';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import styles from './bbva-progress-vertical-step-styles.js';

export { bbvaProgressVerticalStepAmbient } from './bbva-progress-vertical-step-ambient.js';
/**
The progress steps component is used to show the tracking of certain products. It is often used as a vertical list to show all the necessary information.

Example:

```html
<bbva-progress-vertical-step id="progress"></bbva-progress-vertical-step>
<script>
  const progress = document.querySelector('#progress');
  progress.steps = [
    {
      title: "Shipped",
      date: "April 23, 1995",
      subtitle: "Subtitle",
      content: "Lorem ipsum dolor sit amet consectetur adipiscing elit senectus justo sollicitudin non.",
      linkText: "Button",
      status: "completed"
    },
    {
      title: "Delivery attempt",
      date: "April 29, 1995",
      subtitle: "Subtitle",
      content: "Lorem ipsum dolor sit amet consectetur adipiscing elit senectus justo sollicitudin non.",
      link: "https://www.bbva.es",
      linkText: "BBVA",
      status: "error",
      notificationIcon: "coronita:alert",
      notificationText: "Error!"
    },
    {
      title: "Delivered",
      date: "May 7, 1995",
      subtitle: "Subtitle",
      content: "Lorem ipsum dolor sit amet consectetur adipiscing elit senectus justo sollicitudin non.",
      link: "https://www.bbva.es",
      target: "_blank",
      linkText: "Link",
      status: "pending"
    },
  ];
</script>
```

## Styling

The following custom properties are available for styling:

### Custom properties

| Selector        | CSS Property                        | CSS Variable                                           | Theme Variable                    | Foundations/Fallback                                        |
| --------------- | ----------------------------------- | ------------------------------------------------------ | --------------------------------- | ----------------------------------------------------------- |
| .link           | --bbva-link-color                   | --_link-color                                          |                                   |                                                             |
| .link           | --bbva-link-active-color            | --_link-active-color                                   |                                   |                                                             |
| .link           | --bbva-link-disabled-color          | --_link-disabled-color                                 |                                   |                                                             |
| .notification   | margin-top                          | --gridSpacerVariant                                    | --gridSpacer                      | foundations.grid.spacer                       |
| .notification   | --bbva-notification-help-icon-color | --bbva-progress-vertical-step-help-icon-color          | --colorsTertiaryType1Dark         | foundations.colors.tertiaryType1Dark          |
| .notification   | --bbva-notification-help-text-color | --bbva-progress-vertical-step-help-text-color          | --colorsSecondary600              | foundations.colors.secondary600               |
| .date           | color                               | --_date-color                                          |                                   |                                                             |
| .text           | margin-top                          | --gridSpacerVariant                                    | --gridSpacer                      | foundations.grid.spacer                       |
| .text           | font-size                           |                                                        | --typographyTypeSmall             | foundations.typography.typeSmall              |
| .text           | font-weight                         |                                                        | --fontFacePrimaryBookFontWeight   | foundations.fontFacePrimary.book.fontWeight   |
| .text           | font-style                          |                                                        | --fontFacePrimaryBookFontStyle    | foundations.fontFacePrimary.book.fontStyle    |
| .text           | line-height                         |                                                        | --lineHeightTypeSmall             | foundations.lineHeight.typeSmall              |
| .text           | color                               | --_status-text-color                                   |                                   |                                                             |
| .subtitle       | margin-top                          | --gridSpacerVariant                                    | --gridSpacer                      | foundations.grid.spacer                       |
| .subtitle       | font-size                           |                                                        | --typographyTypeSmall             | foundations.typography.typeSmall              |
| .subtitle       | font-weight                         |                                                        | --fontFacePrimaryBookFontWeight   | foundations.fontFacePrimary.book.fontWeight   |
| .subtitle       | font-style                          |                                                        | --fontFacePrimaryBookFontStyle    | foundations.fontFacePrimary.book.fontStyle    |
| .subtitle       | line-height                         |                                                        | --lineHeightTypeSmall             | foundations.lineHeight.typeSmall              |
| .subtitle       | color                               | --_status-subtitle-color                               |                                   |                                                             |
| .title          | font-size                           |                                                        | --typographyTypeMedium            | foundations.typography.typeMedium             |
| .title          | font-weight                         |                                                        | --fontFacePrimaryMediumFontWeight | foundations.fontFacePrimary.medium.fontWeight |
| .title          | font-style                          |                                                        | --fontFacePrimaryMediumFontStyle  | foundations.fontFacePrimary.medium.fontStyle  |
| .title          | line-height                         |                                                        | --lineHeightTypeMedium            | foundations.lineHeight.typeMedium             |
| .title          | color                               | --_status-title-color                                  |                                   |                                                             |
| .main-content   | margin-left                         | --gridSpacerVariant                                    | --gridSpacer                      | foundations.grid.spacer                       |
| .circle         | margin-top                          | --gridSpacerVariant                                    | --gridSpacer                      | foundations.grid.spacer                       |
| .circle         | background-color                    | --_status-color                                        |                                   |                                                             |
| .error          | --_status-color                     | --_status-error-color                                  |                                   |                                                             |
| .error          | --_status-line-color                | --_status-error-line-color                             |                                   |                                                             |
| .error          | --_status-subtitle-color            | --_status-error-subtitle-color                         |                                   |                                                             |
| .error          | --_status-text-color                | --_status-error-text-color                             |                                   |                                                             |
| .error          | --_status-title-color               | --_status-error-title-color                            |                                   |                                                             |
| .completed      | --_status-color                     | --_status-completed-color                              |                                   |                                                             |
| .completed      | --_status-line-color                | --_status-completed-line-color                         |                                   |                                                             |
| .completed      | --_status-subtitle-color            | --_status-completed-subtitle-color                     |                                   |                                                             |
| .completed      | --_status-text-color                | --_status-completed-text-color                         |                                   |                                                             |
| .completed      | --_status-title-color               | --_status-completed-title-color                        |                                   |                                                             |
| .content:before | background                          | --_status-line-color                                   |                                   |                                                             |
| .content        | --_status-color                     | --_status-pending-color                                |                                   |                                                             |
| .content        | --_status-line-color                | --_status-pending-line-color                           |                                   |                                                             |
| .content        | --_status-subtitle-color            | --_status-pending-subtitle-color                       |                                   |                                                             |
| .content        | --_status-text-color                | --_status-pending-text-color                           |                                   |                                                             |
| .content        | --_status-title-color               | --_status-pending-title-color                          |                                   |                                                             |
| .content        | padding-bottom                      | --gridSpacerVariant                                    | --gridSpacer                      | foundations.grid.spacer                       |
| .steps          | padding                             | --bbva-progress-vertical-step-steps-padding            | --gridSpacerVariant               | [object Object]                                             |
| :host           | --_status-pending-color             | --bbva-progress-vertical-step-pending-color            | --colorsSecondary300              | foundations.colors.secondary300               |
| :host           | --_status-pending-line-color        | --bbva-progress-vertical-step-pending-line-color       | --colorsSecondary300              | foundations.colors.secondary300               |
| :host           | --_status-pending-subtitle-color    | --bbva-progress-vertical-step-pending-subtitle-color   | --colorsPrimaryCore               | foundations.colors.primaryCore                |
| :host           | --_status-pending-text-color        | --bbva-progress-vertical-step-pending-text-color       | --colorsSecondary500              | foundations.colors.secondary500               |
| :host           | --_status-pending-title-color       | --bbva-progress-vertical-step-pending-title-color      | --colorsSecondary600              | foundations.colors.secondary600               |
| :host           | --_status-completed-color           | --bbva-progress-vertical-step-completed-color          | --colorsTertiaryType6Dark         | foundations.colors.tertiaryType6Dark          |
| :host           | --_status-completed-line-color      | --bbva-progress-vertical-step-completed-line-color     | --colorsTertiaryType6Dark         | foundations.colors.tertiaryType6Dark          |
| :host           | --_status-completed-subtitle-color  | --bbva-progress-vertical-step-completed-subtitle-color | --colorsTertiaryType6Dark         | foundations.colors.tertiaryType6Dark          |
| :host           | --_status-completed-text-color      | --bbva-progress-vertical-step-completed-text-color     | --colorsSecondary600              | foundations.colors.secondary600               |
| :host           | --_status-completed-title-color     | --bbva-progress-vertical-step-completed-title-color    | --colorsSecondary600              | foundations.colors.secondary600               |
| :host           | --_status-error-color               | --bbva-progress-vertical-step-error-color              | --colorsTertiaryType1Dark         | foundations.colors.tertiaryType1Dark          |
| :host           | --_status-error-line-color          | --bbva-progress-vertical-step-error-line-color         | --colorsSecondary300              | foundations.colors.secondary300               |
| :host           | --_status-error-subtitle-color      | --bbva-progress-vertical-step-error-subtitle-color     | --colorsTertiaryType1Dark         | foundations.colors.tertiaryType1Dark          |
| :host           | --_status-error-text-color          | --bbva-progress-vertical-step-error-text-color         | --colorsSecondary600              | foundations.colors.secondary600               |
| :host           | --_status-error-title-color         | --bbva-progress-vertical-step-error-title-color        | --colorsSecondary600              | foundations.colors.secondary600               |
| :host           | --_date-color                       | --bbva-progress-vertical-step-date-color               | --colorsSecondary600              | foundations.colors.secondary600               |
| :host           | --_link-color                       | --bbva-progress-vertical-step-link-color               | --colorsPrimaryMedium             | foundations.colors.primaryMedium              |
| :host           | --_link-active-color                | --bbva-progress-vertical-step-link-active-color        | --colorsPrimaryCoreDark           | foundations.colors.primaryCoreDark            |
| :host           | --_link-disabled-color              | --bbva-progress-vertical-step-link-disabled-color      | --colorsSecondary400              | foundations.colors.secondary400               |

## Ambient

### Custom properties

| Selector        | CSS Property                                           | CSS Variable | Theme Variable               | Foundations/Fallback                                  |
| --------------- | ------------------------------------------------------ | ------------ | ---------------------------- | ----------------------------------------------------- |
| [ambient^=dark] | --bbva-progress-vertical-step-pending-color            |              | --colorsSecondary300         | foundations.colors.secondary300         |
| [ambient^=dark] | --bbva-progress-vertical-step-pending-line-color       |              | --colorsSecondary300         | foundations.colors.secondary300         |
| [ambient^=dark] | --bbva-progress-vertical-step-pending-subtitle-color   |              | --colorsPrimaryCoreLightened | foundations.colors.primaryCoreLightened |
| [ambient^=dark] | --bbva-progress-vertical-step-pending-text-color       |              | --colorsSecondary300         | foundations.colors.secondary300         |
| [ambient^=dark] | --bbva-progress-vertical-step-pending-title-color      |              | --colorsSecondary300         | foundations.colors.secondary300         |
| [ambient^=dark] | --bbva-progress-vertical-step-completed-color          |              | --colorsTertiaryType6Medium  | foundations.colors.tertiaryType6Medium  |
| [ambient^=dark] | --bbva-progress-vertical-step-completed-line-color     |              | --colorsTertiaryType6Medium  | foundations.colors.tertiaryType6Medium  |
| [ambient^=dark] | --bbva-progress-vertical-step-completed-subtitle-color |              | --colorsPrimaryCoreLightened | foundations.colors.primaryCoreLightened |
| [ambient^=dark] | --bbva-progress-vertical-step-completed-text-color     |              | --colorsPrimaryCoreLightened | foundations.colors.primaryCoreLightened |
| [ambient^=dark] | --bbva-progress-vertical-step-completed-title-color    |              | --colorsPrimaryCoreLightened | foundations.colors.primaryCoreLightened |
| [ambient^=dark] | --bbva-progress-vertical-step-error-color              |              | --colorsTertiaryType1Light   | foundations.colors.tertiaryType1Light   |
| [ambient^=dark] | --bbva-progress-vertical-step-error-line-color         |              | --colorsSecondary300         | foundations.colors.secondary300         |
| [ambient^=dark] | --bbva-progress-vertical-step-error-subtitle-color     |              | --colorsPrimaryCoreLightened | foundations.colors.primaryCoreLightened |
| [ambient^=dark] | --bbva-progress-vertical-step-error-text-color         |              | --colorsPrimaryCoreLightened | foundations.colors.primaryCoreLightened |
| [ambient^=dark] | --bbva-progress-vertical-step-error-title-color        |              | --colorsPrimaryCoreLightened | foundations.colors.primaryCoreLightened |
| [ambient^=dark] | --bbva-progress-vertical-step-date-color               |              | --colorsPrimaryCoreLightened | foundations.colors.primaryCoreLightened |
| [ambient^=dark] | --bbva-progress-vertical-step-help-icon-color          |              | --colorsPrimaryCoreLightened | foundations.colors.primaryCoreLightened |
| [ambient^=dark] | --bbva-progress-vertical-step-help-text-color          |              | --colorsPrimaryCoreLightened | foundations.colors.primaryCoreLightened |
| [ambient^=dark] | --bbva-progress-vertical-step-link-color               |              | --colorsPrimarySubdued       | foundations.colors.primarySubdued       |
| [ambient^=dark] | --bbva-progress-vertical-step-link-active-color        |              | --colorsPrimaryMediumLight   | foundations.colors.primaryMediumLight   |
| [ambient^=dark] | --bbva-progress-vertical-step-link-disabled-color      |              | --colorsSecondary400         | foundations.colors.secondary400         |

### Custom properties

| Selector         | CSS Property                                           | CSS Variable | Theme Variable            | Foundations/Fallback                               |
| ---------------- | ------------------------------------------------------ | ------------ | ------------------------- | -------------------------------------------------- |
| [ambient^=light] | --bbva-progress-vertical-step-pending-color            |              | --colorsSecondary300      | foundations.colors.secondary300      |
| [ambient^=light] | --bbva-progress-vertical-step-pending-line-color       |              | --colorsSecondary300      | foundations.colors.secondary300      |
| [ambient^=light] | --bbva-progress-vertical-step-pending-subtitle-color   |              | --colorsPrimaryCore       | foundations.colors.primaryCore       |
| [ambient^=light] | --bbva-progress-vertical-step-pending-text-color       |              | --colorsSecondary500      | foundations.colors.secondary500      |
| [ambient^=light] | --bbva-progress-vertical-step-pending-title-color      |              | --colorsSecondary600      | foundations.colors.secondary600      |
| [ambient^=light] | --bbva-progress-vertical-step-completed-color          |              | --colorsTertiaryType6Dark | foundations.colors.tertiaryType6Dark |
| [ambient^=light] | --bbva-progress-vertical-step-completed-line-color     |              | --colorsTertiaryType6Dark | foundations.colors.tertiaryType6Dark |
| [ambient^=light] | --bbva-progress-vertical-step-completed-subtitle-color |              | --colorsTertiaryType6Dark | foundations.colors.tertiaryType6Dark |
| [ambient^=light] | --bbva-progress-vertical-step-completed-text-color     |              | --colorsSecondary600      | foundations.colors.secondary600      |
| [ambient^=light] | --bbva-progress-vertical-step-completed-title-color    |              | --colorsSecondary600      | foundations.colors.secondary600      |
| [ambient^=light] | --bbva-progress-vertical-step-error-color              |              | --colorsTertiaryType1Dark | foundations.colors.tertiaryType1Dark |
| [ambient^=light] | --bbva-progress-vertical-step-error-line-color         |              | --colorsSecondary300      | foundations.colors.secondary300      |
| [ambient^=light] | --bbva-progress-vertical-step-error-subtitle-color     |              | --colorsTertiaryType1Dark | foundations.colors.tertiaryType1Dark |
| [ambient^=light] | --bbva-progress-vertical-step-error-text-color         |              | --colorsSecondary600      | foundations.colors.secondary600      |
| [ambient^=light] | --bbva-progress-vertical-step-error-title-color        |              | --colorsSecondary600      | foundations.colors.secondary600      |
| [ambient^=light] | --bbva-progress-vertical-step-date-color               |              | --colorsSecondary600      | foundations.colors.secondary600      |
| [ambient^=light] | --bbva-progress-vertical-step-help-icon-color          |              | --colorsTertiaryType1Dark | foundations.colors.tertiaryType1Dark |
| [ambient^=light] | --bbva-progress-vertical-step-help-text-color          |              | --colorsSecondary600      | foundations.colors.secondary600      |
| [ambient^=light] | --bbva-progress-vertical-step-link-color               |              | --colorsPrimaryMedium     | foundations.colors.primaryMedium     |
| [ambient^=light] | --bbva-progress-vertical-step-link-active-color        |              | --colorsPrimaryCoreDark   | foundations.colors.primaryCoreDark   |
| [ambient^=light] | --bbva-progress-vertical-step-link-disabled-color      |              | --colorsSecondary400      | foundations.colors.secondary400      |
> Styling documentation generated by Cells CLI

@customElement bbva-progress-vertical-step
@polymer
@LitElement
@demo demo/index.html
@appliesMixin CellsI18nMixin
*/
export class BbvaProgressVerticalStep extends cellsI18nMixin(LitElement) {
  static get is() {
    return 'bbva-progress-vertical-step';
  }

  static get properties() {
    return {
      /**
       * Array with the objects that will be used for the steps
       */
      steps: {
        type: Array,
      },
      /**
       * Object with keys for accessible step status text
       */
      statusText: {
        type: Object,
        attribute: 'status-text',
      },
    };
  }

  static get styles() {
    return [styles, getComponentSharedStyles('bbva-progress-vertical-step-shared-styles')];
  }

  constructor() {
    super();
    this.steps = [];
    this.statusText = {
      completed: 'bbva-progress-vertical-step-completed',
      pending: 'bbva-progress-vertical-step-pending',
      error: 'bbva-progress-vertical-step-error',
    };
  }

  _linkClicked(step) {
    /**
     * Fired when the step link is clicked
     * @event progress-vertical-step-link-click
     */
    this.dispatchEvent(
      new CustomEvent('progress-vertical-step-link-click', {
        bubbles: true,
        composed: true,
        detail: step,
      }),
    );
  }

  render() {
    return html`
      <ol class="steps">
        ${this.steps.map(
          step =>
            html`
              <li class="content ${step.status}">
                <span class="circle">
                  <span class="sr-only">${this.t(this.statusText[step.status])}</span>
                </span>
                <div class="main-content">
                  <div class="step-heading">
                    <span class="title">${step.title}</span>
                    <bbva-link
                      class="link"
                      @click="${() => this._linkClicked(step)}"
                      .href="${ifDefined(step.link)}"
                      .target="${ifDefined(step.target)}"
                      >${step.linkText}</bbva-link
                    >
                  </div>
                  <bbva-date class="date" date="${step.date}"></bbva-date>
                  <span class="subtitle">${step.subtitle}</span>
                  <div class="text">${step.content}</div>
                  ${step.status === 'error'
                    ? html`
                        <bbva-notification-help
                          icon="${step.notificationIcon}"
                          class="notification"
                          text="${step.notificationText}"
                        ></bbva-notification-help>
                      `
                    : ``}
                </div>
              </li>
            `,
        )}
      </ol>
    `;
  }
}

customElements.define(BbvaProgressVerticalStep.is, BbvaProgressVerticalStep);
