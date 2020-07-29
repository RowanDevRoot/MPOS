import { setDocumentCustomStyles } from '@cells-components/cells-lit-helpers/cells-lit-helpers.js';
import { css, unsafeCSS } from 'lit-element';
import * as foundations from '@bbva-web-components/bbva-foundations-styles/bbva-foundations-styles.js';

setDocumentCustomStyles(css`
  #iframeBody {
    margin: 0;
    background-color: ${unsafeCSS(foundations.backgroundColors.dark)};
  }

  bbva-list-multistep bbva-clip-box {
    --bbva-medium-white: ${unsafeCSS(foundations.colors.primaryCoreLightened)};
    --bbva-clip-box-size: 24px;
    --cells-icon-fill-color: ${unsafeCSS(foundations.backgroundColors.dark)};
    margin-left: 8px;
  }
`);
