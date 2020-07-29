import { css, unsafeCSS } from 'lit-element';
import * as foundations from '@bbva-web-components/bbva-foundations-styles/bbva-foundations-styles.js';

export default css`[ambient^=dark] {
  --bbva-progress-vertical-step-pending-color: var(--colorsSecondary300, ${unsafeCSS(foundations.colors.secondary300)});
  --bbva-progress-vertical-step-pending-line-color: var(--colorsSecondary300, ${unsafeCSS(foundations.colors.secondary300)});
  --bbva-progress-vertical-step-pending-subtitle-color: var(--colorsPrimaryCoreLightened, ${unsafeCSS(foundations.colors.primaryCoreLightened)});
  --bbva-progress-vertical-step-pending-text-color: var(--colorsSecondary300, ${unsafeCSS(foundations.colors.secondary300)});
  --bbva-progress-vertical-step-pending-title-color: var(--colorsSecondary300, ${unsafeCSS(foundations.colors.secondary300)});
  --bbva-progress-vertical-step-completed-color: var(--colorsTertiaryType6Medium, ${unsafeCSS(foundations.colors.tertiaryType6Medium)});
  --bbva-progress-vertical-step-completed-line-color: var(--colorsTertiaryType6Medium, ${unsafeCSS(foundations.colors.tertiaryType6Medium)});
  --bbva-progress-vertical-step-completed-subtitle-color: var(--colorsPrimaryCoreLightened, ${unsafeCSS(foundations.colors.primaryCoreLightened)});
  --bbva-progress-vertical-step-completed-text-color: var(--colorsPrimaryCoreLightened, ${unsafeCSS(foundations.colors.primaryCoreLightened)});
  --bbva-progress-vertical-step-completed-title-color: var(--colorsPrimaryCoreLightened, ${unsafeCSS(foundations.colors.primaryCoreLightened)});
  --bbva-progress-vertical-step-error-color: var(--colorsTertiaryType1Light, ${unsafeCSS(foundations.colors.tertiaryType1Light)});
  --bbva-progress-vertical-step-error-line-color: var(--colorsSecondary300, ${unsafeCSS(foundations.colors.secondary300)});
  --bbva-progress-vertical-step-error-subtitle-color: var(--colorsPrimaryCoreLightened, ${unsafeCSS(foundations.colors.primaryCoreLightened)});
  --bbva-progress-vertical-step-error-text-color: var(--colorsPrimaryCoreLightened, ${unsafeCSS(foundations.colors.primaryCoreLightened)});
  --bbva-progress-vertical-step-error-title-color: var(--colorsPrimaryCoreLightened, ${unsafeCSS(foundations.colors.primaryCoreLightened)});
  --bbva-progress-vertical-step-date-color: var(--colorsPrimaryCoreLightened, ${unsafeCSS(foundations.colors.primaryCoreLightened)});
  --bbva-progress-vertical-step-help-icon-color: var(--colorsPrimaryCoreLightened, ${unsafeCSS(foundations.colors.primaryCoreLightened)});
  --bbva-progress-vertical-step-help-text-color: var(--colorsPrimaryCoreLightened, ${unsafeCSS(foundations.colors.primaryCoreLightened)});
  --bbva-progress-vertical-step-link-color: var(--colorsPrimarySubdued, ${unsafeCSS(foundations.colors.primarySubdued)});
  --bbva-progress-vertical-step-link-active-color: var(--colorsPrimaryMediumLight, ${unsafeCSS(foundations.colors.primaryMediumLight)});
  --bbva-progress-vertical-step-link-disabled-color:var(--colorsSecondary400, ${unsafeCSS(foundations.colors.secondary400)}); }
`;