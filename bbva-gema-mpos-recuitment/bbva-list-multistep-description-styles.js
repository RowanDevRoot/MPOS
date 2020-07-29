import { css, unsafeCSS } from 'lit-element';
import * as foundations from '@bbva-web-components/bbva-foundations-styles';

export default css`:host {
  box-sizing: border-box;
  display: block;
  padding: 0 calc(((2 * var(--gridSpacerVariant, var(--gridSpacer, ${unsafeCSS(foundations.grid.spacer)}))) / 16) * 1em) calc(((1 * var(--gridSpacerVariant, var(--gridSpacer, ${unsafeCSS(foundations.grid.spacer)}))) / 16) * 1em);
  background-color: var(--bbva-list-multistep-description-bg-color, transparent); }

:host([hidden]),
[hidden] {
  display: none !important; }

*,
*:before,
*:after {
  box-sizing: inherit; }

.slot-container ::slotted(*) {
  color: var(--bbva-list-multistep-description-text-color, var(--colorsPrimaryCoreLightened, ${unsafeCSS(foundations.colors.primaryCoreLightened)}));
  font-size: var(--typographyTypeSmall, ${unsafeCSS(foundations.typography.typeSmall)});
  line-height: var(--lineHeightTypeSmall, ${unsafeCSS(foundations.lineHeight.typeSmall)});
  font-weight: var(--fontFacePrimaryBookFontWeight, ${unsafeCSS(foundations.fontFacePrimary.book.fontWeight)});
  font-style: var(--fontFacePrimaryBookFontStyle, ${unsafeCSS(foundations.fontFacePrimary.book.fontStyle)}); }
`;