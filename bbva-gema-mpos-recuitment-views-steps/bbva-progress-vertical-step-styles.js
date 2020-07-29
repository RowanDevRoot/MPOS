import { css, unsafeCSS } from 'lit-element';
import * as foundations from '@bbva-web-components/bbva-foundations-styles';

export default css`:host {
  --_status-pending-color: var(--bbva-progress-vertical-step-pending-color,var(--colorsSecondary300, ${unsafeCSS(foundations.colors.secondary300)}));
  --_status-pending-line-color: var(--bbva-progress-vertical-step-pending-line-color,var(--colorsSecondary300, ${unsafeCSS(foundations.colors.secondary300)}));
  --_status-pending-subtitle-color: var(--bbva-progress-vertical-step-pending-subtitle-color,var(--colorsPrimaryCore, ${unsafeCSS(foundations.colors.primaryCore)}));
  --_status-pending-text-color: var(--bbva-progress-vertical-step-pending-text-color,var(--colorsSecondary500, ${unsafeCSS(foundations.colors.secondary500)}));
  --_status-pending-title-color: var(--bbva-progress-vertical-step-pending-title-color,var(--colorsSecondary600, ${unsafeCSS(foundations.colors.secondary600)}));
  --_status-completed-color: var(--bbva-progress-vertical-step-completed-color,var(--colorsTertiaryType6Dark, ${unsafeCSS(foundations.colors.tertiaryType6Dark)}));
  --_status-completed-line-color: var(--bbva-progress-vertical-step-completed-line-color,var(--colorsTertiaryType6Dark, ${unsafeCSS(foundations.colors.tertiaryType6Dark)}));
  --_status-completed-subtitle-color: var(--bbva-progress-vertical-step-completed-subtitle-color,var(--colorsTertiaryType6Dark, ${unsafeCSS(foundations.colors.tertiaryType6Dark)}));
  --_status-completed-text-color: var(--bbva-progress-vertical-step-completed-text-color,var(--colorsSecondary600, ${unsafeCSS(foundations.colors.secondary600)}));
  --_status-completed-title-color: var(--bbva-progress-vertical-step-completed-title-color,var(--colorsSecondary600, ${unsafeCSS(foundations.colors.secondary600)}));
  --_status-error-color: var(--bbva-progress-vertical-step-error-color,var(--colorsTertiaryType1Dark, ${unsafeCSS(foundations.colors.tertiaryType1Dark)}));
  --_status-error-line-color: var(--bbva-progress-vertical-step-error-line-color,var(--colorsSecondary300, ${unsafeCSS(foundations.colors.secondary300)}));
  --_status-error-subtitle-color: var(--bbva-progress-vertical-step-error-subtitle-color,var(--colorsTertiaryType1Dark, ${unsafeCSS(foundations.colors.tertiaryType1Dark)}));
  --_status-error-text-color: var(--bbva-progress-vertical-step-error-text-color,var(--colorsSecondary600, ${unsafeCSS(foundations.colors.secondary600)}));
  --_status-error-title-color: var(--bbva-progress-vertical-step-error-title-color,var(--colorsSecondary600, ${unsafeCSS(foundations.colors.secondary600)}));
  --_date-color: var(--bbva-progress-vertical-step-date-color,var(--colorsSecondary600, ${unsafeCSS(foundations.colors.secondary600)}));
  --_link-color: var(--bbva-progress-vertical-step-link-color,var(--colorsPrimaryMedium, ${unsafeCSS(foundations.colors.primaryMedium)}));
  --_link-active-color: var(--bbva-progress-vertical-step-link-active-color,var(--colorsPrimaryCoreDark, ${unsafeCSS(foundations.colors.primaryCoreDark)}));
  --_link-disabled-color: var(--bbva-progress-vertical-step-link-disabled-color,var(--colorsSecondary400, ${unsafeCSS(foundations.colors.secondary400)}));
  display: block;
  box-sizing: border-box; }

:host([hidden]),
[hidden] {
  display: none !important; }

*,
*:before,
*:after {
  box-sizing: inherit; }

.sr-only {
  border: 0;
  clip: rect(0 0 0 0);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  width: 1px; }

.steps {
  padding: var(--bbva-progress-vertical-step-steps-padding, calc(((2 * var(--gridSpacerVariant, var(--gridSpacer, ${unsafeCSS(foundations.grid.spacer)}))) / 16) * 1em));
  margin: 0;
  display: flex;
  flex-direction: column; }

.content {
  --_status-color: var(--_status-pending-color);
  --_status-line-color: var(--_status-pending-line-color);
  --_status-subtitle-color: var(--_status-pending-subtitle-color);
  --_status-text-color: var(--_status-pending-text-color);
  --_status-title-color: var(--_status-pending-title-color);
  display: flex;
  position: relative;
  flex: 0;
  width: 100%;
  padding-bottom: calc(((2 * var(--gridSpacerVariant, var(--gridSpacer, ${unsafeCSS(foundations.grid.spacer)}))) / 16) * 1em); }
  .content:before {
    content: '';
    position: absolute;
    left: 8px;
    top: 8px;
    height: 100%;
    width: 1px;
    background: var(--_status-line-color); }
  .content:last-of-type::before {
    display: none; }

.completed {
  --_status-color: var(--_status-completed-color);
  --_status-line-color: var(--_status-completed-line-color);
  --_status-subtitle-color: var(--_status-completed-subtitle-color);
  --_status-text-color: var(--_status-completed-text-color);
  --_status-title-color: var(--_status-completed-title-color); }

.error {
  --_status-color: var(--_status-error-color);
  --_status-line-color: var(--_status-error-line-color);
  --_status-subtitle-color: var(--_status-error-subtitle-color);
  --_status-text-color: var(--_status-error-text-color);
  --_status-title-color: var(--_status-error-title-color); }

.circle {
  height: 1rem;
  width: 1rem;
  margin-top: calc(((0.5 * var(--gridSpacerVariant, var(--gridSpacer, ${unsafeCSS(foundations.grid.spacer)}))) / 16) * 1rem);
  border-radius: 50%;
  background-color: var(--_status-color);
  position: relative; }

.main-content {
  display: flex;
  flex: 1;
  flex-direction: column;
  margin-left: calc(((2 * var(--gridSpacerVariant, var(--gridSpacer, ${unsafeCSS(foundations.grid.spacer)}))) / 16) * 1rem); }

.step-heading {
  display: flex;
  flex: 1;
  align-items: flex-start;
  justify-content: space-between; }

.title {
  font-size: var(--typographyTypeMedium, ${unsafeCSS(foundations.typography.typeMedium)});
  font-weight: var(--fontFacePrimaryMediumFontWeight, ${unsafeCSS(foundations.fontFacePrimary.medium.fontWeight)});
  font-style: var(--fontFacePrimaryMediumFontStyle, ${unsafeCSS(foundations.fontFacePrimary.medium.fontStyle)});
  line-height: var(--lineHeightTypeMedium, ${unsafeCSS(foundations.lineHeight.typeMedium)});
  color: var(--_status-title-color); }

.subtitle {
  margin-top: calc(((1 * var(--gridSpacerVariant, var(--gridSpacer, ${unsafeCSS(foundations.grid.spacer)}))) / 16) * 1rem);
  font-size: var(--typographyTypeSmall, ${unsafeCSS(foundations.typography.typeSmall)});
  font-weight: var(--fontFacePrimaryBookFontWeight, ${unsafeCSS(foundations.fontFacePrimary.book.fontWeight)});
  font-style: var(--fontFacePrimaryBookFontStyle, ${unsafeCSS(foundations.fontFacePrimary.book.fontStyle)});
  line-height: var(--lineHeightTypeSmall, ${unsafeCSS(foundations.lineHeight.typeSmall)});
  color: var(--_status-subtitle-color); }

.text {
  margin-top: calc(((1 * var(--gridSpacerVariant, var(--gridSpacer, ${unsafeCSS(foundations.grid.spacer)}))) / 16) * 1rem);
  font-size: var(--typographyTypeSmall, ${unsafeCSS(foundations.typography.typeSmall)});
  font-weight: var(--fontFacePrimaryBookFontWeight, ${unsafeCSS(foundations.fontFacePrimary.book.fontWeight)});
  font-style: var(--fontFacePrimaryBookFontStyle, ${unsafeCSS(foundations.fontFacePrimary.book.fontStyle)});
  line-height: var(--lineHeightTypeSmall, ${unsafeCSS(foundations.lineHeight.typeSmall)});
  color: var(--_status-text-color); }

.date {
  color: var(--_date-color); }

.notification {
  margin-top: calc(((1 * var(--gridSpacerVariant, var(--gridSpacer, ${unsafeCSS(foundations.grid.spacer)}))) / 16) * 1rem);
  --bbva-notification-help-icon-color: var(--bbva-progress-vertical-step-help-icon-color,var(--colorsTertiaryType1Dark, ${unsafeCSS(foundations.colors.tertiaryType1Dark)}));
  --bbva-notification-help-text-color: var(--bbva-progress-vertical-step-help-text-color,var(--colorsSecondary600, ${unsafeCSS(foundations.colors.secondary600)})); }

.link {
  --bbva-link-color: var(--_link-color);
  --bbva-link-active-color: var(--_link-active-color);
  --bbva-link-disabled-color: var(--_link-disabled-color); }
`;