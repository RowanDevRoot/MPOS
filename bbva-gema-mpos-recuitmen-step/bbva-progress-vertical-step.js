import { LitElement, html } from 'lit-element';
import { getComponentSharedStyles } from '@cells-components/cells-lit-helpers/cells-lit-helpers.js';
import { CellsI18nMixin as cellsI18nMixin } from '@cells-components/cells-i18n-mixin';
import '@bbva-web-components/bbva-date';
import '@bbva-web-components/bbva-link';
import '@bbva-web-components/bbva-notification-help';
import '@bbva-web-components/bbva-header-main';
import '@bbva-web-components/bbva-button-default';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import styles from './bbva-progress-vertical-step-styles.js';

export { bbvaProgressVerticalStepAmbient } from './bbva-progress-vertical-step-ambient.js';

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
