import { css, unsafeCSS} from 'lit-element';
import { setDocumentCustomStyles, } from '@cells-components/cells-lit-helpers/cells-lit-helpers.js';
import * as foundations from '@bbva-web-components/bbva-foundations-styles/bbva-foundations-styles.js';

setDocumentCustomStyles(css`
  body {
  margin: 0;
  font-family: var(--cells-fontDefault, Benton Sans, sans-serif);
  }

  h2 {
  font-size: 1rem;
  font-weight: 500;
  text-transform: uppercase;
  }

  .demo {
  margin-bottom: 2rem;
  width: 100%;
  }

  .examples {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-top: 1rem;
  }

  .examples > * + * {
  margin-top: 1rem;
  }

  [ambient^=light] {
  background-color: ${unsafeCSS(foundations.colors.primaryCoreLightened)};
  }

  [ambient^=dark] {
  background-color: ${unsafeCSS(foundations.colors.primaryCore)};
  }

  [ambient=light100] {
  background-color: ${unsafeCSS(foundations.colors.secondary100)};
  }

  [ambient=dark100] {
  background-color: ${unsafeCSS(foundations.colors.primaryMedium)};
  }

  [ambient=dark200] {
  background-color: ${unsafeCSS(foundations.colors.primaryCore)};
  }

  [ambient=dark300] {
  background-color: ${unsafeCSS(foundations.colors.primaryCoreDark)};
  }

  [ambient=dark400] {
  background-color: ${unsafeCSS(foundations.colors.primaryCoreDarkened)};
  }

  @media (max-width: 768px) {
  *, *:before, *:after {
  -webkit-tap-highlight-color: transparent;
  }
  }
`);
