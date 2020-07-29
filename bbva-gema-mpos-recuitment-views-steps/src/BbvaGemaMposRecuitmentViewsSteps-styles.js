import { css, unsafeCSS } from 'lit-element';


export default css`
:host {
  display: block;
  box-sizing: border-box;
  @apply --bbva-gema-mpos-recuitment-views-steps; }

:host([hidden]), [hidden] {
  display: none !important; }

*, *:before, *:after {
  box-sizing: inherit;}
`;
