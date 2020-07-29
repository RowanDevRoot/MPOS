(function (factory) {
  typeof define === 'function' && define.amd ? define(factory) :
  factory();
}((function () { 'use strict';

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

  setDocumentCustomStyles(css`
  #iframeBody {
    margin: 0;
    background-color: ${unsafeCSS(backgroundColors.dark)};
  }

  bbva-list-multistep bbva-clip-box {
    --bbva-medium-white: ${unsafeCSS(colors.primaryCoreLightened)};
    --bbva-clip-box-size: 24px;
    --cells-icon-fill-color: ${unsafeCSS(backgroundColors.dark)};
    margin-left: 8px;
  }
`);

  var styles = css`:host {
  box-sizing: border-box;
  display: block;
  padding: 0 calc(((2 * var(--gridSpacerVariant, var(--gridSpacer, ${unsafeCSS(grid.spacer)}))) / 16) * 1em) calc(((1 * var(--gridSpacerVariant, var(--gridSpacer, ${unsafeCSS(grid.spacer)}))) / 16) * 1em);
  background-color: var(--bbva-list-multistep-description-bg-color, transparent); }

:host([hidden]),
[hidden] {
  display: none !important; }

*,
*:before,
*:after {
  box-sizing: inherit; }

.slot-container ::slotted(*) {
  color: var(--bbva-list-multistep-description-text-color, var(--colorsPrimaryCoreLightened, ${unsafeCSS(colors.primaryCoreLightened)}));
  font-size: var(--typographyTypeSmall, ${unsafeCSS(typography.typeSmall)});
  line-height: var(--lineHeightTypeSmall, ${unsafeCSS(lineHeight.typeSmall)});
  font-weight: var(--fontFacePrimaryBookFontWeight, ${unsafeCSS(fontFacePrimary.book.fontWeight)});
  font-style: var(--fontFacePrimaryBookFontStyle, ${unsafeCSS(fontFacePrimary.book.fontStyle)}); }
`;

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

  var styles$1 = css`:host {
  display: block;
  box-sizing: border-box;
  font-size: 1rem;
  color: var(--bbva-list-link-icon-color, var(--bbva-medium-blue, #1973b8));
  --bbva-global-spacer: 0.5rem; }

:host([hidden]),
[hidden] {
  display: none !important; }

*,
*:before,
*:after {
  box-sizing: inherit; }

:host(.neutral) {
  color: var(--bbva-list-link-icon-color, var(--bbva-600, #121212)); }

:host(.warning) {
  color: var(--bbva-list-link-icon-color, var(--bbva-dark-red, #b92a45)); }

:host(.success) {
  color: var(--bbva-list-link-icon-color, var(--bbva-dark-green, #277a3e)); }

button {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: calc(var(--bbva-global-spacer) * 2);
  padding-bottom: calc(calc(var(--bbva-global-spacer) * 2) - 1px);
  border: none;
  background-color: var(--bbva-list-link-icon-background-color, var(--bbva-white, #ffffff));
  border-bottom: 1px solid var(--bbva-list-link-icon-border-bottom-color, var(--bbva-300, #d3d3d3));
  font-family: inherit;
  font-size: inherit;
  font-weight: 500;
  color: inherit;
  text-align: left; }

.text {
  flex: 1;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis; }

.icon {
  flex-shrink: 0; }

.icon-left {
  margin-right: var(--bbva-global-spacer); }

.icon-right {
  color: var(--bbva-list-link-icon-right-icon-color, var(--bbva-medium-blue, #1973b8));
  margin-left: var(--bbva-global-spacer); }
`;

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

  var styles$2 = css`:host {
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

  class CellsIcon extends LitElement {
    static get is() {
      return 'cells-icon';
    }

    static get styles() {
      return [styles$2, getComponentSharedStyles('cells-icon-shared-styles')];
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
  customElements.define(CellsIcon.is, CellsIcon);

  /**
  `<bbva-list-link-icon>` is a button with configurable icons for the left and right sides.
  The default right icon is an arrow (coronita:forward).

  The color of the left icon and text can be changed by customizing `--bbva-list-link-icon-color` or using one of
  the available classes for predefined colors (black, green and red). Default color (no class) is blue.

  ## Available color classes:

  | Class name  | Color |
  | :-----------| :---------- |
  | `neutral`   | `var(--bbva-600, #121212)` |
  | `warning`   | `var(--bbva-dark-red, #B92A45)` |
  | `success`   | `var(--bbva-dark-green, #277A3E)` |


  Example with right icon (default):

  ```html
  <bbva-list-link-icon icon-left="coronita:edit">Hazte cliente</bbva-list-link-icon>
  ```

  Without right icon:

  ```html
  <bbva-list-link-icon icon-left="coronita:edit" icon-right="">Hazte cliente</bbva-list-link-icon>
  ```

  With custom icons:

  ```html
  <bbva-list-link-icon
    icon-left="coronita:edit"
    icon-right="coronita:attached">Hazte cliente</bbva-list-link-icon>
  ```

  ## Icons

  Since this component uses icons, it will need an [iconset](https://platform.bbva.com/en-us/developers/engines/cells/documentation/cells-architecture/composing-with-components/cells-icons) in your project as an application level dependency. In fact, this component uses an iconset in its demo.

  ## Styling

  The following custom properties are available for styling:

  ### Custom properties

  | Selector        | CSS Property     | CSS Variable                              | Theme Variable     | Foundations/Fallback |
  | --------------- | ---------------- | ----------------------------------------- | ------------------ | -------------------- |
  | .icon-right     | color            | --bbva-list-link-icon-right-icon-color    | --bbva-medium-blue | #1973b8              |
  | .icon-right     | margin-left      | --bbva-global-spacer                      |                    |                      |
  | .icon-left      | margin-right     | --bbva-global-spacer                      |                    |                      |
  | button          | padding          | --bbva-global-spacer                      |                    |                      |
  | button          | padding-bottom   | --bbva-global-spacer                      |                    |                      |
  | button          | background-color | --bbva-list-link-icon-background-color    | --bbva-white       | #ffffff              |
  | button          | border-bottom    | --bbva-list-link-icon-border-bottom-color | --bbva-300         | #d3d3d3              |
  | :host(.success) | color            | --bbva-list-link-icon-color               | --bbva-dark-green  | #277a3e              |
  | :host(.warning) | color            | --bbva-list-link-icon-color               | --bbva-dark-red    | #b92a45              |
  | :host(.neutral) | color            | --bbva-list-link-icon-color               | --bbva-600         | #121212              |
  | :host           | color            | --bbva-list-link-icon-color               | --bbva-medium-blue | #1973b8              |
  > Styling documentation generated by Cells CLI

  @customElement bbva-list-link-icon
  @polymer
  @LitElement
  @demo demo/index.html
  @appliesMixin CellsFocusVisibleMixin
  */

  class BbvaListLinkIcon extends CellsFocusVisibleMixin(LitElement) {
    static get is() {
      return 'bbva-list-link-icon';
    }

    static get properties() {
      return {
        /**
         * Icon left.
         */
        iconLeft: {
          type: String,
          attribute: 'icon-left'
        },

        /**
         * Size of the left icon.
         */
        iconLeftSize: {
          type: Number,
          attribute: 'icon-left-size'
        },

        /**
         * Icon Right
         */
        iconRight: {
          type: String,
          attribute: 'icon-right'
        },

        /**
         * Size of the right icon.
         */
        iconRightSize: {
          type: Number,
          attribute: 'icon-right-size'
        }
      };
    }

    constructor() {
      super();
      this.iconLeft = '';
      this.iconLeftSize = 24;
      this.iconRight = 'coronita:forward';
      this.iconRightSize = 24;
    }

    static get styles() {
      return [styles$1, getComponentSharedStyles('bbva-list-link-icon-shared-styles'), bbvaFoundationsStylesFocus('button:focus')];
    }

    render() {
      return html`
      <button type="button">
        <cells-icon
          icon="${this.iconLeft}"
          size="${this.iconLeftSize}"
          class="icon icon-left"
        ></cells-icon>
        <span class="text"><slot></slot></span>
        <cells-icon
          icon="${this.iconRight}"
          size="${this.iconRightSize}"
          class="icon icon-right"
          ?hidden="${!this.iconRight}"
        ></cells-icon>
      </button>
    `;
    }

  }

  customElements.define(BbvaListLinkIcon.is, BbvaListLinkIcon);

  class BbvaListMultistepDescription extends LitElement {
    static get is() {
      return 'bbva-list-multistep-description';
    }

    static get properties() {
      return {};
    }

    connectedCallback() {
      /* istanbul ignore else */
      if (super.connectedCallback) {
        super.connectedCallback();
      }
    }

    static get styles() {
      return [styles, getComponentSharedStyles('bbva-list-multistep-description-shared-styles')];
    }

    render() {
      return html`
      <div class="slot-container">
        <slot></slot>
        <slot></slot>
        <slot></slot>
        <slot></slot>       
      </div>
    `;
    }

  }
  customElements.define(BbvaListMultistepDescription.is, BbvaListMultistepDescription);

})));
//# sourceMappingURL=component.js.map
