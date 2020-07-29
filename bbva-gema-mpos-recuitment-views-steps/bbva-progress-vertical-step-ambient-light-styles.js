import { css, unsafeCSS } from 'lit-element';
import * as foundations from '@bbva-web-components/bbva-foundations-styles/bbva-foundations-styles.js';

export default css`[ambient^=light] {
  --bbva-progress-vertical-step-pending-color: var(--colorsSecondary300, ${unsafeCSS(foundations.colors.secondary300)});
  --bbva-progress-vertical-step-pending-line-color: var(--colorsSecondary300, ${unsafeCSS(foundations.colors.secondary300)});
  --bbva-progress-vertical-step-pending-subtitle-color: var(--colorsPrimaryCore, ${unsafeCSS(foundations.colors.primaryCore)});
  --bbva-progress-vertical-step-pending-text-color: var(--colorsSecondary500, ${unsafeCSS(foundations.colors.secondary500)});
  --bbva-progress-vertical-step-pending-title-color: var(--colorsSecondary600, ${unsafeCSS(foundations.colors.secondary600)});
  --bbva-progress-vertical-step-completed-color: var(--colorsTertiaryType6Dark, ${unsafeCSS(foundations.colors.tertiaryType6Dark)});
  --bbva-progress-vertical-step-completed-line-color: var(--colorsTertiaryType6Dark, ${unsafeCSS(foundations.colors.tertiaryType6Dark)});
  --bbva-progress-vertical-step-completed-subtitle-color: var(--colorsTertiaryType6Dark, ${unsafeCSS(foundations.colors.tertiaryType6Dark)});
  --bbva-progress-vertical-step-completed-text-color: var(--colorsSecondary600, ${unsafeCSS(foundations.colors.secondary600)});
  --bbva-progress-vertical-step-completed-title-color: var(--colorsSecondary600, ${unsafeCSS(foundations.colors.secondary600)});
  --bbva-progress-vertical-step-error-color: var(--colorsTertiaryType1Dark, ${unsafeCSS(foundations.colors.tertiaryType1Dark)});
  --bbva-progress-vertical-step-error-line-color: var(--colorsSecondary300, ${unsafeCSS(foundations.colors.secondary300)});
  --bbva-progress-vertical-step-error-subtitle-color: var(--colorsTertiaryType1Dark, ${unsafeCSS(foundations.colors.tertiaryType1Dark)});
  --bbva-progress-vertical-step-error-text-color: var(--colorsSecondary600, ${unsafeCSS(foundations.colors.secondary600)});
  --bbva-progress-vertical-step-error-title-color: var(--colorsSecondary600, ${unsafeCSS(foundations.colors.secondary600)});
  --bbva-progress-vertical-step-date-color: var(--colorsSecondary600, ${unsafeCSS(foundations.colors.secondary600)});
  --bbva-progress-vertical-step-help-icon-color: var(--colorsTertiaryType1Dark, ${unsafeCSS(foundations.colors.tertiaryType1Dark)});
  --bbva-progress-vertical-step-help-text-color: var(--colorsSecondary600, ${unsafeCSS(foundations.colors.secondary600)});
  --bbva-progress-vertical-step-link-color: var(--colorsPrimaryMedium, ${unsafeCSS(foundations.colors.primaryMedium)});
  --bbva-progress-vertical-step-link-active-color: var(--colorsPrimaryCoreDark, ${unsafeCSS(foundations.colors.primaryCoreDark)});
  --bbva-progress-vertical-step-link-disabled-color: var(--colorsSecondary400, ${unsafeCSS(foundations.colors.secondary400)}); }
`;