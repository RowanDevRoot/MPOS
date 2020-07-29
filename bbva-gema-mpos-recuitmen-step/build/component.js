(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@bbva-web-components/bbva-button-default')) :
  typeof define === 'function' && define.amd ? define(['exports', '@bbva-web-components/bbva-button-default'], factory) :
  (global = global || self, factory(global.DemoHelpers = {}));
}(this, (function (exports) { 'use strict';

  /**
  @license
  Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
  This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
  The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
  The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
  Code distributed by Google as part of the polymer project is also
  subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
  */

  /* eslint-disable no-unused-vars */

  /**
   * When using Closure Compiler, JSCompiler_renameProperty(property, object) is replaced by the munged name for object[property]
   * We cannot alias this function, so we have to use a small shim that has the same behavior when not compiling.
   *
   * @param {string} prop Property name
   * @param {?Object} obj Reference object
   * @return {string} Potentially renamed property name
   */
  window.JSCompiler_renameProperty = function (prop, obj) {
    return prop;
  };

  /**
  @license
  Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
  This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
  The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
  The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
  Code distributed by Google as part of the polymer project is also
  subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
  */
  const ABS_URL = /(^\/)|(^#)|(^[\w-\d]*:)/;
  let workingURL;
  let resolveDoc;
  /**
   * Resolves the given URL against the provided `baseUri'.
   *
   * Note that this function performs no resolution for URLs that start
   * with `/` (absolute URLs) or `#` (hash identifiers).  For general purpose
   * URL resolution, use `window.URL`.
   *
   * @param {string} url Input URL to resolve
   * @param {?string=} baseURI Base URI to resolve the URL against
   * @return {string} resolved URL
   */

  function resolveUrl(url, baseURIparam) {
    let baseURI = baseURIparam;

    if (url && ABS_URL.test(url)) {
      return url;
    } // Lazy feature detection.


    if (workingURL === undefined) {
      workingURL = false;

      try {
        const u = new URL('b', 'http://a');
        u.pathname = 'c%20d';
        workingURL = u.href === 'http://a/c%20d';
      } catch (e) {// silently fail
      }
    }

    if (!baseURI) {
      baseURI = document.baseURI || window.location.href;
    }

    if (workingURL) {
      return new URL(url, baseURI).href;
    } // Fallback to creating an anchor into a disconnected document.


    if (!resolveDoc) {
      resolveDoc = document.implementation.createHTMLDocument('temp');
      resolveDoc.base = resolveDoc.createElement('base');
      resolveDoc.head.appendChild(resolveDoc.base);
      resolveDoc.anchor = resolveDoc.createElement('a');
      resolveDoc.body.appendChild(resolveDoc.anchor);
    }

    resolveDoc.base.href = baseURI;
    resolveDoc.anchor.href = url;
    return resolveDoc.anchor.href || url;
  }
  /**
   * Returns a path from a given `url`. The path includes the trailing
   * `/` from the url.
   *
   * @param {string} url Input URL to transform
   * @return {string} resolved path
   */

  function pathFromUrl(url) {
    return url.substring(0, url.lastIndexOf('/') + 1);
  }

  /**
  @license
  Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
  This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
  The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
  The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
  Code distributed by Google as part of the polymer project is also
  subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
  */
  const useNativeCSSProperties = Boolean(!window.ShadyCSS || window.ShadyCSS.nativeCss);
  /* eslint-disable import/no-mutable-exports */

  /**
   * Globally settable property that is automatically assigned to
   * `ElementMixin` instances, useful for binding in templates to
   * make URL's relative to an application's root.  Defaults to the main
   * document URL, but can be overridden by users.  It may be useful to set
   * `rootPath` to provide a stable application mount path when
   * using client side routing.
   */

  let rootPath =  pathFromUrl(document.baseURI || window.location.href);
  /**
   * A global callback used to sanitize any value before inserting it into the DOM.
   * The callback signature is:
   *
   *  function sanitizeDOMValue(value, name, type, node) { ... }
   *
   * Where:
   *
   * `value` is the value to sanitize.
   * `name` is the name of an attribute or property (for example, href).
   * `type` indicates where the value is being inserted: one of property, attribute, or text.
   * `node` is the node where the value is being inserted.
   *
   * @type {(function(*,string,string,Node):*)|undefined}
   */

  let sanitizeDOMValue = window.Polymer && window.Polymer.sanitizeDOMValue || undefined;

  /**
  @license
  Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
  This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
  The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
  The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
  Code distributed by Google as part of the polymer project is also
  subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
  */
  const modules = {};
  const lcModules = {};
  /**
   * Sets a bbva-core-dom-module into the global registry by id.
   *
   * @param {string} id bbva-core-dom-module id
   * @param {DomModule} module bbva-core-dom-module instance
   * @return {void}
   */

  function setModule(id, module) {
    // store id separate from lowercased id so that
    // in all cases mixedCase id will stored distinctly
    // and lowercase version is a fallback
    modules[id] = module;
    lcModules[id.toLowerCase()] = module;
  }
  /**
   * Retrieves a bbva-core-dom-module from the global registry by id.
   *
   * @param {string} id bbva-core-dom-module id
   * @return {DomModule!} bbva-core-dom-module instance
   */


  function findModule(id) {
    return modules[id] || lcModules[id.toLowerCase()];
  }
  /**
   * The `bbva-core-dom-module` element registers the dom it contains to the name given
   * by the module's id attribute. It provides a unified database of dom
   * accessible via its static `import` API.
   *
   * Example:
   *
   *     <bbva-core-dom-module id="foo">
   *       <img src="stuff.png">
   *     </bbva-core-dom-module>
   *
   * Then in code in some other location that cannot access the bbva-core-dom-module above
   *
   *     let img = customElements.get('bbva-core-dom-module').import('foo', 'img');
   *
   * @customElement bbva-core-dom-module
   * @polymer
   * @LitElement
   */


  class BbvaCoreDomModule extends HTMLElement {
    static get observedAttributes() {
      return ['id'];
    }
    /**
     * Retrieves the element specified by the css `selector` in the module
     * registered by `id`. For example, this.import('foo', 'img');
     * @param {string} id The id of the bbva-core-dom-module in which to search.
     * @param {string=} selector The css selector by which to find the element.
     * @return {Element} Returns the element which matches `selector` in the
     * module registered at the specified `id`.
     *
     * @export
     * @nocollapse Referred to indirectly in style-gather.js
     */


    static import(id, selector) {
      if (id) {
        const m = findModule(id);

        if (m && selector) {
          return m.querySelector(selector);
        }

        return m;
      }

      return null;
    }
    /**
     * @param {string} name Name of attribute.
     * @param {?string} old Old value of attribute.
     * @param {?string} value Current value of attribute.
     * @param {?string} namespace Attribute namespace.
     * @return {void}
     * @override
     */


    attributeChangedCallback(name, old, value) {
      if (old !== value) {
        this.register();
      }
    }
    /**
     * The absolute URL of the original location of this `bbva-core-dom-module`.
     *
     * This value will differ from this element's `ownerDocument` in the
     * following ways:
     * - Takes into account any `assetpath` attribute added during bundling
     *   to indicate the original location relative to the bundled location
     */


    get assetpath() {
      // Don't override existing assetpath.
      if (!this.__assetpath) {
        const owner = this.ownerDocument;
        const url = resolveUrl(this.getAttribute('assetpath') || '', owner.baseURI);
        this.__assetpath = pathFromUrl(url);
      }

      return this.__assetpath;
    }
    /**
     * Registers the bbva-core-dom-module at a given id. This method should only be called
     * when a bbva-core-dom-module is imperatively created. For
     * example, `document.createElement('bbva-core-dom-module').register('foo')`.
     * @param {string=} id The id at which to register the bbva-core-dom-module.
     * @return {void}
     */


    register(moduleId) {
      const id = moduleId || this.id;

      if (id) {

        this.id = id;
        setModule(id, this);
      }
    }

  }
  BbvaCoreDomModule.prototype.modules = modules;
  BbvaCoreDomModule.prototype.modulesStyles = {};

  if (!customElements.get('bbva-core-dom-module')) {
    customElements.define('bbva-core-dom-module', BbvaCoreDomModule);
  }

  /* eslint-disable no-console */

  /**
  @license
  Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
  This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
  The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
  The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
  Code distributed by Google as part of the polymer project is also
  subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
  */
  let CustomStyleInterface;

  if (window.ShadyCSS && window.ShadyCSS.CustomStyleInterface) {
    CustomStyleInterface = window.ShadyCSS.CustomStyleInterface;
  } else {
    CustomStyleInterface = undefined;
    console.warn('CustomStyleInterface shim not detected. Be sure to add ShadyCSS CustomStyleInterface to your app when running on browsers without native Shadow DOM!');
  }
  /**
   * Custom element for defining styles in the main document that can take
   * advantage of [shady DOM](https://github.com/webcomponents/shadycss) shims
   * for style encapsulation and custom properties.
   *
   * - Document styles defined in a `<bbva-core-custom-style>` are shimmed to ensure they
   *   do not leak into local DOM when running on browsers without native
   *   Shadow DOM.
   * - Custom properties can be defined in a `<bbva-core-custom-style>`. Use the `html` selector
   *   to define custom properties that apply to all custom elements.
   *
   * To use:
   *
   * - Place a `<bbva-core-custom-style>` element in the main document, wrapping an inline `<style>` tag that
   *   contains the CSS rules you want to shim.
   *
   * <bbva-core-custom-style>
   *   <style>
   *     html {
   *       --custom-color: blue;
   *       --custom-mixin: {
   *         font-weight: bold;
   *         color: red;
   *       };
   *     }
   *   </style>
   * </bbva-core-custom-style>
   * ```
   *
   * @customElement bbva-core-custom-style
   * @polymer
   * @LitElement
   */


  class BbvaCoreCustomStyle extends HTMLElement {
    constructor() {
      super();

      if (CustomStyleInterface) {
        this._style = null;
        CustomStyleInterface.addCustomStyle(this);
      }
    }
    /**
     * Returns the light-DOM `<style>` child this element wraps.
     *
     * @export
     * @return {HTMLStyleElement} This element's light-DOM `<style>`
     */


    getStyle() {
      if (this._style) {
        return this._style;
      }

      const style =
      /** @type {HTMLStyleElement} */
      this.querySelector('style');

      if (!style) {
        return null;
      }

      this._style = style;
      /*
      HTML Imports styling the main document are deprecated in Chrome
      https://crbug.com/523952
       If this element is not in the main document, then it must be in an HTML Import document.
      In that case, move the custom style to the main document.
       The ordering of `<bbva-core-custom-style>` should stay the same as when loaded by HTML Imports, but there may be odd
      cases of ordering w.r.t the main document styles.
      */

      if (this.ownerDocument !== window.document) {
        window.document.head.appendChild(this);
      }

      return this._style;
    }

  }

  if (!customElements.get('bbva-core-custom-style')) {
    customElements.define('bbva-core-custom-style', BbvaCoreCustomStyle);
  }

  /* eslint-disable babel/no-unused-expressions */

  if (!window.ShadyCSS || !window.ShadyCSS.ScopingShim) {
    console.warn('ScopingShim not detected. Be sure to add ShadyCSS ScopingShim to your app!');
  }
  const setDocumentCustomStyles = styles => {
    const customStyles = document.createElement('template');
    customStyles.setAttribute('style', 'display: none;');
    customStyles.innerHTML = `
  <bbva-core-custom-style>
    <style>
      ${styles.cssText}
    </style>
  </bbva-core-custom-style>
  `;
    document.head.appendChild(customStyles.content);
  };

  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */

  /**
   * True if the custom elements polyfill is in use.
   */
  const isCEPolyfill = typeof window !== 'undefined' && window.customElements != null && window.customElements.polyfillWrapFlushCallback !== undefined;
  /**
   * Removes nodes, starting from `start` (inclusive) to `end` (exclusive), from
   * `container`.
   */

  const removeNodes = (container, start, end = null) => {
    while (start !== end) {
      const n = start.nextSibling;
      container.removeChild(start);
      start = n;
    }
  };

  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */

  /**
   * An expression marker with embedded unique key to avoid collision with
   * possible text in templates.
   */
  const marker = `{{lit-${String(Math.random()).slice(2)}}}`;
  /**
   * An expression marker used text-positions, multi-binding attributes, and
   * attributes with markup-like text values.
   */

  const nodeMarker = `<!--${marker}-->`;
  const markerRegex = new RegExp(`${marker}|${nodeMarker}`);
  /**
   * Suffix appended to all bound attribute names.
   */

  const boundAttributeSuffix = '$lit$';
  /**
   * An updatable Template that tracks the location of dynamic parts.
   */

  class Template {
    constructor(result, element) {
      this.parts = [];
      this.element = element;
      const nodesToRemove = [];
      const stack = []; // Edge needs all 4 parameters present; IE11 needs 3rd parameter to be null

      const walker = document.createTreeWalker(element.content, 133
      /* NodeFilter.SHOW_{ELEMENT|COMMENT|TEXT} */
      , null, false); // Keeps track of the last index associated with a part. We try to delete
      // unnecessary nodes, but we never want to associate two different parts
      // to the same index. They must have a constant node between.

      let lastPartIndex = 0;
      let index = -1;
      let partIndex = 0;
      const {
        strings,
        values: {
          length
        }
      } = result;

      while (partIndex < length) {
        const node = walker.nextNode();

        if (node === null) {
          // We've exhausted the content inside a nested template element.
          // Because we still have parts (the outer for-loop), we know:
          // - There is a template in the stack
          // - The walker will find a nextNode outside the template
          walker.currentNode = stack.pop();
          continue;
        }

        index++;

        if (node.nodeType === 1
        /* Node.ELEMENT_NODE */
        ) {
            if (node.hasAttributes()) {
              const attributes = node.attributes;
              const {
                length
              } = attributes; // Per
              // https://developer.mozilla.org/en-US/docs/Web/API/NamedNodeMap,
              // attributes are not guaranteed to be returned in document order.
              // In particular, Edge/IE can return them out of order, so we cannot
              // assume a correspondence between part index and attribute index.

              let count = 0;

              for (let i = 0; i < length; i++) {
                if (endsWith(attributes[i].name, boundAttributeSuffix)) {
                  count++;
                }
              }

              while (count-- > 0) {
                // Get the template literal section leading up to the first
                // expression in this attribute
                const stringForPart = strings[partIndex]; // Find the attribute name

                const name = lastAttributeNameRegex.exec(stringForPart)[2]; // Find the corresponding attribute
                // All bound attributes have had a suffix added in
                // TemplateResult#getHTML to opt out of special attribute
                // handling. To look up the attribute value we also need to add
                // the suffix.

                const attributeLookupName = name.toLowerCase() + boundAttributeSuffix;
                const attributeValue = node.getAttribute(attributeLookupName);
                node.removeAttribute(attributeLookupName);
                const statics = attributeValue.split(markerRegex);
                this.parts.push({
                  type: 'attribute',
                  index,
                  name,
                  strings: statics
                });
                partIndex += statics.length - 1;
              }
            }

            if (node.tagName === 'TEMPLATE') {
              stack.push(node);
              walker.currentNode = node.content;
            }
          } else if (node.nodeType === 3
        /* Node.TEXT_NODE */
        ) {
            const data = node.data;

            if (data.indexOf(marker) >= 0) {
              const parent = node.parentNode;
              const strings = data.split(markerRegex);
              const lastIndex = strings.length - 1; // Generate a new text node for each literal section
              // These nodes are also used as the markers for node parts

              for (let i = 0; i < lastIndex; i++) {
                let insert;
                let s = strings[i];

                if (s === '') {
                  insert = createMarker();
                } else {
                  const match = lastAttributeNameRegex.exec(s);

                  if (match !== null && endsWith(match[2], boundAttributeSuffix)) {
                    s = s.slice(0, match.index) + match[1] + match[2].slice(0, -boundAttributeSuffix.length) + match[3];
                  }

                  insert = document.createTextNode(s);
                }

                parent.insertBefore(insert, node);
                this.parts.push({
                  type: 'node',
                  index: ++index
                });
              } // If there's no text, we must insert a comment to mark our place.
              // Else, we can trust it will stick around after cloning.


              if (strings[lastIndex] === '') {
                parent.insertBefore(createMarker(), node);
                nodesToRemove.push(node);
              } else {
                node.data = strings[lastIndex];
              } // We have a part for each match found


              partIndex += lastIndex;
            }
          } else if (node.nodeType === 8
        /* Node.COMMENT_NODE */
        ) {
            if (node.data === marker) {
              const parent = node.parentNode; // Add a new marker node to be the startNode of the Part if any of
              // the following are true:
              //  * We don't have a previousSibling
              //  * The previousSibling is already the start of a previous part

              if (node.previousSibling === null || index === lastPartIndex) {
                index++;
                parent.insertBefore(createMarker(), node);
              }

              lastPartIndex = index;
              this.parts.push({
                type: 'node',
                index
              }); // If we don't have a nextSibling, keep this node so we have an end.
              // Else, we can remove it to save future costs.

              if (node.nextSibling === null) {
                node.data = '';
              } else {
                nodesToRemove.push(node);
                index--;
              }

              partIndex++;
            } else {
              let i = -1;

              while ((i = node.data.indexOf(marker, i + 1)) !== -1) {
                // Comment node has a binding marker inside, make an inactive part
                // The binding won't work, but subsequent bindings will
                // TODO (justinfagnani): consider whether it's even worth it to
                // make bindings in comments work
                this.parts.push({
                  type: 'node',
                  index: -1
                });
                partIndex++;
              }
            }
          }
      } // Remove text binding nodes after the walk to not disturb the TreeWalker


      for (const n of nodesToRemove) {
        n.parentNode.removeChild(n);
      }
    }

  }

  const endsWith = (str, suffix) => {
    const index = str.length - suffix.length;
    return index >= 0 && str.slice(index) === suffix;
  };

  const isTemplatePartActive = part => part.index !== -1; // Allows `document.createComment('')` to be renamed for a
  // small manual size-savings.

  const createMarker = () => document.createComment('');
  /**
   * This regex extracts the attribute name preceding an attribute-position
   * expression. It does this by matching the syntax allowed for attributes
   * against the string literal directly preceding the expression, assuming that
   * the expression is in an attribute-value position.
   *
   * See attributes in the HTML spec:
   * https://www.w3.org/TR/html5/syntax.html#elements-attributes
   *
   * " \x09\x0a\x0c\x0d" are HTML space characters:
   * https://www.w3.org/TR/html5/infrastructure.html#space-characters
   *
   * "\0-\x1F\x7F-\x9F" are Unicode control characters, which includes every
   * space character except " ".
   *
   * So an attribute is:
   *  * The name: any character except a control character, space character, ('),
   *    ("), ">", "=", or "/"
   *  * Followed by zero or more space characters
   *  * Followed by "="
   *  * Followed by zero or more space characters
   *  * Followed by:
   *    * Any character except space, ('), ("), "<", ">", "=", (`), or
   *    * (") then any non-("), or
   *    * (') then any non-(')
   */

  const lastAttributeNameRegex = // eslint-disable-next-line no-control-regex
  /([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F "'>=/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/;

  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */
  const walkerNodeFilter = 133
  /* NodeFilter.SHOW_{ELEMENT|COMMENT|TEXT} */
  ;
  /**
   * Removes the list of nodes from a Template safely. In addition to removing
   * nodes from the Template, the Template part indices are updated to match
   * the mutated Template DOM.
   *
   * As the template is walked the removal state is tracked and
   * part indices are adjusted as needed.
   *
   * div
   *   div#1 (remove) <-- start removing (removing node is div#1)
   *     div
   *       div#2 (remove)  <-- continue removing (removing node is still div#1)
   *         div
   * div <-- stop removing since previous sibling is the removing node (div#1,
   * removed 4 nodes)
   */

  function removeNodesFromTemplate(template, nodesToRemove) {
    const {
      element: {
        content
      },
      parts
    } = template;
    const walker = document.createTreeWalker(content, walkerNodeFilter, null, false);
    let partIndex = nextActiveIndexInTemplateParts(parts);
    let part = parts[partIndex];
    let nodeIndex = -1;
    let removeCount = 0;
    const nodesToRemoveInTemplate = [];
    let currentRemovingNode = null;

    while (walker.nextNode()) {
      nodeIndex++;
      const node = walker.currentNode; // End removal if stepped past the removing node

      if (node.previousSibling === currentRemovingNode) {
        currentRemovingNode = null;
      } // A node to remove was found in the template


      if (nodesToRemove.has(node)) {
        nodesToRemoveInTemplate.push(node); // Track node we're removing

        if (currentRemovingNode === null) {
          currentRemovingNode = node;
        }
      } // When removing, increment count by which to adjust subsequent part indices


      if (currentRemovingNode !== null) {
        removeCount++;
      }

      while (part !== undefined && part.index === nodeIndex) {
        // If part is in a removed node deactivate it by setting index to -1 or
        // adjust the index as needed.
        part.index = currentRemovingNode !== null ? -1 : part.index - removeCount; // go to the next active part.

        partIndex = nextActiveIndexInTemplateParts(parts, partIndex);
        part = parts[partIndex];
      }
    }

    nodesToRemoveInTemplate.forEach(n => n.parentNode.removeChild(n));
  }

  const countNodes = node => {
    let count = node.nodeType === 11
    /* Node.DOCUMENT_FRAGMENT_NODE */
    ? 0 : 1;
    const walker = document.createTreeWalker(node, walkerNodeFilter, null, false);

    while (walker.nextNode()) {
      count++;
    }

    return count;
  };

  const nextActiveIndexInTemplateParts = (parts, startIndex = -1) => {
    for (let i = startIndex + 1; i < parts.length; i++) {
      const part = parts[i];

      if (isTemplatePartActive(part)) {
        return i;
      }
    }

    return -1;
  };
  /**
   * Inserts the given node into the Template, optionally before the given
   * refNode. In addition to inserting the node into the Template, the Template
   * part indices are updated to match the mutated Template DOM.
   */


  function insertNodeIntoTemplate(template, node, refNode = null) {
    const {
      element: {
        content
      },
      parts
    } = template; // If there's no refNode, then put node at end of template.
    // No part indices need to be shifted in this case.

    if (refNode === null || refNode === undefined) {
      content.appendChild(node);
      return;
    }

    const walker = document.createTreeWalker(content, walkerNodeFilter, null, false);
    let partIndex = nextActiveIndexInTemplateParts(parts);
    let insertCount = 0;
    let walkerIndex = -1;

    while (walker.nextNode()) {
      walkerIndex++;
      const walkerNode = walker.currentNode;

      if (walkerNode === refNode) {
        insertCount = countNodes(node);
        refNode.parentNode.insertBefore(node, refNode);
      }

      while (partIndex !== -1 && parts[partIndex].index === walkerIndex) {
        // If we've inserted the node, simply adjust all subsequent parts
        if (insertCount > 0) {
          while (partIndex !== -1) {
            parts[partIndex].index += insertCount;
            partIndex = nextActiveIndexInTemplateParts(parts, partIndex);
          }

          return;
        }

        partIndex = nextActiveIndexInTemplateParts(parts, partIndex);
      }
    }
  }

  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */
  const directives = new WeakMap();
  /**
   * Brands a function as a directive factory function so that lit-html will call
   * the function during template rendering, rather than passing as a value.
   *
   * A _directive_ is a function that takes a Part as an argument. It has the
   * signature: `(part: Part) => void`.
   *
   * A directive _factory_ is a function that takes arguments for data and
   * configuration and returns a directive. Users of directive usually refer to
   * the directive factory as the directive. For example, "The repeat directive".
   *
   * Usually a template author will invoke a directive factory in their template
   * with relevant arguments, which will then return a directive function.
   *
   * Here's an example of using the `repeat()` directive factory that takes an
   * array and a function to render an item:
   *
   * ```js
   * html`<ul><${repeat(items, (item) => html`<li>${item}</li>`)}</ul>`
   * ```
   *
   * When `repeat` is invoked, it returns a directive function that closes over
   * `items` and the template function. When the outer template is rendered, the
   * return directive function is called with the Part for the expression.
   * `repeat` then performs it's custom logic to render multiple items.
   *
   * @param f The directive factory function. Must be a function that returns a
   * function of the signature `(part: Part) => void`. The returned function will
   * be called with the part object.
   *
   * @example
   *
   * import {directive, html} from 'lit-html';
   *
   * const immutable = directive((v) => (part) => {
   *   if (part.value !== v) {
   *     part.setValue(v)
   *   }
   * });
   */

  const directive = f => (...args) => {
    const d = f(...args);
    directives.set(d, true);
    return d;
  };
  const isDirective = o => {
    return typeof o === 'function' && directives.has(o);
  };

  /**
   * @license
   * Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */

  /**
   * A sentinel value that signals that a value was handled by a directive and
   * should not be written to the DOM.
   */
  const noChange = {};
  /**
   * A sentinel value that signals a NodePart to fully clear its content.
   */

  const nothing = {};

  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */
  /**
   * An instance of a `Template` that can be attached to the DOM and updated
   * with new values.
   */

  class TemplateInstance {
    constructor(template, processor, options) {
      this.__parts = [];
      this.template = template;
      this.processor = processor;
      this.options = options;
    }

    update(values) {
      let i = 0;

      for (const part of this.__parts) {
        if (part !== undefined) {
          part.setValue(values[i]);
        }

        i++;
      }

      for (const part of this.__parts) {
        if (part !== undefined) {
          part.commit();
        }
      }
    }

    _clone() {
      // There are a number of steps in the lifecycle of a template instance's
      // DOM fragment:
      //  1. Clone - create the instance fragment
      //  2. Adopt - adopt into the main document
      //  3. Process - find part markers and create parts
      //  4. Upgrade - upgrade custom elements
      //  5. Update - set node, attribute, property, etc., values
      //  6. Connect - connect to the document. Optional and outside of this
      //     method.
      //
      // We have a few constraints on the ordering of these steps:
      //  * We need to upgrade before updating, so that property values will pass
      //    through any property setters.
      //  * We would like to process before upgrading so that we're sure that the
      //    cloned fragment is inert and not disturbed by self-modifying DOM.
      //  * We want custom elements to upgrade even in disconnected fragments.
      //
      // Given these constraints, with full custom elements support we would
      // prefer the order: Clone, Process, Adopt, Upgrade, Update, Connect
      //
      // But Safari does not implement CustomElementRegistry#upgrade, so we
      // can not implement that order and still have upgrade-before-update and
      // upgrade disconnected fragments. So we instead sacrifice the
      // process-before-upgrade constraint, since in Custom Elements v1 elements
      // must not modify their light DOM in the constructor. We still have issues
      // when co-existing with CEv0 elements like Polymer 1, and with polyfills
      // that don't strictly adhere to the no-modification rule because shadow
      // DOM, which may be created in the constructor, is emulated by being placed
      // in the light DOM.
      //
      // The resulting order is on native is: Clone, Adopt, Upgrade, Process,
      // Update, Connect. document.importNode() performs Clone, Adopt, and Upgrade
      // in one step.
      //
      // The Custom Elements v1 polyfill supports upgrade(), so the order when
      // polyfilled is the more ideal: Clone, Process, Adopt, Upgrade, Update,
      // Connect.
      const fragment = isCEPolyfill ? this.template.element.content.cloneNode(true) : document.importNode(this.template.element.content, true);
      const stack = [];
      const parts = this.template.parts; // Edge needs all 4 parameters present; IE11 needs 3rd parameter to be null

      const walker = document.createTreeWalker(fragment, 133
      /* NodeFilter.SHOW_{ELEMENT|COMMENT|TEXT} */
      , null, false);
      let partIndex = 0;
      let nodeIndex = 0;
      let part;
      let node = walker.nextNode(); // Loop through all the nodes and parts of a template

      while (partIndex < parts.length) {
        part = parts[partIndex];

        if (!isTemplatePartActive(part)) {
          this.__parts.push(undefined);

          partIndex++;
          continue;
        } // Progress the tree walker until we find our next part's node.
        // Note that multiple parts may share the same node (attribute parts
        // on a single element), so this loop may not run at all.


        while (nodeIndex < part.index) {
          nodeIndex++;

          if (node.nodeName === 'TEMPLATE') {
            stack.push(node);
            walker.currentNode = node.content;
          }

          if ((node = walker.nextNode()) === null) {
            // We've exhausted the content inside a nested template element.
            // Because we still have parts (the outer for-loop), we know:
            // - There is a template in the stack
            // - The walker will find a nextNode outside the template
            walker.currentNode = stack.pop();
            node = walker.nextNode();
          }
        } // We've arrived at our part's node.


        if (part.type === 'node') {
          const part = this.processor.handleTextExpression(this.options);
          part.insertAfterNode(node.previousSibling);

          this.__parts.push(part);
        } else {
          this.__parts.push(...this.processor.handleAttributeExpressions(node, part.name, part.strings, this.options));
        }

        partIndex++;
      }

      if (isCEPolyfill) {
        document.adoptNode(fragment);
        customElements.upgrade(fragment);
      }

      return fragment;
    }

  }

  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */
  const commentMarker = ` ${marker} `;
  /**
   * The return type of `html`, which holds a Template and the values from
   * interpolated expressions.
   */

  class TemplateResult {
    constructor(strings, values, type, processor) {
      this.strings = strings;
      this.values = values;
      this.type = type;
      this.processor = processor;
    }
    /**
     * Returns a string of HTML used to create a `<template>` element.
     */


    getHTML() {
      const l = this.strings.length - 1;
      let html = '';
      let isCommentBinding = false;

      for (let i = 0; i < l; i++) {
        const s = this.strings[i]; // For each binding we want to determine the kind of marker to insert
        // into the template source before it's parsed by the browser's HTML
        // parser. The marker type is based on whether the expression is in an
        // attribute, text, or comment position.
        //   * For node-position bindings we insert a comment with the marker
        //     sentinel as its text content, like <!--{{lit-guid}}-->.
        //   * For attribute bindings we insert just the marker sentinel for the
        //     first binding, so that we support unquoted attribute bindings.
        //     Subsequent bindings can use a comment marker because multi-binding
        //     attributes must be quoted.
        //   * For comment bindings we insert just the marker sentinel so we don't
        //     close the comment.
        //
        // The following code scans the template source, but is *not* an HTML
        // parser. We don't need to track the tree structure of the HTML, only
        // whether a binding is inside a comment, and if not, if it appears to be
        // the first binding in an attribute.

        const commentOpen = s.lastIndexOf('<!--'); // We're in comment position if we have a comment open with no following
        // comment close. Because <-- can appear in an attribute value there can
        // be false positives.

        isCommentBinding = (commentOpen > -1 || isCommentBinding) && s.indexOf('-->', commentOpen + 1) === -1; // Check to see if we have an attribute-like sequence preceding the
        // expression. This can match "name=value" like structures in text,
        // comments, and attribute values, so there can be false-positives.

        const attributeMatch = lastAttributeNameRegex.exec(s);

        if (attributeMatch === null) {
          // We're only in this branch if we don't have a attribute-like
          // preceding sequence. For comments, this guards against unusual
          // attribute values like <div foo="<!--${'bar'}">. Cases like
          // <!-- foo=${'bar'}--> are handled correctly in the attribute branch
          // below.
          html += s + (isCommentBinding ? commentMarker : nodeMarker);
        } else {
          // For attributes we use just a marker sentinel, and also append a
          // $lit$ suffix to the name to opt-out of attribute-specific parsing
          // that IE and Edge do for style and certain SVG attributes.
          html += s.substr(0, attributeMatch.index) + attributeMatch[1] + attributeMatch[2] + boundAttributeSuffix + attributeMatch[3] + marker;
        }
      }

      html += this.strings[l];
      return html;
    }

    getTemplateElement() {
      const template = document.createElement('template');
      template.innerHTML = this.getHTML();
      return template;
    }

  }

  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */
  const isPrimitive = value => {
    return value === null || !(typeof value === 'object' || typeof value === 'function');
  };
  const isIterable = value => {
    return Array.isArray(value) || // eslint-disable-next-line @typescript-eslint/no-explicit-any
    !!(value && value[Symbol.iterator]);
  };
  /**
   * Writes attribute values to the DOM for a group of AttributeParts bound to a
   * single attribute. The value is only set once even if there are multiple parts
   * for an attribute.
   */

  class AttributeCommitter {
    constructor(element, name, strings) {
      this.dirty = true;
      this.element = element;
      this.name = name;
      this.strings = strings;
      this.parts = [];

      for (let i = 0; i < strings.length - 1; i++) {
        this.parts[i] = this._createPart();
      }
    }
    /**
     * Creates a single part. Override this to create a differnt type of part.
     */


    _createPart() {
      return new AttributePart(this);
    }

    _getValue() {
      const strings = this.strings;
      const l = strings.length - 1;
      let text = '';

      for (let i = 0; i < l; i++) {
        text += strings[i];
        const part = this.parts[i];

        if (part !== undefined) {
          const v = part.value;

          if (isPrimitive(v) || !isIterable(v)) {
            text += typeof v === 'string' ? v : String(v);
          } else {
            for (const t of v) {
              text += typeof t === 'string' ? t : String(t);
            }
          }
        }
      }

      text += strings[l];
      return text;
    }

    commit() {
      if (this.dirty) {
        this.dirty = false;
        this.element.setAttribute(this.name, this._getValue());
      }
    }

  }
  /**
   * A Part that controls all or part of an attribute value.
   */

  class AttributePart {
    constructor(committer) {
      this.value = undefined;
      this.committer = committer;
    }

    setValue(value) {
      if (value !== noChange && (!isPrimitive(value) || value !== this.value)) {
        this.value = value; // If the value is a not a directive, dirty the committer so that it'll
        // call setAttribute. If the value is a directive, it'll dirty the
        // committer if it calls setValue().

        if (!isDirective(value)) {
          this.committer.dirty = true;
        }
      }
    }

    commit() {
      while (isDirective(this.value)) {
        const directive = this.value;
        this.value = noChange;
        directive(this);
      }

      if (this.value === noChange) {
        return;
      }

      this.committer.commit();
    }

  }
  /**
   * A Part that controls a location within a Node tree. Like a Range, NodePart
   * has start and end locations and can set and update the Nodes between those
   * locations.
   *
   * NodeParts support several value types: primitives, Nodes, TemplateResults,
   * as well as arrays and iterables of those types.
   */

  class NodePart {
    constructor(options) {
      this.value = undefined;
      this.__pendingValue = undefined;
      this.options = options;
    }
    /**
     * Appends this part into a container.
     *
     * This part must be empty, as its contents are not automatically moved.
     */


    appendInto(container) {
      this.startNode = container.appendChild(createMarker());
      this.endNode = container.appendChild(createMarker());
    }
    /**
     * Inserts this part after the `ref` node (between `ref` and `ref`'s next
     * sibling). Both `ref` and its next sibling must be static, unchanging nodes
     * such as those that appear in a literal section of a template.
     *
     * This part must be empty, as its contents are not automatically moved.
     */


    insertAfterNode(ref) {
      this.startNode = ref;
      this.endNode = ref.nextSibling;
    }
    /**
     * Appends this part into a parent part.
     *
     * This part must be empty, as its contents are not automatically moved.
     */


    appendIntoPart(part) {
      part.__insert(this.startNode = createMarker());

      part.__insert(this.endNode = createMarker());
    }
    /**
     * Inserts this part after the `ref` part.
     *
     * This part must be empty, as its contents are not automatically moved.
     */


    insertAfterPart(ref) {
      ref.__insert(this.startNode = createMarker());

      this.endNode = ref.endNode;
      ref.endNode = this.startNode;
    }

    setValue(value) {
      this.__pendingValue = value;
    }

    commit() {
      if (this.startNode.parentNode === null) {
        return;
      }

      while (isDirective(this.__pendingValue)) {
        const directive = this.__pendingValue;
        this.__pendingValue = noChange;
        directive(this);
      }

      const value = this.__pendingValue;

      if (value === noChange) {
        return;
      }

      if (isPrimitive(value)) {
        if (value !== this.value) {
          this.__commitText(value);
        }
      } else if (value instanceof TemplateResult) {
        this.__commitTemplateResult(value);
      } else if (value instanceof Node) {
        this.__commitNode(value);
      } else if (isIterable(value)) {
        this.__commitIterable(value);
      } else if (value === nothing) {
        this.value = nothing;
        this.clear();
      } else {
        // Fallback, will render the string representation
        this.__commitText(value);
      }
    }

    __insert(node) {
      this.endNode.parentNode.insertBefore(node, this.endNode);
    }

    __commitNode(value) {
      if (this.value === value) {
        return;
      }

      this.clear();

      this.__insert(value);

      this.value = value;
    }

    __commitText(value) {
      const node = this.startNode.nextSibling;
      value = value == null ? '' : value; // If `value` isn't already a string, we explicitly convert it here in case
      // it can't be implicitly converted - i.e. it's a symbol.

      const valueAsString = typeof value === 'string' ? value : String(value);

      if (node === this.endNode.previousSibling && node.nodeType === 3
      /* Node.TEXT_NODE */
      ) {
          // If we only have a single text node between the markers, we can just
          // set its value, rather than replacing it.
          // TODO(justinfagnani): Can we just check if this.value is primitive?
          node.data = valueAsString;
        } else {
        this.__commitNode(document.createTextNode(valueAsString));
      }

      this.value = value;
    }

    __commitTemplateResult(value) {
      const template = this.options.templateFactory(value);

      if (this.value instanceof TemplateInstance && this.value.template === template) {
        this.value.update(value.values);
      } else {
        // Make sure we propagate the template processor from the TemplateResult
        // so that we use its syntax extension, etc. The template factory comes
        // from the render function options so that it can control template
        // caching and preprocessing.
        const instance = new TemplateInstance(template, value.processor, this.options);

        const fragment = instance._clone();

        instance.update(value.values);

        this.__commitNode(fragment);

        this.value = instance;
      }
    }

    __commitIterable(value) {
      // For an Iterable, we create a new InstancePart per item, then set its
      // value to the item. This is a little bit of overhead for every item in
      // an Iterable, but it lets us recurse easily and efficiently update Arrays
      // of TemplateResults that will be commonly returned from expressions like:
      // array.map((i) => html`${i}`), by reusing existing TemplateInstances.
      // If _value is an array, then the previous render was of an
      // iterable and _value will contain the NodeParts from the previous
      // render. If _value is not an array, clear this part and make a new
      // array for NodeParts.
      if (!Array.isArray(this.value)) {
        this.value = [];
        this.clear();
      } // Lets us keep track of how many items we stamped so we can clear leftover
      // items from a previous render


      const itemParts = this.value;
      let partIndex = 0;
      let itemPart;

      for (const item of value) {
        // Try to reuse an existing part
        itemPart = itemParts[partIndex]; // If no existing part, create a new one

        if (itemPart === undefined) {
          itemPart = new NodePart(this.options);
          itemParts.push(itemPart);

          if (partIndex === 0) {
            itemPart.appendIntoPart(this);
          } else {
            itemPart.insertAfterPart(itemParts[partIndex - 1]);
          }
        }

        itemPart.setValue(item);
        itemPart.commit();
        partIndex++;
      }

      if (partIndex < itemParts.length) {
        // Truncate the parts array so _value reflects the current state
        itemParts.length = partIndex;
        this.clear(itemPart && itemPart.endNode);
      }
    }

    clear(startNode = this.startNode) {
      removeNodes(this.startNode.parentNode, startNode.nextSibling, this.endNode);
    }

  }
  /**
   * Implements a boolean attribute, roughly as defined in the HTML
   * specification.
   *
   * If the value is truthy, then the attribute is present with a value of
   * ''. If the value is falsey, the attribute is removed.
   */

  class BooleanAttributePart {
    constructor(element, name, strings) {
      this.value = undefined;
      this.__pendingValue = undefined;

      if (strings.length !== 2 || strings[0] !== '' || strings[1] !== '') {
        throw new Error('Boolean attributes can only contain a single expression');
      }

      this.element = element;
      this.name = name;
      this.strings = strings;
    }

    setValue(value) {
      this.__pendingValue = value;
    }

    commit() {
      while (isDirective(this.__pendingValue)) {
        const directive = this.__pendingValue;
        this.__pendingValue = noChange;
        directive(this);
      }

      if (this.__pendingValue === noChange) {
        return;
      }

      const value = !!this.__pendingValue;

      if (this.value !== value) {
        if (value) {
          this.element.setAttribute(this.name, '');
        } else {
          this.element.removeAttribute(this.name);
        }

        this.value = value;
      }

      this.__pendingValue = noChange;
    }

  }
  /**
   * Sets attribute values for PropertyParts, so that the value is only set once
   * even if there are multiple parts for a property.
   *
   * If an expression controls the whole property value, then the value is simply
   * assigned to the property under control. If there are string literals or
   * multiple expressions, then the strings are expressions are interpolated into
   * a string first.
   */

  class PropertyCommitter extends AttributeCommitter {
    constructor(element, name, strings) {
      super(element, name, strings);
      this.single = strings.length === 2 && strings[0] === '' && strings[1] === '';
    }

    _createPart() {
      return new PropertyPart(this);
    }

    _getValue() {
      if (this.single) {
        return this.parts[0].value;
      }

      return super._getValue();
    }

    commit() {
      if (this.dirty) {
        this.dirty = false; // eslint-disable-next-line @typescript-eslint/no-explicit-any

        this.element[this.name] = this._getValue();
      }
    }

  }
  class PropertyPart extends AttributePart {} // Detect event listener options support. If the `capture` property is read
  // from the options object, then options are supported. If not, then the third
  // argument to add/removeEventListener is interpreted as the boolean capture
  // value so we should only pass the `capture` property.

  let eventOptionsSupported = false; // Wrap into an IIFE because MS Edge <= v41 does not support having try/catch
  // blocks right into the body of a module

  (() => {
    try {
      const options = {
        get capture() {
          eventOptionsSupported = true;
          return false;
        }

      }; // eslint-disable-next-line @typescript-eslint/no-explicit-any

      window.addEventListener('test', options, options); // eslint-disable-next-line @typescript-eslint/no-explicit-any

      window.removeEventListener('test', options, options);
    } catch (_e) {// event options not supported
    }
  })();

  class EventPart {
    constructor(element, eventName, eventContext) {
      this.value = undefined;
      this.__pendingValue = undefined;
      this.element = element;
      this.eventName = eventName;
      this.eventContext = eventContext;

      this.__boundHandleEvent = e => this.handleEvent(e);
    }

    setValue(value) {
      this.__pendingValue = value;
    }

    commit() {
      while (isDirective(this.__pendingValue)) {
        const directive = this.__pendingValue;
        this.__pendingValue = noChange;
        directive(this);
      }

      if (this.__pendingValue === noChange) {
        return;
      }

      const newListener = this.__pendingValue;
      const oldListener = this.value;
      const shouldRemoveListener = newListener == null || oldListener != null && (newListener.capture !== oldListener.capture || newListener.once !== oldListener.once || newListener.passive !== oldListener.passive);
      const shouldAddListener = newListener != null && (oldListener == null || shouldRemoveListener);

      if (shouldRemoveListener) {
        this.element.removeEventListener(this.eventName, this.__boundHandleEvent, this.__options);
      }

      if (shouldAddListener) {
        this.__options = getOptions(newListener);
        this.element.addEventListener(this.eventName, this.__boundHandleEvent, this.__options);
      }

      this.value = newListener;
      this.__pendingValue = noChange;
    }

    handleEvent(event) {
      if (typeof this.value === 'function') {
        this.value.call(this.eventContext || this.element, event);
      } else {
        this.value.handleEvent(event);
      }
    }

  } // We copy options because of the inconsistent behavior of browsers when reading
  // the third argument of add/removeEventListener. IE11 doesn't support options
  // at all. Chrome 41 only reads `capture` if the argument is an object.

  const getOptions = o => o && (eventOptionsSupported ? {
    capture: o.capture,
    passive: o.passive,
    once: o.once
  } : o.capture);

  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */
  /**
   * The default TemplateFactory which caches Templates keyed on
   * result.type and result.strings.
   */

  function templateFactory(result) {
    let templateCache = templateCaches.get(result.type);

    if (templateCache === undefined) {
      templateCache = {
        stringsArray: new WeakMap(),
        keyString: new Map()
      };
      templateCaches.set(result.type, templateCache);
    }

    let template = templateCache.stringsArray.get(result.strings);

    if (template !== undefined) {
      return template;
    } // If the TemplateStringsArray is new, generate a key from the strings
    // This key is shared between all templates with identical content


    const key = result.strings.join(marker); // Check if we already have a Template for this key

    template = templateCache.keyString.get(key);

    if (template === undefined) {
      // If we have not seen this key before, create a new Template
      template = new Template(result, result.getTemplateElement()); // Cache the Template for this key

      templateCache.keyString.set(key, template);
    } // Cache all future queries for this TemplateStringsArray


    templateCache.stringsArray.set(result.strings, template);
    return template;
  }
  const templateCaches = new Map();

  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */
  const parts = new WeakMap();
  /**
   * Renders a template result or other value to a container.
   *
   * To update a container with new values, reevaluate the template literal and
   * call `render` with the new result.
   *
   * @param result Any value renderable by NodePart - typically a TemplateResult
   *     created by evaluating a template tag like `html` or `svg`.
   * @param container A DOM parent to render to. The entire contents are either
   *     replaced, or efficiently updated if the same result type was previous
   *     rendered there.
   * @param options RenderOptions for the entire render tree rendered to this
   *     container. Render options must *not* change between renders to the same
   *     container, as those changes will not effect previously rendered DOM.
   */

  const render = (result, container, options) => {
    let part = parts.get(container);

    if (part === undefined) {
      removeNodes(container, container.firstChild);
      parts.set(container, part = new NodePart(Object.assign({
        templateFactory
      }, options)));
      part.appendInto(container);
    }

    part.setValue(result);
    part.commit();
  };

  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */
  /**
   * Creates Parts when a template is instantiated.
   */

  class DefaultTemplateProcessor {
    /**
     * Create parts for an attribute-position binding, given the event, attribute
     * name, and string literals.
     *
     * @param element The element containing the binding
     * @param name  The attribute name
     * @param strings The string literals. There are always at least two strings,
     *   event for fully-controlled bindings with a single expression.
     */
    handleAttributeExpressions(element, name, strings, options) {
      const prefix = name[0];

      if (prefix === '.') {
        const committer = new PropertyCommitter(element, name.slice(1), strings);
        return committer.parts;
      }

      if (prefix === '@') {
        return [new EventPart(element, name.slice(1), options.eventContext)];
      }

      if (prefix === '?') {
        return [new BooleanAttributePart(element, name.slice(1), strings)];
      }

      const committer = new AttributeCommitter(element, name, strings);
      return committer.parts;
    }
    /**
     * Create parts for a text-position binding.
     * @param templateFactory
     */


    handleTextExpression(options) {
      return new NodePart(options);
    }

  }
  const defaultTemplateProcessor = new DefaultTemplateProcessor();

  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */
  // This line will be used in regexes to search for lit-html usage.
  // TODO(justinfagnani): inject version number at build time

  if (typeof window !== 'undefined') {
    (window['litHtmlVersions'] || (window['litHtmlVersions'] = [])).push('1.2.1');
  }
  /**
   * Interprets a template literal as an HTML template that can efficiently
   * render to and update a container.
   */


  const html = (strings, ...values) => new TemplateResult(strings, values, 'html', defaultTemplateProcessor);

  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */

  const getTemplateCacheKey = (type, scopeName) => `${type}--${scopeName}`;

  let compatibleShadyCSSVersion = true;

  if (typeof window.ShadyCSS === 'undefined') {
    compatibleShadyCSSVersion = false;
  } else if (typeof window.ShadyCSS.prepareTemplateDom === 'undefined') {
    console.warn(`Incompatible ShadyCSS version detected. ` + `Please update to at least @webcomponents/webcomponentsjs@2.0.2 and ` + `@webcomponents/shadycss@1.3.1.`);
    compatibleShadyCSSVersion = false;
  }
  /**
   * Template factory which scopes template DOM using ShadyCSS.
   * @param scopeName {string}
   */


  const shadyTemplateFactory = scopeName => result => {
    const cacheKey = getTemplateCacheKey(result.type, scopeName);
    let templateCache = templateCaches.get(cacheKey);

    if (templateCache === undefined) {
      templateCache = {
        stringsArray: new WeakMap(),
        keyString: new Map()
      };
      templateCaches.set(cacheKey, templateCache);
    }

    let template = templateCache.stringsArray.get(result.strings);

    if (template !== undefined) {
      return template;
    }

    const key = result.strings.join(marker);
    template = templateCache.keyString.get(key);

    if (template === undefined) {
      const element = result.getTemplateElement();

      if (compatibleShadyCSSVersion) {
        window.ShadyCSS.prepareTemplateDom(element, scopeName);
      }

      template = new Template(result, element);
      templateCache.keyString.set(key, template);
    }

    templateCache.stringsArray.set(result.strings, template);
    return template;
  };

  const TEMPLATE_TYPES = ['html', 'svg'];
  /**
   * Removes all style elements from Templates for the given scopeName.
   */

  const removeStylesFromLitTemplates = scopeName => {
    TEMPLATE_TYPES.forEach(type => {
      const templates = templateCaches.get(getTemplateCacheKey(type, scopeName));

      if (templates !== undefined) {
        templates.keyString.forEach(template => {
          const {
            element: {
              content
            }
          } = template; // IE 11 doesn't support the iterable param Set constructor

          const styles = new Set();
          Array.from(content.querySelectorAll('style')).forEach(s => {
            styles.add(s);
          });
          removeNodesFromTemplate(template, styles);
        });
      }
    });
  };

  const shadyRenderSet = new Set();
  /**
   * For the given scope name, ensures that ShadyCSS style scoping is performed.
   * This is done just once per scope name so the fragment and template cannot
   * be modified.
   * (1) extracts styles from the rendered fragment and hands them to ShadyCSS
   * to be scoped and appended to the document
   * (2) removes style elements from all lit-html Templates for this scope name.
   *
   * Note, <style> elements can only be placed into templates for the
   * initial rendering of the scope. If <style> elements are included in templates
   * dynamically rendered to the scope (after the first scope render), they will
   * not be scoped and the <style> will be left in the template and rendered
   * output.
   */

  const prepareTemplateStyles = (scopeName, renderedDOM, template) => {
    shadyRenderSet.add(scopeName); // If `renderedDOM` is stamped from a Template, then we need to edit that
    // Template's underlying template element. Otherwise, we create one here
    // to give to ShadyCSS, which still requires one while scoping.

    const templateElement = !!template ? template.element : document.createElement('template'); // Move styles out of rendered DOM and store.

    const styles = renderedDOM.querySelectorAll('style');
    const {
      length
    } = styles; // If there are no styles, skip unnecessary work

    if (length === 0) {
      // Ensure prepareTemplateStyles is called to support adding
      // styles via `prepareAdoptedCssText` since that requires that
      // `prepareTemplateStyles` is called.
      //
      // ShadyCSS will only update styles containing @apply in the template
      // given to `prepareTemplateStyles`. If no lit Template was given,
      // ShadyCSS will not be able to update uses of @apply in any relevant
      // template. However, this is not a problem because we only create the
      // template for the purpose of supporting `prepareAdoptedCssText`,
      // which doesn't support @apply at all.
      window.ShadyCSS.prepareTemplateStyles(templateElement, scopeName);
      return;
    }

    const condensedStyle = document.createElement('style'); // Collect styles into a single style. This helps us make sure ShadyCSS
    // manipulations will not prevent us from being able to fix up template
    // part indices.
    // NOTE: collecting styles is inefficient for browsers but ShadyCSS
    // currently does this anyway. When it does not, this should be changed.

    for (let i = 0; i < length; i++) {
      const style = styles[i];
      style.parentNode.removeChild(style);
      condensedStyle.textContent += style.textContent;
    } // Remove styles from nested templates in this scope.


    removeStylesFromLitTemplates(scopeName); // And then put the condensed style into the "root" template passed in as
    // `template`.

    const content = templateElement.content;

    if (!!template) {
      insertNodeIntoTemplate(template, condensedStyle, content.firstChild);
    } else {
      content.insertBefore(condensedStyle, content.firstChild);
    } // Note, it's important that ShadyCSS gets the template that `lit-html`
    // will actually render so that it can update the style inside when
    // needed (e.g. @apply native Shadow DOM case).


    window.ShadyCSS.prepareTemplateStyles(templateElement, scopeName);
    const style = content.querySelector('style');

    if (window.ShadyCSS.nativeShadow && style !== null) {
      // When in native Shadow DOM, ensure the style created by ShadyCSS is
      // included in initially rendered output (`renderedDOM`).
      renderedDOM.insertBefore(style.cloneNode(true), renderedDOM.firstChild);
    } else if (!!template) {
      // When no style is left in the template, parts will be broken as a
      // result. To fix this, we put back the style node ShadyCSS removed
      // and then tell lit to remove that node from the template.
      // There can be no style in the template in 2 cases (1) when Shady DOM
      // is in use, ShadyCSS removes all styles, (2) when native Shadow DOM
      // is in use ShadyCSS removes the style if it contains no content.
      // NOTE, ShadyCSS creates its own style so we can safely add/remove
      // `condensedStyle` here.
      content.insertBefore(condensedStyle, content.firstChild);
      const removes = new Set();
      removes.add(condensedStyle);
      removeNodesFromTemplate(template, removes);
    }
  };
  /**
   * Extension to the standard `render` method which supports rendering
   * to ShadowRoots when the ShadyDOM (https://github.com/webcomponents/shadydom)
   * and ShadyCSS (https://github.com/webcomponents/shadycss) polyfills are used
   * or when the webcomponentsjs
   * (https://github.com/webcomponents/webcomponentsjs) polyfill is used.
   *
   * Adds a `scopeName` option which is used to scope element DOM and stylesheets
   * when native ShadowDOM is unavailable. The `scopeName` will be added to
   * the class attribute of all rendered DOM. In addition, any style elements will
   * be automatically re-written with this `scopeName` selector and moved out
   * of the rendered DOM and into the document `<head>`.
   *
   * It is common to use this render method in conjunction with a custom element
   * which renders a shadowRoot. When this is done, typically the element's
   * `localName` should be used as the `scopeName`.
   *
   * In addition to DOM scoping, ShadyCSS also supports a basic shim for css
   * custom properties (needed only on older browsers like IE11) and a shim for
   * a deprecated feature called `@apply` that supports applying a set of css
   * custom properties to a given location.
   *
   * Usage considerations:
   *
   * * Part values in `<style>` elements are only applied the first time a given
   * `scopeName` renders. Subsequent changes to parts in style elements will have
   * no effect. Because of this, parts in style elements should only be used for
   * values that will never change, for example parts that set scope-wide theme
   * values or parts which render shared style elements.
   *
   * * Note, due to a limitation of the ShadyDOM polyfill, rendering in a
   * custom element's `constructor` is not supported. Instead rendering should
   * either done asynchronously, for example at microtask timing (for example
   * `Promise.resolve()`), or be deferred until the first time the element's
   * `connectedCallback` runs.
   *
   * Usage considerations when using shimmed custom properties or `@apply`:
   *
   * * Whenever any dynamic changes are made which affect
   * css custom properties, `ShadyCSS.styleElement(element)` must be called
   * to update the element. There are two cases when this is needed:
   * (1) the element is connected to a new parent, (2) a class is added to the
   * element that causes it to match different custom properties.
   * To address the first case when rendering a custom element, `styleElement`
   * should be called in the element's `connectedCallback`.
   *
   * * Shimmed custom properties may only be defined either for an entire
   * shadowRoot (for example, in a `:host` rule) or via a rule that directly
   * matches an element with a shadowRoot. In other words, instead of flowing from
   * parent to child as do native css custom properties, shimmed custom properties
   * flow only from shadowRoots to nested shadowRoots.
   *
   * * When using `@apply` mixing css shorthand property names with
   * non-shorthand names (for example `border` and `border-width`) is not
   * supported.
   */


  const render$1 = (result, container, options) => {
    if (!options || typeof options !== 'object' || !options.scopeName) {
      throw new Error('The `scopeName` option is required.');
    }

    const scopeName = options.scopeName;
    const hasRendered = parts.has(container);
    const needsScoping = compatibleShadyCSSVersion && container.nodeType === 11
    /* Node.DOCUMENT_FRAGMENT_NODE */
    && !!container.host; // Handle first render to a scope specially...

    const firstScopeRender = needsScoping && !shadyRenderSet.has(scopeName); // On first scope render, render into a fragment; this cannot be a single
    // fragment that is reused since nested renders can occur synchronously.

    const renderContainer = firstScopeRender ? document.createDocumentFragment() : container;
    render(result, renderContainer, Object.assign({
      templateFactory: shadyTemplateFactory(scopeName)
    }, options)); // When performing first scope render,
    // (1) We've rendered into a fragment so that there's a chance to
    // `prepareTemplateStyles` before sub-elements hit the DOM
    // (which might cause them to render based on a common pattern of
    // rendering in a custom element's `connectedCallback`);
    // (2) Scope the template with ShadyCSS one time only for this scope.
    // (3) Render the fragment into the container and make sure the
    // container knows its `part` is the one we just rendered. This ensures
    // DOM will be re-used on subsequent renders.

    if (firstScopeRender) {
      const part = parts.get(renderContainer);
      parts.delete(renderContainer); // ShadyCSS might have style sheets (e.g. from `prepareAdoptedCssText`)
      // that should apply to `renderContainer` even if the rendered value is
      // not a TemplateInstance. However, it will only insert scoped styles
      // into the document if `prepareTemplateStyles` has already been called
      // for the given scope name.

      const template = part.value instanceof TemplateInstance ? part.value.template : undefined;
      prepareTemplateStyles(scopeName, renderContainer, template);
      removeNodes(container, container.firstChild);
      container.appendChild(renderContainer);
      parts.set(container, part);
    } // After elements have hit the DOM, update styling if this is the
    // initial render to this container.
    // This is needed whenever dynamic changes are made so it would be
    // safest to do every render; however, this would regress performance
    // so we leave it up to the user to call `ShadyCSS.styleElement`
    // for dynamic changes.


    if (!hasRendered && needsScoping) {
      window.ShadyCSS.styleElement(container.host);
    }
  };

  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */
  var _a;
  /**
   * When using Closure Compiler, JSCompiler_renameProperty(property, object) is
   * replaced at compile time by the munged name for object[property]. We cannot
   * alias this function, so we have to use a small shim that has the same
   * behavior when not compiling.
   */


  window.JSCompiler_renameProperty = (prop, _obj) => prop;

  const defaultConverter = {
    toAttribute(value, type) {
      switch (type) {
        case Boolean:
          return value ? '' : null;

        case Object:
        case Array:
          // if the value is `null` or `undefined` pass this through
          // to allow removing/no change behavior.
          return value == null ? value : JSON.stringify(value);
      }

      return value;
    },

    fromAttribute(value, type) {
      switch (type) {
        case Boolean:
          return value !== null;

        case Number:
          return value === null ? null : Number(value);

        case Object:
        case Array:
          return JSON.parse(value);
      }

      return value;
    }

  };
  /**
   * Change function that returns true if `value` is different from `oldValue`.
   * This method is used as the default for a property's `hasChanged` function.
   */

  const notEqual = (value, old) => {
    // This ensures (old==NaN, value==NaN) always returns false
    return old !== value && (old === old || value === value);
  };
  const defaultPropertyDeclaration = {
    attribute: true,
    type: String,
    converter: defaultConverter,
    reflect: false,
    hasChanged: notEqual
  };
  const STATE_HAS_UPDATED = 1;
  const STATE_UPDATE_REQUESTED = 1 << 2;
  const STATE_IS_REFLECTING_TO_ATTRIBUTE = 1 << 3;
  const STATE_IS_REFLECTING_TO_PROPERTY = 1 << 4;
  /**
   * The Closure JS Compiler doesn't currently have good support for static
   * property semantics where "this" is dynamic (e.g.
   * https://github.com/google/closure-compiler/issues/3177 and others) so we use
   * this hack to bypass any rewriting by the compiler.
   */

  const finalized = 'finalized';
  /**
   * Base element class which manages element properties and attributes. When
   * properties change, the `update` method is asynchronously called. This method
   * should be supplied by subclassers to render updates as desired.
   */

  class UpdatingElement extends HTMLElement {
    constructor() {
      super();
      this._updateState = 0;
      this._instanceProperties = undefined; // Initialize to an unresolved Promise so we can make sure the element has
      // connected before first update.

      this._updatePromise = new Promise(res => this._enableUpdatingResolver = res);
      /**
       * Map with keys for any properties that have changed since the last
       * update cycle with previous values.
       */

      this._changedProperties = new Map();
      /**
       * Map with keys of properties that should be reflected when updated.
       */

      this._reflectingProperties = undefined;
      this.initialize();
    }
    /**
     * Returns a list of attributes corresponding to the registered properties.
     * @nocollapse
     */


    static get observedAttributes() {
      // note: piggy backing on this to ensure we're finalized.
      this.finalize();
      const attributes = []; // Use forEach so this works even if for/of loops are compiled to for loops
      // expecting arrays

      this._classProperties.forEach((v, p) => {
        const attr = this._attributeNameForProperty(p, v);

        if (attr !== undefined) {
          this._attributeToPropertyMap.set(attr, p);

          attributes.push(attr);
        }
      });

      return attributes;
    }
    /**
     * Ensures the private `_classProperties` property metadata is created.
     * In addition to `finalize` this is also called in `createProperty` to
     * ensure the `@property` decorator can add property metadata.
     */

    /** @nocollapse */


    static _ensureClassProperties() {
      // ensure private storage for property declarations.
      if (!this.hasOwnProperty(JSCompiler_renameProperty('_classProperties', this))) {
        this._classProperties = new Map(); // NOTE: Workaround IE11 not supporting Map constructor argument.

        const superProperties = Object.getPrototypeOf(this)._classProperties;

        if (superProperties !== undefined) {
          superProperties.forEach((v, k) => this._classProperties.set(k, v));
        }
      }
    }
    /**
     * Creates a property accessor on the element prototype if one does not exist
     * and stores a PropertyDeclaration for the property with the given options.
     * The property setter calls the property's `hasChanged` property option
     * or uses a strict identity check to determine whether or not to request
     * an update.
     *
     * This method may be overridden to customize properties; however,
     * when doing so, it's important to call `super.createProperty` to ensure
     * the property is setup correctly. This method calls
     * `getPropertyDescriptor` internally to get a descriptor to install.
     * To customize what properties do when they are get or set, override
     * `getPropertyDescriptor`. To customize the options for a property,
     * implement `createProperty` like this:
     *
     * static createProperty(name, options) {
     *   options = Object.assign(options, {myOption: true});
     *   super.createProperty(name, options);
     * }
     *
     * @nocollapse
     */


    static createProperty(name, options = defaultPropertyDeclaration) {
      // Note, since this can be called by the `@property` decorator which
      // is called before `finalize`, we ensure storage exists for property
      // metadata.
      this._ensureClassProperties();

      this._classProperties.set(name, options); // Do not generate an accessor if the prototype already has one, since
      // it would be lost otherwise and that would never be the user's intention;
      // Instead, we expect users to call `requestUpdate` themselves from
      // user-defined accessors. Note that if the super has an accessor we will
      // still overwrite it


      if (options.noAccessor || this.prototype.hasOwnProperty(name)) {
        return;
      }

      const key = typeof name === 'symbol' ? Symbol() : `__${name}`;
      const descriptor = this.getPropertyDescriptor(name, key, options);

      if (descriptor !== undefined) {
        Object.defineProperty(this.prototype, name, descriptor);
      }
    }
    /**
     * Returns a property descriptor to be defined on the given named property.
     * If no descriptor is returned, the property will not become an accessor.
     * For example,
     *
     *   class MyElement extends LitElement {
     *     static getPropertyDescriptor(name, key, options) {
     *       const defaultDescriptor =
     *           super.getPropertyDescriptor(name, key, options);
     *       const setter = defaultDescriptor.set;
     *       return {
     *         get: defaultDescriptor.get,
     *         set(value) {
     *           setter.call(this, value);
     *           // custom action.
     *         },
     *         configurable: true,
     *         enumerable: true
     *       }
     *     }
     *   }
     *
     * @nocollapse
     */


    static getPropertyDescriptor(name, key, _options) {
      return {
        // tslint:disable-next-line:no-any no symbol in index
        get() {
          return this[key];
        },

        set(value) {
          const oldValue = this[name];
          this[key] = value;

          this._requestUpdate(name, oldValue);
        },

        configurable: true,
        enumerable: true
      };
    }
    /**
     * Returns the property options associated with the given property.
     * These options are defined with a PropertyDeclaration via the `properties`
     * object or the `@property` decorator and are registered in
     * `createProperty(...)`.
     *
     * Note, this method should be considered "final" and not overridden. To
     * customize the options for a given property, override `createProperty`.
     *
     * @nocollapse
     * @final
     */


    static getPropertyOptions(name) {
      return this._classProperties && this._classProperties.get(name) || defaultPropertyDeclaration;
    }
    /**
     * Creates property accessors for registered properties and ensures
     * any superclasses are also finalized.
     * @nocollapse
     */


    static finalize() {
      // finalize any superclasses
      const superCtor = Object.getPrototypeOf(this);

      if (!superCtor.hasOwnProperty(finalized)) {
        superCtor.finalize();
      }

      this[finalized] = true;

      this._ensureClassProperties(); // initialize Map populated in observedAttributes


      this._attributeToPropertyMap = new Map(); // make any properties
      // Note, only process "own" properties since this element will inherit
      // any properties defined on the superClass, and finalization ensures
      // the entire prototype chain is finalized.

      if (this.hasOwnProperty(JSCompiler_renameProperty('properties', this))) {
        const props = this.properties; // support symbols in properties (IE11 does not support this)

        const propKeys = [...Object.getOwnPropertyNames(props), ...(typeof Object.getOwnPropertySymbols === 'function' ? Object.getOwnPropertySymbols(props) : [])]; // This for/of is ok because propKeys is an array

        for (const p of propKeys) {
          // note, use of `any` is due to TypeSript lack of support for symbol in
          // index types
          // tslint:disable-next-line:no-any no symbol in index
          this.createProperty(p, props[p]);
        }
      }
    }
    /**
     * Returns the property name for the given attribute `name`.
     * @nocollapse
     */


    static _attributeNameForProperty(name, options) {
      const attribute = options.attribute;
      return attribute === false ? undefined : typeof attribute === 'string' ? attribute : typeof name === 'string' ? name.toLowerCase() : undefined;
    }
    /**
     * Returns true if a property should request an update.
     * Called when a property value is set and uses the `hasChanged`
     * option for the property if present or a strict identity check.
     * @nocollapse
     */


    static _valueHasChanged(value, old, hasChanged = notEqual) {
      return hasChanged(value, old);
    }
    /**
     * Returns the property value for the given attribute value.
     * Called via the `attributeChangedCallback` and uses the property's
     * `converter` or `converter.fromAttribute` property option.
     * @nocollapse
     */


    static _propertyValueFromAttribute(value, options) {
      const type = options.type;
      const converter = options.converter || defaultConverter;
      const fromAttribute = typeof converter === 'function' ? converter : converter.fromAttribute;
      return fromAttribute ? fromAttribute(value, type) : value;
    }
    /**
     * Returns the attribute value for the given property value. If this
     * returns undefined, the property will *not* be reflected to an attribute.
     * If this returns null, the attribute will be removed, otherwise the
     * attribute will be set to the value.
     * This uses the property's `reflect` and `type.toAttribute` property options.
     * @nocollapse
     */


    static _propertyValueToAttribute(value, options) {
      if (options.reflect === undefined) {
        return;
      }

      const type = options.type;
      const converter = options.converter;
      const toAttribute = converter && converter.toAttribute || defaultConverter.toAttribute;
      return toAttribute(value, type);
    }
    /**
     * Performs element initialization. By default captures any pre-set values for
     * registered properties.
     */


    initialize() {
      this._saveInstanceProperties(); // ensures first update will be caught by an early access of
      // `updateComplete`


      this._requestUpdate();
    }
    /**
     * Fixes any properties set on the instance before upgrade time.
     * Otherwise these would shadow the accessor and break these properties.
     * The properties are stored in a Map which is played back after the
     * constructor runs. Note, on very old versions of Safari (<=9) or Chrome
     * (<=41), properties created for native platform properties like (`id` or
     * `name`) may not have default values set in the element constructor. On
     * these browsers native properties appear on instances and therefore their
     * default value will overwrite any element default (e.g. if the element sets
     * this.id = 'id' in the constructor, the 'id' will become '' since this is
     * the native platform default).
     */


    _saveInstanceProperties() {
      // Use forEach so this works even if for/of loops are compiled to for loops
      // expecting arrays
      this.constructor._classProperties.forEach((_v, p) => {
        if (this.hasOwnProperty(p)) {
          const value = this[p];
          delete this[p];

          if (!this._instanceProperties) {
            this._instanceProperties = new Map();
          }

          this._instanceProperties.set(p, value);
        }
      });
    }
    /**
     * Applies previously saved instance properties.
     */


    _applyInstanceProperties() {
      // Use forEach so this works even if for/of loops are compiled to for loops
      // expecting arrays
      // tslint:disable-next-line:no-any
      this._instanceProperties.forEach((v, p) => this[p] = v);

      this._instanceProperties = undefined;
    }

    connectedCallback() {
      // Ensure first connection completes an update. Updates cannot complete
      // before connection.
      this.enableUpdating();
    }

    enableUpdating() {
      if (this._enableUpdatingResolver !== undefined) {
        this._enableUpdatingResolver();

        this._enableUpdatingResolver = undefined;
      }
    }
    /**
     * Allows for `super.disconnectedCallback()` in extensions while
     * reserving the possibility of making non-breaking feature additions
     * when disconnecting at some point in the future.
     */


    disconnectedCallback() {}
    /**
     * Synchronizes property values when attributes change.
     */


    attributeChangedCallback(name, old, value) {
      if (old !== value) {
        this._attributeToProperty(name, value);
      }
    }

    _propertyToAttribute(name, value, options = defaultPropertyDeclaration) {
      const ctor = this.constructor;

      const attr = ctor._attributeNameForProperty(name, options);

      if (attr !== undefined) {
        const attrValue = ctor._propertyValueToAttribute(value, options); // an undefined value does not change the attribute.


        if (attrValue === undefined) {
          return;
        } // Track if the property is being reflected to avoid
        // setting the property again via `attributeChangedCallback`. Note:
        // 1. this takes advantage of the fact that the callback is synchronous.
        // 2. will behave incorrectly if multiple attributes are in the reaction
        // stack at time of calling. However, since we process attributes
        // in `update` this should not be possible (or an extreme corner case
        // that we'd like to discover).
        // mark state reflecting


        this._updateState = this._updateState | STATE_IS_REFLECTING_TO_ATTRIBUTE;

        if (attrValue == null) {
          this.removeAttribute(attr);
        } else {
          this.setAttribute(attr, attrValue);
        } // mark state not reflecting


        this._updateState = this._updateState & ~STATE_IS_REFLECTING_TO_ATTRIBUTE;
      }
    }

    _attributeToProperty(name, value) {
      // Use tracking info to avoid deserializing attribute value if it was
      // just set from a property setter.
      if (this._updateState & STATE_IS_REFLECTING_TO_ATTRIBUTE) {
        return;
      }

      const ctor = this.constructor; // Note, hint this as an `AttributeMap` so closure clearly understands
      // the type; it has issues with tracking types through statics
      // tslint:disable-next-line:no-unnecessary-type-assertion

      const propName = ctor._attributeToPropertyMap.get(name);

      if (propName !== undefined) {
        const options = ctor.getPropertyOptions(propName); // mark state reflecting

        this._updateState = this._updateState | STATE_IS_REFLECTING_TO_PROPERTY;
        this[propName] = // tslint:disable-next-line:no-any
        ctor._propertyValueFromAttribute(value, options); // mark state not reflecting

        this._updateState = this._updateState & ~STATE_IS_REFLECTING_TO_PROPERTY;
      }
    }
    /**
     * This private version of `requestUpdate` does not access or return the
     * `updateComplete` promise. This promise can be overridden and is therefore
     * not free to access.
     */


    _requestUpdate(name, oldValue) {
      let shouldRequestUpdate = true; // If we have a property key, perform property update steps.

      if (name !== undefined) {
        const ctor = this.constructor;
        const options = ctor.getPropertyOptions(name);

        if (ctor._valueHasChanged(this[name], oldValue, options.hasChanged)) {
          if (!this._changedProperties.has(name)) {
            this._changedProperties.set(name, oldValue);
          } // Add to reflecting properties set.
          // Note, it's important that every change has a chance to add the
          // property to `_reflectingProperties`. This ensures setting
          // attribute + property reflects correctly.


          if (options.reflect === true && !(this._updateState & STATE_IS_REFLECTING_TO_PROPERTY)) {
            if (this._reflectingProperties === undefined) {
              this._reflectingProperties = new Map();
            }

            this._reflectingProperties.set(name, options);
          }
        } else {
          // Abort the request if the property should not be considered changed.
          shouldRequestUpdate = false;
        }
      }

      if (!this._hasRequestedUpdate && shouldRequestUpdate) {
        this._updatePromise = this._enqueueUpdate();
      }
    }
    /**
     * Requests an update which is processed asynchronously. This should
     * be called when an element should update based on some state not triggered
     * by setting a property. In this case, pass no arguments. It should also be
     * called when manually implementing a property setter. In this case, pass the
     * property `name` and `oldValue` to ensure that any configured property
     * options are honored. Returns the `updateComplete` Promise which is resolved
     * when the update completes.
     *
     * @param name {PropertyKey} (optional) name of requesting property
     * @param oldValue {any} (optional) old value of requesting property
     * @returns {Promise} A Promise that is resolved when the update completes.
     */


    requestUpdate(name, oldValue) {
      this._requestUpdate(name, oldValue);

      return this.updateComplete;
    }
    /**
     * Sets up the element to asynchronously update.
     */


    async _enqueueUpdate() {
      this._updateState = this._updateState | STATE_UPDATE_REQUESTED;

      try {
        // Ensure any previous update has resolved before updating.
        // This `await` also ensures that property changes are batched.
        await this._updatePromise;
      } catch (e) {// Ignore any previous errors. We only care that the previous cycle is
        // done. Any error should have been handled in the previous update.
      }

      const result = this.performUpdate(); // If `performUpdate` returns a Promise, we await it. This is done to
      // enable coordinating updates with a scheduler. Note, the result is
      // checked to avoid delaying an additional microtask unless we need to.

      if (result != null) {
        await result;
      }

      return !this._hasRequestedUpdate;
    }

    get _hasRequestedUpdate() {
      return this._updateState & STATE_UPDATE_REQUESTED;
    }

    get hasUpdated() {
      return this._updateState & STATE_HAS_UPDATED;
    }
    /**
     * Performs an element update. Note, if an exception is thrown during the
     * update, `firstUpdated` and `updated` will not be called.
     *
     * You can override this method to change the timing of updates. If this
     * method is overridden, `super.performUpdate()` must be called.
     *
     * For instance, to schedule updates to occur just before the next frame:
     *
     * ```
     * protected async performUpdate(): Promise<unknown> {
     *   await new Promise((resolve) => requestAnimationFrame(() => resolve()));
     *   super.performUpdate();
     * }
     * ```
     */


    performUpdate() {
      // Mixin instance properties once, if they exist.
      if (this._instanceProperties) {
        this._applyInstanceProperties();
      }

      let shouldUpdate = false;
      const changedProperties = this._changedProperties;

      try {
        shouldUpdate = this.shouldUpdate(changedProperties);

        if (shouldUpdate) {
          this.update(changedProperties);
        } else {
          this._markUpdated();
        }
      } catch (e) {
        // Prevent `firstUpdated` and `updated` from running when there's an
        // update exception.
        shouldUpdate = false; // Ensure element can accept additional updates after an exception.

        this._markUpdated();

        throw e;
      }

      if (shouldUpdate) {
        if (!(this._updateState & STATE_HAS_UPDATED)) {
          this._updateState = this._updateState | STATE_HAS_UPDATED;
          this.firstUpdated(changedProperties);
        }

        this.updated(changedProperties);
      }
    }

    _markUpdated() {
      this._changedProperties = new Map();
      this._updateState = this._updateState & ~STATE_UPDATE_REQUESTED;
    }
    /**
     * Returns a Promise that resolves when the element has completed updating.
     * The Promise value is a boolean that is `true` if the element completed the
     * update without triggering another update. The Promise result is `false` if
     * a property was set inside `updated()`. If the Promise is rejected, an
     * exception was thrown during the update.
     *
     * To await additional asynchronous work, override the `_getUpdateComplete`
     * method. For example, it is sometimes useful to await a rendered element
     * before fulfilling this Promise. To do this, first await
     * `super._getUpdateComplete()`, then any subsequent state.
     *
     * @returns {Promise} The Promise returns a boolean that indicates if the
     * update resolved without triggering another update.
     */


    get updateComplete() {
      return this._getUpdateComplete();
    }
    /**
     * Override point for the `updateComplete` promise.
     *
     * It is not safe to override the `updateComplete` getter directly due to a
     * limitation in TypeScript which means it is not possible to call a
     * superclass getter (e.g. `super.updateComplete.then(...)`) when the target
     * language is ES5 (https://github.com/microsoft/TypeScript/issues/338).
     * This method should be overridden instead. For example:
     *
     *   class MyElement extends LitElement {
     *     async _getUpdateComplete() {
     *       await super._getUpdateComplete();
     *       await this._myChild.updateComplete;
     *     }
     *   }
     */


    _getUpdateComplete() {
      return this._updatePromise;
    }
    /**
     * Controls whether or not `update` should be called when the element requests
     * an update. By default, this method always returns `true`, but this can be
     * customized to control when to update.
     *
     * @param _changedProperties Map of changed properties with old values
     */


    shouldUpdate(_changedProperties) {
      return true;
    }
    /**
     * Updates the element. This method reflects property values to attributes.
     * It can be overridden to render and keep updated element DOM.
     * Setting properties inside this method will *not* trigger
     * another update.
     *
     * @param _changedProperties Map of changed properties with old values
     */


    update(_changedProperties) {
      if (this._reflectingProperties !== undefined && this._reflectingProperties.size > 0) {
        // Use forEach so this works even if for/of loops are compiled to for
        // loops expecting arrays
        this._reflectingProperties.forEach((v, k) => this._propertyToAttribute(k, this[k], v));

        this._reflectingProperties = undefined;
      }

      this._markUpdated();
    }
    /**
     * Invoked whenever the element is updated. Implement to perform
     * post-updating tasks via DOM APIs, for example, focusing an element.
     *
     * Setting properties inside this method will trigger the element to update
     * again after this update cycle completes.
     *
     * @param _changedProperties Map of changed properties with old values
     */


    updated(_changedProperties) {}
    /**
     * Invoked when the element is first updated. Implement to perform one time
     * work on the element after update.
     *
     * Setting properties inside this method will trigger the element to update
     * again after this update cycle completes.
     *
     * @param _changedProperties Map of changed properties with old values
     */


    firstUpdated(_changedProperties) {}

  }
  _a = finalized;
  /**
   * Marks class as having finished creating properties.
   */

  UpdatingElement[_a] = true;

  /**
  @license
  Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
  This code may only be used under the BSD style license found at
  http://polymer.github.io/LICENSE.txt The complete set of authors may be found at
  http://polymer.github.io/AUTHORS.txt The complete set of contributors may be
  found at http://polymer.github.io/CONTRIBUTORS.txt Code distributed by Google as
  part of the polymer project is also subject to an additional IP rights grant
  found at http://polymer.github.io/PATENTS.txt
  */
  const supportsAdoptingStyleSheets = 'adoptedStyleSheets' in Document.prototype && 'replace' in CSSStyleSheet.prototype;
  const constructionToken = Symbol();
  class CSSResult {
    constructor(cssText, safeToken) {
      if (safeToken !== constructionToken) {
        throw new Error('CSSResult is not constructable. Use `unsafeCSS` or `css` instead.');
      }

      this.cssText = cssText;
    } // Note, this is a getter so that it's lazy. In practice, this means
    // stylesheets are not created until the first element instance is made.


    get styleSheet() {
      if (this._styleSheet === undefined) {
        // Note, if `adoptedStyleSheets` is supported then we assume CSSStyleSheet
        // is constructable.
        if (supportsAdoptingStyleSheets) {
          this._styleSheet = new CSSStyleSheet();

          this._styleSheet.replaceSync(this.cssText);
        } else {
          this._styleSheet = null;
        }
      }

      return this._styleSheet;
    }

    toString() {
      return this.cssText;
    }

  }
  /**
   * Wrap a value for interpolation in a css tagged template literal.
   *
   * This is unsafe because untrusted CSS text can be used to phone home
   * or exfiltrate data to an attacker controlled site. Take care to only use
   * this with trusted input.
   */

  const unsafeCSS = value => {
    return new CSSResult(String(value), constructionToken);
  };

  const textFromCSSResult = value => {
    if (value instanceof CSSResult) {
      return value.cssText;
    } else if (typeof value === 'number') {
      return value;
    } else {
      throw new Error(`Value passed to 'css' function must be a 'css' function result: ${value}. Use 'unsafeCSS' to pass non-literal values, but
            take care to ensure page security.`);
    }
  };
  /**
   * Template tag which which can be used with LitElement's `style` property to
   * set element styles. For security reasons, only literal string values may be
   * used. To incorporate non-literal values `unsafeCSS` may be used inside a
   * template string part.
   */


  const css = (strings, ...values) => {
    const cssText = values.reduce((acc, v, idx) => acc + textFromCSSResult(v) + strings[idx + 1], strings[0]);
    return new CSSResult(cssText, constructionToken);
  };

  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */
  // This line will be used in regexes to search for LitElement usage.
  // TODO(justinfagnani): inject version number at build time

  (window['litElementVersions'] || (window['litElementVersions'] = [])).push('2.3.1');
  /**
   * Sentinal value used to avoid calling lit-html's render function when
   * subclasses do not implement `render`
   */

  const renderNotImplemented = {};
  class LitElement extends UpdatingElement {
    /**
     * Return the array of styles to apply to the element.
     * Override this method to integrate into a style management system.
     *
     * @nocollapse
     */
    static getStyles() {
      return this.styles;
    }
    /** @nocollapse */


    static _getUniqueStyles() {
      // Only gather styles once per class
      if (this.hasOwnProperty(JSCompiler_renameProperty('_styles', this))) {
        return;
      } // Take care not to call `this.getStyles()` multiple times since this
      // generates new CSSResults each time.
      // TODO(sorvell): Since we do not cache CSSResults by input, any
      // shared styles will generate new stylesheet objects, which is wasteful.
      // This should be addressed when a browser ships constructable
      // stylesheets.


      const userStyles = this.getStyles();

      if (userStyles === undefined) {
        this._styles = [];
      } else if (Array.isArray(userStyles)) {
        // De-duplicate styles preserving the _last_ instance in the set.
        // This is a performance optimization to avoid duplicated styles that can
        // occur especially when composing via subclassing.
        // The last item is kept to try to preserve the cascade order with the
        // assumption that it's most important that last added styles override
        // previous styles.
        const addStyles = (styles, set) => styles.reduceRight((set, s) => // Note: On IE set.add() does not return the set
        Array.isArray(s) ? addStyles(s, set) : (set.add(s), set), set); // Array.from does not work on Set in IE, otherwise return
        // Array.from(addStyles(userStyles, new Set<CSSResult>())).reverse()


        const set = addStyles(userStyles, new Set());
        const styles = [];
        set.forEach(v => styles.unshift(v));
        this._styles = styles;
      } else {
        this._styles = [userStyles];
      }
    }
    /**
     * Performs element initialization. By default this calls `createRenderRoot`
     * to create the element `renderRoot` node and captures any pre-set values for
     * registered properties.
     */


    initialize() {
      super.initialize();

      this.constructor._getUniqueStyles();

      this.renderRoot = this.createRenderRoot(); // Note, if renderRoot is not a shadowRoot, styles would/could apply to the
      // element's getRootNode(). While this could be done, we're choosing not to
      // support this now since it would require different logic around de-duping.

      if (window.ShadowRoot && this.renderRoot instanceof window.ShadowRoot) {
        this.adoptStyles();
      }
    }
    /**
     * Returns the node into which the element should render and by default
     * creates and returns an open shadowRoot. Implement to customize where the
     * element's DOM is rendered. For example, to render into the element's
     * childNodes, return `this`.
     * @returns {Element|DocumentFragment} Returns a node into which to render.
     */


    createRenderRoot() {
      return this.attachShadow({
        mode: 'open'
      });
    }
    /**
     * Applies styling to the element shadowRoot using the `static get styles`
     * property. Styling will apply using `shadowRoot.adoptedStyleSheets` where
     * available and will fallback otherwise. When Shadow DOM is polyfilled,
     * ShadyCSS scopes styles and adds them to the document. When Shadow DOM
     * is available but `adoptedStyleSheets` is not, styles are appended to the
     * end of the `shadowRoot` to [mimic spec
     * behavior](https://wicg.github.io/construct-stylesheets/#using-constructed-stylesheets).
     */


    adoptStyles() {
      const styles = this.constructor._styles;

      if (styles.length === 0) {
        return;
      } // There are three separate cases here based on Shadow DOM support.
      // (1) shadowRoot polyfilled: use ShadyCSS
      // (2) shadowRoot.adoptedStyleSheets available: use it.
      // (3) shadowRoot.adoptedStyleSheets polyfilled: append styles after
      // rendering


      if (window.ShadyCSS !== undefined && !window.ShadyCSS.nativeShadow) {
        window.ShadyCSS.ScopingShim.prepareAdoptedCssText(styles.map(s => s.cssText), this.localName);
      } else if (supportsAdoptingStyleSheets) {
        this.renderRoot.adoptedStyleSheets = styles.map(s => s.styleSheet);
      } else {
        // This must be done after rendering so the actual style insertion is done
        // in `update`.
        this._needsShimAdoptedStyleSheets = true;
      }
    }

    connectedCallback() {
      super.connectedCallback(); // Note, first update/render handles styleElement so we only call this if
      // connected after first update.

      if (this.hasUpdated && window.ShadyCSS !== undefined) {
        window.ShadyCSS.styleElement(this);
      }
    }
    /**
     * Updates the element. This method reflects property values to attributes
     * and calls `render` to render DOM via lit-html. Setting properties inside
     * this method will *not* trigger another update.
     * @param _changedProperties Map of changed properties with old values
     */


    update(changedProperties) {
      // Setting properties in `render` should not trigger an update. Since
      // updates are allowed after super.update, it's important to call `render`
      // before that.
      const templateResult = this.render();
      super.update(changedProperties); // If render is not implemented by the component, don't call lit-html render

      if (templateResult !== renderNotImplemented) {
        this.constructor.render(templateResult, this.renderRoot, {
          scopeName: this.localName,
          eventContext: this
        });
      } // When native Shadow DOM is used but adoptedStyles are not supported,
      // insert styling after rendering to ensure adoptedStyles have highest
      // priority.


      if (this._needsShimAdoptedStyleSheets) {
        this._needsShimAdoptedStyleSheets = false;

        this.constructor._styles.forEach(s => {
          const style = document.createElement('style');
          style.textContent = s.cssText;
          this.renderRoot.appendChild(style);
        });
      }
    }
    /**
     * Invoked on each update to perform rendering tasks. This method may return
     * any value renderable by lit-html's NodePart - typically a TemplateResult.
     * Setting properties inside this method will *not* trigger the element to
     * update.
     */


    render() {
      return renderNotImplemented;
    }

  }
  /**
   * Ensure this class is marked as `finalized` as an optimization ensuring
   * it will not needlessly try to `finalize`.
   *
   * Note this property name is a string to prevent breaking Closure JS Compiler
   * optimizations. See updating-element.ts for more information.
   */

  LitElement['finalized'] = true;
  /**
   * Render method used to render the value to the element's DOM.
   * @param result The value to render.
   * @param container Node into which to render.
   * @param options Element name.
   * @nocollapse
   */

  LitElement.render = render$1;

  const bbvaCoreDomModule = customElements.get('bbva-core-dom-module');
  const getComponentSharedStyles = id => {
    const domModule = bbvaCoreDomModule.import(id);

    if (domModule && domModule.modulesStyles[id]) {
      const onlyCSSResult = domModule.modulesStyles[id].filter(cssResultObject => cssResultObject.cssText);
      const onlyUnsafeCssResult = unsafeCSS(onlyCSSResult.join(''));
      return css`
      ${onlyUnsafeCssResult}
    `;
    }

    return css``;
  };

  setDocumentCustomStyles(css`
  /* Light */
  @font-face {
    font-family: 'Benton Sans';
    src: url(https://bbva-files.s3.amazonaws.com/cells/assets/coronita/fonts/benton/BentonSansBBVA-Light.woff2)
        format('woff2'),
      url(https://bbva-files.s3.amazonaws.com/cells/assets/coronita/fonts/benton/BentonSansBBVA-Light.woff)
        format('woff');
    font-style: normal;
    font-weight: 300;
    font-display: auto;
  }

  /* Book */
  @font-face {
    font-family: 'Benton Sans';
    src: url(https://bbva-files.s3.amazonaws.com/cells/assets/coronita/fonts/benton/BentonSansBBVA-Book.woff2)
        format('woff2'),
      url(https://bbva-files.s3.amazonaws.com/cells/assets/coronita/fonts/benton/BentonSansBBVA-Book.woff)
        format('woff');
    font-style: normal;
    font-weight: 400;
    font-display: auto;
  }

  /* Book Italic */
  @font-face {
    font-family: 'Benton Sans';
    src: url(https://bbva-files.s3.amazonaws.com/cells/assets/coronita/fonts/benton/BentonSansBBVA-BookItalic.woff2)
        format('woff2'),
      url(https://bbva-files.s3.amazonaws.com/cells/assets/coronita/fonts/benton/BentonSansBBVA-BookItalic.woff)
        format('woff');
    font-style: italic;
    font-weight: 400;
    font-display: auto;
  }

  /* Medium */
  @font-face {
    font-family: 'Benton Sans';
    src: url(https://bbva-files.s3.amazonaws.com/cells/assets/coronita/fonts/benton/BentonSansBBVA-Medium.woff2)
        format('woff2'),
      url(https://bbva-files.s3.amazonaws.com/cells/assets/coronita/fonts/benton/BentonSansBBVA-Medium.woff)
        format('woff');
    font-style: normal;
    font-weight: 500;
    font-display: auto;
  }

  /* Medium Italic */
  @font-face {
    font-family: 'Benton Sans';
    src: url(https://bbva-files.s3.amazonaws.com/cells/assets/coronita/fonts/benton/BentonSansBBVA-MediumItalic.woff2)
        format('woff2'),
      url(https://bbva-files.s3.amazonaws.com/cells/assets/coronita/fonts/benton/BentonSansBBVA-MediumItalic.woff)
        format('woff');
    font-style: italic;
    font-weight: 500;
    font-display: auto;
  }

  /* Regular */
  @font-face {
    font-family: 'Benton Sans';
    src: url(https://bbva-files.s3.amazonaws.com/cells/assets/coronita/fonts/benton/BentonSansBBVA-Regular.woff2)
        format('woff2'),
      url(https://bbva-files.s3.amazonaws.com/cells/assets/coronita/fonts/benton/BentonSansBBVA-Regular.woff)
        format('woff');
    font-style: normal;
    font-weight: 600;
    font-display: auto;
  }

  /* Bold */
  @font-face {
    font-family: 'Benton Sans';
    src: url(https://bbva-files.s3.amazonaws.com/cells/assets/coronita/fonts/benton/BentonSansBBVA-Bold.woff2)
        format('woff2'),
      url(https://bbva-files.s3.amazonaws.com/cells/assets/coronita/fonts/benton/BentonSansBBVA-Bold.woff)
        format('woff');
    font-style: normal;
    font-weight: 700;
    font-display: auto;
  }

  /* Tiempos */
  @font-face {
    font-family: 'Tiempos';
    src: url(https://bbva-files.s3.amazonaws.com/cells/assets/coronita/fonts/tiempos/TiemposText-Regular.woff2)
      format('woff2');
    font-style: normal;
    font-weight: normal;
    font-display: auto;
  }

  @font-face {
    font-family: 'Tiempos';
    src: url(https://bbva-files.s3.amazonaws.com/cells/assets/coronita/fonts/tiempos/TiemposText-RegularItalic.woff2)
      format('woff2');
    font-style: italic;
    font-weight: normal;
    font-display: auto;
  }
`);

  const colors = {
    primaryCore: '#004481',
    // dark background
    primaryCoreDarkened: '#072146',
    primaryCoreLightened: '#ffffff',
    // light background
    primaryCoreDark: '#043263',
    primaryCoreLight: '#1464A5',
    // medium background
    primaryMedium: '#1973B8',
    primaryMediumLight: '#49A5E6',
    primarySubdued: '#5BBEFF',
    primarySubduedLight: '#D4EDFC',
    primaryVariant: '#2DCCCD',
    primaryVariantDark: '#028484',
    primaryVariantMedium: '#02A5A5',
    primaryVariantLight: '#5AC4C4',
    primaryVariantLightened: '#EAF9FA',
    secondary600: '#121212',
    secondary500: '#666666',
    secondary400: '#BDBDBD',
    secondary300: '#D3D3D3',
    secondary200: '#E9E9E9',
    secondary100: '#F4F4F4',
    tertiaryType1: '#DA3851',
    tertiaryType1Dark: '#B92A45',
    tertiaryType1Medium: '#C0475E',
    tertiaryType1Light: '#E77D8E',
    tertiaryType1Lightened: '#F4C3CA',
    tertiaryType2: '#F7893B',
    tertiaryType2Dark: '#C65302',
    tertiaryType2Medium: '#D8732C',
    tertiaryType2Light: '#FAB27F',
    tertiaryType2Lightened: '#FDE7D8',
    tertiaryType3: '#F8CD51',
    tertiaryType3Dark: '#9C6C01',
    tertiaryType3Medium: '#C49735',
    tertiaryType3Light: '#FADE8E',
    tertiaryType3Lightened: '#FEF5DC',
    tertiaryType4: '#D8BE75',
    tertiaryType4Dark: '#8E7022',
    tertiaryType4Medium: '#B79E5E',
    tertiaryType4Light: '#E6D5A5',
    tertiaryType4Lightened: '#F3EBD5',
    tertiaryType5: '#F35E61',
    tertiaryType5Dark: '#CB353A',
    tertiaryType5Medium: '#D44B50',
    tertiaryType5Light: '#F59799',
    tertiaryType5Lightened: '#FCDFDF',
    tertiaryType6: '#48AE64',
    tertiaryType6Dark: '#277A3E',
    tertiaryType6Medium: '#388D4F',
    tertiaryType6Light: '#88CA9A',
    tertiaryType6Lightened: '#D9EFE0',
    tertiaryType7: '#F78BE8',
    tertiaryType7Dark: '#AD53A1',
    tertiaryType7Medium: '#C569B9',
    tertiaryType7Light: '#FAB3F0',
    tertiaryType7Lightened: '#FDDCF8',
    tertiaryType8: '#8F7AE5',
    tertiaryType8Dark: '#6754B8',
    tertiaryType8Medium: '#7C6AC7',
    tertiaryType8Light: '#B6A8EE',
    tertiaryType8Lightened: '#DDD7F7'
  };

  const backgroundColors = {
    light: `${colors.primaryCoreLightened}`,
    light100: `${colors.secondary100}`,
    dark: `${colors.primaryCore}`,
    dark100: `${colors.primaryMedium}`,
    dark200: `${colors.primaryCore}`,
    dark300: `${colors.primaryCoreDark}`,
    dark400: `${colors.primaryCoreDarkened}`
  };

  const typography = {
    type3XLarge: '1.5rem',
    // 24px
    type2XLarge: '1.375rem',
    // 22px
    typeXLarge: '1.25rem',
    // 20px
    typeLarge: '1.125rem',
    // 18px
    typeMedium: '1rem',
    // 16px
    typeSmall: '0.9375rem',
    // 15px
    typeXSmall: '0.875rem',
    // 14px
    type2XSmall: '0.8125rem',
    // 13px
    type3XSmall: '0.75rem',
    // 12px
    type4XSmall: '0.625rem',
    // 10px
    typeQuote: '1.125rem',
    // 18px
    typeLink: '0.9375rem' // 15px

  };

  const lineHeight = {
    type3XLarge: '2rem',
    // 32px
    type2XLarge: '2rem',
    // 32px
    typeXLarge: '1.5rem',
    // 24px
    typeLarge: '1.5rem',
    // 24px
    typeMedium: '1.5rem',
    // 24px
    typeSmall: '1.5rem',
    // 24px
    typeXSmall: '1.5rem',
    // 24px
    type2XSmall: '1.5rem',
    // 24px
    type3XSmall: '1rem',
    // 16px
    type4XSmall: '1rem',
    // 16px
    typeQuote: '1.5rem',
    // 24px
    typeLink: '1rem' // 16px

  };

  const grid = {
    spacer: '8'
  };

  const borderRadius = {
    small: '1px',
    medium: '2px',
    large: '4px'
  };

  const fontFacePrimary = {
    fontFamily: '"Benton Sans"',
    light: {
      fontWeight: 300,
      fontStyle: 'normal'
    },
    book: {
      fontWeight: 400,
      fontStyle: 'normal'
    },
    bookItalic: {
      fontWeight: 400,
      fontStyle: 'italic'
    },
    medium: {
      fontWeight: 500,
      fontStyle: 'normal'
    },
    mediumItalic: {
      fontWeight: 500,
      fontStyle: 'italic'
    },
    regular: {
      fontWeight: 600,
      fontStyle: 'normal'
    },
    bold: {
      fontWeight: 700,
      fontStyle: 'normal'
    }
  };

  const fontFaceSecondary = {
    fontFamily: '"Tiempos"',
    regular: {
      fontWeight: 'normal',
      fontStyle: 'normal'
    },
    regularItalic: {
      fontWeight: 'normal',
      fontStyle: 'italic'
    }
  };

  const boxShadow = {
    type1: '0 1px 3px 0 rgba(18, 18, 18, .2)',
    // #121212 20% opacity
    type2: '0 1px 3px 0 rgba(18, 18, 18, .3)' // #121212 30% opacity

  };

  const setStylesFocus = (selector = '', hostAttribute, notProps, props) => {
    const result = `
     :host(:not(${hostAttribute})) ${selector} {
          ${notProps}
      }
      :host(${hostAttribute}) ${selector} {
          ${props}
      }
  `;
    return css`
    ${unsafeCSS(result)}
  `;
  };

  const bbvaFoundationsStylesFocus = selector => setStylesFocus(selector, '[focus-visible]', `
    outline: none;
  `, `
    outline: ${colors.primaryMedium} solid 1px;
    outline-offset: 4px;
    @apply --bbva-foundations-styles-focus;
  `);

  const statusColors = {
    success: colors.tertiaryType6Dark,
    successDark: colors.tertiaryType6,
    warning: colors.tertiaryType2Dark,
    warningDark: colors.tertiaryType2,
    error: colors.tertiaryType1Dark,
    errorDark: colors.tertiaryType1,
    pending: colors.primaryCore,
    off: colors.secondary500,
    finance: colors.primaryVariantDark
  };

  setDocumentCustomStyles(css`
  html {
    /* Core (BBVA Core Blue)
    /* ---------------------------------------------- */
    --colorsPrimaryCore: ${unsafeCSS(colors.primaryCore)};
    --colorsPrimaryCoreDarkened: ${unsafeCSS(colors.primaryCoreDarkened)};
    --colorsPrimaryCoreLightened: ${unsafeCSS(colors.primaryCoreLightened)};
    --colorsPrimaryCoreDark: ${unsafeCSS(colors.primaryCoreDark)};
    --colorsPrimaryCoreLight: ${unsafeCSS(colors.primaryCoreLight)};

    /* Medium (BBVA Medium Blue)
    /* ---------------------------------------------- */
    --colorsPrimaryMedium: ${unsafeCSS(colors.primaryMedium)};
    --colorsPrimaryMediumLight: ${unsafeCSS(colors.primaryMediumLight)};

    /* Subdued (BBVA Sky Blue)
    /* ---------------------------------------------- */
    --colorsPrimarySubdued: ${unsafeCSS(colors.primarySubdued)};
    --colorsPrimarySubduedLight: ${unsafeCSS(colors.primarySubduedLight)};

    /* Variant (BBVA Aqua Blue)
    /* ---------------------------------------------- */
    --colorsPrimaryVariant: ${unsafeCSS(colors.primaryVariant)};
    --colorsPrimaryVariantDark: ${unsafeCSS(colors.primaryVariantDark)};
    --colorsPrimaryVariantMedium: ${unsafeCSS(colors.primaryVariantMedium)};
    --colorsPrimaryVariantLight: ${unsafeCSS(colors.primaryVariantLight)};
    --colorsPrimaryVariantLightened: ${unsafeCSS(colors.primaryVariantLightened)};

    /* Secondary (BBVA Secondary)
    /* ---------------------------------------------- */
    --colorsSecondary600: ${unsafeCSS(colors.secondary600)};
    --colorsSecondary500: ${unsafeCSS(colors.secondary500)};
    --colorsSecondary400: ${unsafeCSS(colors.secondary400)};
    --colorsSecondary300: ${unsafeCSS(colors.secondary300)};
    --colorsSecondary200: ${unsafeCSS(colors.secondary200)};
    --colorsSecondary100: ${unsafeCSS(colors.secondary100)};

    /* Tertiary (BBVA Tertiary)
    /* ---------------------------------------------- */
    /* Type 1 (BBVA Red)
    /* ---------------------------------------------- */
    --colorsTertiaryType1: ${unsafeCSS(colors.tertiaryType1)};
    --colorsTertiaryType1Dark: ${unsafeCSS(colors.tertiaryType1Dark)};
    --colorsTertiaryType1Medium: ${unsafeCSS(colors.tertiaryType1Medium)};
    --colorsTertiaryType1Light: ${unsafeCSS(colors.tertiaryType1Light)};
    --colorsTertiaryType1Lightened: ${unsafeCSS(colors.tertiaryType1Lightened)};

    /* Type 2 (BBVA Orange)
    /* ---------------------------------------------- */
    --colorsTertiaryType2: ${unsafeCSS(colors.tertiaryType2)};
    --colorsTertiaryType2Dark: ${unsafeCSS(colors.tertiaryType2Dark)};
    --colorsTertiaryType2Medium: ${unsafeCSS(colors.tertiaryType2Medium)};
    --colorsTertiaryType2Light: ${unsafeCSS(colors.tertiaryType2Light)};
    --colorsTertiaryType2Lightened: ${unsafeCSS(colors.tertiaryType2Lightened)};

    /* Type 3 (BBVA Yellow)
    /* ---------------------------------------------- */
    --colorsTertiaryType3: ${unsafeCSS(colors.tertiaryType3)};
    --colorsTertiaryType3Dark: ${unsafeCSS(colors.tertiaryType3Dark)};
    --colorsTertiaryType3Medium: ${unsafeCSS(colors.tertiaryType3Medium)};
    --colorsTertiaryType3Light: ${unsafeCSS(colors.tertiaryType3Light)};
    --colorsTertiaryType3Lightened: ${unsafeCSS(colors.tertiaryType3Lightened)};

    /* Type 4 (BBVA Sand)
    /* ---------------------------------------------- */
    --colorsTertiaryType4: ${unsafeCSS(colors.tertiaryType4)};
    --colorsTertiaryType4Dark: ${unsafeCSS(colors.tertiaryType4Dark)};
    --colorsTertiaryType4Medium: ${unsafeCSS(colors.tertiaryType4Medium)};
    --colorsTertiaryType4Light: ${unsafeCSS(colors.tertiaryType4Light)};
    --colorsTertiaryType4Lightened: ${unsafeCSS(colors.tertiaryType4Lightened)};

    /* Type 5 (BBVA Coral)
    /* ---------------------------------------------- */
    --colorsTertiaryType5: ${unsafeCSS(colors.tertiaryType5)};
    --colorsTertiaryType5Dark: ${unsafeCSS(colors.tertiaryType5Dark)};
    --colorsTertiaryType5Medium: ${unsafeCSS(colors.tertiaryType5Medium)};
    --colorsTertiaryType5Light: ${unsafeCSS(colors.tertiaryType5Light)};
    --colorsTertiaryType5Lightened: ${unsafeCSS(colors.tertiaryType5Lightened)};

    /* Type 6 (BBVA Green)
    /* ---------------------------------------------- */
    --colorsTertiaryType6: ${unsafeCSS(colors.tertiaryType6)};
    --colorsTertiaryType6Dark: ${unsafeCSS(colors.tertiaryType6Dark)};
    --colorsTertiaryType6Medium: ${unsafeCSS(colors.tertiaryType6Medium)};
    --colorsTertiaryType6Light: ${unsafeCSS(colors.tertiaryType6Light)};
    --colorsTertiaryType6Lightened: ${unsafeCSS(colors.tertiaryType6Lightened)};

    /* Type 7 (BBVA Pink)
    /* ---------------------------------------------- */
    --colorsTertiaryType7: ${unsafeCSS(colors.tertiaryType7)};
    --colorsTertiaryType7Dark: ${unsafeCSS(colors.tertiaryType7Dark)};
    --colorsTertiaryType7Medium: ${unsafeCSS(colors.tertiaryType7Medium)};
    --colorsTertiaryType7Light: ${unsafeCSS(colors.tertiaryType7Light)};
    --colorsTertiaryType7Lightened: ${unsafeCSS(colors.tertiaryType7Lightened)};

    /* Type 8 (BBVA Purple)
    /* ---------------------------------------------- */
    --colorsTertiaryType8: ${unsafeCSS(colors.tertiaryType8)};
    --colorsTertiaryType8Dark: ${unsafeCSS(colors.tertiaryType8Dark)};
    --colorsTertiaryType8Medium: ${unsafeCSS(colors.tertiaryType8Medium)};
    --colorsTertiaryType8Light: ${unsafeCSS(colors.tertiaryType8Light)};
    --colorsTertiaryType8Lightened: ${unsafeCSS(colors.tertiaryType8Lightened)};
  }
`);

  setDocumentCustomStyles(css`
  html {
    --backgroundColorsLight: ${unsafeCSS(backgroundColors.light)};
    --backgroundColorsLight100: ${unsafeCSS(backgroundColors.light100)};
    --backgroundColorsDark: ${unsafeCSS(backgroundColors.dark)};
    --backgroundColorsDark100: ${unsafeCSS(backgroundColors.dark100)};
    --backgroundColorsDark200: ${unsafeCSS(backgroundColors.dark200)};
    --backgroundColorsDark300: ${unsafeCSS(backgroundColors.dark300)};
    --backgroundColorsDark400: ${unsafeCSS(backgroundColors.dark400)};
  }
`);

  setDocumentCustomStyles(css`
  html {
    --typographyType3XLarge: ${unsafeCSS(typography.type3XLarge)};
    --typographyType2XLarge: ${unsafeCSS(typography.type2XLarge)};
    --typographyTypeXLarge: ${unsafeCSS(typography.typeXLarge)};
    --typographyTypeLarge: ${unsafeCSS(typography.typeLarge)};
    --typographyTypeMedium: ${unsafeCSS(typography.typeMedium)};
    --typographyTypeSmall: ${unsafeCSS(typography.typeSmall)};
    --typographyTypeXSmall: ${unsafeCSS(typography.typeXSmall)};
    --typographyType2XSmall: ${unsafeCSS(typography.type2XSmall)};
    --typographyType3XSmall: ${unsafeCSS(typography.type3XSmall)};
    --typographyType4XSmall: ${unsafeCSS(typography.type4XSmall)};
    --typographyTypeQuote: ${unsafeCSS(typography.typeQuote)};
    --typographyTypeLink: ${unsafeCSS(typography.typeLink)};
  }
`);

  setDocumentCustomStyles(css`
  html {
    --lineHeightType3XLarge: ${unsafeCSS(lineHeight.type3XLarge)};
    --lineHeightType2XLarge: ${unsafeCSS(lineHeight.type2XLarge)};
    --lineHeightTypeXLarge: ${unsafeCSS(lineHeight.typeXLarge)};
    --lineHeightTypeLarge: ${unsafeCSS(lineHeight.typeLarge)};
    --lineHeightTypeMedium: ${unsafeCSS(lineHeight.typeMedium)};
    --lineHeightTypeSmall: ${unsafeCSS(lineHeight.typeSmall)};
    --lineHeightTypeXSmall: ${unsafeCSS(lineHeight.typeXSmall)};
    --lineHeightType2XSmall: ${unsafeCSS(lineHeight.type2XSmall)};
    --lineHeightType3XSmall: ${unsafeCSS(lineHeight.type3XSmall)};
    --lineHeightType4XSmall: ${unsafeCSS(lineHeight.type4XSmall)};
    --lineHeightTypeQuote: ${unsafeCSS(lineHeight.typeQuote)};
    --lineHeightTypeLink: ${unsafeCSS(lineHeight.typeLink)};
  }
`);

  setDocumentCustomStyles(css`
  html {
    --gridSpacer: ${unsafeCSS(grid.spacer)};
  }
`);

  setDocumentCustomStyles(css`
  html {
    --borderRadiusSmall: ${unsafeCSS(borderRadius.small)};
    --borderRadiusMedium: ${unsafeCSS(borderRadius.medium)};
    --borderRadiusLarge: ${unsafeCSS(borderRadius.large)};
  }
`);

  setDocumentCustomStyles(css`
  html {
    --fontFacePrimaryFontFamily: ${unsafeCSS(fontFacePrimary.fontFamily)};

    --fontFacePrimaryLightFontWeight: ${unsafeCSS(fontFacePrimary.light.fontWeight)};
    --fontFacePrimaryLightFontStyle: ${unsafeCSS(fontFacePrimary.light.fontStyle)};

    --fontFacePrimaryBookFontWeight: ${unsafeCSS(fontFacePrimary.book.fontWeight)};
    --fontFacePrimaryBookFontStyle: ${unsafeCSS(fontFacePrimary.book.fontStyle)};

    --fontFacePrimaryBookItalicFontWeight: ${unsafeCSS(fontFacePrimary.bookItalic.fontWeight)};
    --fontFacePrimaryBookItalicFontStyle: ${unsafeCSS(fontFacePrimary.bookItalic.fontStyle)};

    --fontFacePrimaryMediumFontWeight: ${unsafeCSS(fontFacePrimary.medium.fontWeight)};
    --fontFacePrimaryMediumFontStyle: ${unsafeCSS(fontFacePrimary.medium.fontStyle)};

    --fontFacePrimaryMediumItalicFontWeight: ${unsafeCSS(fontFacePrimary.mediumItalic.fontWeight)};
    --fontFacePrimaryMediumItalicFontStyle: ${unsafeCSS(fontFacePrimary.mediumItalic.fontStyle)};

    --fontFacePrimaryRegularFontWeight: ${unsafeCSS(fontFacePrimary.regular.fontWeight)};
    --fontFacePrimaryRegularFontStyle: ${unsafeCSS(fontFacePrimary.regular.fontStyle)};

    --fontFacePrimaryBoldFontWeight: ${unsafeCSS(fontFacePrimary.bold.fontWeight)};
    --fontFacePrimaryBoldFontStyle: ${unsafeCSS(fontFacePrimary.bold.fontStyle)};
  }
`);

  setDocumentCustomStyles(css`
  html {
    --fontFaceSecondaryFontFamily: ${unsafeCSS(fontFaceSecondary.fontFamily)};

    --fontFaceSecondaryRegularFontWeight: ${unsafeCSS(fontFaceSecondary.regular.fontWeight)};
    --fontFaceSecondaryRegularFontStyle: ${unsafeCSS(fontFaceSecondary.regular.fontStyle)};

    --fontFaceSecondaryRegularItalicFontWeight: ${unsafeCSS(fontFaceSecondary.regularItalic.fontWeight)};
    --fontFaceSecondaryRegularItalicFontStyle: ${unsafeCSS(fontFaceSecondary.regularItalic.fontStyle)};
  }
`);

  setDocumentCustomStyles(css`
  html {
    --boxShadowType1: ${unsafeCSS(boxShadow.type1)};
    --boxShadowType2: ${unsafeCSS(boxShadow.type2)};
  }
`);

  setDocumentCustomStyles(css`
  html {
    --statusColorsSuccess: ${unsafeCSS(statusColors.success)};
    --statusColorsSuccessDark: ${unsafeCSS(statusColors.successDark)};
    --statusColorsWarning: ${unsafeCSS(statusColors.warning)};
    --statusColorsWarningDark: ${unsafeCSS(statusColors.warningDark)};
    --statusColorsError: ${unsafeCSS(statusColors.error)};
    --statusColorsErrorDark: ${unsafeCSS(statusColors.errorDark)};
    --statusColorsPending: ${unsafeCSS(statusColors.pending)};
    --statusColorsOff: ${unsafeCSS(statusColors.off)};
    --statusColorsFinance: ${unsafeCSS(statusColors.finance)};
  }
`);

  /**
  The basic rules and guidelines (the How) that effect everything else in the design system.
  */

  setDocumentCustomStyles(css`
  html {
    font-family: 'Benton Sans', sans-serif;
  }
`);

  /**
   * @license
   * Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */
  const previousValues = new WeakMap();
  /**
   * For AttributeParts, sets the attribute if the value is defined and removes
   * the attribute if the value is undefined.
   *
   * For other part types, this directive is a no-op.
   */

  const ifDefined = directive(value => part => {
    const previousValue = previousValues.get(part);

    if (value === undefined && part instanceof AttributePart) {
      // If the value is undefined, remove the attribute, but only if the value
      // was previously defined.
      if (previousValue !== undefined || !previousValues.has(part)) {
        const name = part.committer.name;
        part.committer.element.removeAttribute(name);
      }
    } else if (value !== previousValue) {
      part.setValue(value);
    }

    previousValues.set(part, value);
  });

  /**
  @license
  Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
  This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
  The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
  The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
  Code distributed by Google as part of the polymer project is also
  subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
  */

  /* eslint-disable no-unused-vars */

  /**
   * When using Closure Compiler, JSCompiler_renameProperty(property, object) is replaced by the munged name for object[property]
   * We cannot alias this function, so we have to use a small shim that has the same behavior when not compiling.
   *
   * @param {string} prop Property name
   * @param {?Object} obj Reference object
   * @return {string} Potentially renamed property name
   */
  window.JSCompiler_renameProperty = function (prop, obj) {
    return prop;
  };

  /**
  @license
  Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
  This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
  The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
  The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
  Code distributed by Google as part of the polymer project is also
  subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
  */

  let dedupeId = 0;
  /* eslint-disable valid-jsdoc */

  /**
   * Wraps an ES6 class expression mixin such that the mixin is only applied
   * if it has not already been applied its base argument. Also memoizes mixin
   * applications.
   *
   * @template T
   * @param {T} mixin ES6 class expression mixin to wrap
   * @return {T}
   * @suppress {invalidCasts}
   */

  const dedupingMixin = function (mixin) {
    let mixinApplications =
    /** @type {!MixinFunction} */
    mixin.__mixinApplications;

    if (!mixinApplications) {
      mixinApplications = new WeakMap();
      /** @type {!MixinFunction} */

      mixin.__mixinApplications = mixinApplications;
    } // maintain a unique id for each mixin


    let mixinDedupeId = dedupeId++;

    function dedupingMixin(base) {
      let baseSet =
      /** @type {!MixinFunction} */
      base.__mixinSet;

      if (baseSet && baseSet[mixinDedupeId]) {
        return base;
      }

      let map = mixinApplications;
      let extended = map.get(base);

      if (!extended) {
        extended =
        /** @type {!Function} */
        mixin(base);
        map.set(base, extended);
      } // copy inherited mixin set from the extended class, or the base class
      // NOTE: we avoid use of Set here because some browser (IE11)
      // cannot extend a base Set via the constructor.


      let mixinSet = Object.create(
      /** @type {!MixinFunction} */
      extended.__mixinSet || baseSet || null);
      mixinSet[mixinDedupeId] = true;
      /** @type {!MixinFunction} */

      extended.__mixinSet = mixinSet;
      return extended;
    }

    return dedupingMixin;
  };
  /* eslint-enable valid-jsdoc */

  /**
  @license
  Copyright © 2016-2018 Component Kitchen, Inc. and contributors to the Elix project

  Permission is hereby granted, free of charge, to any person obtaining a copy of
  this software and associated documentation files (the "Software"), to deal in
  the Software without restriction, including without limitation the rights to
  use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
  the Software, and to permit persons to whom the Software is furnished to do so,
  subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
  FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
  COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
  IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
  CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
  */
  /**
   * Symbol for the `contentSlot` property.
   *
   * [CellsSlotsContentMixin](CellsSlotsContentMixin) uses this to identify which slots
   * elements in the component's shadow tree that holds the component's content.
   * You can override this to return a different slot.
   *
   * @returns {Element[]} Slots contents and slot itself
   */

  const contentSlots = Symbol('contentSlots');
  /**
   * Defines a component's content as the flattened set of nodes assigned to a
   * slot.
   *
   * This helps a component satisfy the Gold Standard checklist item for
   * monitoring
   * [Content Changes](https://github.com/webcomponents/gold-standard/wiki/Content-Changes).
   *
   * By default, the mixin looks in the component's shadow subtree for all `slot` elements.
   * You can specify that a different slot should be used by overriding the `symbols.contentSlots` property.
   *
   * @module CellsSlotsContentMixin
   */

  const CellsSlotsContentMixin = dedupingMixin(Base => {
    return class CellsSlotsContent extends Base {
      constructor() {
        super();
        this.contentSlots = [];
      }

      firstUpdated() {
        super.firstUpdated && super.firstUpdated();
        this.contentSlots = this[contentSlots];
        Array.from(this.contentSlots).filter(Boolean).forEach(contentSlot => {
          contentSlot.addEventListener('slotchange', event => {
            const slotName = contentSlot.name;
            const contents = contentSlot.assignedNodes({
              flatten: true
            });
            const contentsWithNode = [];

            if (contents.length) {
              contents.forEach(content => {
                const nodeTypeIsText = content.nodeType === 3;
                const onlyContentSpaceWhite = !/[^\t\n\r ]/.test(content.textContent);

                if (nodeTypeIsText && !onlyContentSpaceWhite || content.nodeType !== 3) {
                  contentsWithNode.push({
                    'assignedNodes': nodeTypeIsText ? content.textContent.trim() : content,
                    'assignedSlot': content.assignedSlot
                  });
                }
              });
            }

            this.dispatchEvent(new CustomEvent('slotschanges', {
              detail: {
                'slotName': slotName,
                'contentSlots': contentsWithNode,
                'originalEvent': event
              }
            }));
          });
        });
      }
      /**
       * See [contentSlots](symbols#contentSlots).
       * If you want to use a specific slot, override this
       * property and return an array containing the implicated slot.
       */


      get [contentSlots]() {
        const slots = this.shadowRoot && this.shadowRoot.querySelectorAll('slot');

        if (!this.shadowRoot || !slots.length) {
          /* eslint-disable no-console */
          console.warn(`CellsSlotsContentMixin expects ${this.constructor.name} to define a shadow tree that includes a default slot.`);
        }

        return slots;
      }

    };
  });

  /**
  @license
  Copyright © 2016-2018 Component Kitchen, Inc. and contributors to the Elix project

  Permission is hereby granted, free of charge, to any person obtaining a copy of
  this software and associated documentation files (the "Software"), to deal in
  the Software without restriction, including without limitation the rights to
  use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
  the Software, and to permit persons to whom the Software is furnished to do so,
  subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
  FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
  COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
  IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
  CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
  */
  // event since the last mousedown event.

  let keyboardActive = false;
  const focusVisibleChangedListenerKey = Symbol('focusVisibleChangedListener');

  function refreshFocus(element) {
    element.focusVisible = keyboardActive;
  }
  /**
   * Shows a focus indication if and only if the keyboard is active.
   *
   * The keyboard is considered to be active if a keyboard event has occurred
   * since the last mousedown event.
   *
   * This is loosely modeled after the proposed
   * [focus-visible](https://github.com/WICG/focus-visible) feature for CSS.
   *
  * Mixin for focus visible state
  * @module CellsFocusVisibleMixin
  * @mixinFunction
  */


  const CellsFocusVisibleMixin = dedupingMixin(Base => {
    return class CellsFocusVisible extends Base {
      constructor() {
        super(); // We listen to focusin/focusout instead of focus/blur because components
        // like Menu want to handle focus visiblity for the items they contain,
        // and those contained items can get the focus. Using focusin/focusout
        // lets us know whether this element *or any element it contains* has the
        // focus.
        //
        // Focus events are problematic in that they can occur during rendering:
        // if an element with the focus is updated so that its tabindex is
        // removed, it will lose focus. Since these focus handlers need to set
        // state, this could lead to setting state during rendering, which is bad.
        // To avoid this problem, we use promise timing to defer the setting of
        // state.

        this.addEventListener('focusout', () => {
          Promise.resolve().then(() => {
            this.focusVisible = false; // No longer need to listen for changes in focus visibility.

            document.removeEventListener('focus-visible-changed', this[focusVisibleChangedListenerKey]);
            this[focusVisibleChangedListenerKey] = null;
          });
        });
        this.addEventListener('focusin', () => {
          Promise.resolve().then(() => {
            if (this.focusVisible !== keyboardActive) {
              // Show the element as focused if the keyboard has been used.
              this.focusVisible = keyboardActive;
            }

            if (!this[focusVisibleChangedListenerKey]) {
              // Listen to subsequent changes in focus visibility.
              this[focusVisibleChangedListenerKey] = () => refreshFocus(this);

              document.addEventListener('focus-visible-changed', this[focusVisibleChangedListenerKey]);
            }
          });
        });
      }

      get focusVisible() {
        return this._focusVisible;
      }

      set focusVisible(newValue) {
        this._focusVisible = newValue;

        if (newValue) {
          this.setAttribute('focus-visible', '');
        } else {
          this.removeAttribute('focus-visible');
        }
      }

    };
  });

  function updateKeyboardActive(newKeyboardActive) {
    /* istanbul ignore next */
    if (keyboardActive !== newKeyboardActive) {
      keyboardActive = newKeyboardActive;
      const event = new CustomEvent('focus-visible-changed', {
        detail: {
          focusVisible: keyboardActive
        }
      });
      document.dispatchEvent(event);
    }
  } // Listen for top-level keydown and mousedown events.
  // Use capture phase so we detect events even if they're handled.
  // Use JS modules for only once call


  window.addEventListener('keydown', () => {
    updateKeyboardActive(true);
  }, {
    capture: true
  });
  window.addEventListener('mousedown', () => {
    updateKeyboardActive(false);
  }, {
    capture: true
  });

  var styles = css`:host {
  display: block;
  position: relative;
  box-sizing: border-box; }

:host([hidden]), [hidden] {
  display: none !important; }

*, *::before, *::after {
  box-sizing: inherit; }

.slot-select ::slotted(select) {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  opacity: 0;
  z-index: -1;
  pointer-events: none; }

.label {
  display: block;
  margin-bottom: .25rem; }

.button {
  display: block;
  border-radius: 0;
  font: inherit;
  font-size: 1rem;
  line-height: 1.5rem;
  text-align: left;
  padding: .5em 2rem .5rem 1rem;
  height: 3rem;
  width: 100%;
  background: transparent;
  position: relative;
  cursor: pointer;
  border: 1px solid #666;
  border-radius: 2px; }
  .button::-moz-focus-inner {
    border: 0; }
  .button::after {
    content: "";
    width: 0;
    height: 0;
    border-left: .5rem solid transparent;
    border-right: .5rem solid transparent;
    border-top: .5rem solid #aaa;
    position: absolute;
    right: .5rem;
    top: 50%;
    transform: translateY(-50%); }
  .button[aria-expanded="true"]::after {
    border-top: 0;
    border-bottom: .5rem solid #aaa; }
  :host(:not([focus-visible])) .button {
    outline: none; }
  .button[disabled] {
    opacity: .5;
    cursor: default; }
  :host([readonly]) .button {
    cursor: default;
    background-color: #e9e9e9; }
  .button[aria-invalid=true] {
    background-color: #ffdddd; }

.options-layer {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 1;
  width: 100%;
  padding: 1rem 0;
  overflow-y: auto;
  border: 1px solid #aaa;
  border-top: 0;
  background-color: #fff;
  opacity: 0;
  visibility: hidden; }
  .options-layer.opened {
    opacity: 1;
    visibility: visible; }
`;

  var stylesOption = css`@charset "UTF-8";
:host {
  display: block;
  box-sizing: border-box;
  padding: 0 2em 0 1em;
  font-size: 1rem;
  line-height: 1.5rem;
  position: relative;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  cursor: pointer;
  outline: none; }

:host([hidden]), [hidden] {
  display: none !important; }

*, *:before, *:after {
  box-sizing: inherit; }

:host([tabindex='0']) {
  background: #e9e9e9; }

:host([aria-selected=true])::after {
  content: '✔';
  position: absolute;
  right: 0.5em; }

:host([aria-disabled=true]) {
  opacity: .5;
  cursor: default; }
`;

  function uniqueID(length = 6) {
    return `_${Math.random().toString(36).substr(2, length)}`;
  }
  /**
  `CellsSelect` provides a base class as well as a `<cells-select>` and a `<cells-option>` custom elements with select & options functionality similar to native select. It provides an easier and convenient way to build selects with encapsulated HTML & custom styles. As it almost does not provide any styles, it's specially aimed to be extended.

  As native selects, it can communicate with forms in the same document using standard form attributes. It can receive 'name' and 'form' attributes, as well as 'value' in options. It can have a 'disabled' and 'readonly' state, it can be 'required', and it can receive an 'autofocus' attribute to get focus when component is attached to the document.

  ## FocusVisible mixin

  `CellsSelect` uses `FocusVisible mixin` from `@cells-components`. This means you can use the 'focus-visible' attribute on your component to manage ':focus' styles based on user navigation interface (keyboard/pointer).

  ```css
  :host([focus-visible]) .button {
    ...Your focus styles...
  }
  ```

  ## Form communication

  To be able to communicate with **forms in the same document**, a component which extends from `CellsSelect` must implement `_select` getter in its render method.
  ```js
    render() {
      return html`
        <style>${this.constructor.shadyStyles}</style>
        <slot></slot>
        ${this._select}
      `;
    }
  ```

  This way, the component will be able to use the same attributes native buttons have to customize interaction with forms: 'name', 'form', 'value' in options...

  ```html
  <form action="formaction" method="get" target="_self">
    <custom-select name="customSelectName">
      <custom-option value="val1">Value 1</custom-option>
      <custom-option value="val2">Value 2</custom-option>
      <custom-option value="val3">Value 3</custom-option>
    </custom-select>
  </form>
  ```

  @customElement cells-select
  @polymer
  @LitElement
  @demo demo/index.html
  @appliesMixin CellsSlotsContentMixin
  @appliesMixin CellsFocusVisibleMixin
   */


  class CellsSelect extends CellsSlotsContentMixin(CellsFocusVisibleMixin(LitElement)) {
    static get is() {
      return 'cells-select';
    }

    static get properties() {
      return {
        /**
         * Array of options to show, with 'text' and 'value'
         */
        items: {
          type: Array
        },

        /**
         * Label for select
         */
        label: {
          type: String
        },

        /**
         * Current value of select. Must match the value from one of the options
         */
        value: {
          type: String
        },

        /**
         * If true, select is currently disabled
         */
        disabled: {
          type: Boolean
        },

        /**
         * If true, select is required
         */
        required: {
          type: Boolean
        },

        /**
         * If true, select is readonly
         */
        readonly: {
          type: Boolean,
          reflect: true
        },

        /**
         * If true, select is currently invalid
         */
        invalid: {
          type: Boolean
        },

        /**
         * Name for select when relating to form elements
         */
        name: {
          type: String
        },

        /**
         * ID of form element the select is related with
         */
        form: {
          type: String
        },

        /**
         * Index of selected option
         */
        selectedIndex: {
          type: Number,
          attribute: 'selected-index'
        },

        /**
         * Lapse (in ms) for additional keys for focusing/selecting by writing characters
         */
        focusByCharacterTimer: {
          type: Number,
          attribute: 'focus-by-character-timer'
        },

        /**
         * If true, select is currently opened
         */
        opened: {
          type: Boolean
        },
        _formElementId: {
          type: String
        },
        _focusedOption: {
          type: Object
        },
        _selectedOption: {
          type: Object
        }
      };
    }

    constructor() {
      super();
      this.items = [];
      this.name = '';
      this.required = false;
      this.readonly = false;
      this.invalid = false;
      this.focusByCharacterTimer = 1000;
      this.opened = false;
      this._formElementId = uniqueID();
      this._focusedOption = {};
      this._rendered = false;
      this._items = [];
      this._lightNodes = [];
      this._options = [];
      this._filterByCharacter = '';
      this._slotschanges = this._slotschanges.bind(this);
      this._onKeydown = this._onKeydown.bind(this);
      this.addEventListener('slotschanges', this._slotschanges);
      this.addEventListener('keydown', this._onKeydown);
    }
    /**
     * Returns tag name (uppercase) of valid option elements for this select
     * @return {String} Tag name (uppercase) of valid option elements for this select
     */


    static get optionTag() {
      return 'CELLS-OPTION';
    }
    /**
     * Total options length
     * @return {Number} Total options length
     */


    get length() {
      return this._options.length;
    }
    /**
     * Type of select element
     * @return {String} Return 'select-one'
     */


    get type() {
      return this._formElement.type;
    }
    /**
     * Value of currently selected option. If no option is selected, returns an empty string
     * @return {String} Value of currently selected option or empty string
     */


    get value() {
      return this._selectedOption && this._selectedOption.value || '';
    }
    /**
     * Selects option matching provided value; or unselects all if no matches are found
     * @param  {String} value Value to match
     */


    set value(value) {
      this._updateValue(value);
    }

    async _updateValue(value) {
      if (!this._rendered) {
        await this.updateComplete;
      }

      if (this.value !== value) {
        const option = this._options.find(item => item.value === value);

        if (option) {
          this._selectItem(option);
        } else {
          this._unselect();
        }
      }
    }
    /**
     * Returns array of available option elements in select
     * @return {Array} Available option elements in select
     */


    get options() {
      return this._options;
    }
    /**
     * Returns currently selected option in select
     * @return {Object} Currently selected option in select
     */


    get selectedOption() {
      return this._selectedOption;
    }
    /**
     * Returns index of currently selected option
     * @return {Number} Index of currently selected option
     */


    get selectedIndex() {
      return this._selectedIndex;
    }
    /**
     * Selects option with provided index, or unselects them if index does not match any option
     * @param  {Number} index Index of option to select
     */


    set selectedIndex(index) {
      this._updateSelectedIndex(index);
    }

    async _updateSelectedIndex(index) {
      if (!this._rendered) {
        await this.updateComplete;
      }

      const oldIndex = this._selectedIndex;

      if (index !== oldIndex) {
        if (this._options[index]) {
          this._selectItem(this._options[index]);
        } else {
          this._unselect();
        }
      }
    }

    firstUpdated(changedProps) {
      /* istanbul ignore else */
      if (super.firstUpdated) {
        super.firstUpdated(changedProps);
      }

      this._rendered = true;
      this._button = this.shadowRoot.querySelector('#button');
      this._list = this.shadowRoot.querySelector('#list');
      this._formElement = this.shadowRoot.querySelector(`#${this._formElementId}`);
      this._rootNode = this.getRootNode();

      if (this._formElement) {
        this.appendChild(this._formElement);
      }

      if (this.hasAttribute('autofocus')) {
        this.focus();
      }
    }

    updated(changedProps) {
      /* istanbul ignore else */
      if (super.updated) {
        super.updated(changedProps);
      }

      if (changedProps.has('items')) {
        this._items = [...this.shadowRoot.querySelectorAll(this.constructor.optionTag.toLowerCase())];

        this._updateOptions();
      }

      if (changedProps.has('opened')) {
        if (this.opened) {
          const target = this._selectedOption || this._enabledOptions[0];
          target.focused = true;
          setTimeout(() => {
            target.focus();
          }, 0);
        }
      } // if (changedProps.has('_selectedOption')) {
      //   this.invalid = false;
      // }

    }

    static get shadyStyles() {
      return `
      ${styles.cssText}
      ${getComponentSharedStyles('cells-select-shared-styles')}
    `;
    }

    render() {
      return html`
      <style>${this.constructor.shadyStyles}</style>
      ${this._label}
      ${this._control}
      ${this._optionsLayer}
      ${this._select}
    `;
    }

    get _label() {
      return html`
      <span id="label" class="label" aria-hidden="true">${this.label}</span>
    `;
    }

    get _control() {
      return html`
      <button
        id="button"
        class="button"
        ?disabled="${this.disabled}"
        aria-expanded="${this.opened}"
        aria-invalid="${this.invalid}"
        aria-haspopup="listbox"
        aria-labelledby="label button"
        @click="${this._onButtonClick}">
        ${this._controlContent}
      </button>
    `;
    }

    get _controlContent() {
      return html`
      ${this._selectedOption && this._selectedOption.text}
    `;
    }

    get _optionsLayer() {
      return html`
      <div class="options-layer ${this.opened ? 'opened' : ''}">
        ${this._optionsList}
      </div>
    `;
    }

    get _optionsList() {
      return html`
      <div
        id="list"
        class="list"
        role="listbox"
        ?hidden="${false}"
        aria-labelledby="label"
        aria-readonly="${this.readonly}"
        aria-required="${this.required}"
        @click="${this._onOptionClick}"
        @option-change="${this._onOptionChange}"
        @option-focus="${this._onOptionFocus}"
        @focusout="${this._onOptionFocusout}">
        <slot></slot>
        ${this.items.map(item => this._optionItemTemplate(item))}
      </div>
    `;
    }

    _optionItemTemplate(item) {
      return html`
      <cells-option
        ?disabled="${item.disabled}"
        ?selected="${item.selected}"
        .value="${item.value}">${item.text}</cells-option>
    `;
    }

    get _select() {
      return html`
      <span class="slot-select" aria-hidden="true" tabindex="-1">
        <slot name="_select"></slot>
      </span>
      <select
        slot="_select"
        id="${this._formElementId}"
        tabindex="-1"
        name="${this.name}"
        form="${ifDefined(this.form)}"
        ?disabled="${this.disabled}"
        ?required="${this.required}"
        aria-hidden="true"
        @focus="${this.focus}"
        @invalid="${this._onInvalid}">
        <option value="${this.value}">${this.value}</option>
      </select>
    `;
    }
    /**
     * Set focus on control
     */


    focus() {
      this._button.focus();
    }
    /**
     * Returns option with specified index
     */


    item(index) {
      return this._options[index];
    }
    /**
     * Returns option matching provided name or value
     */


    namedItem(value) {
      return this._options.find(option => option.name === value || option.id === value);
    }

    _onButtonClick(ev) {
      if (!this.readonly) {
        this.opened = !this.opened;

        if (!this.opened) {
          this.focus();
        }
      }
    }

    _onOptionClick(ev) {
      const option = ev.composedPath().find(item => item.tagName === this.constructor.optionTag);

      this._selectItem(option, true);

      this.opened = false;
      this.focus();
    }

    _onOptionChange(ev) {
      const target = ev.target;

      if (target !== this._selectedOption && target.selected) {
        this._selectItem(target);
      }
    }

    _onOptionFocus(ev) {
      const focusedOption = this._enabledOptions.find(item => item.focused && item !== ev.target);

      if (focusedOption) {
        focusedOption.focused = false;
      }

      this._focusedOption = ev.target;
    }

    _onOptionFocusout() {
      setTimeout(() => {
        const newFocusedElement = this.shadowRoot.activeElement || this._rootNode.activeElement;

        if (this._options.indexOf(newFocusedElement) < 0) {
          this.opened = false;
        }
      }, 0);
    }

    _onInvalid(ev) {
      this.invalid = true;
      /**
       * Fired when element gets invalid state
       * @event invalid
       */

      this.dispatchEvent(new CustomEvent('invalid'));
    }

    _slotschanges(ev) {
      ev.stopPropagation();
      ev.preventDefault();

      if (ev.detail.slotName === '' && ev.detail.contentSlots.length) {
        const nodes = [];
        ev.detail.contentSlots.forEach((item, index) => {
          if (item.assignedNodes.tagName === this.constructor.optionTag) {
            nodes.push(item.assignedNodes);
          }
        });
        this._lightNodes = nodes;

        this._updateOptions();
      }
    }

    _fireEvents() {
      this.invalid = false;
      /**
       * Fired when user updates selected option
       * @event change
       */

      this.dispatchEvent(new CustomEvent('change', {
        bubbles: true
      }));
    }

    _updateOptions() {
      this._options = this._lightNodes.concat(this._items);
      this._enabledOptions = this._options.filter(item => !item.disabled);

      const selected = this._options.find(item => item.selected);

      if (selected) {
        this._selectItem(selected);
      } else {
        this._unselect();
      }

      this.requestUpdate();
    }

    _selectItem(item, fireEvents) {
      if (item.disabled || item === this._selectedOption) {
        return;
      }

      const index = this._options.indexOf(item);

      if (!this._options[index]) {
        return;
      }

      if (this._selectedOption) {
        this._selectedOption.selected = false;
      }

      if (this._options[index] && !this._options[index].selected) {
        this._options[index].selected = true;
      }

      this._selectedLabel = this._options[index].text;
      this._selectedIndex = index;
      this._selectedOption = this._options[index];

      if (fireEvents) {
        this._fireEvents();
      }
    }

    _unselect() {
      if (this._selectedOption) {
        this._selectedOption.selected = false;
      }

      this._selectedIndex = -1;
      this._selectedOption = this._options[this._selectedIndex];
    }

    _onKeydown(ev) {
      if (ev.key) {
        const key = ev.key.toLowerCase();

        if (/^[a-z0-9*]$/.test(key)) {
          this._focusByCharacter(key);

          return;
        }

        if (this.opened) {
          this._keyAction(ev, key);
        }
      }
    }

    _keyAction(ev, key) {
      switch (key) {
        case 'escape':
          ev.preventDefault();
          this.opened = false;
          this.focus();
          return;

        case 'enter':
        case ' ':
          ev.preventDefault();

          this._selectItem(this._options.find(item => item.focused), true);

          this.opened = false;
          this.focus();
          return;

        case 'arrowdown':
        case 'arrowup':
          ev.preventDefault();

          if (this._enabledOptions.length > 1) {
            this._focusByArrow(key);

            return;
          }

        case 'home':
        case 'end':
        case 'pageup':
        case 'pagedown':
          ev.preventDefault();

          if (this._enabledOptions.length > 0) {
            const item = key === 'home' || key === 'pageup' ? 0 : this._enabledOptions.length - 1;

            const focusedOption = this._enabledOptions.find(item => item.focused);

            if (focusedOption) {
              focusedOption.focused = false;
            }

            this._enabledOptions[item].focused = true;
            return;
          }

      }
    }

    _focusByCharacter(key) {
      clearTimeout(this._focusByCharacterTimer);
      this._focusByCharacterTimer = setTimeout(() => {
        this._filterByCharacter = '';
      }, this.focusByCharacterTimer);
      const newFilter = `${this._filterByCharacter}${key}`;

      const filteredOptions = this._enabledOptions.filter(item => {
        return item.text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').indexOf(newFilter) === 0;
      });

      if (filteredOptions.length) {
        if (this.opened) {
          filteredOptions[0].focused = true;
        } else if (filteredOptions[0] !== this._selectedOption) {
          this._selectItem(filteredOptions[0], true);
        }
      }

      this._filterByCharacter = newFilter;
    }

    _focusByArrow(key) {
      const focusedOption = this._enabledOptions.find(item => item.focused);

      const lastItemIndex = this._enabledOptions.length - 1;
      const keyAdvance = key === 'arrowdown';

      if (!focusedOption) {
        const index = keyAdvance ? 0 : lastItemIndex;
        this._enabledOptions[index].focused = true;
        return;
      }

      const focusedIndex = this._enabledOptions.indexOf(focusedOption);

      const validMovement = keyAdvance ? focusedIndex < lastItemIndex : focusedIndex > 0;

      if (validMovement) {
        focusedOption.focused = false;
        const newIndex = keyAdvance ? focusedIndex + 1 : focusedIndex - 1;
        this._enabledOptions[newIndex].focused = true;
      }
    }

  }
  window.customElements.define(CellsSelect.is, CellsSelect);
  /**
  `cells-option` is a custom element aimed to be used inside `cells-select` custom elements. It provides similar functionality to native 'option' tags, but it can provide its own styling and properties. So, it's specially aimed to be extended for encapsulating styles.
   */

  class CellsOption extends LitElement {
    static get is() {
      return 'cells-option';
    }

    static get properties() {
      return {
        /**
         * Name for option
         */
        name: {
          type: String
        },

        /**
         * If true, option is disabled
         */
        disabled: {
          type: Boolean
        },

        /**
         * If true, option is selected
         */
        selected: {
          type: Boolean
        },

        /**
         * Value for option
         */
        value: {
          type: String
        },

        /**
         * If true, option is focused
         */
        focused: {
          type: Boolean
        }
      };
    }

    get text() {
      return this.textContent;
    }

    constructor() {
      super();
      this.disabled = false;
      this.selected = false;
      this.focused = false;
      this.addEventListener('mouseenter', this._onMouseEnter.bind(this));
      this.addEventListener('mouseleave', this._onMouseLeave.bind(this));
    }

    connectedCallback() {
      super.connectedCallback();
      this.setAttribute('role', 'option');
    }

    updated(changedProps) {
      /* istanbul ignore else */
      if (super.updated) {
        super.updated(changedProps);
      }

      if (changedProps.has('disabled')) {
        this.setAttribute('aria-disabled', this.disabled.toString());
      }

      if (changedProps.has('selected')) {
        this.setAttribute('aria-selected', this.selected.toString());
      }

      if (changedProps.has('selected') || changedProps.has('value')) {
        /**
         * Fired when selected or value changes
         * @event option-change
         */
        this.dispatchEvent(new CustomEvent('option-change', {
          bubbles: true,
          detail: {
            selected: this.selected,
            disabled: this.disabled,
            value: this.value
          }
        }));
      }

      if (changedProps.has('focused')) {
        this.setAttribute('tabindex', this.focused ? '0' : '-1');

        if (this.focused) {
          this.focus();
          /**
           * Fired when focused is set to true
           * @event option-focus
           */

          this.dispatchEvent(new CustomEvent('option-focus', {
            bubbles: true
          }));
        }
      }
    }

    static get shadyStyles() {
      return `
      ${stylesOption.cssText}
      ${getComponentSharedStyles('cells-option-shared-styles')}
    `;
    }

    render() {
      return html`
      <style>${this.constructor.shadyStyles}</style>
      <span><slot></slot></span>
    `;
    }

    _onMouseEnter() {
      if (!this.disabled) {
        this.focused = true;
      }
    }

    _onMouseLeave() {
      this.focused = false;
    }

  }
  window.customElements.define(CellsOption.is, CellsOption);

  /**
  `BbvaCoreMeta` is based on Polymer's `iron-meta`, and it is a generic class you can use for sharing information across the
  DOM tree. It uses [monostate pattern](http://c2.com/cgi/wiki?MonostatePattern)
  such that any instance of it has access to the shared information.
  You can use `BbvaCoreMeta` to share whatever you want.

  The `BbvaCoreMeta` instances contain your actual data.
  The only requirement is that you create them before you try to access them.
  */
  class BbvaCoreMeta {
    constructor(options) {
      this.type = options && options.type || 'default';
      this.key = options && options.key;
      BbvaCoreMeta.classFieldTypes(); // https://developers.google.com/web/updates/2018/12/class-fields

      if (options && 'value' in options) {
        this.value = options.value;
      }
    }
    /**
     * Sets types property if it does not exist.
     */


    static classFieldTypes() {
      if (this.types) {
        return;
      }

      this.types = {};
    }
    /**
     * Returns value of instance key and type
     */


    get value() {
      const {
        type
      } = this;
      const key = this._key || this.key;
      this._key = undefined;

      if (type && key) {
        return BbvaCoreMeta.types[type] && BbvaCoreMeta.types[type][key];
      }

      return undefined;
    }
    /**
     * Sets value to instance type and key
     * @param {*} key Value to set
     */


    set value(value) {
      let {
        type
      } = this;
      const {
        key
      } = this;

      if (type && key) {
        BbvaCoreMeta.types[type] = BbvaCoreMeta.types[type] || {};
        type = BbvaCoreMeta.types[type];

        if (value === null) {
          delete type[key];
        } else {
          type[key] = value;
        }
      }
    }
    /**
     * Returns list of keys of instance type
     */


    get list() {
      const {
        type
      } = this;

      if (type) {
        const itemsType = BbvaCoreMeta.types[type];

        if (itemsType) {
          return Object.keys(itemsType).map(itemType => itemsType[itemType], this);
        }

        return [];
      }

      return undefined;
    }
    /**
     * Returns value of provided key
     * @param {*} key
     */


    byKey(key) {
      this._key = key;
      return this.value;
    }

  }

  /**

  `cells-iron-meta` is based on Polymer's `iron-meta` is a generic element you can use for sharing information across the
  DOM tree. It uses [monostate pattern](http://c2.com/cgi/wiki?MonostatePattern)
  such that any instance of iron-meta has access to the shared information.
  You can use `cells-iron-meta` to share whatever you want.

  The `cells-iron-meta` instances containing your actual data.
  The only requirement is that you create them before you try to access them.

  Examples:


  */

  class CellsIronMeta extends BbvaCoreMeta {}

  var styles$1 = css`:host {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  position: relative;
  vertical-align: middle;
  fill: var(--cells-icon-fill-color, currentcolor);
  stroke: var(--cells-icon-stroke-color, none);
  width: var(--cells-icon-width, var(--cells-icon-size, var(--cells-icon-svg-width, 1.5rem)));
  height: var(--cells-icon-height, var(--cells-icon-size, var(--cells-icon-svg-height, 1.5rem)));
  @apply --cells-icon; }

:host([hidden]), [hidden] {
  display: none !important; }
`;

  /**

  This component displays an icon. It is based on Polymer's [iron-icon](https://www.webcomponents.org/element/@polymer/iron-icon) element.
  By default an icon renders as a 24px square.

  You can use an image as icon, or use icons from an imported iconset.

  ```html
    <cells-icon src="demo/location.png"></cells-icon>
    <cells-icon icon="coronita:close"></cells-icon>
  ```

  ## Icons

  Since this component uses icons, it will need an [iconset](https://platform.bbva.com/en-us/developers/engines/cells/documentation/cells-architecture/components/components-in-depth/icons) in your project as an application level dependency. In fact, this component uses an iconset in its demo.

  ## Styling

  The following custom properties and mixins are available for styling:

  ### Custom Properties
  | Custom Property           | Selector | CSS Property | Value                                           |
  |:--------------------------|:---------|:-------------|:------------------------------------------------|
  | --cells-icon-fill-color   | :host    | fill         | currentcolor                                    |
  | --cells-icon-stroke-color | :host    | stroke       | none                                            |
  | --cells-icon-width        | :host    | width        | var(--cells-icon-size, --cells-icon-svg-width)  |
  | --cells-icon-height       | :host    | height       | var(--cells-icon-size, --cells-icon-svg-height) |
  ### @apply
  | Mixins       | Selector | Value |
  | ------------ | -------- | ----- |
  | --cells-icon | :host    | {}    |

   * @customElement
   * @litElement
   * @polymer
   * @demo demo/index.html
   * @extends {LitElement}
   */

  class CellsIcon extends LitElement {
    static get is() {
      return 'cells-icon';
    }

    static get shadyStyles() {
      return `
      ${styles$1.cssText}
      ${getComponentSharedStyles('cells-icon-shared-styles').cssText}
    `;
    }

    render() {
      return html`
      <style>${this.constructor.shadyStyles}</style>
      <slot></slot>
    `;
    }

    static get properties() {
      return {
        /**
         * The name of the icon to use. The name should be of the form:
         * `iconset_name:icon_name`.
         */
        icon: {
          type: String
        },

        /**
         * The name of the theme to use, if one is specified by the iconset.
         */
        theme: {
          type: String
        },

        /**
         * If using iron-icon without an iconset, you can set the src to be
         * the URL of an individual icon image file.
         */
        src: {
          type: String
        },

        /**
         * Size (in px) for the icon
         */
        size: {
          type: Number
        },

        /**
         * Width for icons
         */
        width: {
          type: Number
        },

        /**
         * Height for icons
         */
        height: {
          type: Number
        },
        _isAttached: {
          type: Boolean
        }
      };
    }

    constructor() {
      super();
      this._iconsetListenerCallback = this._updateIcon.bind(this);
      this._meta = new CellsIronMeta({
        type: 'iconset'
      });
    }

    connectedCallback() {
      super.connectedCallback();
      this._isAttached = true;
    }

    disconnectedCallback() {
      super.disconnectedCallback();
      this._isAttached = false;
    }

    get _DEFAULT_ICONSET() {
      return 'icons';
    }

    updated(changedProps) {
      if (changedProps.has('_meta') || changedProps.has('theme') || changedProps.has('_isAttached')) {
        this._updateIcon();
      }

      if (changedProps.has('src') || changedProps.has('_isAttached')) {
        this._srcChanged(this.src);
      }

      if (changedProps.has('icon') || changedProps.has('_isAttached')) {
        this._iconChanged(this.icon);
      }

      if (changedProps.has('size')) {
        this.style.setProperty('--cells-icon-size', this.size / 16 + 'rem');
      }

      if (changedProps.has('width')) {
        this.style.setProperty('--cells-icon-svg-width', this.width / 16 + 'rem');
      }

      if (changedProps.has('height')) {
        this.style.setProperty('--cells-icon-svg-height', this.height / 16 + 'rem');
      }
    }

    _iconChanged(icon) {
      if (icon === undefined || icon === 'undefined') {
        return;
      }

      var parts = (icon || '').split(':');
      this._iconName = parts.pop();
      this._iconsetName = parts.pop() || this._DEFAULT_ICONSET;

      this._updateIcon();
    }

    _srcChanged() {
      this._updateIcon();
    }

    _usesIconset() {
      return this.icon || !this.src;
    }

    _updateIcon() {
      if (this._usesIconset()) {
        if (this._img && this._img.parentNode) {
          this.removeChild(this._img);
        }

        if (this._iconName === '') {
          if (this._iconset) {
            this._iconset.removeIcon(this);
          }
        } else if (this._iconsetName && this._meta) {
          this._iconset =
          /** @type {?Polymer.Iconset} */
          this._meta.byKey(this._iconsetName);

          if (this._iconset) {
            this._iconset.applyIcon(this, this._iconName, this.theme);

            window.removeEventListener('iron-iconset-added', this._iconsetListenerCallback);
          } else {
            window.addEventListener('iron-iconset-added', this._iconsetListenerCallback);
          }
        }
      } else {
        if (this._iconset) {
          this._iconset.removeIcon(this);
        }

        if (!this._img) {
          this._img = document.createElement('img');
          this._img.style.width = '100%';
          this._img.style.height = '100%';
          this._img.draggable = false;
        }

        this._img.src = this.src;
        this.appendChild(this._img);
      }
    }

  }
  customElements.define(CellsIcon.is, CellsIcon);

  var styles$2 = css`:host {
  --_select-bg-color: var(--bbva-form-select-bg-color, var(--colorsSecondary100, ${unsafeCSS(colors.secondary100)}));
  --_select-border-color: var(--bbva-form-select-border-color, var(--colorsSecondary500, ${unsafeCSS(colors.secondary500)}));
  --_select-readonly-border-color: var(--bbva-form-select-readonly-border-color, var(--colorsSecondary500, ${unsafeCSS(colors.secondary500)}));
  --_select-button-color: var(--bbva-form-select-button-color, var(--colorsSecondary600, ${unsafeCSS(colors.secondary600)}));
  --_select-readonly-button-color: var(--bbva-form-select-readonly-button-color, var(--colorsSecondary500, ${unsafeCSS(colors.secondary500)}));
  --_select-label-color: var(--bbva-form-select-label-color, var(--colorsSecondary500, ${unsafeCSS(colors.secondary500)}));
  --_select-filled-label-color: var(--bbva-form-select-filled-label-color, var(--colorsSecondary500, ${unsafeCSS(colors.secondary500)}));
  --_select-readonly-label-color: var(--bbva-form-select-readonly-label-color, var(--colorsSecondary500, ${unsafeCSS(colors.secondary500)}));
  --_select-icon-color: var(--bbva-form-select-icon-color, var(--colorsPrimaryMedium, ${unsafeCSS(colors.primaryMedium)}));
  --_select-readonly-icon-color: var(--bbva-form-select-readonly-icon-color, var(--colorsSecondary500, ${unsafeCSS(colors.secondary500)}));
  --_message-color: var(--bbva-form-select-message-color, var(--colorsSecondary600, ${unsafeCSS(colors.secondary600)}));
  --_message-icon-color: var(--bbva-form-select-message-icon-color, var(--colorsTertiaryType1Dark, ${unsafeCSS(colors.tertiaryType1Dark)}));
  --_info-message-color: var(--bbva-form-select-info-message-color, var(--colorsSecondary500, ${unsafeCSS(colors.secondary500)}));
  --_info-message-icon-color: var(--bbva-form-select-info-message-icon-color, var(--colorsPrimarySubdued, ${unsafeCSS(colors.primarySubdued)}));
  --_invalid-select-bg-color: var(--bbva-form-select-invalid-bg-color, var(--colorsTertiaryType5Lightened, ${unsafeCSS(colors.tertiaryType5Lightened)}));
  --_invalid-select-border-color: var(--bbva-form-select-invalid-border-color, var(--colorsTertiaryType5Medium, ${unsafeCSS(colors.tertiaryType5Medium)}));
  --_invalid-select-label-color: var(--bbva-form-select-invalid-label-color, var(--colorsTertiaryType1Dark, ${unsafeCSS(colors.tertiaryType1Dark)}));
  --_invalid-select-icon-color: var(--bbva-form-select-invalid-icon-color, var(--colorsTertiaryType1Dark, ${unsafeCSS(colors.tertiaryType1Dark)}));
  display: block;
  box-sizing: border-box;
  position: relative;
  @apply --bbva-form-select; }

:host([hidden]), [hidden] {
  display: none !important; }

*, *::before, *::after {
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

.slot-select ::slotted(select) {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  opacity: 0;
  z-index: -1;
  pointer-events: none;
  @apply --bbva-form-select-select; }

.button {
  position: relative;
  width: 100%;
  height: 3rem;
  font-family: inherit;
  font-size: var(--typographyTypeSmall, ${unsafeCSS(typography.typeSmall)});
  line-height: var(--lineHeightTypeSmall, ${unsafeCSS(lineHeight.typeSmall)});
  font-weight: var(--fontFacePrimaryBookFontWeight, ${unsafeCSS(fontFacePrimary.book.fontWeight)});
  background-color: var(--_select-bg-color);
  color: var(--_select-button-color);
  border: none;
  border-bottom: 1px solid var(--_select-border-color);
  border-radius: 1px;
  margin: 0;
  outline: none;
  padding: 0;
  cursor: pointer;
  text-align: left;
  @apply --bbva-form-select-button; }
  .button::-moz-focus-inner {
    border: 0; }
  .button[aria-invalid=true] {
    background-color: var(--_invalid-select-bg-color);
    border-bottom-color: var(--_invalid-select-border-color);
    @apply --bbva-form-select-invalid-button; }
  .button[disabled] {
    opacity: .4;
    cursor: default;
    @apply --bbva-form-select-disabled-button; }
  :host([readonly]) .button {
    color: var(--_select-readonly-button-color);
    border-bottom-color: var(--_select-readonly-border-color);
    cursor: default;
    @apply --bbva-form-select-readonly-button; }
  .button-content {
    display: flex;
    align-items: center;
    height: 100%;
    @apply --bbva-form-select-button-content; }
  .button-clip {
    flex: none;
    max-width: 3rem;
    margin-left: calc(((2 * var(--gridSpacerVariant, var(--gridSpacer, ${unsafeCSS(grid.spacer)}))) / 16) * 1rem);
    display: flex;
    align-items: center;
    @apply --bbva-form-select-button-clip; }
  .button-text {
    flex: auto;
    position: relative;
    height: 100%;
    padding: calc(((2.5 * var(--gridSpacerVariant, var(--gridSpacer, ${unsafeCSS(grid.spacer)}))) / 15) * 1em) 0 calc(((0.5 * var(--gridSpacerVariant, var(--gridSpacer, ${unsafeCSS(grid.spacer)}))) / 15) * 1em);
    margin-left: calc(((2 * var(--gridSpacerVariant, var(--gridSpacer, ${unsafeCSS(grid.spacer)}))) / 16) * 1rem);
    min-width: 0;
    @apply --bbva-form-select-button-text; }
  .button-icon {
    flex: none;
    margin-right: calc(((0.5 * var(--gridSpacerVariant, var(--gridSpacer, ${unsafeCSS(grid.spacer)}))) / 16) * 1rem);
    width: 3rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--_select-icon-color);
    @apply --bbva-form-select-button-icon; }
    [aria-invalid=true] .button-icon {
      color: var(--_invalid-select-icon-color);
      @apply --bbva-form-select-invalid-button-icon; }
    :host([readonly]) .button-icon {
      color: var(--_select-readonly-icon-color);
      @apply --bbva-form-select-readonly-button-icon; }

.label {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  color: var(--_select-label-color);
  will-change: transform;
  transform: translateY(calc(((1.5 * var(--gridSpacerVariant, var(--gridSpacer, ${unsafeCSS(grid.spacer)}))) / 16) * 1rem));
  transform-origin: top left;
  transition: transform .2s ease-in-out;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  @apply --bbva-form-select-label; }
  [aria-invalid=true] .label {
    color: var(--_invalid-select-label-color);
    @apply --bbva-form-select-invalid-label; }
  :host([filled]) .label {
    width: 125%;
    color: var(--_select-filled-label-color);
    transform: translateY(calc(((0.3 * var(--gridSpacerVariant, var(--gridSpacer, ${unsafeCSS(grid.spacer)}))) / 16) * 1rem)) scale(0.8);
    transition: transform .2s ease-in-out;
    @apply --bbva-form-select-filled-label; }
  :host([readonly]) .label {
    color: var(--_select-readonly-label-color);
    @apply --bbva-form-select-readonly-label; }

.content {
  display: flex;
  @apply --bbva-form-select-content; }
  .content-text {
    flex: auto;
    min-width: 0;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    @apply --bbva-form-select-content-text; }
  .content-value {
    flex: none;
    margin-left: calc(((1 * var(--gridSpacerVariant, var(--gridSpacer, ${unsafeCSS(grid.spacer)}))) / 16) * 1rem);
    @apply --bbva-form-select-content-value; }

.options-layer {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  opacity: 0;
  visibility: hidden;
  transition: opacity .2s, visibility 0s .2s;
  @apply --bbva-form-select-options-layer; }
  .options-layer.opened {
    opacity: 1;
    visibility: visible;
    transition: opacity .2s, visibility 0s 0s;
    @apply --bbva-form-select-opened-options-layer; }

.options-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0.95;
  background-color: var(--colorsPrimaryCoreDarkened, ${unsafeCSS(colors.primaryCoreDarkened)});
  @apply --bbva-form-select-options-overlay; }

.options-gradient {
  position: relative;
  max-width: 18rem;
  width: 100%;
  @apply --bbva-form-select-options-gradient; }
  .options-gradient::before, .options-gradient::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    height: 2.5rem;
    @apply --bbva-form-select-options-gradient-element; }
  .options-gradient::before {
    top: 0;
    background: linear-gradient(to bottom, var(--colorsPrimaryCoreLightened, ${unsafeCSS(colors.primaryCoreLightened)}), rgba(255, 255, 255, 0));
    @apply --bbva-form-select-options-gradient-top-element; }
  .options-gradient::after {
    bottom: 0;
    background: linear-gradient(to top, var(--colorsPrimaryCoreLightened, ${unsafeCSS(colors.primaryCoreLightened)}), rgba(255, 255, 255, 0));
    @apply --bbva-form-select-options-gradient-bottom-element; }

.options-wrapper {
  overflow-y: auto;
  min-height: 14rem;
  max-height: 29rem;
  padding: 2.5rem 0;
  background-color: var(--colorsPrimaryCoreLightened, ${unsafeCSS(colors.primaryCoreLightened)});
  box-shadow: 0 1px 1px 0 rgba(18, 18, 18, 0.2);
  border-radius: 1px;
  @apply --bbva-form-select-options-wrapper; }

.message {
  padding: calc(((1 * var(--gridSpacerVariant, var(--gridSpacer, ${unsafeCSS(grid.spacer)}))) / 16) * 1rem) calc(((2 * var(--gridSpacerVariant, var(--gridSpacer, ${unsafeCSS(grid.spacer)}))) / 16) * 1rem) 0;
  display: flex;
  align-items: center;
  font-size: var(--typographyType3XSmall, ${unsafeCSS(typography.type3XSmall)});
  line-height: var(--lineHeightType3XSmall, ${unsafeCSS(lineHeight.type3XSmall)});
  color: var(--_message-color);
  @apply --bbva-form-select-message; }
  .message.info {
    color: var(--_info-message-color);
    @apply --bbva-form-select-info-message; }
  .message-icon {
    margin-right: calc(((1 * var(--gridSpacerVariant, var(--gridSpacer, ${unsafeCSS(grid.spacer)}))) / 16) * 1rem);
    color: var(--_message-icon-color);
    @apply --bbva-form-select-message-icon; }
    .info .message-icon {
      color: var(--_info-message-icon-color);
      @apply --bbva-form-select-info-message-icon; }

@media (min-width: 600px) {
  .options-layer {
    position: absolute;
    top: 3rem;
    bottom: auto;
    display: block;
    padding: 0;
    transition: none;
    @apply --bbva-form-select-dt-options-layer; }
    .options-layer.opened {
      transition: none;
      @apply --bbva-form-select-dt-opened-options-layer; }
  .options-overlay {
    display: none;
    @apply --bbva-form-select-dt-options-overlay; }
  .options-gradient {
    max-width: none;
    @apply --bbva-form-select-dt-options-gradient; }
    .options-gradient::before, .options-gradient::after {
      display: none;
      @apply --bbva-form-select-dt-options-gradient-element; }
  .options-wrapper {
    padding: 0;
    max-height: none;
    min-height: 9rem;
    box-shadow: var(--boxShadowType1, ${unsafeCSS(boxShadow.type1)});
    @apply --bbva-form-select-dt-options-wrapper; } }
`;

  var stylesOption$1 = css`:host {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  padding: 0 calc(((2 * var(--gridSpacerVariant, var(--gridSpacer, ${unsafeCSS(grid.spacer)}))) / 16) * 1rem);
  font-size: var(--typographyTypeSmall, ${unsafeCSS(typography.typeSmall)});
  line-height: var(--lineHeightTypeSmall, ${unsafeCSS(lineHeight.typeSmall)});
  font-weight: var(--fontFacePrimaryBookFontWeight, ${unsafeCSS(fontFacePrimary.book.fontWeight)});
  font-style: var(--fontFacePrimaryBookFontStyle, ${unsafeCSS(fontFacePrimary.book.fontStyle)});
  color: var(--bbva-form-option-color, var(--colorsSecondary600, ${unsafeCSS(colors.secondary600)}));
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  cursor: pointer;
  outline: none;
  @apply --bbva-form-option; }

:host([hidden]), [hidden] {
  display: none !important; }

*, *::before, *::after {
  box-sizing: inherit; }

.clip {
  flex: none;
  @apply --bbva-form-option-clip; }
  .clip ::slotted(*) {
    margin-right: calc(((2 * var(--gridSpacerVariant, var(--gridSpacer, ${unsafeCSS(grid.spacer)}))) / 16) * 1rem);
    @apply --bbva-form-option-clip-slotted; }

.text {
  flex: auto;
  margin: 0.75rem 0;
  min-width: 0;
  white-space: normal;
  @apply --bbva-form-option-text; }

.icon {
  flex: none;
  margin-left: calc(((2 * var(--gridSpacerVariant, var(--gridSpacer, ${unsafeCSS(grid.spacer)}))) / 16) * 1rem);
  @apply --bbva-form-option-icon; }

:host([tabindex='0']) {
  position: relative;
  background-color: var(--colorsPrimaryCore, ${unsafeCSS(colors.primaryCore)});
  color: var(--colorsPrimaryCoreLightened, ${unsafeCSS(colors.primaryCoreLightened)});
  z-index: 1;
  @apply --bbva-form-option-focused; }

:host([aria-disabled=true]) {
  opacity: .4;
  cursor: default;
  @apply --bbva-form-option-disabled; }
`;

  css`[ambient^=light] {
  --bbva-form-select-bg-color: var(--colorsSecondary100, ${unsafeCSS(colors.secondary100)});
  --bbva-form-select-border-color: var(--colorsSecondary500, ${unsafeCSS(colors.secondary500)});
  --bbva-form-select-readonly-border-color: var(--colorsSecondary500, ${unsafeCSS(colors.secondary500)});
  --bbva-form-select-button-color: var(--colorsSecondary600, ${unsafeCSS(colors.secondary600)});
  --bbva-form-select-readonly-button-color: var(--colorsSecondary500, ${unsafeCSS(colors.secondary500)});
  --bbva-form-select-label-color: var(--colorsSecondary500, ${unsafeCSS(colors.secondary500)});
  --bbva-form-select-filled-label-color: var(--colorsSecondary500, ${unsafeCSS(colors.secondary500)});
  --bbva-form-select-readonly-label-color: var(--colorsSecondary500, ${unsafeCSS(colors.secondary500)});
  --bbva-form-select-icon-color: var(--colorsPrimaryMedium, ${unsafeCSS(colors.primaryMedium)});
  --bbva-form-select-readonly-icon-color: var(--colorsSecondary500, ${unsafeCSS(colors.secondary500)});
  --bbva-form-select-message-color: var(--colorsSecondary600, ${unsafeCSS(colors.secondary600)});
  --bbva-form-select-message-icon-color: var(--colorsTertiaryType1Dark, ${unsafeCSS(colors.tertiaryType1Dark)});
  --bbva-form-select-info-message-color: var(--colorsSecondary500, ${unsafeCSS(colors.secondary500)});
  --bbva-form-select-info-message-icon-color: var(--colorsPrimarySubdued, ${unsafeCSS(colors.primarySubdued)});
  --bbva-form-select-invalid-bg-color: var(--colorsTertiaryType5Lightened, ${unsafeCSS(colors.tertiaryType5Lightened)});
  --bbva-form-select-invalid-border-color: var(--colorsTertiaryType5Medium, ${unsafeCSS(colors.tertiaryType5Medium)});
  --bbva-form-select-invalid-label-color: var(--colorsTertiaryType1Dark, ${unsafeCSS(colors.tertiaryType1Dark)});
  --bbva-form-select-invalid-icon-color: var(--colorsTertiaryType1Dark, ${unsafeCSS(colors.tertiaryType1Dark)}); }

[ambient=light100] {
  --bbva-form-select-bg-color: var(--colorsPrimaryCoreLightened, ${unsafeCSS(colors.primaryCoreLightened)}); }
`;

  css`[ambient^=dark] {
  --bbva-form-select-bg-color: #0A5393;
  --bbva-form-select-border-color: var(--colorsPrimaryCoreLightened, ${unsafeCSS(colors.primaryCoreLightened)});
  --bbva-form-select-readonly-border-color: var(--colorsSecondary100, ${unsafeCSS(colors.secondary100)});
  --bbva-form-select-button-color: var(--colorsPrimaryCoreLightened, ${unsafeCSS(colors.primaryCoreLightened)});
  --bbva-form-select-readonly-button-color: var(--colorsSecondary300, ${unsafeCSS(colors.secondary300)});
  --bbva-form-select-label-color: var(--colorsPrimaryCoreLightened, ${unsafeCSS(colors.primaryCoreLightened)});
  --bbva-form-select-filled-label-color: var(--colorsSecondary100, ${unsafeCSS(colors.secondary100)});
  --bbva-form-select-readonly-label-color: var(--colorsSecondary300, ${unsafeCSS(colors.secondary300)});
  --bbva-form-select-icon-color: var(--colorsPrimaryCoreLightened, ${unsafeCSS(colors.primaryCoreLightened)});
  --bbva-form-select-readonly-icon-color: var(--colorsSecondary100, ${unsafeCSS(colors.secondary100)});
  --bbva-form-select-message-color: var(--colorsPrimaryCoreLightened, ${unsafeCSS(colors.primaryCoreLightened)});
  --bbva-form-select-message-icon-color: var(--colorsPrimaryCoreLightened, ${unsafeCSS(colors.primaryCoreLightened)});
  --bbva-form-select-info-message-color: var(--colorsPrimaryCoreLightened, ${unsafeCSS(colors.primaryCoreLightened)});
  --bbva-form-select-info-message-icon-color: var(--colorsPrimaryCoreLightened, ${unsafeCSS(colors.primaryCoreLightened)});
  --bbva-form-select-invalid-bg-color: var(--colorsTertiaryType5Lightened, ${unsafeCSS(colors.tertiaryType5Lightened)});
  --bbva-form-select-invalid-border-color: var(--colorsTertiaryType5Medium, ${unsafeCSS(colors.tertiaryType5Medium)});
  --bbva-form-select-invalid-label-color: var(--colorsTertiaryType1Dark, ${unsafeCSS(colors.tertiaryType1Dark)});
  --bbva-form-select-invalid-icon-color: var(--colorsTertiaryType1Dark, ${unsafeCSS(colors.tertiaryType1Dark)}); }

[ambient=dark150] {
  --bbva-form-select-bg-color: var(--colorsPrimaryMedium, ${unsafeCSS(colors.primaryMedium)}); }

[ambient=dark300] {
  --bbva-form-select-bg-color: var(--colorsPrimaryCore, ${unsafeCSS(colors.primaryCore)}); }
`;

  /* eslint-disable max-classes-per-file */
  /**
  Dropdowns are used to let users select an option from a set of choices. They should be primarily used if there are 3 or more options. For anything with fewer options consider using radio buttons or checkboxes.

  `bbva-form-select` extends from `cells-select` to show an element with select dropdown functionality, providing it with BBVA Experience styles and structure. As it extends from `cells-select`, this select has all the basic select behaviors as autofocus, form participation, required, disabled & readonly attributes...

  Also, it provides a custom `bbva-form-option` to be used declaratively just as a native `select` with `options`. `bbva-form-option` has a `clip` slot to provide a clip element in each option, which will be shown in the select when the option is selected.

  Example:
  ```html
  <bbva-form-select label="Default" name="select1">
    <bbva-form-option value="option1">Option 1</bbva-form-option>
    <bbva-form-option value="option2" selected>Option 2</bbva-form-option>
    <bbva-form-option value="option3">Option 3</bbva-form-option>
  </bbva-form-select>
  ```

  ## Styling

  The following custom properties and mixins are available for styling:

  ### Custom properties

  | Selector                         | CSS Property                    | CSS Variable                               | Theme Variable                  | Foundations/Fallback                                      |
  | -------------------------------- | ------------------------------- | ------------------------------------------ | ------------------------------- | --------------------------------------------------------- |
  | .info .message-icon              | color                           | --_info-message-icon-color                 |                                 |                                                           |
  | .message-icon                    | margin-right                    | --gridSpacerVariant                        | --gridSpacer                    | foundations.grid.spacer                     |
  | .message-icon                    | color                           | --_message-icon-color                      |                                 |                                                           |
  | .message.info                    | color                           | --_info-message-color                      |                                 |                                                           |
  | .message                         | padding                         | --gridSpacerVariant                        | --gridSpacer                    | foundations.grid.spacer                     |
  | .message                         | font-size                       |                                            | --typographyType3XSmall         | foundations.typography.type3XSmall          |
  | .message                         | line-height                     |                                            | --lineHeightType3XSmall         | foundations.lineHeight.type3XSmall          |
  | .message                         | color                           | --_message-color                           |                                 |                                                           |
  | .options-wrapper                 | background-color                |                                            | --colorsPrimaryCoreLightened    | foundations.colors.primaryCoreLightened     |
  | .options-gradient::after         | background                      |                                            | --colorsPrimaryCoreLightened    | foundations.colors.primaryCoreLightened     |
  | .options-gradient::before        | background                      |                                            | --colorsPrimaryCoreLightened    | foundations.colors.primaryCoreLightened     |
  | .options-overlay                 | background-color                |                                            | --colorsPrimaryCoreDarkened     | foundations.colors.primaryCoreDarkened      |
  | .content-value                   | margin-left                     | --gridSpacerVariant                        | --gridSpacer                    | foundations.grid.spacer                     |
  | [aria-invalid=true] .label       | color                           | --_invalid-select-label-color              |                                 |                                                           |
  | :host([readonly]) .label         | color                           | --_select-readonly-label-color             |                                 |                                                           |
  | :host([filled]) .label           | color                           | --_select-filled-label-color               |                                 |                                                           |
  | :host([filled]) .label           | transform                       | --gridSpacerVariant                        | --gridSpacer                    | foundations.grid.spacer                     |
  | .label                           | color                           | --_select-label-color                      |                                 |                                                           |
  | .label                           | transform                       | --gridSpacerVariant                        | --gridSpacer                    | foundations.grid.spacer                     |
  | [aria-invalid=true] .button-icon | color                           | --_invalid-select-icon-color               |                                 |                                                           |
  | :host([readonly]) .button-icon   | color                           | --_select-readonly-icon-color              |                                 |                                                           |
  | .button-icon                     | margin-right                    | --gridSpacerVariant                        | --gridSpacer                    | foundations.grid.spacer                     |
  | .button-icon                     | color                           | --_select-icon-color                       |                                 |                                                           |
  | .button-text                     | padding                         | --gridSpacerVariant                        | --gridSpacer                    | foundations.grid.spacer                     |
  | .button-text                     | margin-left                     | --gridSpacerVariant                        | --gridSpacer                    | foundations.grid.spacer                     |
  | .button-clip                     | margin-left                     | --gridSpacerVariant                        | --gridSpacer                    | foundations.grid.spacer                     |
  | .button[aria-invalid=true]       | background-color                | --_invalid-select-bg-color                 |                                 |                                                           |
  | .button[aria-invalid=true]       | border-bottom-color             | --_invalid-select-border-color             |                                 |                                                           |
  | :host([readonly]) .button        | color                           | --_select-readonly-button-color            |                                 |                                                           |
  | :host([readonly]) .button        | border-bottom-color             | --_select-readonly-border-color            |                                 |                                                           |
  | .button                          | font-size                       |                                            | --typographyTypeSmall           | foundations.typography.typeSmall            |
  | .button                          | line-height                     |                                            | --lineHeightTypeSmall           | foundations.lineHeight.typeSmall            |
  | .button                          | font-weight                     |                                            | --fontFacePrimaryBookFontWeight | foundations.fontFacePrimary.book.fontWeight |
  | .button                          | background-color                | --_select-bg-color                         |                                 |                                                           |
  | .button                          | color                           | --_select-button-color                     |                                 |                                                           |
  | .button                          | border-bottom                   | --_select-border-color                     |                                 |                                                           |
  | :host                            | --_select-bg-color              | --bbva-form-select-bg-color                | --colorsSecondary100            | foundations.colors.secondary100             |
  | :host                            | --_select-border-color          | --bbva-form-select-border-color            | --colorsSecondary500            | foundations.colors.secondary500             |
  | :host                            | --_select-readonly-border-color | --bbva-form-select-readonly-border-color   | --colorsSecondary500            | foundations.colors.secondary500             |
  | :host                            | --_select-button-color          | --bbva-form-select-button-color            | --colorsSecondary600            | foundations.colors.secondary600             |
  | :host                            | --_select-readonly-button-color | --bbva-form-select-readonly-button-color   | --colorsSecondary500            | foundations.colors.secondary500             |
  | :host                            | --_select-label-color           | --bbva-form-select-label-color             | --colorsSecondary500            | foundations.colors.secondary500             |
  | :host                            | --_select-filled-label-color    | --bbva-form-select-filled-label-color      | --colorsSecondary500            | foundations.colors.secondary500             |
  | :host                            | --_select-readonly-label-color  | --bbva-form-select-readonly-label-color    | --colorsSecondary500            | foundations.colors.secondary500             |
  | :host                            | --_select-icon-color            | --bbva-form-select-icon-color              | --colorsPrimaryMedium           | foundations.colors.primaryMedium            |
  | :host                            | --_select-readonly-icon-color   | --bbva-form-select-readonly-icon-color     | --colorsSecondary500            | foundations.colors.secondary500             |
  | :host                            | --_message-color                | --bbva-form-select-message-color           | --colorsSecondary600            | foundations.colors.secondary600             |
  | :host                            | --_message-icon-color           | --bbva-form-select-message-icon-color      | --colorsTertiaryType1Dark       | foundations.colors.tertiaryType1Dark        |
  | :host                            | --_info-message-color           | --bbva-form-select-info-message-color      | --colorsSecondary500            | foundations.colors.secondary500             |
  | :host                            | --_info-message-icon-color      | --bbva-form-select-info-message-icon-color | --colorsPrimarySubdued          | foundations.colors.primarySubdued           |
  | :host                            | --_invalid-select-bg-color      | --bbva-form-select-invalid-bg-color        | --colorsTertiaryType5Lightened  | foundations.colors.tertiaryType5Lightened   |
  | :host                            | --_invalid-select-border-color  | --bbva-form-select-invalid-border-color    | --colorsTertiaryType5Medium     | foundations.colors.tertiaryType5Medium      |
  | :host                            | --_invalid-select-label-color   | --bbva-form-select-invalid-label-color     | --colorsTertiaryType1Dark       | foundations.colors.tertiaryType1Dark        |
  | :host                            | --_invalid-select-icon-color    | --bbva-form-select-invalid-icon-color      | --colorsTertiaryType1Dark       | foundations.colors.tertiaryType1Dark        |

  ### @apply

  | Selector                         | Mixins                                             |
  | -------------------------------- | -------------------------------------------------- |
  | .info .message-icon              | --bbva-form-select-info-message-icon               |
  | .message-icon                    | --bbva-form-select-message-icon                    |
  | .message.info                    | --bbva-form-select-info-message                    |
  | .message                         | --bbva-form-select-message                         |
  | .options-wrapper                 | --bbva-form-select-options-wrapper                 |
  | .options-gradient::after         | --bbva-form-select-options-gradient-bottom-element |
  | .options-gradient::before        | --bbva-form-select-options-gradient-top-element    |
  | .options-gradient::before        | --bbva-form-select-options-gradient-element        |
  | .options-gradient::after         | --bbva-form-select-options-gradient-element        |
  | .options-gradient                | --bbva-form-select-options-gradient                |
  | .options-overlay                 | --bbva-form-select-options-overlay                 |
  | .options-layer.opened            | --bbva-form-select-opened-options-layer            |
  | .options-layer                   | --bbva-form-select-options-layer                   |
  | .content-value                   | --bbva-form-select-content-value                   |
  | .content-text                    | --bbva-form-select-content-text                    |
  | .content                         | --bbva-form-select-content                         |
  | [aria-invalid=true] .label       | --bbva-form-select-invalid-label                   |
  | :host([readonly]) .label         | --bbva-form-select-readonly-label                  |
  | :host([filled]) .label           | --bbva-form-select-filled-label                    |
  | .label                           | --bbva-form-select-label                           |
  | [aria-invalid=true] .button-icon | --bbva-form-select-invalid-button-icon             |
  | :host([readonly]) .button-icon   | --bbva-form-select-readonly-button-icon            |
  | .button-icon                     | --bbva-form-select-button-icon                     |
  | .button-text                     | --bbva-form-select-button-text                     |
  | .button-clip                     | --bbva-form-select-button-clip                     |
  | .button-content                  | --bbva-form-select-button-content                  |
  | .button[aria-invalid=true]       | --bbva-form-select-invalid-button                  |
  | .button[disabled]                | --bbva-form-select-disabled-button                 |
  | :host([readonly]) .button        | --bbva-form-select-readonly-button                 |
  | .button                          | --bbva-form-select-button                          |
  | .slot-select ::slotted(select)   | --bbva-form-select-select                          |
  | :host                            | --bbva-form-select                                 |

  ## Ambient

  ### Custom properties

  | Selector          | CSS Property                               | CSS Variable | Theme Variable                 | Foundations/Fallback                                    |
  | ----------------- | ------------------------------------------ | ------------ | ------------------------------ | ------------------------------------------------------- |
  | [ambient=dark300] | --bbva-form-select-bg-color                |              | --colorsPrimaryCore            | foundations.colors.primaryCore            |
  | [ambient=dark150] | --bbva-form-select-bg-color                |              | --colorsPrimaryMedium          | foundations.colors.primaryMedium          |
  | [ambient^=dark]   | --bbva-form-select-border-color            |              | --colorsPrimaryCoreLightened   | foundations.colors.primaryCoreLightened   |
  | [ambient^=dark]   | --bbva-form-select-readonly-border-color   |              | --colorsSecondary100           | foundations.colors.secondary100           |
  | [ambient^=dark]   | --bbva-form-select-button-color            |              | --colorsPrimaryCoreLightened   | foundations.colors.primaryCoreLightened   |
  | [ambient^=dark]   | --bbva-form-select-readonly-button-color   |              | --colorsSecondary300           | foundations.colors.secondary300           |
  | [ambient^=dark]   | --bbva-form-select-label-color             |              | --colorsPrimaryCoreLightened   | foundations.colors.primaryCoreLightened   |
  | [ambient^=dark]   | --bbva-form-select-filled-label-color      |              | --colorsSecondary100           | foundations.colors.secondary100           |
  | [ambient^=dark]   | --bbva-form-select-readonly-label-color    |              | --colorsSecondary300           | foundations.colors.secondary300           |
  | [ambient^=dark]   | --bbva-form-select-icon-color              |              | --colorsPrimaryCoreLightened   | foundations.colors.primaryCoreLightened   |
  | [ambient^=dark]   | --bbva-form-select-readonly-icon-color     |              | --colorsSecondary100           | foundations.colors.secondary100           |
  | [ambient^=dark]   | --bbva-form-select-message-color           |              | --colorsPrimaryCoreLightened   | foundations.colors.primaryCoreLightened   |
  | [ambient^=dark]   | --bbva-form-select-message-icon-color      |              | --colorsPrimaryCoreLightened   | foundations.colors.primaryCoreLightened   |
  | [ambient^=dark]   | --bbva-form-select-info-message-color      |              | --colorsPrimaryCoreLightened   | foundations.colors.primaryCoreLightened   |
  | [ambient^=dark]   | --bbva-form-select-info-message-icon-color |              | --colorsPrimaryCoreLightened   | foundations.colors.primaryCoreLightened   |
  | [ambient^=dark]   | --bbva-form-select-invalid-bg-color        |              | --colorsTertiaryType5Lightened | foundations.colors.tertiaryType5Lightened |
  | [ambient^=dark]   | --bbva-form-select-invalid-border-color    |              | --colorsTertiaryType5Medium    | foundations.colors.tertiaryType5Medium    |
  | [ambient^=dark]   | --bbva-form-select-invalid-label-color     |              | --colorsTertiaryType1Dark      | foundations.colors.tertiaryType1Dark      |
  | [ambient^=dark]   | --bbva-form-select-invalid-icon-color      |              | --colorsTertiaryType1Dark      | foundations.colors.tertiaryType1Dark      |

  ### Custom properties

  | Selector           | CSS Property                               | CSS Variable | Theme Variable                 | Foundations/Fallback                                    |
  | ------------------ | ------------------------------------------ | ------------ | ------------------------------ | ------------------------------------------------------- |
  | [ambient=light100] | --bbva-form-select-bg-color                |              | --colorsPrimaryCoreLightened   | foundations.colors.primaryCoreLightened   |
  | [ambient^=light]   | --bbva-form-select-bg-color                |              | --colorsSecondary100           | foundations.colors.secondary100           |
  | [ambient^=light]   | --bbva-form-select-border-color            |              | --colorsSecondary500           | foundations.colors.secondary500           |
  | [ambient^=light]   | --bbva-form-select-readonly-border-color   |              | --colorsSecondary500           | foundations.colors.secondary500           |
  | [ambient^=light]   | --bbva-form-select-button-color            |              | --colorsSecondary600           | foundations.colors.secondary600           |
  | [ambient^=light]   | --bbva-form-select-readonly-button-color   |              | --colorsSecondary500           | foundations.colors.secondary500           |
  | [ambient^=light]   | --bbva-form-select-label-color             |              | --colorsSecondary500           | foundations.colors.secondary500           |
  | [ambient^=light]   | --bbva-form-select-filled-label-color      |              | --colorsSecondary500           | foundations.colors.secondary500           |
  | [ambient^=light]   | --bbva-form-select-readonly-label-color    |              | --colorsSecondary500           | foundations.colors.secondary500           |
  | [ambient^=light]   | --bbva-form-select-icon-color              |              | --colorsPrimaryMedium          | foundations.colors.primaryMedium          |
  | [ambient^=light]   | --bbva-form-select-readonly-icon-color     |              | --colorsSecondary500           | foundations.colors.secondary500           |
  | [ambient^=light]   | --bbva-form-select-message-color           |              | --colorsSecondary600           | foundations.colors.secondary600           |
  | [ambient^=light]   | --bbva-form-select-message-icon-color      |              | --colorsTertiaryType1Dark      | foundations.colors.tertiaryType1Dark      |
  | [ambient^=light]   | --bbva-form-select-info-message-color      |              | --colorsSecondary500           | foundations.colors.secondary500           |
  | [ambient^=light]   | --bbva-form-select-info-message-icon-color |              | --colorsPrimarySubdued         | foundations.colors.primarySubdued         |
  | [ambient^=light]   | --bbva-form-select-invalid-bg-color        |              | --colorsTertiaryType5Lightened | foundations.colors.tertiaryType5Lightened |
  | [ambient^=light]   | --bbva-form-select-invalid-border-color    |              | --colorsTertiaryType5Medium    | foundations.colors.tertiaryType5Medium    |
  | [ambient^=light]   | --bbva-form-select-invalid-label-color     |              | --colorsTertiaryType1Dark      | foundations.colors.tertiaryType1Dark      |
  | [ambient^=light]   | --bbva-form-select-invalid-icon-color      |              | --colorsTertiaryType1Dark      | foundations.colors.tertiaryType1Dark      |
  > Styling documentation generated by Cells CLI

  * @customElement bbva-form-select
  * @polymer
  * @LitElement
  * @demo demo/index.html
  */

  class BbvaFormSelect extends CellsSelect {
    static get is() {
      return 'bbva-form-select';
    }
    /**
     * TagName (uppercase) of select option elements
     * @return {String} TagName of options (uppercase)
     */


    static get optionTag() {
      return 'BBVA-FORM-OPTION';
    }

    static get properties() {
      return {
        /**
         * Icon to show when select is closed
         */
        openIcon: {
          type: String,
          attribute: 'open-icon'
        },

        /**
         * Icon to show when select is open
         */
        closeIcon: {
          type: String,
          attribute: 'close-icon'
        },

        /**
         * Size for open/close icons
         */
        iconSize: {
          type: Number,
          attribute: 'icon-size'
        },

        /**
         * If true, value of selected option will be shown in select control
         */
        showValue: {
          type: Boolean,
          attribute: 'show-value'
        },

        /**
         * Icon for error message
         */
        errorIcon: {
          type: String,
          attribute: 'error-icon'
        },

        /**
         * Size for error icon
         */
        errorIconSize: {
          type: Number,
          attribute: 'error-icon-size'
        },

        /**
         * Error message
         */
        errorMessage: {
          type: String,
          attribute: 'error-message'
        },

        /**
         * Icon for info message
         */
        infoIcon: {
          type: String,
          attribute: 'info-icon'
        },

        /**
         * Size for info icon
         */
        infoIconSize: {
          type: Number,
          attribute: 'info-icon-size'
        },

        /**
         * Info message
         */
        infoMessage: {
          type: String,
          attribute: 'info-message'
        }
      };
    }

    constructor() {
      super();
      this.openIcon = 'coronita:unfold';
      this.closeIcon = 'coronita:fold';
      this.iconSize = 24;
      this.errorIcon = 'coronita:alert';
      this.errorIconSize = 16;
      this.errorMessage = '';
      this.infoIcon = 'coronita:info';
      this.infoIconSize = 16;
      this.infoMessage = '';
    }

    updated(changedProps) {
      /* istanbul ignore else */
      if (super.updated) {
        super.updated(changedProps);
      }

      if (changedProps.has('_selectedOption')) {
        if (this._selectedOptionText) {
          this.setAttribute('filled', '');
        } else {
          this.removeAttribute('filled');
        }
      }
    }

    get _errorVisible() {
      return this.errorMessage && this.invalid;
    }

    get _selectedOptionText() {
      return this._selectedOption && this._selectedOption.text;
    }

    get _selectedOptionClip() {
      return this._selectedOption && this._selectedOption.clip;
    }

    get _selectedOptionValue() {
      return this._selectedOption && this._selectedOption.value;
    }

    static get shadyStyles() {
      return `
      ${bbvaFoundationsStylesFocus('.button:focus')}
      ${styles$2.cssText}
      ${getComponentSharedStyles('bbva-form-select-shared-styles')}
    `;
    }

    render() {
      return html`
      <style>
        ${this.constructor.shadyStyles}
      </style>
      ${this.field} ${this.messageError} ${this.messageInfo}
    `;
    }
    /**
     * HTML for select field block
     * @return {TemplateResult} HTML of select field block
     */


    get field() {
      return html`
      ${this._control} ${this._optionsLayer} ${this._select}
    `;
    }
    /**
     * HTML for control button content
     * @return {TemplateResult} HTML of control button content
     */


    get _controlContent() {
      return html`
      <span class="button-content">
        ${this._clip}
        <span class="button-text">
          ${this._label}
          <span class="content">
            <span class="content-text">
              ${this._selectedOptionText}
            </span>
            ${this.showValue ? html`
                  <span class="content-value">
                    ${this._selectedOptionValue}
                  </span>
                ` : ''}
          </span>
        </span>
        ${this._selectIcon}
      </span>
    `;
    }
    /**
     * HTML for selected option clip, if available
     * @return {TemplateResult} HTML of selected option clip
     */


    get _clip() {
      if (this._selectedOptionClip) {
        const clip = this._selectedOptionClip.cloneNode(true);

        return html`
        <span class="button-clip" aria-hidden="true">
          ${clip}
        </span>
      `;
      }

      return '';
    }
    /**
     * HTML for select label
     * @return {TemplateResult} HTML of select label
     */


    get _label() {
      return html`
      <span id="label" class="label" aria-hidden="true"
        >${this.label}
        ${this.required ? html`
              *
            ` : ''}</span
      >
    `;
    }
    /**
     * HTML for control icon
     * @return {TemplateResult} HTML of control icon
     */


    get _selectIcon() {
      return html`
      <span class="button-icon" aria-hidden="true">
        <cells-icon
          .icon="${this.opened ? this.closeIcon : this.openIcon}"
          .size="${this.iconSize}"
        ></cells-icon>
      </span>
    `;
    }
    /**
     * HTML for options list container
     * @return {TemplateResult} HTML for options list container
     */


    get _optionsLayer() {
      return html`
      <div class="options-layer ${this.opened ? 'opened' : ''}">
        <div class="options-overlay"></div>
        <div class="options-gradient">
          <div class="options-wrapper">
            ${this._optionsList}
          </div>
        </div>
      </div>
    `;
    }
    /**
     * Template for array-provided options
     * @return {TemplateResult} HTML of items options
     */

    /* eslint-disable-next-line class-methods-use-this */


    _optionItemTemplate(item) {
      return html`
      <bbva-form-option
        ?disabled="${item.disabled}"
        ?selected="${item.selected}"
        .value="${item.value}"
        >${item.text}</bbva-form-option
      >
    `;
    }
    /**
     * Layer with error icon and error message
     * @return {TemplateResult} HTML of error message
     */


    get messageError() {
      return this._errorVisible ? html`
          <div class="message error">
            <cells-icon
              class="message-icon"
              .icon="${this.errorIcon}"
              .size="${this.errorIconSize}"
              aria-hidden="true"
            ></cells-icon>
            <span>${this.errorMessage}</span>
          </div>
        ` : '';
    }
    /**
     * Layer with info icon and info message
     * @return {TemplateResult} HTML of info message
     */


    get messageInfo() {
      return this.infoMessage ? html`
          <div class="message info">
            <cells-icon
              class="message-icon"
              .icon="${this.infoIcon}"
              .size="${this.infoIconSize}"
              aria-hidden="true"
            ></cells-icon>
            <span>${this.infoMessage}</span>
          </div>
        ` : '';
    }

  }
  customElements.define(BbvaFormSelect.is, BbvaFormSelect);
  /*
  `bbva-form-option` extends from `cells-option` to provide custom option elements aimed to be used as children of `bbva-form-select`. These options can receive text, value... as normal select options. It also provides a 'clip' slot for showing a clip element besides the option, which will be shown in the select when the option is selected.

  ## Styling

  The following custom properties and mixins are available for styling:

  ### Custom properties

  | Selector              | CSS Property     | CSS Variable             | Theme Variable                  | Foundations/Fallback                                      |
  | --------------------- | ---------------- | ------------------------ | ------------------------------- | --------------------------------------------------------- |
  | :host([tabindex='0']) | background-color |                          | --colorsPrimaryCore             | foundations.colors.primaryCore              |
  | :host([tabindex='0']) | color            |                          | --colorsPrimaryCoreLightened    | foundations.colors.primaryCoreLightened     |
  | .icon                 | margin-left      | --gridSpacerVariant      | --gridSpacer                    | foundations.grid.spacer                     |
  | .clip ::slotted(*)    | margin-right     | --gridSpacerVariant      | --gridSpacer                    | foundations.grid.spacer                     |
  | :host                 | padding          | --gridSpacerVariant      | --gridSpacer                    | foundations.grid.spacer                     |
  | :host                 | font-size        |                          | --typographyTypeSmall           | foundations.typography.typeSmall            |
  | :host                 | line-height      |                          | --lineHeightTypeSmall           | foundations.lineHeight.typeSmall            |
  | :host                 | font-weight      |                          | --fontFacePrimaryBookFontWeight | foundations.fontFacePrimary.book.fontWeight |
  | :host                 | font-style       |                          | --fontFacePrimaryBookFontStyle  | foundations.fontFacePrimary.book.fontStyle  |
  | :host                 | color            | --bbva-form-option-color | --colorsSecondary600            | foundations.colors.secondary600             |

  ### @apply

  | Selector                    | Mixins                          |
  | --------------------------- | ------------------------------- |
  | :host([aria-disabled=true]) | --bbva-form-option-disabled     |
  | :host([tabindex='0'])       | --bbva-form-option-focused      |
  | .icon                       | --bbva-form-option-icon         |
  | .text                       | --bbva-form-option-text         |
  | .clip ::slotted(*)          | --bbva-form-option-clip-slotted |
  | .clip                       | --bbva-form-option-clip         |
  | :host                       | --bbva-form-option              |

  * @customElement bbva-form-option
  * @polymer
  * @LitElement
  * @demo demo/index.html
  */

  class BbvaFormOption extends CellsOption {
    static get is() {
      return 'bbva-form-option';
    }

    static get properties() {
      return {
        /**
         * Icon to show when option is selected
         */
        icon: {
          type: String
        },

        /**
         * Size for selected option icon
         */
        iconSize: {
          type: Number,
          attribute: 'icon-size'
        }
      };
    }

    constructor() {
      super();
      this.icon = 'coronita:checkmark';
      this.iconSize = 24;
    }
    /**
     * Returns node assigned in Light DOM to clip slot
     * @return { Node } Node assigned in light DOM to clip slot
     */


    get clip() {
      return this.querySelector('[slot=clip]');
    }

    static get shadyStyles() {
      return `
      ${stylesOption$1.cssText}
      ${getComponentSharedStyles('cells-option-shared-styles')}
    `;
    }

    render() {
      return html`
      <style>
        ${this.constructor.shadyStyles}
      </style>
      <span class="clip">
        <slot name="clip"></slot>
      </span>
      <span class="text">
        <slot></slot>
      </span>
      ${this.selected ? html`
            <span class="icon">
              <cells-icon .icon="${this.icon}" .size="${this.iconSize}"></cells-icon>
            </span>
          ` : ''}
    `;
    }

  }
  customElements.define(BbvaFormOption.is, BbvaFormOption);

  /**

  This component ...

  Example:

  ```html
  <html>
    <head>
      <script type="module">
        import '@cells-components/cells-iconset-svg/cells-iconset-svg.js';
        import '@cells-components/cells-icon/cells-icon.js';
      </script>
    </head>
    <body>
      <cells-iconset-svg name="inline" size="24">
        <svg>
          <defs>
            <g id="shape">
              <rect x="12" y="0" width="12" height="24"></rect>
              <circle cx="12" cy="12" r="12"></circle>
            </g>
          </defs>
        </svg>
      </cells-iconset-svg>

      <cells-icon icon="inline:shape" role="img" aria-label="A shape"></cells-icon>
    </body>
  </html>
  ```
  * @customElement
  * @polymer
  * @demo demo/index.html
  * @extends {LitElement}
  * @hero cells-iconset-svg.png
  */

  class CellsIconsetSvg extends LitElement {
    static get is() {
      return 'cells-iconset-svg';
    }

    static get properties() {
      return {
        /**
         * Name of the iconset.
         */
        name: {
          type: String
        },

        /**
         * Size for each icon in the iconset. If defined, it will override width and height
         */
        size: {
          type: Number
        },

        /**
         * Width for icons
         */
        width: {
          type: Number
        },

        /**
         * Height for icons
         */
        height: {
          type: Number
        },

        /**
         * If true, icons can be mirrored when decorated with a 'mirror-in-rtl' attribute
         */
        rtlMirroring: {
          type: Boolean
        },

        /**
         * If true, RTL will be based on the dir attribute of body or html elements
         */
        useGlobalRtlAttribute: {
          type: Boolean
        },

        /**
         * If true, icons will have visible overflow; useful for SVG shadows that overflow the icon viewbox
         */
        overflow: {
          type: Boolean
        }
      };
    }

    constructor() {
      super();
      this.width = 24;
      this.height = 24;
      this.rtlMirroring = false;
      this.useGlobalRtlAttribute = false;
      this.overflow = false;
      this._meta = new CellsIronMeta({
        type: 'iconset'
      });
    }
    /**
     * Width to be used for SVG icons
     */


    get iconWidth() {
      return this.size || this.width;
    }
    /**
     * Height to be used for SVG icons
     */


    get iconHeight() {
      return this.size || this.height;
    }

    updated(changedProps) {
      if (changedProps.has('name')) {
        this._nameChanged();
      }
    }

    connectedCallback() {
      super.connectedCallback();
      this.style.display = 'none';
    }
    /**
     * Construct an array of all icon names in this iconset.
     */


    getIconNames() {
      this._icons = this._createIconMap();
      return Object.keys(this._icons).map(function (n) {
        return this.name + ':' + n;
      }, this);
    }
    /**
     * Applies an icon to the given element.
     */


    applyIcon(element, iconName) {
      this.removeIcon(element);

      var svg = this._cloneIcon(iconName, this.rtlMirroring && this._targetIsRTL(element));

      if (svg) {
        var pde = element;
        pde.insertBefore(svg, pde.childNodes[0]);
        return element._svgIcon = svg;
      }

      return null;
    }
    /**
     * Removes an icon from the given element
     */


    removeIcon(element) {
      if (element._svgIcon) {
        const elem = element;
        elem.removeChild(element._svgIcon);
        element._svgIcon = null;
      }
    }

    _targetIsRTL(target) {
      if (this.__targetIsRTL == null) {
        if (this.useGlobalRtlAttribute) {
          var globalElement = document.body && document.body.hasAttribute('dir') ? document.body : document.documentElement;
          this.__targetIsRTL = globalElement.getAttribute('dir') === 'rtl';
        } else {
          if (target && target.nodeType !== Node.ELEMENT_NODE) {
            target = target.host;
          }

          this.__targetIsRTL = target && window.getComputedStyle(target).direction === 'rtl';
        }
      }

      return this.__targetIsRTL;
    }

    _nameChanged() {
      this._meta.value = null;
      this._meta.key = this.name;
      this._meta.value = this;
      window.dispatchEvent(new CustomEvent('iron-iconset-added', {
        bubbles: true,
        composed: true,
        detail: this
      }));
    }

    _createIconMap() {
      var icons = Object.create(null);
      var template = this.querySelector('template');
      var orig = template ? template.content : this;
      orig.querySelectorAll('svg > defs > [id]').forEach(function (icon) {
        icons[icon.id] = icon;
      });
      return icons;
    }

    _cloneIcon(id, mirrorAllowed) {
      this._icons = this._icons || this._createIconMap();
      return this._prepareSvgClone(this._icons[id], this.iconWidth, this.iconHeight, mirrorAllowed);
    }

    _prepareSvgClone(sourceSvg, width, height, mirrorAllowed) {
      if (sourceSvg) {
        var content = sourceSvg.cloneNode(true);
        var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        var viewBox = content.getAttribute('viewBox') || '0 0 ' + width + ' ' + height;
        var overflow = this.overflow ? 'visible' : 'hidden';
        var cssText = `pointer-events: none; display: block; width: 100%; height: 100%; overflow: ${overflow}`;

        if (mirrorAllowed && content.hasAttribute('mirror-in-rtl')) {
          cssText += '-webkit-transform:scale(-1,1);transform:scale(-1,1);transform-origin:center;';
        }

        svg.setAttribute('viewBox', viewBox);
        svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
        svg.setAttribute('focusable', 'false');
        svg.style.cssText = cssText;
        svg.appendChild(content).removeAttribute('id');
        return svg;
      }

      return null;
    }

  }

  customElements.define(CellsIconsetSvg.is, CellsIconsetSvg);

  /**

  `coronita-icons` is a utility import that includes the definition for `cells-iconset-svg` element, as well as an import for the default iconset, which is `coronita`.

  @customElement
  @pseudoElement coronita
  @demo demo/index.html
  */

  const iconset = document.createElement('template');
  iconset.setAttribute('style', 'display: none;');
  iconset.innerHTML = `
<cells-iconset-svg name="coronita" width="260" height="260">
  <template>
    <svg>
      <defs>

<g id="BBVAcontigo" fill-rule="evenodd">
<path d="M62.8 112.2h-14c-.6 0-1 .5-1 1v12.5c0 .6.5 1 1 1h14c6.8 0 9.6-2.1 9.6-7.4 0-5.2-3-7.1-9.6-7.1zM96.6 105.6h13.7c5.1 0 7.7-2.1 7.7-6.2s-2.6-6.2-7.7-6.2H96.6c-.5 0-1 .5-1 .8v10.5c0 .7.5 1.1 1 1.1zM110.5 112.2h-14c-.6 0-1 .5-1 1v12.5c0 .6.5 1 1 1h14c6.6 0 9.6-2.1 9.6-7.4 0-5.2-3-7.1-9.6-7.1zM49 105.6h13.7c5.1 0 7.7-2.1 7.7-6.2s-2.6-6.2-7.7-6.2H48.8c-.5 0-.8.5-.8.8v10.5c0 .7.5 1.1 1 1.1z"/><path d="M250 189.4V29.6c-.1-5.4-4.4-9.7-9.7-9.8H19.7c-5.2-.2-9.5 3.9-9.7 9v211.5l39.8-39.9h190.4c5.5-.2 9.9-4.8 9.7-10.3.1-.3.1-.5.1-.7zM63.5 133.6H41.2c-.6 0-1-.5-1-1V87.3c0-.6.5-1 1-1h23c8.2 0 13.9 5 13.9 12.3 0 4.4-2 7.8-5.2 9.5 0 0 7.4 2.2 7.6 11.4-.1 9.4-5.9 14.1-17 14.1zm47.5 0H88.8c-.6 0-1-.5-1-1V87.3c0-.6.5-1 1-1h23c8.2 0 13.9 5 13.9 12.3 0 4.4-1.9 7.8-5.2 9.5 0 0 7.5 2.2 7.6 11.4-.1 9.4-6 14.1-17.1 14.1zm41.7-.4l-24.4-45.7c-.2-.4.1-1 .6-1h7.4c.4 0 .7.2.8.4l15.5 29.5c.4.6 1.3.6 1.7 0L169.9 87c.1-.4.5-.4.8-.4h7.4c.4 0 .8.5.6 1l-24.4 45.7c-.3.5-1.2.5-1.6-.1zm66.9-6.5h-7.4c-.4 0-.7-.2-.8-.5l-15.5-29.5c-.4-.6-1.3-.6-1.6 0l-15.5 29.5c-.1.3-.5.5-.8.5h-7.4c-.5 0-.8-.5-.6-1L194.4 80c.3-.6 1.2-.6 1.6 0l24.4 45.7c0 .4-.4 1-.8 1z"/>
</g>
<g id="account" fill-rule="evenodd">
<path class="cls-1" d="M219 40H-1v140h220zM29 70h60L69 90H29zm120.06 70H29v-20h140zM239 100v100H39l-20 20h240V80z"/><path class="cls-1" d="M219 40H-1v140h220zM29 70h60L69 90H29zm120.06 70H29v-20h140zM239 100v100H39l-20 20h240V80z"/><path class="cls-1" d="M219 40H-1v140h220zM29 70h60L69 90H29zm120.06 70H29v-20h140zM239 100v100H39l-20 20h240V80z"/>
</g>
<g id="add" fill-rule="evenodd">
<path d="M129.5 9.5c-66.3 0-120 53.7-120 120s53.7 120 120 120 120-53.7 120-120-53.7-120-120-120zm50 130.5H139v50h-20v-50H69v-20h50V70h20v50h60.5l-20 20z"/>
</g>
<g id="addnotes" fill-rule="evenodd">
<g><path class="cls-1" d="M185.25 109.75a84.71 84.71 0 0124.75 3.69V20a10 10 0 00-9.93-10H190l-10 10h-10V10h-10l-10 10h-10V10h-10l-10 10h-10V10h-10L90 20H80V10H70L60 20H50V10H39.93A10 10 0 0030 20v220a10 10 0 009.93 10H50l10-10h10v10h10l10-10h10v10h10l6-6a84.93 84.93 0 0169.23-134.23zM60 60h110l-20 20H60zm0 60v-20h80l-20 20z"/><path class="cls-1" d="M185 130a65 65 0 1065 65 65 65 0 00-65-65zm33.33 73.12h-25.2V235h-16.25v-31.88H145v-16.25h31.88V155h16.25v31.87H225z"/></g>
</g>
<g id="advance" fill-rule="evenodd">
<path fill-rule="evenodd" clip-rule="evenodd" d="M193.4 115.7l-56.5-56.4L158 38.1l92 92.4-91.3 91.6-21.2-21.1 55.5-55.5H10l28.8-29.8z"/>
</g>
<g id="aeroplane" fill-rule="evenodd">
<path d="M242.94 17.17a23.58 23.58 0 00-33.35 0l-45 45L39.66 38.11a11.32 11.32 0 00-10.22 3.1l-9.06 9.06L118 108.81l-45.71 45.66-52.15 1.48a11.32 11.32 0 00-5.78 3.1l-4.25 4.25 58.61 28.1 28.1 58.6 4.25-4.25a11.32 11.32 0 003.1-5.78l1.48-52.15 45.66-45.66 58.55 97.57 9.06-9.06a11.32 11.32 0 003.1-10.22L197.93 95.53l45-45a23.58 23.58 0 00.01-33.36z"/>
</g>
<g id="agenda" fill-rule="evenodd">
<path d="M210 40v190.15H67.72C50.6 230.12 51 210 67.9 210H190V12h.22v-2H55.14C41.36 10 30 21.85 30 35.69V50h20v20H30v8.47c0 .36.11.54.12.89l.1 20.64H50v20H30.22v30H50v20H30.21v52.79c0 13 13.88 23.63 26.41 26.61a31.57 31.57 0 007.24.76c57.64 0 108.49.07 166.14.07V40zM81 130h79l-18.47 20H81z"/>
</g>
<g id="alarm" fill-rule="evenodd">
<path d="M65.83 121.32L88 117l56 56.41-6.11 20.48-72-72.53zm105 63.2l40.65-40.92a69.1 69.1 0 0020.3-48.27 67.17 67.17 0 00-11.89-38.93L240 36.12 224 20l-19.95 20.07a65.08 65.08 0 00-39.87-12.73A68.64 68.64 0 00116.51 48L75.9 88.89l-52.63 14.05c-3.57 1-4.34 3.84-1.72 6.45l39.59 39.42c-.21.2-.43.4-.64.61a34.7 34.7 0 000 48.78 34.14 34.14 0 0048.45 0l.61-.65 40.1 40.86c2.59 2.64 5.5 1.89 6.5-1.67l14.64-52.24zm0 0" fill-rule="evenodd"/>
</g>
<g id="alert" fill-rule="evenodd">
<path d="M130 190a15 15 0 1015 15 15 15 0 00-15-15zm10-20h-20V90l20 20zm98.81 58.88L135.62 24.61c-3.11-6.15-8.13-6.14-11.23 0L21.19 228.88c-3.11 6.12.08 11.12 7.1 11.12h203.42c7.03 0 10.2-5 7.1-11.12z" fill-rule="evenodd"/>
</g>
<g id="alphabeticalorder" fill-rule="evenodd">
<g><path class="cls-1" d="M53.27 68.72L10.57 189.8H35l9.29-26.89h41.08L95 191.75l25.59-3.91-42-119.13zm-2.44 75L65 102.61h.33l13.85 41.07zM246.68 167.31h-59.35l61.3-79.78V68.72H154.9l3.89 21.89h56.59l-62.59 79.94v18.17h97.78l-3.89-21.41z"/><path class="cls-1" d="M164.94 118.72h-50v20h40l10-20z"/></g>
</g>
<g id="appstore" fill-rule="evenodd">
<path d="M137.06 72.83q6 0 19.55-4.65t23.53-4.65a50.17 50.17 0 0129.12 8.78A72.93 72.93 0 01223.49 86q-10.64 9-15.56 16.09a48.17 48.17 0 00-8.93 28.18 52 52 0 009.44 30.45q9.44 13.56 21.54 17.15-5.05 16.35-16.75 34.17-17.68 26.72-35.1 26.72-6.91 0-19.08-4.39T138.52 230q-8.38 0-19.48 4.59t-18 4.59q-20.88 0-41-35.37Q40 168.82 40 135.19q0-31.24 15.36-50.92t38.76-19.69q10 0 24.13 4.12t18.81 4.13zm41.62-54.91a51.06 51.06 0 01-4 18.61 55.17 55.17 0 01-12.63 18.75q-7.45 7.31-14.76 9.84a70.28 70.28 0 01-14.09 2.26q.27-20.21 10.57-35t34.1-20.21a16.13 16.13 0 01.66 3.06q.15 1.36.15 2.68z"/>
</g>
<g id="arrows" fill-rule="evenodd">
<path class="st0" d="M80 10l12.5 12.2L130 58.6l-12.5 12.2-26.8-26V160l-21.4-20.4V44.8l-26.8 26L30 58.6zM180 250l-12.5-12.2-37.5-36.4 12.5-12.2 26.8 26V100l21.4 20.4v94.8l26.8-26 12.5 12.2z"/>
</g>
<g id="atm" fill-rule="evenodd">
<path d="M10 20v80h40v130.07A10 10 0 0060 240h140a10 10 0 0010-9.93V100h40V20zm90 190l-20-20v-50h20zM230 80h-20V60h-30v150l-20-20V60H50v20H30V40h200z" fill-rule="evenodd"/>
</g>
<g id="attached" fill-rule="evenodd">
<defs><symbol data-name="grid-26"><path class="cls-1" d="M.6.64l258.75 258.72"/><path data-name="diagonal" class="cls-1" d="M.7 259.37L259.34.73"/><path d="M0 0h260v260H0z"/><g><path class="cls-3" d="M130 81a49 49 0 11-49 49 49.05 49.05 0 0149-49m0-1a50 50 0 1050 50 50 50 0 00-50-50z"/><path class="cls-3" d="M130.5 51a78.8 78.8 0 0178.5 78.5c0 43.84-35.22 79.5-78.5 79.5A79.21 79.21 0 0151 129.5C51 86.22 86.66 51 130.5 51m0-1C85.82 50 50 85.82 50 129.5a80.22 80.22 0 0080.5 80.5c43.68 0 79.5-35.82 79.5-80.5 0-43.68-35.82-79.5-79.5-79.5z"/><path class="cls-3" d="M130 11a119 119 0 0184.15 203.15 119 119 0 01-168.3-168.3A118.25 118.25 0 01130 11m0-1a120 120 0 10120 120A120 120 0 00130 10z"/></g><g><path class="cls-3" d="M230 21a9 9 0 019 9v200a9 9 0 01-9 9H30a9 9 0 01-9-9V30a9 9 0 019-9h200m0-1H30a10 10 0 00-10 10v200a10 10 0 0010 10h200a10 10 0 0010-10V30a10 10 0 00-10-10z"/><path class="cls-3" d="M210 11a9 9 0 019 9v220a9 9 0 01-9 9H50a9 9 0 01-9-9V20a9 9 0 019-9h160m0-1H50a10 10 0 00-10 10v220a10 10 0 0010 10h160a10 10 0 0010-10V20a10 10 0 00-10-10z"/><path class="cls-3" d="M240 41a9 9 0 019 9v160a9 9 0 01-9 9H20a9 9 0 01-9-9V50a9 9 0 019-9h220m0-1H20a10 10 0 00-10 10v160a10 10 0 0010 10h220a10 10 0 0010-10V50a10 10 0 00-10-10z"/></g></symbol></defs><use width="260" height="260" xlink:href="#grid-26"/><path d="M115 70v90l30 30v-90zm15-30a45 45 0 0145 45v55l30 30V85A75 75 0 0058.22 63.22L85 90v-5a45 45 0 0145-45zm69.13 164.13l-24.38-24.38A45 45 0 0185 175v-45l-30-30v75.05a75 75 0 00144.13 29.08z"/>
</g>
<g id="audio" fill-rule="evenodd">
<g><path d="M132.93 21.62L60.89 80h-40a10 10 0 00-10 10v80a10 10 0 0010 10h40l72 58.33c4.4 3.3 8 1.58 8-4.05V25.67c0-5.53-3.64-7.29-7.96-4.05z" fill-rule="evenodd"/><path class="cls-2" d="M182.39 88.81l-21.26 21.25a30 30 0 010 42.5l21.26 21.25a60.09 60.09 0 000-85z"/><path class="cls-2" d="M224.91 46.31l-21.26 21.25a90.13 90.13 0 010 127.5l21.26 21.25a120.17 120.17 0 000-170z"/></g>
</g>
<g id="auto" fill-rule="evenodd">
<path d="M239.08 110h-11.37l-19.8-67.9a3.09 3.09 0 00-2.79-2.1H55.62a3.13 3.13 0 00-2.81 2.08L32.14 110H20.92A10.91 10.91 0 0010 120.9v10.93A11.14 11.14 0 0020.92 143H30v86.08A10.91 10.91 0 0040.9 240h12.65c6 0 10.45-4.89 10.45-10.92V220h131v9.08A10.88 10.88 0 00205.87 240h10.93c6 0 13.19-4.89 13.19-10.92V143h9.08A11.14 11.14 0 00250 131.83V120.9a10.91 10.91 0 00-10.92-10.9zM70 60h120l15 50H55zm-5 110a15 15 0 1115-15 15 15 0 01-15 15zm130 0a15 15 0 1115-15 15 15 0 01-15 15z" fill-rule="evenodd"/>
</g><g id="autobank" fill-rule="evenodd"><path d="M240 10H10v230h22.27V32.34H240V10z"/><path d="M244.72 129h-9.67l-16.83-57.47a2.41 2.41 0 00-2.37-1.53H88.77a2.44 2.44 0 00-2.39 1.52L68.82 129h-9.54c-5.13 0-9.28 4.65-9.28 9.76v9.29a9 9 0 009.28 8.95H67v73.72a9.27 9.27 0 009.26 9.28H87a9 9 0 009-9.28V223h111v7.72a9.47 9.47 0 009.49 9.28h9.29c5.11 0 11.21-4.15 11.21-9.28V157h7.72a9 9 0 009.28-8.94v-9.29c.01-5.12-4.14-9.77-9.27-9.77zM101 87h102l12.75 42H88.25zm-2 98a15 15 0 1115-15 15 15 0 01-15 15zm106 0a15 15 0 1115-15 15 15 0 01-15 15z" fill-rule="evenodd"/></g>
<g id="automaticAccess" fill-rule="evenodd">
<path class="st0" d="M140 160l-40-40 14-14 26 26 76-76 14 14z"/><path class="st0" d="M180 210H60V30h120v34l20-20V20c0-5.5-4.5-10-10-10H50c-5.5 0-10 4.5-10 10v220c0 5.5 4.5 10 10 10h140c5.5 0 10-4.5 10-10V128l-20 20v62zm-60 30c-5.5 0-10-4.5-10-10s4.5-10 10-10 10 4.5 10 10-4.5 10-10 10z"/>
</g>
<g id="back" fill-rule="evenodd">
<path class="cls-1" transform="rotate(135 125.355 151.215)" d="M115.36 111.21h20v80h-20z"/><path class="cls-1" transform="rotate(135 125.356 108.787)" d="M85.36 98.79h80v20h-80z"/>
</g>
<g id="bakery" fill-rule="evenodd">
<path d="M231.08 28.08C210.7 7.7 162.34 21.72 114.59 59H170l-16.67 20H91.45q-2.89 2.76-5.76 5.62-7.1 7.1-13.53 14.38H140l-16.67 20H55.9c-5 6.7-9.49 13.4-13.51 20H101l-16.67 20H31.61c-14.28 30.58-16.25 57.2-2.45 71 24.53 24.53 89.62-.78 145.38-56.54s81.07-120.85 56.54-145.38z"/>
</g>
<g id="balance" fill-rule="evenodd">
<path d="M138.45 190h.93v-16.87C152 169.93 160 161 160 148.9c0-13-6-19.39-25.49-27.37-13.2-5.43-16.14-7.9-16.14-13.22 0-5.68 4.54-9.05 12.87-9.05a32.47 32.47 0 0118 5.7l1.9 1.31 1.27.87.25-1.42.38-2.13 2-11.32.15-.88.1-.58-.57-.3-.86-.44a43.86 43.86 0 00-14.47-4.49v-8.14L123.87 70h-.93v15.89c-13.31 2.59-21.79 11.26-21.79 23.27 0 12.23 5.93 18.23 25.36 26.17 13.42 5.46 16.27 8 16.27 14.42s-5.3 10.5-14.08 10.5a45.86 45.86 0 01-22.91-6.75l-1.88-1.12-1.25-.74-.22 1.34-.33 2-1.87 11.56-.15.9-.1.6.59.28.89.43a61.32 61.32 0 0021.46 5.46v8.36zM50 70a100 100 0 01174.24 26.5l29.83-5.42A130 130 0 0028.63 48.63L10 30 0 100l70-10zm140 100l20 20a100 100 0 01-174.24-26.5l-29.83 5.42a130 130 0 00225.44 42.45L250 230l10-70z"/>
</g>
<g id="balanceeuro" fill-rule="evenodd">
<path d="M259.097 159.792l-9.93 69.514-18.497-18.497c-23.661 29.44-59.96 48.288-100.67 48.288-56.652 0-104.78-36.493-122.162-87.254l-1.046-3.191 29.619-5.386c13.679 38.483 50.413 66.04 93.59 66.04 31.284 0 59.178-14.476 77.379-37.087l2.057-2.645-19.854-19.852 69.514-9.93zM130 .902c56.652 0 104.78 36.495 122.162 87.255l1.046 3.191-29.619 5.386C209.91 58.252 173.176 30.694 130 30.694c-31.285 0-59.179 14.477-77.38 37.087l-2.057 2.645 19.854 19.852-69.514 9.93 9.93-69.514L29.33 49.191C52.991 19.753 89.29.903 130 .903zm3.193 87.183c12.204 0 23.253 4.692 31.252 12.276l12.5-11.855C165.747 77.888 150.28 71.32 133.192 71.32c-31.714 0-57.836 22.633-61.431 51.795l-.268 2.695a56.351 56.351 0 00-.173 4.19c0 32.407 27.702 58.68 61.874 58.68 17.087 0 32.555-6.568 43.751-17.186l-12.5-11.856c-7.998 7.585-19.047 12.277-31.251 12.277-16.357 0-30.625-8.433-38.268-20.958h29.428l17.68-16.767H89.219a40.171 40.171 0 01-.222-4.19c0-1.415.077-2.814.222-4.191h35.134l17.68-16.767H94.925c7.643-12.524 21.911-20.957 38.268-20.957z"/>
</g>
<g id="bank" fill-rule="evenodd">
<g><path class="cls-1" d="M20 220h220v20H20z"/><path fill-rule="evenodd" d="M129.62 10L20 70v20h220V70L129.62 10z"/><path class="cls-1" d="M40 110h40v90H40zM110 110h40v90h-40zM180 110h40v90h-40z"/></g>
</g>
<g id="bar" fill-rule="evenodd">
<path d="M243.39 52.41l-56.39.11v-25.2c0-3.8-2.75-7.32-6.56-7.32H16.67C12.86 20 10 23.51 10 27.32v215.36c0 3.8 2.86 7.32 6.67 7.32h163.77c3.81 0 6.56-3.51 6.56-7.32v-44l56.39.11a6.56 6.56 0 006.61-6.28V58.69a6.57 6.57 0 00-6.61-6.28zM62 140h-.7L41 119.91V51h21zm157 26h-32V83h32z" fill-rule="evenodd"/>
</g>
<g id="barcode" fill-rule="evenodd">
<path d="M244.46 40H15.54A5.44 5.44 0 0010 45.34v169.32a5.45 5.45 0 005.54 5.34h228.92a5.44 5.44 0 005.54-5.34V45.34a5.45 5.45 0 00-5.54-5.34zM60 190H40V70h20zm40 0H80v-20h20zm0-40H80V70h20zm40 40h-20v-20h20zm0-40h-20V70h20zm40 40h-20v-20h20zm0-40h-20V70h20zm40 40h-20V70h20z" fill-rule="evenodd"/>
</g>
<g id="bbva" fill-rule="evenodd">
<path class="st0" d="M182.9 103.8l-20.7 39.3c-.5.8-1.7.8-2.2 0l-20.7-39.3c-.2-.3-.6-.6-1.1-.6h-9.9c-.6 0-1.1.8-.8 1.3l32.5 60.9c.5.8 1.7.8 2.1 0l32.5-60.9c.3-.6-.2-1.3-.8-1.3h-9.9c-.4 0-.9.1-1 .6M194.5 156.2l20.7-39.3c.5-.8 1.7-.8 2.2 0l20.7 39.3c.2.3.6.6 1.1.6h9.9c.6 0 1.1-.8.8-1.3l-32.5-60.9c-.5-.8-1.7-.8-2.1 0l-32.5 60.9c-.3.6.2 1.3.8 1.3h9.9c.4 0 .9-.2 1-.6M53.5 132c4.3-2.2 6.9-6.8 6.9-12.6 0-9.8-7.6-16.4-18.5-16.4H11.3c-.6 0-1.3.5-1.3 1.3v60.4c0 .6.5 1.3 1.3 1.3H41c14.8 0 22.6-6.3 22.6-18.8-.3-12.3-10.1-15.2-10.1-15.2m-32-19.8H40c6.8 0 10.3 2.8 10.3 8.2 0 5.4-3.5 8.2-10.3 8.2H21.7c-.6 0-1.3-.5-1.3-1.3v-14c0-.5.5-1.1 1.1-1.1m18.6 44.6H21.5c-.6 0-1.3-.5-1.3-1.3v-16.7c0-.6.5-1.3 1.3-1.3h18.6c8.8 0 12.8 2.5 12.8 9.5s-3.8 9.8-12.8 9.8M116.9 132c4.3-2.2 6.9-6.8 6.9-12.6 0-9.8-7.6-16.4-18.5-16.4H74.7c-.6 0-1.3.5-1.3 1.3v60.4c0 .6.5 1.3 1.3 1.3h29.7c14.8 0 22.6-6.3 22.6-18.8-.1-12.3-10.1-15.2-10.1-15.2m-31.8-19.8h18.3c6.8 0 10.3 2.8 10.3 8.2 0 5.4-3.5 8.2-10.3 8.2H85.1c-.6 0-1.3-.5-1.3-1.3v-14c0-.5.6-1.1 1.3-1.1m18.6 44.6H85.1c-.6 0-1.3-.5-1.3-1.3v-16.7c0-.6.5-1.3 1.3-1.3h18.6c8.8 0 12.8 2.5 12.8 9.5s-4 9.8-12.8 9.8"/>
</g>
<g id="beconomy" fill-rule="evenodd">
<path d="M130 9.5c-66.3 0-120 53.7-120 120s53.7 120 120 120 120-53.7 120-120-53.7-120-120-120zM115 195c-35.9 0-65-29.1-65-65s29.1-65 65-65c18 0 34.3 7.3 46 19.1l-14.1 14.1C138.7 90.1 127.4 85 115 85c-15.6 0-29.3 7.9-37.4 20h46l-20 20H70.3c-.2 1.6-.3 3.3-.3 5s.1 3.4.3 5h53.3l-20 20h-26c8.1 12.1 21.8 20 37.4 20 12.5 0 23.7-5.1 31.9-13.3l14.1 14.1c-11.8 11.9-28 19.2-46 19.2zm72.9-44.4l-13.8 13.8-28.4-28.4 14.2-14.2 14.2 14.2 42.4-42.4 14.2 14.2-42.8 42.8z" fill-rule="evenodd" clip-rule="evenodd"/>
</g>
<g id="bigglass" fill-rule="evenodd">
<path d="M40 20l28.2 210.1c1 5.7 6 9.8 11.8 9.9h100c5.8 0 10.8-4.1 11.8-9.9L220 20H40zm47 200l-2.7-20h91.3l-2.6 20H87zm91.3-40H81.7L62.9 40h134.3l-18.9 140z"/>
</g>
<g id="bill" fill-rule="evenodd">
<path d="M210.07 10H200l-10 10h-10V10h-10l-10 10h-10V10h-10l-10 10h-10V10h-10l-10 10H90V10H80L70 20H60V10H49.93A10 10 0 0040 20v220a10 10 0 009.93 10H60l10-10h10v10h10l10-10h10v10h10l10-10h10v10h10l10-10h10v10h10l10-10h10v10h10.07a10 10 0 009.93-10V20a10 10 0 00-9.93-10zM140 178.76V200l-20-10v-10.5a72.42 72.42 0 01-22.5-6.3l2.9-17.14c8.4 4.82 18.82 8.64 28.81 8.64 8.83 0 14.91-4.11 14.91-11.9 0-7.22-3.47-10.2-18-16.29-19.4-7.79-27.22-14-27.22-29.18 0-13.57 8.4-22.69 21.05-26V60l20 10v10.53a51.8 51.8 0 0117.58 5.42l-2.9 17c-7.24-4.67-15.78-7.65-23.6-7.65-9.55 0-13.75 4.53-13.75 10.48 0 6.23 3.18 9.21 17.08 14.87C155 128.87 162.5 135.81 162.5 151s-9.09 24.56-22.5 27.76z" fill-rule="evenodd"/>
</g><g fill-rule="evenodd" id="billspayments"><path d="M191.26 124.348c37.475 0 67.827 30.352 67.827 67.826 0 37.473-30.352 67.826-67.826 67.826-37.474 0-67.826-30.353-67.826-67.826 0-37.474 30.352-67.826 67.826-67.826zm-5.708 22.609v12.038c-8.704 2.035-14.582 8.31-14.582 17.862 0 9.681 4.506 14.006 15.591 18.864l2.156.918c9.44 4.126 11.7 6.104 11.7 11.022 0 5.312-3.956 8.082-9.721 8.082-5.688 0-11.592-1.99-16.652-4.685l-2.114-1.193-1.865 11.644a44.704 44.704 0 0012.665 3.986l2.879.365v5.88l11.304 5.651v-11.926c9.213-1.978 15.544-8.422 15.488-19.105 0-9.715-4.387-14.439-16.16-19.648l-2.154-.925c-9.044-3.844-11.135-5.822-11.135-10.06 0-4.07 2.77-7.123 8.987-7.123 4.451 0 9.249 1.558 13.559 4.068l1.815 1.132 1.865-11.53c-3.014-1.602-6.146-2.81-9.953-3.464l-2.368-.323v-5.878l-11.305-5.652z"/><path d="M202.565 0c6.243 0 11.305 5.061 11.305 11.304l.004 93.285a90.598 90.598 0 00-22.613-2.85c-49.946 0-90.435 40.49-90.435 90.435 0 16.477 4.407 31.926 12.106 45.23l-68.628-.013c-6.243 0-11.304-5.06-11.304-11.304V11.304C33 5.061 38.061 0 44.304 0h158.261zm-79.13 79.13H66.913v22.61h33.913l22.609-22.61zm45.217-45.217H66.913v22.609h79.13l22.61-22.609z"/></g>
<g id="biometric" fill-rule="evenodd">
<path class="st0" d="M30 30h30V10H10v50h20zM30 200H10v50h50v-20H30zM230 230h-30v20h50v-50h-20zM200 10v20h30v30h20V10zM137.5 147.5v-35c0-4.1-3.4-7.5-7.5-7.5s-7.5 3.4-7.5 7.5v35c0 4.1 3.4 7.5 7.5 7.5s7.5-3.4 7.5-7.5z"/><path class="st0" d="M130 43c-82.5 0-110 87.5-110 87.5S47.5 218 130 218s110-87.5 110-87.5S212.5 43 130 43zm0 157c-24.7 0-45.5-17.2-51-40.2l13.5-13.5v1.3c0 20.7 16.8 37.5 37.5 37.5s37.5-16.8 37.5-37.5v-12.4l14.9 14.9c-1.3 27.7-24.3 49.9-52.4 49.9zm-22.5-52.5v-35c0-12.4 10.1-22.5 22.5-22.5s22.5 10.1 22.5 22.5v35c0 12.4-10.1 22.5-22.5 22.5s-22.5-10.1-22.5-22.5zm75-18.6l-15-15v-1.4c0-20.7-16.8-37.5-37.5-37.5s-37.5 16.8-37.5 37.5V125l-15 15v-27.5C77.5 83.6 101.1 60 130 60s52.5 23.6 52.5 52.5v16.4z"/>
</g><g id="bizum" fill-rule="evenodd"><path class="st0" d="M186.5 51.4c-8.6-6.3-20.6-4.4-26.9 4.3L69.2 182.1c-6.3 8.7-4.3 20.9 4.3 27.3 8.6 6.3 20.6 4.4 26.9-4.3l90.5-126.4c6.1-8.8 4.2-21-4.4-27.3zM75.3 41.5c6.3-8.7 4.4-20.9-4.3-27.2-8.7-6.3-20.9-4.4-27.2 4.3-6.3 8.7-4.4 20.9 4.3 27.2 8.7 6.3 20.8 4.4 27.2-4.3zM83.3 95.9c8.6 6.3 20.6 4.4 26.9-4.3L132.8 60c6.2-8.7 4.3-20.9-4.2-27.3-8.6-6.3-20.6-4.4-26.9 4.3L79.1 68.6c-6.3 8.8-4.4 21 4.2 27.3zM176.7 164.8c-8.6-6.3-20.6-4.4-26.9 4.3l-22.6 31.6c-6.2 8.7-4.3 20.9 4.2 27.3 8.6 6.3 20.6 4.4 26.9-4.3l22.6-31.6c6.3-8.7 4.4-21-4.2-27.3zM211 214.2c-8.7-6.3-20.9-4.4-27.2 4.3-6.3 8.7-4.4 20.9 4.3 27.2 8.7 6.3 20.9 4.4 27.2-4.3 6.3-8.7 4.4-20.8-4.3-27.2z"/></g>
<g id="block" fill-rule="evenodd">
<path d="M130 10a120 120 0 10120 120A120 120 0 00130 10zM40 130a90 90 0 01142.85-72.85l-125.7 125.7A89.59 89.59 0 0140 130zm90 90a89.59 89.59 0 01-52.85-17.15l125.7-125.7A90 90 0 01130 220z"/>
</g>
<g id="blockcard" fill-rule="evenodd">
<path d="M79 220h160a10 10 0 0010-9.93V50zm120-40h-40v-20h60zM19 250L229 40V10l-30 30H19a10 10 0 00-10 9.93V80h150l-20 20H9v110.07A10 10 0 0019 220z" fill-rule="evenodd"/>
</g>
<g id="blog" fill-rule="evenodd">
<path d="M130 10a120 120 0 10120 120A120 120 0 00130 10zm-6 171H60v-60.94L90.15 81h28.65l-30.65 40H124zm76 0h-64v-60.94L166.15 81h28.65l-30.65 40H200z"/>
</g>
<g id="bluetooth" fill-rule="evenodd">
<path d="M187.36 82.6L104.6 10.25v96.09L57.36 65.48V94.1l43 36.87-43 38V195l47.25-40.85v96.09l82.75-72.35-55.1-47.65zM126 203.4V153l29.13 25zm29.16-120.8L126 108.35V57.09z" fill-rule="evenodd"/>
</g>
<g id="bonusaccount" fill-rule="evenodd">
<path class="cls-1" d="M240 100v100H40l-20 20h240V80l-20 20z"/><path class="cls-1" d="M220 40H0v140h220zM70 90H30V70h60zm104.72 50.42L150 126.67l-24.72 13.75 6.56-25.91L110 97.07l28.76-2.25L150 70.39l11.24 24.44L190 97.07l-21.84 17.44z"/>
</g>
<g id="bookstore" fill-rule="evenodd">
<path d="M210 40v189.9c-1 0-94.2.1-147.19.1-17.22 0-16.92-20 .06-20H190V10H54.24c-2.9 1-6 1.58-8.67 3C36.24 17.72 30.74 25.55 30 36v186.7c0 13 9 23.58 21.57 26.56a31.86 31.86 0 007.28.73h171.14V40zM70 50h80l-20 20H70z"/>
</g>
<g id="branch" fill-rule="evenodd">
<path class="st0" d="M130 10C74.8 10 30 54.8 30 110v3c2 88.3 91.6 144.7 91.6 144.7 4.6 3.1 12 3.1 16.5.1 0 0 89.8-56.5 91.8-144.8v-3C230 54.8 185.2 10 130 10zm50 174c0 3.3-2.7 6-6 6h-24v-30h-40v30H86c-3.3 0-6-2.7-6-6V60l100-10v134z"/><path class="st0" d="M120 120h20v20h-20zM120 89.6h20V110h-20zM170 89.6l-20 .4v20h20zM150 120h20v20h-20zM90 89.6h20V110H90zM90 120h20v20H90z"/>
</g>
<g id="build" fill-rule="evenodd">
<path d="M40 20v213c0 3.64 4 7 7.64 7H101v-47h49v47h54.46c3.61 0 5.54-3.33 5.54-10V10zm50 140H60v-30h30zm0-51H60V80h30zm50 51h-30v-30h30zm0-51h-30V80h30zm50 51h-30v-30h30zm0-51h-30V80h30z" fill-rule="evenodd"/>
</g>
<g id="bulb" fill-rule="evenodd">
<g><path class="cls-1" d="M80.01 170h100v20h-100zM80 200h100v20H80zM140.67 250H100v-20h60.67l-20 20zM130 10a80.07 80.07 0 00-77.48 100L80 160h100l27.48-50A80.07 80.07 0 00130 10zm30 135h-10l16.36-45H93.64L110 145h-10L80 90h100z"/></g>
</g>
<g id="bullet1" fill-rule="evenodd">
<path d="M170 160H70l30-60h70v60z"/>
</g>
<g id="bullet2" fill-rule="evenodd">
<path d="M220 160H30l30-60h160v60z"/>
</g>
<g id="bus" fill-rule="evenodd">
<path d="M227.6 79.37h-8.8V29.63a10.26 10.26 0 00-10.26-10.26H49.07a10.26 10.26 0 00-10.26 10.26v49.74h-9.59a10.54 10.54 0 00-10.54 10.54v18.92a10.54 10.54 0 0010.54 10.54h9.58v80a10 10 0 0010 10v21.37a8.63 8.63 0 008.63 8.63h16.74a8.6 8.6 0 008.6-8.6v-21.4h91v20.85a9.15 9.15 0 009.15 9.15h15.63a10.26 10.26 0 0010.26-10.26v-19.74a10 10 0 0010-10v-80h8.8a10.54 10.54 0 0010.54-10.54V89.91a10.54 10.54 0 00-10.55-10.54zM89.48 29.24h80.31l-10.55 20H89.48zM76.8 185.84a13 13 0 01-6.26 6.26c-13.51 6.3-26.66-6.85-20.36-20.36a13 13 0 016.26-6.26c13.56-6.3 26.66 6.85 20.36 20.36zm-18-36.42V67.48a5.75 5.75 0 016-5.46h128a5.75 5.75 0 016 5.46v81.94zm148.6 36.42a13 13 0 01-6.26 6.26c-13.51 6.3-26.66-6.85-20.36-20.36a13 13 0 016.26-6.26c13.52-6.3 26.66 6.85 20.36 20.36z" fill-rule="evenodd"/>
</g>
<g id="butchershop" fill-rule="evenodd">
<g><path d="M202.26 10.88s12-3.31 19.42 4.13S225 33.6 225 33.6l-68.13 68.13-22.43-23.38z" fill-rule="evenodd"/><path class="cls-2" d="M30.59 182.32a14.41 14.41 0 000 20.38L87 259.13l101.9-101.9-66.6-66.62zm17.25 1.15a12.9 12.9 0 110 18.24 12.9 12.9 0 010-18.24zM214.08 27.78l-65.17 65-14.47-14.43 65.17-65a10 10 0 0114.13 0l.35.35a10 10 0 01-.01 14.08z"/></g>
</g>
<g id="buy-stock" fill-rule="evenodd">
<g><path class="st0" d="M90 100l-70 70v60c0 5.6 4.5 10 10 10h200c5.6 0 10-4.5 10-10V70l-90 90-60-60zm140 90l-20 20h-40v20l-40-30 40-30v20h60z"/><path class="st0" d="M230 20H30c-5.6 0-10 4.5-10 10v100l70-70 60 60 90-90c0-5.6-4.5-10-10-10z"/></g>
</g>
<g id="calculator" fill-rule="evenodd">
<path d="M220 26a6 6 0 00-6-6H46a6 6 0 00-6 6v208a6 6 0 006 6h168a6 6 0 006-6zM69 50h120l-20 25H69zm26 166H70v-25h25zm0-45H70v-25h25zm0-45H70v-25h25zm47 90h-25v-25h25zm0-45h-25v-25h25zm0-45h-25v-25h25zm48 90h-25v-25h25zm0-45h-25v-25h25zm0-45h-25v-25h25z" fill-rule="evenodd"/>
</g>
<g id="calendar" fill-rule="evenodd">
<path d="M140 190h20v20h-20zm-40 0h20v20h-20zm-40 0h20v20H60zm120-80h20v20h-20zm-40 0h20v20h-20zm-40 0h20v20h-20zm80 40h20v20h-20zm-40 0h20v20h-20zm-40 0h20v20h-20zm-40 0h20v20H60zM50 70h161l-20 20H50zm160-30h21c5.54 0 9 3.29 9 8.66v180.16c0 5.48-3.39 11.18-9 11.18H31c-5.54 0-11-5.82-11-11.18V48.66C20 43.18 25.39 40 31 40h19V20h20v20h120V20h20z" fill-rule="evenodd"/>
</g>
<g id="camera" fill-rule="evenodd">
<path d="M240 59.94h-50v-30h-90l-30 30H20a10 10 0 00-10 10v150a10 10 0 0010 10h220a10 10 0 0010-10v-150a10 10 0 00-10-10zm-200 50v-20h60l-20 20zm125 100a65 65 0 1165-65 65 65 0 01-65 65zm0-111a45.22 45.22 0 00-8 .72v20.59a25 25 0 0132.5 28.68h20.22a45 45 0 00-44.72-50z" fill-rule="evenodd"/>
</g>
<g id="cancelchargecard" fill-rule="evenodd">
<path class="cls-1" d="M210 40H20c-5.5 0-10 4.4-10 9.9V80h120l-20 20H10v108c0 6.6 5.4 12 12 12h28v30l117.6-130H150l30-40 10.8 14.4L240 40V10l-30 30zM202.8 110.4l7.2 9.6h-20v50l-20 20v-44.7L100 220h140c5.5 0 10-4.4 10-9.9V60l-47.2 50.4z"/>
</g>
<g id="carplus" fill-rule="evenodd">
<g><path class="cls-1" d="M214.64 128.76a65 65 0 0118.27 2.62 11.29 11.29 0 006.73-10.29v-10.93a10.91 10.91 0 00-10.92-10.9h-11.37l-19.8-67.9a3.09 3.09 0 00-2.79-2.1H45.26a3.13 3.13 0 00-2.81 2.08L21.79 99.26H10.56a10.91 10.91 0 00-10.92 10.9v10.93a11.14 11.14 0 0010.92 11.17h9.08v86.08a10.91 10.91 0 0010.9 10.92h12.65c6 0 10.45-4.89 10.45-10.92v-9.08h97.87a65 65 0 0163.13-80.5zm-160 30.5a15 15 0 1115-15 15 15 0 01-15 15zm-10-60l15-50h120l15 50z"/><path class="cls-1" d="M222.91 185.5v-32.42h-16.53v32.42h-25.64l-6.78 16.53h32.42v32.42h16.53v-32.42h32.42V185.5h-32.42z"/></g>
</g>
<g id="cash-up" fill-rule="evenodd">
<path d="M238.332 119.168L260 97.5v151.668L238.332 227.5H97.5l21.668-21.668h97.5c11.914 0 21.664-9.75 21.664-21.664zM10.832 32.5h195c6.5 0 10.836 4.332 10.836 10.832v130c0 6.5-4.336 10.836-10.836 10.836h-162.5L0 227.5V43.332C0 36.832 4.332 32.5 10.832 32.5zm105.086 60.668H82.332c5.418-9.75 15.168-16.25 27.086-16.25 8.664 0 16.25 3.25 22.75 8.664L140.832 78c-7.582-8.668-19.5-13-31.414-13C85.582 65 67.168 82.332 65 105.082v3.25c0 23.836 19.5 43.336 44.418 43.336 11.914 0 23.832-4.336 31.414-13L132.168 130c-5.418 5.418-14.086 8.668-22.75 8.668-11.918 0-21.668-6.5-27.086-15.168H104l13-11.918H78v-6.5h24.918zm0 0"/>
</g>
<g id="cash" fill-rule="evenodd">
<path d="M239 100v100H39l-20 20h240V80zm-20-60H-1v140h220zM70.26 120H19l20-20h31.26a40.3 40.3 0 000 20zM109 130a20 20 0 1120-20 20 20 0 01-20 20zm70-10h-31.26a40.3 40.3 0 000-20H199z" fill-rule="evenodd"/>
</g>
<g id="cashregister" fill-rule="evenodd">
<path d="M239.67 124a6 6 0 00.33-2V26a6 6 0 00-6-6H113.87a6 6 0 00-6 6v64H26a6 6 0 00-6 6v138a6 6 0 006 6h207.68a6 6 0 006-6V124zM45 115h20v20H45v-20zm32 0h20v20H77v-20zm32 0h20v20h-20v-20zm-64 32h20v20H45v-20zm32 0h20v20H77v-20zm32 0h20v20h-20v-20zm-64 32h20v20H45v-20zm32 0h51.92v20H76.91v-20zm131.3-39a12.5 12.5 0 1112.48-12.5 12.49 12.49 0 01-12.57 12.5zM128.83 40h91.86v44.58h-91.86V40zm59.81 31.84l18.91-19v-1H144v20zm0 0" fill-rule="evenodd"/>
</g><g id="changeeuro" fill-rule="evenodd"><path d="M86.668 195c-35.75 0-65-29.25-65-65s29.25-65 65-65a83.257 83.257 0 0119.5-19.5c-6.5-1.082-13-2.168-19.5-2.168C39 43.332 0 82.332 0 130c0 47.668 39 86.668 86.668 86.668 6.5 0 13-1.086 19.5-2.168a83.257 83.257 0 01-19.5-19.5zm0 0"/><path d="M173.332 43.332c-47.664 0-86.664 39-86.664 86.668 0 47.668 39 86.668 86.664 86.668C221 216.668 260 177.668 260 130c0-47.668-39-86.668-86.668-86.668zm7.586 71.5l-13 11.918H143v6.5h37.918l-13 11.918H146.25c5.418 9.75 16.25 15.164 27.082 15.164 8.668 0 16.25-3.25 22.75-8.664l8.668 8.664c-7.582 7.586-19.5 13-31.418 13-24.914 0-44.414-19.5-44.414-43.332v-3.25c3.25-22.75 21.664-40.082 45.5-40.082 11.914 0 23.832 4.332 31.414 13l-8.664 8.664c-5.418-5.414-14.086-8.664-22.75-8.664-11.918 0-21.668 6.5-27.086 15.164zm0 0"/></g>
<g id="channels" fill-rule="evenodd">
<path d="M139.8 170.1v79h-19.6v-79h19.6zM130 10.8c65.8 0 119.2 53.4 119.2 119.3 0 31.7-12.3 60.5-32.5 81.8l-2.5 2.5-14-14.1c18-18 29.1-42.8 29.1-70.3 0-54.9-44.5-99.4-99.3-99.4S30.7 75.1 30.7 130c0 26.3 10.2 50.1 26.8 67.9l2.3 2.4-14 14.1C24.2 192.8 10.9 163 10.9 130 10.8 64.2 64.2 10.8 130 10.8zm0 39.8c43.9 0 79.4 35.6 79.4 79.5 0 21-8.2 40.1-21.5 54.4l-2.1 2.2-14.4-14.4c10.9-10.7 17.6-25.6 17.6-42.1 0-32.7-26.4-59.1-59.1-59.1s-59.1 26.5-59.1 59.1c0 15.3 5.8 29.2 15.3 39.7L88 172l-14.4 14.4c-14.3-14.4-23.2-34.2-23.2-56.2.2-44 35.7-79.6 79.6-79.6zm-.4 50c16.5 0 29.8 13.4 29.8 29.8 0 16.5-13.3 29.8-29.8 29.8s-29.8-13.4-29.8-29.8c0-16.5 13.3-29.8 29.8-29.8z" fill-rule="evenodd" clip-rule="evenodd"/>
</g>
<g id="chargecard" fill-rule="evenodd">
<path d="M239 40H19a10 10 0 00-10 9.93V80h120l-20 20H9v110.07A10 10 0 0019 220h220a10 10 0 0010-9.93V49.93A10 10 0 00239 40zm-50 80v50l-20 20v-70h-20l30-40 30 40z"/>
</g>
<g id="chargemovil" fill-rule="evenodd">
<path class="cls-1" d="M120 230a10 10 0 1110 10 10 10 0 01-10-10zm-30-60l80-80v100H90zM70 30h120v180H70zM50 20a10 10 0 0110-10h140a10 10 0 0110 10v220a10 10 0 01-10 10H60a10 10 0 01-10-10z"/><path class="cls-1" d="M90 150l80-80V50l-80 80v20z"/>
</g>
<g id="checkmark" fill-rule="evenodd">
<path fill-rule="evenodd" d="M42 140.78l14.14-14.14 49.5 49.5L218.78 63l14.14 14.14-112.38 112.38-14.9 14.9L42 140.78z"/>
</g>
<g id="cinema" fill-rule="evenodd">
<g><path class="cls-1" d="M50.41 110.87h26.67l8.89 140H68.19l-17.78-140zM94.86 110.87h26.66v140h-17.77l-8.89-140zM139.3 110.87h26.67l-8.89 140H139.3v-140zM183.75 110.87h26.66l-17.78 140h-17.77l8.89-140zM200.6 73a27.9 27.9 0 00.92-7.14c0-12.35-8-22.61-18.43-24.63a14.29 14.29 0 00-8.56-9.63c-1.8-11.77-10.91-20.74-21.89-20.74s-20.23 9.09-21.93 21a11.84 11.84 0 00-9.66.08c-1.54-6.37-6.7-11.07-12.85-11.07s-11.1 4.49-12.76 10.65a14.25 14.25 0 00-8.81 9.72 22 22 0 00-14 9.63c-7.36 0-13.33 6.72-13.33 15a16.44 16.44 0 001.48 6.84c-6.11 3.16-10.37 10.1-10.37 18.16h160c0-7.82-4-14.57-9.81-17.87z"/></g>
</g>
<g id="clock" fill-rule="evenodd">
<path d="M130 10a120 120 0 10120 120A120 120 0 00130 10zm40 130h-50V50l20 20v50h50z"/>
</g>
<g id="close" fill-rule="evenodd">
<path fill-rule="evenodd" d="M61 216.06L45.44 200.5l70.71-70.71-69.3-69.29L61 46.35l69.29 69.3L201 44.94l15.56 15.56-70.71 70.71 70.71 70.71-14.14 14.14-70.71-70.71L61 216.06z"/>
</g>
<g id="cloud" fill-rule="evenodd">
<path d="M251 155a65 65 0 00-65-65c-1.44 0-2.87.06-4.29.16A90 90 0 00101 40h-4.73c-47.34 0-85.71 40.3-85.71 90s38.37 90 85.71 90h94.29c29.09 0 53.34-21.74 58.83-50.58A65.14 65.14 0 00251 155z" fill-rule="evenodd"/>
</g>
<g id="coffeshop" fill-rule="evenodd">
<g><path class="cls-1" d="M10 220h220v24H10zM243.73 20H20v137c0 28.53 22.93 44 51.24 44h74.22c28.31 0 54.54-15.45 54.54-44v-47h43.73a6.44 6.44 0 006.27-6.46V28.31c0-3.47-2.82-8.31-6.27-8.31zM50 97.86V50h20v70zM230 90h-30V40h30z"/></g>
</g>
<g id="collapse" fill-rule="evenodd">
<path fill-rule="evenodd" d="M170 140H60v-20h130l-20 20z"/>
</g>
<g id="color" fill-rule="evenodd">
<g><path class="cls-1" d="M207.25 227.2c0-16.49 18.34-29.35 21.38-45.6 3.07 16.27 21.38 29.21 21.38 45.6 0 12.59-9.57 22.8-21.38 22.8s-21.38-10.21-21.38-22.8zM228 141.44l-4.42-5.36-74.09-89.9-34-41.28-18.66 15.37 27.94 33.89-101.29 83.5c-4.26 3.51-4.6 9-1.09 13.3l78.53 95.27c3.51 4.26 9.11 5.1 13.37 1.6l111.55-92c4.26-3.48 5.69-10.13 2.16-14.39zm-180 4.41l91.51-75.44 61.65 75.38z"/></g>
</g>
<g id="commercialoffer" fill-rule="evenodd">
<path class="cls-1" d="M184.34 130.18a65 65 0 1065 65 65 65 0 00-65-65zm22.95 97.2l-22.51-13.71-22.51 13.71 6-25.83-19.89-17.38 26.19-2.24 10.23-24.36 10.2 24.35 26.19 2.24-19.89 17.38z"/><path class="cls-1" d="M184.81 109.65a84.47 84.47 0 0135.19 7.66V16a6 6 0 00-6-6H46a6 6 0 00-6 6v228a6 6 0 006 6h74.42a84.93 84.93 0 0164.39-140.39zM70 40h118l-20 20H70zm0 40h70l-20 20H70z"/>
</g>
<g id="communication" fill-rule="evenodd">
<g><path class="cls-1" d="M210 174.6V29c0-5-4.89-9-9.92-9H9a9 9 0 00-9 9v191l37.36-38h162.72c5.03 0 9.92-2.41 9.92-7.4zM120 120H40v-20h100zm40-40H40V60h140z"/><path class="cls-1" d="M253.77 110H230v65.69A24.53 24.53 0 01205.14 200H100v21.81c0 3.54 3.08 8.19 6.66 8.19h123.73L260 260V116.53a6.35 6.35 0 00-6.23-6.53z"/></g>
</g>
<g id="communicationpublic" fill-rule="evenodd">
<g><path class="cls-1" d="M87.74 44.05c-3.06-3.08-5.39-2.68-6 1.52L72 119.39l51.62 52.42 71.38-9.57c4.25-.61 5.92-4.2 2.81-7.34zM168.37 104h23.48a47.11 47.11 0 00-47-47.29v23.68A23.56 23.56 0 01168.37 104z"/><path class="cls-1" d="M144.91 9.44v23.65c38.91 0 70.44 31.75 70.43 70.94h23.48c.01-52.26-42.04-94.6-93.91-94.59zM97.73 197l12.93-13-52.19-52.63-45.8 46.13c-3.07 3.09-2.06 9.05.75 11.88l40.84 41.13c2.75 2.77 7.55 2.62 10.6-.45L78 216.81l29 29.25a11.47 11.47 0 0016.25 0l3.47-3.49a11.67 11.67 0 000-16.37z"/></g>
</g>
<g id="confectionery" fill-rule="evenodd">
<g><path class="cls-1" d="M230.41 103.09s-13.18-13.22-47.18-23.56c-2.1-.64-4.22-1.21-6.33-1.75a25 25 0 11-49.48-6.72l-7-.69-88.22 66.27a6.25 6.25 0 00-1.83 4.42v103.06a6.25 6.25 0 007.65 6.1l187.54-43a6.25 6.25 0 004.86-6.1v-98.03zm-20.67 91L47.6 231.24v-20.69l171.63-39.27zm0-41.36L47.6 189.87v-20.68l171.63-39.27z"/><path class="cls-1" d="M152 90.6a15 15 0 1115-15 15 15 0 01-15 15z"/><path class="cls-1" d="M155.62 60.18l-.06.19s14.25-2.43 24.35-6.87 15.77-22.64 15.77-22.64-22.24 4.45-29.52 11.73l-.35.37c.75-1.56 1.44-3.12 2-4.66C171.86 28 163 11.13 163 11.13S150.41 30 150.41 40.29s5.08 20.08 5.08 20.08z"/></g>
</g>
<g id="configuration" fill-rule="evenodd">
<path d="M130.23 180.23a25 25 0 1025 25 25 25 0 00-25-25zm0-75a25 25 0 1025 25 25 25 0 00-25-25zm0-25a25 25 0 10-25-25 25 25 0 0025 25z"/>
</g>
<g id="consult" fill-rule="evenodd">
<path class="cls-1" d="M218.43 203.88a65.48 65.48 0 10-14.55 14.55L245.45 260 260 245.45zm-23.88-38.43a29.09 29.09 0 00-29.09-29.09v-14.54a43.64 43.64 0 0143.64 43.64z"/><path class="cls-1" d="M100.27 220H56a6 6 0 01-6-6V36a6 6 0 016-6h138a6 6 0 016 6v51.57a85.2 85.2 0 0120 12.7V16a6 6 0 00-6-6H36a6 6 0 00-6 6v218a6 6 0 006 6h89.05a85.55 85.55 0 01-24.78-20z"/>
</g>
<g id="continue" fill-rule="evenodd">
<path d="M130 10a120 120 0 10120 120A120 120 0 00130 10zm14.14 145.86L130 170l-56.57-56.57 14.14-14.14L130 141.72l42.43-42.43 14.14 14.14z" fill-rule="evenodd"/>
</g>
<g id="copy" fill-rule="evenodd">
<path d="M200 189.83V29.7a9.94 9.94 0 00-9.93-9.93H29.93A9.94 9.94 0 0020 29.7v160.13a9.94 9.94 0 009.93 9.93h160.14a9.94 9.94 0 009.93-9.93zm20-110.06v140H80l-20 20h170.07a9.93 9.93 0 009.93-9.93V59.77z"/>
</g>
<g id="copycard" fill-rule="evenodd">
<path d="M220 180V40a10 10 0 00-10-10H10A10 10 0 000 40v20h180l-20 20H0v100a10 10 0 0010 10h200a10 10 0 0010-10zm-60-20h-40v-20h60zm80-90v140H40l-20 20h240V50z" fill-rule="evenodd"/>
</g>
<g id="correct" fill-rule="evenodd">
<path d="M130 10a120 120 0 10120 120A120 120 0 00130 10zm-9.53 157.81L105.25 183l-42.43-42.39L77 126.46l28.28 28.28L183 77l14.14 14.14z" fill-rule="evenodd"/>
</g>
<g id="correctlocation" fill-rule="evenodd">
<path d="M130 10C74.8 10 30 54.8 30 110v3c2 88.3 91.6 144.7 91.6 144.7 4.6 3.1 12 3.1 16.5.1 0 0 89.8-56.5 91.8-144.8v-3c0-55.2-44.7-100-99.9-100zm-19.2 150l-46-46L79 99.9l31.8 31.8 65-65.1L190 80.8 110.8 160z"/>
</g>
<g id="couple" fill-rule="evenodd">
<g><path class="cls-1" d="M164.23 59.97l-30 120h19.83v70h20v-70h20v70h20v-70h20.17l-30-120h-40zM250.43 139.3l-21-79.33h-15.4l20.15 73.81 16.25 5.52zM140.43 133.78l-3.13-11.02 17.13-62.79h-15.4l-9.2 36.53-10.4-36.53h-15.4l18.2 66.68-1.8 7.13h20zM35.43 59.97v190h20v-100h20v100h20v-190h-60z"/><circle class="cls-1" cx="65.43" cy="29.85" r="20"/><path class="cls-1" d="M10.43 149.97l15-15v-75h-15v90zM170.38 44.25a19.95 19.95 0 0027.71 0H204c0-3.58.42-8.46.18-13.41 0-.33.05-.66.05-1a19.93 19.93 0 00-1.09-6.47c-1.87-7.31-6.7-13.32-18.55-13.52H184c-24.1 0-20 23.36-20 34.4z"/></g>
</g>
<g id="creditcard" fill-rule="evenodd">
<path d="M139 160h70l-20 20h-50zM9 80h200l-20 20H9zm0-30.07A10 10 0 0119 40h220a10 10 0 0110 9.93v160.14a10 10 0 01-10 9.93H19a10 10 0 01-10-9.93z" fill-rule="evenodd"/>
</g>
<g id="currencyexchange" fill-rule="evenodd">
<path class="cls-1" d="M76.86 188.54a60 60 0 010-117.08A110.58 110.58 0 01105 41.25a90 90 0 100 177.49 110.58 110.58 0 01-28.14-30.2z"/><path class="cls-1" d="M170 40a90 90 0 1090 90 90 90 0 00-90-90zm9 133.13V190h-.55L163 182.56v-8.36a60.42 60.42 0 01-21.48-5.46l-.92-.43-.6-.31.1-.6.15-.9 1.87-11.5.33-2 .22-1.34 1.25.74 1.88 1.12a45.86 45.86 0 0022.91 6.75c8.77 0 14.08-4 14.08-10.5s-2.84-9-16.26-14.42c-19.42-7.93-25.34-13.94-25.34-26.17 0-12 8.82-20.68 21.82-23.27V70h.87L179 77.44v8.15a40.21 40.21 0 0114.66 4.49l1 .44.57.3-.1.58-.15.88-2 11.32-.38 2.13-.25 1.42-1.27-.87-1.87-1.28a32.47 32.47 0 00-18-5.7c-8.33 0-12.87 3.37-12.87 9.05 0 5.32 2.94 7.79 16.14 13.22 19.48 8 25.3 14.34 25.3 27.37.03 12.06-7.78 20.99-20.78 24.19z"/>
</g>
<g id="delete" fill-rule="evenodd">
<path d="M94.7 50c-3 0-6 1.2-8.2 3.2l-73 68.3c-4.7 4.7-4.7 12.3 0 17l73 68.3c2.2 2.1 5.2 3.2 8.2 3.2H238c6.6 0 12-5.4 12-12V62c0-6.6-5.4-12-12-12H94.7zm101.5 128.6l-35.4-35.3-36.7 36.7-14.1-14.1 36.7-36.7-35.3-35.4 14.2-14.2 35.3 35.3 35.4-35.4 14.1 14.1L175 129l35.4 35.4-14.2 14.2z" fill-rule="evenodd" clip-rule="evenodd"/>
</g>
<g id="deposit" fill-rule="evenodd">
<path d="M200 60H60v20h30l-20 20H60v60h30l-20 20H60v20h140zm-40 90a20 20 0 1120-20 20 20 0 01-20 20zm70-130H30a10 10 0 00-10 10v200a10 10 0 0010 10h200a10 10 0 0010-10V30a10 10 0 00-10-10zm-10 200H40V40h180z"/>
</g>
<g id="desktop" fill-rule="evenodd">
<path class="cls-1" d="M240.23 20h-220a10 10 0 00-10 10v160a10 10 0 0010 10h220a10 10 0 0010-10V30a10 10 0 00-10-10zm-10 160h-200V40h200z"/><path fill-rule="evenodd" d="M200.23 60h-150v100h50l100-100z"/><path class="cls-1" d="M.23 220h260v20H.23z"/>
</g>
<g id="digitalcard" fill-rule="evenodd">
<path class="cls-1" d="M170 190v20H50V30h120v20h20V20a9.73 9.73 0 00-9.68-10h-140A10.27 10.27 0 0030 20v220a10.29 10.29 0 0010.34 10h140a9.71 9.71 0 009.66-10v-50zm-59.67 50a10 10 0 1110-10 10 10 0 01-10 10z"/><path class="cls-1" d="M234 70H106a6 6 0 00-6 6v14h120l-20 20H100v54a6 6 0 006 6h128a6 6 0 006-6V76a6 6 0 00-6-6z"/>
</g>
<g id="digitalsignature" fill-rule="evenodd">
<path d="M195 43.332h-21.668V32.5H65v173.332h108.332V195H195v43.332c0 6.5-4.332 10.836-10.832 10.836h-130c-6.5 0-10.836-4.336-10.836-10.836V21.668c0-6.5 4.336-10.836 10.836-10.836h130c6.5 0 10.832 4.336 10.832 10.836zm-75.832 195c6.5 0 10.832-4.332 10.832-10.832 0-6.5-4.332-10.832-10.832-10.832-6.5 0-10.836 4.332-10.836 10.832 0 6.5 4.336 10.832 10.836 10.832zm54.164-151.664L184.168 97.5h21.664l-21.664-21.668L198.25 61.75c4.332-4.332 10.832-4.332 15.168 0l17.332 17.332c4.332 4.336 4.332 10.836 0 15.168l-88.832 89.918h-33.586v-32.5zm10.836 75.832H227.5v21.668h-65zm0 0"/>
</g>
<g id="directory" fill-rule="evenodd">
<g><path class="cls-1" d="M220 110h-20v60h20zM200 190v60h20v-60z"/><path class="cls-1" d="M180 229.94V89.82a12 12 0 002 .18h38V22a12 12 0 00-12-12h-26a12 12 0 00-2 .18V10H67.24c-2.9 1-8 1.58-10.67 3C47.24 17.72 41.74 25.55 41 36v186.7c0 13 9 23.58 21.57 26.56 2.36.56-4.16.72-1.72.73h119.14zM110 70a20 20 0 11-20 20 20 20 0 0120-20zm40 90H70v-4.23A36.66 36.66 0 0197.45 120a27.43 27.43 0 0025.1 0A36.68 36.68 0 01150 155.77z"/></g>
</g>
<g id="dischargecard" fill-rule="evenodd">
<path d="M240 40H20a10 10 0 00-10 9.93V80h120l-20 20H10v110.07A10 10 0 0020 220h220a10 10 0 0010-9.93V49.93A10 10 0 00240 40zm-60 150l-30-40h20v-50l20-20v70h20z"/>
</g>
<g id="discount" fill-rule="evenodd">
<path d="M250 97.13V46.51c0-3.74-1.43-7.51-5-7.51H18c-3.62 0-8 3.78-8 7.51v50.62c17 0 31.64 14.61 31.64 32.62S27 162.38 10 162.38V213c0 3.74 4.43 6 8 6h227c3.62 0 5-2.27 5-6v-50.62c-17 0-31.64-14.61-31.64-32.63S233 97.13 250 97.13zM91.5 78.88A20.11 20.11 0 1171.5 99a20.06 20.06 0 0120-20.12zm80 100.56a20.11 20.11 0 1120-20.11 20.06 20.06 0 01-20 20.11zm-70-.44h-30l90-101h30z" fill-rule="evenodd"/>
</g>
<g id="document" fill-rule="evenodd">
<path d="M160.23 10H46.6a6.54 6.54 0 00-6.6 6.28v227.45a6.53 6.53 0 006.61 6.27h167.24a6.12 6.12 0 006.15-6.26V70zm24.33 83H140V10h20v63h44.56z" fill-rule="evenodd"/>
</g>
<g id="dollar" fill-rule="evenodd">
<path d="M129 10a120 120 0 10120 120A120 120 0 00129 10zm10 178.87V210l-20-10v-10.44a81.24 81.24 0 01-27.5-7.72l3.34-20.57c9.69 5.78 21.71 10.37 33.24 10.37 10.19 0 17.2-4.93 17.2-14.28 0-8.67-4-12.24-20.71-19.55-22.38-9.35-31.4-16.83-31.4-35 0-16.86 10.37-28 25.83-31.56V50l20 10v10.44a58.31 58.31 0 0121.82 6.69l-3.34 20.4c-8.35-5.61-18.21-9.18-27.23-9.18-11 0-15.87 5.44-15.87 12.58 0 7.48 3.67 11 19.71 17.85 23.72 9.86 32.41 18.19 32.41 36.37 0 18.85-11.18 30.26-27.5 33.72z" fill-rule="evenodd"/>
</g>
<g id="donation" fill-rule="evenodd">
<path d="M130 10a120 120 0 10120 120A120 120 0 00130 10zm47 60a20 20 0 11-20 20 20 20 0 0120-20zm-94 0a20 20 0 11-20 20 20 20 0 0120-20zm113.44 87.6a69 69 0 01-132.53 0 6 6 0 015.79-7.6h120.95a6 6 0 015.79 7.6z" fill-rule="evenodd"/>
</g>
<g id="down-arrow" fill-rule="evenodd">
<path d="M180 100H80l50 60z"/>
</g>
<g id="down" fill-rule="evenodd">
<path fill-rule="evenodd" clip-rule="evenodd" d="M145.6 194.6l56.5-56.6 21.2 21.1-92.4 92.1-91.6-91.4 21.1-21.1 55.5 55.5v-183L145.6 40z"/>
</g>
<g id="download" fill-rule="evenodd">
<path d="M130 10a120 120 0 10120 120A120 120 0 00130 10zm-.31 200L68 148.34l14.26-14.28 37.37 37.5L119.3 50 139 70v101.83l38.4-38.2 14.43 14.26z" fill-rule="evenodd"/>
</g>
<g id="edit" fill-rule="evenodd">
<path d="M236.08 58.81l-35.72-35.88a9.9 9.9 0 00-14.08 0L154.39 55l34.85 35h-29.87l-19.91-20L20 190v50h49.77L236.05 73a10 10 0 00.03-14.19zM120 220l-20 20h140v-20z"/>
</g>
<g id="education" fill-rule="evenodd">
<path d="M55.45 143.49V189L135 232.55 214.55 189v-45.51L135 187zM135 27.55L10 95.89l125 68.33 102.27-55.92V187H260V95.89z"/>
</g>
<g id="email" fill-rule="evenodd">
<path d="M244.46 40H15.54A5.52 5.52 0 0010 45.51v169a5.53 5.53 0 005.54 5.49h228.92a5.52 5.52 0 005.54-5.51v-169a5.53 5.53 0 00-5.54-5.49zM129.93 150L30 89.9V66l100 60.3L230 66v23.9L130 150" fill-rule="evenodd"/>
</g>
<g id="endcall" fill-rule="evenodd">
<path class="st0" d="M250 145.2c-29.4-33.1-72.3-54-120-54-47.8 0-90.6 20.9-120 54l.2.1V172.9c0 2.9 2.3 5 5.2 4.8l57.3-5c2.9-.3 5.2-2.8 5.2-5.7v-9.1-20.6c15.6-7.3 33.9-11.4 52.1-11.4 18.7 0 36.5 4.1 52.1 11.4V167c0 2.9 2.4 5.4 5.3 5.7l57.3 5c2.9.3 5.2-1.9 5.2-4.8v-23.4c0-.5.1-.9 0-1.4v-2.8h.1v-.1z"/>
</g>
<g id="entertainment" fill-rule="evenodd">
<path d="M250 97.5V46.8c.1-3.7-2.8-6.8-6.5-6.8H90v40H70V40H16.5c-3.7.1-6.6 3.2-6.5 6.8v50.6c17 0 31.6 14.6 31.6 32.6S27 162.7 10 162.7v50.6c-.1 3.6 2.8 6.6 6.5 6.7H70v-40h20v40h153.5c3.6 0 6.6-3 6.5-6.6v-50.7c-17.5 0-31.6-14.6-31.6-32.6s14.1-32.6 31.6-32.6zM90 150H70v-42h20v42z" fill-rule="evenodd" clip-rule="evenodd"/>
</g>
<g id="entretainment" fill-rule="evenodd">
<path d="M250 92.47V41.85a6.72 6.72 0 00-6.54-6.85H90v40H70V35H16.54A6.73 6.73 0 0010 41.85v50.62c17 0 31.64 14.61 31.64 32.62S27 157.72 10 157.72v50.62a6.56 6.56 0 006.54 6.66H70v-40h20v40h153.46a6.57 6.57 0 006.54-6.66v-50.62c-17.47 0-31.64-14.61-31.64-32.63S232.53 92.47 250 92.47zM90 145H70v-42h20z" fill-rule="evenodd"/>
</g>
<g id="error" fill-rule="evenodd">
<path d="M130 10a120 120 0 10120 120A120 120 0 00130 10zm64.35 170.2l-14.15 14.15-49.5-49.5-49.5 49.5-15.55-15.56 49.5-49.5-48.08-48.08 14.14-14.14 48.08 48.08 49.5-49.5 15.56 15.56-49.5 49.5z" fill-rule="evenodd"/>
</g>
<g id="euro" fill-rule="evenodd">
<path d="M129 10a120 120 0 10120 120A120 120 0 00129 10zm10 95l-20 20H79.25c-.16 1.64-.25 3.31-.25 5s.09 3.36.25 5H139l-20 20H85.71a50 50 0 0078.65 10.36l14.14 14.14A70 70 0 0159 130c0-1.68.08-3.35.2-5H59l.21-.21A70 70 0 01178.5 80.5l-14.14 14.14A50 50 0 0085.71 105z" fill-rule="evenodd"/>
</g>
<g id="excel" fill-rule="evenodd">
<path d="M160.63 10H47c-3.51 0-7 2.82-7 6.28v227.45c0 3.47 3.49 6.27 7 6.27h167.25c3.54 0 5.75-2.8 5.75-6.26V70zm-68 149l-9.43-16.27L74.33 159H59.14l16.49-27.87L60.29 106H76.7l8 14 7.3-14h14.8L92 131.28 108.68 159zm60.37 0h-37v-53h14v41h23zm26.74 1c-12.17 0-19.44-5.47-24-12.75l10.66-6.62a16.49 16.49 0 0014 8.06c4.39 0 7.71-1.3 7.71-4.61s-4.25-4.68-9.5-6c-8.71-2.23-20.31-4.46-20.31-16.56 0-10.87 8.21-16.85 20.31-16.85 11.31 0 18.07 5.26 22.32 10.44l-9.65 7.92c-3-3.6-8.14-6.7-12.74-6.7-4.11 0-6.19 1.37-6.19 3.89 0 3.53 4.18 4.82 9.43 6.12 8.71 2.09 20.38 4.75 20.38 16.71-.03 8.53-6.01 16.95-22.42 16.95z" fill-rule="evenodd"/>
</g>
<g id="executive" fill-rule="evenodd">
<g><circle class="cls-1" cx="130" cy="70.04" r="50.04"/><path class="cls-1" d="M161.36 132.66a72.29 72.29 0 01-21.36 6.72v.72l10 70.06-20 20-20-20 10-70.06v-.72a64.78 64.78 0 01-21.36-6.72A90 90 0 0030 220.17V240h200v-19.83a90.08 90.08 0 00-68.64-87.51z"/></g>
</g>
<g id="expand" fill-rule="evenodd">
<path fill-rule="evenodd" d="M200 120h-60V70h-20v50H70v20h50v50h20v-50h40l20-20z"/>
</g>
<g id="exploration" fill-rule="evenodd">
<path class="st0" d="M130 10C63.7 10 10 63.7 10 130s53.7 120 120 120 120-53.7 120-120S196.3 10 130 10zm21.2 140.5L59.3 200l49.8-92.2 91.6-49.2-49.5 91.9z"/><circle transform="rotate(-45.001 129.997 130.002)" class="st0" cx="130" cy="130" r="15"/>
</g>
<g id="expressaccount" fill-rule="evenodd">
<path class="cls-1" d="M234.53 100l-17.59 99.71H22.58L-1 220h235.31L259 80l-24.47 20z"/><path class="cls-1" d="M23.69 40L-1 180h202.37l24.68-140zM48.4 70h60L84.87 90h-40zm107.72 70H36.05l3.53-20h140z"/>
</g>
<g id="facebook" fill-rule="evenodd">
<path d="M130 10a120 120 0 10120 120A120 120 0 00130 10zm33 73h-13.94C138.75 83 137 88.19 137 95.34V111h24.4l-3.28 25H137v64h-25v-64H90v-25h22V92.9c0-21.3 13-32.9 31.91-32.9A174.26 174.26 0 01163 61z" fill-rule="evenodd"/>
</g>
<g id="facebook2" fill-rule="evenodd">
<path d="M169.33 56.44c-16.18 0-19.21 7.8-19.21 19v24.94h38.57l-5.14 39.07h-33.43v100.23h-40.27V139.46H76.29v-39.07h33.56V71.62C109.85 38.21 130.25 20 160 20a255.71 255.71 0 0130 1.59v34.85z" fill-rule="evenodd"/>
</g>
<g id="fastfood" fill-rule="evenodd">
<g><path class="cls-1" d="M20.41 224.12a16.25 16.25 0 0016.25 16.25h104.17a16.25 16.25 0 0016.25-16.25v-3.75H20.41zM157.08 176.62a16.25 16.25 0 00-16.25-16.25H36.66a16.25 16.25 0 00-16.25 16.25v3.75h136.67z"/><rect class="cls-1" x="10.41" y="190.37" width="160" height="20" rx="8.13" ry="8.13"/><path class="cls-1" d="M100.41 50.37v20h140v-20h-140zM180.41 10.37h20v30h-20zM123.27 100.37h57.14l-10 20h-44.28l3.33 28h14.7a27.28 27.28 0 0127.25 27.25v5.07a19.14 19.14 0 0110 16.8v3.75a19.14 19.14 0 01-10 16.8v5.07a27.12 27.12 0 01-6.17 17.25h35.17l20-160h-100z"/></g>
</g>
<g id="favorite" fill-rule="evenodd">
<path d="M129.39 75C125.24 43.91 100.23 20 70 20c-33.14 0-60 28.73-60 64.17a69.13 69.13 0 00.61 9.17H10C10 166.67 130 240 130 240s120-73.33 120-146.67h-.61a69.15 69.15 0 00.61-9.17C250 48.73 223.14 20 190 20c-30.23 0-55.24 23.91-59.39 55h-1.21z" fill-rule="evenodd"/>
</g>
<g id="favoritestar" fill-rule="evenodd">
<path d="M164 83.38L129 9.95 95 83.52a11.05 11.05 0 01-8.33 6.3L10 101.79 66.37 159a11.05 11.05 0 013 9.45l-12.6 81.19 68.28-38.14a11.05 11.05 0 0110.7 0l68.89 37.75-13.85-81.11a11.05 11.05 0 012.94-9.53l55.45-57.51-76.87-11.55a11.05 11.05 0 01-8.31-6.17z"/>
</g>
<g id="feedback" fill-rule="evenodd">
<path d="M240 20H20c-5.5 0-10 4.5-10 10v210l40-40h190c5.5 0 10-4.5 10-10V30c0-5.5-4.5-10-10-10zM90 120L50 90l40-30v20h60l-20 20H90v20zm80 40v-20h-60l20-20h40v-20l40 30-40 30z"/>
</g>
<g id="filter" fill-rule="evenodd">
<g><path d="M79.17 147.97l-24.25 24.26V64.9H35.48v107.33l-24.26-24.26L-.1 159.29l33.97 33.98L45.2 204.6l45.3-45.31-11.33-11.32z"/><path class="cls-2" d="M99.67 175.1v25h99.72l9.62-25H99.67zM99.67 120v25h124.29l9.58-25H99.67zM99.67 64.9v25h149.85l9.48-25H99.67z"/></g>
</g>
<g id="fingerprint" fill-rule="evenodd">
<path d="M120 100a10 10 0 0120 0v60a10 10 0 01-20 0zm-20 0a30 30 0 0160 0v60a30 30 0 01-60 0zm-20 0a50 50 0 01100 0v60a50 50 0 01-100 0zm140 50v10a90 90 0 01-178.16 18.16L60 160a70 70 0 00140 0v-30zm0-30v-19.95a90 90 0 10-180 0V150l20-20v-30a70 70 0 01140 0z" fill-rule="evenodd"/>
</g>
<g id="firstpage" fill-rule="evenodd">
<path class="cls-1" transform="rotate(135 145.051 150.504)" d="M135.05 110.51h20v80h-20z"/><path class="cls-1" transform="rotate(135 145.05 108.08)" d="M105.05 98.08h80v20h-80z"/><path class="cls-1" transform="rotate(180 79.765 129.645)" d="M69.76 69.65h20v120h-20z"/>
</g>
<g id="florist" fill-rule="evenodd">
<path d="M118.61 211.55v-69.2a53.42 53.42 0 01-39.55-51.58V11h1.81l33.78 33.8V11h1.81l33.78 33.8V11h1.81l33.8 34.12v45.65A53.42 53.42 0 01145 142.69V209l75.23-75.36s5.66 58.59-12.76 86.39c-15.79 23.83-52.35 29.67-62.47 30.85v.12h-1c-1.06.11-1.65.15-1.65.15V251h-23.67v.15S72 247.8 53.58 220s-12.76-86.39-12.76-86.39l77.79 77.93zm0 0" fill-rule="evenodd"/>
</g>
<g id="fold" fill-rule="evenodd">
<path class="cls-1" transform="rotate(-135 108.787 125.356)" d="M98.79 85.36h20v80h-20z"/><path class="cls-1" transform="rotate(-135 151.215 125.355)" d="M111.21 115.36h80v20h-80z"/>
</g>
<g id="folder" fill-rule="evenodd">
<path d="M60.92 110.02L40.916 90.015H230.95V62.01c0-6.601-5.401-12.002-12.003-12.002H80.923L60.92 30.005H22.913c-6.601 0-12.002 5.401-12.002 12.002v156.028c0 6.6 5.4 12.002 12.002 12.002h198.035c5.8 0 10.802-4.101 11.802-9.802l18.003-76.213c1.2-7.302-4.4-14.003-11.802-14.003H60.92z" fill-rule="evenodd"/>
</g>
<g id="football" fill-rule="evenodd">
<path d="M249.64 119.26A120 120 0 0063.32 30.62l-.15-.21-8.08 5.9.17.23a120.61 120.61 0 00-28.43 32.69 119.23 119.23 0 00-16.16 49.86c-.34 3.69-.52 7.42-.52 11.19a120 120 0 004.45 32.48l-.32.1 3.11 9.5.32-.1a119.89 119.89 0 00107.44 77.9v.12h10v-.1a120 120 0 00115-119.88c-.01-3.74-.15-7.41-.51-11.04zm-223.53 1.57a12 12 0 01-3.77-11.12 108.89 108.89 0 018.38-25.91 12 12 0 019.62-6.85l41.25-4.35 15.8 21.65a6 6 0 01.86 5.39l-12 37.08a6 6 0 01-3.84 3.85l-25.17 8.24zm62.58 105.29a12 12 0 01-11.79.12 110 110 0 01-22-16.06A12 12 0 0151.47 199l8.63-40.6 28.36-9.28a6 6 0 015.39.85l28.65 20.81a6 6 0 012.5 4.82l.07 29.53zm20.26-137.17a6 6 0 01-4.85-2.46L89.79 66.88l17.11-38.44a12 12 0 019.41-7 110.59 110.59 0 0127-.08 12 12 0 019.46 7l17 38.16-14.38 19.94a6 6 0 01-4.86 2.48zm95.91 121.7a110.06 110.06 0 01-21.77 15.77 12 12 0 01-11.76-.14L135 205.32v-29.51a6 6 0 012.47-4.87l29-21a6 6 0 015.37-.86l27.79 9 8.8 41.39a12 12 0 01-3.58 11.18zm29.24-90.23l-31.25 28.14-25-8.06a6 6 0 01-3.86-3.86L161.74 99a6 6 0 01.84-5.37l15.2-21L220 77a12 12 0 019.59 6.78 108.91 108.91 0 018.3 25.48 12 12 0 01-3.79 11.16z"/>
</g>
<g id="forward" fill-rule="evenodd">
<path transform="rotate(-45.001 134.64 108.793)" class="st0" d="M124.6 68.8h20v80h-20z"/><path transform="rotate(-45.001 134.635 151.219)" class="st0" d="M94.6 141.2h80v20h-80z"/>
</g>
<g id="francesgo" fill-rule="evenodd">
<path d="M33.6 104.6c0 72 96.6 155.4 96.6 155.4s56.6-49.1 83.3-104.4l.6-1.2c.8-1.6 1.4-3.1 2.1-4.7l.6-1.3c.7-1.6 1.3-3.3 2-4.9l.4-1 1.2-3.4a111.36 111.36 0 006-25.5h-96.7c-4.9 7.4-14.8 22.7-15.1 23.4s10.1 16 15.1 23.4h28.9c-4.5 6.6-9.3 13.4-14.9 20.2-4.5 5.7-9.1 11-13.4 15.9-4.2-4.5-8.4-9.6-12.8-14.9C93.1 151.4 79 123.3 79 104.5a51.38 51.38 0 01100.9-12.4h46.2A96 96 0 00130.3 10a95.69 95.69 0 00-96.7 94.6"/><path d="M33.87 98.93c0 72 96.6 155.4 96.6 155.4s56.6-49.1 83.3-104.4l.6-1.2c.8-1.6 1.4-3.1 2.1-4.7l.6-1.3c.7-1.6 1.3-3.3 2-4.9l.4-1 1.2-3.4a111.36 111.36 0 006-25.5H130c-4.9 7.4-14.8 22.7-15.1 23.4s10.1 16 15.1 23.4h28.9c-4.5 6.6-9.3 13.4-14.9 20.2-4.5 5.7-9.1 11-13.4 15.9-4.2-4.5-8.4-9.6-12.8-14.9-24.4-30.2-38.5-58.3-38.5-77.1a51.38 51.38 0 01100.9-12.4h46.2a96 96 0 00-95.8-82.1 95.69 95.69 0 00-96.7 94.6"/>
</g>
<g id="fraud" fill-rule="evenodd">
<path d="M240 30c0-5.5-4.5-10-10-10H30c-5.5 0-10 4.4-10 9.9V100c0 140 110 150 110 150s110-10 110-150V30zm-74 134.1l-35.4-35.3-36.7 36.7-14.1-14.1 36.7-36.7-35.3-35.5L95.3 65l35.3 35.3L166 65l14.1 14.1-35.3 35.4 35.4 35.4-14.2 14.2z"/>
</g>
<g id="free-dollar" fill-rule="evenodd">
<path class="st0" d="M194.7 144.1c.3-4.6.5-9.3.5-14.1 0-66.2-32.1-110-87.9-110C51.7 20 19 63.8 19 130s32.7 110 88.2 110c40.6 0 68.6-23.1 80.9-61.1-1.7-3.7-2.7-8-2.7-13.2.1-8.5 3.4-16 9.3-21.6zm-87.5 59.5c-26.6 0-41.8-25.2-41.8-73.6s14.3-72.8 41.8-72.8c26.6 0 41.8 24.3 41.8 72.8.1 48.4-14.6 73.6-41.8 73.6zM225.9 177.1c-12.1-5-14.7-7.2-14.7-12.1 0-5.2 4.2-8.3 11.8-8.3 5.7 0 11.6 1.9 16.4 5.2l1.7 1.2 1.2.8.2-1.3.3-1.9 1.8-10.3.1-.8.1-.5-.5-.3-1-.4c-4-2.1-7.9-3.4-13.4-4.1v-7.4l-13.8-6.8h-.8v14.5c-11.9 2.4-19.9 10.3-19.9 21.3 0 11.2 5.4 16.7 23.1 23.9 12.3 5 14.9 7.3 14.9 13.2 0 6-4.8 9.6-12.9 9.6-6.9 0-14.3-2.2-20.9-6.2l-1.7-1-1.1-.7-.2 1.2-.3 1.8-1.7 10.6-.1.8-.1.5.5.3.8.4c5.7 2.7 12.3 4.4 19.6 5v7.6l14.1 6.8h.5v-15.4c11.9-2.9 19-11.1 19-22.1.1-12-5.2-17.8-23-25.1z"/>
</g>
<g id="free-euro" fill-rule="evenodd">
<path class="st0" d="M217.3 216.6c-11.9 0-22.3-6.5-27.8-16.1h21.4l12.9-12.9h-38.4c-.1-1.1-.2-2.1-.2-3.2s.1-2.2.2-3.2H211l12.9-12.9h-34.3c5.6-9.6 15.9-16.1 27.8-16.1 8.9 0 16.9 3.6 22.7 9.4l9.1-9.1c-8.1-8.1-19.4-13.2-31.8-13.2-23.7 0-43.1 18.4-44.9 41.6v.1c-.1 1.1-.1 2.1-.1 3.2 0 24.9 20.1 45 45 45 12.4 0 23.7-5 31.8-13.2l-9.1-9.1c-5.8 6.1-13.9 9.7-22.8 9.7z"/><path class="st0" d="M195 134.2V130c0-66.2-32.1-110-87.9-110-55.6 0-88.2 43.8-88.2 110s32.7 110 88.2 110c26.6 0 47.7-9.9 62.7-27.4-4.9-8.2-7.7-17.8-7.7-28-.1-22.5 13.5-41.9 32.9-50.4zm-87.9 69.4c-26.6 0-41.8-25.2-41.8-73.6s14.3-72.8 41.8-72.8c26.6 0 41.8 24.3 41.8 72.8 0 48.4-14.6 73.6-41.8 73.6z"/>
</g>
<g id="frequency" fill-rule="evenodd">
<path d="M195 131.25A63.75 63.75 0 10258.75 195 63.75 63.75 0 00195 131.25zm21.25 69.06h-26.56V152.5l10.63 10.63v26.56h26.56z"/><path d="M79.19 204.28a90 90 0 11139.26-91A84.88 84.88 0 01250 130.26V130a120 120 0 10-190.42 97.16L40 250h80l-20-70z" fill-rule="evenodd"/>
</g>
<g id="frozen" fill-rule="evenodd">
<g><path class="cls-1" d="M60.03 226.41l25.99 15M245 175.02l-5.52-29.37-43.73 8.12-36.9-22.36 37.49-22.76 43.13 7.99 5.5-29.38-34.52-6.39 6.58-35.21-29.53-5.46-8.19 43.78-34.27 20.8-.01-42.46 31.36-31.19L155.14 10l-25.46 25.32-24.82-24.69-21.25 21.13 31.37 31.2.02 41.87-34.34-20.81-8.23-43.78-29.53 5.49 6.61 35.2L15 87.34l5.52 29.38 43.12-8.02 37.51 22.73-36.88 22.39-43.74-8.09-5.5 29.38 34.52 6.38-6.58 35.21 29.53 5.46 8.09-43.24 34.43-20.9.02 39.59-31.43 31.26L104.86 250l25.46-25.32 24.82 24.69 21.25-21.13-31.31-31.13-.01-39.06 34.38 20.83 8.12 43.24 29.53-5.49-6.61-35.2 34.51-6.41z"/></g>
</g>
<g id="furniture" fill-rule="evenodd">
<g><path class="cls-1" d="M102.13 160.6l19.55 20.85 30.22-35.75 47.91 64.3h10.13V90H49.77v120h13.52zm-23.89-56.06a13.32 13.32 0 11-13.33 13.32 13.08 13.08 0 0113.33-13.32z"/><path class="cls-1" d="M243.18 50h-43.25L135.67 1.75A9.57 9.57 0 00130.16 0a9.29 9.29 0 00-5.44 1.76L59.78 50H16.31a6.58 6.58 0 00-6.57 6.56v186.88a6.58 6.58 0 006.57 6.56h226.87a6.58 6.58 0 006.57-6.56V56.56a6.58 6.58 0 00-6.57-6.56zm-113-29.33L169.9 50H89.82zM230 230l-200 .29V72l200-.26z"/></g>
</g>
<g id="getin" fill-rule="evenodd">
<path d="M130 10.1c-66.3 0-120 53.7-120 120s53.7 120 120 120 120-53.7 120-120-53.8-120-120-120zM49.9 129.5L112 67.4l14.3 14.4-38.1 38.3H210l-20 19.7-101.6-.3 37.5 37.4-14.3 14.3-61.7-61.7z" fill-rule="evenodd" clip-rule="evenodd"/>
</g>
<g id="getout" fill-rule="evenodd">
<path d="M131 10a120 120 0 10120 120A120 120 0 00131 10zm18.34 182l-14.28-14.26 37.5-37.37L51 140.7 71 121h101.83l-38.2-38.4 14.26-14.43L211 130.31z" fill-rule="evenodd"/>
</g>
<g id="googledrive" fill-rule="evenodd">
<g><path class="cls-1" d="M159.26 140h79.31L170 20H90l-.01.02L159.26 140zM73.1 230H210l40-70H113.52L73.1 230zM50.01 230l69.06-119.62L78.5 40.12 10 160l40 70h.01z"/></g>
</g>
<g id="googleplus" fill-rule="evenodd">
<path d="M129.59 10a119.59 119.59 0 10119.59 119.59A119.59 119.59 0 00129.59 10zm-24.91 175.09a55.5 55.5 0 1137.44-96.46l-16.36 16a32.63 32.63 0 10-21.08 57.52c14 0 25.87-8.17 30.54-21.17H104V118h55a57.63 57.63 0 011.22 11.59 55.5 55.5 0 01-55.54 55.5zM205 134v19h-14v-19h-20v-14h20v-20h14v20h19v14z" fill-rule="evenodd"/>
</g>
<g id="googleplus2" fill-rule="evenodd">
<path d="M85.18 109.9v31.81h42.87a44.84 44.84 0 11-13-50.12l22.44-22a75.94 75.94 0 1023.11 40.29zm138.31 2.41v-26.5h-19.27v26.51h-26.51v19.28h26.51v26.5h19.28v-26.51H250v-19.28z" fill-rule="evenodd"/>
</g>
<g id="gooplay2" fill-rule="evenodd">
<g><path class="cls-1" d="M148.41 142.13L71.65 218.9 172 165.72l-23.59-23.59zM41 34.74a8.43 8.43 0 00-.93 3.78v182.83a8.6 8.6 0 0010.42 8.4L143.27 137zM148.41 131.85l29.66-29.66L52.92 31.05a8.42 8.42 0 00-6.16-.87zM219.39 125.66l-34.75-19.75L153.56 137l25.16 25.16 40.44-21.43a8.59 8.59 0 00.23-15.07z"/></g>
</g>
<g id="graphics" fill-rule="evenodd">
<path d="M229.74 20.23h-200a10 10 0 00-10 10v200a10 10 0 0010 10h200a10 10 0 0010-10v-200a10 10 0 00-10-10zm-140 190h-40v-40l40-40zm60 0h-40v-120l40-40zm60 0h-40v-80l40-40z" fill-rule="evenodd"/>
</g>
<g id="hashtag" fill-rule="evenodd">
<path d="M250 100V70h-33.64L230 20h-30l-13.64 50h-70L130 20h-30L86.36 70H50l-30 30h58.18l-16.36 60H20v30h33.64L40 240h30l13.64-50h70L140 240h30l13.64-50H220l30-30h-58.18l16.36-60zm-88.18 60h-70l16.36-60h70z" fill-rule="evenodd"/>
</g>
<g id="health" fill-rule="evenodd">
<path d="M130 10a120 120 0 10120 120A120 120 0 00130 10zm60 140h-40v40h-40v-40H70v-40h40V70h40v40h40z" fill-rule="evenodd"/>
</g>
<g id="help" fill-rule="evenodd">
<path d="M130 10a120 120 0 10120 120A120 120 0 00130 10zm0 190a15 15 0 1115-15 15 15 0 01-15 15zm22.5-70.39c-13.5 7.87-13.35 11.22-13.35 27.79h-19.58a113.47 113.47 0 01-.59-12.06c0-12.73 7-20.09 15.72-25.45 8.16-5.19 11.86-8.87 11.86-17.08 0-6.7-5-11.39-13.94-11.39-9.79 0-19.73 6.86-25.51 14.57L92.73 90.76c9-11.39 22.84-20.76 42.42-20.76C157.69 70 170 82.89 170 100.64c0 15.57-7.86 23.11-17.5 28.97z"/>
</g>
<g id="hide" fill-rule="evenodd">
<path d="M170 135l-40 40a40 40 0 0040-40zm52-52l-34.61 34.61a60 60 0 01-74.84 74.84l-21.34 21.34A120 120 0 00130 220c90 0 120-90 120-90a155.75 155.75 0 00-28-47zm-73.11 43.11l13.92-13.92L192 83l15-15 13-13V25l-30.59 30.59C173.44 46.31 153.83 40 130 40c-90 0-120 90-120 90s11.86 35.56 43 62l-23 23v30l51.73-51.73 11.15-11.15zm-70.1 40.1a60 60 0 0182.43-82.43l-14.76 14.76a40 40 0 00-52.92 52.92z"/>
</g>
<g id="historic" fill-rule="evenodd">
<path class="cls-1" d="M120 136.77v-50l20-20v70"/><path class="cls-1" d="M116.5 159.84l-28.32.03 37.68-37.67L140 136.34l-23.5 23.5z"/><path d="M130 10.77a119.82 119.82 0 00-97.15 49.58L10 40.77v80l70-20L55.72 80a90 90 0 11-11.12 79.24l-28.47 9.49A120 120 0 10130 10.77z" fill-rule="evenodd"/>
</g>
<g id="home" fill-rule="evenodd">
<path d="M30 160v80a9.94 9.94 0 009.92 10H130v-80h60v80h30.08a10 10 0 009.92-10v-80L130 80zm60 40H60v-20h50zm40-180L0 130l20 20 110-90 110 90 20-20z" fill-rule="evenodd"/>
</g>
<g id="hotel" fill-rule="evenodd">
<path d="M220 16a6 6 0 00-6-6H46a6 6 0 00-6 6v228a6 6 0 006 6h168a6 6 0 006-6zM106.24 196l-5.48 5.34 1.24 7.46a3.13 3.13 0 010 .42c0 .29-.23.78-.52.78-.08 0-.17-.27-.24-.31L94.53 206l-6.77 3.5a.53.53 0 01-.55-.07.55.55 0 01-.21-.53l1.29-7.55-5.48-5.35a.53.53 0 01.29-.9l7.57-1.1 3.38-6.86a.52.52 0 01.94 0l3.39 6.86 7.57 1.1a.52.52 0 01.29.89zm34.8 0l-5.48 5.34 1.28 7.45a3.13 3.13 0 010 .42c0 .29-.23.78-.52.78-.08 0-.17-.27-.24-.31l-6.75-3.68-6.77 3.5a.53.53 0 01-.55-.07.55.55 0 01-.21-.53l1.29-7.55-5.48-5.35a.53.53 0 01.29-.9l7.57-1.1 3.38-6.86a.52.52 0 01.94 0l3.38 6.86 7.57 1.1a.52.52 0 01.29.89zm-26-67v41H85V60h30v40h30V60h30v110h-30v-41zm61.22 67l-5.48 5.34 1.22 7.46a3.15 3.15 0 010 .42c0 .29-.23.78-.52.78-.08 0-.17-.27-.24-.31l-6.73-3.69-6.77 3.5a.53.53 0 01-.55-.07.55.55 0 01-.21-.53l1.29-7.55-5.47-5.35a.53.53 0 01.29-.9l7.57-1.1 3.38-6.86a.52.52 0 01.94 0l3.38 6.86 7.57 1.1a.52.52 0 01.29.89z" fill-rule="evenodd"/>
</g>
<g id="icecream" fill-rule="evenodd">
<g><path class="cls-1" d="M70.51 140.6h9.23l45.1 106a5.82 5.82 0 0010.77-.15l44.15-105.85h10.14l5-20.53H65.51zM124.17 50.61a49.59 49.59 0 0133.28-15.74 40.09 40.09 0 00-77.12 14.22 50 50 0 0143.85 1.52zM140 94.85a40.1 40.1 0 10-77.24 15.1h74.34a40 40 0 002.9-15.1z"/><path class="cls-1" d="M150 94.85a49.86 49.86 0 01-2.33 15.1h43.59A40.09 40.09 0 00131.9 56.3 50 50 0 01150 94.85z"/></g>
</g>
<g id="idcard" fill-rule="evenodd">
<path d="M240.23 40h-220A10.17 10.17 0 0010 49.93v160.14A10.17 10.17 0 0020.24 220h220a9.77 9.77 0 009.77-9.93V49.93a9.77 9.77 0 00-9.78-9.93zM94.55 70a27.27 27.27 0 11-27.28 27.27A27.27 27.27 0 0194.55 70zM149 190H40v-10.91a49.08 49.08 0 0137.43-47.69 38.07 38.07 0 0034.19 0A49.07 49.07 0 01149 179.09zm51.23-50H160v-20h60.23zm0-40H160V80h60.23z"/>
</g>
<g id="identifiedcall" fill-rule="evenodd">
<g><path class="cls-1" d="M228.24 208.72l-50.78-42.62a6.7 6.7 0 00-8.86.37l-7.41 7.41-1.47 1.47-15.28 15.28a143.22 143.22 0 01-51.76-33.14 141.33 141.33 0 01-33.14-51.77l15.27-15.27L76.28 89l7.41-7.41a6.8 6.8 0 00.31-8.96L41.41 21.88a5.38 5.38 0 00-8.08-.33l-19.1 19.1a6.18 6.18 0 00-1.13 1.13l-2.28 2.28-.06-.06h-.17a184.73 184.73 0 00195.55 195.55l-.07-.21 2.28-2.28 1.13-1.13 19.1-19.11a5.43 5.43 0 00-.34-8.1zM173 105.31l76.71-76.7-14.15-14.15-77.78 77.79-28.28-28.29-14.14 14.15 42.42 42.42L173 105.31z"/></g>
</g>
<g id="illustration" fill-rule="evenodd">
<g><path class="cls-1" d="M240 80V20h-60v20H80V20H20v60h20v100H20v60h60v-20h100v20h60v-60h-20V80zM40 40h20v20H40zm20 180H40v-20h20zm120-20H80v-20H60V80h20V60h100v20h20v100h-20zm40 20h-20v-20h20z"/><path class="cls-1" d="M89 169.74l31.44-89.16h18.6l31 87.72-18.84 2.88-7.08-21.24h-30.23l-6.89 19.8zm29.64-34h20.88l-10.2-30.24h-.24z"/></g>
</g>
<g id="incomingcall" fill-rule="evenodd">
<path class="st0" d="M228 218.8l-50.8-42.6c-2.5-2.1-6.5-2-8.9.4l-7.4 7.4-1.5 1.5-15.3 15.3c-18.7-6.8-36.9-18.3-51.8-33.1-15.3-15.3-26.4-33.1-33.1-51.8l15.3-15.3 1.5-1.5 7.4-7.4c2.3-2.3 2.4-6.4.3-8.9L41.2 32c-2.1-2.5-5.7-2.7-8.1-.3L14 50.8c-.4.4-.9.7-1.1 1.1l-2.3 2.3-.1-.1h-.2c-3 51 14.9 102.9 53.8 141.8 38.9 38.9 90.8 56.8 141.8 53.8l-.1-.2 2.3-2.3 1.1-1.1 19.1-19.1c2.4-2.4 2.2-6-.3-8.2zM170 110h50l30-30h-80V50l-50 45 50 45z"/>
</g>
<g id="info" fill-rule="evenodd">
<path d="M130 90a15 15 0 10-15-15 15 15 0 0015 15zm-10 20h20v90l-20-20zm10 140A120 120 0 1010 130a120 120 0 00120 120z" fill-rule="evenodd"/>
</g>
<g id="instagram" fill-rule="evenodd">
<g><circle cx="130.03" cy="130.34" r="25" fill="#237aba"/><path class="cls-2" d="M188.49 86.1a24.84 24.84 0 00-14.23-14.23c-2.64-1-6.61-2.25-13.93-2.58-7.91-.36-10.28-.44-30.31-.44s-22.4.08-30.31.44c-7.31.33-11.28 1.56-13.93 2.58A24.84 24.84 0 0071.56 86.1c-1 2.64-2.25 6.61-2.58 13.93-.36 7.91-.44 10.28-.44 30.31s.08 22.4.44 30.31c.33 7.31 1.56 11.28 2.58 13.93a24.84 24.84 0 0014.23 14.22c2.64 1 6.61 2.25 13.93 2.58 7.91.36 10.28.44 30.31.44s22.4-.08 30.31-.44c7.31-.33 11.28-1.56 13.93-2.58a24.84 24.84 0 0014.23-14.23c1-2.64 2.25-6.61 2.58-13.93.36-7.91.44-10.28.44-30.31s-.08-22.4-.44-30.31c-.34-7.3-1.56-11.27-2.59-13.92zM130 168.85a38.51 38.51 0 1138.51-38.51A38.51 38.51 0 01130 168.85zm40-69.55a9 9 0 119-9 9 9 0 01-8.94 9z"/><path class="cls-2" d="M130 10.34a120 120 0 10120 120 120 120 0 00-120-120zm74.55 150.92a55 55 0 01-3.49 18.21 38.35 38.35 0 01-21.93 21.93 55.06 55.06 0 01-18.13 3.49c-8 .36-10.55.45-30.92.45s-22.92-.09-30.92-.45a55.06 55.06 0 01-18.26-3.49A38.35 38.35 0 0159 179.47a55 55 0 01-3.49-18.21c-.37-8-.45-10.55-.45-30.92s.09-22.92.45-30.92A55 55 0 0159 81.21a38.35 38.35 0 0121.9-21.94 55.06 55.06 0 0118.21-3.49c8-.37 10.55-.45 30.92-.45s22.92.09 30.92.45a55.06 55.06 0 0118.21 3.49 38.35 38.35 0 0121.93 21.93 55 55 0 013.49 18.21c.37 8 .45 10.55.45 30.92s-.09 22.93-.45 30.93z"/></g>
</g>
<g id="instagram2" fill-rule="evenodd">
<g><path class="cls-1" d="M130 78.65A51.35 51.35 0 10181.35 130 51.35 51.35 0 00130 78.65m0 84.68A33.33 33.33 0 11163.33 130 33.33 33.33 0 01130 163.33M195.38 76.62a12 12 0 11-12-12 12 12 0 0112 12"/><path class="cls-1" d="M130 48c26.7 0 29.86.1 40.41.58 9.75.44 15 2.07 18.57 3.44a33.11 33.11 0 0119 19c1.37 3.52 3 8.82 3.44 18.57.48 10.55.58 13.71.58 40.41s-.1 29.86-.58 40.41c-.44 9.75-2.07 15-3.44 18.57a33.11 33.11 0 01-19 19c-3.52 1.37-8.82 3-18.57 3.44-10.54.48-13.71.58-40.41.58s-29.87-.1-40.41-.58c-9.75-.44-15-2.07-18.57-3.44a33.11 33.11 0 01-19-19c-1.37-3.52-3-8.82-3.44-18.57C48.12 159.86 48 156.7 48 130s.1-29.86.58-40.41C49 79.84 50.68 74.55 52 71a33.11 33.11 0 0119-19c3.52-1.37 8.82-3 18.57-3.44C100.14 48.12 103.3 48 130 48m0-18c-27.16 0-30.56.11-41.23.6s-17.91 2.18-24.27 4.65A51.13 51.13 0 0035.25 64.5c-2.47 6.36-4.16 13.63-4.65 24.27S30 102.84 30 130s.11 30.56.6 41.23 2.18 17.91 4.65 24.27a51.13 51.13 0 0029.25 29.25c6.36 2.47 13.63 4.16 24.27 4.65s14.07.6 41.23.6 30.56-.12 41.23-.6 17.91-2.18 24.27-4.65a51.13 51.13 0 0029.25-29.25c2.47-6.36 4.16-13.63 4.65-24.27s.6-14.07.6-41.23-.11-30.56-.6-41.23-2.18-17.91-4.65-24.27a51.13 51.13 0 00-29.25-29.25c-6.36-2.47-13.63-4.16-24.27-4.65S157.16 30 130 30"/></g>
</g>
<g id="insurance" fill-rule="evenodd">
<path d="M60 130a69.65 69.65 0 0111.53-38.47L35.74 55.74a120 120 0 000 148.53l35.79-35.79A69.65 69.65 0 0160 130zm164.26-74.26l-35.79 35.79a70 70 0 010 76.94l35.79 35.79a120 120 0 000-148.53zM130 60a69.65 69.65 0 0138.47 11.53l35.79-35.79a120 120 0 00-148.53 0l35.8 35.79A69.65 69.65 0 01130 60zm0 140a69.65 69.65 0 01-38.47-11.53l-35.79 35.79a120 120 0 00148.53 0l-35.79-35.79A69.65 69.65 0 01130 200z"/>
</g>
<g id="international" fill-rule="evenodd">
<path d="M130 10a120 120 0 10120 120A120 120 0 00130 10zM29.75 130a99.69 99.69 0 019.7-42.73L90 149.33v.67h20v44h12v35.72c-51-3.84-92.25-47.01-92.25-99.72zM147 228.47V194h33v-50h-40v-34H90V90h30V60h30V32a100 100 0 01-3 196.47z" fill-rule="evenodd"/>
</g>
<g id="investment" fill-rule="evenodd">
<path d="M230 20H30a10 10 0 00-10 10v110l50-50 50 50 50-50-20-20h60v60l-20-20-70 70-50-50-50 50v50a10 10 0 0010 10h200a10 10 0 0010-10V30a10 10 0 00-10-10z" fill-rule="evenodd"/>
</g>
<g id="jewel" fill-rule="evenodd">
<path d="M22.3 80L10 120l120.54 120L250 120l-29.87-90H40.58L28.19 60h101.88l-20 20zM20 85.08" fill-rule="evenodd"/>
</g>
<g id="jpg" fill-rule="evenodd">
<path class="cls-1" d="M122.5 114H114v16h8.5c7.5 0 10.3-2.8 10.3-8.1-.1-5.1-2.8-7.9-10.3-7.9z"/><path class="cls-1" d="M160 10H46.4a6.18 6.18 0 00-6.4 6v227.5a6.53 6.53 0 006.4 6.5h167.2a6.53 6.53 0 006.4-6.5V69.8zM92 143c0 10.2-5.2 17.2-18.3 17.2-7.3 0-11.9-2.5-15.2-5.4l5.2-8.8c2.6 2.4 5.9 4.6 9.5 4.6 4.3 0 6.8-2.7 6.8-9.4V104h12zm30-3h-8v19h-12v-55h20.2c11.7 0 22.3 3.5 22.3 17.9 0 14.7-11.5 18.1-22.5 18.1zm76 19h-10v-6h-.1c-2.2 4-7.6 7.1-14.5 7.1-16.4 0-23.8-12.1-23.8-28.6 0-17.2 9.5-28.2 24.7-28.2 8.3 0 17.2 3.4 22 13.1l-10.2 4.6c-2.1-4.6-5.8-7.7-11.2-7.7-4.9 0-13.2 2.6-13.2 18s7.4 19.3 13.2 19.3c6 0 10.1-3.7 11.2-9.7h-8.7l-1.8-9H198z"/>
</g>
<g id="keyboard" fill-rule="evenodd">
<path d="M244.46 40H15.54A5.44 5.44 0 0010 45.34v169.32a5.45 5.45 0 005.54 5.34h228.92a5.44 5.44 0 005.54-5.34V45.34a5.45 5.45 0 00-5.54-5.34zm-81.13 35.44h22.22v22.23h-22.22zm-44.44 0h22.22v22.23h-22.22zm44.44 44.44v22.22h-22.22v-22.21zM74.44 75.44h22.23v22.23H74.44zm44.44 44.44v22.22H96.67v-22.21zM30 75.44h22.22v22.23H30zm0 44.44h44.44v22.22H30zm22.22 66.67H30v-22.22h22.22zm133.33 0H74.44v-22.22h111.12zm44.44 0h-22.21v-22.22H230zm0-66.67v22.22h-44.43v-22.21h22.22V75.44H230z" fill-rule="evenodd"/>
</g>
<g id="language" fill-rule="evenodd">
<path d="M170 40l-20-20H30v220h30v-89h70.69L150 171h80V40zM60 130V50l80 80z"/>
</g>
<g id="lastpage" fill-rule="evenodd">
<path class="cls-1" transform="rotate(-45 105.113 108.79)" d="M95.12 68.79h20v80h-20z"/><path class="cls-1" transform="rotate(-45 105.117 151.22)" d="M65.12 141.21h80v20h-80z"/><path class="cls-1" d="M160.41 69.65h20v120h-20z"/>
</g>
<g id="law" fill-rule="evenodd">
<g><path class="cls-1" d="M239.9 217.88L141.33 119l14.14-14.14-63.63-63.65-49.5 49.5L106 154.35l14.14-14.14 98.73 98.73s10.35 3.84 17.24-3 3.79-18.06 3.79-18.06zM175.5 84.83a11.86 11.86 0 00-.24-16.77l-46.63-46.63a11.86 11.86 0 00-16.77-.24L106 27.07l63.64 63.64zM69.08 174a12 12 0 0017 .24l5.77-5.77-63.65-63.62-3.54 3.54c-5.86 5.86-6.25 15-.87 20.34zM20 210h130v30H20z"/></g>
</g>
<g id="letter-a" fill-rule="evenodd">
<path d="M129.35 98.24l-16.32 47.23h32.61l-15.93-47.23h-.38zm33.62 102.21l-11.05-33.18h-47.23L94.01 198.2H65.89l49.1-139.27h29.06l48.35 137-29.42 4.51zm73.2-189.62H23.83a13 13 0 00-13 13v212.33a13 13 0 0013 13.01h212.33a13 13 0 0013-13V23.83a13 13 0 00-12.99-13z" fill-rule="evenodd"/>
</g>
<g id="letter-h" fill-rule="evenodd">
<path d="M228 20H32c-6.6 0-12 5.4-12 12v196c0 6.6 5.4 12 12 12h196c6.6 0 12-5.4 12-12V32c0-6.6-5.4-12-12-12zm-44.6 174h-28.2v-54.7h-50.3V194H76.6V66h28.2v49.7h50.3V66h28.2v128z"/>
</g>
<g id="letter-o" fill-rule="evenodd">
<path class="st0" d="M130.1 86.9c-19.9 0-32.2 16.3-32.2 43.1s12.3 43.8 32.2 43.8c19.7 0 32.2-17 32.2-43.8s-12.5-43.1-32.2-43.1z"/><path class="st0" d="M228 20H32c-6.6 0-12 5.4-12 12v196c0 6.6 5.4 12 12 12h196c6.6 0 12-5.4 12-12V32c0-6.6-5.4-12-12-12zm-97.9 176.4c-31 0-60.4-21.4-60.4-66.4s29.4-66.4 60.4-66.4c30.8 0 60.2 21.5 60.2 66.4s-29.4 66.4-60.2 66.4z"/>
</g>
<g id="limits" fill-rule="evenodd">
<path d="M227.47 220a120 120 0 10-194.94 0zM150 170a20 20 0 11-20-20c.64 0 1.26 0 1.89.1L180 110l10 10-40.1 48.11c.1.63.1 1.25.1 1.89zm70-40a10 10 0 11-10 10 10 10 0 0110-10zm0 60a10 10 0 11-10-10 10 10 0 0110 10zM130 50a99.77 99.77 0 0175.53 34.47l-14.18 14.18A80 80 0 0067.55 200H43.38A100 100 0 01130 50z"/>
</g>
<g id="link" fill-rule="evenodd">
<path d="M70 140h90l30-30h-90zm-30-15a45 45 0 0145-45h55l30-30H85a75 75 0 00-21.78 146.78L90 170h-5a45 45 0 01-45-45zm164.13-69.13l-24.38 24.38A45 45 0 01175 170h-45l-30 30h75a75 75 0 0029.13-144.13z"/>
</g>
<g id="linkedin" fill-rule="evenodd">
<path d="M130.41 10.82A119.59 119.59 0 10250 130.41 119.59 119.59 0 00130.41 10.82zM100 180H72V97h28zM85.92 85.83c-8.8 0-15.92-6.46-15.92-14.41S77.12 57 85.92 57s15.91 6.46 15.91 14.42-7.12 14.41-15.91 14.41zM200 180h-28v-45c0-9.15-4-18.3-14.71-18.3S141 125.85 141 135.23V180h-27V97h27v11.93C149 99.32 155.95 95 167.77 95S200 100.92 200 133.17z" fill-rule="evenodd"/>
</g>
<g id="linkedin2" fill-rule="evenodd">
<path d="M31.81 218.93H75V93.5H31.81zM178.26 90.38c-18 0-29 6.59-40.41 21.19V93.5H95.71v125.43h42.15v-67.41c0-14.24 7.94-28.14 24.17-28.14s21.76 13.9 21.76 27.8v67.75H227v-70.54c0-48.99-30.78-58.01-48.74-58.01zM53.57 32.69c-13.36 0-24.18 9.82-24.18 21.9s10.82 21.89 24.18 21.89 24.17-9.81 24.17-21.89-10.82-21.9-24.17-21.9z" fill-rule="evenodd"/>
</g>
<g id="listview" fill-rule="evenodd">
<path class="cls-1" d="M40.49 80.6V50H10v30.6h30.49zM40.49 145.13v-30.6H10v30.6h30.49zM40.49 210v-30.6H10V210h30.49zM210 80H70.37V50H240l-30 30zM180 145H70.37v-30H210l-30 30zM210 210H70.37v-30H240l-30 30z"/>
</g>
<g id="loan" fill-rule="evenodd">
<path class="cls-1" d="M107.36 144.22l-28.55.04 37.98-37.98 14.26 14.25-23.69 23.69z"/><path class="cls-1" d="M110.89 120.97V70.56l20.16-20.16v70.57M195 130a65 65 0 1065 65 65 65 0 00-65-65zm7 96.06V238h-.77L191 232.66v-5.85a34 34 0 01-13.28-3.81l-.45-.3-.32-.2.09-.42.11-.63 1.19-8.09.21-1.4.14-.94.79.52 1.18.78a26.79 26.79 0 0014.43 4.68c5.52 0 8.86-2.79 8.86-7.35s-1.79-6.27-10.24-10.09c-12.23-5.55-16.2-9.75-16.2-18.31 0-8.4 5.49-14.47 13.49-16.28V154h1.05l9.95 5.11v5.7a21.37 21.37 0 019 3.14l.49.31.34.21-.08.41-.1.61-1.27 7.92-.24 1.49-.16 1-.8-.61-1.2-.92a19.06 19.06 0 00-11.31-4c-5.24 0-8.1 2.36-8.1 6.33 0 3.72 1.85 5.45 10.16 9.25 12.26 5.58 16.14 10 16.14 19.15.02 8.49-4.87 14.73-12.87 16.96z"/><path class="cls-1" d="M113.2 218.1a98.33 98.33 0 11104.9-104.9 84.53 84.53 0 0121.9 9.68V120a120 120 0 10-120 120h2.88a84.53 84.53 0 01-9.68-21.9z"/>
</g>
<g id="loaneuro" fill-rule="evenodd">
<path class="cls-1" d="M110.89 112.18l-32.08 32.08 28.55-.04 23.26-23.25h.43V50.4l-20.16 20.16v41.62z"/><path class="cls-1" d="M21.67 120a98.33 98.33 0 01196.43-6.8 84.53 84.53 0 0121.9 9.68V120a120 120 0 10-120 120h2.88a84.53 84.53 0 01-9.67-21.87A98.34 98.34 0 0121.67 120z"/><path class="cls-1" d="M195 130a65 65 0 1065 65 65 65 0 00-65-65zm5 52.8l-10 10h-19.73c-.08.82-.12 1.65-.12 2.49s0 1.67.12 2.49H200l-10 10h-16.51a24.89 24.89 0 0039.16 5.16l7 7a34.85 34.85 0 01-59.5-24.65c0-.84 0-1.67.1-2.49h-.1l.11-.11a34.85 34.85 0 0159.39-22l-7 7a24.89 24.89 0 00-39.16 5.16z"/>
</g>
<g id="lock" fill-rule="evenodd">
<path d="M90 170h80l-20 20H90zm90-60V79.9a50 50 0 00-100 0V110zm20 0V79.91a70 70 0 00-140 0V110H49.93A10 10 0 0040 120.07v119.86A10 10 0 0049.93 250h160.14a10 10 0 009.93-10.07V120.07a10 10 0 00-9.93-10.07z" fill-rule="evenodd"/>
</g>
<g id="lostcall" fill-rule="evenodd">
<path class="st0" d="M15.4 241.1l57.3-5c2.9-.3 5.2-2.8 5.2-5.7v-9.1-20.6c15.6-7.3 33.9-11.4 52.1-11.4 18.7 0 36.5 4.1 52.1 11.4V230.4c0 2.9 2.4 5.4 5.3 5.7l57.3 5c2.9.3 5.2-1.9 5.2-4.8v-23.4c0-.5.1-.9 0-1.4v-2.8h.1l.1-.1c-29.4-33.1-72.3-54-120-54-47.8 0-90.6 20.9-120 54l.2.1V236.3c-.2 2.9 2.2 5.1 5.1 4.8zM180 81.2l20 20v-60h-60l20 20-30 30-50-50-20 20 70 70z"/>
</g>
<g id="man" fill-rule="evenodd">
<g><path class="cls-1" d="M99.3 120v129.84h20v-100h20v100h20v-190h-60V120z"/><circle class="cls-1" cx="129.3" cy="29.72" r="20"/><path class="cls-1" d="M74.39 149.84l15-15v-75h-15v90zM168.8 59.84v75l15 15v-90h-15z"/></g>
</g>
<g id="mapa" fill-rule="evenodd">
<path d="M232.2 22.2L170 40 90 20 24.4 38.7c-2.6.7-4.4 3.1-4.4 5.9v186.1c0 3.4 2.7 6.1 6.1 6.1.8 0 1.6-.2 2.4-.5L90 210l80 30 66.3-28.4c2.2-1 3.7-3.2 3.7-5.6V28.1c0-3.4-2.8-6.1-6.1-6.1-.6 0-1.2.1-1.7.2zM170 220l-80-30V40l80 20v160z"/>
</g>
<g id="medicalkit" fill-rule="evenodd">
<path d="M240 60h-50V30a10 10 0 00-10-10H80a10.07 10.07 0 00-10 10v30H20a10 10 0 00-10 9.93v160.14A10 10 0 0020 240h220a10 10 0 0010-9.93V69.93A10 10 0 00240 60zM90 40h80v20H90zm90 127h-33v33h-34v-33H80v-34h33v-33h34v33h33z" fill-rule="evenodd"/>
</g>
<g id="menu" fill-rule="evenodd">
<path class="cls-1" d="M210 80H20V50h220l-30 30zM180 145H20v-30h190l-30 30zM150 210H20v-30h160l-30 30z"/>
</g>
<g id="microphone" fill-rule="evenodd">
<path d="M119.94 130H80.71a50.34 50.34 0 0099.61-10.09V50.09a50.31 50.31 0 00-100.63 0V70h60.38l-20.13 20H79.69v20h60.38zM220 130h-20.29a70.49 70.49 0 01-139.41 0H40c4.65 41.72 38 74.81 79.94 79.43V230H69.62v20h120.76v-20h-50.32v-20.57C182 204.81 215.35 171.72 220 130z"/>
</g>
<g id="milk" fill-rule="evenodd">
<path class="st0" d="M90.5 100h80v110h-80z"/><path class="st0" d="M168.7 40h-28.2l49.9 50v140H70.6V90.2l49.9-50-28.2-.1-38.2 38.3c-2.2 2.2-3.5 5.3-3.5 8.5V238c0 6.6 5.4 12 12 12h135.7c6.6 0 12-5.4 12-12V86.7c0-3.2-1.3-6.2-3.5-8.5L168.7 40zM76.4 10h108c3.3 0 6 2.7 6 6v8c0 3.3-2.7 6-6 6h-108c-3.3 0-6-2.7-6-6v-8c0-3.3 2.7-6 6-6z"/>
</g>
<g id="missedcall" fill-rule="evenodd">
<path class="st0" d="M15.4 241.1l57.3-5c2.9-.3 5.2-2.8 5.2-5.7v-9.1-20.6c15.6-7.3 33.9-11.4 52.1-11.4 18.7 0 36.5 4.1 52.1 11.4V230.4c0 2.9 2.4 5.4 5.3 5.7l57.3 5c2.9.3 5.2-1.9 5.2-4.8v-23.4c0-.5.1-.9 0-1.4v-2.8h.1l.1-.1c-29.4-33.1-72.3-54-120-54-47.8 0-90.6 20.9-120 54l.2.1V236.3c-.2 2.9 2.2 5.1 5.1 4.8zM80 81.2l-20 20v-60h60l-20 20 30 30 50-50 20 20-70 70z"/>
</g>
<g id="mobile" fill-rule="evenodd">
<symbol><g class="st0"><path class="st1" d="M-130 119.5h260M-130 109.5h260M-130 99.5h260M-130 89.5h260M-130 79.5h260M-130 69.5h260M-130 59.5h260M-130 49.5h260M-130 39.5h260M-130 29.5h260M-130 19.5h260M-130 9.5h260M-130-10.5h260M-130-20.5h260M-130-30.5h260M-130-40.5h260M-130-50.5h260M-130-60.5h260M-130-70.5h260M-130-80.5h260M-130-90.5h260M-130-100.5h260M-130-110.5h260M-130-120.5h260M-130-.5h260M-99.5 130v-260M-70.5 130v-260M-60.5 130v-260M-50.5 130v-260M-40.5 130v-260M-30.5 130v-260M-20.5 130v-260M-10.5 130v-260M9.5 130v-260M19.5 130v-260M29.5 130v-260M39.5 130v-260M49.5 130v-260M59.5 130v-260M69.5 130v-260M79.5 130v-260M89.5 130v-260M99.5 130v-260M109.5 130v-260M119.5 130v-260M-110.5 130v-260M-80.5 130v-260M-120.5 130v-260M-90.5 130v-260"/><path class="st2" d="M-.5 130v-260M-130-.5h260M-.5 130v-260"/></g><path class="st3" d="M-129.4 129.4l258.8-258.8"/><path class="st3" d="M-129.3-129.4l258.6 258.7"/><path d="M-130 130h260v-260h-260z"/><g><path class="st5" d="M0 49c27 0 49-22 49-49S27-49 0-49-49-27-49 0s22 49 49 49m0 1c-27.6 0-50-22.4-50-50s22.4-50 50-50S50-27.6 50 0 27.6 50 0 50z"/><path class="st5" d="M.5 79c20.9 0 40.5-8.2 55.4-23.1C70.8 41 79 21.4 79 .5 79-43.3 43.8-79 .5-79c-21.3 0-41.3 8.2-56.3 23.2S-79-20.8-79 .5C-79 43.8-43.3 79 .5 79m0 1C-44.2 80-80 44.2-80 .5-80-44.2-44.2-80 .5-80 44.2-80 80-44.2 80 .5 80 44.2 44.2 80 .5 80z"/><path class="st5" d="M0 119c31.8 0 61.7-12.4 84.1-34.9S119 31.8 119 0s-12.4-61.7-34.9-84.1S31.8-119 0-119s-61.7 12.4-84.1 34.9S-119-31.8-119 0s12.4 61.7 34.9 84.1S-31.8 119 0 119m0 1c-66.3 0-120-53.7-120-120S-66.3-120 0-120 120-66.3 120 0 66.3 120 0 120z"/></g><g><path class="st5" d="M100 109c5 0 9-4 9-9v-200c0-5-4-9-9-9h-200c-5 0-9 4-9 9v200c0 5 4 9 9 9h200m0 1h-200c-5.5 0-10-4.5-10-10v-200c0-5.5 4.5-10 10-10h200c5.5 0 10 4.5 10 10v200c0 5.5-4.5 10-10 10z"/><path class="st5" d="M80 119c5 0 9-4 9-9v-220c0-5-4-9-9-9H-80c-5 0-9 4-9 9v220c0 5 4 9 9 9H80m0 1H-80c-5.5 0-10-4.5-10-10v-220c0-5.5 4.5-10 10-10H80c5.5 0 10 4.5 10 10v220c0 5.5-4.5 10-10 10z"/><path class="st5" d="M110 89c5 0 9-4 9-9V-80c0-5-4-9-9-9h-220c-5 0-9 4-9 9V80c0 5 4 9 9 9h220m0 1h-220c-5.5 0-10-4.5-10-10V-80c0-5.5 4.5-10 10-10h220c5.5 0 10 4.5 10 10V80c0 5.5-4.5 10-10 10z"/></g></symbol><use xlink:href="#grid-26" width="260" height="260" x="-130" y="-130" transform="matrix(1 0 0 -1 130.233 130.233)" overflow="visible"/><g><path class="st6" d="M120.2 230c0-5.5 4.4-10 10-10 5.5 0 10 4.4 10 10 0 5.5-4.4 10-10 10-5.5 0-10-4.4-10-10zm-50-200h120v180h-120V30zm-20-10c0-5.5 4.4-10 10-10h140c5.5 0 10 4.5 10 10v220c0 5.5-4.4 10-10 10h-140c-5.5 0-10-4.5-10-10V20z"/><path class="st6" d="M170.2 90l-80 80V50h80z"/></g>
</g>
<g id="mobilecashdollar" fill-rule="evenodd">
<path d="M200 10H60a10 10 0 00-10 10v220a10 10 0 0010 10h140a10 10 0 0010-10V20a10 10 0 00-10-10zm-70 230a10 10 0 1110-10 10 10 0 01-10 10zm60-30H70V30h120zm-60.8-55.3c-10 0-20.41-3.82-28.81-8.64L97.5 163.2a72.42 72.42 0 0022.5 6.3V180l20 10v-21.24c13.41-3.2 22.5-12.58 22.5-27.8s-7.53-22.1-28.08-30.31c-13.9-5.67-17.08-8.64-17.08-14.87 0-5.95 4.2-10.48 13.75-10.48 7.82 0 16.36 3 23.6 7.65l2.9-17A51.8 51.8 0 00140 70.53V60l-20-10v21.36c-12.65 3.29-21.05 12.4-21.05 26 0 15.16 7.82 21.39 27.22 29.18 14.48 6.09 18 9.06 18 16.29-.06 7.76-6.17 11.87-14.97 11.87z"/>
</g>
<g id="mobilecasheuro" fill-rule="evenodd">
<path d="M200 10H60a10 10 0 00-10 10v220a10 10 0 0010 10h140a10 10 0 0010-10V20a10 10 0 00-10-10zm-70 230a10 10 0 1110-10 10 10 0 01-10 10zm60-30H70V30h120zm-46.44-107.87l-13.39 13.39h-26.61c-.11 1.1-.17 2.22-.17 3.35s.06 2.25.17 3.35h40l-13.39 13.38h-22.29a33.47 33.47 0 0052.65 6.93L170 152a46.86 46.86 0 01-80-33.14c0-1.13.05-2.24.13-3.35H90l.14-.14A46.85 46.85 0 01170 85.73l-9.47 9.47a33.47 33.47 0 00-52.65 6.93z"/>
</g>
<g id="mobiledisconnected" fill-rule="evenodd">
<g><path class="cls-1" d="M210 20v-.23A9.81 9.81 0 00200 10H60a9.79 9.79 0 00-10 9.77V180l-20 20v30l20-20 20-20L190 70l20-20 20-20V0zM70 160V30h120v10zM190 210H80.23L50 240.22A10 10 0 0060 250h140a10.19 10.19 0 0010-10.24V80l-20 20zm-60 29.77a10 10 0 1110-10 10 10 0 01-10 10z"/></g>
</g>
<g id="mobilepayment" fill-rule="evenodd">
<path class="cls-1" d="M200.07 10h-140A10.27 10.27 0 0050 20.26v220A9.87 9.87 0 0060.09 250h140a9.71 9.71 0 009.93-9.76v-220A10.15 10.15 0 00200.07 10zm-70 230.25a10 10 0 1110-10 10 10 0 01-9.99 10zM190 210H70V30h120z"/><path class="cls-1" d="M160.32 118.83a65.32 65.32 0 01-22.79 49.78l11.87 9.05a80.41 80.41 0 000-117.66l-11.87 9.05a65.32 65.32 0 0122.79 49.78z"/><path class="cls-1" d="M111.79 149l12.52 9.55a56.16 56.16 0 000-79.4l-12.52 9.55a39 39 0 010 60.3zM86.75 129.89l10.52 8a24.34 24.34 0 000-38.16l-10.52 8a14.6 14.6 0 010 22.12z"/>
</g>
<g id="mooncar" fill-rule="evenodd">
<g><g data-name="text"><path class="cls-1" d="M239 100.44h-11.38l-19.8-67.9a3.09 3.09 0 00-2.79-2.1H55.53a3.13 3.13 0 00-2.81 2.08l-20.66 67.92H20.83a10.91 10.91 0 00-10.92 10.9v10.93a11.14 11.14 0 0010.92 11.17h9.08v86.08a10.91 10.91 0 0010.9 10.92h12.65c6 0 10.45-4.89 10.45-10.92v-9.08h131v9.08a10.88 10.88 0 0010.84 10.92h11c6 0 13.19-4.89 13.19-10.92v-86.08H239a11.14 11.14 0 0010.92-11.17v-10.93a10.91 10.91 0 00-10.92-10.9zm-169.08-50h120l15 50h-150zm-5 110a15 15 0 1115-15 15 15 0 01-15 15zm134.5.5a15 15 0 1115-15 15 15 0 01-15 15z"/><path class="cls-1" d="M109.41 84.72l19.77-19.77H77.41l-6 20M188.41 84.95l-6-20h-33.37l-19.77 19.77"/></g></g>
</g>
<g id="more" fill-rule="evenodd">
<path d="M55 105a25 25 0 1025 25 25 25 0 00-25-25zm75 0a25 25 0 1025 25 25 25 0 00-25-25zm75 0a25 25 0 1025 25 25 25 0 00-25-25z"/>
</g>
<g id="mortaje" fill-rule="evenodd">
<path d="M30 149v80a9.94 9.94 0 009.92 10H130v-80h60v80h30.08a10 10 0 009.92-10v-80L130 69zm60 40H60v-20h50zM130 9L0 119l20 20 110-90 110 90 20-20z" fill-rule="evenodd"/>
</g>
<g id="mylocation" fill-rule="evenodd">
<path class="st0" d="M130 90c-22.1 0-40 17.9-40 40s17.9 40 40 40 40-17.9 40-40-17.9-40-40-40z"/><path class="st0" d="M227.5 120C222.4 73.9 186 37.6 140 32.6V10h-20v22.5C74 37.6 37.6 74 32.5 120H10v20h22.5c5 46.1 41.4 82.4 87.4 87.5V250h20v-22.5c46.1-5.1 82.5-41.5 87.5-87.5H250v-20h-22.5zM130 206.4c-42.2 0-76.3-34.2-76.3-76.4s34.2-76.3 76.4-76.3c42.1 0 76.3 34.2 76.3 76.3.1 42.1-34.1 76.3-76.2 76.4h-.2z"/>
</g>
<g id="myprofile" fill-rule="evenodd">
<path d="M161.38 132.34a70 70 0 01-62.76 0A90 90 0 0030 219.77v20h200v-20a90 90 0 00-68.62-87.43zM160 209.77h-30v-20h50zm-30-90a50 50 0 10-50-50 50 50 0 0050 50z" fill-rule="evenodd"/>
</g>
<g id="myprojects" fill-rule="evenodd">
<path d="M160.23 10H160v63h50.56l-20 17H140V10H46.6a6.54 6.54 0 00-6.6 6.28v227.45a6.53 6.53 0 006.61 6.27h167.24a6.12 6.12 0 006.15-6.26V70zM100 140a20 20 0 11-20 20 20 20 0 0120-20zm40 90H60v-4.23A36.66 36.66 0 0187.45 190a27.43 27.43 0 0025.1 0A36.68 36.68 0 01140 225.77z" fill-rule="evenodd"/>
</g>
<g id="navigation" fill-rule="evenodd">
<path d="M250 120V40l-22.84 19.58A120 120 0 10243.87 168l-28.47-9.49a90 90 0 11-11.12-79.28L180 100z" fill-rule="evenodd"/>
</g>
<g id="nearme" fill-rule="evenodd">
<path d="M231.3 20.5L15.6 105.2c-2.8 1.1-4.6 3.8-4.6 6.8v4.3c0 3 1.9 5.7 4.7 6.8l85.4 33c1.9.7 3.5 2.3 4.2 4.2l33 85.4c1.1 2.8 3.8 4.7 6.8 4.7h4.3c3 0 5.7-1.8 6.8-4.6L240.8 30c1.5-3.8-.4-8-4.2-9.5-1.7-.6-3.6-.6-5.3 0zm-84.1 178.4l-21.9-64.3 77.8-77.8-55.9 142.1z"/>
</g><g id="netcash" fill-rule="evenodd"><g><path class="st0" d="M185 120c-35.9 0-65 29.1-65 65s29.1 65 65 65 65-29.1 65-65-29.1-65-65-65zm5.4 51.5l-10.8 10.8h-21.5c-.1.9-.1 1.8-.1 2.7s0 1.8.1 2.7h32.4l-10.8 10.8h-18c7.5 13 24 17.4 37 9.9 2-1.2 3.9-2.6 5.6-4.3l7.7 7.7c-14.8 14.8-38.8 14.8-53.6.1-7.1-7.1-11.1-16.8-11.1-26.9 0-.9 0-1.8.1-2.7h-.1l.1-.1c1.6-20.9 19.7-36.5 40.6-35 9.1.7 17.6 4.6 24 11l-7.7 7.7c-10.6-10.6-27.7-10.6-38.3 0-1.7 1.7-3.1 3.6-4.3 5.6h28.7z"/><path class="st0" d="M111.9 228.4c-46.3-8.3-82.2-49.2-82.2-98.4 0-14.8 3.3-29.4 9.7-42.7l50.6 62v.7h17.6c6.9-15.3 18.2-28.2 32.4-37.1V110H90V90h30V60h30V32c39.9 8.2 70.8 39.7 78.1 79.7 8.3 4.9 15.7 11.1 21.9 18.5v-.2c0-66.3-53.7-120-120-120S10 63.7 10 130s53.7 120 120 120h.2c-7.2-6.1-13.4-13.4-18.3-21.6z"/></g></g>
<g id="newclient" fill-rule="evenodd">
<g><circle class="cls-1" cx="100" cy="60.5" r="50"/><path class="cls-1" d="M144.27 127.29a89.36 89.36 0 00-12.9-4.22 70 70 0 01-62.76 0A90 90 0 000 210.5v20h117.55a85 85 0 0126.73-103.21z"/><path class="cls-1" d="M195 130.5a65 65 0 1065 65 65 65 0 00-65-65zm33.33 73.12h-25.2v31.88h-16.25v-31.88H155v-16.25h31.88V155.5h16.25v31.87H235z"/></g>
</g>
<g id="nfcconnect" fill-rule="evenodd">
<g><path class="cls-1" d="M71.05 79a78.93 78.93 0 010 102l29 12a109.89 109.89 0 000-126z"/><path class="cls-1" d="M126.11 55a130.88 130.88 0 010 149l28 12a160.86 160.86 0 000-173z"/><path class="cls-1" d="M209.2 20l-28 12a181.85 181.85 0 010 196l28 12a211.81 211.81 0 000-220zM20 101a48.34 48.34 0 0110 29 48.34 48.34 0 01-10 29l24 10a59 59 0 000-79z"/></g>
</g>
<g id="nfcdisconnect" fill-rule="evenodd">
<g><path class="cls-1" d="M44 169a59 59 0 000-79l-24 11a48 48 0 0110 29 48 48 0 01-10 29zM233 77l-25 25a182 182 0 01-26 126l28 12a212 212 0 0023-163z"/><path class="cls-1" d="M177 103l25-25 24-24 14-14V10l-23.44 23.39Q213 26.57 209 20l-28 12a182.85 182.85 0 0112.9 24.1L171 79a161.06 161.06 0 00-17-36l-28 12a131 131 0 0120.45 48.54L120 130a110 110 0 00-20-63L71 79a79 79 0 015.79 94.21L40 210v30l51-51 23-23 35-35zM126 204l28 12a161 161 0 0025-85l-35 35a131 131 0 01-18 38z"/></g>
</g>
<g id="no-interest" fill-rule="evenodd">
<path class="st0" d="M223.3 150.8l-45.8 76.8h14.3l45.8-76.8zM239.8 178.3c-12.8 0-20.8 10-20.8 25.2 0 15 7.8 25.1 20.7 25.1s20.7-10.2 20.7-25.2c0-15.1-7.8-25.1-20.6-25.1zm0 39.7c-5.1 0-7.1-5.4-7.1-14.6 0-8.9 2-14.3 7-14.3s7 5.2 7 14.3c.1 9-1.9 14.6-6.9 14.6zM144.7 174.7c0-21 12.4-35.1 30.8-35.1 3.1 0 6.1.4 8.8 1.2.2-3.5.3-7.1.3-10.8 0-66.2-31.9-110-87.4-110C42 20 9.6 63.8 9.6 130S42 240 97.2 240c28.9 0 51.3-11.9 66.2-32.5-11.5-4.8-18.7-16.8-18.7-32.8zm-47.5 28.9c-26.5 0-41.5-25.2-41.5-73.6s14.2-72.8 41.5-72.8c26.5 0 41.5 24.3 41.5 72.8.1 48.4-14.4 73.6-41.5 73.6z"/><path class="st0" d="M196.1 174.6c0-15.1-7.9-25-20.6-25-12.8 0-20.8 9.9-20.8 25.1 0 15.1 7.8 25.1 20.8 25.1 12.8 0 20.6-10.1 20.6-25.2zm-20.6 14.7c-5.1 0-7.1-5.5-7.1-14.7 0-8.9 2-14.3 7.1-14.3 4.9 0 6.9 5.3 6.9 14.4 0 9-2 14.6-6.9 14.6z"/>
</g>
<g id="noDraw" fill-rule="evenodd">
<path d="M182.848 93.73c7.375 0 14.53.915 21.382 2.602l30.485-30.621c4.117-4.137 4.05-10.621.031-14.66l-37.02-37.184c-4.054-4.074-10.55-4.027-14.59.031l-16.464 17.649 36.11 36.27h-30.954L151.2 47.09 10.832 186.984v51.813H62.41l34.016-34.168a89.169 89.169 0 01-2.696-21.781c0-49.215 39.899-89.118 89.118-89.118m35.199 111.528l-12.79 12.793-23.445-23.992-24.023 24.023-12.246-12.246 24.023-24.024-24.023-24.023 12.246-12.246 24.024 24.023 24.019-24.023 12.246 12.246-24.02 24.024zm-36.234-90.801c-37.2 0-67.356 30.156-67.356 67.356 0 37.199 30.156 67.355 67.356 67.355 37.199 0 67.355-30.156 67.355-67.356 0-37.199-30.156-67.355-67.356-67.355zm0 0" fill-rule="evenodd"/>
</g>
<g id="noclient" fill-rule="evenodd">
<g><path d="M140.17 198.89h30l20-20h-50v20z"/><path class="cls-2" d="M176.18 122.74L70 228.89h170.2v-20a90 90 0 00-64.02-86.15zm-6 76.15h-30v-20h50zM20 249.14L229.94 39.42V9.3l-40.6 40.59a50 50 0 10-58.18 58.18l-13.39 13.39h-9a90 90 0 00-68 77L20 219.24v29.9z"/></g>
</g>
<g id="nurseryroom" fill-rule="evenodd">
<g><path class="cls-1" d="M178 98H82a12 12 0 00-12 12v30h50l-20 20H70v20h50l-20 20H70v44a6 6 0 006 6h108a6 6 0 006-6V110a12 12 0 00-12-12zM90 80h80a10 10 0 000-20h-.25c-1.85-18.77-13.94-34.06-29.86-38.61A9.92 9.92 0 00140 20V10a10 10 0 00-20 0v10a9.92 9.92 0 00.11 1.39C104.19 25.94 92.1 41.23 90.25 60H90a10 10 0 000 20z"/></g>
</g>
<g id="officialrates" fill-rule="evenodd">
<g><path class="cls-1" d="M170 41a90 90 0 1090 90 90 90 0 00-90-90zm6.6 73.9l-12.9 12.9h-25.6c-.1 1.1-.2 2.1-.2 3.2s.1 2.2.2 3.2h38.4l-12.9 12.9h-21.4a32.08 32.08 0 0050.5 6.7l9.1 9.1a45 45 0 01-76.8-31.8c0-1.1.1-2.2.1-3.2h-.1l.1-.1a45 45 0 0176.7-28.4l-9.1 9.1a32.08 32.08 0 00-50.5 6.7h34.4z"/><path class="cls-1" d="M95 208.1v-11a108.51 108.51 0 01-10-13.4v25A95.13 95.13 0 0151.6 166h24.7c-1.2-3.3-2.3-6.6-3.2-10H48.3a96 96 0 01-3.3-24.6 93.82 93.82 0 013.5-25.4h24.6a89.39 89.39 0 013.2-10H51.9A95.65 95.65 0 0185 54.1v24.2a95.3 95.3 0 0110-13.4V53.6c2.1 1.5 4.2 3.1 6.2 4.8a96.84 96.84 0 0116.9-12.9A92.64 92.64 0 0095 41.1h-.9c-.7 0-1.4-.1-2.1-.1h-5.2a10.87 10.87 0 00-1.8.1 90 90 0 000 179.8h.4c.9 0 1.8.1 2.7.1H92a7.57 7.57 0 001.5-.1 5.7 5.7 0 001.3-.1 88.34 88.34 0 0023.1-4.4 98.11 98.11 0 01-17-13 45.07 45.07 0 01-5.9 4.7zM69.7 53.6A105.44 105.44 0 0041.2 96H18.1a80.44 80.44 0 0151.6-42.4zM10 131a79.81 79.81 0 014-25h24.1a102.2 102.2 0 00-3.2 25.4 101 101 0 003 24.6H14a79.81 79.81 0 01-4-25zm8.1 35H41a104.2 104.2 0 0027.5 42 80.2 80.2 0 01-50.4-42z"/></g>
</g>
<g id="on" fill-rule="evenodd">
<path class="cls-1" d="M194.74 66.47a90 90 0 11-127.69.21L45.84 45.46A120 120 0 10216 45.25z"/><path class="cls-1" d="M116 10v104.56l28-28.29V10h-28z"/>
</g>
<g id="oneclick" fill-rule="evenodd">
<path class="cls-1" d="M130.23 10a120 120 0 10120 120 120 120 0 00-120-120zm0 220a100 100 0 11100-100 100 100 0 01-100 100z"/><path class="cls-1" d="M130.23 60a70 70 0 1070 70 70 70 0 00-70-70zm0 120a50 50 0 1150-50 50 50 0 01-50 50z"/>
</g>
<g id="openoutside" fill-rule="evenodd">
<path d="M228.77 21h-196a12 12 0 00-12 12v196a12 12 0 0012 12h196a12 12 0 0012-12V33a12 12 0 00-12-12zm-57.53 135.93l.09-53L96 180H67l90.39-90.31-54 .07V69.58l87.9.07.07 87.28z"/>
</g>
<g id="outgoingcall" fill-rule="evenodd">
<path class="st0" d="M228 218.8l-50.8-42.6c-2.5-2.1-6.5-2-8.9.4l-7.4 7.4-1.5 1.5-15.3 15.3c-18.7-6.8-36.9-18.3-51.8-33.1-15.3-15.3-26.4-33.1-33.1-51.8l15.3-15.3 1.5-1.5 7.4-7.4c2.3-2.3 2.4-6.4.3-8.9L41.2 32c-2.1-2.5-5.7-2.7-8.1-.3L14 50.8c-.4.4-.9.7-1.1 1.1l-2.3 2.3-.1-.1h-.2c-3 51 14.9 102.9 53.8 141.8 38.9 38.9 90.8 56.8 141.8 53.8l-.1-.2 2.3-2.3 1.1-1.1 19.1-19.1c2.4-2.4 2.2-6-.3-8.2zM200 110h-50l-30-30h80V50l50 45-50 45z"/>
</g>
<g id="pacifier" fill-rule="evenodd">
<g><path class="cls-1" d="M101.52 135.92c-2.28-2.28-6.23-3.05-8.51-.78-19.74 19.74-37.16 6.34-58.76 27.93A44.51 44.51 0 0097.2 226c21.59-21.59 8.19-39 27.93-58.76 2.28-2.28 1.5-6.23-.78-8.51zM223.09 115.87a55.64 55.64 0 10-91.14-19L120.81 108 80.67 67.86a10 10 0 00-14.14 0l-1.59 1.59a10 10 0 000 14.14l111.74 111.76a10 10 0 0014.14 0l1.59-1.59a10 10 0 000-14.14l-40.14-40.14 11.15-11.15a55.64 55.64 0 0059.67-12.46zm-62.94-62.95a33.38 33.38 0 110 47.21 33.38 33.38 0 010-47.21z"/></g>
</g>
<g id="paddle" fill-rule="evenodd">
<path d="M223 166.4c36.1-36.2 36.7-94.3 1.2-129.8s-93.5-35-129.6 1.1C80.4 52 72.1 72.7 68.7 94.1c0 0-12 90.1-18.6 96.8L10 229.4l21.2 21.2s39.6-38 39.9-38.3c6.9-6.9 95.3-19.7 95.5-19.8 21.4-3.4 42.2-11.8 56.4-26.1zM217 93c3.9 3.9 3.9 10.2 0 14.1s-10.2 3.9-14.1 0-3.9-10.2 0-14.1c3.9-3.9 10.2-3.9 14.1 0zm-24.1-24.1c3.9 3.9 3.9 10.2 0 14.1s-10.2 3.9-14.1 0-3.9-10.2 0-14.1c3.8-3.9 10.2-3.9 14.1 0zm-49.1 63.2c-3.9 3.9-10.2 3.9-14.1 0-3.9-3.9-3.9-10.2 0-14.1 3.9-3.9 10.2-3.9 14.1 0 3.9 3.9 3.9 10.2 0 14.1zm24.9-87.4c3.9 3.9 3.9 10.2 0 14.1s-10.2 3.9-14.1 0-3.9-10.2 0-14.1c3.9-3.9 10.2-3.9 14.1 0zm-50.6 12.5c3.9-3.9 10.2-3.9 14.1 0s3.9 10.2 0 14.1-10.2 3.9-14.1 0c-3.9-3.8-3.9-10.1 0-14.1zM105.5 108c-3.9-3.9-3.9-10.2 0-14.1s10.2-3.9 14.1 0 3.9 10.2 0 14.1c-3.9 3.9-10.2 3.9-14.1 0zm36.7-26.6c3.9-3.9 10.2-3.9 14.1 0s3.9 10.2 0 14.1-10.2 3.9-14.1 0c-3.9-3.9-3.9-10.2 0-14.1zm-63 100.8l6.5-39.5 33 33-39.5 6.5zm87.1-62.6c-3.9-3.9-3.9-10.2 0-14.1s10.2-3.9 14.1 0 3.9 10.2 0 14.1c-3.9 3.9-10.2 3.9-14.1 0 0-.1 0-.1 0 0zm-12.5 36.7c-3.9-3.9-3.9-10.2 0-14.1s10.2-3.9 14.1 0 3.9 10.2 0 14.1c-3.9 3.9-10.2 3.9-14.1 0zm36.6-12.6c-3.9-3.9-3.9-10.2 0-14.1 3.9-3.9 10.2-3.9 14.1 0 3.9 3.9 3.9 10.2 0 14.1-3.9 3.9-10.2 3.9-14.1 0 0-.1 0-.1 0 0z"/>
</g>
<g id="partner" fill-rule="evenodd">
<path class="st0" d="M164.4 76.4h-13.3v26.2h13.3c12.1 0 16.7-4.7 16.7-13.2 0-8.3-4.4-13-16.7-13zM134.7 209.8c-28.6 18.1-66.4 9.6-84.6-19-12.7-20-12.7-45.6 0-65.6-3.1-13.8-3.6-28.1-1.5-42.1C7.3 112.6-2.3 170 27.1 211.3s86.8 51 128.2 21.5c8.3-5.9 15.6-13.2 21.6-21.6-14.1 2.3-28.4 1.8-42.2-1.4z"/><path class="st0" d="M223.1 36.9C187.2 1 129 1 93.1 36.9s-35.9 94.1 0 130c35.9 35.9 94.1 35.9 130 0 35.9-35.9 35.9-94.1 0-130zm-59.4 80.8h-12.6v31.6h-19.4V60.4H164c19 0 36.2 5 36.2 28.4 0 23.9-18.7 28.9-36.5 28.9z"/>
</g>
<g id="pastafactory" fill-rule="evenodd">
<path d="M170.33 80.82V40.18l-80 40.64V40.18l-80 40.64v120h19.82v-43a6.55 6.55 0 016.55-6.55h26.54a6.55 6.55 0 016.55 6.55v43h180.54V40.18zM199.24 131H170v-19.36h49.45zm-69 0H100v-19.36h50.45z" fill-rule="evenodd"/>
</g>
<g id="pause" fill-rule="evenodd">
<g><path class="cls-1" d="M130 10a120 120 0 10120 120A120 120 0 00130 10zm0 220a100 100 0 11100-100 100 100 0 01-100 100z"/><path class="cls-1" d="M90 80h30v100H90zM140 80h30v100h-30z"/></g>
</g>
<g id="pdf" fill-rule="evenodd">
<path class="cls-1" d="M160 10H46.37A6.33 6.33 0 0040 16.28v227.45a6.32 6.32 0 006.38 6.27h167.24a6.31 6.31 0 006.38-6.26V70zM79.95 143H74v17H60v-53h19.95c11.38 0 23 2.23 23 18s-12.56 18-23 18zm46.87 17H109v-53h17.82c15.84 0 29.31 5.91 29.31 26.14 0 20.95-13.68 26.86-29.31 26.86zM200 119h-22v10h15v12h-15v19h-15v-53h37z"/><path class="cls-1" d="M80.45 118H74v14h6.45c6.7 0 8.5-3 8.5-7s-1.8-7-8.5-7zM127.47 119H124v29h3.61c10.87 0 14.11-4.1 14.11-14.9.01-9.86-3.31-14.1-14.25-14.1z"/>
</g>
<g id="pets" fill-rule="evenodd">
<path d="M44.88 143.62c13.74 0 24.88-15.3 24.88-34.16S58.62 75.3 44.88 75.3 20 90.59 20 109.46s11.14 34.16 24.88 34.16zM94.1 88.33c13.74 0 24.9-15.33 24.9-34.17S107.84 20 94.1 20 69.23 35.3 69.23 54.16 80.37 88.33 94.1 88.33zm121 55.3c13.74 0 24.88-15.3 24.88-34.16S228.86 75.3 215.12 75.3s-24.88 15.3-24.88 34.16 11.14 34.16 24.88 34.16zm-50.25-55.3c13.74 0 24.88-15.3 24.88-34.16S178.61 20 164.87 20 140 35.3 140 54.16s11.14 34.16 24.88 34.16zm-35 141.28c46 0 83.21 31.28 83.21-14.71s-37.25-104.52-83.21-104.52S46.68 168.9 46.68 214.9s37.25 14.71 83.21 14.71zm0 0" fill-rule="evenodd"/>
</g><g id="phishing" fill-rule="evenodd"><path class="st3" d="M260 80h-30.9c-19-41.3-60.7-70-109.1-70C53.7 10 0 63.8 0 130s53.7 120 120 120c59.5 0 108.8-43.2 118.3-100H260V80zM120 30c37 0 69.3 20.1 86.6 50H33.4C50.7 50.1 83 30 120 30zm60 76v20h-30l-10-20h40zm-60 124c-48.4 0-88.7-34.4-98-80h196c-9.3 45.7-49.6 80-98 80zM90 105.6v20H60l-10-20h40z"/><path class="st3" d="M80 180h70v20H80z"/></g>
<g id="photologin" fill-rule="evenodd">
<g><path class="cls-1" d="M30 30h30V10H10v50h20V30zM30 200H10v50h50v-20H30v-30zM230 230h-30v20h50v-50h-20v30zM200 10v20h30v30h20V10h-50zM50.5 210h160v-16a72 72 0 00-54.9-69.94 56 56 0 01-50.21 0A72 72 0 0050.5 194zm79-50h50l-20 20h-30z"/><circle cx="130.5" cy="75" r="35" fill="#237aba"/></g>
</g>
<g id="physiotherapy" fill-rule="evenodd">
<path d="M194.5 129.8c-35.9 0-65 29.1-65 65s29.1 65 65 65 65-29.1 65-65-29.1-65-65-65zm35.2 59.6c0 21.5-35.2 43-35.2 43s-35.2-21.5-35.2-43v-2.7c0-10.4 7.9-18.8 17.6-18.8 8.9 0 16.2 7 17.4 16.1h.4c1.2-9.1 8.6-16.1 17.4-16.1 9.7 0 17.6 8.4 17.6 18.8v2.7z" fill-rule="evenodd" clip-rule="evenodd"/><path class="st1" d="M84 109.8c.4-.7 16-8.9 16-8.9l-11.9 49.3 23.5 26.2c3.6-16 11.8-30.6 23.5-42.1l2.9-12 3.4 6.5c7.8-6.3 16.7-11.1 26.2-14.3l-13.9-42s-6.7 2.3-7.7 2.6c-5.3 1.2-10.9 1.5-16.3.8-4.5-.6-8.8-2-12.7-4.2-1.8-1-8.4-6-8.4-6L70.6 85 38 124.6l22.4 17.2 23.6-32z"/><ellipse class="st1" cx="133.6" cy="37.1" rx="26.9" ry="27.1"/><path class="st1" d="M87.3 169l-4.1-4.5-2.2 5.7-13.4 35.3-33.1 38.1L29 250h38.7l1.1-1.2 26.6-28 .4-.5.3-.6 11.4-25.7 1-2.3-1.7-1.9z"/>
</g>
<g id="pic" fill-rule="evenodd">
<g><path class="cls-1" d="M240 219l-57-57a90 90 0 10-21 21l57 57zM39 110a70 70 0 1170 70 70 70 0 01-70-70z"/><path class="cls-1" d="M125 116a35 35 0 01-31 0 45 45 0 00-32 30 60 60 0 0096 0 45 45 0 00-33-30z"/><circle class="cls-1" cx="109" cy="85" r="25"/></g>
</g>
<g id="pinpadconnect" fill-rule="evenodd">
<path d="M130 10a120 120 0 10120 120A120 120 0 00130 10zM94 196H64v-30h30zm0-51H64v-30h30zm0-51H64V64h30zm51 102h-30v-30h30zm0-51h-30v-30h30zm0-51h-30V64h30zm51 102h-30v-30h30zm0-51h-30v-30h30zm0-51h-30V64h30z" fill-rule="evenodd"/>
</g>
<g id="pinpaddisconnected" fill-rule="evenodd">
<g><path class="cls-1" d="M228.52 61.48L175 115h21v30h-30v-21l-42 42h21v30h-30v-21l-53.52 53.52a120 120 0 00167-167zM196 196h-30v-30h30zM94 166l21-21 30-30 21-21 64-64V0l-31.48 31.48a120 120 0 00-167 167L10 220v30zm21-102h30v21l-9 9h-21zm-51 0h30v30H64zm0 51h30v21l-9 9H64z"/></g>
</g>
<g id="pinterest" fill-rule="evenodd">
<path d="M129.8 10a120 120 0 10120 120 120 120 0 00-120-120zm9.75 153.79c-9.13-.71-13-5.23-20.13-9.58-3.94 20.65-8.75 40.45-23 50.79-4.4-31.21 6.46-54.65 11.5-79.54C99.33 111 109 81.87 127.09 89c22.31 8.83-19.32 53.8 8.62 59.42 29.18 5.86 41.09-50.63 23-69-26.14-26.53-76.1-.6-70 37.37 1.49 9.29 11.09 12.1 3.83 24.92-16.68-3.71-21.68-16.86-21.04-34.46 1-28.8 25.87-49 50.79-51.75 31.51-3.5 61.08 11.57 65.17 41.21 4.6 33.46-14.22 69.69-47.92 67.08z" fill-rule="evenodd"/>
</g>
<g id="pinterest2" fill-rule="evenodd">
<path d="M113.58 172.12c-6 31.66-13.42 62-35.28 77.88-6.75-47.86 9.91-83.8 17.64-122-13.18-22.19 1.59-66.84 29.4-55.84 34.22 13.54-29.64 82.49 13.23 91.1 44.76 9 63-77.63 35.28-105.8-40.1-40.67-116.73-.93-107.31 57.31 2.29 14.24 17 18.56 5.88 38.21-25.66-5.69-33.33-25.92-32.34-52.9C41.67 56 79.77 25 118 20.77c48.33-5.41 93.69 17.74 100 63.18 7.05 51.3-21.81 106.86-73.5 102.86-14.06-1.08-19.94-8.02-30.92-14.69z"/>
</g>
<g id="place" fill-rule="evenodd">
<path d="M130 10C74.8 10 30 54.8 30 110v3c2 88.3 91.6 144.7 91.6 144.7 4.6 3.1 12 3.1 16.5.1 0 0 89.8-56.5 91.8-144.8v-3c0-55.2-44.7-100-99.9-100zm0 150c-27.6 0-50-22.4-50-50s22.4-50 50-50 50 22.4 50 50-22.4 50-50 50z"/>
</g>
<g id="play" fill-rule="evenodd">
<path d="M130 10a120 120 0 10120 120A120 120 0 00130 10zm-23 174V76l72 54z"/>
</g>
<g id="plusmenu" fill-rule="evenodd">
<path class="st0" d="M210.8 142.9h16.5v81.4h-16.5z"/><path class="st0" d="M185.1 175.3l-6.7 16.6h81.3v-16.6zM9.5 169.9v25h123.7l9.6-25zM9.7 114.8v25H158l9.6-25zM9.9 59.7v25h173.9l8.6-22.5.9-2.5z"/>
</g>
<g id="point" fill-rule="evenodd">
<path d="M130.15 220.46L99.91 250v-87.2A79.33 79.33 0 0150 89.3C50 45.5 85.82 10 130 10s80 35.5 80 79.3a79.33 79.33 0 01-49.6 73.38V250l-30.25-29.54m.69-102.25a31.67 31.67 0 1132-31.67 31.83 31.83 0 01-32 31.67z" fill-rule="evenodd"/>
</g>
<g id="press" fill-rule="evenodd">
<path d="M59.93 20.19v60h-40v148a12 12 0 0012 12h196a12 12 0 0012-12v-208zm0 190a10 10 0 01-20 0v-110h20zm20-150h60v60h-60zm140 140h-140v-20h140zm0-40h-140v-20h140zm0-40h-60v-20h60zm0-40h-60v-20h60z" data-name="icons"/>
</g>
<g id="previousapointment" fill-rule="evenodd">
<g><path class="cls-1" d="M90.07 191.14V171h19.67a88.13 88.13 0 0160.39-69.34V90.54h20v7.39c2-.14 4-.21 6-.21a87 87 0 0134 6.87V28.83c0-5.4-3.49-8.71-9-8.71h-21V0h-20v20.12H60V0H40v20.12H21c-5.63 0-11 3.2-11 8.71v181.24c0 5.4 5.49 11.25 11 11.25h94.85a88 88 0 01-7.23-30.18zm20-40.24h-20v-20.12h20zm0-40.24h-20V90.54h20zm40 0h-20V90.54h20zM40 50.3h161.16l-20 20.12H40zm30 140.84H50V171h20zm0-40.24H50v-20.12h20z"/><path class="cls-1" d="M229.6 129.28a64.75 64.75 0 00-81.6 10.13 65.57 65.57 0 00-18.07 45.2c0 1.81.09 3.6.24 5.37a65.06 65.06 0 1099.47-60.7zM189.52 141l10.84 10.9v27.25h27.11l-10.84 10.9h-27.11z"/></g>
</g>
<g id="print" fill-rule="evenodd">
<path d="M220.23 70V20a10 10 0 00-9.93-10H50.17a10 10 0 00-9.93 10v50h-30v110a10.06 10.06 0 0010 10h20v50a10 10 0 009.93 10H210.3a10 10 0 009.93-10v-50h20a10 10 0 0010-10V70zm-160-40h140v40h-140zm140 200h-140v-60h140zm10-110h-30v-20h50zm-50 70h-80v20h60z" fill-rule="evenodd"/>
</g>
<g id="privacyanddata" fill-rule="evenodd">
<path class="st0" d="M102.2 98.3c4.3 4.2 11.2 4.2 15.5 0l23.8-23.5c4.7-4.6 12.2-4.6 16.9.1l75.8 75.8c3.6-14.7 5.7-31.4 5.7-50.7V30c0-5.4-4.5-10-10-10h-65.3l-62.5 62.5c-4.3 4.4-4.3 11.4.1 15.8z"/><path class="st0" d="M98.9 198.4c3.9-3.9 10.2-3.9 14.1 0l39.6 39.6c2.9 2.9 7.4 3.7 11.1 2l.2-.1c6.3-2.9 7.7-11.1 2.8-16l-39.6-39.6c-3.9-3.9-3.9-10.2 0-14.1 3.9-3.9 10.2-3.9 14.1 0l44.5 44.5c3.9 3.9 10.3 3.9 14.1-.1l.1-.1c3.8-3.8 3.7-10-.1-13.8l-44.6-44.6c-3.9-3.9-3.9-10.2 0-14.1 3.9-3.9 10.2-3.9 14.1 0l39.5 39.5c4.8 4.8 12.8 3.3 15.6-2.8l.1-.2c1.7-3.7.9-8-1.9-10.9l-64.5-64.5c-4.7-4.7-12.2-4.7-16.9-.1l-9.7 9.5c-12.1 11.9-31.5 11.9-43.6.1-12.3-12.1-12.4-32-.2-44.2L136.2 20H30c-5.6 0-10 4.5-10 10v70c0 140 110.1 150 110.1 150 2.3-.2 3.3-3 1.7-4.7L99 212.5c-4-3.9-4-10.2-.1-14.1z"/>
</g>
<g id="productportfolio" fill-rule="evenodd">
<path d="M240 60h-50V30a10 10 0 00-10-10H80a10.07 10.07 0 00-10 10v30H20a10 10 0 00-10 9.93v160.14A10 10 0 0020 240h220a10 10 0 0010-9.93V69.93A10 10 0 00240 60zm-130 60H50v-20h80zm60-60H90V40h80z" fill-rule="evenodd"/>
</g>
<g id="promotion" fill-rule="evenodd">
<path d="M130 10a120 120 0 10120 120A120 120 0 00130 10zm42.37 179.44l-41.56-25.3-41.56 25.3 11-47.69-36.68-32.08 48.35-4.14 18.9-45 18.9 45 48.35 4.14-36.72 32.09z" fill-rule="evenodd"/>
</g>
<g id="qr" fill-rule="evenodd">
<path d="M50 80h30V50H50v30zM10 250h110V140H10v110zm20-90h70v70H30v-70zm20 50h30v-30H50v30zm110-70h-20v20h20v-20zM140 10v110h110V10H140zm90 90h-70V30h70v70zm20 40h-70v20h70v-20zM10 120h110V10H10v110zm20-90h70v70H30V30zm180 20h-30v30h30V50zm20 200h20v-70h-20v70zm-50-40h30v-30h-30v30zm-20-30h-20v70h70v-20h-50v-50z"/>
</g>
<g id="quizz" fill-rule="evenodd">
<path class="st0" d="M254 110h-24v66c-.5 13.4-11.6 24-25 24H100v22c0 4 3 8 7 8h123l30 30V117c.6-3.3-1.6-6.4-4.8-7H254z"/><path class="st0" d="M200 20H9c-5 0-9 4-9 9v191l37-38h163c5 0 10-2 10-7V29c0-5-5-9-10-9zm-97 130c-8 0-12-5-12-11s4-11 12-11 13 5 13 11-5 11-13 11zm21-53c-12 6-12 9-12 22H94c-.5-3-.8-6-1-9 0-10 6-16 14-20s10-7 10-13-4-9-12-9-17 5-22 11L71 66c7-9 20-16 37-16s31 10 31 24-7 18-15 23z"/>
</g>
<g id="quotemark" fill-rule="evenodd">
<g><path class="cls-1" d="M110 40H60l-50 80v110h110V120H60l50-80zM190 120l50-80h-50l-50 80v110h110V120h-60z"/></g>
</g>
<g id="reademail" fill-rule="evenodd">
<path d="M138.06 12.51a14.2 14.2 0 00-16.12 0L10 100v139.93A10 10 0 0020 250h220a10 10 0 0010-10.07V100zm-.21 181.21a13.19 13.19 0 01-15.69 0L30 120a10 10 0 019.92-10h180.16a10 10 0 019.92 10z" fill-rule="evenodd"/>
</g>
<g id="receiptok" fill-rule="evenodd">
<path d="M210.07 10H200l-10 10h-10V10h-10l-10 10h-10V10h-10l-10 10h-10V10h-10l-10 10H90V10H80L70 20H60V10H49.93C44.45 10 40 14 40 19.51v220C40 245 44.45 250 49.93 250H60l10-10h10v10h10l10-10h10v10h10l10-10h10v10h10l10-10h10v10h10l10-10h10v10h10.07c5.48 0 9.93-5 9.93-10.51v-220c0-5.49-4.45-9.49-9.93-9.49zm-89.6 157.31l-15.22 15.22-42.43-42.42L77 126l28.28 28.28L183 76.47l14.14 14.14z" fill-rule="evenodd"/>
</g>
<g id="rent" fill-rule="evenodd">
<path class="cls-1" d="M254 61a6 6 0 006-6v-8.95a6 6 0 00-6-6H40.5v-14a6 6 0 00-6-6H26a6 6 0 00-6 6v14H6a6 6 0 00-6 6V55a6 6 0 006 6h14v179h20.5V61z"/><path class="cls-1" d="M59.9 76v117.86a6 6 0 006 6H254a6 6 0 006-6V76zm80.1 84H80v-20h80zm40-40H80v-20h120z"/>
</g>
<g id="reply" fill-rule="evenodd">
<path d="M115 89.53v-50l-105 90 105 90v-49.34a146.27 146.27 0 0116.5-.68c50.69 0 95.69 22.34 124 60v-2c0-76.82-63.87-137.17-140.5-137.98z"/>
</g>
<g id="restaurant" fill-rule="evenodd">
<g><path class="cls-1" d="M170.09 140l-.3 110h29.75L200 10c-44.63 0-50.35 40-50.35 40v90M115 10v51.43L102 70V10H88v51.43L75 70V10H60v100h20v140h30V110h20V10h-15z"/></g>
</g>
<g id="retail" fill-rule="evenodd">
<path d="M90.76 20H56.84a5.94 5.94 0 00-3 .8V20L20 52l29.83 27.19V234c-2.45 3.32.23 6 3.53 6h152.36c3.31 0 3.45-2.69 3.45-6V78.31L240 52l-30.65-29a6 6 0 00-2.54-2.4l-.66-.62v.34a6 6 0 00-2-.34h-34.91L130 52 90.76 20zM125 94h65v.87L171 114h-46z" fill-rule="evenodd"/>
</g>
<g id="retirement" fill-rule="evenodd">
<g><path class="cls-1" d="M250 0l-59 59H60v20l79 80v81h-39v20h100v-20h-38v-81l78-80V59h-20.72L250 28.28zm-60 99h-80L90 79h120z"/><path class="cls-1" d="M45 0a45 45 0 00-5 89.72V40h49.72A45 45 0 0045 0z"/></g>
</g>
<g id="return-12" fill-rule="evenodd">
<path fill-rule="evenodd" d="M67.45 144.38l56.59 56.46L102.91 222 10.9 129.67 102.24 38l21.16 21.16-55.55 55.45 183.05.02-28.85 29.75H67.45z"/>
</g>
<g id="return-15" fill-rule="evenodd">
<path d="M228 20H32a12 12 0 00-12 12v196a12 12 0 0012 12h196a12 12 0 0012-12V32a12 12 0 00-12-12zm-57.53 135.93l.09-53L95.28 179h-29l90.39-90.31-54 .07V68.58l87.9.07.07 87.28z"/>
</g>
<g id="return" fill-rule="evenodd">
<path d="M130 10a119.82 119.82 0 00-97.15 49.58L10 40v80l70-20-24.28-20.81a90 90 0 11-11.12 79.28L16.13 168A120 120 0 10130 10z" fill-rule="evenodd"/>
</g>
<g id="retweet" fill-rule="evenodd">
<g><path class="cls-1" d="M220 131V51.5c0-.1-17.27-.16-39.39-.2L180 51v.3c-39.38-.06-93.66-.05-93.66-.05L120.5 91H180v40h-40l60 70 60-70zM139.52 171.17a.5.5 0 00-.38-.17H80v-40h40L60 61 0 131h40v80h132.57a.5.5 0 00.38-.83z"/></g>
</g>
<g id="rewards" fill-rule="evenodd">
<g><path class="cls-1" d="M30 70h89.42v50.54H30zM140.58 70H230v50.54h-89.42zM129.38 60L170 10l40 30-48.79 30H97.87L50 40l40-30 39.7 50h-.32zM40 140h80v100H40zM140 140h80v100h-80z"/></g>
</g>
<g id="safeforlater" fill-rule="evenodd">
<path d="M167.93 20H27.27C24 20 20 21.19 20 24.5v208c0 3.32 4 7.5 7.26 7.5h208c3.32 0 4.73-4.19 4.73-7.5V91.83zm-38.24 190L68 148.34l14.26-14.28 37.37 37.5L119.3 50 139 70v101.83l38.4-38.2 14.43 14.26z" fill-rule="evenodd"/>
</g>
<g id="sales" fill-rule="evenodd">
<path d="M230.08 20h-94.67a14.06 14.06 0 00-8.57 3.58l-81.1 81.1 84.68 84.68h-29.89l-69.74-69.74-12.89 12.89a10 10 0 000 14.05l95.54 95.54a10 10 0 0014.05 0l108.93-108.94a13.64 13.64 0 003.58-8.57V29.92a9.91 9.91 0 00-9.92-9.92zm-49.85 79.69a19.92 19.92 0 1119.92-19.92 19.92 19.92 0 01-19.92 19.92z" fill-rule="evenodd"/>
</g>
<g id="savings" fill-rule="evenodd">
<g><circle class="cls-1" cx="145.18" cy="45" r="35"/><path class="cls-1" d="M240 130h-10.35c-4.12-23.53-17.44-44.13-36.36-58.38A55 55 0 0191.87 58.56a93.72 93.72 0 00-4.1 1.77L61.84 40 61 78.05a94.46 94.46 0 00-22.71 32L38 110H22a12 12 0 00-12 12v36a12 12 0 0012 12h12.4c6.92 24.44 24 45 46.6 57.36V244a6 6 0 006 6h18a6 6 0 006-6v-5.89a106.68 106.68 0 0040 0V244a6 6 0 006 6h18a6 6 0 006-6v-16.64c28.61-15.63 48.25-44.27 49.89-77.36H240a10 10 0 000-20zm-154 0a15 15 0 1115-15 15 15 0 01-15 15z"/></g>
</g>
<g id="seachinglocation" fill-rule="evenodd">
<path d="M130 10A100 100 0 0030 110v3c2 88.3 91.6 144.71 91.6 144.71 4.56 3.09 12 3.1 16.54.12 0 0 89.79-56.52 91.77-144.83v-3A100 100 0 00130 10zM85 120a15 15 0 1115-15 15 15 0 01-15 15zm45 0a15 15 0 1115-15 15 15 0 01-15 15zm45 0a15 15 0 1115-15 15 15 0 01-15 15z" fill-rule="evenodd"/>
</g>
<g id="search" fill-rule="evenodd">
<path d="M182.85 162.85a90 90 0 10-20 20L220 240l20-20zM150 110a40 40 0 00-40-40V50a60 60 0 0160 60z"/>
</g>
<g id="security-token" fill-rule="evenodd">
<path class="st0" d="M110.8 151h30l10-10h-40zM130.8 81c-11.1 0-20 8.9-20 20v10h40v-10c0-11.1-9-20-20-20z"/><path class="st0" d="M240.7 31c0-5.4-4.5-10-10-10H30.8c-5.6 0-10 4.5-10 10v70c0 140 110 150 110 150s110-10 110-150l-.1-70zm-69.9 140c0 5.5-4.5 10-10 10h-60.1c-5.5 0-10-4.4-10-10v-50c0-5.5 4.5-10 10-10v-10c0-16.6 13.5-30 30-30 16.6 0 30 13.5 30 30v10c5.5 0 10 4.4 10 10l.1 50z"/>
</g>
<g id="security" fill-rule="evenodd">
<path class="cls-1" d="M110 150h30l10-10h-40v10zM130 80a19.94 19.94 0 00-20 20v10h40v-10a19.94 19.94 0 00-20-20z"/><path class="cls-1" d="M240 30a10 10 0 00-10-10H30a9.94 9.94 0 00-10 10v70c0 140 110 150 110 150s110-10 110-150zm-70 140a10 10 0 01-10 10h-60a9.93 9.93 0 01-10-10v-50a10 10 0 0110-10v-10a30 30 0 1160 0v10a9.93 9.93 0 0110 10z"/>
</g>
<g id="seecvv" fill-rule="evenodd">
<path d="M240 40H20a10 10 0 00-10 9.93V80h100l-20 20H10v110.07A10 10 0 0020 220h220a10 10 0 0010-9.93V49.93A10 10 0 00240 40zm-60 130a50 50 0 1150-50 50 50 0 01-50 50zm-20-40h30l20-20h-50z" fill-rule="evenodd"/>
</g>
<g id="send" fill-rule="evenodd">
<path d="M245.62 123.29L33.25 30.61a7.27 7.27 0 00-8.06 1.54l-3.05 3.06a7.33 7.33 0 00-1.51 8.14L57.68 127a7.34 7.34 0 010 5.94l-37.05 83.71a7.34 7.34 0 001.51 8.14l3.05 3.06a7.27 7.27 0 008.06 1.54l212.37-92.69a7.33 7.33 0 000-13.41zM60 190l30-61h110z"/>
</g>
<g id="services" fill-rule="evenodd">
<g><path class="cls-1" d="M239.93 178c-2.1-58-50.42-104.34-109.71-104.34S22.6 120 20.5 178H20v22h220v-22zm-47.34-31a78.86 78.86 0 00-11.78-14.21 79.78 79.78 0 00-25.81-16.5v-15.92a94.7 94.7 0 0136.17 21.56A93.48 93.48 0 01209.9 147zM130 60a20 20 0 10-20-20 20 20 0 0020 20z"/><path d="M0 220h260v20H0z"/></g>
</g>
<g id="settings" fill-rule="evenodd">
<path d="M249 124l-56-98a12 12 0 00-11-6H77a12 12 0 00-11 6l-55 98a12 12 0 000 11l55 98a12 12 0 0011 6h106a12 12 0 0011-6l55-98a12 12 0 000-11zm-119 56a50 50 0 1150-50 50 50 0 01-50 50z"/>
</g>
<g id="share" fill-rule="evenodd">
<path d="M108.14 142.09l50.2 33.46A40 40 0 11150 200q0-1.64.13-3.25l-54.31-36.2a40 40 0 110-61.1l54.31-36.2Q150 61.64 150 60a40 40 0 118.33 24.44l-50.2 33.46a40.23 40.23 0 010 24.19z" fill-rule="evenodd"/>
</g>
<g id="shop" fill-rule="evenodd">
<g><path class="cls-1" d="M255.33 90l-30-51h-180l-40 51h250zM210 109v80H50v-80H30v114a6.29 6.29 0 006.33 6h188a5.72 5.72 0 005.67-6V109z"/><path class="cls-1" d="M70.33 149h100l-16.66 20H70.33v-20z"/></g>
</g>
<g id="shopping" fill-rule="evenodd">
<path d="M190 60v-.06a60 60 0 00-120 0V60H30v170a10 10 0 009.92 10h180.16a10 10 0 009.92-10V60zM90 130l-20 20v-50h20zm0-70a40 40 0 1180 0zm100 70l-20 20v-50h20z" fill-rule="evenodd"/>
</g>
<g id="sign" fill-rule="evenodd">
<path class="cls-1" d="M210.64 116.05c.11.27 0-.29 0 0zM154.08 59.49c.29 0-.27-.11 0 0zM250 110L150 10l-20 20 100 100 20-20zM140 70l-7.13 4.28A180.5 180.5 0 0140 100L20 225.86l52.94-52.94a30 30 0 1114.14 14.14L34.14 240 160 220a180.5 180.5 0 0125.72-92.87L190 120z"/>
</g>
<g id="simulator" fill-rule="evenodd">
<defs><symbol data-name="grid-26 8"><path class="cls-1" d="M.6.64l258.75 258.72"/><path data-name="diagonal" class="cls-1" d="M.7 259.37L259.34.73"/><path d="M0 0h260v260H0z"/><g><path class="cls-3" d="M130 81a49 49 0 11-49 49 49.05 49.05 0 0149-49m0-1a50 50 0 1050 50 50 50 0 00-50-50z"/><path class="cls-3" d="M130.5 51a78.8 78.8 0 0178.5 78.5c0 43.84-35.22 79.5-78.5 79.5A79.21 79.21 0 0151 129.5C51 86.22 86.66 51 130.5 51m0-1C85.82 50 50 85.82 50 129.5a80.22 80.22 0 0080.5 80.5c43.68 0 79.5-35.82 79.5-80.5 0-43.68-35.82-79.5-79.5-79.5z"/><path class="cls-3" d="M130 11a119 119 0 0184.15 203.15 119 119 0 01-168.3-168.3A118.25 118.25 0 01130 11m0-1a120 120 0 10120 120A120 120 0 00130 10z"/></g><g><path class="cls-3" d="M230 21a9 9 0 019 9v200a9 9 0 01-9 9H30a9 9 0 01-9-9V30a9 9 0 019-9h200m0-1H30a10 10 0 00-10 10v200a10 10 0 0010 10h200a10 10 0 0010-10V30a10 10 0 00-10-10z"/><path class="cls-3" d="M210 11a9 9 0 019 9v220a9 9 0 01-9 9H50a9 9 0 01-9-9V20a9 9 0 019-9h160m0-1H50a10 10 0 00-10 10v220a10 10 0 0010 10h160a10 10 0 0010-10V20a10 10 0 00-10-10z"/><path class="cls-3" d="M240 41a9 9 0 019 9v160a9 9 0 01-9 9H20a9 9 0 01-9-9V50a9 9 0 019-9h220m0-1H20a10 10 0 00-10 10v160a10 10 0 0010 10h220a10 10 0 0010-10V50a10 10 0 00-10-10z"/></g></symbol></defs><use width="260" height="260" transform="translate(0 -.4)" xlink:href="#grid-26_8"/><g><g><path class="cls-4" d="M109.33 56.31c.06-.27.11-.54.16-.82s.07-.38.1-.57.08-.49.11-.73.07-.48.09-.71 0-.43.07-.65 0-.59.07-.88 0-.35 0-.52V50v-1.99c0-.32-.05-.65-.08-1s0-.4-.07-.61-.06-.56-.1-.83-.08-.44-.11-.66-.09-.51-.14-.77l-.15-.68c0-.24-.1-.47-.16-.71s-.12-.47-.19-.7l-.18-.66c-.08-.25-.15-.49-.23-.72s-.13-.41-.21-.62-.17-.49-.26-.74-.15-.37-.22-.55-.21-.51-.32-.76-.15-.33-.22-.49-.25-.53-.38-.79l-.21-.42c-.07-.14-.28-.56-.44-.83l-.16-.29-.54-.92a30.68 30.68 0 00-3.2-4.26 30 30 0 00-44.7 0 30.68 30.68 0 00-3.17 4.25l-.54.92-.16.29c-.16.27-.3.55-.44.83s-.15.28-.21.42-.26.52-.38.79-.15.32-.22.49-.21.5-.32.76-.14.37-.22.55-.18.5-.26.74-.14.41-.21.62-.15.47-.23.72l-.18.66a18.101 18.101 0 00-.35 1.41l-.15.68c0 .26-.09.51-.14.77s-.07.44-.11.66-.07.55-.1.83 0 .41-.07.61-.06.65-.08 1v3.94c0 .18 0 .59.07.88s0 .43.07.65 0 .47.09.71.07.49.11.73.07.38.1.57.1.55.16.82c0 .12 0 .23.08.35a31.2 31.2 0 001 3.34 30 30 0 0056.58 0 31.2 31.2 0 001-3.34c-.1-.11-.08-.22-.05-.34zM125.81 30A49.89 49.89 0 01129 60h101l30-30z"/><circle class="cls-5" cx="160" cy="130" r="30"/><path class="cls-4" d="M10 110v30h101a49.89 49.89 0 013.18-30z"/><circle class="cls-5" cx="80" cy="210" r="30"/><path class="cls-4" d="M125.81 190a49.89 49.89 0 013.19 30h101l30-30z"/></g></g>
</g>
<g id="slideshare" fill-rule="evenodd">
<g><path class="cls-1" d="M188 77c0-9.46-3-14-11.73-14H84.59C75.39 63 72 66.91 72 77v55.48c20 10.23 36.72 8.42 45.88 8.13 3.85-.19 6.53.66 8 2.24.26.22.64.46.92.73a51.41 51.41 0 005.1 4.16c.34-4.53 2.87-7.47 9.71-7.13 9.3.29 26.35 2.17 46.35-8.6zm-77.35 56.55c-9.56 0-17.3-7.32-17.3-16.35s7.75-16.35 17.3-16.35 17.3 7.32 17.3 16.35-7.74 16.31-17.3 16.31zm40.92 0c-9.56 0-17.3-7.32-17.3-16.35s7.75-16.35 17.3-16.35 17.3 7.32 17.3 16.35-7.74 16.31-17.3 16.31z"/><path class="cls-1" d="M130 10a120 120 0 10120 120A120 120 0 00130 10zm71.45 121.6c-5.27 6.45-15.28 14.47-30.63 20.77 16.28 55.34-39.65 64.13-38.79 35.75 0 .51 0-15.21-.05-26.92-1.2-.29-2.47-.63-3.94-1 0 11.79-.05 28.43-.05 27.9.85 28.37-55 19.58-38.8-35.75-15.36-6.29-25.37-14.35-30.64-20.75-2.71-4-.28-8.2 4.13-5.12.6.43 1.32.83 1.32 1.23V70.47A14.75 14.75 0 0178.24 56h103.59c7.35 0 13.17 6.54 13.17 14.47v57.18c0-.38 1.21-.77 1.78-1.18 4.41-3.07 7.38 1.12 4.67 5.13z"/></g>
</g>
<g id="slideshare2" fill-rule="evenodd">
<g><path class="cls-1" d="M44.3 140V48.46c0-15.17 3.86-19.93 17.75-19.93h138.36c13.15 0 17.8 5.65 17.8 19.93v88.72l10.7-7.39V38.66c0-12-9-21.66-20.1-21.66H52.47c-11.08 0-20.1 9.68-20.1 21.66v93.93L44.3 140"/><path class="cls-1" d="M133.52 156.88c0-7.78 3.58-13 14.72-12.43 16.06.5 47.63 4.14 83.23-21.27 6.66-4.65 11 1.68 6.94 7.72-7.95 9.74-23.06 21.83-46.23 31.35 24.57 83.52-59.84 96.78-58.55 54 0 1.23-.11-59.33-.11-59.33"/><path class="cls-1" d="M167.78 151c-11.64 16-25.52 13-41.81-2.07-.43-.4-.84-.76-1.24-1.1-2.26-2.39-6-3.67-11.81-3.38-16.06.5-47.63 4.14-83.23-21.27-6.66-4.65-11 1.68-6.94 7.72 7.95 9.74 23.06 21.83 46.23 31.35-24.52 83.52 59.84 96.78 58.55 54 0 .8 0-24.3.08-42.11 9.82 2.31 13.94 4.44 27.46 1.35A31 31 0 00177 156.71c4.49-10.91-3.23-13.99-9.22-5.71z"/><ellipse class="cls-1" cx="163.14" cy="109.12" rx="26.11" ry="24.68"/><ellipse class="cls-1" cx="101.38" cy="109.12" rx="26.11" ry="24.68"/></g>
</g>
<g id="smart-assistant" fill-rule="evenodd">
<path d="M240 30H20c-5.5 0-10 4.5-10 10v210l40-40h190c5.5 0 10-4.5 10-10V40c0-5.5-4.5-10-10-10zM128.8 180c-7.5 0-13.6-6.1-13.6-13.6s6.1-13.6 13.6-13.6 13.6 6.1 13.6 13.6-6.1 13.6-13.6 13.6zm20.4-63.8c-12.2 7.2-12.1 10.1-12.1 25.2h-17.7c-.4-3.6-.5-7.2-.5-11 0-11.5 6.3-18.2 14.2-23 7.4-4.7 10.8-8.1 10.8-15.5 0-6.1-4.5-10.3-12.6-10.3-8.9 0-17.8 6.2-23.1 13.2L95 81.1c8.2-10.3 20.6-18.8 38.4-18.8C153.8 62.3 165 74 165 90c0 14.1-7.2 21-15.8 26.2z"/>
</g>
<g id="sms" fill-rule="evenodd">
<path class="st0" d="M170 210.1H50v-180h120v20h20v-30c.1-5.4-4.1-9.8-9.5-10H40.3c-5.6 0-10.2 4.4-10.3 10V240c.2 5.6 4.7 10 10.3 10h140c5.4 0 9.7-4.4 9.7-9.8V190h-20v20.1zm-59.7 30c-5.5 0-10-4.5-10-10s4.5-10 10-10 10 4.5 10 10-4.4 10-10 10z"/><path class="st0" d="M234 70.1H106c-3.3 0-6 2.7-6 6v88.1c0 3.3 2.7 6 6 6h128c3.3 0 6-2.7 6-6V76c0-3.3-2.7-6-6-5.9zm-4 39.8L170 139l-60-29.1V90l10 4.8 50 24.2 60-29v19.9z"/>
</g>
<g id="stairs" fill-rule="evenodd">
<path d="M20 20v220h220V20zm200 60h-40v40h-40v40h-40v40H40v-20h40v-40h40v-40h40V60h60z" fill-rule="evenodd"/>
</g>
<g id="stock" fill-rule="evenodd">
<path d="M90 120l-70 70v40a10 10 0 0010 10h200a10 10 0 0010-10V90l-90 90zM230 20H30a10 10 0 00-10 10v120l70-70 60 60 90-90V30a10 10 0 00-10-10z" fill-rule="evenodd"/>
</g>
<g id="substract" fill-rule="evenodd">
<path d="M129 10C62.7 10 9 63.7 9 130s53.7 120 120 120 120-53.7 120-120S195.3 10 129 10zm50 130H69v-20h130l-20 20z"/>
</g><g id="sun" fill-rule="evenodd"><circle cx="130.05" cy="130.58" r="70"/><path d="M258.16 129.14L212 94.65l7.45-57.13-57 8.25L127.3.09 92.81 46.25 35.68 38.8l8.25 57L-1.75 131l46.15 34.49-7.4 57.09 57-8.25L129.11 260l34.49-46.15 57.13 7.45-8.25-57zM128.21 220a89.93 89.93 0 1189.93-90 89.93 89.93 0 01-89.93 90z" fill-rule="evenodd"/></g>
<g id="supermarket" fill-rule="evenodd">
<path d="M243.85 90h-52.91c-.63-47-25.34-70-60.94-70-34.45 0-59.41 23-60 70H16.1c-3.85 0-6.55 4.12-6 7.93l19.35 134.94a8.43 8.43 0 007.93 7.13h184.75a7.89 7.89 0 007.87-6.64l19.94-135.55c.49-3.81-2.23-7.81-6.09-7.81zM90 200l-20-12.93V140h20zm40-161.39c22.9 0 39.49 13.39 40 51.39H90.94c.47-38 17.31-51.39 39.06-51.39zM140 200l-20-12.93V140h20zm50 0l-20-12.93V140h20z" fill-rule="evenodd"/>
</g>
<g id="support" fill-rule="evenodd">
<path d="M240 30H20a10 10 0 00-10 10v210l40-40h190a10 10 0 0010-10V40a10 10 0 00-10-10zM130 130H50v-20h100zm40-40H50V70h140z" fill-rule="evenodd"/>
</g>
<g id="tablet" fill-rule="evenodd">
<path class="cls-1" d="M120.23 230a10 10 0 1110 10 10 10 0 01-10-10zm-60-190h140v170h-140zm-20-20a10 10 0 0110-10h160a10 10 0 0110 10v220a10 10 0 01-10 10h-160a10 10 0 01-10-10z"/><path class="cls-1" d="M180.23 80l-100 100V60h100v20z"/>
</g>
<g id="tasks" fill-rule="evenodd">
<path d="M160 10H46c-3.3 0-6 2.7-6 6v227c0 3.5 2.5 6.5 6 7h168c3.1-.4 5.6-2.9 6-6V70l-60-60zM60 70h100l-20 20H60V70zm0 40h60l-20 20H60v-20zm71 115l-38-38 14-14 22 22 53-62 15 13-66 79z"/>
</g>
<g id="team" fill-rule="evenodd">
<circle cx="105.41" cy="90.91" r="40.91" fill="#237aba"/><path class="cls-2" d="M131.77 140a60.33 60.33 0 01-26.63 6.15A61.09 61.09 0 0178.33 140C44.95 148 20 177.36 20 212.42V230h170v-17.58c0-35.06-24.88-64.42-58.23-72.42zM161.32 90.91a55.94 55.94 0 01-1.19 11.49 36.36 36.36 0 10-24-58.2 55.9 55.9 0 0125.19 46.71z"/><path class="cls-2" d="M240 174.38c0-31.17-22.06-57.3-51.7-64.37a53.5 53.5 0 01-23.64 5.47 54.89 54.89 0 01-8.69-.71 56.13 56.13 0 01-9.52 14.07A89.89 89.89 0 01202.12 190H240z"/>
</g>
<g id="telephone" fill-rule="evenodd">
<path d="M237.24 209.41l-50.78-42.62a6.7 6.7 0 00-8.86.37l-7.41 7.41-1.48 1.43-15.28 15.28a143.22 143.22 0 01-51.76-33.14 141.33 141.33 0 01-33.14-51.77l15.28-15.24 1.47-1.47 7.41-7.41a6.8 6.8 0 00.31-8.94L50.41 22.56a5.38 5.38 0 00-8.08-.33l-19.1 19.11a6.18 6.18 0 00-1.13 1.13l-2.28 2.28-.06-.05h-.17a184.73 184.73 0 00195.55 195.54l-.07-.21 2.28-2.28 1.13-1.13 19.1-19.11a5.43 5.43 0 00-.34-8.1z"/>
</g>
<g id="theater" fill-rule="evenodd">
<g><path class="cls-1" d="M110 10v90c0 50 20 90 70 90s70-40 70-90V10zm35 30a15 15 0 11-15 15 15 15 0 0115-15zm35 120a50 50 0 01-50-50h20a30 30 0 0060 0h20a50 50 0 01-50 50zm35-90a15 15 0 1115-15 15 15 0 01-15 15z"/><path class="cls-1" d="M130 210h-20a30 30 0 10-60 0H30a50 50 0 0171.51-45.15C94.1 150.88 90 133 90 110V70H10v105c0 45 28 75 70 75 36 0 60-20 60-50a99 99 0 01-13.07-7.29A49.89 49.89 0 01130 210zM45 100a15 15 0 11-15 15 15 15 0 0115-15z"/></g>
</g>
<g id="ticket" fill-rule="evenodd">
<path d="M210.07 10H200l-10 10h-10V10h-10l-10 10h-10V10h-10l-10 10h-10V10h-10l-10 10H90V10H80L70 20H60V10H49.93A10 10 0 0040 20v220a10 10 0 009.93 10H60l10-10h10v10h10l10-10h10v10h10l10-10h10v10h10l10-10h10v10h10l10-10h10v10h10.07a10 10 0 009.93-10V20a10 10 0 00-9.93-10zM70 100h90l-20 20H70zm90 60H70v-20h110zm10-80H70V60h120z"/>
</g>
<g id="ticketoffice" fill-rule="evenodd">
<path d="M194.4 95.9c-5.3 0-10.6-1.1-15.8-1.1-43.3 0-79.2 35.9-79.2 79.2 0 15.8 6.3 32.7 18 50.7l-7.4 7.4H99.3v-10.6H88.8l-10.6 10.6H67.6v-10.6H57.1l-10.6 10.6H36c-6.3 0-10.6-4.2-10.6-10.6V20.9c0-6.3 4.2-10.6 10.6-10.6h21.1v10.6h10.6l10.6-10.6h10.6v10.6h10.6l10.6-10.6h10.6v10.6H131l10.6-10.6h10.6v10.6h10.6l10.6-10.6H184c6.3 0 10.6 4.2 10.6 10.6v75h-.2zm-137.3 9.5v21.1h31.7l21.1-21.1H57.1zm0-42.2v21.1h63.4l21.1-21.1H57.1zM184.9 248c-4.2 3.2-9.5 3.2-12.7 0-34.9-26.4-51.7-50.7-51.7-73.9 0-31.7 26.4-58.1 58.1-58.1 31.7 0 58.1 26.4 58.1 58.1-.1 23.2-17 47.5-51.8 73.9zm-6.4-47.5c14.8 0 26.4-11.6 26.4-26.4 0-14.8-11.6-26.4-26.4-26.4s-26.4 11.6-26.4 26.4c0 14.8 11.6 26.4 26.4 26.4z"/>
</g>
<g id="titleview" fill-rule="evenodd">
<path class="cls-1" d="M79.44 80V40h-40v40h40zM150 80V40h-40v40h40zM220 80V40h-40v40h40zM150 150v-40h-40v40h40zM220 150v-40h-40v40h40zM79.44 220v-40h-40v40h40zM150 220v-40h-40v40h40zM79.44 150v-40h-40v40h40zM220 220v-40h-40v40h40z"/>
</g>
<g id="token" fill-rule="evenodd">
<path d="M210.1 110H200V79.9c0-38.7-31.3-70-70-70s-70 31.3-70 70V110H49.9c-5.5 0-10 4.5-9.9 10.1V240c0 5.5 4.4 10 9.9 10.1H210c5.5 0 10-4.5 9.9-10.1V120.1c.1-5.6-4.3-10.1-9.8-10.1zM140 186.8v16.7c0 3.3-2.7 6-6 6h-8c-3.3 0-6-2.7-6-6v-16.7c-9.6-5.5-12.8-17.8-7.3-27.3 5.5-9.6 17.8-12.8 27.3-7.3 9.6 5.5 12.8 17.8 7.3 27.3-1.7 3-4.3 5.5-7.3 7.3zm40-76.8H80V79.9c0-27.6 22.4-50 50-50s50 22.4 50 50V110z"/>
</g>
<g id="tools" fill-rule="evenodd">
<g><path class="cls-1" d="M246.46 204.24l-62-62-14.17 14.17 63.47 63.47h-28.39l-49.3-49.3-14.17 14.11 62 62a12 12 0 0017 0l25.5-25.5a12 12 0 00.06-16.95zM62.67 77.13l29.34 29.34 14.17-14.17-29.34-29.34 1.42-26.92L21.59 7.7 7.42 21.87l28.33 56.67 26.92-1.41z"/><path class="cls-1" d="M234 104.51c15.23-15.28 19-36.51 12.74-55.77l-34.15 34.15a12.08 12.08 0 01-17 0l-18.48-18.45a12.08 12.08 0 010-17l34.15-34.15C192 7 170.77 10.76 155.49 26A55.47 55.47 0 00142 82.53L13.41 211.1a12.08 12.08 0 000 17l18.45 18.45a12.08 12.08 0 0017 0L177.47 118A55.47 55.47 0 00234 104.51zM51.56 229.71a15 15 0 110-21.21 15 15 0 010 21.21z"/></g>
</g>
<g id="top-arrow" fill-rule="evenodd">
<path d="M80 160h100l-50-60z"/>
</g>
<g id="toys" fill-rule="evenodd">
<path d="M250 55.5V54h-20.72a50.27 50.27 0 10-84.81 42.28 139 139 0 01-133.54 31.14 108.55 108.55 0 10205.31-33.1 50.21 50.21 0 009.23-14zm-68.15-14.35a10.39 10.39 0 11-10.41 10.39 10.4 10.4 0 0110.41-10.39zM147 180H80l20-20h47z"/>
</g>
<g id="tpv" fill-rule="evenodd">
<g><path class="cls-1" d="M84.49 224.09v31.46c0 2.3 2.4 4.13 5.36 4.13h79.28c3 0 5.36-1.85 5.36-4.13v-31.46"/><path class="cls-1" d="M204 10H56a6 6 0 00-6 6v218a6 6 0 006 6h14v-30.32h120V240h14a6 6 0 006-6V16a6 6 0 00-6-6zM69 60V30h122l-21 30zm26 134.68H70v-25h25zm0-45H70v-25h25zm0-45H70v-25h25zm47 90h-25v-25h25zm0-45h-25v-25h25zm0-45h-25v-25h25zm48 90h-25v-25h25zm0-45h-25v-25h25zm0-45h-25v-25h25z"/></g>
</g>
<g id="transfer" fill-rule="evenodd">
<path d="M80 100h80l40-40H80V20L10 80l70 60zm170 80l-70-60v40h-80l-40 40h120v40z"/>
</g>
<g id="transferaccount" fill-rule="evenodd">
<path d="M219 40H-1v140h220zM29 70h60L69 90H29zm60 90v-20H29l20-20h40v-20l40 30zm150-60v100H39l-20 20h240V80z" fill-rule="evenodd"/>
</g>
<g id="transfercard" fill-rule="evenodd">
<path d="M239 40H19a10 10 0 00-10 9.93V80h200l-20 20H9v110.07A10 10 0 0019 220h220a10 10 0 0010-9.93V49.93A10 10 0 00239 40zm-50 160v-20h-60l20-20h40v-20l40 30z"/>
</g>
<g id="transfertoaccount" fill-rule="evenodd">
<path d="M260 86.668V227.5H43.332L65 205.832h173.332v-97.5zm-43.332-32.5v130H0v-130zm-65 54.164V130h-32.5L97.5 151.668h54.168v21.664l43.332-32.5zM97.5 86.668h-65v21.664h43.332zm0 0" fill-rule="evenodd"/>
</g>
<g id="trash" fill-rule="evenodd">
<path d="M190.23 220v-90h-20v70zm-50 0v-90h-20v70zm-50 0v-90h-20v70zm-25-190h25v-9.91A10.08 10.08 0 01100.2 10h60.06a10 10 0 0110 10.09V30h70v30h-20v180a10 10 0 01-9.93 10H50.17a9.92 9.92 0 01-9.93-10V60h-20V30z" fill-rule="evenodd"/>
</g>
<g id="travel" fill-rule="evenodd">
<g><path class="cls-1" d="M100.15 230H190M244 56h-38.6l.1-30.29c0-3.16-3.29-5.71-6.43-5.71h-87.64c-3.05 0-5.8 2-5.93 5h-.5v31H66a6 6 0 00-6 6v122a6 6 0 006 6h178a6 6 0 006-6V62a6 6 0 00-6-6zM126 40h60v16h-60zm14.5 66H90V86h70.5z"/><path class="cls-1" d="M260 210H40V28.4a8.16 8.16 0 00-8.25-8.4H0v20h20v181.27a8.85 8.85 0 008.73 8.73H60a20 20 0 0040 0h90a20 20 0 0040 0h30z"/></g>
</g>
<g id="turnbox" fill-rule="evenodd">
<path class="cls-1" d="M190.8 10l-43 40.83a25.81 25.81 0 01-35.68 0L69.09 10H50v161.56a13.42 13.42 0 003.64 8.59l69.11 66.94a10.47 10.47 0 0014.48 0l69.11-66.94a13.83 13.83 0 003.65-8.59V10zM91.53 156.15c-14 0-22.18-11-22.18-27.65s8.21-27.65 22.18-27.65 22.11 11 22.11 27.65-8.07 27.65-22.11 27.65zm49.51 0c-14 0-22.18-11-22.18-27.65s8.21-27.65 22.18-27.65 22.11 11 22.11 27.65-8.07 27.65-22.15 27.65zm49.52-1.15h-11v-42.56l-10 2.45-1.31-9.51 12.12-3.38h10.19z"/><path class="cls-1" d="M141 110.21c-6.91 0-10.51 6.12-10.51 18.29S134.3 147 141 147s10.51-6.34 10.51-18.51-3.81-18.28-10.51-18.28zM91.49 110.21c-6.91 0-10.51 6.12-10.51 18.29S84.79 147 91.49 147 102 140.67 102 128.5s-3.81-18.29-10.51-18.29z"/>
</g>
<g id="tv" fill-rule="evenodd">
<g><path class="cls-1" d="M240.79 39.88h-97.92L179.78 3h-20l-30 30-30-30h-20l36.91 36.91H20.81a10 10 0 00-10 10v140a10 10 0 0010 10h220a10 10 0 0010-10v-140a10 10 0 00-10.02-10.03zm-10 140H30.8v-120h200z"/><path class="cls-1" d="M180.8 79.97h-130v80h50l80-80zM61 219.88h140v20H61z"/></g>
</g>
<g id="twitter" fill-rule="evenodd">
<path d="M130 10a120 120 0 10120 120A120 120 0 00130 10zm59.73 91.59c.09 1.24.09 2.48.09 3.71 0 37.8-31 81.35-87.69 81.35a92.09 92.09 0 01-47.32-12.84 67.09 67.09 0 007.44.36A64.78 64.78 0 00100.51 162c-13.55-.27-24.9-8.51-28.81-19.83a40.82 40.82 0 005.82.45 20.22 20.22 0 006.15-1C69.55 138.94 57 127.43 57 113.54v-.36c0 2.13 10.84 3.46 15.89 3.64-8.29-5.14-12.75-13.91-12.75-23.82 0-5.32 2-10.18 4.68-14.44C80 95.92 103 107.25 128.62 108.49a29.35 29.35 0 01-.64-6.56c0-15.76 13.8-28.58 30.87-28.58a32 32 0 0122.55 9 63.64 63.64 0 0019.6-6.88 28.91 28.91 0 01-13.54 15.76 65.49 65.49 0 0017.75-4.42 64.11 64.11 0 01-15.48 14.78z" fill-rule="evenodd"/>
</g>
<g id="twitter2" fill-rule="evenodd">
<path d="M212.94 91.4c0 52.66-43.19 113.34-122.16 113.34a128.29 128.29 0 01-65.93-17.89 93.47 93.47 0 0010.37.5 90.25 90.25 0 0053.29-17c-18.87-.38-34.69-11.85-40.14-27.63a56.86 56.86 0 008.1.63A48.68 48.68 0 0067.78 142c-19.67-3.69-34.42-19.72-34.42-39.08v-.5a45.87 45.87 0 0019.4 5.07c-11.55-7.15-19.12-19.36-19.12-33.17a37.44 37.44 0 015.83-20.12c21.14 24.18 52.91 40 88.54 41.69a41 41 0 01-1.01-9.18c0-22 19.14-39.82 42.92-39.82a44.43 44.43 0 0131.37 12.57 88.53 88.53 0 0027.25-9.62 40.29 40.29 0 01-18.87 22 91.2 91.2 0 0024.73-6.16 89.34 89.34 0 01-21.53 20.6c.07 1.67.07 3.39.07 5.12z" fill-rule="evenodd"/>
</g>
<g id="unfold" fill-rule="evenodd">
<path class="cls-1" transform="rotate(45 151.218 134.646)" d="M141.21 94.64h20v80h-20z"/><path class="cls-1" transform="rotate(45 108.79 134.642)" d="M68.79 124.64h80v20h-80z"/>
</g>
<g id="uniquekey" fill-rule="evenodd">
<path d="M189.998 70.145c-11.046 0-20-8.972-20-20.041 0-11.07 8.954-20.042 20-20.042 11.047 0 20 8.973 20 20.042s-8.953 20.041-20 20.041M169.998 0c-38.662 0-70.003 31.405-70.003 70.145a70.097 70.097 0 003.937 23.196L3.515 193.964c-4.687 4.696-4.687 12.31 0 17.005l25.456 25.51c4.687 4.695 12.286 4.695 16.972 0l3.348-3.356-6.265-22.064 13.336-13.365 14.144 14.171 14.142-14.171-7.07-21.257 14.142-14.172 14.142 14.172 14.143-14.172-7.072-21.257 15.888-14.149c11.556 8.44 25.78 13.432 41.176 13.432 38.662 0 70.003-31.405 70.003-70.146C240 31.405 208.659 0 169.997 0" fill-rule="nonzero"/>
</g>
<g id="unlock" fill-rule="evenodd">
<path d="M120 140h20v80l-20-20zm72.2-92.2A70 70 0 0060 79.91V110H49.93A10 10 0 0040 120.07v119.86A10 10 0 0049.93 250h160.14a10 10 0 009.93-10.07V120.07a10 10 0 00-9.93-10.07H80V79.9A50 50 0 01177 63z" fill-rule="evenodd"/>
</g>
<g id="up" fill-rule="evenodd">
<path fill-rule="evenodd" clip-rule="evenodd" d="M116.9 67.7l-56.5 56.6-21.1-21.1 92.3-92 91.7 91.3-21.2 21.2-55.4-55.6-.1 183.1-29.7-28.9z"/>
</g>
<g id="update" fill-rule="evenodd">
<path d="M250.4 120.1v-80l-22.8 19.6c-21.8-30-57.2-49.6-97.2-49.6-66.3 0-120 53.7-120 120s53.7 120 120 120c53 0 98-34.4 113.9-82l-28.5-9.5c-11.9 35.8-45.6 61.5-85.4 61.5-49.7 0-90-40.3-90-90s40.3-90 90-90c30.9 0 58.1 15.5 74.3 39.2l-24.3 20.8 70 20z" fill-rule="evenodd" clip-rule="evenodd"/>
</g>
<g id="upload" fill-rule="evenodd">
<path d="M10 130A120 120 0 10130 10 120 120 0 0010 130zm182-18.34l-14.26 14.28-37.37-37.5.33 121.56-19.7-20V88.17l-38.4 38.2-14.43-14.26L130.31 50z" fill-rule="evenodd"/>
</g><g id="valora" fill-rule="evenodd"><g><path class="st0" d="M130 0L0 110l20 20 110-90 110 90 20-20z"/><path class="st0" d="M98 170c0-41.4 33.6-75 75-75h.8L130 60 30 140v80c0 5.5 4.4 10 9.9 10h77.9c-10.7-15.5-19.3-35-19.8-57.8V170z"/><path class="st0" d="M173 110c-33.1 0-60 26.9-60 60v1.8c1.2 53 55 86.8 55 86.8 3 1.8 6.9 1.9 9.9.1 0 0 53.9-33.9 55.1-86.9V170c0-33.1-26.9-60-60-60zm0 90c-16.6 0-30-13.4-30-30s13.4-30 30-30 30 13.4 30 30-13.4 30-30 30z"/></g></g><g id="valoraview" fill-rule="evenodd"><g><path class="st0" d="M240 130l20-20L130 0 0 110l20 20 110-90z"/><path class="st0" d="M98 170.1c0-41.5 33.7-75.1 75.1-75.1h.6L130 60 30 140v80c0 5.5 4.4 10 9.9 10h87.9C109 215.8 98 193.7 98 170.1z"/><path class="st0" d="M233.3 170.1c0-33.2-26.9-60.1-60.1-60.1S113 136.9 113 170.1s26.9 60.1 60.1 60.1c12.7 0 25-4 35.3-11.5l38.2 38.2 13.4-13.4-38.2-38.2c7.5-10.1 11.5-22.5 11.5-35.2zm-33.4 0c0-14.8-12-26.7-26.7-26.7V130c22.1 0 40.1 17.9 40.1 40.1h-13.4z"/></g></g>
<g id="videochat" fill-rule="evenodd">
<path d="M240 30H20a10 10 0 00-10 9.93V250l40-40h190a10 10 0 0010-9.93V39.93A10 10 0 00240 30zm-40 120l-30-20v20a10 10 0 01-10 10H80a10 10 0 01-10-10V90a10 10 0 0110-10h80a10 10 0 0110 10v20l30-20z" fill-rule="evenodd"/>
</g>
<g id="videoplayline" fill-rule="evenodd">
<g><path class="cls-1" d="M130 10a120 120 0 10120 120A120 120 0 00130 10zm0 220a100 100 0 11100-100 100 100 0 01-100 100z"/><path class="cls-1" d="M109 184V76l72 54-72 54z"/></g>
</g>
<g id="virtualemail" fill-rule="evenodd">
<path d="M5.5 130.94c0-69.38 49.69-120.63 123.13-120.63 73.12 0 121.87 48.75 121.87 116.87 0 41.88-22.19 71.25-61.56 71.25-24.69 0-36.25-11.25-41.56-27.81-11.25 11.88-26.25 23.75-49.06 23.75-25.63 0-41.87-17.19-41.87-48.12 0-51.56 27.19-83.75 59.69-83.75 20 0 29.06 7.19 36.25 15.94L154.56 65h38.13l-15.31 93.12c-2.5 12.81 2.5 19.69 17.19 19.69 19.69 0 33.75-17.81 33.75-49.38 0-57.19-39.37-96.56-100-96.56-60.94 0-99.06 40.94-99.06 99.06 0 57.81 36.88 100 97.5 100 23.12 0 42.5-5 58.75-15.94l10.62 15.31c-18.12 12.81-43.44 20-70.94 20C51.44 250.31 5.5 200 5.5 130.94zm134.69 21.88l7.81-48.13c-6.87-7.5-12.81-10.63-22.5-10.63-20.63 0-30.63 24.06-30.63 48.12 0 14.69 4.69 23.12 20 23.12 9.07.01 18.13-5.3 25.32-12.49z"/>
</g>
<g id="virtualreality" fill-rule="evenodd">
<g><path class="cls-1" d="M99.83 150.89a34.89 34.89 0 1059.55-24.67l-24.67 24.67V116a34.89 34.89 0 00-34.88 34.89zM96.47 51.68h-6.24V63h6.24c5.28 0 7.81-1.52 7.81-5.73s-2.53-5.59-7.81-5.59z"/><path class="cls-1" d="M140 94V36a6 6 0 00-6-6H26a6 6 0 00-6 6v58a6 6 0 006 6h108a6 6 0 006-6zm-77.48-8h-8.65L39.76 44.88l8.82-1.35 9.72 30.4h.11l9.83-29.72h8.6zm42.6.51l-9.61-16.4h-5.28v15.68h-9V44.21h15.63c10.23 0 16.35 3.65 16.35 12.87 0 6.57-3.09 10.17-8.65 11.86L114 85.12z"/><path class="cls-1" d="M160 75.35v29.73A52.34 52.34 0 1192.48 120H46.54a132 132 0 00-16.48 30.89s26.16 78.49 104.66 78.49 104.66-78.49 104.66-78.49S218.93 89.6 160 75.35z"/></g>
</g>
<g id="visualize" fill-rule="evenodd">
<path d="M130 130V90a40 40 0 1028.28 11.72zm0-90c-90 0-120 90-120 90s30 90 120 90 120-90 120-90-30-90-120-90zm0 150a60 60 0 1160-60 60 60 0 01-60 60z"/>
</g>
<g id="walkingdirections" fill-rule="evenodd">
<path d="M149 122.3l9.4 18.2 42.7 17L210 130l-30-11-15.3-46.6S158 74.7 157 75c-5.3 1.2-10.9 1.5-16.3.8-4.5-.6-8.8-2-12.7-4.2-1.8-1-8.4-6-8.4-6l-38 19.3L49 124.5l22.4 17.2 23.7-32c.4-.7 16-8.9 16-8.9l-11.9 49.3 42.5 47.4 17.7 52.5h40.2l-24.3-60.6-31.7-44 5.4-23.1zm-4.4-58.2c14.9.1 27.2-11.9 27.3-26.9S160 10.1 145 10s-27.2 11.9-27.3 26.9v.2c0 14.9 12.1 27 26.9 27zM118.5 194l1-2.3-1.7-1.9L98.3 169l-4.2-4.4-2.2 5.7-13.7 35.9.8-1.2-33.5 38.6L40 250h38.7l1.1-1.2 26.5-28 .4-.5.3-.6 11.5-25.7z"/>
</g>
<g id="wallet" fill-rule="evenodd">
<path d="M230 40H30V26a6 6 0 016-6h188a6 6 0 016 6zm20 22v156a12 12 0 01-12 12H22a12 12 0 01-12-12V62a12 12 0 0112-12h216a12 12 0 0112 12zm-138.57 59H30v82.27a7.76 7.76 0 007.78 7.73H60zM140 71H37.78A7.75 7.75 0 0030 78.73V101h92.86zm80 69a20 20 0 10-20 20 20 20 0 0020-20z" fill-rule="evenodd"/>
</g>
<g id="watch" fill-rule="evenodd">
<path class="st0" d="M180 67.2L170.5 10h-80L81 67.2c-34.7 27.3-40.6 77.6-13.3 112.3 3.9 4.9 8.4 9.4 13.3 13.3l9.5 57.2h80l9.5-57.2c34.7-27.3 40.6-77.6 13.3-112.3-3.9-4.9-8.4-9.4-13.3-13.3zM130.5 190c-33.1 0-60-26.9-60-60s26.9-60 60-60 60 26.9 60 60-26.9 60-60 60z"/><path class="st0" d="M132.4 101.8l-10.8-10.9v48.8h27.1l10.8-10.9h-27.1z"/>
</g>
<g id="weather" fill-rule="evenodd">
<path d="M166.18 20.21L155.88 10h-.55v34.93h10.85V20.21zM106 37.88H91.4l-.39.38L115.94 63l7.67-7.6L106 37.88zm143.7 77.45l10.3-10.21v-.54h-35.25v10.75zm-23.83-68.77V32.12l-.39-.38-24.93 24.7 7.67 7.6 17.64-17.48zm-12 62.14c0-29-23.79-52.48-53.14-52.48a53.2 53.2 0 00-48.09 30.18c-.19.41-.51 1.35-.69 1.76 18.63 6.85 35 20.54 41.69 37.31a36.57 36.57 0 0111.85-.67c14.6 1 27 7.06 36.18 17.41a51.88 51.88 0 0012.23-33.5zM160.49 240c27.7 0 50.16-22.74 50.16-50.78s-22.46-50.78-50.16-50.78a49.25 49.25 0 00-12.49 1.65 71.66 71.66 0 00-66.34-45.18C42.08 94.91 10 127.39 10 167.45S42.08 240 81.66 240zm0 0" fill-rule="evenodd"/>
</g>
<g id="wellness" fill-rule="evenodd">
<path d="M130 10a120 120 0 10120 120A120 120 0 00130 10zm68.42 110c0 39-68.5 78.29-68.5 78.29S61.42 159 61.42 120h.35a28.05 28.05 0 01-.35-4.82 34.25 34.25 0 0168.15-4.84h.69a34.25 34.25 0 0168.15 4.82 28.07 28.07 0 01-.35 4.82z" fill-rule="evenodd"/>
</g>
<g id="wifi" fill-rule="evenodd">
<g><path class="cls-1" d="M67.24 169.76L79.64 197a72.81 72.81 0 01100.73 0l12.39-27.27a93.6 93.6 0 00-125.52 0zM130 208a51.85 51.85 0 00-37.92 16.42l6.72 14.78h62.4l6.72-14.78A51.85 51.85 0 00130 208zM130 20.8A196.7 196.7 0 0016 57l12.32 27.15a176.87 176.87 0 01203.36 0L244 57a196.7 196.7 0 00-114-36.2z"/><path class="cls-1" d="M41.51 113.17l12.34 27.15a124.82 124.82 0 01152.3 0l12.34-27.15a145.62 145.62 0 00-177 0z"/></g>
</g>
<g id="wikimetrics" fill-rule="evenodd">
<g><path class="cls-1" d="M166 172l-26-17v-25h-20v25l-26 17 12 16 24-16 24 16 12-16zM180 110a45 45 0 00-34-44 35 35 0 01-31 0 45 45 0 00-34 44v10h99z"/><circle class="cls-1" cx="130" cy="35" r="25"/><path class="cls-1" d="M76 196a35 35 0 01-31 0 45 45 0 00-34 44v10h99v-10a45 45 0 00-34-44z"/><circle class="cls-1" cx="60" cy="165" r="25"/><path class="cls-1" d="M216 196a35 35 0 01-31 0 45 45 0 00-34 44v10h99v-10a45 45 0 00-34-44z"/><circle class="cls-1" cx="200" cy="165" r="25"/></g>
</g>
<g id="withoutlocation" fill-rule="evenodd">
<path d="M129.83 10a100 100 0 00-100 100v3c2 88.3 91.6 144.71 91.6 144.71 4.56 3.09 12 3.1 16.54.12 0 0 89.79-56.52 91.77-144.83v-3a100 100 0 00-99.91-100zm49.5 135.36l-14.14 14.14-35.36-35.36-35.35 35.36-14.14-14.14L115.69 110 80.34 74.64 94.48 60.5l35.35 35.36 35.36-35.36 14.14 14.14L144 110z" fill-rule="evenodd"/>
</g>
<g id="woman" fill-rule="evenodd">
<g><path class="cls-1" d="M109.5 59.4l-30 120h19.83v70h20v-70h20v70h20v-70h20.17l-30-120h-40zM195.7 138.73l-21-79.33h-15.4l20.14 73.82 16.26 5.51zM99.7 59.4H84.3l-21 79.33 16.26-5.51L99.7 59.4zM115.42 43.48a20 20 0 0028.15 0h5.93c0-11 4.06-34.4-20-34.4s-20 23.36-20 34.4z"/></g>
</g>
<g id="womenshoe" fill-rule="evenodd">
<g><path class="cls-1" d="M130 230h120v-8.18a35.31 35.31 0 00-19.52-31.58L190 170a34.14 34.14 0 01-24.14 10H159a32.77 32.77 0 01-28.45-16.51l-13.23-23.16c-11.5-20.13-25.64-58.64-42-75L40 30 11.71 70a12 12 0 00-.85 10.63L30 130h20l70.4 95.2a12 12 0 009.6 4.8z"/><path class="cls-1" d="M30 150h20v80H30z"/></g>
</g>
<g id="word" fill-rule="evenodd">
<path class="cls-1" d="M129.42 117.35c-7.56 0-11.81 6-11.81 15.77s4.25 16.13 11.81 16.13 11.74-6.34 11.74-16.13-4.26-15.77-11.74-15.77zM70 118.77h-4v29h4.16c10.87 0 14.11-4.1 14.11-14.9 0-9.87-3.27-14.1-14.27-14.1z"/><path class="cls-1" d="M160.1 10.77H46.47A6.42 6.42 0 0040 17v227.5a6.41 6.41 0 006.48 6.27h167.24a6.23 6.23 0 006.28-6.27V70.77zm-90.73 149H52v-53h17.37c15.84 0 29.31 5.91 29.31 26.14-.01 20.95-13.68 26.86-29.31 26.86zm60 1c-12.89 0-26.21-8.14-26.21-27.65s13.32-27.65 26.21-27.65 26.14 8.14 26.14 27.65-13.28 27.65-26.09 27.65zm55.66 0c-14 0-25-8.14-25-27.65s11.45-27.65 25-27.65c14.54 0 20.31 7.49 22.54 17l-13.61 4c-1.44-5.11-3.46-9.15-9-9.15-7.13 0-10.51 5.83-10.51 15.77s3.53 16.13 10.66 16.13c5.62 0 7.92-3.53 9.58-10.15l13.61 3c-2.56 10.85-8.68 18.7-23.23 18.7z"/>
</g>
<g id="xml" fill-rule="evenodd">
<path d="M159.7 9.9H46.1c-3.5 0-7 2.8-7 6.3v227.5c0 3.5 3.5 6.3 7 6.3h167.2c3.5 0 5.7-2.8 5.7-6.3V69.9zM86.4 160.7l-10.9-18.2-10.2 17.3H50.8l17.3-28.4L52.9 107l14.2-2 9.2 15.6 8.3-14.7h14.2l-15.4 25.6 16.8 27.3zm74.3-.9h-13v-28.2c-.3 1.1-.7 2.3-1 3.5l-.1.2-8 24.6H127l-8.1-24.9c-.4-1.4-.8-2.5-1.1-3.7V160h-12.3v-54h16.8l10.9 35.9 10.2-35.9h17.2v53.8zm8.7 0v-54h13.4v42.7h21.9l2 11.3z"/>
</g>
<g id="youtube" fill-rule="evenodd">
<g><path class="cls-1" d="M116 149.86l41.41-21.45L116 106.8v43.06z"/><path class="cls-1" d="M130.84 10.39a120 120 0 10120 120 120 120 0 00-120-120zM208 135.77a178.53 178.53 0 01-2 24.8s-1.73 10.56-6.33 15.21c-5.83 6.11-12.48 6.14-15.47 6.49-21.45 1.55-53.71 1.6-53.71 1.6s-39.88-.36-52.14-1.54c-3.41-.64-11.08-.45-16.91-6.55-4.59-4.65-5-15.21-5-15.21s-.44-12.4-.44-24.8v-11.63c0-12.4.43-24.8.43-24.8s.95-10.56 5.57-15.21a24 24 0 0115.08-7.53C98.5 75 130.4 74 130.4 74h.07s32.17 1 53.62 2.59c3 .36 9.53.91 15.36 7C204 88.26 206 99.08 206 99.08a184.82 184.82 0 012 25.07z"/></g>
</g>
<g id="youtube2" fill-rule="evenodd">
<path d="M247.6 86.67s-2.35-16.66-9.54-24c-9.13-9.63-19.35-9.68-24-10.24-33.59-2.45-84-2.45-84-2.45h-.1s-50.38 0-84 2.45c-4.69.56-14.92.61-24 10.24-7.19 7.33-9.54 24-9.54 24A368.31 368.31 0 0010 125.79v18.34a368.23 368.23 0 002.4 39.12s2.34 16.66 9.54 24c9.13 9.63 21.12 9.32 26.46 10.33C67.6 219.43 130 220 130 220s50.43-.07 84-2.52c4.69-.56 14.92-.61 24-10.24 7.2-7.33 9.54-24 9.54-24a368.69 368.69 0 002.4-39.12v-18.33a368.76 368.76 0 00-2.34-39.12zm-142.38 79.68V98.44l64.85 34.07z" fill-rule="evenodd"/>
</g>
      </defs>
    </svg>
  </template>
</cells-iconset-svg>`;
  document.head.appendChild(iconset.content);

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
  background-color: ${unsafeCSS(colors.primaryCoreLightened)};
  }

  [ambient^=dark] {
  background-color: ${unsafeCSS(colors.primaryCore)};
  }

  [ambient=light100] {
  background-color: ${unsafeCSS(colors.secondary100)};
  }

  [ambient=dark100] {
  background-color: ${unsafeCSS(colors.primaryMedium)};
  }

  [ambient=dark200] {
  background-color: ${unsafeCSS(colors.primaryCore)};
  }

  [ambient=dark300] {
  background-color: ${unsafeCSS(colors.primaryCoreDark)};
  }

  [ambient=dark400] {
  background-color: ${unsafeCSS(colors.primaryCoreDarkened)};
  }

  @media (max-width: 768px) {
  *, *:before, *:after {
  -webkit-tap-highlight-color: transparent;
  }
  }
`);

  {
    window.Shadow = window.Shadow || {}; //Polyfill support for matches method

    if (!Element.prototype.matches) {
      Element.prototype.matches = Element.prototype.webkitMatchesSelector || Element.prototype.oMatchesSelector || Element.prototype.msMatchesSelector || Element.prototype.mozMatchesSelector;
    }

    const isShadow = document.body && (document.body.createShadowRoot || document.body.attachShadow);

    function cleanSelectors(selectors) {
      return selectors.filter(function (sel) {
        return sel && sel.trim().length > 0;
      });
    }

    function collectionAsArray(collection) {
      var array = [];

      if (collection) {
        for (var i = 0; i < collection.length; i++) {
          array.push(collection.item(i));
        }
      }

      return array;
    }

    function uniqueConcat(original, added) {
      var result = original.slice(0);
      added.forEach(function (element) {
        if (result.indexOf(element) < 0) {
          result.push(element);
        }
      });
      return result;
    }

    function getShadowChildren(element) {
      if (element.shadowRoot) {
        return collectionAsArray(element.shadowRoot.children);
      }

      return [];
    }

    function getCommonChildren(element) {
      return collectionAsArray(element.children);
    }

    function getChildren(element) {
      return [].concat(getShadowChildren(element)).concat(getCommonChildren(element));
    }

    function getNextElement(currentElement, nextSelector) {
      var children = getChildren(currentElement);
      var found = null;

      for (var i = 0; i < children.length; i++) {
        found = children[i].matches(nextSelector) ? children[i] : getNextElement(children[i], nextSelector);

        if (found) {
          break;
        }
      }

      return found;
    }

    function getNextElements(currentElement, nextSelector) {
      var children = getChildren(currentElement);
      var nextElements = [];
      children.forEach(function (child) {
        if (child.matches(nextSelector)) {
          nextElements.push(child);
        }

        nextElements = nextElements.concat(getNextElements(child, nextSelector));
      });
      return nextElements;
    }

    function findElement(selectors, baseElement) {
      var currentElement = baseElement || document.documentElement;

      for (var i = 0; i < selectors.length; i++) {
        currentElement = getNextElement(currentElement, selectors[i]);

        if (!currentElement) {
          break;
        }
      }

      return currentElement;
    }

    function findElements(selectors, baseElement) {
      var currentElements = [baseElement || document.documentElement];

      for (var i = 0; i < selectors.length; i++) {
        var nextElements = [];

        for (var j = 0; j < currentElements.length; j++) {
          nextElements = uniqueConcat(nextElements, getNextElements(currentElements[j], selectors[i]));
        }

        currentElements = nextElements;
      }

      return currentElements;
    }

    function querySelector(query, fromElement) {
      var selectors = cleanSelectors(isShadow ? query.split(' ') : [query]);
      return findElement(selectors, fromElement);
    }

    function querySelectorAll(query, fromElement) {
      var selectors = cleanSelectors(isShadow ? query.split(' ') : [query]);
      return findElements(selectors, fromElement);
    }

    window.Shadow.querySelector = querySelector;
    window.Shadow.querySelectorAll = querySelectorAll;
  }

  /* global Shadow */
  class LocalesService {
    get langPath() {
      if (this.langFolderMapping) {
        return this.langFolderMapping[this.lang];
      } else {
        return this.lang;
      }
    }

    get lang() {
      return this._lang;
    }

    get url() {
      return this._url;
    }

    set url(url) {
      // Make sure url ends on slash.
      if (url && url.substr(-1) !== '/') {
        url += '/';
      }

      if (url !== this._url) {
        this._url = url;
        this.fetchLanguage();
      }
    }

    get files() {
      return this._files;
    }

    set files(files) {
      if (files !== this._files) {
        this._files = files;
        this.fetchLanguage();
      }
    }

    constructor(data) {
      this.locales = {};
      this._files = data.files;
      this.disabled = data.disabled;
      this._url = data.url || 'locales/';
      this._lang = data.lang || document.documentElement.lang;
      this.langFolderMapping = data.langFolderMapping;
      this._translationsRequestsPromises = [];
      this.noCache = data.noCache;
      this.unFlattened = data.unFlattened;
    }

    _onLoadLanguage(data, lang, url) {
      this.locales[lang] = this.locales[lang] || {};
      this.locales[lang][url] = data;

      this._refreshNodes();
    }

    _fetch(url, method = 'GET') {
      const request = new XMLHttpRequest();
      return new Promise((resolve, reject) => {
        request.onreadystatechange = () => {
          if (request.readyState !== 4) {
            return;
          }

          if (request.status >= 200 && request.status < 300) {
            resolve(request);
          } else {
            reject({
              status: request.status,
              statusText: request.statusText
            });
          }
        };

        request.open(method, url, true);
        request.send();
      }).catch(() => {});
    }

    fetchLanguage() {
      if (this.disabled || !this.lang || !this.url) {
        return;
      }

      let urls;
      const cacheParam = this.noCache ? `?v=${Date.now()}` : '';

      if (!this.files) {
        const url = `${this.url}${this.langPath}.json${cacheParam}`;
        urls = [url];
      } else {
        urls = this.files.map(file => `${this.url}${this.langPath}/${file}.json${cacheParam}`);
      }

      const lang = this.lang;
      const promise = Promise.all(urls.map(currentUrl => this._fetch(currentUrl).then(response => JSON.parse(response.responseText)).then(data => this._onLoadLanguage(data, lang, currentUrl)))).then(() => {
        const event = new CustomEvent('i18n-language-ready', {
          detail: {
            language: lang
          },
          bubbles: true,
          composed: true
        });
        document.dispatchEvent(event);
      }).catch(() => {});

      this._translationsRequestsPromises.push(promise);

      return promise;
    }

    get translationsRequests() {
      return Promise.all(this._translationsRequestsPromises);
    }

    get currentLocale() {
      return this.locales ? this.locales[this.lang] : false;
    }

    set lang(language) {
      if (language !== this._lang) {
        document.documentElement.lang = language;
        this._lang = language;
        this.fetchLanguage();
        const event = new CustomEvent('i18n-lang-changed', {
          detail: {
            language
          },
          bubbles: true,
          composed: true
        });
        document.dispatchEvent(event);
      }
    }
    /**
     * Translates a string to the current language.
     *
     * @param  {String} msgId String to translate.
     * @return {String} Translated text. If it doesn't exists, returns null.
     */


    getTranslation(msgId) {
      if (!this.currentLocale || !msgId) {
        return null;
      }

      return this._getMessage(this.currentLocale, msgId);
    }

    _getMessage(locale, msgId) {
      for (const key in locale) {
        if (locale[key]) {
          if (this._get(locale[key], msgId)) {
            return this._get(locale[key], msgId);
          }
        }
      }

      return null;
    }
    /**
     * get key from json
     *
     * @param  {Object} obj  Json
     * @param  {String} key  The key to get from the json
     * @return {String}      The key value
     */


    _get(obj, key) {
      return this.unFlattened ? this._getUnflattenedKey(obj, key) : obj[key];
    }
    /**
     * Returns an object from a flattened translation key with dots (`some.nested.key`)
     *
     * @param {Object} obj Json
     * @param {String} key The key to get from json
     */


    _getUnflattenedKey(obj, key) {
      try {
        return key.split('.').reduce((acc, prop) => acc[prop], obj);
      } catch (e) {
        return;
      }
    }

    _refreshNodes() {
      const componentsWithI18n = Shadow.querySelectorAll('[has-i18n]');
      componentsWithI18n.forEach(item => {
        item.updateTranslation();
      });
    }

  }

  /**

  cells-i18n-mixin
  =======================

  `CellsMixins.i18nMixin` provides a normalized interface for translate strings.

  ## Import

  1) Import the mixin in your component:

  2) Use `CellsI18nMixin` to extend from it in the class definition of your component:

  ```js
  class MyElement extends CellsI18nMixin(LitElement) {
    static get is() { return 'my-element' }
  }
   ```

  ## Usage

  **string-to-translate** is the key to the string or message ('locale') in the corresponding language, in your **locales/{lang}.json** files.

   __Note:__ It is recommended that the keys have the name of the component as suffix. E.g. 'cells-basic-login-greeting' or 'cells-basic-login-username'

   1. Basic usage (binding)

      ```js
      ${this.doTranslation('string-to-translate')}
      ```

      or, in a shorter but equivalent way (t() is just an alias of doTranslation()):

      ```js
      ${this.t('string-to-translate')}
      ```

   2. Define an optional 'fallback' string with the second parameter (the **Fallback string** will display if **string-to-translate** key doesn't exist in 'locales'.)

      ```js
      ${this.t('string-to-translate', 'Fallback string')}
       ```

   3. For asynchronous translation on connectedCallback:

      ```js
      connectedCallback() {
        super.connectedCallback();
        this.getMsg('string-to-translate').then((translation) => {
          this.set('readyTranslation', translation);
        });
      }
      ```

   4. Define an optional 'interpolation' string object with the third parameter::

      ```js
      ${this.t('string-to-translate', '', '{"attribute": "value"}')
       ```

      Interporlation object can be self properties:

      ```js
      ${this.t('string-to-stranslate-with-ref-to-self-property')
      ```

  __Note:__ If **string-to-translate** contains a comma (,) it must be escaped by preceding it with a '\'

  Example:

  ```js
  <p>
   ${this.t('Welcome')}
   <input type="text" placeholder="${this.t('Username, Email or UserID')}">
  </p>
  ```

  ## Locales (translations)

  Finally, have the translations for each language on the *locales* folder.

  This folder will have one JSON file for each supported language (en.json, es.json, en-US.json, etc).

  For every language the Object defined contains all translated strings indexed by a unique ID, which is the same across all languages.

  ***en.json:***

  ```json
  {
    "your-component-name-cancel": { // valid legacy syntax
      "message": "Cancel"
    },
    "your-component-name-info": "Information", //simple syntax
    "explicitText": { "${attribute}, hello!" }, // interpolated variable
    "some-key": { "Bye {{attribute}}" }, // alternative supported syntax for interpolation
    "arrayText": ["part1", "part2", "...", "partN"],
    "self-property-msg": "My property value is ${propertyName}"
  }
  ```

  ***es.json:***

  ```json
  {
    "your-component-name-cancel": "Cancelar", //simple syntax
    "explicitText": { "Hola ${attribute}!" },
    "arrayText": ["part1", "part2", "...", "partN"]
  }
  ```

  ### Multilevel JSON

  JSON with nested keys are supported, however it's encouraged not to use it in standalone components to prevent accidental overrides that may occur when the translation files of the components are merged into a single file in a Cells application. JSON with nested keys are intended to be used in applications (locales-app) and _in-app_ components. Requires setting `unFlattened` in `window.I18nMsg` to `true`.

  ```js
    window.I18nMsg = window.I18nMsg || {};
    window.I18nMsg.unFlattened = true;
  ```

  ### Locale file names

  Different file names that those that correspond with the `lang` attribute of the document are supported.
  Using it requires setting `files` array property in `window.I18nMsg`. **This feature should not be used in standalone components**. As with multilevel JSON, it is intented to be used in applications.

  ```js
    window.I18nMsg = window.I18nMsg || {};
    window.I18nMsg.files = ['eng.json', 'spa.json'];
  ```

  ## Disable translations

  To disable the translation functionality (for instance, in applications that don't have locales folder), set `window.I18nMsg.disabled` to `true` to
  prevent network requests to non-existent locales files.

  In your main html file (index.html):

  ```js
    window.I18nMsg = window.I18nMsg || {};
    window.I18nMsg.disabled = true;
  ```

  ## Disable caching locales

  To disable the default caching of locales and force the behaviour to fetch them every time, just set window.I18nMsg.noCache to `true`.

  In your main html file (index.html):

  ```js
    window.I18nMsg = window.I18nMsg || {};
    window.I18nMsg.noCache = true;
  ```

  * @mixinFunction
  * @demo demo/index.html
  * @hero cells-i18n-mixin.png
  */

  const CellsI18nMixin = dedupingMixin(superClass => {
    return class extends superClass {
      constructor() {
        super();
        this.hasI18n = true;
      }

      static get properties() {
        return {
          /**
           * Puts a readonly attribute to the component to mark this node has i18n.
           * @private
           */
          hasI18n: {
            type: Boolean,
            reflect: true,
            attribute: 'has-i18n'
          }
        };
      }
      /**
       * The `i18n-language-ready` is fired in `document` after the locale was fetched.
       *
       * @event i18n-language-ready
       * @detail {{language: String}}
       */

      /**
       * Fired when language of global Object (I18nMsg) changes
       * @event i18n-lang-changed
       */


      doTranslation(msgId, fallback, interpolation) {
        return this._doTranslation(msgId, fallback, interpolation);
      }

      t(...args) {
        return this._doTranslation(...args);
      }
      /**
       * Refresh the printed translated text with the current language.
       */


      updateTranslation() {
        this.requestUpdate();
      }
      /**
       * Translates a string to the current language from html code.
       *
       * @param {String} msgId String id to translate.
       * @param {String} fallback (optional) A string to be returned if {{msgId}} doesn't exists in the dictionary. If this param is not defined and the translated text doesn't exists, the original {{msgId}} is returned.
       * @param {String|Object} interpolation  (optional) Object or String for interpolate
       *
       * @return {String} Translated text. If it doesn't exists, returns a fallback text.
       */


      _doTranslation(msgId, fallback, interpolation) {
        const text = I18nMsg.getTranslation(msgId) || fallback;

        if (text) {
          return this._transform(text, interpolation || {});
        }

        return msgId;
      }
      /**
       * getAsyncTranslation() alias
       */


      getMsg(msgId, interpolation) {
        return this.getAsyncTranslation(msgId, interpolation);
      }
      /**
       * Translates a string when the dictionary is loaded from the js.
       *
       * @param {String} msgId          (optional) String id to translate.
       * @param {String} interpolation  (optional) Object String for interpolate variables.
       *
       * @return {Promise} Returns a Promise that is resolved when the dictionary is ready.
       */


      getAsyncTranslation(msgId, interpolation) {
        return I18nMsg.translationsRequests.then(() => this.getTranslation(msgId, interpolation));
      }
      /**
       * Translates a string to the current language.
       *
       * @param  {String}           msgId String to translate.
       * @param  {String | Object} interpolation  (optional) Object String for interpolate
       * @return {String}           Translated text. If it doesn't exists, returns null.
       */


      getTranslation(msgId, interpolation) {
        const msg = I18nMsg.getTranslation(msgId);

        if (msg) {
          return this._transform(msg, interpolation);
        }

        return null;
      }

      _transform(msg, interpolation) {
        let translatedString = msg;

        if (Array.isArray(msg)) {
          translatedString = msg.join('');
        } else if (msg.message) {
          translatedString = msg.message;
        }

        const parsedInterpolation = this._parseInterpolation(interpolation);

        if (parsedInterpolation) {
          return this._interpolateMsg(translatedString, parsedInterpolation);
        }

        return translatedString;
      }

      _parseInterpolation(interpolation) {
        if (interpolation !== '') {
          try {
            if (typeof interpolation === 'string') {
              interpolation = JSON.parse(decodeURI(interpolation));
            }
          } catch (e) {
            interpolation = '';
          }

          return interpolation;
        }
      }

      _interpolateMsg(msg, interpolation) {
        msg = this._pluralize(msg, interpolation);

        if (!msg || typeof msg === 'object') {
          return '';
        }

        const useRegexp = msg.indexOf('${') > -1 ? /\${(.*?)}/g : /\{\{(.*?)}}/g;
        return msg.replace(useRegexp, (_, code) => {
          return code in interpolation ? interpolation[code] : this[code];
        });
      }

      _pluralize(msg, interpolation) {
        let msgResult = msg;

        if (interpolation.count !== undefined && msg.one && msg.other) {
          msgResult = interpolation.count === 1 ? msg.one : msg.other;
        }

        return msgResult;
      }

    };
  });

  (function (window) {
    window.I18nMsg = window.I18nMsg || {};
    /* eslint-disable read-only, no-global-assign */

    if (window.I18nMsg instanceof LocalesService) {
      return;
    }

    window.I18nMsg = new LocalesService(window.I18nMsg);
    /* eslint-enable read-only, no-global-assign */

    window.I18nMsg.fetchLanguage();
  })(window);

  var styles$3 = css`:host {
  display: inline-block;
  box-sizing: border-box;
  font-size: var(--typographyTypeSmall, ${unsafeCSS(typography.typeSmall)});
  font-weight: var(--fontFacePrimaryMediumItalicFontWeight, ${unsafeCSS(fontFacePrimary.mediumItalic.fontWeight)});
  font-style: var(--fontFacePrimaryMediumItalicFontStyle, ${unsafeCSS(fontFacePrimary.mediumItalic.fontStyle)});
  line-height: var(--lineHeightTypeSmall, ${unsafeCSS(lineHeight.typeSmall)}); }

:host([hidden]),
[hidden] {
  display: none !important; }

*,
*:before,
*:after {
  box-sizing: inherit; }
`;

  /**
  Date types are usually used at the top of a movement list to inform the user of the date of a transaction.

  Example:

  ```html
  <bbva-date
    id="custom-options"
    date="December 17, 1995"
    locale="en-US"
    ></bbva-date>
  <script>
    const date = document.getElementById('custom-options');
    date.options = {
      day: '2-digit',
      month: 'long',
      year: '2-digit',
    };
  </script>
  ```

  ## Styling

  The following custom properties are available for styling:

  ### Custom properties

  | Selector | CSS Property | CSS Variable | Theme Variable                          | Foundations/Fallback                                              |
  | -------- | ------------ | ------------ | --------------------------------------- | ----------------------------------------------------------------- |
  | :host    | font-size    |              | --typographyTypeSmall                   | foundations.typography.typeSmall                    |
  | :host    | font-weight  |              | --fontFacePrimaryMediumItalicFontWeight | foundations.fontFacePrimary.mediumItalic.fontWeight |
  | :host    | font-style   |              | --fontFacePrimaryMediumItalicFontStyle  | foundations.fontFacePrimary.mediumItalic.fontStyle  |
  | :host    | line-height  |              | --lineHeightTypeSmall                   | foundations.lineHeight.typeSmall                    |
  > Styling documentation generated by Cells CLI

  @customElement bbva-date
  @polymer
  @LitElement
  @demo demo/index.html
  */

  class BbvaDate extends LitElement {
    static get is() {
      return 'bbva-date';
    }

    static get properties() {
      return {
        /*
         * Date object that represents the string that's showed by the component.
         * When initializing, it expects whatever format `new Date()` can receive
         * and converts it to a `Date`.
        n      */
        date: {
          type: Date,
          converter: value => new Date(value)
        },

        /*
         * Based on the `toLocaleDateString()` spec, this object is passed into
         * the function to be printed accordingly.
         */
        options: {
          type: Object
        },

        /*
         * String formated in the form of `en-US` that's passed into
         * `toLocaleDateString()` to be translated correctly.
         */
        locale: {
          type: String
        }
      };
    }

    constructor() {
      super();
      this.date = new Date();
      this.locale = 'es-ES';
      this.options = {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      };
    }

    static get styles() {
      return [styles$3, getComponentSharedStyles('bbva-date-shared-styles')];
    }

    render() {
      return html`
      ${this.date.toLocaleDateString() !== 'Invalid Date' ? this.date.toLocaleDateString(this.locale, this.options) : html``}
    `;
    }

  }
  customElements.define(BbvaDate.is, BbvaDate);

  /**
  @license
  Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
  This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
  The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
  The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
  Code distributed by Google as part of the polymer project is also
  subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
  */

  let microtaskCurrHandle = 0;
  let microtaskLastHandle = 0;
  let microtaskCallbacks = [];
  let microtaskNodeContent = 0;
  let microtaskNode = document.createTextNode('');
  new window.MutationObserver(microtaskFlush).observe(microtaskNode, {
    characterData: true
  });

  function microtaskFlush() {
    const len = microtaskCallbacks.length;

    for (let i = 0; i < len; i++) {
      let cb = microtaskCallbacks[i];

      if (cb) {
        try {
          cb();
        } catch (e) {
          setTimeout(() => {
            throw e;
          });
        }
      }
    }

    microtaskCallbacks.splice(0, len);
    microtaskLastHandle += len;
  }
  /**
   * Async interface wrapper around `setTimeout`.
   *
   * @namespace
   * @summary Async interface wrapper around `setTimeout`.
   */


  const timeOut = {
    /**
     * Returns a sub-module with the async interface providing the provided
     * delay.
     *
     * @memberof timeOut
     * @param {number=} delay Time to wait before calling callbacks in ms
     * @return {!AsyncInterface} An async timeout interface
     */
    after(delay) {
      return {
        run(fn) {
          return window.setTimeout(fn, delay);
        },

        cancel(handle) {
          window.clearTimeout(handle);
        }

      };
    },

    /**
     * Enqueues a function called in the next task.
     *
     * @memberof timeOut
     * @param {!Function} fn Callback to run
     * @param {number=} delay Delay in milliseconds
     * @return {number} Handle used for canceling task
     */
    run(fn, delay) {
      return window.setTimeout(fn, delay);
    },

    /**
     * Cancels a previously enqueued `timeOut` callback.
     *
     * @memberof timeOut
     * @param {number} handle Handle returned from `run` of callback to cancel
     * @return {void}
     */
    cancel(handle) {
      window.clearTimeout(handle);
    }

  };
  /**
   * Async interface for enqueuing callbacks that run at microtask timing.
   *
   * Note that microtask timing is achieved via a single `MutationObserver`,
   * and thus callbacks enqueued with this API will all run in a single
   * batch, and not interleaved with other microtasks such as promises.
   * Promises are avoided as an implementation choice for the time being
   * due to Safari bugs that cause Promises to lack microtask guarantees.
   *
   * @namespace
   * @summary Async interface for enqueuing callbacks that run at microtask
   *   timing.
   */

  const microTask = {
    /**
     * Enqueues a function called at microtask timing.
     *
     * @memberof microTask
     * @param {!Function=} callback Callback to run
     * @return {number} Handle used for canceling task
     */
    run(callback) {
      microtaskNode.textContent = microtaskNodeContent++;
      microtaskCallbacks.push(callback);
      return microtaskCurrHandle++;
    },

    /**
     * Cancels a previously enqueued `microTask` callback.
     *
     * @memberof microTask
     * @param {number} handle Handle returned from `run` of callback to cancel
     * @return {void}
     */
    cancel(handle) {
      const idx = handle - microtaskLastHandle;

      if (idx >= 0) {
        if (!microtaskCallbacks[idx]) {
          throw new Error('invalid async handle: ' + handle);
        }

        microtaskCallbacks[idx] = null;
      }
    }

  };

  /**
  @license
  Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
  This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
  The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
  The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
  Code distributed by Google as part of the polymer project is also
  subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
  */
  /**
   * @summary Collapse multiple callbacks into one invocation after a timer.
   */

  class Debouncer {
    constructor() {
      this._asyncModule = null;
      this._callback = null;
      this._timer = null;
    }
    /**
     * Sets the scheduler; that is, a module with the Async interface,
     * a callback and optional arguments to be passed to the run function
     * from the async module.
     *
     * @param {!AsyncInterface} asyncModule Object with Async interface.
     * @param {function()} callback Callback to run.
     * @return {void}
     */


    setConfig(asyncModule, callback) {
      this._asyncModule = asyncModule;
      this._callback = callback;
      this._timer = this._asyncModule.run(() => {
        this._timer = null;

        this._callback();
      });
    }
    /**
     * Cancels an active debouncer and returns a reference to itself.
     *
     * @return {void}
     */


    cancel() {
      if (this.isActive()) {
        this._asyncModule.cancel(
        /** @type {number} */
        this._timer);

        this._timer = null;
      }
    }
    /**
     * Flushes an active debouncer and returns a reference to itself.
     *
     * @return {void}
     */


    flush() {
      if (this.isActive()) {
        this.cancel();

        this._callback();
      }
    }
    /**
     * Returns true if the debouncer is active.
     *
     * @return {boolean} True if active.
     */


    isActive() {
      return this._timer != null;
    }
    /**
     * Creates a debouncer if no debouncer is passed as a parameter
     * or it cancels an active debouncer otherwise. The following
     * example shows how a debouncer can be called multiple times within a
     * microtask and "debounced" such that the provided callback function is
     * called once. Add this method to a custom element:
     *
     * ```js
     * import {microTask} from '@polymer/polymer/lib/utils/async.js';
     * import {Debouncer} from '@polymer/polymer/lib/utils/debounce.js';
     * // ...
     *
     * _debounceWork() {
     *   this._debounceJob = Debouncer.debounce(this._debounceJob,
     *       microTask, () => this._doWork());
     * }
     * ```
     *
     * If the `_debounceWork` method is called multiple times within the same
     * microtask, the `_doWork` function will be called only once at the next
     * microtask checkpoint.
     *
     * Note: In testing it is often convenient to avoid asynchrony. To accomplish
     * this with a debouncer, you can use `enqueueDebouncer` and
     * `flush`. For example, extend the above example by adding
     * `enqueueDebouncer(this._debounceJob)` at the end of the
     * `_debounceWork` method. Then in a test, call `flush` to ensure
     * the debouncer has completed.
     *
     * @param {Debouncer?} debouncer Debouncer object.
     * @param {!AsyncInterface} asyncModule Object with Async interface
     * @param {function()} callback Callback to run.
     * @return {!Debouncer} Returns a debouncer object.
     */


    static debounce(debouncer, asyncModule, callback) {
      if (debouncer instanceof Debouncer) {
        debouncer.cancel();
      } else {
        debouncer = new Debouncer();
      }

      debouncer.setConfig(asyncModule, callback);
      return debouncer;
    }

  }

  /**
  @license
  Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
  This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
  The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
  The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
  Code distributed by Google as part of the polymer project is also
  subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
  */
  /**
   * Returns a path from a given `url`. The path includes the trailing
   * `/` from the url.
   *
   * @param {string} url Input URL to transform
   * @return {string} resolved path
   */

  function pathFromUrl$1(url) {
    return url.substring(0, url.lastIndexOf('/') + 1);
  }

  /**
  @license
  Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
  This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
  The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
  The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
  Code distributed by Google as part of the polymer project is also
  subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
  */
  const useNativeCSSProperties$1 = Boolean(!window.ShadyCSS || window.ShadyCSS.nativeCss);
  /**
   * Globally settable property that is automatically assigned to
   * `ElementMixin` instances, useful for binding in templates to
   * make URL's relative to an application's root.  Defaults to the main
   * document URL, but can be overridden by users.  It may be useful to set
   * `rootPath` to provide a stable application mount path when
   * using client side routing.
   */

  let rootPath$1 =  pathFromUrl$1(document.baseURI || window.location.href);
  /**
   * A global callback used to sanitize any value before inserting it into the DOM.
   * The callback signature is:
   *
   *  function sanitizeDOMValue(value, name, type, node) { ... }
   *
   * Where:
   *
   * `value` is the value to sanitize.
   * `name` is the name of an attribute or property (for example, href).
   * `type` indicates where the value is being inserted: one of property, attribute, or text.
   * `node` is the node where the value is being inserted.
   *
   * @type {(function(*,string,string,Node):*)|undefined}
   */

  let sanitizeDOMValue$1 = window.Polymer && window.Polymer.sanitizeDOMValue || undefined;
  /**
   * Globally settable property to make Polymer Gestures use passive TouchEvent listeners when recognizing gestures.
   * When set to `true`, gestures made from touch will not be able to prevent scrolling, allowing for smoother
   * scrolling performance.
   * Defaults to `false` for backwards compatibility.
   */

  let passiveTouchGestures = false;

  /**
  @license
  Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
  This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
  The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
  The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
  Code distributed by Google as part of the polymer project is also
  subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
  */

  let HAS_NATIVE_TA = typeof document.head.style.touchAction === 'string';
  let GESTURE_KEY = '__polymerGestures';
  let HANDLED_OBJ = '__polymerGesturesHandled';
  let TOUCH_ACTION = '__polymerGesturesTouchAction'; // radius for tap and track

  let TAP_DISTANCE = 25;
  let TRACK_DISTANCE = 5; // number of last N track positions to keep

  let TRACK_LENGTH = 2; // Disabling "mouse" handlers for 2500ms is enough

  let MOUSE_TIMEOUT = 2500;
  let MOUSE_EVENTS = ['mousedown', 'mousemove', 'mouseup', 'click']; // an array of bitmask values for mapping MouseEvent.which to MouseEvent.buttons

  let MOUSE_WHICH_TO_BUTTONS = [0, 1, 4, 2];

  let MOUSE_HAS_BUTTONS = function () {
    try {
      return new MouseEvent('test', {
        buttons: 1
      }).buttons === 1;
    } catch (e) {
      return false;
    }
  }();
  /**
   * @param {string} name Possible mouse event name
   * @return {boolean} true if mouse event, false if not
   */


  function isMouseEvent(name) {
    return MOUSE_EVENTS.indexOf(name) > -1;
  }
  /* eslint no-empty: ["error", { "allowEmptyCatch": true }] */
  // check for passive event listeners


  let SUPPORTS_PASSIVE = false;

  (function () {
    try {
      let opts = Object.defineProperty({}, 'passive', {
        get() {
          SUPPORTS_PASSIVE = true;
        }

      });
      window.addEventListener('test', null, opts);
      window.removeEventListener('test', null, opts);
    } catch (e) {}
  })();
  /**
   * Generate settings for event listeners, dependant on `passiveTouchGestures`
   *
   * @param {string} eventName Event name to determine if `{passive}` option is
   *   needed
   * @return {{passive: boolean} | undefined} Options to use for addEventListener
   *   and removeEventListener
   */


  function PASSIVE_TOUCH(eventName) {
    if (isMouseEvent(eventName) || eventName === 'touchend') {
      return;
    }

    if (HAS_NATIVE_TA && SUPPORTS_PASSIVE && passiveTouchGestures) {
      return {
        passive: true
      };
    } else {
      return;
    }
  } // Check for touch-only devices


  let IS_TOUCH_ONLY = navigator.userAgent.match(/iP(?:[oa]d|hone)|Android/); // keep track of any labels hit by the mouseCanceller

  /** @type {!Array<!HTMLLabelElement>} */

  const clickedLabels = [];
  /** @type {!Object<boolean>} */

  const labellable = {
    'button': true,
    'input': true,
    'keygen': true,
    'meter': true,
    'output': true,
    'textarea': true,
    'progress': true,
    'select': true
  }; // Defined at https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#enabling-and-disabling-form-controls:-the-disabled-attribute

  /** @type {!Object<boolean>} */

  const canBeDisabled = {
    'button': true,
    'command': true,
    'fieldset': true,
    'input': true,
    'keygen': true,
    'optgroup': true,
    'option': true,
    'select': true,
    'textarea': true
  };
  /**
   * @param {HTMLElement} el Element to check labelling status
   * @return {boolean} element can have labels
   */

  function canBeLabelled(el) {
    return labellable[el.localName] || false;
  }
  /**
   * @param {HTMLElement} el Element that may be labelled.
   * @return {!Array<!HTMLLabelElement>} Relevant label for `el`
   */


  function matchingLabels(el) {
    let labels = Array.prototype.slice.call(
    /** @type {HTMLInputElement} */
    el.labels || []); // IE doesn't have `labels` and Safari doesn't populate `labels`
    // if element is in a shadowroot.
    // In this instance, finding the non-ancestor labels is enough,
    // as the mouseCancellor code will handle ancstor labels

    if (!labels.length) {
      labels = [];
      let root = el.getRootNode(); // if there is an id on `el`, check for all labels with a matching `for` attribute

      if (el.id) {
        let matching = root.querySelectorAll(`label[for = ${el.id}]`);

        for (let i = 0; i < matching.length; i++) {
          labels.push(
          /** @type {!HTMLLabelElement} */
          matching[i]);
        }
      }
    }

    return labels;
  } // touch will make synthetic mouse events
  // `preventDefault` on touchend will cancel them,
  // but this breaks `<input>` focus and link clicks
  // disable mouse handlers for MOUSE_TIMEOUT ms after
  // a touchend to ignore synthetic mouse events


  let mouseCanceller = function (mouseEvent) {
    // Check for sourceCapabilities, used to distinguish synthetic events
    // if mouseEvent did not come from a device that fires touch events,
    // it was made by a real mouse and should be counted
    // http://wicg.github.io/InputDeviceCapabilities/#dom-inputdevicecapabilities-firestouchevents
    let sc = mouseEvent.sourceCapabilities;

    if (sc && !sc.firesTouchEvents) {
      return;
    } // skip synthetic mouse events


    mouseEvent[HANDLED_OBJ] = {
      skip: true
    }; // disable "ghost clicks"

    if (mouseEvent.type === 'click') {
      let clickFromLabel = false;
      let path = mouseEvent.composedPath && mouseEvent.composedPath();

      if (path) {
        for (let i = 0; i < path.length; i++) {
          if (path[i].nodeType === Node.ELEMENT_NODE) {
            if (path[i].localName === 'label') {
              clickedLabels.push(path[i]);
            } else if (canBeLabelled(path[i])) {
              let ownerLabels = matchingLabels(path[i]); // check if one of the clicked labels is labelling this element

              for (let j = 0; j < ownerLabels.length; j++) {
                clickFromLabel = clickFromLabel || clickedLabels.indexOf(ownerLabels[j]) > -1;
              }
            }
          }

          if (path[i] === POINTERSTATE.mouse.target) {
            return;
          }
        }
      } // if one of the clicked labels was labelling the target element,
      // this is not a ghost click


      if (clickFromLabel) {
        return;
      }

      mouseEvent.preventDefault();
      mouseEvent.stopPropagation();
    }
  };
  /**
   * @param {boolean=} setup True to add, false to remove.
   * @return {void}
   */


  function setupTeardownMouseCanceller(setup) {
    let events = IS_TOUCH_ONLY ? ['click'] : MOUSE_EVENTS;

    for (let i = 0, en; i < events.length; i++) {
      en = events[i];

      if (setup) {
        // reset clickLabels array
        clickedLabels.length = 0;
        document.addEventListener(en, mouseCanceller, true);
      } else {
        document.removeEventListener(en, mouseCanceller, true);
      }
    }
  }

  function ignoreMouse(e) {

    if (!POINTERSTATE.mouse.mouseIgnoreJob) {
      setupTeardownMouseCanceller(true);
    }

    let unset = function () {
      setupTeardownMouseCanceller();
      POINTERSTATE.mouse.target = null;
      POINTERSTATE.mouse.mouseIgnoreJob = null;
    };

    POINTERSTATE.mouse.target = e.composedPath()[0];
    POINTERSTATE.mouse.mouseIgnoreJob = Debouncer.debounce(POINTERSTATE.mouse.mouseIgnoreJob, timeOut.after(MOUSE_TIMEOUT), unset);
  }
  /**
   * @param {MouseEvent} ev event to test for left mouse button down
   * @return {boolean} has left mouse button down
   */


  function hasLeftMouseButton(ev) {
    let type = ev.type; // exit early if the event is not a mouse event

    if (!isMouseEvent(type)) {
      return false;
    } // ev.button is not reliable for mousemove (0 is overloaded as both left button and no buttons)
    // instead we use ev.buttons (bitmask of buttons) or fall back to ev.which (deprecated, 0 for no buttons, 1 for left button)


    if (type === 'mousemove') {
      // allow undefined for testing events
      let buttons = ev.buttons === undefined ? 1 : ev.buttons;

      if (ev instanceof window.MouseEvent && !MOUSE_HAS_BUTTONS) {
        buttons = MOUSE_WHICH_TO_BUTTONS[ev.which] || 0;
      } // buttons is a bitmask, check that the left button bit is set (1)


      return Boolean(buttons & 1);
    } else {
      // allow undefined for testing events
      let button = ev.button === undefined ? 0 : ev.button; // ev.button is 0 in mousedown/mouseup/click for left button activation

      return button === 0;
    }
  }

  function isSyntheticClick(ev) {
    if (ev.type === 'click') {
      // ev.detail is 0 for HTMLElement.click in most browsers
      if (ev.detail === 0) {
        return true;
      } // in the worst case, check that the x/y position of the click is within
      // the bounding box of the target of the event
      // Thanks IE 10 >:(


      let t = _findOriginalTarget(ev); // make sure the target of the event is an element so we can use getBoundingClientRect,
      // if not, just assume it is a synthetic click


      if (!t.nodeType ||
      /** @type {Element} */
      t.nodeType !== Node.ELEMENT_NODE) {
        return true;
      }

      let bcr =
      /** @type {Element} */
      t.getBoundingClientRect(); // use page x/y to account for scrolling

      let x = ev.pageX,
          y = ev.pageY; // ev is a synthetic click if the position is outside the bounding box of the target

      return !(x >= bcr.left && x <= bcr.right && y >= bcr.top && y <= bcr.bottom);
    }

    return false;
  }

  let POINTERSTATE = {
    mouse: {
      target: null,
      mouseIgnoreJob: null
    },
    touch: {
      x: 0,
      y: 0,
      id: -1,
      scrollDecided: false
    }
  };

  function firstTouchAction(ev) {
    let ta = 'auto';
    let path = ev.composedPath && ev.composedPath();

    if (path) {
      for (let i = 0, n; i < path.length; i++) {
        n = path[i];

        if (n[TOUCH_ACTION]) {
          ta = n[TOUCH_ACTION];
          break;
        }
      }
    }

    return ta;
  }

  function trackDocument(stateObj, movefn, upfn) {
    stateObj.movefn = movefn;
    stateObj.upfn = upfn;
    document.addEventListener('mousemove', movefn);
    document.addEventListener('mouseup', upfn);
  }

  function untrackDocument(stateObj) {
    document.removeEventListener('mousemove', stateObj.movefn);
    document.removeEventListener('mouseup', stateObj.upfn);
    stateObj.movefn = null;
    stateObj.upfn = null;
  }

  {
    // use a document-wide touchend listener to start the ghost-click prevention mechanism
    // Use passive event listeners, if supported, to not affect scrolling performance
    document.addEventListener('touchend', ignoreMouse, SUPPORTS_PASSIVE ? {
      passive: true
    } : false);
  }
  /** @type {!Object<string, !GestureRecognizer>} */


  const gestures = {};
  /** @type {!Array<!GestureRecognizer>} */

  const recognizers = [];
  /**
   * Finds the element rendered on the screen at the provided coordinates.
   *
   * Similar to `document.elementFromPoint`, but pierces through
   * shadow roots.
   *
   * @param {number} x Horizontal pixel coordinate
   * @param {number} y Vertical pixel coordinate
   * @return {Element} Returns the deepest shadowRoot inclusive element
   * found at the screen position given.
   */

  function deepTargetFind(x, y) {
    let node = document.elementFromPoint(x, y);
    let next = node; // this code path is only taken when native ShadowDOM is used
    // if there is a shadowroot, it may have a node at x/y
    // if there is not a shadowroot, exit the loop

    while (next && next.shadowRoot && !window.ShadyDOM) {
      // if there is a node at x/y in the shadowroot, look deeper
      let oldNext = next;
      next = next.shadowRoot.elementFromPoint(x, y); // on Safari, elementFromPoint may return the shadowRoot host

      if (oldNext === next) {
        break;
      }

      if (next) {
        node = next;
      }
    }

    return node;
  }
  /**
   * a cheaper check than ev.composedPath()[0];
   *
   * @private
   * @param {Event|Touch} ev Event.
   * @return {EventTarget} Returns the event target.
   */

  function _findOriginalTarget(ev) {
    // shadowdom
    if (ev.composedPath) {
      const targets =
      /** @type {!Array<!EventTarget>} */
      ev.composedPath(); // It shouldn't be, but sometimes targets is empty (window on Safari).

      return targets.length > 0 ? targets[0] : ev.target;
    } // shadydom


    return ev.target;
  }
  /**
   * @private
   * @param {Event} ev Event.
   * @return {void}
   */


  function _handleNative(ev) {
    let handled;
    let type = ev.type;
    let node = ev.currentTarget;
    let gobj = node[GESTURE_KEY];

    if (!gobj) {
      return;
    }

    let gs = gobj[type];

    if (!gs) {
      return;
    }

    if (!ev[HANDLED_OBJ]) {
      ev[HANDLED_OBJ] = {};

      if (type.slice(0, 5) === 'touch') {
        ev =
        /** @type {TouchEvent} */
        ev; // eslint-disable-line no-self-assign

        let t = ev.changedTouches[0];

        if (type === 'touchstart') {
          // only handle the first finger
          if (ev.touches.length === 1) {
            POINTERSTATE.touch.id = t.identifier;
          }
        }

        if (POINTERSTATE.touch.id !== t.identifier) {
          return;
        }

        if (!HAS_NATIVE_TA) {
          if (type === 'touchstart' || type === 'touchmove') {
            _handleTouchAction(ev);
          }
        }
      }
    }

    handled = ev[HANDLED_OBJ]; // used to ignore synthetic mouse events

    if (handled.skip) {
      return;
    } // reset recognizer state


    for (let i = 0, r; i < recognizers.length; i++) {
      r = recognizers[i];

      if (gs[r.name] && !handled[r.name]) {
        if (r.flow && r.flow.start.indexOf(ev.type) > -1 && r.reset) {
          r.reset();
        }
      }
    } // enforce gesture recognizer order


    for (let i = 0, r; i < recognizers.length; i++) {
      r = recognizers[i];

      if (gs[r.name] && !handled[r.name]) {
        handled[r.name] = true;
        r[type](ev);
      }
    }
  }
  /**
   * @private
   * @param {TouchEvent} ev Event.
   * @return {void}
   */


  function _handleTouchAction(ev) {
    let t = ev.changedTouches[0];
    let type = ev.type;

    if (type === 'touchstart') {
      POINTERSTATE.touch.x = t.clientX;
      POINTERSTATE.touch.y = t.clientY;
      POINTERSTATE.touch.scrollDecided = false;
    } else if (type === 'touchmove') {
      if (POINTERSTATE.touch.scrollDecided) {
        return;
      }

      POINTERSTATE.touch.scrollDecided = true;
      let ta = firstTouchAction(ev);
      let shouldPrevent = false;
      let dx = Math.abs(POINTERSTATE.touch.x - t.clientX);
      let dy = Math.abs(POINTERSTATE.touch.y - t.clientY);

      if (!ev.cancelable) ; else if (ta === 'none') {
        shouldPrevent = true;
      } else if (ta === 'pan-x') {
        shouldPrevent = dy > dx;
      } else if (ta === 'pan-y') {
        shouldPrevent = dx > dy;
      }

      if (shouldPrevent) {
        ev.preventDefault();
      } else {
        prevent('track');
      }
    }
  }
  /**
   * Adds an event listener to a node for the given gesture type.
   *
   * @param {!EventTarget} node Node to add listener on
   * @param {string} evType Gesture type: `down`, `up`, `track`, or `tap`
   * @param {!function(!Event):void} handler Event listener function to call
   * @return {boolean} Returns true if a gesture event listener was added.
   */


  function addListener(node, evType, handler) {
    if (gestures[evType]) {
      _add(node, evType, handler);

      return true;
    }

    return false;
  }
  /**
   * automate the event listeners for the native events
   *
   * @private
   * @param {!EventTarget} node Node on which to add the event.
   * @param {string} evType Event type to add.
   * @param {function(!Event)} handler Event handler function.
   * @return {void}
   */

  function _add(node, evType, handler) {
    let recognizer = gestures[evType];
    let deps = recognizer.deps;
    let name = recognizer.name;
    let gobj = node[GESTURE_KEY];

    if (!gobj) {
      node[GESTURE_KEY] = gobj = {};
    }

    for (let i = 0, dep, gd; i < deps.length; i++) {
      dep = deps[i]; // don't add mouse handlers on iOS because they cause gray selection overlays

      if (IS_TOUCH_ONLY && isMouseEvent(dep) && dep !== 'click') {
        continue;
      }

      gd = gobj[dep];

      if (!gd) {
        gobj[dep] = gd = {
          _count: 0
        };
      }

      if (gd._count === 0) {
        node.addEventListener(dep, _handleNative, PASSIVE_TOUCH(dep));
      }

      gd[name] = (gd[name] || 0) + 1;
      gd._count = (gd._count || 0) + 1;
    }

    node.addEventListener(evType, handler);

    if (recognizer.touchAction) {
      setTouchAction(node, recognizer.touchAction);
    }
  }
  /**
   * Registers a new gesture event recognizer for adding new custom
   * gesture event types.
   *
   * @param {!GestureRecognizer} recog Gesture recognizer descriptor
   * @return {void}
   */


  function register(recog) {
    recognizers.push(recog);

    for (let i = 0; i < recog.emits.length; i++) {
      gestures[recog.emits[i]] = recog;
    }
  }
  /**
   * @private
   * @param {string} evName Event name.
   * @return {Object} Returns the gesture for the given event name.
   */

  function _findRecognizerByEvent(evName) {
    for (let i = 0, r; i < recognizers.length; i++) {
      r = recognizers[i];

      for (let j = 0, n; j < r.emits.length; j++) {
        n = r.emits[j];

        if (n === evName) {
          return r;
        }
      }
    }

    return null;
  }
  /**
   * Sets scrolling direction on node.
   *
   * This value is checked on first move, thus it should be called prior to
   * adding event listeners.
   *
   * @param {!EventTarget} node Node to set touch action setting on
   * @param {string} value Touch action value
   * @return {void}
   */


  function setTouchAction(node, value) {
    if (HAS_NATIVE_TA && node instanceof HTMLElement) {
      // NOTE: add touchAction async so that events can be added in
      // custom element constructors. Otherwise we run afoul of custom
      // elements restriction against settings attributes (style) in the
      // constructor.
      microTask.run(() => {
        node.style.touchAction = value;
      });
    }

    node[TOUCH_ACTION] = value;
  }
  /**
   * Dispatches an event on the `target` element of `type` with the given
   * `detail`.
   * @private
   * @param {!EventTarget} target The element on which to fire an event.
   * @param {string} type The type of event to fire.
   * @param {!Object=} detail The detail object to populate on the event.
   * @return {void}
   */

  function _fire(target, type, detail) {
    let ev = new Event(type, {
      bubbles: true,
      cancelable: true,
      composed: true
    });
    ev.detail = detail;
    target.dispatchEvent(ev); // forward `preventDefault` in a clean way

    if (ev.defaultPrevented) {
      let preventer = detail.preventer || detail.sourceEvent;

      if (preventer && preventer.preventDefault) {
        preventer.preventDefault();
      }
    }
  }
  /**
   * Prevents the dispatch and default action of the given event name.
   *
   * @param {string} evName Event name.
   * @return {void}
   */


  function prevent(evName) {
    let recognizer = _findRecognizerByEvent(evName);

    if (recognizer.info) {
      recognizer.info.prevent = true;
    }
  }
  /* eslint-disable valid-jsdoc */

  register({
    name: 'downup',
    deps: ['mousedown', 'touchstart', 'touchend'],
    flow: {
      start: ['mousedown', 'touchstart'],
      end: ['mouseup', 'touchend']
    },
    emits: ['down', 'up'],
    info: {
      movefn: null,
      upfn: null
    },

    /**
     * @this {GestureRecognizer}
     * @return {void}
     */
    reset: function () {
      untrackDocument(this.info);
    },

    /**
     * @this {GestureRecognizer}
     * @param {MouseEvent} e
     * @return {void}
     */
    mousedown: function (e) {
      if (!hasLeftMouseButton(e)) {
        return;
      }

      let t = _findOriginalTarget(e);

      let self = this;

      let movefn = function movefn(e) {
        if (!hasLeftMouseButton(e)) {
          downupFire('up', t, e);
          untrackDocument(self.info);
        }
      };

      let upfn = function upfn(e) {
        if (hasLeftMouseButton(e)) {
          downupFire('up', t, e);
        }

        untrackDocument(self.info);
      };

      trackDocument(this.info, movefn, upfn);
      downupFire('down', t, e);
    },

    /**
     * @this {GestureRecognizer}
     * @param {TouchEvent} e
     * @return {void}
     */
    touchstart: function (e) {
      downupFire('down', _findOriginalTarget(e), e.changedTouches[0], e);
    },

    /**
     * @this {GestureRecognizer}
     * @param {TouchEvent} e
     * @return {void}
     */
    touchend: function (e) {
      downupFire('up', _findOriginalTarget(e), e.changedTouches[0], e);
    }
  });
  /**
   * @param {string} type
   * @param {EventTarget} target
   * @param {Event|Touch} event
   * @param {Event=} preventer
   * @return {void}
   */

  function downupFire(type, target, event, preventer) {
    if (!target) {
      return;
    }

    _fire(target, type, {
      x: event.clientX,
      y: event.clientY,
      sourceEvent: event,
      preventer: preventer,
      prevent: function (e) {
        return prevent(e);
      }
    });
  }

  register({
    name: 'track',
    touchAction: 'none',
    deps: ['mousedown', 'touchstart', 'touchmove', 'touchend'],
    flow: {
      start: ['mousedown', 'touchstart'],
      end: ['mouseup', 'touchend']
    },
    emits: ['track'],
    info: {
      x: 0,
      y: 0,
      state: 'start',
      started: false,
      moves: [],

      /** @this {GestureInfo} */
      addMove: function (move) {
        if (this.moves.length > TRACK_LENGTH) {
          this.moves.shift();
        }

        this.moves.push(move);
      },
      movefn: null,
      upfn: null,
      prevent: false
    },

    /**
     * @this {GestureRecognizer}
     * @return {void}
     */
    reset: function () {
      this.info.state = 'start';
      this.info.started = false;
      this.info.moves = [];
      this.info.x = 0;
      this.info.y = 0;
      this.info.prevent = false;
      untrackDocument(this.info);
    },

    /**
     * @this {GestureRecognizer}
     * @param {MouseEvent} e
     * @return {void}
     */
    mousedown: function (e) {
      if (!hasLeftMouseButton(e)) {
        return;
      }

      let t = _findOriginalTarget(e);

      let self = this;

      let movefn = function movefn(e) {
        let x = e.clientX,
            y = e.clientY;

        if (trackHasMovedEnough(self.info, x, y)) {
          // first move is 'start', subsequent moves are 'move', mouseup is 'end'
          self.info.state = self.info.started ? e.type === 'mouseup' ? 'end' : 'track' : 'start';

          if (self.info.state === 'start') {
            // if and only if tracking, always prevent tap
            prevent('tap');
          }

          self.info.addMove({
            x: x,
            y: y
          });

          if (!hasLeftMouseButton(e)) {
            // always fire "end"
            self.info.state = 'end';
            untrackDocument(self.info);
          }

          if (t) {
            trackFire(self.info, t, e);
          }

          self.info.started = true;
        }
      };

      let upfn = function upfn(e) {
        if (self.info.started) {
          movefn(e);
        } // remove the temporary listeners


        untrackDocument(self.info);
      }; // add temporary document listeners as mouse retargets


      trackDocument(this.info, movefn, upfn);
      this.info.x = e.clientX;
      this.info.y = e.clientY;
    },

    /**
     * @this {GestureRecognizer}
     * @param {TouchEvent} e
     * @return {void}
     */
    touchstart: function (e) {
      let ct = e.changedTouches[0];
      this.info.x = ct.clientX;
      this.info.y = ct.clientY;
    },

    /**
     * @this {GestureRecognizer}
     * @param {TouchEvent} e
     * @return {void}
     */
    touchmove: function (e) {
      let t = _findOriginalTarget(e);

      let ct = e.changedTouches[0];
      let x = ct.clientX,
          y = ct.clientY;

      if (trackHasMovedEnough(this.info, x, y)) {
        if (this.info.state === 'start') {
          // if and only if tracking, always prevent tap
          prevent('tap');
        }

        this.info.addMove({
          x: x,
          y: y
        });
        trackFire(this.info, t, ct);
        this.info.state = 'track';
        this.info.started = true;
      }
    },

    /**
     * @this {GestureRecognizer}
     * @param {TouchEvent} e
     * @return {void}
     */
    touchend: function (e) {
      let t = _findOriginalTarget(e);

      let ct = e.changedTouches[0]; // only trackend if track was started and not aborted

      if (this.info.started) {
        // reset started state on up
        this.info.state = 'end';
        this.info.addMove({
          x: ct.clientX,
          y: ct.clientY
        });
        trackFire(this.info, t, ct);
      }
    }
  });
  /**
   * @param {!GestureInfo} info
   * @param {number} x
   * @param {number} y
   * @return {boolean}
   */

  function trackHasMovedEnough(info, x, y) {
    if (info.prevent) {
      return false;
    }

    if (info.started) {
      return true;
    }

    let dx = Math.abs(info.x - x);
    let dy = Math.abs(info.y - y);
    return dx >= TRACK_DISTANCE || dy >= TRACK_DISTANCE;
  }
  /**
   * @param {!GestureInfo} info
   * @param {?EventTarget} target
   * @param {Touch} touch
   * @return {void}
   */


  function trackFire(info, target, touch) {
    if (!target) {
      return;
    }

    let secondlast = info.moves[info.moves.length - 2];
    let lastmove = info.moves[info.moves.length - 1];
    let dx = lastmove.x - info.x;
    let dy = lastmove.y - info.y;
    let ddx,
        ddy = 0;

    if (secondlast) {
      ddx = lastmove.x - secondlast.x;
      ddy = lastmove.y - secondlast.y;
    }

    _fire(target, 'track', {
      state: info.state,
      x: touch.clientX,
      y: touch.clientY,
      dx: dx,
      dy: dy,
      ddx: ddx,
      ddy: ddy,
      sourceEvent: touch,
      hover: function () {
        return deepTargetFind(touch.clientX, touch.clientY);
      }
    });
  }

  register({
    name: 'tap',
    deps: ['mousedown', 'click', 'touchstart', 'touchend'],
    flow: {
      start: ['mousedown', 'touchstart'],
      end: ['click', 'touchend']
    },
    emits: ['tap'],
    info: {
      x: NaN,
      y: NaN,
      prevent: false
    },

    /**
     * @this {GestureRecognizer}
     * @return {void}
     */
    reset: function () {
      this.info.x = NaN;
      this.info.y = NaN;
      this.info.prevent = false;
    },

    /**
     * @this {GestureRecognizer}
     * @param {MouseEvent} e
     * @return {void}
     */
    mousedown: function (e) {
      if (hasLeftMouseButton(e)) {
        this.info.x = e.clientX;
        this.info.y = e.clientY;
      }
    },

    /**
     * @this {GestureRecognizer}
     * @param {MouseEvent} e
     * @return {void}
     */
    click: function (e) {
      if (hasLeftMouseButton(e)) {
        trackForward(this.info, e);
      }
    },

    /**
     * @this {GestureRecognizer}
     * @param {TouchEvent} e
     * @return {void}
     */
    touchstart: function (e) {
      const touch = e.changedTouches[0];
      this.info.x = touch.clientX;
      this.info.y = touch.clientY;
    },

    /**
     * @this {GestureRecognizer}
     * @param {TouchEvent} e
     * @return {void}
     */
    touchend: function (e) {
      trackForward(this.info, e.changedTouches[0], e);
    }
  });
  /**
   * @param {!GestureInfo} info
   * @param {Event | Touch} e
   * @param {Event=} preventer
   * @return {void}
   */

  function trackForward(info, e, preventer) {
    let dx = Math.abs(e.clientX - info.x);
    let dy = Math.abs(e.clientY - info.y); // find original target from `preventer` for TouchEvents, or `e` for MouseEvents

    let t = _findOriginalTarget(preventer || e);

    if (!t || canBeDisabled[
    /** @type {!HTMLElement} */
    t.localName] && t.hasAttribute('disabled')) {
      return;
    } // dx,dy can be NaN if `click` has been simulated and there was no `down` for `start`


    if (isNaN(dx) || isNaN(dy) || dx <= TAP_DISTANCE && dy <= TAP_DISTANCE || isSyntheticClick(e)) {
      // prevent taps from being generated if an event has canceled them
      if (!info.prevent) {
        _fire(t, 'tap', {
          x: e.clientX,
          y: e.clientY,
          sourceEvent: e,
          preventer: preventer
        });
      }
    }
  }
  /** @deprecated */

  const add = addListener;

  var styles$4 = css`:host {
  font: inherit;
  cursor: pointer;
  text-align: center;
  user-select: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--cells-button-color, rgba(0, 0, 0, 0.847));
  border-width: 1px;
  border-style: solid;
  border-color: var(--cells-button-border-color, #d8d8d8);
  border-radius: 4px;
  padding: 0.25em .5em;
  box-sizing: border-box; }

:host([hidden]), [hidden] {
  display: none !important; }

*, *:before, *:after {
  box-sizing: inherit; }

:host([disabled]) {
  cursor: default;
  pointer-events: none;
  color: var(--cells-button-disabled-color, rgba(0, 0, 0, 0.247)); }
`;

  /* eslint-disable new-cap */
  /**
  `CellsButton` provides a base class as well as a `<cells-button>` custom element with button functionality as close as possible to native buttons. It provides an easier and convenient way to build buttons with encapsulated HTML & custom styles. As it almost does not provide any styles, it's specially aimed to be extended.

  As native buttons, it can communicate with forms in the same document using standard form attributes, as well as use roles & aria attributes (for example, aria-expanded). It can receive any valid 'type' for buttons ('submit', 'button' or 'reset'), a 'disabled' state, and receive an 'autofocus' attribute to get focus when component is attached to the document.

  `CellsButton` is heavily based on [weightless.dev button](https://weightless.dev/elements/button) for the form communication, and on [Vaadin Button](https://vaadin.com/components/vaadin-button) for the active state management.

  When extending from `CellsButton`, just make sure to:
  - Call `CellsButton` styles using `super.styles`
  - Add a `<slot>` in render
  - Use `this._button` getter in render to enable communication with native forms.

  **Example**
  ```js
  // Extending CellsButton to create a CustomButton element
  class CustomButton extends CellsButton {
    static get properties() {
      return {
        // Additional properties here
      };
    }

    static get styles() { // be sure to get styles from upper class using super
      return [
        super.styles,
        styles,
        getComponentSharedStyles('custom-button-shared-styles')
      ];
    }

    render() { // include any HTML you need; for example, icons
      return html`
        <slot></slot>
        ${this._button}
      `;
    }
  }
  customElements.define('custom-button', CustomButton)
  ```

  ```html
  <custom-button>This is a button</custom-button>
  <custom-button disabled>This is a disabled button</custom-button>
  <custom-button @click="${this._onClick}">This is a button inside another LitElement with click listener</custom-button>
  <custom-button role="switch" aria-expanded="true">Button with role and arias</custom-button>
  ```

  ## FocusVisible mixin

  `CellsButton` uses `FocusVisible mixin` from `@cells-components`. This means you can use the 'focus-visible' attribute on your component to manage ':focus' styles based on user navigation interface (keyboard/pointer).

  ```css
  :host([focus-visible]) {
    ...your focus styles...
  }
  ```

  ## Form communication

  To be able to communicate with **forms in the same document**, a component which extends from `CellsButton` must implement `_button` getter in its render method.
  ```js
    render() {
      return html`
        <slot></slot>
        ${this._button}
      `;
    }
  ```

  This way, the component will be able to use the same attributes native buttons have to customize interaction with forms: 'name', 'value', 'form', 'formaction', 'formenctype', 'formmethod', 'formnovalidate' and 'formtarget'.

  ```html
  <form action="formaction" method="get" target="_self">
    <custom-button value="buttonValue" name="customButtonName" formaction="differentaction" formmethod="post" formtarget="_blank">Submit button for form</custom-button>
  </form>
  ```

  ## Caveats

  ### Click listeners previous to button definition

  Setting a `CellsButton` as 'disabled' will prevent clicks on the button. This is true for mouse clicks, keyboard clicks, programmatic clicks or screen reader clicks. However, a disabled `CellsButton` won't prevent click listeners added **previously** to the customElement definition when the click is done programatically or through a screen reader.

  ### 'active' state

  You can use the `:active` CSS pseudo-class to define styles for the button when it's being activated by the user using the mouse. However, this won't work when button is activated using the keyboard. `CellsButton` provides an `active` attribute which gets triggered on keydown and keyup with Spacebar/Enter, as well as with down and up mouse actions (touch or pointer).

  ```css
  :host([active]) {
    ... Active styles ...
  }
  ```

  ## Styling
  The following custom properties are available for styling:

  ### Custom properties

  | Selector          | CSS Property | CSS Variable                  | Theme Variable | Foundations/Fallback |
  | ----------------- | ------------ | ----------------------------- | -------------- | -------------------- |
  | :host([disabled]) | color        | --cells-button-disabled-color |                | rgba(0, 0, 0, 0.247) |
  | :host             | color        | --cells-button-color          |                | rgba(0, 0, 0, 0.847) |
  | :host             | border-color | --cells-button-border-color   |                | #d8d8d8              |

  > Styling documentation generated by Cells CLI

  * @customElement
  * @demo demo/index.html
  * @extends {LitElement}
  * @appliesMixin { CellsFocusVisibleMixin }
  */

  class CellsButton extends CellsFocusVisibleMixin(LitElement) {
    static get is() {
      return 'cells-button';
    }

    static get properties() {
      return {
        /**
         * Type for the button, related to forms. Available types are 'button', 'submit' and 'reset'
         */
        type: {
          type: String
        },

        /**
         * Disabled state of button
         */
        disabled: {
          type: Boolean,
          reflect: true
        },

        /**
         * Button value related to forms
         */
        value: {
          type: String,
          reflect: true
        },

        /**
         * Name of button related to forms
         */
        name: {
          type: String,
          reflect: true
        },

        /**
         * Associated form for button
         */
        form: {
          type: String
        },

        /**
         * Associated formaction for button
         */
        formAction: {
          type: String,
          reflect: true
        },

        /**
         * Associated formenctype for button
         */
        formEnctype: {
          type: String,
          reflect: true
        },

        /**
         * Associated formmethod for button
         */
        formMethod: {
          type: String,
          reflect: true
        },

        /**
         * Associated formnovalidate for button
         */
        formNoValidate: {
          type: Boolean,
          reflect: true
        },

        /**
         * Associated formtarget for button
         */
        formTarget: {
          type: String,
          reflect: true
        },
        _formElementId: {
          type: String
        }
      };
    }

    constructor() {
      super();
      this.type = 'submit';
      this._active = false;
      this._formElementId = this.uniqueID();
    }
    /**
     * Returns unique ID string
     * @param  {Number} length Length of ID
     * @return {String}        String of random number
     */


    uniqueID(length = 10) {
      return `_${Math.random().toString(36).substr(2, length)}`;
    }

    connectedCallback() {
      super.connectedCallback();

      this._setInitialAttribute('role', 'button');

      if (this.disabled) {
        this._disableButton();
      } else {
        this._setInitialAttribute('tabindex', '0');

        this.setAttribute('aria-disabled', 'false');
      }

      this.onClick = this.onClick.bind(this);
      this.onKeyUp = this.onKeyUp.bind(this);
      this.onKeyDown = this.onKeyDown.bind(this);
      this.addEventListener('click', this.onClick);
      this.addEventListener('keyup', this.onKeyUp);
      this.addEventListener('keydown', this.onKeyDown);
      add(this, 'down', () => !this.disabled && (this.active = true));
      add(this, 'up', () => this.active = false);
      this.addEventListener('blur', () => this.active = false);

      if (this.hasAttribute('autofocus')) {
        this.focus();
      }
    }

    disconnectedCallback() {
      super.disconnectedCallback();
      this.removeEventListener('click', this.onClick);
      this.removeEventListener('keydown', this.onKeyDown);

      if (this.active) {
        this.active = false;
      }
    }

    firstUpdated(changedProps) {
      super.firstUpdated(changedProps);
      this._formElement = this.shadowRoot.querySelector(`#${this._formElementId}`);

      if (this._formElement) {
        this.appendChild(this._formElement);
      }
    }

    updated(changedProps) {
      super.updated(changedProps);

      if (changedProps.has('disabled')) {
        if (this.disabled) {
          this._disableButton();
        } else {
          this._enableButton();
        }
      }
    }
    /**
     * Active state of button
     * @return {Boolean} Active state of button
     */


    get active() {
      return this._active;
    }
    /**
     * Sets active state for button
     * @param  {Boolean} value Active state for button
     */


    set active(value) {
      if (value !== this._active) {
        this._active = value;

        if (value) {
          this.setAttribute('active', '');
        } else {
          this.removeAttribute('active');
        }
      }
    }

    static get styles() {
      return [styles$4, getComponentSharedStyles('cells-button-shared-styles')];
    }

    render() {
      return html`
      <slot></slot>
      ${this._button}
    `;
    }
    /**
     * Native button to be moved to light DOM for communication with native forms
     * @return {TemplateResult} HTML of native button
     */


    get _button() {
      return html`
      <button
        style="display: none;"
        id="${this._formElementId}"
        aria-hidden="true"
        tabindex="-1"
        type="${this.type}"
        ?disabled="${this.disabled}"
        name="${ifDefined(this.name)}"
        value="${ifDefined(this.value)}"
        form="${ifDefined(this.form)}"
        formaction="${ifDefined(this.formAction)}"
        formenctype="${ifDefined(this.formEnctype)}"
        formmethod="${ifDefined(this.formMethod)}"
        ?formNoValidate="${ifDefined(this.formNoValidate)}"
        formtarget="${ifDefined(this.formTarget)}">
      </button>
    `;
    }

    _setInitialAttribute(attr, value) {
      if (!this.hasAttribute(attr)) {
        this.setAttribute(attr, value);
      }
    }

    _disableButton() {
      this.setAttribute('aria-disabled', 'true');
      this.setAttribute('tabindex', '-1');
    }

    _enableButton() {
      this.setAttribute('aria-disabled', 'false');
      this.setAttribute('tabindex', '0');
    }
    /**
     * Fires click on native button for forms if button is not disabled
     * @param  {event} e Original click event
     */


    onClick(e) {
      if (this.disabled) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        return;
      }

      if (!e.defaultPrevented && this._formElement && e.target !== this._formElement) {
        this._formElement.dispatchEvent(new MouseEvent('click', {
          relatedTarget: this,
          composed: true
        }));
      }
    }
    /**
     * Fires click on element on spacebar or Enter keyup if button is currently being pressed
     * @param  {event} e Original keyup event
     */


    onKeyUp(e) {
      if ((e.keyCode === 13 || e.keyCode === 32) && this.active) {
        this.active = false;
        this.dispatchEvent(new MouseEvent('click', {
          bubbles: true,
          composed: true,
          cancelable: true
        }));
        e.preventDefault();
        e.stopPropagation();
      }
    }
    /**
     * Sets active state on element on spacebar or Enter keydown
     * @param  {event} e Original keyup event
     */


    onKeyDown(e) {
      if (e.keyCode === 13 || e.keyCode === 32) {
        this.active = true;
        e.preventDefault();
        e.stopPropagation();
      }
    }

  }
  customElements.define(CellsButton.is, CellsButton);

  var styles$5 = css`:host {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  position: relative;
  vertical-align: middle;
  fill: var(--cells-icon-fill-color, currentcolor);
  stroke: var(--cells-icon-stroke-color, none);
  width: var(--cells-icon-width, var(--cells-icon-size, var(--cells-icon-svg-width, 1.5rem)));
  height: var(--cells-icon-height, var(--cells-icon-size, var(--cells-icon-svg-height, 1.5rem)));
   }

:host([hidden]), [hidden] {
  display: none !important; }
`;

  /**

  This component displays an icon. It is based on Polymer's [iron-icon](https://www.webcomponents.org/element/@polymer/iron-icon) element.
  By default an icon renders as a 24px square.

  You can use an image as icon, or use icons from an imported iconset.

  ```html
    <cells-icon src="demo/location.png"></cells-icon>
    <cells-icon icon="coronita:close"></cells-icon>
  ```

  ## Icons

  Since this component uses icons, it will need an [iconset](https://platform.bbva.com/en-us/developers/engines/cells/documentation/cells-architecture/components/components-in-depth/icons) in your project as an application level dependency. In fact, this component uses an iconset in its demo.

  ## Styling

  The following custom properties are available for styling:

  ### Custom Properties
  | Custom Property           | Selector | CSS Property | Value                                           |
  |:--------------------------|:---------|:-------------|:------------------------------------------------|
  | --cells-icon-fill-color   | :host    | fill         | currentcolor                                    |
  | --cells-icon-stroke-color | :host    | stroke       | none                                            |
  | --cells-icon-width        | :host    | width        | var(--cells-icon-size, --cells-icon-svg-width)  |
  | --cells-icon-height       | :host    | height       | var(--cells-icon-size, --cells-icon-svg-height) |

   * @customElement
   * @litElement
   * @polymer
   * @demo demo/index.html
   * @extends {LitElement}
   */

  class CellsIcon$1 extends LitElement {
    static get is() {
      return 'cells-icon';
    }

    static get styles() {
      return [styles$5, getComponentSharedStyles('cells-icon-shared-styles')];
    }

    render() {
      return html`
      <slot></slot>
    `;
    }

    static get properties() {
      return {
        /**
         * The name of the icon to use. The name should be of the form:
         * `iconset_name:icon_name`.
         */
        icon: {
          type: String
        },

        /**
         * The name of the theme to use, if one is specified by the iconset.
         */
        theme: {
          type: String
        },

        /**
         * If using iron-icon without an iconset, you can set the src to be
         * the URL of an individual icon image file.
         */
        src: {
          type: String
        },

        /**
         * Size (in px) for the icon
         */
        size: {
          type: Number
        },

        /**
         * Width for icons
         */
        width: {
          type: Number
        },

        /**
         * Height for icons
         */
        height: {
          type: Number
        },
        _isAttached: {
          type: Boolean
        }
      };
    }

    constructor() {
      super();
      this._iconsetListenerCallback = this._updateIcon.bind(this);
      this._meta = new CellsIronMeta({
        type: 'iconset'
      });
    }

    connectedCallback() {
      super.connectedCallback();
      this._isAttached = true;
    }

    disconnectedCallback() {
      super.disconnectedCallback();
      this._isAttached = false;
    }

    get _DEFAULT_ICONSET() {
      return 'icons';
    }

    updated(changedProps) {
      if (changedProps.has('_meta') || changedProps.has('theme') || changedProps.has('_isAttached')) {
        this._updateIcon();
      }

      if (changedProps.has('src') || changedProps.has('_isAttached')) {
        this._srcChanged(this.src);
      }

      if (changedProps.has('icon') || changedProps.has('_isAttached')) {
        this._iconChanged(this.icon);
      }

      if (changedProps.has('size')) {
        this.style.setProperty('--cells-icon-size', this.size / 16 + 'rem');
      }

      if (changedProps.has('width')) {
        this.style.setProperty('--cells-icon-svg-width', this.width / 16 + 'rem');
      }

      if (changedProps.has('height')) {
        this.style.setProperty('--cells-icon-svg-height', this.height / 16 + 'rem');
      }
    }

    _iconChanged(icon) {
      if (icon === undefined || icon === 'undefined') {
        return;
      }

      var parts = (icon || '').split(':');
      this._iconName = parts.pop();
      this._iconsetName = parts.pop() || this._DEFAULT_ICONSET;

      this._updateIcon();
    }

    _srcChanged() {
      this._updateIcon();
    }

    _usesIconset() {
      return this.icon || !this.src;
    }

    _updateIcon() {
      if (this._usesIconset()) {
        if (this._img && this._img.parentNode) {
          this.removeChild(this._img);
        }

        if (this._iconName === '') {
          if (this._iconset) {
            this._iconset.removeIcon(this);
          }
        } else if (this._iconsetName && this._meta) {
          this._iconset =
          /** @type {?Polymer.Iconset} */
          this._meta.byKey(this._iconsetName);

          if (this._iconset) {
            this._iconset.applyIcon(this, this._iconName, this.theme);

            window.removeEventListener('iron-iconset-added', this._iconsetListenerCallback);
          } else {
            window.addEventListener('iron-iconset-added', this._iconsetListenerCallback);
          }
        }
      } else {
        if (this._iconset) {
          this._iconset.removeIcon(this);
        }

        if (!this._img) {
          this._img = document.createElement('img');
          this._img.style.width = '100%';
          this._img.style.height = '100%';
          this._img.draggable = false;
        }

        this._img.src = this.src;
        this.appendChild(this._img);
      }
    }

  }
  customElements.define(CellsIcon$1.is, CellsIcon$1);

  var styles$6 = css`:host {
  display: inline;
  box-sizing: border-box;
  border: none;
  padding: 0;
  color: var(--bbva-link-color, var(--colorsPrimaryMedium, ${unsafeCSS(colors.primaryMedium)}));
  font-weight: var(--bbva-link-font-weight, var(--fontFacePrimaryMediumFontWeight, ${unsafeCSS(fontFacePrimary.medium.fontWeight)}));
  font-style: var(--bbva-link-font-style, var(--fontFacePrimaryMediumFontStyle, ${unsafeCSS(fontFacePrimary.medium.fontStyle)}));
  font-size: var(--bbva-link-font-size, var(--typographyTypeSmall, ${unsafeCSS(typography.typeSmall)}));
  line-height: var(--bbva-link-line-height, var(--lineHeightTypeSmall, ${unsafeCSS(lineHeight.typeSmall)})); }

:host([hidden]),
[hidden] {
  display: none !important; }

*,
*:before,
*:after {
  box-sizing: inherit; }

:host(:focus) {
  outline: none; }

:host([disabled]) {
  opacity: var(--bbva-link-disabled-opacity, 0.4);
  color: var(--bbva-link-disabled-color, var(--colorsSecondary400, ${unsafeCSS(colors.secondary400)})); }

:host([active]),
:host([focus-visible]) {
  color: var(--bbva-link-active-color, var(--colorsPrimaryCoreDark, ${unsafeCSS(colors.primaryCoreDark)})); }

:host([icon]) {
  display: inline-flex;
  align-items: center; }

.icon {
  margin-right: calc(((1 * var(--gridSpacerVariant, var(--gridSpacer, ${unsafeCSS(grid.spacer)}))) / 16) * 1rem); }
`;

  /**
  A link helps a user navigate to subpages within an application. It can include an icon and text elements.
  Links are used primarily as a navigational element, to embed actions or pathways, or to view additional information.
  They are used to reduce visual complexity of a design. With links, users can navigate to other pages,
  windows, help information, start a command, and more.
  Example:

  ```html
  Button link
  <bbva-link>Active</bbva-link>

  Disabled button link
  <bbva-link disabled>Active</bbva-link>

  Anchor Link
  <bbva-link href="https://www.bbva.com" target="_blank"></bbva-link>

  ## Styling

  The following custom properties are available for styling:

  ### Custom properties

  | Selector               | CSS Property | CSS Variable                 | Theme Variable                    | Foundations/Fallback                                        |
  | ---------------------- | ------------ | ---------------------------- | --------------------------------- | ----------------------------------------------------------- |
  | .icon                  | margin-right | --gridSpacerVariant          | --gridSpacer                      | foundations.grid.spacer                       |
  | :host([active])        | color        | --bbva-link-active-color     | --colorsPrimaryCoreDark           | foundations.colors.primaryCoreDark            |
  | :host([focus-visible]) | color        | --bbva-link-active-color     | --colorsPrimaryCoreDark           | foundations.colors.primaryCoreDark            |
  | :host([disabled])      | opacity      | --bbva-link-disabled-opacity |                                   | 0.4                                                         |
  | :host([disabled])      | color        | --bbva-link-disabled-color   | --colorsSecondary400              | foundations.colors.secondary400               |
  | :host                  | color        | --bbva-link-color            | --colorsPrimaryMedium             | foundations.colors.primaryMedium              |
  | :host                  | font-weight  | --bbva-link-font-weight      | --fontFacePrimaryMediumFontWeight | foundations.fontFacePrimary.medium.fontWeight |
  | :host                  | font-style   | --bbva-link-font-style       | --fontFacePrimaryMediumFontStyle  | foundations.fontFacePrimary.medium.fontStyle  |
  | :host                  | font-size    | --bbva-link-font-size        | --typographyTypeSmall             | foundations.typography.typeSmall              |
  | :host                  | line-height  | --bbva-link-line-height      | --lineHeightTypeSmall             | foundations.lineHeight.typeSmall              |
  > Styling documentation generated by Cells CLI

  @customElement bbva-link
  @polymer
  @LitElement
  @demo demo/index.html
  */

  class BbvaLink extends CellsButton {
    static get is() {
      return 'bbva-link';
    }

    static get properties() {
      return {
        /**
         * Mark link as disabled
         */
        disabled: {
          type: Boolean,
          reflect: true
        },

        /**
         * Icon to be shown
         */
        icon: {
          type: String
        },

        /**
         * Icon size
         * @default 16
         */
        iconSize: {
          type: Number,
          attribute: 'icon-size'
        },

        /**
         * Href of the hidden link
         */
        href: {
          type: String
        },

        /**
         * target of the hidden link
         */
        target: {
          type: String
        },

        /**
         * Download attribute for link
         */
        download: {
          type: String
        },

        /**
         * Hreflang attribute for link
         */
        hreflang: {
          type: String
        },

        /**
         * rel attribute for link
         */
        rel: {
          type: String
        },

        /**
         * referrerpolicy attribute for link
         */
        referrerpolicy: {
          type: String
        }
      };
    }

    constructor() {
      super();
      this.iconSize = 16;
    }

    connectedCallback() {
      if (super.connectedCallback) {
        super.connectedCallback();
      }

      if (this.href) {
        this.setAttribute('role', 'link');
      }
    }

    static get styles() {
      return [super.styles, styles$6, getComponentSharedStyles('bbva-link-shared-styles')];
    }

    get _iconTemplate() {
      return this.icon ? html`
          <cells-icon class="icon" .icon="${this.icon}" .size="${this.iconSize}"></cells-icon>
        ` : html``;
    }

    get _button() {
      return this.href ? html`
          <a
            href="${this.href}"
            hreflang="${ifDefined(this.hreflang)}"
            target="${ifDefined(this.target)}"
            download="${ifDefined(this.download)}"
            referrerpolicy="${ifDefined(this.referrerpolicy)}"
            rel="${ifDefined(this.rel)}"
            style="display: none;"
            id="${this._formElementId}"
            aria-hidden="true"
            tabindex="-1"
          >
          </a>
        ` : super._button;
    }

    render() {
      return html`
      ${this._iconTemplate}
      <slot></slot>
      ${this._button}
    `;
    }

  }
  customElements.define(BbvaLink.is, BbvaLink);

  var styles$7 = css`:host {
  box-sizing: border-box;
  display: flex; }

:host([hidden]),
[hidden] {
  display: none !important; }

*,
*:before,
*:after {
  box-sizing: inherit; }

.accessible-hide {
  border: 0;
  clip: rect(0 0 0 0);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  width: 1px; }

.icon-help {
  color: var(--bbva-notification-help-icon-color, var(--colorsPrimarySubdued, ${unsafeCSS(colors.primarySubdued)}));
  flex-shrink: 0;
  margin-right: calc(((1 * var(--gridSpacerVariant, var(--gridSpacer, ${unsafeCSS(grid.spacer)}))) / 16) * 1rem); }

.text-help {
  color: var(--bbva-notification-help-text-color, var(--colorsSecondary500, ${unsafeCSS(colors.secondary500)}));
  font-size: var(--bbva-notification-help-text-font-size, var(--typographyType3XSmall, ${unsafeCSS(typography.type3XSmall)}));
  line-height: var(--bbva-notification-help-text-line-height, var(--lineHeightType3XSmall, ${unsafeCSS(lineHeight.type3XSmall)}));
  margin: 0; }

:host(.alert) .icon-help {
  color: var(--bbva-notification-help-icon-color-alert, var(--colorsTertiaryType1Dark, ${unsafeCSS(colors.tertiaryType1Dark)})); }

:host(.alert) .text-help {
  color: var(--bbva-notification-help-text-color-alert, var(--colorsSecondary600, ${unsafeCSS(colors.secondary600)})); }

:host(.light) .icon-help {
  color: var(--bbva-notification-help-icon-color-light, var(--colorsPrimaryCoreLightened, ${unsafeCSS(colors.primaryCoreLightened)})); }

:host(.light) .text-help {
  color: var(--bbva-notification-help-text-color-light, var(--colorsPrimaryCoreLightened, ${unsafeCSS(colors.primaryCoreLightened)})); }
`;

  /**
  This component shown a notificaton with icon and text.

  Example:

  ```html
  <bbva-notification-help
    aria-label-icon="Alert"
    class="alert"
    icon="coronita:alert"
    text="Lorem ipsum dolor sit amet"></bbva-notification-help>
  ```

  ## Icons

  Since this component uses icons, it will need an [iconset](https://platform.bbva.com/en-us/developers/engines/cells/documentation/cells-architecture/components/components-in-depth/icons) in your project as an application level dependency. In fact, this component uses an iconset in its demo.

  ## Styling

  The following custom properties are available for styling:

  ### Custom properties

  | Selector                 | CSS Property | CSS Variable                              | Theme Variable               | Foundations/Fallback                                  |
  | ------------------------ | ------------ | ----------------------------------------- | ---------------------------- | ----------------------------------------------------- |
  | :host(.light) .text-help | color        | --bbva-notification-help-text-color-light | --colorsPrimaryCoreLightened | foundations.colors.primaryCoreLightened |
  | :host(.light) .icon-help | color        | --bbva-notification-help-icon-color-light | --colorsPrimaryCoreLightened | foundations.colors.primaryCoreLightened |
  | :host(.alert) .text-help | color        | --bbva-notification-help-text-color-alert | --colorsSecondary600         | foundations.colors.secondary600         |
  | :host(.alert) .icon-help | color        | --bbva-notification-help-icon-color-alert | --colorsTertiaryType1Dark    | foundations.colors.tertiaryType1Dark    |
  | .text-help               | font-size    | --bbva-notification-help-text-font-size   | --typographyType3XSmall      | foundations.typography.type3XSmall      |
  | .text-help               | line-height  | --bbva-notification-help-text-line-height | --lineHeightType3XSmall      | foundations.lineHeight.type3XSmall      |
  | .text-help               | color        | --bbva-notification-help-text-color       | --colorsSecondary500         | foundations.colors.secondary500         |
  | .icon-help               | margin-right | --gridSpacerVariant                       | --gridSpacer                 | foundations.grid.spacer                 |
  | .icon-help               | color        | --bbva-notification-help-icon-color       | --colorsPrimarySubdued       | foundations.colors.primarySubdued       |
  > Styling documentation generated by Cells CLI

  @customElement bbva-notification-help
  @polymer
  @LitElement
  @demo demo/index.html
  */

  class BbvaNotificationHelp extends LitElement {
    static get is() {
      return 'bbva-notification-help';
    }

    static get properties() {
      return {
        /**
         * Icon accessibility text
         */
        ariaLabelIcon: {
          type: String,
          attribute: 'aria-label-icon'
        },

        /**
         * Icon to be shown
         */
        icon: {
          type: String
        },

        /**
         * Icon size. By default 16px
         */
        iconSize: {
          type: Number,
          attribute: 'icon-size'
        },

        /**
         * Text to be shown
         */
        text: {
          type: String
        }
      };
    }

    constructor() {
      super();
      this.ariaLabelIcon = '';
      this.icon = '';
      this.iconSize = 16;
      this.text = '';
    }

    static get styles() {
      return [styles$7, getComponentSharedStyles('bbva-notification-help-shared-styles')];
    }

    render() {
      return html`
      <span class="accessible-hide" ?hidden="${!this.ariaLabelIcon}">${this.ariaLabelIcon}</span>

      <cells-icon
        aria-hidden="true"
        .icon="${this.icon}"
        .size="${this.iconSize}"
        class="icon-help"
      >
      </cells-icon>

      <p class="text-help">${this.text}</p>
    `;
    }

  }
  customElements.define(BbvaNotificationHelp.is, BbvaNotificationHelp);

  var styles$8 = css`:host {
  display: block;
  box-sizing: border-box;
  background-color: var(--bbva-header-main-bg-color, var(--backgroundColorsDark400, ${unsafeCSS(backgroundColors.dark400)}));
  color: var(--bbva-header-main-color, var(--colorsPrimaryCoreLightened, ${unsafeCSS(colors.primaryCoreLightened)})); }

:host([hidden]),
[hidden] {
  display: none !important; }

*,
*:before,
*:after {
  box-sizing: inherit; }

.header-main {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  padding-top: var(--bbva-header-main-padding-top, 0);
  padding-left: calc(((0.5 * var(--gridSpacerVariant, var(--gridSpacer, ${unsafeCSS(grid.spacer)}))) / 16) * 1rem);
  padding-right: calc(((0.5 * var(--gridSpacerVariant, var(--gridSpacer, ${unsafeCSS(grid.spacer)}))) / 16) * 1rem);
  margin-left: auto;
  margin-right: auto;
  min-height: var(--bbva-header-main-min-height, calc(((6 * var(--gridSpacerVariant, var(--gridSpacer, ${unsafeCSS(grid.spacer)}))) / 16) * 1rem));
  max-width: var(--bbva-header-main-max-width, 100%); }
  .header-main .text {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    display: block;
    position: absolute;
    bottom: 0;
    top: var(--bbva-header-main-text-top, var(--bbva-header-main-padding-top, 0));
    left: 0;
    width: 100%;
    height: var(--bbva-header-main-min-height, calc(((6 * var(--gridSpacerVariant, var(--gridSpacer, ${unsafeCSS(grid.spacer)}))) / 16) * 1rem));
    margin: 0;
    padding: 0 var(--bbva-header-main-text-padding-horizontal, calc(((6 * var(--gridSpacerVariant, var(--gridSpacer, ${unsafeCSS(grid.spacer)}))) / 16) * 1rem));
    text-align: center;
    font-size: var(--bbva-header-main-text-font-size, var(--typographyTypeMedium, ${unsafeCSS(typography.typeMedium)}));
    line-height: var(--bbva-header-main-text-line-height, calc(((6 * var(--gridSpacerVariant, var(--gridSpacer, ${unsafeCSS(grid.spacer)}))) / 16) * 1rem));
    font-weight: 400; }
    .header-main .text.full-padding {
      --bbva-header-main-text-padding-horizontal: calc(((12 * var(--gridSpacerVariant, var(--gridSpacer, ${unsafeCSS(grid.spacer)}))) / 16) * 1rem); }
    .header-main .text.image {
      display: flex;
      justify-content: center; }
  .header-main .header-icons {
    display: flex; }
  .header-main .icon {
    display: block;
    position: relative;
    border: none;
    background: none;
    width: var(--bbva-header-main-min-height, calc(((5.5 * var(--gridSpacerVariant, var(--gridSpacer, ${unsafeCSS(grid.spacer)}))) / 16) * 1rem));
    min-height: var(--bbva-header-main-min-height, calc(((6 * var(--gridSpacerVariant, var(--gridSpacer, ${unsafeCSS(grid.spacer)}))) / 16) * 1rem));
    padding: 0;
    color: inherit;
    margin: 0; }

:host(.modal) {
  --bbva-header-main-bg-color: var(--backgroundColorsDark, ${unsafeCSS(backgroundColors.dark)}); }

:host(.modal-three-level) {
  --bbva-header-main-bg-color: var(--backgroundColorsLight, ${unsafeCSS(backgroundColors.light)});
  --bbva-header-main-color: var(--colorsSecondary600, ${unsafeCSS(colors.secondary600)}); }

:host(.process) {
  --bbva-header-main-bg-color: var(--colorsTertiaryType6Dark, ${unsafeCSS(colors.tertiaryType6Dark)}); }

:host(.sign) {
  --bbva-header-main-bg-color: var(--colorsTertiaryType4Dark, ${unsafeCSS(colors.tertiaryType4Dark)}); }

:host(.transparent) {
  --bbva-header-main-bg-color: transparent; }
`;

  /**
  `<bbva-header-main>` main navigation header. Types:
    * Modal: modal header of operation.
    * Modal third level: modal header that opens under the operational modal.
    * Process: end of process header.
    * Sign: operations sign header.
    * Transparent: Transparent header for login.

  Example:

  ```html
  <bbva-header-main
    accessibility-text-icon-left1="Return"
    accessibility-text-icon-left2="Communication"
    accessibility-text-icon-right1="Menu"
    accessibility-text-icon-right2="Help"
    icon-left1="coronita:return-12"
    icon-left2="coronita:communication"
    icon-right1="coronita:menu"
    icon-right2="coronita:help"
    text="Header main"></bbva-header-main>
  ```

  ## Icons

  Since this component uses icons, it will need an [iconset](https://platform.bbva.com/en-us/developers/engines/cells/documentation/cells-architecture/composing-with-components/cells-icons) in your project as an application level dependency. In fact, this component uses an iconset in its demo.

  ## Styling

  The following custom properties are available for styling:

  ### Custom properties

  | Selector                        | CSS Property                               | CSS Variable                               | Theme Variable                    | Foundations/Fallback                                  |
  | ------------------------------- | ------------------------------------------ | ------------------------------------------ | --------------------------------- | ----------------------------------------------------- |
  | :host(.sign)                    | --bbva-header-main-bg-color                |                                            | --colorsTertiaryType4Dark         | foundations.colors.tertiaryType4Dark    |
  | :host(.process)                 | --bbva-header-main-bg-color                |                                            | --colorsTertiaryType6Dark         | foundations.colors.tertiaryType6Dark    |
  | :host(.modal-three-level)       | --bbva-header-main-bg-color                |                                            | --backgroundColorsLight           | foundations.backgroundColors.light      |
  | :host(.modal-three-level)       | --bbva-header-main-color                   |                                            | --colorsSecondary600              | foundations.colors.secondary600         |
  | :host(.modal)                   | --bbva-header-main-bg-color                |                                            | --backgroundColorsDark            | foundations.backgroundColors.dark       |
  | .header-main .icon              | width                                      | --bbva-header-main-min-height              | --gridSpacerVariant, --gridSpacer | foundations.grid.spacer                 |
  | .header-main .icon              | min-height                                 | --bbva-header-main-min-height              | --gridSpacerVariant, --gridSpacer | foundations.grid.spacer                 |
  | .header-main .text.full-padding | --bbva-header-main-text-padding-horizontal | --gridSpacerVariant                        | --gridSpacer                      | foundations.grid.spacer                 |
  | .header-main .text              | top                                        | --bbva-header-main-text-top                | --bbva-header-main-padding-top    | 0                                                     |
  | .header-main .text              | height                                     | --bbva-header-main-min-height              | --gridSpacerVariant, --gridSpacer | foundations.grid.spacer                 |
  | .header-main .text              | padding                                    | --bbva-header-main-text-padding-horizontal | --gridSpacerVariant, --gridSpacer | foundations.grid.spacer                 |
  | .header-main .text              | font-size                                  | --bbva-header-main-text-font-size          | --typographyTypeMedium            | foundations.typography.typeMedium       |
  | .header-main .text              | line-height                                | --bbva-header-main-text-line-height        | --gridSpacerVariant, --gridSpacer | foundations.grid.spacer                 |
  | .header-main                    | padding-top                                | --bbva-header-main-padding-top             |                                   | 0                                                     |
  | .header-main                    | padding-left                               | --gridSpacerVariant                        | --gridSpacer                      | foundations.grid.spacer                 |
  | .header-main                    | padding-right                              | --gridSpacerVariant                        | --gridSpacer                      | foundations.grid.spacer                 |
  | .header-main                    | min-height                                 | --bbva-header-main-min-height              | --gridSpacerVariant, --gridSpacer | foundations.grid.spacer                 |
  | .header-main                    | max-width                                  | --bbva-header-main-max-width               |                                   | 100%                                                  |
  | :host                           | background-color                           | --bbva-header-main-bg-color                | --backgroundColorsDark400         | foundations.backgroundColors.dark400    |
  | :host                           | color                                      | --bbva-header-main-color                   | --colorsPrimaryCoreLightened      | foundations.colors.primaryCoreLightened |
  > Styling documentation generated by Cells CLI


  @customElement bbva-header-main
  @polymer
  @LitElement
  @demo demo/index.html
  @appliesMixin CellsI18nMixin
  */

  class BbvaHeaderMain extends CellsFocusVisibleMixin(CellsI18nMixin(LitElement)) {
    static get is() {
      return 'bbva-header-main';
    }

    static get properties() {
      return {
        /**
         * Accessibility text for aria-label in icon left 1
         */
        accessibilityTextIconLeft1: {
          type: String,
          attribute: 'accessibility-text-icon-left1'
        },

        /**
         * Accessibility text for aria-label in icon left 2
         */
        accessibilityTextIconLeft2: {
          type: String,
          attribute: 'accessibility-text-icon-left2'
        },

        /**
         * Accessibility text for aria-label in icon right 1
         */
        accessibilityTextIconRight1: {
          type: String,
          attribute: 'accessibility-text-icon-right1'
        },

        /**
         * Accessibility text for aria-label in icon right 2
         */
        accessibilityTextIconRight2: {
          type: String,
          attribute: 'accessibility-text-icon-right2'
        },

        /**
         * Icon to be show on the left in 1 position
         */
        iconLeft1: {
          type: String,
          attribute: 'icon-left1'
        },

        /**
         * Icon to be show on the left in 2 position
         */
        iconLeft2: {
          type: String,
          attribute: 'icon-left2'
        },

        /**
         * Icon to be show on the right in 1 position
         */
        iconRight1: {
          type: String,
          attribute: 'icon-right1'
        },

        /**
         * Icon to be show on the right in 2 position
         */
        iconRight2: {
          type: String,
          attribute: 'icon-right2'
        },

        /**
         * Size for all icons
         */
        iconSize: {
          type: Number,
          attribute: 'icon-size'
        },

        /**
         * If has image it's displayed instead of the text
         */
        image: {
          type: String
        },

        /**
         * If has text it's displayed instead of the image
         */
        text: {
          type: String
        }
      };
    }

    get _fullPadding() {
      return this.iconLeft2 || this.iconRight2 ? 'full-padding' : '';
    }

    get _hasImage() {
      return this.image ? 'image' : '';
    }

    constructor() {
      super();
      this.iconSize = 20;
    }

    static get styles() {
      return [styles$8, getComponentSharedStyles('bbva-header-main-shared-styles'), bbvaFoundationsStylesFocus('button:focus')];
    }

    render() {
      const {
        _fullPadding,
        _hasImage,
        text,
        image,
        accessibilityTextIconLeft1,
        accessibilityTextIconLeft2,
        accessibilityTextIconRight1,
        accessibilityTextIconRight2,
        iconLeft1,
        iconLeft2,
        iconRight1,
        iconRight2,
        iconSize
      } = this;
      return html`
      <header class="header-main">
        <h1 class="text ${_fullPadding} ${_hasImage}" id="headding">
          <span id="text">${this.t(text)}</span>
          <img src="${ifDefined(image)}" alt="" ?hidden="${!image}" id="image" />
        </h1>

        <div class="header-icons">
          <button
            class="icon"
            aria-label="${ifDefined(accessibilityTextIconLeft1)}"
            ?hidden="${!iconLeft1}"
            @click="${() => this._headerIconClick('left1')}"
            id="btn-left1"
          >
            <cells-icon icon="${ifDefined(iconLeft1)}" size="${iconSize}"></cells-icon>
          </button>
          <button
            class="icon"
            aria-label="${ifDefined(accessibilityTextIconLeft2)}"
            ?hidden="${!iconLeft2}"
            @click="${() => this._headerIconClick('left2')}"
            id="btn-left2"
          >
            <cells-icon icon="${ifDefined(iconLeft2)}" size="${iconSize}"></cells-icon>
          </button>
        </div>

        <div class="header-icons">
          <button
            class="icon"
            aria-label="${ifDefined(accessibilityTextIconRight2)}"
            ?hidden="${!iconRight2}"
            @click="${() => this._headerIconClick('right2')}"
            id="btn-right2"
          >
            <cells-icon icon="${ifDefined(iconRight2)}" size="${iconSize}"></cells-icon>
          </button>

          <button
            class="icon"
            aria-label="${ifDefined(accessibilityTextIconRight1)}"
            ?hidden="${!iconRight1}"
            @click="${() => this._headerIconClick('right1')}"
            id="btn-right1"
          >
            <cells-icon icon="${ifDefined(iconRight1)}" size="${iconSize}"></cells-icon>
          </button>
        </div>
      </header>
    `;
    }
    /**
     * Fired after clicking the icon
     * @event headder-main-icon-[left1]-click, icon-left2-click, icon-right1-click, icon-right2-click]
     */


    _headerIconClick(icon) {
      this.dispatchEvent(new CustomEvent(`header-main-icon-${icon}-click`, {
        detail: true,
        bubbles: true,
        composed: true
      }));
    }

  }

  customElements.define(BbvaHeaderMain.is, BbvaHeaderMain);

  var styles$9 = css`:host {
  --_status-pending-color: var(--bbva-progress-vertical-step-pending-color,var(--colorsSecondary300, ${unsafeCSS(colors.secondary300)}));
  --_status-pending-line-color: var(--bbva-progress-vertical-step-pending-line-color,var(--colorsSecondary300, ${unsafeCSS(colors.secondary300)}));
  --_status-pending-subtitle-color: var(--bbva-progress-vertical-step-pending-subtitle-color,var(--colorsPrimaryCore, ${unsafeCSS(colors.primaryCore)}));
  --_status-pending-text-color: var(--bbva-progress-vertical-step-pending-text-color,var(--colorsSecondary500, ${unsafeCSS(colors.secondary500)}));
  --_status-pending-title-color: var(--bbva-progress-vertical-step-pending-title-color,var(--colorsSecondary600, ${unsafeCSS(colors.secondary600)}));
  --_status-completed-color: var(--bbva-progress-vertical-step-completed-color,var(--colorsTertiaryType6Dark, ${unsafeCSS(colors.tertiaryType6Dark)}));
  --_status-completed-line-color: var(--bbva-progress-vertical-step-completed-line-color,var(--colorsTertiaryType6Dark, ${unsafeCSS(colors.tertiaryType6Dark)}));
  --_status-completed-subtitle-color: var(--bbva-progress-vertical-step-completed-subtitle-color,var(--colorsTertiaryType6Dark, ${unsafeCSS(colors.tertiaryType6Dark)}));
  --_status-completed-text-color: var(--bbva-progress-vertical-step-completed-text-color,var(--colorsSecondary600, ${unsafeCSS(colors.secondary600)}));
  --_status-completed-title-color: var(--bbva-progress-vertical-step-completed-title-color,var(--colorsSecondary600, ${unsafeCSS(colors.secondary600)}));
  --_status-error-color: var(--bbva-progress-vertical-step-error-color,var(--colorsTertiaryType1Dark, ${unsafeCSS(colors.tertiaryType1Dark)}));
  --_status-error-line-color: var(--bbva-progress-vertical-step-error-line-color,var(--colorsSecondary300, ${unsafeCSS(colors.secondary300)}));
  --_status-error-subtitle-color: var(--bbva-progress-vertical-step-error-subtitle-color,var(--colorsTertiaryType1Dark, ${unsafeCSS(colors.tertiaryType1Dark)}));
  --_status-error-text-color: var(--bbva-progress-vertical-step-error-text-color,var(--colorsSecondary600, ${unsafeCSS(colors.secondary600)}));
  --_status-error-title-color: var(--bbva-progress-vertical-step-error-title-color,var(--colorsSecondary600, ${unsafeCSS(colors.secondary600)}));
  --_date-color: var(--bbva-progress-vertical-step-date-color,var(--colorsSecondary600, ${unsafeCSS(colors.secondary600)}));
  --_link-color: var(--bbva-progress-vertical-step-link-color,var(--colorsPrimaryMedium, ${unsafeCSS(colors.primaryMedium)}));
  --_link-active-color: var(--bbva-progress-vertical-step-link-active-color,var(--colorsPrimaryCoreDark, ${unsafeCSS(colors.primaryCoreDark)}));
  --_link-disabled-color: var(--bbva-progress-vertical-step-link-disabled-color,var(--colorsSecondary400, ${unsafeCSS(colors.secondary400)}));
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
  padding: var(--bbva-progress-vertical-step-steps-padding, calc(((2 * var(--gridSpacerVariant, var(--gridSpacer, ${unsafeCSS(grid.spacer)}))) / 16) * 1em));
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
  padding-bottom: calc(((2 * var(--gridSpacerVariant, var(--gridSpacer, ${unsafeCSS(grid.spacer)}))) / 16) * 1em); }
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
  margin-top: calc(((0.5 * var(--gridSpacerVariant, var(--gridSpacer, ${unsafeCSS(grid.spacer)}))) / 16) * 1rem);
  border-radius: 50%;
  background-color: var(--_status-color);
  position: relative; }

.main-content {
  display: flex;
  flex: 1;
  flex-direction: column;
  margin-left: calc(((2 * var(--gridSpacerVariant, var(--gridSpacer, ${unsafeCSS(grid.spacer)}))) / 16) * 1rem); }

.step-heading {
  display: flex;
  flex: 1;
  align-items: flex-start;
  justify-content: space-between; }

.title {
  font-size: var(--typographyTypeMedium, ${unsafeCSS(typography.typeMedium)});
  font-weight: var(--fontFacePrimaryMediumFontWeight, ${unsafeCSS(fontFacePrimary.medium.fontWeight)});
  font-style: var(--fontFacePrimaryMediumFontStyle, ${unsafeCSS(fontFacePrimary.medium.fontStyle)});
  line-height: var(--lineHeightTypeMedium, ${unsafeCSS(lineHeight.typeMedium)});
  color: var(--_status-title-color); }

.subtitle {
  margin-top: calc(((1 * var(--gridSpacerVariant, var(--gridSpacer, ${unsafeCSS(grid.spacer)}))) / 16) * 1rem);
  font-size: var(--typographyTypeSmall, ${unsafeCSS(typography.typeSmall)});
  font-weight: var(--fontFacePrimaryBookFontWeight, ${unsafeCSS(fontFacePrimary.book.fontWeight)});
  font-style: var(--fontFacePrimaryBookFontStyle, ${unsafeCSS(fontFacePrimary.book.fontStyle)});
  line-height: var(--lineHeightTypeSmall, ${unsafeCSS(lineHeight.typeSmall)});
  color: var(--_status-subtitle-color); }

.text {
  margin-top: calc(((1 * var(--gridSpacerVariant, var(--gridSpacer, ${unsafeCSS(grid.spacer)}))) / 16) * 1rem);
  font-size: var(--typographyTypeSmall, ${unsafeCSS(typography.typeSmall)});
  font-weight: var(--fontFacePrimaryBookFontWeight, ${unsafeCSS(fontFacePrimary.book.fontWeight)});
  font-style: var(--fontFacePrimaryBookFontStyle, ${unsafeCSS(fontFacePrimary.book.fontStyle)});
  line-height: var(--lineHeightTypeSmall, ${unsafeCSS(lineHeight.typeSmall)});
  color: var(--_status-text-color); }

.date {
  color: var(--_date-color); }

.notification {
  margin-top: calc(((1 * var(--gridSpacerVariant, var(--gridSpacer, ${unsafeCSS(grid.spacer)}))) / 16) * 1rem);
  --bbva-notification-help-icon-color: var(--bbva-progress-vertical-step-help-icon-color,var(--colorsTertiaryType1Dark, ${unsafeCSS(colors.tertiaryType1Dark)}));
  --bbva-notification-help-text-color: var(--bbva-progress-vertical-step-help-text-color,var(--colorsSecondary600, ${unsafeCSS(colors.secondary600)})); }

.link {
  --bbva-link-color: var(--_link-color);
  --bbva-link-active-color: var(--_link-active-color);
  --bbva-link-disabled-color: var(--_link-disabled-color); }
`;

  var light = css`[ambient^=light] {
  --bbva-progress-vertical-step-pending-color: var(--colorsSecondary300, ${unsafeCSS(colors.secondary300)});
  --bbva-progress-vertical-step-pending-line-color: var(--colorsSecondary300, ${unsafeCSS(colors.secondary300)});
  --bbva-progress-vertical-step-pending-subtitle-color: var(--colorsPrimaryCore, ${unsafeCSS(colors.primaryCore)});
  --bbva-progress-vertical-step-pending-text-color: var(--colorsSecondary500, ${unsafeCSS(colors.secondary500)});
  --bbva-progress-vertical-step-pending-title-color: var(--colorsSecondary600, ${unsafeCSS(colors.secondary600)});
  --bbva-progress-vertical-step-completed-color: var(--colorsTertiaryType6Dark, ${unsafeCSS(colors.tertiaryType6Dark)});
  --bbva-progress-vertical-step-completed-line-color: var(--colorsTertiaryType6Dark, ${unsafeCSS(colors.tertiaryType6Dark)});
  --bbva-progress-vertical-step-completed-subtitle-color: var(--colorsTertiaryType6Dark, ${unsafeCSS(colors.tertiaryType6Dark)});
  --bbva-progress-vertical-step-completed-text-color: var(--colorsSecondary600, ${unsafeCSS(colors.secondary600)});
  --bbva-progress-vertical-step-completed-title-color: var(--colorsSecondary600, ${unsafeCSS(colors.secondary600)});
  --bbva-progress-vertical-step-error-color: var(--colorsTertiaryType1Dark, ${unsafeCSS(colors.tertiaryType1Dark)});
  --bbva-progress-vertical-step-error-line-color: var(--colorsSecondary300, ${unsafeCSS(colors.secondary300)});
  --bbva-progress-vertical-step-error-subtitle-color: var(--colorsTertiaryType1Dark, ${unsafeCSS(colors.tertiaryType1Dark)});
  --bbva-progress-vertical-step-error-text-color: var(--colorsSecondary600, ${unsafeCSS(colors.secondary600)});
  --bbva-progress-vertical-step-error-title-color: var(--colorsSecondary600, ${unsafeCSS(colors.secondary600)});
  --bbva-progress-vertical-step-date-color: var(--colorsSecondary600, ${unsafeCSS(colors.secondary600)});
  --bbva-progress-vertical-step-help-icon-color: var(--colorsTertiaryType1Dark, ${unsafeCSS(colors.tertiaryType1Dark)});
  --bbva-progress-vertical-step-help-text-color: var(--colorsSecondary600, ${unsafeCSS(colors.secondary600)});
  --bbva-progress-vertical-step-link-color: var(--colorsPrimaryMedium, ${unsafeCSS(colors.primaryMedium)});
  --bbva-progress-vertical-step-link-active-color: var(--colorsPrimaryCoreDark, ${unsafeCSS(colors.primaryCoreDark)});
  --bbva-progress-vertical-step-link-disabled-color: var(--colorsSecondary400, ${unsafeCSS(colors.secondary400)}); }
`;

  var dark = css`[ambient^=dark] {
  --bbva-progress-vertical-step-pending-color: var(--colorsSecondary300, ${unsafeCSS(colors.secondary300)});
  --bbva-progress-vertical-step-pending-line-color: var(--colorsSecondary300, ${unsafeCSS(colors.secondary300)});
  --bbva-progress-vertical-step-pending-subtitle-color: var(--colorsPrimaryCoreLightened, ${unsafeCSS(colors.primaryCoreLightened)});
  --bbva-progress-vertical-step-pending-text-color: var(--colorsSecondary300, ${unsafeCSS(colors.secondary300)});
  --bbva-progress-vertical-step-pending-title-color: var(--colorsSecondary300, ${unsafeCSS(colors.secondary300)});
  --bbva-progress-vertical-step-completed-color: var(--colorsTertiaryType6Medium, ${unsafeCSS(colors.tertiaryType6Medium)});
  --bbva-progress-vertical-step-completed-line-color: var(--colorsTertiaryType6Medium, ${unsafeCSS(colors.tertiaryType6Medium)});
  --bbva-progress-vertical-step-completed-subtitle-color: var(--colorsPrimaryCoreLightened, ${unsafeCSS(colors.primaryCoreLightened)});
  --bbva-progress-vertical-step-completed-text-color: var(--colorsPrimaryCoreLightened, ${unsafeCSS(colors.primaryCoreLightened)});
  --bbva-progress-vertical-step-completed-title-color: var(--colorsPrimaryCoreLightened, ${unsafeCSS(colors.primaryCoreLightened)});
  --bbva-progress-vertical-step-error-color: var(--colorsTertiaryType1Light, ${unsafeCSS(colors.tertiaryType1Light)});
  --bbva-progress-vertical-step-error-line-color: var(--colorsSecondary300, ${unsafeCSS(colors.secondary300)});
  --bbva-progress-vertical-step-error-subtitle-color: var(--colorsPrimaryCoreLightened, ${unsafeCSS(colors.primaryCoreLightened)});
  --bbva-progress-vertical-step-error-text-color: var(--colorsPrimaryCoreLightened, ${unsafeCSS(colors.primaryCoreLightened)});
  --bbva-progress-vertical-step-error-title-color: var(--colorsPrimaryCoreLightened, ${unsafeCSS(colors.primaryCoreLightened)});
  --bbva-progress-vertical-step-date-color: var(--colorsPrimaryCoreLightened, ${unsafeCSS(colors.primaryCoreLightened)});
  --bbva-progress-vertical-step-help-icon-color: var(--colorsPrimaryCoreLightened, ${unsafeCSS(colors.primaryCoreLightened)});
  --bbva-progress-vertical-step-help-text-color: var(--colorsPrimaryCoreLightened, ${unsafeCSS(colors.primaryCoreLightened)});
  --bbva-progress-vertical-step-link-color: var(--colorsPrimarySubdued, ${unsafeCSS(colors.primarySubdued)});
  --bbva-progress-vertical-step-link-active-color: var(--colorsPrimaryMediumLight, ${unsafeCSS(colors.primaryMediumLight)});
  --bbva-progress-vertical-step-link-disabled-color:var(--colorsSecondary400, ${unsafeCSS(colors.secondary400)}); }
`;

  const bbvaProgressVerticalStepAmbient = {
    light,
    dark
  };

  class BbvaProgressVerticalStep extends CellsI18nMixin(LitElement) {
    static get is() {
      return 'bbva-progress-vertical-step';
    }

    static get properties() {
      return {
        /**
         * Array with the objects that will be used for the steps
         */
        steps: {
          type: Array
        },

        /**
         * Object with keys for accessible step status text
         */
        statusText: {
          type: Object,
          attribute: 'status-text'
        }
      };
    }

    static get styles() {
      return [styles$9, getComponentSharedStyles('bbva-progress-vertical-step-shared-styles')];
    }

    constructor() {
      super();
      this.steps = [];
      this.statusText = {
        completed: 'bbva-progress-vertical-step-completed',
        pending: 'bbva-progress-vertical-step-pending',
        error: 'bbva-progress-vertical-step-error'
      };
    }

    _linkClicked(step) {
      /**
       * Fired when the step link is clicked
       * @event progress-vertical-step-link-click
       */
      this.dispatchEvent(new CustomEvent('progress-vertical-step-link-click', {
        bubbles: true,
        composed: true,
        detail: step
      }));
    }

    render() {
      return html`
      <ol class="steps">
        ${this.steps.map(step => html`
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
                  ${step.status === 'error' ? html`
                        <bbva-notification-help
                          icon="${step.notificationIcon}"
                          class="notification"
                          text="${step.notificationText}"
                        ></bbva-notification-help>
                      ` : ``}
                </div>
              </li>
            `)}
      </ol>
    `;
    }

  }
  customElements.define(BbvaProgressVerticalStep.is, BbvaProgressVerticalStep);

  exports.bbvaProgressVerticalStepAmbient = bbvaProgressVerticalStepAmbient;
  exports.html = html;
  exports.render = render;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=component.js.map
