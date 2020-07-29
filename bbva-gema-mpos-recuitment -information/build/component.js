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
   * Reparents nodes, starting from `start` (inclusive) to `end` (exclusive),
   * into another container (could be the same container), before `before`. If
   * `before` is null, it appends the nodes to the container.
   */

  const reparentNodes = (container, start, end = null, before = null) => {
    while (start !== end) {
      const n = start.nextSibling;
      container.insertBefore(start, before);
      start = n;
    }
  };
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
   * A TemplateResult for SVG fragments.
   *
   * This class wraps HTML in an `<svg>` tag in order to parse its contents in the
   * SVG namespace, then modifies the template to remove the `<svg>` tag so that
   * clones only container the original fragment.
   */

  class SVGTemplateResult extends TemplateResult {
    getHTML() {
      return `<svg>${super.getHTML()}</svg>`;
    }

    getTemplateElement() {
      const template = super.getTemplateElement();
      const content = template.content;
      const svgElement = content.firstChild;
      content.removeChild(svgElement);
      reparentNodes(content, svgElement.firstChild);
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
   * Interprets a template literal as an SVG template that can efficiently
   * render to and update a container.
   */

  const svg = (strings, ...values) => new SVGTemplateResult(strings, values, 'svg', defaultTemplateProcessor);

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
      return [styles$1, getComponentSharedStyles('cells-icon-shared-styles')];
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

  var styles$2 = css`:host {
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
      return [styles$2, getComponentSharedStyles('bbva-header-main-shared-styles'), bbvaFoundationsStylesFocus('button:focus')];
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

  var styles$3 = css`:host {
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

  var styles$4 = css`:host {
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
      return [styles$4, getComponentSharedStyles('cells-icon-shared-styles')];
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
      return [styles$3, getComponentSharedStyles('bbva-list-link-icon-shared-styles'), bbvaFoundationsStylesFocus('button:focus')];
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

  /**
   * Shared properties for amounts and currencies.
   *
   * CellsAmountMixin
   * @mixinFunction
   */

  const CellsAmountMixin = dedupingMixin(superClass => {
    return class extends superClass {
      static get properties() {
        return {
          /**
           * Amount.
           */
          amount: {
            type: Number
          },

          /**
           * ISO 4217 code for the currency
           */
          currencyCode: {
            type: String,
            attribute: 'currency-code'
          },

          /**
           * ISO 4217 for the local currency.
           * A value must be provided in order to localice the currency symbols.
           */
          localCurrency: {
            type: String,
            attribute: 'local-currency'
          },

          /**
           * Language code for the amount.
           */
          language: {
            type: String
          }
        };
      }

      constructor() {
        super();
        this.currencyCode = 'EUR';
        this.localCurrency = 'EUR';
        this.language = 'es';
      }
      /**
       * Returns if the amount is negative
       */


      get negative() {
        return this.amount < 0;
      }

    };
  });

  /**
   * Variables describing currencies format structure as fractional separator character, thousands grouping character, symbols, or minus position.
   */

  /**
   * Separate fractional from integer according to document language.
   *
   * WARNING: uses non-standard lowercase language strings to prevent errors.
   * You should follow ISO-3166-1 and write the region part of your language in uppercase letters
   * (es-MX, es-CL, ...)
   * @type {Object}
   */
  const separators = {
    'ca': ',',
    'ca-es': ',',
    'es': ',',
    'es-us': '.',
    'en': '.',
    'en-us': '.',
    'en-uy': ',',
    'es-mx': '.',
    'es-pe': '.',
    'es-cl': '.',
    'es-uy': ',',
    'es-ar': ',',
    'eu': ',',
    'gl': ',',
    'tr': ','
  };
  /**
   * Group hundreds according to document language.
   *
   * WARNING: uses non-standard lowercase language strings to prevent errors.
   * You should follow ISO-3166-1 and write the region part of your language in uppercase letters
   * (es-MX, es-CL, ...)
   * @type {Object}
   */

  const groupChars = {
    'ca': '.',
    'ca-es': '.',
    'es': '.',
    'es-us': ',',
    'en': ',',
    'en-us': ',',
    'en-uy': '.',
    'es-mx': ',',
    'es-pe': ',',
    'es-cl': ',',
    'es-uy': '.',
    'es-ar': '.',
    'es-py': '.',
    'eu': '.',
    'gl': '.',
    'tr': '.'
  };
  /**
   * Currency symbols organized by localCurrency[currencyCode] with a 'default' key.
   * @type {Object}
   */

  const currenciesMap = {
    CLP: {
      CLP: '$'
    },
    COP: {
      COP: '$'
    },
    MXN: {
      MXN: '$'
    },
    EUR: {
      USD: '$'
    },
    USD: {
      USD: '$'
    },
    PEN: {
      PEN: 'S/',
      USD: 'US$'
    },
    ARS: {
      ARS: '$',
      USD: 'U$S',
      EUR: '€' // Argentinean Indexed Unit (unidad idexada)

    },
    UYU: {
      UYU: '$',
      USD: 'U$S',
      UYI: 'UI' // Uruguayan Indexed Unit (unidad idexada)

    },
    default: {
      AED: 'د.إ',
      AFN: '؋',
      ALL: 'L',
      AMD: '֏',
      ANG: 'NAƒ',
      AOA: 'Kz',
      ARS: '$',
      AUD: 'A$',
      AWG: 'Afl.',
      AZN: '₼',
      BAM: 'KM',
      BBD: 'Bds$',
      BDT: '৳',
      BGN: 'Лв',
      BHD: '.د.ب',
      BIF: 'FBu',
      BMD: 'BD$',
      BND: 'B$',
      BOB: 'Bs',
      BRL: 'R$',
      BSD: 'B$',
      BTN: 'Nu.',
      BWP: 'P',
      BYN: 'Br',
      BZD: 'Bz$',
      CAD: 'C$',
      CDF: 'F',
      CHF: 'Fr.',
      CLF: 'UF',
      //CL specific, here in case it's needed in another country
      CLP: 'Ch$',
      CNY: 'Yu¥',
      COP: '$',
      CRC: '$',
      CUP: '$',
      CVE: 'Esc.',
      CZK: 'Kč',
      DJF: '₣',
      DKK: 'kr',
      DOP: 'RD$',
      DZD: 'دج',
      EGP: 'LE',
      ETB: 'Br',
      EUR: '€',
      FJD: 'FJ$',
      FKP: 'FK£',
      GBP: '£',
      GEL: '₾',
      GHS: 'GH₵',
      GIP: '£',
      GMD: 'D',
      GNF: 'FG',
      GTQ: 'Q',
      GYD: 'GY$',
      HKD: 'HK$',
      HNL: 'L',
      HRK: 'kn',
      HTG: 'G',
      HUF: 'Ft',
      IDR: 'Rp',
      ILS: '₪',
      INR: '₹',
      IQD: 'ع.د',
      ISK: 'kr.',
      JMD: 'J$',
      JOD: 'JD',
      JPY: '¥',
      KES: 'KSh',
      KGS: 'C',
      KHR: '៛',
      KMF: '₣',
      KRW: '₩',
      KWD: 'د.ك',
      KYD: 'CI$',
      KZT: '₸',
      LAK: '₭',
      LBP: 'ل.ل',
      LKR: 'Rs',
      LRD: 'L$',
      LSL: 'M',
      LTL: 'Lt',
      LYD: 'ل.د',
      MAD: 'درهم',
      MDL: 'L',
      MGA: 'Ar',
      MKD: 'Ден',
      MMK: 'K',
      MNT: '₮',
      MOP: 'MOP$',
      MRU: 'UM',
      MUR: '₨',
      MVR: 'Rf',
      MWK: 'MK',
      MXN: 'Mx$',
      MYR: 'RM',
      MZN: 'MTn',
      NAD: 'N$',
      NGN: '₦',
      NIO: 'C$',
      NOK: 'kr',
      NPR: 'Rs',
      NZD: 'NZ$',
      OMR: 'ر.ع.',
      PAB: 'B/.',
      PEN: 'S/',
      PGK: 'K',
      PHP: '₱',
      PKR: 'Rs',
      PLN: 'zł',
      PYG: 'Gs',
      QAR: 'ر.ق',
      RON: 'L',
      RSD: 'дин',
      RUB: 'руб',
      RWF: 'RF',
      SAR: 'SR',
      SBD: 'SI$',
      SCR: 'SR',
      SEK: 'kr',
      SGD: 'S$',
      SHP: '£',
      SLL: 'Le',
      SOS: 'Sh.So.',
      SRD: 'Sr$',
      SSP: 'SS£',
      STN: 'Db',
      SVC: '₡',
      SZL: 'E',
      THB: '฿',
      TJS: 'TJS',
      TMT: 'ман.',
      TND: 'د.ت',
      TOP: 'T$',
      TRY: 'TL',
      TTD: 'TT$',
      TWD: 'NT$',
      TZS: 'TSh',
      UAH: '₴',
      UGX: 'USh',
      USD: 'US$',
      UYU: '$',
      UZS: 'UZS',
      VEF: 'Bs.',
      VND: '₫',
      VUV: 'VT',
      WST: 'WS$',
      XAF: 'FCFA',
      XCD: 'EC$',
      XOF: 'FCFA',
      XPF: '₣',
      YER: 'ريال',
      ZAR: 'R',
      ZMW: 'K'
    }
  };
  /**
   * localCurrency determines whether the minus sign of a negative number is rendered before or after the currency symbol (for left-aligned currencyCodes)
   * @type {Array}
   */

  const minusAfterSymbolLocalCurrencies = ['MXN', 'CLP', 'UYU', 'PEN', 'ARS', 'PYG', 'VEF'];
  /**
   * currency determines if decimals part is rendered
   * @type {Array}
   */

  const currenciesWithoutDecimals = ['PYG'];
  /**
   * currencyCodes whose symbol is rendered after the amount
   * @type {Array}
   */

  const rightAlignedCurrencies = ['EUR', '%'];

  /**
   * Functions for getting formating info and parts from currencies amounts based on language, currencyCode, localCurrency...
   */

  /**
   * Get group hundreds according to language
   * @param  { String } language Language to check in groupChars object
   * @return { String }          Thousans separator character
   */

  function getGroupChars(language) {
    language = language.toLowerCase();
    return groupChars[language] || groupChars[language.substring(0, language.indexOf('-'))];
  }
  /**
   * Get hundreds separator according to language
   * @param  { String } language Language to check in separators object
   * @return { String }          Fractional separator character
   */

  function getSeparator(language) {
    language = language.toLowerCase();
    return separators[language] || separators[language.substring(0, language.indexOf('-'))];
  }
  /**
   * Input String prepared for [ISO 4217 Currency Codes]
   * @param  { String } localCurrency Local currency code to use
   * @param  { String } currencyCode  Currency Code
   * @return { String }               Currency symbol
   */

  function getCurrencyAsSymbol(localCurrency, currencyCode) {
    return currenciesMap[localCurrency] && currenciesMap[localCurrency][currencyCode] || currenciesMap.default && currenciesMap.default[currencyCode] || currencyCode;
  }
  /**
   * Checks if currency should have decimal part based on currencyCode
   * @param  { String }  currencyCode Currency code
   * @return { Boolean }              Returns true if currency can have decimals
   */

  function hasDecimalPart(currencyCode) {
    return currenciesWithoutDecimals.indexOf(currencyCode) === -1;
  }
  /**
   * Checks if currency symbol is right aligned based on currencyCode
   * @param  { String }  currencyCode Currency code
   * @return { Boolean }              Returns true if currency symbol is right aligned
   */

  function isRightAligned(currencyCode) {
    return rightAlignedCurrencies.indexOf(currencyCode) !== -1;
  }
  /**
   * Checks if negative character goes after currency symbol based on local currency code
   * @param  { String }  localCurrency Local currency code
   * @return { Boolean }               Returns true if negative character goes after currency symbol
   */

  function hasMinusAfterSymbol(localCurrency) {
    return minusAfterSymbolLocalCurrencies.indexOf(localCurrency) !== -1;
  }
  /**
   * Returns provided amount as absolute
   * @param  { Number } amount Amount
   * @return { Number }        Amount as absolute
   */

  function getAbsAmount(amount) {
    return Math.abs(amount || 0);
  }
  /**
   * Returns amount without fractional part
   * @param  { Number } amount Amount
   * @return { Number }        Amount without fractional part
   */

  function getIntegerAmount(amount) {
    return Math.floor(amount);
  }
  /**
   * Returns absolute amount without fractional part
   * @param  { Number } amount Amount
   * @return { Number }        Absolute amount without fractional part
   */

  function getIntegerAbsAmount(amount) {
    return getIntegerAmount(getAbsAmount(amount));
  }
  /**
   * Returns grouped integer
   * @param  { Number } amount    Amount
   * @param  { String } groupChar Group char
   * @return { Number }           Grouped amount
   */

  function getGroupedIntegerString(amount, groupChar) {
    return amount.toString().replace(/(\d)(?=(\d{3})+$)/g, `$1${groupChar}`);
  }
  /**
   * Returns grouped absolute integer without fractional part
   * @param  { Number } amount    Amount
   * @param  { String } groupChar Group char
   * @return { Number }           Grouped absolute amount without fractional part
   */

  function getGroupedIntegerAbsString(amount, groupChar) {
    return getGroupedIntegerString(getIntegerAbsAmount(amount), groupChar);
  }
  /**
   * Returns fractional part of amount as integer
   * @param  { Number } amount Positive amount
   * @return { Number }        Fractional part of positive amount as integer
   */

  function getFractionalAmount(amount) {
    const str = amount.toString().split('.')[1] || '';
    return Number(str / 10 ** str.length);
  }

  var styles$5 = css`:host {
  display: inline-block;
  box-sizing: border-box;
  vertical-align: bottom;
  max-width: 100%;
  font-weight: var(--bbva-amount-font-weight, var(--fontFacePrimaryBookFontWeight, ${unsafeCSS(fontFacePrimary.book.fontWeight)})); }

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

.amount-wrapper {
  display: block;
  word-spacing: -0.25em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  unicode-bidi: bidi-override; }

.amount-block {
  margin: 0 0.125rem; }

@supports (-moz-appearance: meterbar) {
  .amount-wrapper {
    word-spacing: calc(-0.25em + 1.35px); } }

.minus-left {
  float: var(--bbva-amount-minus-left-float, none); }

.minus-right {
  float: var(--bbva-amount-minus-right-float, none); }

.currency {
  float: var(--bbva-amount-currency-float, none); }
  .currency-left, .currency-right {
    vertical-align: top; }

.currency-code {
  word-spacing: normal; }

.abbreviation {
  word-spacing: normal; }

:host([hidden]),
[hidden] {
  display: none !important; }

:host([variant='l']) {
  font-size: var(--bbva-amount-l-font-size, var(--typographyTypeLarge, ${unsafeCSS(typography.typeLarge)}));
  line-height: var(--bbva-amount-l-line-height, var(--lineHeightTypeLarge, ${unsafeCSS(lineHeight.typeLarge)})); }
  :host([variant='l']) .currency {
    font-size: var(--bbva-amount-l-currency-font-size, var(--typographyType3XSmall, ${unsafeCSS(typography.type3XSmall)}));
    line-height: var(--bbva-amount-l-currency-line-height, var(--lineHeightType3XSmall, ${unsafeCSS(lineHeight.type3XSmall)})); }

:host([variant='xl']) {
  font-size: var(--bbva-amount-xl-font-size, var(--typographyTypeXLarge, ${unsafeCSS(typography.typeXLarge)}));
  line-height: var(--bbva-amount-xl-line-height, var(--lineHeightTypeXLarge, ${unsafeCSS(lineHeight.typeXLarge)})); }
  :host([variant='xl']) .currency {
    font-size: var(--bbva-amount-xl-currency-font-size, var(--typographyType3XSmall, ${unsafeCSS(typography.type3XSmall)}));
    line-height: var(--bbva-amount-xl-currency-line-height, var(--lineHeightType3XSmall, ${unsafeCSS(lineHeight.type3XSmall)})); }

:host([variant='3xl']) {
  font-size: var(--bbva-amount-3xl-font-size, var(--typographyType3XLarge, ${unsafeCSS(typography.type3XLarge)}));
  line-height: var(--bbva-amount-3xl-line-height, var(--lineHeightType3XLarge, ${unsafeCSS(lineHeight.type3XLarge)})); }
  :host([variant='3xl']) .currency {
    font-size: var(--bbva-amount-3xl-currency-font-size, var(--typographyType3XSmall, ${unsafeCSS(typography.type3XSmall)}));
    line-height: var(--bbva-amount-3xl-currency-line-height, var(--lineHeightType3XSmall, ${unsafeCSS(lineHeight.type3XSmall)})); }

:host([variant='4xl']) {
  font-size: var(--bbva-amount-4xl-font-size, 2rem);
  line-height: var(--bbva-amount-4xl-line-height, 2rem); }
  :host([variant='4xl']) .currency {
    font-size: var(--bbva-amount-4xl-currency-font-size, var(--typographyTypeXLarge, ${unsafeCSS(typography.typeXLarge)}));
    line-height: var(--bbva-amount-4xl-currency-line-height, var(--lineHeightTypeXLarge, ${unsafeCSS(lineHeight.typeXLarge)})); }

:host([variant='5xl']) {
  font-size: var(--bbva-amount-5xl-font-size, 3rem);
  line-height: var(--bbva-amount-5xl-line-height, 3rem); }
  :host([variant='5xl']) .currency {
    font-size: var(--bbva-amount-5xl-currency-font-size, 1.75rem);
    line-height: var(--bbva-amount-5xl-currency-line-height, 2rem); }
`;

  /**
  `<bbva-amount>` is a component formatting an amount and its currency code into different combinations of sizes.

  If amount is a negative value, `negative` attribute is added, which can be used to provide a visual clue.

  Amount can be abbreviated if a scale is indicated. E.g.: 1.240.000 can be abbreviated as 1.24M if scale 6 is set and matches an abbreviation in abbreviations property.

  Example:

  ```html
  <bbva-amount amount="6423525.45" currency-code="EUR" local-currency="USD" language="en">
  </bbva-amount>
  ```

   ## Styling

  The following custom properties are available for styling:

  ### Custom properties

  | Selector                         | CSS Property | CSS Variable                           | Theme Variable                  | Foundations/Fallback                                      |
  | -------------------------------- | ------------ | -------------------------------------- | ------------------------------- | --------------------------------------------------------- |
  | :host([variant='5xl']) .currency | font-size    | --bbva-amount-5xl-currency-font-size   |                                 | 1.75rem                                                   |
  | :host([variant='5xl']) .currency | line-height  | --bbva-amount-5xl-currency-line-height |                                 | 2rem                                                      |
  | :host([variant='5xl'])           | font-size    | --bbva-amount-5xl-font-size            |                                 | 3rem                                                      |
  | :host([variant='5xl'])           | line-height  | --bbva-amount-5xl-line-height          |                                 | 3rem                                                      |
  | :host([variant='4xl']) .currency | font-size    | --bbva-amount-4xl-currency-font-size   | --typographyTypeXLarge          | foundations.typography.typeXLarge           |
  | :host([variant='4xl']) .currency | line-height  | --bbva-amount-4xl-currency-line-height | --lineHeightTypeXLarge          | foundations.lineHeight.typeXLarge           |
  | :host([variant='4xl'])           | font-size    | --bbva-amount-4xl-font-size            |                                 | 2rem                                                      |
  | :host([variant='4xl'])           | line-height  | --bbva-amount-4xl-line-height          |                                 | 2rem                                                      |
  | :host([variant='3xl']) .currency | font-size    | --bbva-amount-3xl-currency-font-size   | --typographyType3XSmall         | foundations.typography.type3XSmall          |
  | :host([variant='3xl']) .currency | line-height  | --bbva-amount-3xl-currency-line-height | --lineHeightType3XSmall         | foundations.lineHeight.type3XSmall          |
  | :host([variant='3xl'])           | font-size    | --bbva-amount-3xl-font-size            | --typographyType3XLarge         | foundations.typography.type3XLarge          |
  | :host([variant='3xl'])           | line-height  | --bbva-amount-3xl-line-height          | --lineHeightType3XLarge         | foundations.lineHeight.type3XLarge          |
  | :host([variant='xl']) .currency  | font-size    | --bbva-amount-xl-currency-font-size    | --typographyType3XSmall         | foundations.typography.type3XSmall          |
  | :host([variant='xl']) .currency  | line-height  | --bbva-amount-xl-currency-line-height  | --lineHeightType3XSmall         | foundations.lineHeight.type3XSmall          |
  | :host([variant='xl'])            | font-size    | --bbva-amount-xl-font-size             | --typographyTypeXLarge          | foundations.typography.typeXLarge           |
  | :host([variant='xl'])            | line-height  | --bbva-amount-xl-line-height           | --lineHeightTypeXLarge          | foundations.lineHeight.typeXLarge           |
  | :host([variant='l']) .currency   | font-size    | --bbva-amount-l-currency-font-size     | --typographyType3XSmall         | foundations.typography.type3XSmall          |
  | :host([variant='l']) .currency   | line-height  | --bbva-amount-l-currency-line-height   | --lineHeightType3XSmall         | foundations.lineHeight.type3XSmall          |
  | :host([variant='l'])             | font-size    | --bbva-amount-l-font-size              | --typographyTypeLarge           | foundations.typography.typeLarge            |
  | :host([variant='l'])             | line-height  | --bbva-amount-l-line-height            | --lineHeightTypeLarge           | foundations.lineHeight.typeLarge            |
  | .currency                        | float        | --bbva-amount-currency-float           |                                 | none                                                      |
  | .minus-right                     | float        | --bbva-amount-minus-right-float        |                                 | none                                                      |
  | .minus-left                      | float        | --bbva-amount-minus-left-float         |                                 | none                                                      |
  | :host                            | font-weight  | --bbva-amount-font-weight              | --fontFacePrimaryBookFontWeight | foundations.fontFacePrimary.book.fontWeight |
  > Styling documentation generated by Cells CLI

  @customElement bbva-amount
  @polymer
  @LitElement
  @demo demo/index.html
  @appliesMixin CellsAmountMixin
  */

  class BbvaAmount extends CellsAmountMixin(LitElement) {
    static get is() {
      return 'bbva-amount';
    }

    static get properties() {
      return {
        /**
         * Abbr used to display the given amount.
         * Allowed values are 1, 2, 3, 6 and 9.
         * Values got from (http://www.statman.info/conversions/number_scales.html)
         * Note: 9 is abbreviated as 'B' (Billions) instead of 'G'.
         */
        abbr: {
          type: Number
        },

        /**
         * Chars used as abbreviature depending on the applied scale. Values got from (http://www.statman.info/conversions/number_scales.html)
         */
        abbreviations: {
          type: Object
        },

        /**
         * Number of decimals
         */
        decimalDigits: {
          type: Number,
          attribute: 'decimal-digits'
        },

        /**
         * If true, decimal part of the amount will be hidden regardless of its value.
         */
        decimalsHidden: {
          type: Boolean,
          attribute: 'decimals-hidden'
        },

        /**
         * If true, decimal part of the amount will be hidden if is zero.
         */
        zeroDecimalsHidden: {
          type: Boolean,
          attribute: 'zero-decimals-hidden'
        },

        /**
         * If true, decimal part of the amount will be hidden if there is a trailing zero.
         */
        trailingZeroDecimalsHidden: {
          type: Boolean,
          attribute: 'trailing-zero-decimals-hidden'
        },

        /**
         * If true, amount will show currency code instead of currency symbol
         */
        showCurrencyCode: {
          type: Boolean,
          attribute: 'show-currency-code'
        }
      };
    }

    constructor() {
      super();
      this.decimalDigits = 2;
      this.language = document.documentElement.lang || 'en';
      this.decimalsHidden = false;
      this.zeroDecimalsHidden = false;
      this.trailingZeroDecimalsHidden = false;
      this.hasError = false;
      this.abbreviations = {
        1: 'da',
        2: 'h',
        3: 'k',
        6: 'M',
        // Million
        9: 'B' // Normalized is actually 'G', but this is more understandable

      };
    }

    updated(changedProps) {
      if (changedProps.has('amount')) {
        this._computeHasError(this.amount);

        this._toggleBooleanAttribute('negative', this.negative);
      }
    }

    _computeHasError() {
      const oldError = this.hasError;
      const newError = !this._isValidAmount;

      if (oldError !== newError) {
        this.hasError = newError;

        this._toggleBooleanAttribute('has-error', newError);

        this.dispatchEvent(new CustomEvent('amount-has-error-change', {
          detail: newError,
          bubbles: true,
          composed: true
        }));
      }
    }

    _toggleBooleanAttribute(attr, condition) {
      if (condition) {
        this.setAttribute(attr, '');
      } else {
        this.removeAttribute(attr);
      }
    }
    /**
     * Alias for abbr property
     * @return {Number} Abbreviation value
     */


    get scale() {
      return this.abbr;
    }
    /**
     * Sets new abbreviation value
     * @param  {Number} value New abbreviation value
     */


    set scale(value) {
      this.abbr = value;
    }

    get _isValidAmount() {
      return typeof this.amount === 'number' && Number.isFinite(this.amount);
    }
    /**
     * Returns error state of amount
     * @return {Boolean} Error state
     */


    get hasError() {
      return this._hasError;
    }
    /**
     * Sets error state of amount
     * @param  {Boolean} hasError New error state
     */


    set hasError(hasError) {
      this._hasError = Boolean(hasError);
    }
    /**
     * Return amount to absolute counting with abbreviation
     * @return {Number} Absolute abbreviated amount
     */


    get absAbbrAmount() {
      let formattedAmount = getAbsAmount(this.amount);

      if (this.abbr) {
        formattedAmount /= 10 ** this._safeAbbrValue;
      }

      return formattedAmount;
    }

    get _fraccionalOverFlow() {
      return parseInt(getFractionalAmount(this.absAbbrAmount).toFixed(this.decimalDigits), 10);
    }

    get _integer() {
      const fraccionalOverFlow = this._fraccionalOverFlow;
      return getGroupedIntegerAbsString(this.absAbbrAmount + fraccionalOverFlow, this._groupChar);
    }

    get _groupChar() {
      return getGroupChars(this.language);
    }

    get _separator() {
      return getSeparator(this.language);
    }

    get _fractional() {
      let fractional = parseFloat(getFractionalAmount(this.absAbbrAmount).toFixed(this.decimalDigits)).toString().split('.')[1] || '';

      if (this.trailingZeroDecimalsHidden) {
        return fractional;
      }

      if (fractional.length < this.decimalDigits) {
        fractional = `${fractional}${new Array(this.decimalDigits + 1).join('0')}`;
      }

      return fractional.slice(0, this.decimalDigits);
    }

    get _currency() {
      return getCurrencyAsSymbol(this.localCurrency, this.currencyCode);
    }

    get _alignRight() {
      return isRightAligned(this.currencyCode);
    }

    get _minusAfterSymbol() {
      return hasMinusAfterSymbol(this.localCurrency);
    }

    get _decimalsHidden() {
      if (this.decimalsHidden) {
        return true;
      }

      if (!hasDecimalPart(this.currencyCode)) {
        return true;
      }

      if (this.zeroDecimalsHidden) {
        return !Number(this._fractional);
      }

      return false;
    }

    get _abbreviation() {
      const abbreviation = this.abbreviations[this._safeAbbrValue];
      return this._safeAbbrValue !== 0 && !!abbreviation ? abbreviation : '';
    }

    get _safeAbbrValue() {
      // Convert into an integer if it isn't
      return this.abbr % 1 !== 0 ? 0 : this.abbr;
    }
    /**
     * Accessible amount
     * @return {String} Accessible amount string
     */


    get srAmount() {
      let strAmount = '';

      if (this.negative && !this._minusAfterSymbol) {
        strAmount = '-';
      }

      if (this._currency && !this._alignRight && !this.showCurrencyCode) {
        strAmount += this._currency;
      }

      if (this.negative && this._minusAfterSymbol) {
        strAmount += '-';
      }

      if (this._isValidAmount) {
        strAmount += this._integer;
      }

      if (!this._decimalsHidden && this._fractional) {
        strAmount = strAmount + this._separator + this._fractional;
      }

      if (this._safeAbbrValue) {
        strAmount = `${strAmount} ${this._abbreviation}`;
      }

      if (this._currency && this._alignRight && !this.showCurrencyCode) {
        strAmount = `${strAmount} ${this._currency}`;
      }

      if (this.showCurrencyCode) {
        strAmount = `${strAmount} ${this.currencyCode}`;
      }

      return strAmount;
    }

    static get styles() {
      return [styles$5, getComponentSharedStyles('bbva-amount-shared-styles')];
    }

    render() {
      return html`
      <span class="sr-only">${this.srAmount}</span>
      <span class="amount-wrapper" aria-hidden="true">
        ${this.negative && !this._minusAfterSymbol ? html`
              <span class="minus minus-left">-</span>
            ` : ''}
        ${this._currency && !this._alignRight && !this.showCurrencyCode ? html`
              <span class="currency currency-left">${this._currency}</span>
            ` : ''}
        ${this.negative && this._minusAfterSymbol ? html`
              <span class="minus minus-right">-</span>
            ` : ''}
        ${this._isValidAmount ? html`
              <span class="amount-block">
                <span class="integer">${this._integer}</span>
                ${!this._decimalsHidden && this._fractional ? html`
                      <span class="separator">${this._separator}</span>
                      <span class="fractional">${this._fractional}</span>
                    ` : ''}
                ${this._safeAbbrValue ? html`
                      <span class="abbreviation">&nbsp;${this._abbreviation}</span>
                    ` : ''}
              </span>
            ` : ''}
        ${this._currency && this._alignRight && !this.showCurrencyCode ? html`
              <span class="currency currency-right">${this._currency}</span>
            ` : ''}
        ${this.showCurrencyCode ? html`
              <span class="currency-code">&nbsp;${this.currencyCode}</span>
            ` : ''}
      </span>
    `;
    }

  }
  customElements.define(BbvaAmount.is, BbvaAmount);

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

  class ClassList {
    constructor(element) {
      this.classes = new Set();
      this.changed = false;
      this.element = element;
      const classList = (element.getAttribute('class') || '').split(/\s+/);

      for (const cls of classList) {
        this.classes.add(cls);
      }
    }

    add(cls) {
      this.classes.add(cls);
      this.changed = true;
    }

    remove(cls) {
      this.classes.delete(cls);
      this.changed = true;
    }

    commit() {
      if (this.changed) {
        let classString = '';
        this.classes.forEach(cls => classString += cls + ' ');
        this.element.setAttribute('class', classString);
      }
    }

  }
  /**
   * Stores the ClassInfo object applied to a given AttributePart.
   * Used to unset existing values when a new ClassInfo object is applied.
   */


  const previousClassesCache = new WeakMap();
  /**
   * A directive that applies CSS classes. This must be used in the `class`
   * attribute and must be the only part used in the attribute. It takes each
   * property in the `classInfo` argument and adds the property name to the
   * element's `class` if the property value is truthy; if the property value is
   * falsey, the property name is removed from the element's `class`. For example
   * `{foo: bar}` applies the class `foo` if the value of `bar` is truthy.
   * @param classInfo {ClassInfo}
   */

  const classMap = directive(classInfo => part => {
    if (!(part instanceof AttributePart) || part instanceof PropertyPart || part.committer.name !== 'class' || part.committer.parts.length > 1) {
      throw new Error('The `classMap` directive must be used in the `class` attribute ' + 'and must be the only part in the attribute.');
    }

    const {
      committer
    } = part;
    const {
      element
    } = committer;
    let previousClasses = previousClassesCache.get(part);

    if (previousClasses === undefined) {
      // Write static classes once
      // Use setAttribute() because className isn't a string on SVG elements
      element.setAttribute('class', committer.strings.join(' '));
      previousClassesCache.set(part, previousClasses = new Set());
    }

    const classList = element.classList || new ClassList(element); // Remove old classes that no longer apply
    // We use forEach() instead of for-of so that re don't require down-level
    // iteration.

    previousClasses.forEach(name => {
      if (!(name in classInfo)) {
        classList.remove(name);
        previousClasses.delete(name);
      }
    }); // Add or remove classes based on their classMap value

    for (const name in classInfo) {
      const value = classInfo[name];

      if (value != previousClasses.has(name)) {
        // We explicitly want a loose truthy check of `value` because it seems
        // more convenient that '' and 0 are skipped.
        if (value) {
          classList.add(name);
          previousClasses.add(name);
        } else {
          classList.remove(name);
          previousClasses.delete(name);
        }
      }
    }

    if (typeof classList.commit === 'function') {
      classList.commit();
    }
  });

  var styles$6 = css`:host {
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

  class CellsIcon$2 extends LitElement {
    static get is() {
      return 'cells-icon';
    }

    static get styles() {
      return [styles$6, getComponentSharedStyles('cells-icon-shared-styles')];
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
  customElements.define(CellsIcon$2.is, CellsIcon$2);

  var styles$7 = css`:host {
  display: flex;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
  width: 1em;
  height: 1em;
  border-radius: 100%;
  background: var(--bbva-clip-box-bg-color, var(--colorsPrimaryMediumLight, ${unsafeCSS(colors.primaryMediumLight)}));
  font-size: var(--bbva-clip-box-size, 3rem);
  font-weight: var(--bbva-clip-box-font-weight, var(--fontFacePrimaryBookFontWeight, ${unsafeCSS(fontFacePrimary.book.fontWeight)}));
  color: var(--bbva-clip-box-text-color, var(--colorsPrimaryCoreLightened, ${unsafeCSS(colors.primaryCoreLightened)}));
  transform: scale(1) translateZ(0); }

:host([hidden]),
[hidden] {
  display: none !important; }

*,
*:before,
*:after {
  box-sizing: inherit; }

#content {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%; }

.bitone-layer {
  width: 50%;
  height: 100%;
  position: absolute;
  top: 0;
  right: 0;
  transform-origin: 0 50%;
  transform: rotate(45deg); }
  :host(.bitone[custom]) .bitone-layer {
    background: var(--bbva-clip-box-bg-color2, var(--colorsPrimaryMediumLight, ${unsafeCSS(colors.primaryMediumLight)}));
    opacity: 1;
    mix-blend-mode: normal; }
  :host(.bitone:not([custom])) .bitone-layer {
    background: var(--bbva-clip-box-bg-color, var(--colorsPrimaryMediumLight, ${unsafeCSS(colors.primaryMediumLight)}));
    opacity: 0.3;
    mix-blend-mode: multiply; }

.initials,
.icon {
  position: relative; }

.initials {
  font-size: var(--bbva-clip-box-font-size, var(--typographyType3XSmall, ${unsafeCSS(typography.type3XSmall)})); }

:host([image]) {
  --bbva-clip-box-bg-color: transparent; }

.image {
  width: 100%;
  height: 100%; }
  .image img {
    object-fit: cover;
    object-position: center center; }

:host([size='small']) {
  --bbva-clip-box-size: 2rem; }
  :host([size='small']) .icon {
    --cells-icon-size: var(--bbva-clip-box-s-icon-size, 1rem); }

:host([size='medium']) {
  --bbva-clip-box-size: 2.5rem; }
  :host([size='medium']) .initials {
    --bbva-clip-box-font-size: var(--typographyTypeMedium, ${unsafeCSS(typography.typeMedium)}); }
  :host([size='medium']) .icon {
    --cells-icon-size: var(--bbva-clip-box-m-icon-size, 1.5rem); }

:host([size='large']) {
  --bbva-clip-box-size: 3rem; }
  :host([size='large']) .initials {
    --bbva-clip-box-font-size: var(--typographyTypeLarge, ${unsafeCSS(typography.typeLarge)}); }
  :host([size='large']) .icon {
    --cells-icon-size: var(--bbva-clip-box-l-icon-size, 1.5rem); }

:host([size='extralarge']) {
  --bbva-clip-box-size: 4rem; }
  :host([size='extralarge']) .initials {
    --bbva-clip-box-font-size: var(--typographyType2XLarge, ${unsafeCSS(typography.type2XLarge)}); }
  :host([size='extralarge']) .icon {
    --cells-icon-size: var(--bbva-clip-box-xl-icon-size, 2rem); }

:host([size='xxl']) {
  --bbva-clip-box-size: 4.5rem; }
  :host([size='xxl']) .initials {
    --bbva-clip-box-font-size: var(--typographyType3XLarge, ${unsafeCSS(typography.type3XLarge)}); }
  :host([size='xxl']) .icon {
    --cells-icon-size: var(--bbva-clip-box-xxl-icon-size, 2rem); }
`;

  const randomColors = {
    blue: colors.primaryMediumLight,
    sand: colors.tertiaryType4Medium,
    purple: colors.tertiaryType8Medium,
    aqua: colors.primaryVariantDark
  };

  const hashCode = s => s.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
  /**
  A circular resource component used for initial clips, photos, or icons.

  Example:
  Initials

  Custom size & random background

  ```html
  <bbva-clip-box class="bitone" text="kjagj" size="small"> </bbva-clip-box>
  ```

  Custom size & custom background

  ```html
  <bbva-clip-box class="bitone" text="bbva" size="xxl" bg-color="#F78BE8" bg-color2="#6500a4" custom>
  </bbva-clip-box>
  ```

  Icon

  ```html
  <bbva-clip-box
    bg-color="#F78BE8"
    icon-color="#6500a4"
    class="bitone"
    size="large"
    icon="coronita:myprofile"
  ></bbva-clip-box>
  ```

  Image

  ```html
  <bbva-clip-box size="small" image="images/bbva.png"> </bbva-clip-box>
  ```

  Solid background

  ```html
  <bbva-clip-box bg-color="#6500a4" size="large" icon="coronita:myprofile"></bbva-clip-box>
  ```

  ## Random Colors

  In the case of the initials, the color of the background should be assigned to the wording of the colors that pass accessibility, and if it is a contact in the agenda, the same color should always be kept for that person.
  These are the 5 colors available:
    * foundations.colors.primaryMediumLight  -> blue
    * foundations.colors.tertiaryType4Medium  -> sand
    * foundations.colors.tertiaryType8Medium  -> purple
    * foundations.colors.primaryVariantDark  -> aqua

  ## Icons

  Since this component uses icons, it will need an [iconset](https://platform.bbva.com/en-us/developers/engines/cells/documentation/cells-architecture/composing-with-components/cells-icons) in your project as an application level dependency. In fact, this component uses an iconset in its demo.

  ## Styling

  The following custom properties are available for styling:

  ### Custom properties

  | Selector                                   | CSS Property              | CSS Variable                  | Theme Variable                  | Foundations/Fallback                                      |
  | ------------------------------------------ | ------------------------- | ----------------------------- | ------------------------------- | --------------------------------------------------------- |
  | :host([size='xxl']) .icon                  | --cells-icon-size         | --bbva-clip-box-xxl-icon-size |                                 | 2rem                                                      |
  | :host([size='xxl']) .initials              | --bbva-clip-box-font-size |                               | --typographyType3XLarge         | foundations.typography.type3XLarge          |
  | :host([size='extralarge']) .icon           | --cells-icon-size         | --bbva-clip-box-xl-icon-size  |                                 | 2rem                                                      |
  | :host([size='extralarge']) .initials       | --bbva-clip-box-font-size |                               | --typographyType2XLarge         | foundations.typography.type2XLarge          |
  | :host([size='large']) .icon                | --cells-icon-size         | --bbva-clip-box-l-icon-size   |                                 | 1.5rem                                                    |
  | :host([size='large']) .initials            | --bbva-clip-box-font-size |                               | --typographyTypeLarge           | foundations.typography.typeLarge            |
  | :host([size='medium']) .icon               | --cells-icon-size         | --bbva-clip-box-m-icon-size   |                                 | 1.5rem                                                    |
  | :host([size='medium']) .initials           | --bbva-clip-box-font-size |                               | --typographyTypeMedium          | foundations.typography.typeMedium           |
  | :host([size='small']) .icon                | --cells-icon-size         | --bbva-clip-box-s-icon-size   |                                 | 1rem                                                      |
  | .initials                                  | font-size                 | --bbva-clip-box-font-size     | --typographyType3XSmall         | foundations.typography.type3XSmall          |
  | :host(.bitone:not([custom])) .bitone-layer | background                | --bbva-clip-box-bg-color      | --colorsPrimaryMediumLight      | foundations.colors.primaryMediumLight       |
  | :host(.bitone[custom]) .bitone-layer       | background                | --bbva-clip-box-bg-color2     | --colorsPrimaryMediumLight      | foundations.colors.primaryMediumLight       |
  | :host                                      | background                | --bbva-clip-box-bg-color      | --colorsPrimaryMediumLight      | foundations.colors.primaryMediumLight       |
  | :host                                      | font-size                 | --bbva-clip-box-size          |                                 | 3rem                                                      |
  | :host                                      | font-weight               | --bbva-clip-box-font-weight   | --fontFacePrimaryBookFontWeight | foundations.fontFacePrimary.book.fontWeight |
  | :host                                      | color                     | --bbva-clip-box-text-color    | --colorsPrimaryCoreLightened    | foundations.colors.primaryCoreLightened     |
  > Styling documentation generated by Cells CLI

  @customElement bbva-clip-box
  @polymer
  @LitElement
  @demo demo/index.html
  @appliesMixin CellsI18nMixin
  */


  class BbvaClipBox extends CellsI18nMixin(LitElement) {
    static get is() {
      return 'bbva-clip-box';
    }

    static get properties() {
      return {
        /**
         * Custom left background color
         * @default foundations.colors.primaryMediumLight
         */
        bgColor: {
          type: String,
          attribute: 'bg-color'
        },

        /**
         * Background secondary (right) color
         * @default foundations.colors.primaryMediumLight
         */
        bgColor2: {
          type: String,
          attribute: 'bg-color2'
        },

        /**
         * Accessibility Text
         */
        accessibilityText: {
          type: String,
          attribute: 'accessibility-text'
        },

        /**
         * Icon showed
         */
        icon: {
          type: String
        },

        /**
         * color icon showed (default = white)
         */
        iconColor: {
          type: String,
          attribute: 'icon-color'
        },

        /**
         * Text
         */
        text: {
          type: String
        },

        /**
         * Size
         * @default small
         */
        size: {
          type: String,
          reflect: true
        },

        /**
         * Image source
         */
        image: {
          type: String
        },

        /**
         * Custom background color for initials
         */
        custom: {
          type: Boolean
        },

        /**
         * Number of initials showed in text case
         * @default 2
         */
        maxSizeInitials: {
          type: Number,
          attribute: 'max-size-initials'
        },

        /**
         * Number of initials showed in custom text case
         * @default 3
         */
        customMaxSizeInitials: {
          type: Number,
          attribute: 'custom-max-size-initials'
        }
      };
    }

    constructor() {
      super();
      this.bgColor = '';
      this.bgColor2 = '';
      this.accessibilityText = '';
      this.icon = '';
      this.iconColor = '';
      this.text = '';
      this.image = '';
      this.custom = false;
      this.size = 'small';
      this.maxSizeInitials = 2;
      this.customMaxSizeInitials = 3;
    }

    static get styles() {
      return [styles$7, getComponentSharedStyles('bbva-clip-box-shared-styles')];
    }

    updated(changedProps) {
      if (changedProps.has('custom') || changedProps.has('bgColor') || changedProps.has('text') || changedProps.has('bgColor2') || changedProps.has('iconColor')) {
        this._updateBgColor(this._initialsTransform, this.bgColor, this.bgColor2);
      }
    }

    static isDefaultColor(color) {
      const colors = Object.keys(randomColors);
      return colors.includes(color);
    }

    _updateBgColor(initialsFormat) {
      if (!this._hasIconImage && this.bgColor === '') {
        // Only with initials
        if (initialsFormat && !this.custom) {
          // Random default color
          const colors = Object.keys(randomColors);
          const index = hashCode(initialsFormat) % colors.length;

          this._setBgColor(randomColors[colors[index]]);
        }
      }

      if (!this.text && this.icon && this.iconColor) {
        this._setIconColor(this.iconColor);
      }

      if (this.bgColor !== '') {
        // bgColor setted
        if (BbvaClipBox.isDefaultColor(this.bgColor)) {
          this._setBgColor(randomColors[this.bgColor]);
        } else {
          this._setBgColor(this.bgColor);
        }
      }

      if (this.custom && this.bgColor2 !== '') {
        // bgColor & bgColor2 customized
        if (BbvaClipBox.isDefaultColor(this.bgColor2)) {
          this._setBgColor(randomColors[this.bgColor2]);
        } else {
          this._setBgColor2(this.bgColor2);
        }
      }
    }

    get _hasIconImage() {
      return this.icon || this.image;
    }

    get _computedIsAriaHidden() {
      return String(Boolean(this.image && this.accessibilityText));
    }

    get _initialsTransform() {
      if (this.text) {
        if (this.custom) {
          this.maxSizeInitials = this.customMaxSizeInitials;
        }

        return this.text.substr(0, this.maxSizeInitials).toUpperCase();
      }

      return '';
    }

    get _computedRole() {
      return this.image ? 'image' : undefined;
    }

    _setBgColor(color) {
      this.style.setProperty('--bbva-clip-box-bg-color', color);
    }

    _setBgColor2(color2) {
      this.style.setProperty('--bbva-clip-box-bg-color2', color2);
    }

    _setIconColor(color) {
      this.style.color = color;
    }

    render() {
      return html`
      <div id="content">
        <div class="bitone-layer"></div>
        ${this.text || !this._hasIconImage ? html`
              <p class="initials" id="initials" aria-label="${this.t(this.text)}">
                ${this._initialsTransform}
              </p>
            ` : ''}
        <cells-icon
          aria-hidden="${this._computedIsAriaHidden ? 'true' : 'false'}"
          aria-label="${this.t(this.accessibilityText)}"
          class="${classMap({
      image: this.image,
      icon: this.icon
    })}"
          id="icon"
          .icon="${this.icon}"
          .src="${this.image}"
          role="${ifDefined(this._computedRole)}"
          ?hidden="${!this._hasIconImage}"
        >
        </cells-icon>
      </div>
    `;
    }

  }

  customElements.define(BbvaClipBox.is, BbvaClipBox);

  var styles$8 = css`:host {
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

  class CellsIcon$3 extends LitElement {
    static get is() {
      return 'cells-icon';
    }

    static get styles() {
      return [styles$8, getComponentSharedStyles('cells-icon-shared-styles')];
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
  customElements.define(CellsIcon$3.is, CellsIcon$3);

  /**
  @license
  Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
  This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
  The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
  The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
  Code distributed by Google as part of the polymer project is also
  subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
  */
  let ABS_URL$1 = /(^\/)|(^#)|(^[\w-\d]*:)/;
  let workingURL$1;
  let resolveDoc$1;
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

  function resolveUrl$1(url, baseURI) {
    if (url && ABS_URL$1.test(url)) {
      return url;
    } // Lazy feature detection.


    if (workingURL$1 === undefined) {
      workingURL$1 = false;

      try {
        const u = new URL('b', 'http://a');
        u.pathname = 'c%20d';
        workingURL$1 = u.href === 'http://a/c%20d';
      } catch (e) {// silently fail
      }
    }

    if (!baseURI) {
      baseURI = document.baseURI || window.location.href;
    }

    if (workingURL$1) {
      return new URL(url, baseURI).href;
    } // Fallback to creating an anchor into a disconnected document.


    if (!resolveDoc$1) {
      resolveDoc$1 = document.implementation.createHTMLDocument('temp');
      resolveDoc$1.base = resolveDoc$1.createElement('base');
      resolveDoc$1.head.appendChild(resolveDoc$1.base);
      resolveDoc$1.anchor = resolveDoc$1.createElement('a');
      resolveDoc$1.body.appendChild(resolveDoc$1.anchor);
    }

    resolveDoc$1.base.href = baseURI;
    resolveDoc$1.anchor.href = url;
    return resolveDoc$1.anchor.href || url;
  }
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
  Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
  This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
  The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
  The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
  Code distributed by Google as part of the polymer project is also
  subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
  */
  /**
  `cells-image` is an element for displaying an image that provides useful sizing and
  preloading options not found on the standard `<img>` tag.

  The `sizing` option allows the image to be either cropped (`cover`) or
  letterboxed (`contain`) to fill a fixed user-size placed on the element.

  The `preload` option prevents the browser from rendering the image until the
  image is fully loaded.  In the interim, either the element's CSS `background-color`
  can be be used as the placeholder, or the `placeholder` property can be
  set to a URL (preferably a data-URI, for instant rendering) for an
  placeholder image.

  The `fade` option (only valid when `preload` is set) will cause the placeholder
  image/color to be faded out once the image is rendered.

  Examples:

    Basically identical to `<img src="...">` tag:

      <cells-image src="http://lorempixel.com/400/400"></cells-image>

    Will letterbox the image to fit:

      <cells-image style="width:400px; height:400px;" sizing="contain"
        src="http://lorempixel.com/600/400"></cells-image>

    Will crop the image to fit:

      <cells-image style="width:400px; height:400px;" sizing="cover"
        src="http://lorempixel.com/600/400"></cells-image>

    Will show light-gray background until the image loads:

      <cells-image style="width:400px; height:400px; background-color: lightgray;"
        sizing="cover" preload src="http://lorempixel.com/600/400"></cells-image>

    Will show a base-64 encoded placeholder image until the image loads:

      <cells-image style="width:400px; height:400px;" placeholder="data:image/gif;base64,..."
        sizing="cover" preload src="http://lorempixel.com/600/400"></cells-image>

    Will fade the light-gray background out once the image is loaded:

      <cells-image style="width:400px; height:400px; background-color: lightgray;"
        sizing="cover" preload fade src="http://lorempixel.com/600/400"></cells-image>

  Custom property | Description | Default
  ----------------|-------------|----------
  `--cells-image-placeholder` | Mixin applied to #placeholder | `{}`
  `--cells-image-width` | Sets the width of the wrapped image | `auto`
  `--cells-image-height` | Sets the height of the wrapped image | `auto`

  * @customElement
  * @demo demo/index.html
  * @extends {LitElement}
  */

  class CellsImage extends LitElement {
    static get is() {
      return 'cells-image';
    }

    static get properties() {
      return {
        /**
         * The URL of an image.
         */
        src: {
          type: String
        },

        /**
         * A short text alternative for the image.
         */
        alt: {
          type: String
        },

        /**
         * CORS enabled images support:
         * https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_enabled_image
         */
        crossorigin: {
          type: String
        },

        /**
         * When true, the image is prevented from loading and any placeholder is
         * shown.  This may be useful when a binding to the src property is known to
         * be invalid, to prevent 404 requests.
         */
        preventLoad: {
          type: Boolean,
          attribute: 'prevent-load'
        },

        /**
         * Sets a sizing option for the image.  Valid values are `contain` (full
         * aspect ratio of the image is contained within the element and
         * letterboxed) or `cover` (image is cropped in order to fully cover the
         * bounds of the element), or `null` (default: image takes natural size).
         */
        sizing: {
          type: String,
          reflect: true
        },

        /**
         * When a sizing option is used (`cover` or `contain`), this determines
         * how the image is aligned within the element bounds.
         */
        position: {
          type: String
        },

        /**
         * When `true`, any change to the `src` property will cause the
         * `placeholder` image to be shown until the new image has loaded.
         */
        preload: {
          type: Boolean
        },

        /**
         * This image will be used as a background/placeholder until the src image
         * has loaded.  Use of a data-URI for placeholder is encouraged for instant
         * rendering.
         */
        placeholder: {
          type: String
        },

        /**
         * When `preload` is true, setting `fade` to true will cause the image to
         * fade into place.
         */
        fade: {
          type: Boolean
        },

        /**
         * Can be used to set the width of image (e.g. via binding); size may also
         * be set via CSS.
         */
        width: {
          type: Number
        },

        /**
         * Can be used to set the height of image (e.g. via binding); size may also
         * be set via CSS.
         */
        height: {
          type: Number
        },
        _loaded: {
          type: Boolean
        },
        _loading: {
          type: Boolean
        },
        _error: {
          type: Boolean
        }
      };
    }

    constructor() {
      super();
      this.src = '';
      this.preventLoad = false;
      this.position = 'center';
      this.preload = false;
      this.placeholder = null;
      this.fade = false;
      this._loaded = false;
      this._loading = false;
      this._error = false;
      this.width = null;
      this.height = null;
      this._resolvedSrc = '';
    }

    updated(changedProps) {
      if (changedProps.has('placeholder')) {
        this._placeholderChanged();
      }

      if (changedProps.has('width')) {
        this._widthChanged();
      }

      if (changedProps.has('height')) {
        this._heightChanged();
      }

      if (changedProps.has('sizing') || changedProps.has('position')) {
        this._transformChanged();
      }

      if (changedProps.has('src') || changedProps.has('preventLoad')) {
        this._loadStateObserver(this.src, this.preventLoad);
      }
    }

    render() {
      return html`
      <style>
        :host {
          display: inline-block;
          overflow: hidden;
          position: relative;
        }

        #baseURIAnchor {
          display: none;
        }

        #sizedImgDiv {
          position: absolute;
          top: 0px;
          right: 0px;
          bottom: 0px;
          left: 0px;
          display: none;
        }

        #img {
          display: block;
          width: var(--cells-image-width, auto);
          height: var(--cells-image-height, auto);
        }

        :host([sizing]) #sizedImgDiv {
          display: block;
        }

        :host([sizing]) #img {
          display: none;
        }

        #placeholder {
          position: absolute;
          top: 0px;
          right: 0px;
          bottom: 0px;
          left: 0px;
          background-color: inherit;
          opacity: 1;

        }

        #placeholder.faded-out {
          transition: opacity 0.5s linear;
          opacity: 0;
        }
      </style>

      <a id="baseURIAnchor" href="#"></a>
      <div id="sizedImgDiv" role="img"
        ?hidden="${this._computeImgDivHidden(this.sizing)}"
        aria-hidden="${ifDefined(this._computeImgDivARIAHidden(this.alt))}"
        aria-label="${ifDefined(this._computeImgDivARIALabel(this.alt, this.src))}">
      </div>
      <img id="img"
        alt="${ifDefined(this.alt)}"
        ?hidden="${this._computeImgHidden(this.sizing)}"
        crossorigin="${ifDefined(this.crossorigin)}"
        @load="${this._imgOnLoad}"
        @error="${this._imgOnError}">
      <div id="placeholder"
        ?hidden="${this._computePlaceholderHidden(this.preload, this.fade, this._loading, this._loaded)}"
        class="${this._computePlaceholderClassName(this.preload, this.fade, this._loading, this._loaded)}">
      </div>
    `;
    }
    /**
     * Read-only value that is true when the image is loaded.
     */


    get loaded() {
      return this._loaded;
    }
    /**
     * Read-only value that tracks the loading state of the image when the `preload` option is used.
     */


    get loading() {
      return this._loading;
    }
    /**
     * Read-only value that indicates that the last set `src` failed to load.
     */


    get error() {
      return this._error;
    }

    _setLoaded(value) {
      const oldValue = this._loaded;

      if (oldValue !== value) {
        this._loaded = value;
        /**
         * Fired when loaded value changes
         * @event loaded-changed
         */

        this.dispatchEvent(new CustomEvent('loaded-changed', {
          detail: {
            value: this._loaded
          }
        }));
      }
    }

    _setLoading(value) {
      const oldValue = this._loading;

      if (oldValue !== value) {
        this._loading = value;
        /**
         * Fired when loading value changes
         * @event loading-changed
         */

        this.dispatchEvent(new CustomEvent('loading-changed', {
          detail: {
            value: this._loading
          }
        }));
      }
    }
    /**
     * Fired when error value changes
     * @event error-changed
     */


    _setError(value) {
      const oldValue = this._error;

      if (oldValue !== value) {
        this._error = value;
        this.dispatchEvent(new CustomEvent('error-changed', {
          detail: {
            value: this._error
          }
        }));
      }
    }

    _imgOnLoad() {
      if (this.shadowRoot.querySelector('#img').src !== this._resolveSrc(this.src)) {
        return;
      }

      this._setLoading(false);

      this._setLoaded(true);

      this._setError(false);
    }

    _imgOnError() {
      if (this.shadowRoot.querySelector('#img').src !== this._resolveSrc(this.src)) {
        return;
      }

      this.shadowRoot.querySelector('#img').removeAttribute('src');
      this.shadowRoot.querySelector('#sizedImgDiv').style.backgroundImage = '';

      this._setLoading(false);

      this._setLoaded(false);

      this._setError(true);
    }

    _computePlaceholderHidden() {
      return !this.preload || !this.fade && !this.loading && this.loaded;
    }

    _computePlaceholderClassName() {
      return this.preload && this.fade && !this.loading && this.loaded ? 'faded-out' : '';
    }

    _computeImgDivHidden() {
      return !this.sizing;
    }

    _computeImgDivARIAHidden() {
      return this.alt === '' ? 'true' : undefined;
    }

    _computeImgDivARIALabel() {
      if (this.alt !== null && this.alt !== undefined) {
        return this.alt;
      } // Polymer.ResolveUrl.resolveUrl will resolve '' relative to a URL x to that URL x, but '' is the default for src.


      if (this.src === '') {
        return '';
      } // NOTE: Use of `URL` was removed here because IE11 doesn't support constructing it. If this ends up being problematic, we should consider reverting and adding the URL polyfill as a dev dependency.


      let resolved = this._resolveSrc(this.src); // Remove query parts, get file name.


      return resolved ? resolved.replace(/[?|#].*/g, '').split('/').pop() : '';
    }

    _computeImgHidden() {
      return !!this.sizing;
    }

    _widthChanged() {
      this.style.width = isNaN(this.width) ? this.width : this.width + 'px';
    }

    _heightChanged() {
      this.style.height = isNaN(this.height) ? this.height : this.height + 'px';
    }

    _loadStateObserver(src, preventLoad) {
      var newResolvedSrc = this._resolveSrc(src);

      if (newResolvedSrc === this._resolvedSrc) {
        return;
      }

      this._resolvedSrc = '';
      this.shadowRoot.querySelector('#img').removeAttribute('src');
      this.shadowRoot.querySelector('#sizedImgDiv').style.backgroundImage = '';

      if (src === '' || preventLoad) {
        this._setLoading(false);

        this._setLoaded(false);

        this._setError(false);
      } else {
        this._resolvedSrc = newResolvedSrc;
        this.shadowRoot.querySelector('#img').src = this._resolvedSrc;
        this.shadowRoot.querySelector('#sizedImgDiv').style.backgroundImage = 'url("' + this._resolvedSrc + '")';

        this._setLoading(true);

        this._setLoaded(false);

        this._setError(false);
      }
    }

    _placeholderChanged() {
      this.shadowRoot.querySelector('#placeholder').style.backgroundImage = this.placeholder ? 'url("' + this.placeholder + '")' : '';
    }

    _transformChanged() {
      var sizedImgDivStyle = this.shadowRoot.querySelector('#sizedImgDiv').style;
      var placeholderStyle = this.shadowRoot.querySelector('#placeholder').style;
      sizedImgDivStyle.backgroundSize = placeholderStyle.backgroundSize = this.sizing;
      sizedImgDivStyle.backgroundPosition = placeholderStyle.backgroundPosition = this.sizing ? this.position : '';
      sizedImgDivStyle.backgroundRepeat = placeholderStyle.backgroundRepeat = this.sizing ? 'no-repeat' : '';
    }

    _resolveSrc(testSrc) {
      const link = this.shadowRoot.querySelector('#baseURIAnchor');

      if (!link) {
        return;
      }

      let resolved = resolveUrl$1(testSrc, link.href); // NOTE: Use of `URL` was removed here because IE11 doesn't support constructing it. If this ends up being problematic, we should consider reverting and adding the URL polyfill as a dev dependency.

      if (resolved[0] === '/') {
        // In IE location.origin might not work
        // https://connect.microsoft.com/IE/feedback/details/1763802/location-origin-is-undefined-in-ie-11-on-windows-10-but-works-on-windows-7
        resolved = (location.origin || location.protocol + '//' + location.host) + resolved;
      }

      return resolved;
    }

  }

  customElements.define(CellsImage.is, CellsImage);

  const bankia = svg`
<svg viewBox="0 0 40 40" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <g id="CAHMESMMXXX" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <path d="M20,0.000133333333 C31.0453333,0.000133333333 40,8.9548 40,20.0001333 C40,31.0454667 31.0453333,40.0001333 20,40.0001333 C8.95466667,40.0001333 0,31.0454667 0,20.0001333 C0,8.9548 8.95466667,0.000133333333 20,0.000133333333" id="forma1" fill="#BFD437"></path>
        <path d="M19.692,27.5385333 C18,27.5385333 16.308,27.0772 15.0773333,26.4612 L15.0773333,12.9238667 C16,12.6158667 16.9226667,12.4612 17.692,12.4612 C20.308,12.4612 21.3853333,13.9998667 21.3853333,15.5385333 C21.3853333,16.7692 20.6146667,18.3078667 18.9226667,19.5385333 C23.0773333,19.8452 24.6146667,21.2305333 24.6146667,23.6918667 C24.7693333,25.9998667 23.0773333,27.5385333 19.692,27.5385333 M23.692,17.8452 C24.6146667,16.9238667 24.9226667,15.9998667 24.9226667,14.7692 C24.9226667,11.6918667 22.308,9.53853333 17.692,9.53853333 C15.8466667,9.53853333 13.3853333,9.8452 11.5386667,10.4612 L11.5386667,30.3078667 L14.308,29.2305333 C15.8466667,29.9998667 18,30.4612 20,30.4612 C25.5386667,30.4612 28.4613333,27.8452 28.4613333,23.8452 C28.4613333,20.7692 26.7693333,18.4612 23.692,17.8452" id="forma2" fill="#412613"></path>
    </g>
</svg>
`; // bankinter

  const bankinter = svg`
  <svg viewBox="0 0 40 40" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <g id="BKBKESMMXXX" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
          <path d="M20,0.000133333333 C31.0453333,0.000133333333 40,8.9548 40,20.0001333 C40,31.0454667 31.0453333,40.0001333 20,40.0001333 C8.95466667,40.0001333 0,31.0454667 0,20.0001333 C0,8.9548 8.95466667,0.000133333333 20,0.000133333333" id="forma1" fill="#F76A00"></path>
          <path d="M30.7693333,26.3066667 L33.076,26.3066667 L33.076,24 L30.7693333,24 L30.7693333,26.3066667 Z M12,24.7693333 C9.53866667,24.7693333 9.23066667,24.4613333 9.23066667,21.692 C9.23066667,19.3853333 10,19.0773333 11.8466667,19.0773333 C13.692,19.0773333 14.6146667,19.3853333 14.6146667,21.692 C14.6146667,24.308 14.1533333,24.7693333 12,24.7693333 L12,24.7693333 Z M12,26.4613333 C15.3853333,26.4613333 17.0773333,25.5386667 17.0773333,21.8453333 C17.0773333,18.616 15.8466667,17.0773333 12.4613333,17.0773333 C10.9226667,17.0773333 10,17.2306667 9.23066667,17.8453333 L9.23066667,13.3853333 L6.92266667,13.3853333 L6.92266667,22 C6.92266667,25.3853333 8.46133333,26.4613333 12,26.4613333 L12,26.4613333 Z M21.3853333,22.616 L21.3853333,26.308 L19.0773333,26.308 L19.0773333,13.5386667 L21.3853333,13.5386667 L21.3853333,20.616 L21.8466667,20.616 L22,20.616 C22.4613333,20.616 23.0773333,20.308 23.3853333,20 L26.1533333,17.2306667 L28.9226667,17.2306667 L24.6146667,21.5386667 L29.0773333,26.308 L26,26.308 L23.0773333,23.2306667 C22.7693333,22.9226667 22.4613333,22.616 22,22.616 L21.692,22.616 L21.3853333,22.616 Z" id="forma2" fill="#FFFFFF"></path>
      </g>
  </svg>
`; // bbva

  const bbva = svg`
<svg viewBox="0 0 40 40" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <g id="BBVAESMMXXX" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <path d="M40,20 C40,31.0453333 31.0453333,40 20,40 C8.95466667,40 0,31.0453333 0,20 C0,8.95466667 8.95466667,0 20,0 C31.0453333,0 40,8.95466667 40,20" id="forma1" fill="#004284"></path>
        <path d="M19.9997333,0.000133333333 C8.9544,0.000133333333 -0.000266666667,8.9548 -0.000266666667,20.0001333 C-0.000266666667,25.8828 2.55573333,31.1548 6.5984,34.8148 L11.3770667,25.8094667 L24.7290667,0.585466667 C23.2104,0.217466667 21.6317333,0.000133333333 19.9997333,0.000133333333" id="forma2" fill="#0074BC"></path>
        <path d="M13.1325333,29.7964 L19.7045333,17.2870667 C19.8472,17.0164 20.2512,17.0164 20.3938667,17.2870667 L26.9712,29.7964 C27.0378667,29.9217333 27.1672,30.0004 27.3085333,30.0004 L30.4872,30.0004 C30.7032,30.0004 30.8405333,29.7697333 30.7392,29.5790667 L20.3845333,10.2004 C20.2418667,9.93373333 19.8565333,9.93373333 19.7138667,10.2004 L9.3592,29.5790667 C9.25786667,29.7697333 9.3952,29.9990667 9.6112,29.9990667 L12.7952,29.9990667 C12.9365333,29.9990667 13.0658667,29.9217333 13.1325333,29.7964" id="forma3" fill="#FFFFFF"></path>
    </g>
</svg>
`; // caixa

  const caixa = svg`
<svg viewBox="0 0 40 40" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <g id="CAIXESBBXXX" fill="none">
        <circle id="forma1" fill="#333333" fill-rule="nonzero" cx="20" cy="20" r="20"></circle>
        <path d="M14.6666667,20.7733333 C14.8266667,20.9333333 14.8266667,21.24 14.9733333,21.3866667 L15.1333333,22 L14.6666667,22.6666667 C14.1134478,23.0506989 13.3798856,23.0506989 12.8266667,22.6666667 C12.5704758,22.3693461 12.4582896,21.9742554 12.52,21.5866667 L12.68,20.9733333 C12.84,20.8133333 12.9866667,20.8133333 12.9866667,20.6666667 C13.2758099,20.5394804 13.5915607,20.4845672 13.9066667,20.5066667 C14.2133333,20.6666667 14.68,20.5066667 14.68,20.8133333" id="forma2" fill="#EFC03D" fill-rule="nonzero"></path>
        <path d="M13.2266667,24.3066667 C13.3866667,24.3066667 13.5333333,24.4666667 13.6933333,24.4666667 C13.8533333,24.4666667 13.8533333,24.7733333 14.16,24.9333333 C14.340587,25.3322557 14.4964375,25.7419198 14.6266667,26.16 C14.6266667,26.4666667 14.7866667,26.4666667 14.6266667,26.7733333 L14.6266667,26.7733333 C14.6476695,26.990276 14.5909685,27.2076295 14.4666667,27.3866667 C14.4583689,27.7669508 14.3527908,28.1387695 14.16,28.4666667 C14,28.4666667 14,28.7733333 13.8533333,28.7733333 C13.7066667,28.7733333 13.5466667,29.3866667 13.08,29.24 C12.7733333,29.4 12.4666667,29.24 12.16,29.4 C12,29.24 11.6933333,29.4 11.6933333,29.24 C11.375001,29.1263789 11.1031316,28.9107583 10.92,28.6266667 C10.7471217,28.4654621 10.6543835,28.2360571 10.6666667,28 C10.8266667,27.6933333 10.5066667,27.3866667 10.6666667,27.2266667 L10.6666667,26.76 L10.8266667,25.9866667 C11.1333333,25.8266667 10.9866667,25.3733333 11.2933333,25.3733333 C11.4533333,24.9066667 11.9066667,24.76 12.3733333,24.6 C12.5452665,24.6217495 12.7175821,24.5626699 12.84,24.44 C13,24.28 13.1466667,24.44 13.3066667,24.28" id="forma3" fill="#D9453B" fill-rule="nonzero"></path>
        <path d="M29.08,10.92 C29.08,12.2533333 27.8533333,13.2266667 27.24,14.3066667 C26.9333333,14.92 26.32,15.3866667 26.0133333,16 C25.6108719,16.3694525 25.2488366,16.7806531 24.9333333,17.2266667 C24.9333333,17.5333333 25.4,17.6933333 25.5466667,17.84 C26.0133333,18.1466667 26.0133333,18.6133333 26.4666667,18.92 C26.6266667,18.92 26.6266667,19.2266667 26.9333333,19.2266667 C27.4,19.84 27.8533333,20.3066667 28.2666667,20.92 C28.3047442,21.1506773 28.411638,21.3644649 28.5733333,21.5333333 C28.88,22 29.1866667,22.6133333 29.4933333,23.0666667 C29.4933333,23.68 29.96,23.9866667 30.1066667,24.6 L30.5733333,25.52 C30.8159033,26.2143247 31.1239569,26.8840063 31.4933333,27.52 C31.5150829,27.6919331 31.4560032,27.8642488 31.3333333,27.9866667 C31.1733333,28.1466667 31.0266667,27.8266667 30.8666667,27.9866667 C30.0933333,27.68 29.3333333,27.2133333 28.56,26.9066667 C27.7866667,26.2933333 27.0266667,25.8266667 26.2533333,25.2133333 C25.9466667,25.2133333 25.7866667,24.7466667 25.64,24.6 C24.8666667,24.1333333 24.4133333,23.52 23.64,23.0666667 C23.3333333,22.76 23.0266667,22.6 22.72,22.2933333 C22.4133333,22.2933333 22.4133333,21.9866667 22.1066667,21.8266667 C21.5708385,21.5031047 21.0584601,21.1422121 20.5733333,20.7466667 L20.5733333,21.0533333 C20.2666667,21.36 20.2666667,21.9733333 20.1066667,22.3866667 C19.9466667,22.8 19.64,23.3066667 19.4933333,23.92 C19.0266667,24.6933333 18.5733333,25.6133333 18.16,26.3866667 C17.7466667,27.16 17.24,28.2266667 16.32,28.8533333 C16.16,29.16 15.8533333,29.16 15.7066667,29.32 C15.56,29.48 15.4,29.32 15.4,29.16 C15.4,29 15.4,28.6933333 15.24,28.3866667 C15.4,28.08 15.24,27.7733333 15.4,27.4666667 L15.4,27.3066667 C15.4,26.84 15.56,26.5333333 15.56,26.08 C15.6871863,25.7908567 15.7420995,25.475106 15.72,25.16 C15.8929233,24.7969901 15.9882845,24.4019221 16,24 C16.1301999,23.7642929 16.1859805,23.494687 16.16,23.2266667 C16.32,22.92 16.32,22.6133333 16.4666667,22.4533333 L16.4666667,22 C16.7931723,21.2558874 17.0519956,20.4838799 17.24,19.6933333 L17.08,19.5333333 C16.5181776,19.610275 15.9484891,19.610275 15.3866667,19.5333333 C14.4904588,19.5101607 13.5980728,19.4075363 12.72,19.2266667 C12.352818,19.2483885 11.9851126,19.1939136 11.64,19.0666667 L11.08,19.0666667 C10.6133333,18.9066667 10.16,18.9066667 9.85333333,18.76 C9.54666667,18.6133333 9.33333333,18.6666667 9.08,18.6666667 C8.83988835,18.6616891 8.61471574,18.5491028 8.46666667,18.36 L8.46666667,18.2 C9.02139705,17.6630193 9.713407,17.2893339 10.4666667,17.12 C11.1717247,16.9313374 11.8969583,16.8283721 12.6266667,16.8133333 L13.96,16.8133333 C14.7333333,16.8133333 15.6533333,16.9733333 16.4266667,16.9733333 C16.7333333,16.9733333 16.8933333,17.1333333 17.2,17.1333333 L17.2,16.9733333 L16.4266667,15.8933333 C16.12,15.28 15.6533333,14.6666667 15.3466667,13.8933333 C15.1866667,13.7333333 15.3466667,13.4266667 15.1866667,13.12 C15.0266667,12.8133333 15.1866667,12.96 15.3466667,12.8133333 L15.8133333,12.8133333 L17.1466667,13.28 C17.6868503,13.4755647 18.2016358,13.7351956 18.68,14.0533333 C19.2933333,14.52 19.9066667,14.6666667 20.3733333,15.28 C20.4957512,15.4026699 20.6680669,15.4617495 20.84,15.44 C21,15.44 21,15.28 21.1466667,15.1333333 C21.7921955,14.831231 22.4081884,14.4696699 22.9866667,14.0533333 C23.2933333,13.7466667 23.6,13.7466667 23.76,13.44 C23.92,13.1333333 24.0666667,13.28 24.3733333,13.1333333 C24.7060675,12.8394606 25.067945,12.5803384 25.4533333,12.36 C25.6133333,12.36 25.76,12.2 25.92,12.0533333 L27.76,11.1333333 C27.92,10.8266667 28.2266667,10.8266667 28.5333333,10.8266667 C28.7052665,10.8049171 28.8775821,10.8639968 29,10.9866667" id="forma4" fill="#4C9AD7" fill-rule="nonzero"></path>
    </g>
</svg>
`; // kutxa

  const kutxa = svg`
<svg viewBox="0 0 40 40" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <g id="BASKES2BXXX" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <path d="M20,-0.000266666667 C31.0453333,-0.000266666667 40,8.9544 40,19.9997333 C40,31.0450667 31.0453333,39.9997333 20,39.9997333 C8.95466667,39.9997333 0,31.0450667 0,19.9997333 C0,8.9544 8.95466667,-0.000266666667 20,-0.000266666667" id="forma1" fill="#000000"></path>
        <path d="M24.4518667,27.9184 L24.4518667,27.9184 C24.4518667,28.3237333 24.7905333,28.6624 25.2052,28.6624 C25.6105333,28.6624 25.9492,28.3237333 25.9492,27.9184 C25.9492,27.5024 25.6105333,27.1650667 25.2052,27.1650667 C24.7905333,27.1650667 24.4518667,27.5024 24.4518667,27.9184 M24.3452,16.5570667 L24.3452,16.5570667 C24.3452,16.9730667 24.6745333,17.3010667 25.0985333,17.3010667 C25.5052,17.3010667 25.8438667,16.9730667 25.8438667,16.5570667 C25.8438667,16.1410667 25.5052,15.8037333 25.0985333,15.8037333 C24.6745333,15.8037333 24.3452,16.1410667 24.3452,16.5570667 M15.6505333,11.1664 L15.6505333,11.1664 C15.6505333,11.5824 15.9892,11.9197333 16.4052,11.9197333 C16.8198667,11.9197333 17.1572,11.5824 17.1572,11.1664 C17.1572,10.7517333 16.8198667,10.4224 16.4052,10.4224 C15.9892,10.4224 15.6505333,10.7517333 15.6505333,11.1664 M15.6505333,27.8984 L15.6505333,27.8984 C15.6505333,28.3144 15.9892,28.6517333 16.4052,28.6517333 C16.8105333,28.6517333 17.1478667,28.3144 17.1478667,27.8984 C17.1478667,27.4837333 16.8105333,27.1450667 16.4052,27.1450667 C15.9892,27.1450667 15.6505333,27.4837333 15.6505333,27.8984 M14.1625333,27.7530667 L14.1625333,11.3117333 C14.1625333,9.87173333 15.1092,8.92506667 16.4238667,8.92506667 C17.7078667,8.92506667 18.6652,9.87173333 18.6652,11.3117333 L18.6652,20.1504 L23.3412,15.3597333 C23.9212,14.7890667 24.5958667,14.4704 25.2625333,14.5384 C26.3732,14.6344 27.2145333,15.5424 27.1185333,16.7117333 C27.0705333,17.2624 26.8478667,17.7357333 26.4718667,18.1024 L23.6985333,20.8464 L27.0412,26.6330667 C27.3212,27.1157333 27.4372,27.5704 27.4372,28.0050667 C27.4372,29.1637333 26.5478667,30.1410667 25.3025333,30.1410667 C24.4238667,30.1410667 23.6598667,29.6864 23.1772,28.8264 L20.4998667,24.0157333 L18.6652,25.8317333 L18.6652,27.7530667 C18.6652,29.1837333 17.7078667,30.1410667 16.4238667,30.1410667 C15.1092,30.1410667 14.1625333,29.1837333 14.1625333,27.7530667" id="forma2" fill="#FFFFFF"></path>
        <path d="M24.2981333,27.9184 L24.2981333,27.9184 C24.2981333,28.4104 24.7034667,28.8170667 25.2061333,28.8170667 C25.6981333,28.8170667 26.1034667,28.4104 26.1034667,27.9184 C26.1034667,27.4157333 25.6981333,27.0104 25.2061333,27.0104 C24.7034667,27.0104 24.2981333,27.4157333 24.2981333,27.9184" id="forma3" fill="#FF2024"></path>
    </g>
</svg>
`; // santander

  const santander = svg`
<svg viewBox="0 0 40 40" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <g id="BSCHESMMXXX" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <path d="M40,19.9997333 C40,31.0770667 31.0773333,39.9997333 20,39.9997333 C8.92266667,39.9997333 0,31.0770667 0,19.9997333 C0,8.9224 8.92266667,-0.000266666667 20,-0.000266666667 C31.0773333,-0.000266666667 40,8.9224 40,19.9997333" id="forma1" fill="#EC0000"></path>
        <path d="M24.2701333,19.2654667 C24.2261333,18.5988 24.0474667,17.9308 23.6914667,17.3521333 L20.6661333,12.0588 C20.4448,11.6588 20.2661333,11.2134667 20.1768,10.7694667 L20.0448,10.9921333 C19.2874667,12.2814667 19.2874667,13.9268 20.0448,15.2174667 L22.4914667,19.4441333 C23.2461333,20.7348 23.2461333,22.3801333 22.4914667,23.6694667 L22.3568,23.8921333 C22.2674667,23.4481333 22.0901333,23.0028 21.8674667,22.6028 L19.6434667,18.7334667 L18.2194667,16.2414667 C17.9981333,15.8401333 17.8194667,15.3961333 17.7301333,14.9508 L17.5981333,15.1734667 C16.8408,16.4628 16.8408,18.0641333 17.5981333,19.4001333 L20.0448,23.6268 C20.7994667,24.9161333 20.7994667,26.5628 20.0448,27.8521333 L19.9101333,28.0748 C19.8221333,27.6294667 19.6434667,27.1841333 19.4208,26.7854667 L16.3514667,21.4894667 C15.9514667,20.7788 15.7728,19.9774667 15.7728,19.1774667 C12.5248,20.0228 10.2568,21.8468 10.2568,23.9374667 C10.2568,26.8734667 14.6168,29.2308 19.9994667,29.2308 C25.3821333,29.2308 29.7421333,26.8734667 29.7421333,23.9374667 C29.7861333,21.9348 27.5621333,20.1108 24.2701333,19.2654667" id="forma2" fill="#FFFFFF"></path>
    </g>
</svg>
`;

  var entities = /*#__PURE__*/Object.freeze({
    __proto__: null,
    bankia: bankia,
    bankinter: bankinter,
    bbva: bbva,
    caixa: caixa,
    kutxa: kutxa,
    santander: santander
  });

  var styles$9 = css`:host {
  display: block;
  box-sizing: border-box; }

:host([hidden]),
[hidden] {
  display: none !important; }

*,
*:before,
*:after {
  box-sizing: inherit; }

:host([size='small']),
:host(:not([size])) {
  width: 1.5rem;
  height: 1.5rem; }

:host([size='medium']) {
  width: 2rem;
  height: 2rem; }

:host([size='large']) {
  width: 2.5rem;
  height: 2.5rem; }

bbva-clip-box {
  --bbva-clip-box-bg-color: var(--bbva-clip-entities-clip-box-bg-color, var(--colorsPrimaryVariantDark, ${unsafeCSS(colors.primaryVariantDark)})); }
  bbva-clip-box[size="small"] {
    --bbva-clip-box-size: 1.5rem;
    --bbva-clip-box-s-icon-size: 0.75rem; }
  bbva-clip-box[size="medium"] {
    --bbva-clip-box-size: 2rem;
    --bbva-clip-box-m-icon-size: 1rem; }
  bbva-clip-box[size="large"] {
    --bbva-clip-box-size: 2.5rem;
    --bbva-clip-box-l-icon-size: 1.5rem; }

figure {
  margin: 0; }

.sr-only {
  border: 0;
  clip: rect(0 0 0 0);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  width: 1px; }

:host([disabled]) {
  opacity: var(--bbva-clip-entities-opacity, 0.4); }

:host([entity='bankia']) svg #forma1 {
  fill: var(--bbva-clip-entities-bankia-forma1-color, #BFD437); }

:host([entity='bankia']) svg #forma2 {
  fill: var(--bbva-clip-entities-bankia-forma2-color, #412613); }

:host([entity='bankinter']) svg #forma1 {
  fill: var(--bbva-clip-entities-bankinter-forma1-color, #F76A00); }

:host([entity='bankinter']) svg #forma2 {
  fill: var(--bbva-clip-entities-bankinter-forma2-color, var(--colorsPrimaryCoreLightened, ${unsafeCSS(colors.primaryCoreLightened)})); }

:host([entity='bbva']) svg #forma1 {
  fill: var(--bbva-clip-entities-bbva-forma1-color, #004284); }

:host([entity='bbva']) svg #forma2 {
  fill: var(--bbva-clip-entities-bbva-forma2-color, #0074BC); }

:host([entity='bbva']) svg #forma3 {
  fill: var(--bbva-clip-entities-bbva-forma3-color, var(--colorsPrimaryCoreLightened, ${unsafeCSS(colors.primaryCoreLightened)})); }

:host([entity='caixa']) svg #forma1 {
  fill: var(--bbva-clip-entities-caixa-forma1-color, #333333); }

:host([entity='kutxa']) svg #forma1 {
  fill: var(--bbva-clip-entities-kutxa-forma1-color, #000000); }

:host([entity='kutxa']) svg #forma2 {
  fill: var(--bbva-clip-entities-kutxa-forma2-color, var(--colorsPrimaryCoreLightened, ${unsafeCSS(colors.primaryCoreLightened)})); }

:host([entity='santander']) svg #forma1 {
  fill: var(--bbva-clip-entities-santander-forma1-color, #FD2415); }

:host([entity='santander']) svg #forma2 {
  fill: var(--bbva-clip-entities-santander-forma2-color, var(--colorsPrimaryCoreLightened, ${unsafeCSS(colors.primaryCoreLightened)})); }

:host([variant='white']) bbva-clip-box {
  --bbva-clip-box-bg-color: var(--bbva-clip-entities-white-clip-box-bg-color, var(--colorsPrimaryCoreLightened, ${unsafeCSS(colors.primaryCoreLightened)}));
  --bbva-clip-box-text-color: var(--bbva-clip-entities-white-clip-box-text-color, var(--colorsPrimaryVariantDark, ${unsafeCSS(colors.primaryVariantDark)})); }

:host([variant='white']) svg #forma1 {
  fill: var(--bbva-clip-entities-white-bg-color, var(--colorsPrimaryCoreLightened, ${unsafeCSS(colors.primaryCoreLightened)})); }

:host([variant='white']):host([entity='bankia']) svg #forma2 {
  fill: var(--bbva-clip-entities-white-bankia-forma2-color, #BFD437); }

:host([variant='white']):host([entity='bankinter']) svg #forma2 {
  fill: var(--bbva-clip-entities-white-bankinter-forma2-color, #FF6100); }

:host([variant='white']):host([entity='bbva']) svg #forma1 {
  fill: var(--bbva-clip-entities-white-bbva-forma1-color, var(--colorsSecondary100, ${unsafeCSS(colors.secondary100)})); }

:host([variant='white']):host([entity='bbva']) svg #forma2 {
  fill: var(--bbva-clip-entities-white-bbva-forma2-color, var(--colorsPrimaryCoreLightened, ${unsafeCSS(colors.primaryCoreLightened)})); }

:host([variant='white']):host([entity='bbva']) svg #forma3 {
  fill: var(--bbva-clip-entities-white-bbva-forma3-color, #004284); }

:host([variant='white']):host([entity='kutxa']) svg #forma2 {
  fill: var(--bbva-clip-entities-white-kutxa-forma2-color, #000000); }

:host([variant='white']):host([entity='santander']) svg #forma2 {
  fill: var(--bbva-clip-entities-white-santander-forma2-color, #FD2415); }
`;

  css`[ambient^='light'] {
  --bbva-clip-entities-bankia-forma2-color: #412613;
  --bbva-clip-entities-bankinter-forma2-color: var(--colorsPrimaryCoreLightened, ${unsafeCSS(colors.primaryCoreLightened)});
  --bbva-clip-entities-bbva-forma1-color: #004284;
  --bbva-clip-entisties-bbva-forma2-color: #0074BC;
  --bbva-clip-entities-bbva-forma3-color: var(--colorsPrimaryCoreLightened, ${unsafeCSS(colors.primaryCoreLightened)});
  --bbva-clip-entities-kutxa-forma2-color: var(--colorsPrimaryCoreLightened, ${unsafeCSS(colors.primaryCoreLightened)});
  --bbva-clip-entities-santander-forma2-color: var(--colorsPrimaryCoreLightened, ${unsafeCSS(colors.primaryCoreLightened)});
  --bbva-clip-entities-white-bg-color: var(--colorsPrimaryCoreLightened, ${unsafeCSS(colors.primaryCoreLightened)});
  --bbva-clip-entities-white-bankia-forma2-color: #BFD437;
  --bbva-clip-entities-white-bankinter-forma2-color: #FF6100;
  --bbva-clip-entities-white-bbva-forma1-color: var(--colorsSecondary100, ${unsafeCSS(colors.secondary100)});
  --bbva-clip-entities-white-bbva-forma2-color: var(--colorsPrimaryCoreLightened, ${unsafeCSS(colors.primaryCoreLightened)});
  --bbva-clip-entities-white-bbva-forma3-color: #004284;
  --bbva-clip-entities-white-kutxa-forma2-color: #000000;
  --bbva-clip-entities-white-santander-forma2-color: #FD2415;
  --bbva-clip-box-text-color: var(--colorsPrimaryCoreLightened, ${unsafeCSS(colors.primaryCoreLightened)});
  --bbva-clip-box-bg-color: var(--colorsPrimaryVariantDark, ${unsafeCSS(colors.primaryVariantDark)}); }
`;

  css`[ambient^='dark'] {
  --bbva-clip-entities-white-bg-color: var(--colorsPrimaryCoreLightened, ${unsafeCSS(colors.primaryCoreLightened)});
  --bbva-clip-entities-white-bankia-forma2-color: #BFD437;
  --bbva-clip-entities-white-bankinter-forma2-color: #FF6100;
  --bbva-clip-entities-white-bbva-forma1-color: var(--colorsSecondary100, ${unsafeCSS(colors.secondary100)});
  --bbva-clip-entities-white-bbva-forma2-color: var(--colorsPrimaryCoreLightened, ${unsafeCSS(colors.primaryCoreLightened)});
  --bbva-clip-entities-white-bbva-forma3-color: #004284;
  --bbva-clip-entities-white-kutxa-forma2-color: #000000;
  --bbva-clip-entities-white-santander-forma2-color: #FD2415;
  --bbva-clip-entities-bg-color: var(--colorsPrimaryCoreLightened, ${unsafeCSS(colors.primaryCoreLightened)});
  --bbva-clip-entities-bankia-forma1-color: var(--colorsPrimaryCoreLightened, ${unsafeCSS(colors.primaryCoreLightened)});
  --bbva-clip-entities-bankia-forma2-color: #BFD437;
  --bbva-clip-entities-bankinter-forma1-color: var(--colorsPrimaryCoreLightened, ${unsafeCSS(colors.primaryCoreLightened)});
  --bbva-clip-entities-bankinter-forma2-color: #FF6100;
  --bbva-clip-entities-kutxa-forma1-color: var(--colorsPrimaryCoreLightened, ${unsafeCSS(colors.primaryCoreLightened)});
  --bbva-clip-entities-bbva-forma1-color: var(--colorsSecondary100, ${unsafeCSS(colors.secondary100)});
  --bbva-clip-entities-bbva-forma2-color: var(--colorsPrimaryCoreLightened, ${unsafeCSS(colors.primaryCoreLightened)});
  --bbva-clip-entities-bbva-forma3-color: #004284;
  --bbva-clip-entities-kutxa-forma2-color: #000000;
  --bbva-clip-entities-santander-forma1-color: var(--colorsPrimaryCoreLightened, ${unsafeCSS(colors.primaryCoreLightened)});
  --bbva-clip-entities-santander-forma1-color: var(--colorsPrimaryCoreLightened, ${unsafeCSS(colors.primaryCoreLightened)});
  --bbva-clip-entities-santander-forma2-color: #FD2415;
  --bbva-clip-entities-caixa-forma1-color: var(--colorsPrimaryCoreLightened, ${unsafeCSS(colors.primaryCoreLightened)});
  --bbva-clip-box-bg-color: var(--colorsPrimaryCoreLightened, ${unsafeCSS(colors.primaryCoreLightened)}); }
`;

  /**
  The Entities clips are used to represent external companies this element is used in some components such as Button List,  List Movement and Panel Detail among others.
  Clipboxes will be sized under the __three specific measurements__ (small 24px, medium 32px, large 40px) shown below and two color variation options in order to match over light or dark background compositions.

  List entities:
  * bankia
  * bankinter
  * bbva
  * caixa
  * kutxa
  * santander

  Example:

  Default icon

  ```html
  <bbva-clip-entities size="small"></bbva-clip-entities>
  ```

  ```html
  <bbva-clip-entities size="small" entity="bbva">bbva</bbva-clip-entities>
  ```

  ``` html
  <bbva-clip-entities entity="bbva" variant="white" size="large">bbva</bbva-clip-entities>
  ```

  ```html
  <bbva-clip-entities entity="bbva" variant="white" size="large" disabled>bbva</bbva-clip-entities>
  ```

  ## Styling

  The following custom properties are available for styling:

  ### Custom properties

  | Selector          | CSS Property                                 | CSS Variable | Theme Variable               | Foundations/Fallback                                  |
  | ----------------- | -------------------------------------------- | ------------ | ---------------------------- | ----------------------------------------------------- |
  | [ambient^='dark'] | --bbva-clip-entities-white-bg-color          |              | --colorsPrimaryCoreLightened | foundations.colors.primaryCoreLightened |
  | [ambient^='dark'] | --bbva-clip-entities-white-bbva-forma1-color |              | --colorsSecondary100         | foundations.colors.secondary100         |
  | [ambient^='dark'] | --bbva-clip-entities-white-bbva-forma2-color |              | --colorsPrimaryCoreLightened | foundations.colors.primaryCoreLightened |
  | [ambient^='dark'] | --bbva-clip-entities-bg-color                |              | --colorsPrimaryCoreLightened | foundations.colors.primaryCoreLightened |
  | [ambient^='dark'] | --bbva-clip-entities-bankia-forma1-color     |              | --colorsPrimaryCoreLightened | foundations.colors.primaryCoreLightened |
  | [ambient^='dark'] | --bbva-clip-entities-bankinter-forma1-color  |              | --colorsPrimaryCoreLightened | foundations.colors.primaryCoreLightened |
  | [ambient^='dark'] | --bbva-clip-entities-kutxa-forma1-color      |              | --colorsPrimaryCoreLightened | foundations.colors.primaryCoreLightened |
  | [ambient^='dark'] | --bbva-clip-entities-bbva-forma1-color       |              | --colorsSecondary100         | foundations.colors.secondary100         |
  | [ambient^='dark'] | --bbva-clip-entities-bbva-forma2-color       |              | --colorsPrimaryCoreLightened | foundations.colors.primaryCoreLightened |
  | [ambient^='dark'] | --bbva-clip-entities-santander-forma1-color  |              | --colorsPrimaryCoreLightened | foundations.colors.primaryCoreLightened |
  | [ambient^='dark'] | --bbva-clip-entities-santander-forma1-color  |              | --colorsPrimaryCoreLightened | foundations.colors.primaryCoreLightened |
  | [ambient^='dark'] | --bbva-clip-entities-caixa-forma1-color      |              | --colorsPrimaryCoreLightened | foundations.colors.primaryCoreLightened |
  | [ambient^='dark'] | --bbva-clip-box-bg-color                     |              | --colorsPrimaryCoreLightened | foundations.colors.primaryCoreLightened |
  ### Custom properties

  | Selector           | CSS Property                                 | CSS Variable | Theme Variable               | Foundations/Fallback                                  |
  | ------------------ | -------------------------------------------- | ------------ | ---------------------------- | ----------------------------------------------------- |
  | [ambient^='light'] | --bbva-clip-entities-bankinter-forma2-color  |              | --colorsPrimaryCoreLightened | foundations.colors.primaryCoreLightened |
  | [ambient^='light'] | --bbva-clip-entities-bbva-forma3-color       |              | --colorsPrimaryCoreLightened | foundations.colors.primaryCoreLightened |
  | [ambient^='light'] | --bbva-clip-entities-kutxa-forma2-color      |              | --colorsPrimaryCoreLightened | foundations.colors.primaryCoreLightened |
  | [ambient^='light'] | --bbva-clip-entities-santander-forma2-color  |              | --colorsPrimaryCoreLightened | foundations.colors.primaryCoreLightened |
  | [ambient^='light'] | --bbva-clip-entities-white-bg-color          |              | --colorsPrimaryCoreLightened | foundations.colors.primaryCoreLightened |
  | [ambient^='light'] | --bbva-clip-entities-white-bbva-forma1-color |              | --colorsSecondary100         | foundations.colors.secondary100         |
  | [ambient^='light'] | --bbva-clip-entities-white-bbva-forma2-color |              | --colorsPrimaryCoreLightened | foundations.colors.primaryCoreLightened |
  | [ambient^='light'] | --bbva-clip-box-text-color                   |              | --colorsPrimaryCoreLightened | foundations.colors.primaryCoreLightened |
  | [ambient^='light'] | --bbva-clip-box-bg-color                     |              | --colorsPrimaryVariantDark   | foundations.colors.primaryVariantDark   |
  ### Custom properties

  | Selector                                                        | CSS Property               | CSS Variable                                      | Theme Variable               | Foundations/Fallback                                  |
  | --------------------------------------------------------------- | -------------------------- | ------------------------------------------------- | ---------------------------- | ----------------------------------------------------- |
  | :host([variant='white']):host([entity='santander']) svg #forma2 | fill                       | --bbva-clip-entities-white-santander-forma2-color |                              | #FD2415                                               |
  | :host([variant='white']):host([entity='kutxa']) svg #forma2     | fill                       | --bbva-clip-entities-white-kutxa-forma2-color     |                              | #000000                                               |
  | :host([variant='white']):host([entity='bbva']) svg #forma3      | fill                       | --bbva-clip-entities-white-bbva-forma3-color      |                              | #004284                                               |
  | :host([variant='white']):host([entity='bbva']) svg #forma2      | fill                       | --bbva-clip-entities-white-bbva-forma2-color      | --colorsPrimaryCoreLightened | foundations.colors.primaryCoreLightened |
  | :host([variant='white']):host([entity='bbva']) svg #forma1      | fill                       | --bbva-clip-entities-white-bbva-forma1-color      | --colorsSecondary100         | foundations.colors.secondary100         |
  | :host([variant='white']):host([entity='bankinter']) svg #forma2 | fill                       | --bbva-clip-entities-white-bankinter-forma2-color |                              | #FF6100                                               |
  | :host([variant='white']):host([entity='bankia']) svg #forma2    | fill                       | --bbva-clip-entities-white-bankia-forma2-color    |                              | #BFD437                                               |
  | :host([variant='white']) svg #forma1                            | fill                       | --bbva-clip-entities-white-bg-color               | --colorsPrimaryCoreLightened | foundations.colors.primaryCoreLightened |
  | :host([variant='white']) bbva-clip-box                          | --bbva-clip-box-bg-color   | --bbva-clip-entities-white-clip-box-bg-color      | --colorsPrimaryCoreLightened | foundations.colors.primaryCoreLightened |
  | :host([variant='white']) bbva-clip-box                          | --bbva-clip-box-text-color | --bbva-clip-entities-white-clip-box-text-color    | --colorsPrimaryVariantDark   | foundations.colors.primaryVariantDark   |
  | :host([entity='santander']) svg #forma2                         | fill                       | --bbva-clip-entities-santander-forma2-color       | --colorsPrimaryCoreLightened | foundations.colors.primaryCoreLightened |
  | :host([entity='santander']) svg #forma1                         | fill                       | --bbva-clip-entities-santander-forma1-color       |                              | #FD2415                                               |
  | :host([entity='kutxa']) svg #forma2                             | fill                       | --bbva-clip-entities-kutxa-forma2-color           | --colorsPrimaryCoreLightened | foundations.colors.primaryCoreLightened |
  | :host([entity='kutxa']) svg #forma1                             | fill                       | --bbva-clip-entities-kutxa-forma1-color           |                              | #000000                                               |
  | :host([entity='caixa']) svg #forma1                             | fill                       | --bbva-clip-entities-caixa-forma1-color           |                              | #333333                                               |
  | :host([entity='bbva']) svg #forma3                              | fill                       | --bbva-clip-entities-bbva-forma3-color            | --colorsPrimaryCoreLightened | foundations.colors.primaryCoreLightened |
  | :host([entity='bbva']) svg #forma2                              | fill                       | --bbva-clip-entities-bbva-forma2-color            |                              | #0074BC                                               |
  | :host([entity='bbva']) svg #forma1                              | fill                       | --bbva-clip-entities-bbva-forma1-color            |                              | #004284                                               |
  | :host([entity='bankinter']) svg #forma2                         | fill                       | --bbva-clip-entities-bankinter-forma2-color       | --colorsPrimaryCoreLightened | foundations.colors.primaryCoreLightened |
  | :host([entity='bankinter']) svg #forma1                         | fill                       | --bbva-clip-entities-bankinter-forma1-color       |                              | #F76A00                                               |
  | :host([entity='bankia']) svg #forma2                            | fill                       | --bbva-clip-entities-bankia-forma2-color          |                              | #412613                                               |
  | :host([entity='bankia']) svg #forma1                            | fill                       | --bbva-clip-entities-bankia-forma1-color          |                              | #BFD437                                               |
  | :host([disabled])                                               | opacity                    | --bbva-clip-entities-opacity                      |                              | 0.4                                                   |
  | bbva-clip-box                                                   | --bbva-clip-box-bg-color   | --bbva-clip-entities-clip-box-bg-color            | --colorsPrimaryVariantDark   | foundations.colors.primaryVariantDark   |
  > Styling documentation generated by Cells CLI

  @customElement bbva-clip-entities
  @polymer
  @LitElement
  @demo demo/index.html
  */

  class BbvaClipEntities extends LitElement {
    static get is() {
      return 'bbva-clip-entities';
    }

    static get properties() {
      return {
        /**
         * Disabled state
         */
        disabled: {
          type: Boolean,
          reflect: true
        },

        /**
         * The name of the entity to use.
         */
        entity: {
          type: String
        },

        /**
         * Entity  size
         * Values: "small", "medium" or "large"
         */
        size: {
          type: String,
          reflect: true
        },

        /**
         * Default entity icon
         * @default 'coronita:bank'
         */
        defaultEntityIcon: {
          type: String,
          attribute: 'default-entity-icon'
        }
      };
    }

    constructor() {
      super();
      this.entity = '';
      this.disabled = false;
      this.defaultEntityIcon = 'coronita:bank';
    }

    static get styles() {
      return [styles$9, getComponentSharedStyles('bbva-clip-entities-shared-styles')];
    }

    render() {
      return html`
      ${this._entityLogo ? html`
            <span class="sr-only"><slot></slot></span>
            <figure>${this._entityLogo}</figure>
          ` : html`
            <bbva-clip-box size="${this.size}" .icon="${this.defaultEntityIcon}"></bbva-clip-box>
          `}
    `;
    }

    get _entityLogo() {
      const entityName = this.entity.toLowerCase();
      return entities[entityName];
    }

  }
  customElements.define(BbvaClipEntities.is, BbvaClipEntities);

  var styles$a = css`:host {
  --_text-color: var(--bbva-clip-card-text-color,var(--colorsSecondary500, ${unsafeCSS(colors.secondary500)}));
  --_status-color: var(--bbva-clip-card-status-color,var(--colorsTertiaryType1Dark, ${unsafeCSS(colors.tertiaryType1Dark)}));
  --_status-icon-color: var(--bbva-clip-card-status-icon-color,var(--colorsPrimaryCoreLightened, ${unsafeCSS(colors.primaryCoreLightened)}));
  --_pay-compatibility-color: var(--bbva-clip-card-pay-compatibility-color,var(--colorsPrimaryCoreLightened, ${unsafeCSS(colors.primaryCoreLightened)}));
  --_main-logo-color: var(--bbva-clip-card-main-logo-color,var(--colorsPrimaryCore, ${unsafeCSS(colors.primaryCore)}));
  --_main-logo-dark-color: var(--bbva-clip-card-main-logo-dark-color,var(--colorsPrimaryCoreLightened, ${unsafeCSS(colors.primaryCoreLightened)}));
  --_partner-bg-color: var(--bbva-clip-card-partner-bg-color,var(--colorsSecondary100, ${unsafeCSS(colors.secondary100)}));
  --_partner-overlay-color: var(--bbva-clip-card-partner-overlay-color,var(--colorsSecondary500, ${unsafeCSS(colors.secondary500)}));
  display: inline-block;
  position: relative;
  box-sizing: border-box;
  overflow: hidden;
  width: 4.5rem;
  height: 3rem;
  border-radius: var(--borderRadiusMedium, ${unsafeCSS(borderRadius.medium)});
  font-size: var(--typographyType3XSmall, ${unsafeCSS(typography.type3XSmall)});
  line-height: var(--lineHeightType3XSmall, ${unsafeCSS(lineHeight.type3XSmall)});
  font-weight: var(--fontFacePrimaryBookItalicFontWeight, ${unsafeCSS(fontFacePrimary.bookItalic.fontWeight)});
  font-style: var(--fontFacePrimaryBookItalicFontStyle, ${unsafeCSS(fontFacePrimary.bookItalic.fontStyle)});
  color: var(--_text-color); }

:host([status='blocked']) {
  --_status-color: var(--bbva-clip-card-status-blocked-color,var(--colorsTertiaryType1Dark, ${unsafeCSS(colors.tertiaryType1Dark)})); }

:host([status='off']) {
  --_status-color: var(--bbva-clip-card-status-off-color,var(--colorsSecondary500, ${unsafeCSS(colors.secondary500)})); }

:host([status='pending']) {
  --_status-color: var(--bbva-clip-card-status-pending-color,var(--colorsPrimaryCore, ${unsafeCSS(colors.primaryCore)})); }

:host([size='medium']) {
  width: 3.75rem;
  height: 2.5rem;
  font-size: var(--typographyType4XSmall, ${unsafeCSS(typography.type4XSmall)});
  line-height: var(--lineHeightType4XSmall, ${unsafeCSS(lineHeight.type4XSmall)}); }

:host([size='small']) {
  width: 3rem;
  height: 2rem;
  font-size: var(--typographyType4XSmall, ${unsafeCSS(typography.type4XSmall)});
  line-height: 0.75rem; }

:host([hidden]),
[hidden] {
  display: none !important; }

.sr-only {
  border: 0;
  clip: rect(0 0 0 0);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  width: 1px; }

*,
*:before,
*:after {
  box-sizing: inherit; }

.main {
  position: absolute;
  top: 0.3125rem;
  left: 0.25rem;
  height: 0.25rem;
  color: var(--_main-logo-color); }
  :host([size='medium']) .main {
    top: 0.25rem;
    left: 0.1875rem;
    height: 0.25rem; }
  :host([size='small']) .main {
    top: 0.1875rem;
    left: 0.125rem;
    height: 0.1875rem; }
  .main.dark {
    color: var(--_main-logo-dark-color); }

.type {
  display: flex;
  align-items: center;
  position: absolute;
  bottom: 0.25rem;
  right: 0.25rem;
  height: 0.3125rem; }
  :host([size='medium']) .type {
    bottom: 0.125rem;
    right: 0.1875rem;
    height: 0.3125rem; }
  :host([size='small']) .type {
    bottom: 0.125rem;
    right: 0.1875rem;
    height: 0.25rem; }

svg {
  height: 100%;
  fill: currentColor; }

.image-card {
  width: 100%;
  height: 100%; }

.partner {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  height: 100%;
  padding: 0.25rem;
  background-color: var(--_partner-bg-color); }
  .partner-bg {
    width: 84.375%;
    height: 86.375%;
    position: absolute;
    bottom: 0;
    right: 0;
    background-color: var(--_partner-overlay-color);
    opacity: 0.06;
    transform: skewX(-56deg);
    transform-origin: bottom left; }
  .partner-logo {
    position: relative; }
  .partner-text {
    position: relative; }

.overlay {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 3.125rem;
  padding-left: 0.625rem; }
  :host([size='medium']) .overlay {
    width: 2.625rem;
    padding-left: 0.125rem; }
  :host([size='small']) .overlay {
    width: 2.125rem;
    padding-left: 0.125rem; }
  .overlay-bg {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: var(--_status-color);
    transform-origin: top left;
    transform: skewX(15deg); }
    .pay .overlay-bg {
      background-color: var(--_pay-compatibility-color);
      opacity: 0.9; }
    :host([size='medium']) .overlay-bg {
      transform: skewX(13deg); }
    :host([size='small']) .overlay-bg {
      transform: skewX(12deg); }
  .overlay-icon {
    position: relative;
    color: var(--_status-icon-color); }
    .pay .overlay-icon {
      height: 0.75rem; }
      :host([size='medium']) .pay .overlay-icon {
        height: 0.625rem; }
      :host([size='small']) .pay .overlay-icon {
        height: 0.625rem; }
`;

  const bbva$1 = svg`
<svg viewBox="0 0 134 40" xmlns="http://www.w3.org/2000/svg">
  <path d="M.705 4.98h17.172c6.076 0 10.303 3.687 10.303 9.129 0 3.247-1.497 5.792-3.875 7.021 0 0 5.46 1.58 5.548 8.426 0 6.827-4.183 10.335-12.213 10.442l-.38.002H.705a.69.69 0 0 1-.7-.615L0 39.298V5.683a.69.69 0 0 1 .617-.697l.088-.005h17.172zm52.573 0c6.077 0 10.304 3.687 10.304 9.129 0 3.247-1.498 5.792-3.875 7.021 0 0 5.548 1.58 5.548 8.426C65.255 36.489 60.94 40 52.662 40H36.106a.693.693 0 0 1-.705-.702V5.683c0-.439.353-.702.705-.702zm18.317.089c.231 0 .463.134.576.285l.04.066 11.537 21.854c.245.407.87.436 1.17.087l.063-.087L96.517 5.42c.077-.23.29-.327.459-.347l.07-.004h5.547c.326 0 .576.299.474.62l-.033.082-18.141 33.878c-.165.41-.79.437-1.087.082l-.058-.082L65.607 5.77c-.163-.243.05-.636.36-.695l.08-.007h5.548zm44.15-4.822l.058.082 18.14 33.878c.164.243-.05.636-.36.695l-.08.007h-5.547a.766.766 0 0 1-.576-.285l-.04-.066-11.537-21.854c-.245-.407-.87-.436-1.17-.087l-.063.087-11.536 21.854c-.077.23-.29.327-.459.347l-.07.004h-5.548c-.325 0-.575-.299-.473-.62l.033-.082L114.658.33c.165-.41.79-.437 1.087-.082zM16.82 24.202H6.429a.69.69 0 0 0-.7.614l-.005.088v9.303a.69.69 0 0 0 .617.697l.088.005H16.82c5.02 0 7.133-1.58 7.133-5.441 0-3.862-2.201-5.266-7.133-5.266zm35.49 0H41.917a.693.693 0 0 0-.704.702v9.303c0 .44.352.702.704.702h10.391c4.932 0 7.134-1.58 7.134-5.441 0-3.862-2.202-5.266-7.134-5.266zm-35.578-14.13H6.429c-.32 0-.568.29-.61.54l-.007.074v7.811a.69.69 0 0 0 .617.697l.088.005h10.215c3.787 0 5.724-1.58 5.724-4.564s-1.937-4.564-5.724-4.564zm35.401 0H41.918c-.352 0-.704.35-.704.614v7.811c0 .439.352.702.704.702h10.215c3.787 0 5.724-1.58 5.724-4.564s-1.937-4.564-5.724-4.564z" fill-rule="nonzero"/>
</svg>
`;
  const visa = svg`
<svg viewBox="0 0 59 20" xmlns="http://www.w3.org/2000/svg">
  <path d="M29.213.354l-3.942 19.343h-4.768L24.445.354h4.768zm20.059 12.49l2.51-7.264 1.442 7.264h-3.952zm5.318 6.853H59L55.153.354h-4.072c-.912 0-1.687.558-2.028 1.42L41.9 19.696h5.003l.995-2.887h6.117l.574 2.887zm-12.442-6.315c.02-5.105-6.726-5.387-6.68-7.667.015-.695.644-1.432 2.022-1.622.685-.093 2.565-.165 4.703.868l.834-4.102C41.881.419 40.403 0 38.567 0c-4.71 0-8.029 2.63-8.056 6.396-.03 2.783 2.366 4.336 4.175 5.264 1.856.946 2.479 1.554 2.473 2.402-.014 1.299-1.483 1.87-2.852 1.893-2.398.04-3.788-.678-4.898-1.22l-.864 4.237c1.114.537 3.17 1.003 5.303 1.028 5.007 0 8.284-2.598 8.3-6.618zM22.4.354l-7.724 19.343h-5.04L5.837 4.26c-.23-.95-.432-1.3-1.136-1.7C3.557 1.908 1.663 1.297 0 .917L.111.354h8.115c1.033 0 1.963.722 2.197 1.972l2.009 11.194L17.392.354H22.4z" fill="#FFF" fill-rule="evenodd"/>
</svg>
`;
  const mastercard = svg`
<svg viewBox="0 0 32 20" xmlns="http://www.w3.org/2000/svg">
  <g fill="none" fill-rule="evenodd">
    <path fill="#FF5F00" d="M12 18h8V2h-8z"/>
    <path d="M12.223 9.999A10.025 10.025 0 0 1 16 2.138C11.706-1.275 5.489-.522 2.114 3.82-1.26 8.163-.516 14.45 3.78 17.862a9.803 9.803 0 0 0 12.221 0A10.024 10.024 0 0 1 12.223 10" fill="#EB001B"/>
    <path d="M32 10.001C32 15.523 27.573 20 22.111 20A9.82 9.82 0 0 1 16 17.86c4.294-3.412 5.04-9.697 1.665-14.04A9.948 9.948 0 0 0 16 2.14c4.293-3.413 10.51-2.66 13.885 1.68A10.072 10.072 0 0 1 32 10V10z" fill="#F79E1B"/>
  </g>
</svg>
`;
  const applepay = svg`
<svg viewBox="0 0 24 12" xmlns="http://www.w3.org/2000/svg">
  <path d="M6.15 4.758c.012 1.355 1.2 1.806 1.213 1.812-.01.032-.19.643-.626 1.274-.377.546-.768 1.09-1.384 1.1-.606.012-.8-.355-1.493-.355-.692 0-.908.344-1.481.367-.595.022-1.048-.59-1.428-1.134C.175 6.71-.419 4.68.378 3.31c.396-.68 1.103-1.112 1.871-1.123.584-.01 1.136.39 1.493.39.356 0 1.026-.482 1.73-.411.295.012 1.123.118 1.654.888-.043.026-.987.571-.977 1.704zM5.01 1.43c.316-.379.529-.905.47-1.43-.455.018-1.005.3-1.331.679-.293.335-.55.87-.48 1.385.507.039 1.025-.255 1.341-.634zm4.57-.648c.258-.044.516-.08.775-.109.31-.034.62-.05.932-.048.484 0 .9.058 1.252.175.35.117.639.284.865.502.195.195.35.43.453.688.11.266.163.572.163.919 0 .419-.074.785-.223 1.1a2.28 2.28 0 01-.611.791 2.571 2.571 0 01-.92.477 4.1 4.1 0 01-1.162.157 4.57 4.57 0 01-.955-.084v3.48h-.569V.782zm.57 4.06c.136.04.29.069.459.085.17.016.35.024.544.024.726 0 1.289-.17 1.688-.508.399-.338.599-.834.599-1.486 0-.314-.052-.588-.157-.822a1.472 1.472 0 00-.448-.574 2.04 2.04 0 00-.69-.338 3.197 3.197 0 00-.883-.115c-.258 0-.48.01-.666.03-.185.02-.334.043-.447.067v3.637zm8.394 2.61c0 .234.003.468.012.702.008.233.032.458.072.676h-.532l-.085-.822h-.024a2.19 2.19 0 01-.671.646c-.15.094-.319.168-.509.224a2.187 2.187 0 01-.623.085 1.86 1.86 0 01-.744-.139 1.53 1.53 0 01-.526-.362 1.485 1.485 0 01-.309-.514 1.725 1.725 0 01-.102-.58c0-.685.288-1.212.865-1.583.576-.37 1.445-.548 2.607-.532v-.157c0-.153-.014-.329-.042-.526a1.65 1.65 0 00-.188-.562 1.213 1.213 0 00-.435-.446c-.194-.121-.456-.182-.787-.182-.25 0-.498.038-.744.115-.246.076-.47.183-.671.32l-.182-.423c.258-.177.525-.304.799-.38.28-.078.569-.116.859-.115.403 0 .732.068.986.205.254.137.454.314.599.532.146.22.247.47.296.731.052.265.078.534.079.804v2.284zm-.57-1.727a7.837 7.837 0 00-.961.036 3.497 3.497 0 00-.926.211 1.766 1.766 0 00-.701.477c-.185.21-.279.488-.279.835 0 .41.117.712.352.906.233.193.495.29.786.29.234 0 .443-.032.629-.097a1.64 1.64 0 001.04-1.051c.04-.162.061-.278.061-.351V5.725zm1.682-2.695l1.475 3.77c.083.213.16.429.23.646.073.222.138.425.194.61h.024l.194-.598c.073-.221.153-.449.242-.683l1.38-3.746H24l-1.681 4.254c-.154.411-.314.82-.479 1.227-.135.337-.287.668-.453.99-.139.27-.295.53-.466.78a3.253 3.253 0 01-.526.592 2.855 2.855 0 01-.624.441c-.189.093-.316.151-.38.176l-.194-.472a4.82 4.82 0 00.484-.253 2.64 2.64 0 00.52-.411c.145-.145.305-.336.478-.574.173-.238.329-.526.466-.864a.974.974 0 00.072-.254.726.726 0 00-.072-.254L19.05 3.029h.606z" fill="#000" fill-rule="nonzero"/>
</svg>
`;
  const googlepay = svg`
<svg viewBox="0 0 29 12" xmlns="http://www.w3.org/2000/svg">
  <g fill="none" fill-rule="evenodd">
    <path d="M13.489 1.796v2.856h1.763c.391.011.77-.142 1.042-.423a1.434 1.434 0 00-1.042-2.434h-1.763zm0 3.861V8.97h-1.054V.79h2.794a2.529 2.529 0 011.809.711 2.36 2.36 0 010 3.46c-.489.465-1.092.697-1.81.697h-1.74zM18.857 7.257a.84.84 0 00.35.685c.233.183.522.28.818.274.445 0 .87-.177 1.185-.49.349-.328.523-.713.523-1.154-.328-.261-.786-.39-1.374-.389-.427 0-.784.103-1.07.31-.288.205-.432.459-.432.764m1.363-4.068c.779 0 1.393.208 1.844.623.45.415.675.985.675 1.708v3.45H21.73v-.777h-.046c-.436.64-1.016.96-1.74.96-.618 0-1.135-.183-1.55-.548a1.75 1.75 0 01-.625-1.371c0-.58.22-1.04.658-1.382.439-.342 1.025-.514 1.757-.515.626 0 1.14.114 1.546.343v-.24a1.196 1.196 0 00-.435-.931 1.493 1.493 0 00-1.017-.383c-.588 0-1.054.248-1.397.743l-.927-.583c.51-.731 1.265-1.097 2.265-1.097M28.521 3.372l-3.516 8.066h-1.088l1.306-2.82-2.313-5.245h1.145l1.671 4.022h.023l1.626-4.022z" fill="#5D646A"/>
    <path d="M9.233 4.943c0-.32-.027-.64-.081-.956H4.71v1.81h2.544a2.176 2.176 0 01-.94 1.429V8.4H7.83c.89-.818 1.402-2.028 1.402-3.458" fill="#0086F8"/>
    <path d="M4.71 9.536c1.27 0 2.341-.416 3.121-1.134L6.313 7.227c-.423.284-.967.45-1.603.45-1.229 0-2.272-.827-2.644-1.94H.5v1.21a4.711 4.711 0 004.209 2.59" fill="#00AA4B"/>
    <path d="M2.066 5.735a2.81 2.81 0 010-1.799v-1.21H.5a4.692 4.692 0 000 4.22l1.565-1.21z" fill="#FFBC00"/>
    <path d="M4.71 1.996a2.56 2.56 0 011.807.705L7.86 1.359A4.531 4.531 0 004.71.135 4.711 4.711 0 00.5 2.725l1.565 1.211c.372-1.114 1.415-1.94 2.644-1.94" fill="#FF4031"/>
  </g>
</svg>
`;

  var logo = /*#__PURE__*/Object.freeze({
    __proto__: null,
    bbva: bbva$1,
    visa: visa,
    mastercard: mastercard,
    applepay: applepay,
    googlepay: googlepay
  });

  const defaultCard = svg`
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 72 48">
  <path fill="#d3d3d3" d="M0 0h72v48H0V0z"/>
  <defs>
    <path id="a" d="M0 0h72v48H0V0z"/>
  </defs>
  <clipPath id="b">
    <use overflow="visible" xlink:href="#a"/>
  </clipPath>
  <g clip-path="url(#b)" opacity=".7">
    <radialGradient id="c" cx="-374.547" cy="1390.735" r="33.453" fx="-408" fy="1390.588" gradientTransform="matrix(.4832 .2569 .3854 -.7248 -308.985 1145.391)" gradientUnits="userSpaceOnUse">
      <stop offset=".002" stop-color="#fff"/>
      <stop offset=".985" stop-color="#e6e6e6" stop-opacity="0"/>
    </radialGradient>
    <path fill="url(#c)" d="M67.2 84L18 57.8 44.2 8.6l49.2 26.2L67.2 84z"/>
    <radialGradient id="d" cx="-405.269" cy="1390.741" r="23.962" gradientTransform="matrix(.4832 .2569 .2569 -.4832 -130.318 809.37)" gradientUnits="userSpaceOnUse">
      <stop offset=".003" stop-color="#fff"/>
      <stop offset="1" stop-color="#fff" stop-opacity="0"/>
    </radialGradient>
    <path fill="url(#d)" d="M22.5 49.7l-.1-.1 17.4-32.8.1.1-17.4 32.8z"/>
    <radialGradient id="e" cx="-3611.6" cy="-1875.684" r="33.439" fx="-3645.038" fy="-1875.831" gradientTransform="matrix(-.4832 -.2569 -.3854 .7248 -2442.038 438.51)" gradientUnits="userSpaceOnUse">
      <stop offset=".002" stop-color="#fff"/>
      <stop offset="1" stop-color="#e6e6e6" stop-opacity="0"/>
    </radialGradient>
    <path fill="url(#e)" d="M4.8-36L54-9.8 27.8 39.4l-49.2-26.2L4.8-36z"/>
    <radialGradient id="f" cx="-3642.321" cy="-1875.807" r="23.999" gradientTransform="matrix(-.4832 -.2569 -.2569 .4832 -2201.084 -14.662)" gradientUnits="userSpaceOnUse">
      <stop offset=".003" stop-color="#fff"/>
      <stop offset="1" stop-color="#fff" stop-opacity="0"/>
    </radialGradient>
    <path fill="url(#f)" d="M49.5-1.7l.1.1-17.4 32.8-.1-.1L49.5-1.7z"/>
  </g>
</svg>
`;
  const debitCard = svg`
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 72 48">
  <path d="M0 0h72v48H0V0z" fill="#02a5a5"/>
  <defs>
    <path id="a" d="M0 0h72v48H0z"/>
  </defs>
  <clipPath id="b">
    <use xlink:href="#a" overflow="visible"/>
  </clipPath>
  <g opacity=".9" clip-path="url(#b)">
    <radialGradient id="c" cx="-374.547" cy="-1342.746" r="33.455" fx="-408.002" fy="-1342.894" gradientTransform="matrix(.4832 .2569 -.3854 .7248 -290.486 1110.601)" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#00cdce"/>
      <stop offset="1" stop-color="#008586" stop-opacity="0"/>
    </radialGradient>
    <path d="M67.2 84L18 57.8 44.2 8.6l49.2 26.2L67.2 84z" fill="url(#c)"/>
    <radialGradient id="d" cx="-405.269" cy="-1342.753" r="23.971" gradientTransform="matrix(.4832 .2569 -.2569 .4832 -117.986 786.177)" gradientUnits="userSpaceOnUse">
      <stop offset=".004" stop-color="#19d2d3"/>
      <stop offset="1" stop-color="#19d2d3" stop-opacity="0"/>
    </radialGradient>
    <path d="M22.5 49.7l-.1-.1 17.4-32.8.1.1-17.4 32.8z" fill="url(#d)"/>
    <radialGradient id="e" cx="-3611.6" cy="1923.673" r="33.441" fx="-3645.04" fy="1923.525" gradientTransform="matrix(-.4832 -.2569 .3854 -.7248 -2460.537 473.3)" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#00cdce"/>
      <stop offset="1" stop-color="#008586" stop-opacity="0"/>
    </radialGradient>
    <path d="M4.8-36L54-9.8 27.8 39.4l-49.2-26.2L4.8-36z" fill="url(#e)"/>
    <radialGradient id="f" cx="-3642.321" cy="1923.807" r="23.999" gradientTransform="matrix(-.4832 -.2569 .2569 -.4832 -2213.415 8.531)" gradientUnits="userSpaceOnUse">
      <stop offset=".004" stop-color="#19d2d3"/>
      <stop offset="1" stop-color="#19d2d3" stop-opacity="0"/>
    </radialGradient>
    <path d="M49.5-1.7l.1.1-17.4 32.8-.1-.1L49.5-1.7z" fill="url(#f)"/>
  </g>
</svg>
`;
  const creditCard = svg`
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 72 48">
  <path fill="#043263" d="M0 0h72v48H0V0z"/>
  <defs>
    <path id="a" d="M0 0h72v48H0V0z"/>
  </defs>
  <clipPath id="b">
    <use overflow="visible" xlink:href="#a"/>
  </clipPath>
  <g clip-path="url(#b)">
    <radialGradient id="c" cx="-374.547" cy="1390.735" r="33.453" fx="-408" fy="1390.588" gradientTransform="matrix(.4832 .2569 .3854 -.7248 -308.985 1145.391)" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#0064a9"/>
      <stop offset=".989" stop-color="#002e65" stop-opacity="0"/>
    </radialGradient>
    <path fill="url(#c)" d="M67.2 84L18 57.8 44.2 8.6l49.2 26.2L67.2 84z"/>
    <radialGradient id="d" cx="-405.269" cy="1390.741" r="23.962" gradientTransform="matrix(.4832 .2569 .2569 -.4832 -130.318 809.37)" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#1974b1"/>
      <stop offset=".996" stop-color="#1974b1" stop-opacity="0"/>
    </radialGradient>
    <path fill="url(#d)" d="M22.5 49.7l-.1-.1 17.4-32.8.1.1-17.4 32.8z"/>
    <radialGradient id="e" cx="-3611.6" cy="-1875.684" r="33.439" fx="-3645.038" fy="-1875.831" gradientTransform="matrix(-.4832 -.2569 -.3854 .7248 -2442.038 438.51)" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#0064a9"/>
      <stop offset=".989" stop-color="#002e65" stop-opacity="0"/>
    </radialGradient>
    <path fill="url(#e)" d="M4.8-36L54-9.8 27.8 39.4l-49.2-26.2L4.8-36z"/>
    <radialGradient id="f" cx="-3642.321" cy="-1875.807" r="23.999" gradientTransform="matrix(-.4832 -.2569 -.2569 .4832 -2201.084 -14.662)" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#1974b1"/>
      <stop offset=".996" stop-color="#1974b1" stop-opacity="0"/>
    </radialGradient>
    <path fill="url(#f)" d="M49.5-1.7l.1.1-17.4 32.8-.1-.1L49.5-1.7z"/>
  </g>
</svg>
`;
  const prepayCard = svg`
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 72 48">
  <path fill="#1464a5" d="M0 0h72v48H0V0z"/>
  <defs>
    <path id="a" d="M0 0h72v48H0V0z"/>
  </defs>
  <clipPath id="b">
    <use overflow="visible" xlink:href="#a"/>
  </clipPath>
  <g clip-path="url(#b)" opacity=".7">
    <radialGradient id="c" cx="-374.547" cy="1390.735" r="33.453" fx="-408" fy="1390.588" gradientTransform="matrix(.4832 .2569 .3854 -.7248 -308.985 1145.391)" gradientUnits="userSpaceOnUse">
      <stop offset=".001" stop-color="#00a7e9"/>
      <stop offset=".988" stop-color="#0064a9" stop-opacity="0"/>
    </radialGradient>
    <path fill="url(#c)" d="M67.2 84L18 57.8 44.2 8.6l49.2 26.2L67.2 84z"/>
    <radialGradient id="d" cx="-405.269" cy="1390.741" r="23.962" gradientTransform="matrix(.4832 .2569 .2569 -.4832 -130.318 809.37)" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#19afeb"/>
      <stop offset="1" stop-color="#19afeb" stop-opacity="0"/>
    </radialGradient>
    <path fill="url(#d)" d="M22.5 49.7l-.1-.1 17.4-32.8.1.1-17.4 32.8z"/>
    <radialGradient id="e" cx="-3611.6" cy="-1875.684" r="33.439" fx="-3645.038" fy="-1875.831" gradientTransform="matrix(-.4832 -.2569 -.3854 .7248 -2442.038 438.51)" gradientUnits="userSpaceOnUse">
      <stop offset=".001" stop-color="#00a7e9"/>
      <stop offset=".988" stop-color="#0064a9" stop-opacity="0"/>
    </radialGradient>
    <path fill="url(#e)" d="M4.8-36L54-9.8 27.8 39.4l-49.2-26.2L4.8-36z"/>
    <radialGradient id="f" cx="-3642.321" cy="-1875.807" r="23.999" gradientTransform="matrix(-.4832 -.2569 -.2569 .4832 -2201.084 -14.662)" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#19afeb"/>
      <stop offset="1" stop-color="#19afeb" stop-opacity="0"/>
    </radialGradient>
    <path fill="url(#f)" d="M49.5-1.7l.1.1-17.4 32.8-.1-.1L49.5-1.7z"/>
  </g>
</svg>
`;
  const caminoCard = svg`
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 72 48">
  <path fill="#49a5e6" d="M0 0h72v48H0V0z"/>
  <defs>
    <path id="a" d="M0 0h72v48H0V0z"/>
  </defs>
  <clipPath id="b">
    <use overflow="visible" xlink:href="#a"/>
  </clipPath>
  <g clip-path="url(#b)" opacity=".45">
    <radialGradient id="c" cx="-374.547" cy="1390.735" r="33.453" fx="-408" fy="1390.588" gradientTransform="matrix(.4832 .2569 .3854 -.7248 -308.985 1145.391)" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#caeefd"/>
      <stop offset=".985" stop-color="#00a7e9" stop-opacity="0"/>
    </radialGradient>
    <path fill="url(#c)" d="M67.2 84L18 57.8 44.2 8.6l49.2 26.2L67.2 84z"/>
    <radialGradient id="d" cx="-405.269" cy="1390.741" r="23.962" gradientTransform="matrix(.4832 .2569 .2569 -.4832 -130.318 809.37)" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#cfeffd"/>
      <stop offset="1" stop-color="#cfeffd" stop-opacity="0"/>
    </radialGradient>
    <path fill="url(#d)" d="M22.5 49.7l-.1-.1 17.4-32.8.1.1-17.4 32.8z"/>
    <radialGradient id="e" cx="-3611.6" cy="-1875.684" r="33.439" fx="-3645.038" fy="-1875.831" gradientTransform="matrix(-.4832 -.2569 -.3854 .7248 -2442.038 438.51)" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#caeefd"/>
      <stop offset="1" stop-color="#00a7e9" stop-opacity="0"/>
    </radialGradient>
    <path fill="url(#e)" d="M4.8-36L54-9.8 27.8 39.4l-49.2-26.2L4.8-36z"/>
    <radialGradient id="f" cx="-3642.321" cy="-1875.807" r="23.999" gradientTransform="matrix(-.4832 -.2569 -.2569 .4832 -2201.084 -14.662)" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#cfeffd"/>
      <stop offset="1" stop-color="#cfeffd" stop-opacity="0"/>
    </radialGradient>
    <path fill="url(#f)" d="M49.5-1.7l.1.1-17.4 32.8-.1-.1L49.5-1.7z"/>
  </g>
</svg>
`;
  const goldCard = svg`
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 72 48">
  <path fill="#d0b76b" d="M0 0h72v48H0V0z"/>
  <defs>
    <path id="a" d="M0 0h72v48H0V0z"/>
  </defs>
  <clipPath id="b">
    <use overflow="visible" xlink:href="#a"/>
  </clipPath>
  <g opacity=".5">
    <g clip-path="url(#b)" opacity=".7">
      <radialGradient id="c" cx="-374.547" cy="1390.735" r="33.453" fx="-408" fy="1390.588" gradientTransform="matrix(.4832 .2569 .3854 -.7248 -308.985 1145.391)" gradientUnits="userSpaceOnUse">
        <stop offset=".002" stop-color="#fff"/>
        <stop offset=".985" stop-color="#fff" stop-opacity="0"/>
      </radialGradient>
      <path fill="url(#c)" d="M67.2 84L18 57.8 44.2 8.6l49.2 26.2L67.2 84z"/>
      <radialGradient id="d" cx="-405.269" cy="1390.741" r="23.962" gradientTransform="matrix(.4832 .2569 .2569 -.4832 -130.318 809.37)" gradientUnits="userSpaceOnUse">
        <stop offset=".003" stop-color="#fff"/>
        <stop offset="1" stop-color="#fff" stop-opacity="0"/>
      </radialGradient>
      <path fill="url(#d)" d="M22.5 49.7l-.1-.1 17.4-32.8.1.1-17.4 32.8z"/>
      <radialGradient id="e" cx="-3611.6" cy="-1875.684" r="33.439" fx="-3645.038" fy="-1875.831" gradientTransform="matrix(-.4832 -.2569 -.3854 .7248 -2442.038 438.51)" gradientUnits="userSpaceOnUse">
        <stop offset=".002" stop-color="#fff"/>
        <stop offset=".98" stop-color="#fff" stop-opacity="0"/>
      </radialGradient>
      <path fill="url(#e)" d="M4.8-36L54-9.8 27.8 39.4l-49.2-26.2L4.8-36z"/>
      <radialGradient id="f" cx="-3642.321" cy="-1875.807" r="23.999" gradientTransform="matrix(-.4832 -.2569 -.2569 .4832 -2201.084 -14.662)" gradientUnits="userSpaceOnUse">
        <stop offset=".003" stop-color="#fff"/>
        <stop offset="1" stop-color="#fff" stop-opacity="0"/>
      </radialGradient>
      <path fill="url(#f)" d="M49.5-1.7l.1.1-17.4 32.8-.1-.1L49.5-1.7z"/>
    </g>
  </g>
</svg>
`;

  var cards = /*#__PURE__*/Object.freeze({
    __proto__: null,
    defaultCard: defaultCard,
    debitCard: debitCard,
    creditCard: creditCard,
    prepayCard: prepayCard,
    caminoCard: caminoCard,
    goldCard: goldCard
  });

  /**
   * Object defining status parts: icon and text (as a locale key)
   */

  const statusInfo = {
    blocked: {
      icon: 'coronita:block',
      text: 'bbva-clip-card-status-blocked'
    },
    off: {
      icon: 'coronita:on',
      text: 'bbva-clip-card-status-off'
    },
    pending: {
      icon: 'coronita:clock',
      text: 'bbva-clip-card-status-pending'
    }
  };
  /**
   * Object defining pay compatibility parts: logo from logos file and text (as a locale key)
   */

  const payCompatibilityInfo = {
    apple: {
      logo: 'applepay',
      text: 'bbva-clip-card-pay-compatibility-apple'
    },
    google: {
      logo: 'googlepay',
      text: 'bbva-clip-card-pay-compatibility-google'
    }
  };
  /**
  A credit card clip is used to represent a cards within an application. It is composed of a card background, a logo and card type logo, and can show a status overlay or a pay compatibility overlay. It also can be used for partner cards, showing the entity logo or a text for them.

  Card background will depend on the variant property. Text content of the element will be used as accessible text for the card. Background are defined as SVGs in 'bbva-clip-card-cards.js', and logos are SVGs imported from 'bbva-clip-card-logos'.

  **Sizes**
  ```html
  <bbva-clip-card size="small">Card</bbva-clip-card>
  <bbva-clip-card size="medium">Card</bbva-clip-card>
  <bbva-clip-card size="large">Card</bbva-clip-card>
  ```

  **Variants**
  ```html
  <bbva-clip-card variant="debit">Debit Card</bbva-clip-card>
  <bbva-clip-card variant="credit">Credit Card</bbva-clip-card>
  <bbva-clip-card variant="prepay">Prepay Card</bbva-clip-card>
  <bbva-clip-card variant="camino">Camino Card</bbva-clip-card>
  <bbva-clip-card variant="gold">Gold Card</bbva-clip-card>
  ```

  **Card types**
  ```html
  <bbva-clip-card card-type="visa">Card</bbva-clip-card>
  <bbva-clip-card card-type="mastercard">Card</bbva-clip-card>
  ```

  **Partner cards**
  ```html
  <bbva-clip-card partner>Bank Title</bbva-clip-card>
  <bbva-clip-card partner-logo="bankia">Bankia</bbva-clip-card>
  ```

  **Status**
  ```html
  <bbva-clip-card status="blocked">Card</bbva-clip-card>
  <bbva-clip-card status="pending">Card</bbva-clip-card>
  <bbva-clip-card status="off">Card</bbva-clip-card>
  ```

  **Pay compatibility**
  ```html
  <bbva-clip-card pay-compatibility="apple">Card</bbva-clip-card>
  <bbva-clip-card pay-compatibility="google">Card</bbva-clip-card>
  ```

  ## Icons

  Since this component uses icons, it will need an [iconset](https://platform.bbva.com/en-us/developers/engines/cells/documentation/cells-architecture/components/components-in-depth/icons) in your project as an application level dependency. In fact, this component uses an iconset in its demo.

  ## Styling

  The following custom properties are available for styling:

  ### Custom properties

  | Selector                  | CSS Property               | CSS Variable                             | Theme Variable                        | Foundations/Fallback                                            |
  | ------------------------- | -------------------------- | ---------------------------------------- | ------------------------------------- | --------------------------------------------------------------- |
  | .overlay-icon             | color                      | --_status-icon-color                     |                                       |                                                                 |
  | .pay .overlay-bg          | background-color           | --_pay-compatibility-color               |                                       |                                                                 |
  | .overlay-bg               | background-color           | --_status-color                          |                                       |                                                                 |
  | .partner-bg               | background-color           | --_partner-overlay-color                 |                                       |                                                                 |
  | .partner                  | background-color           | --_partner-bg-color                      |                                       |                                                                 |
  | .main.dark                | color                      | --_main-logo-dark-color                  |                                       |                                                                 |
  | .main                     | color                      | --_main-logo-color                       |                                       |                                                                 |
  | :host([size='small'])     | font-size                  |                                          | --typographyType4XSmall               | foundations.typography.type4XSmall                |
  | :host([size='medium'])    | font-size                  |                                          | --typographyType4XSmall               | foundations.typography.type4XSmall                |
  | :host([size='medium'])    | line-height                |                                          | --lineHeightType4XSmall               | foundations.lineHeight.type4XSmall                |
  | :host([status='pending']) | --_status-color            | --bbva-clip-card-status-pending-color    | --colorsPrimaryCore                   | foundations.colors.primaryCore                    |
  | :host([status='off'])     | --_status-color            | --bbva-clip-card-status-off-color        | --colorsSecondary500                  | foundations.colors.secondary500                   |
  | :host([status='blocked']) | --_status-color            | --bbva-clip-card-status-blocked-color    | --colorsTertiaryType1Dark             | foundations.colors.tertiaryType1Dark              |
  | :host                     | --_text-color              | --bbva-clip-card-text-color              | --colorsSecondary500                  | foundations.colors.secondary500                   |
  | :host                     | --_status-color            | --bbva-clip-card-status-color            | --colorsTertiaryType1Dark             | foundations.colors.tertiaryType1Dark              |
  | :host                     | --_status-icon-color       | --bbva-clip-card-status-icon-color       | --colorsPrimaryCoreLightened          | foundations.colors.primaryCoreLightened           |
  | :host                     | --_pay-compatibility-color | --bbva-clip-card-pay-compatibility-color | --colorsPrimaryCoreLightened          | foundations.colors.primaryCoreLightened           |
  | :host                     | --_main-logo-color         | --bbva-clip-card-main-logo-color         | --colorsPrimaryCore                   | foundations.colors.primaryCore                    |
  | :host                     | --_main-logo-dark-color    | --bbva-clip-card-main-logo-dark-color    | --colorsPrimaryCoreLightened          | foundations.colors.primaryCoreLightened           |
  | :host                     | --_partner-bg-color        | --bbva-clip-card-partner-bg-color        | --colorsSecondary100                  | foundations.colors.secondary100                   |
  | :host                     | --_partner-overlay-color   | --bbva-clip-card-partner-overlay-color   | --colorsSecondary500                  | foundations.colors.secondary500                   |
  | :host                     | border-radius              |                                          | --borderRadiusMedium                  | foundations.borderRadius.medium                   |
  | :host                     | font-size                  |                                          | --typographyType3XSmall               | foundations.typography.type3XSmall                |
  | :host                     | line-height                |                                          | --lineHeightType3XSmall               | foundations.lineHeight.type3XSmall                |
  | :host                     | font-weight                |                                          | --fontFacePrimaryBookItalicFontWeight | foundations.fontFacePrimary.bookItalic.fontWeight |
  | :host                     | font-style                 |                                          | --fontFacePrimaryBookItalicFontStyle  | foundations.fontFacePrimary.bookItalic.fontStyle  |
  | :host                     | color                      | --_text-color                            |                                       |                                                                 |
  > Styling documentation generated by Cells CLI

  @customElement bbva-clip-card
  @polymer
  @LitElement
  @demo demo/index.html
  @appliesMixin CellsI18nMixin
  */

  class BbvaClipCard extends CellsI18nMixin(LitElement) {
    static get is() {
      return 'bbva-clip-card';
    }

    static get properties() {
      return {
        /**
         * Size of the card.
         * Allowed sizes are 'large' (default), 'medium' and 'small'
         */
        size: {
          type: String,
          reflect: true
        },

        /**
         * Status overlay to show.
         * Allowed status are 'blocked', 'off' and 'pending'
         */
        status: {
          type: String,
          reflect: true
        },

        /**
         * Pay compatibility overlay to show.
         * Allowed types are 'apple' and 'google'
         */
        payCompatibility: {
          type: String,
          attribute: 'pay-compatibility'
        },

        /**
         * Card variant to use as background.
         * Allowed variants are 'default' (default), 'debit', 'credit', 'prepay', 'camino' and 'gold'
         */
        variant: {
          type: String
        },

        /**
         * Main logo to show, from bbva-clip-card-logos
         * Allowed logo is 'bbva' (default)
         */
        logo: {
          type: String
        },

        /**
         * Card type logo to use, from bbva-clip-card-logos
         * Allowed current types are 'visa' (default) and 'mastercard'
         */
        cardType: {
          type: String,
          attribute: 'card-type'
        },

        /**
         * Property to set a card image
         * @type {string}
         */
        cardImage: {
          type: String,
          attribute: 'card-image'
        },

        /**
         * Property to set an accessibility text to image
         * @type {string}
         */
        accessibilityText: {
          type: String,
          attribute: 'accessibility-text'
        },

        /**
         * Partner entity to show as partner card
         */
        partnerLogo: {
          type: String,
          attribute: 'partner-logo'
        },

        /**
         * Variant applied to partner logo
         */
        partnerLogoVariant: {
          type: String,
          attribute: 'partner-logo-variant'
        },

        /**
         * If true, partner state will be used and slot text will be shown
         */
        partner: {
          type: Boolean
        },

        /**
         * Size for status icon
         */
        statusIconSize: {
          type: Number,
          attribute: 'status-icon-size'
        }
      };
    }

    constructor() {
      super();
      this.size = 'large';
      this.cardAlt = '';
      this.status = '';
      this.payCompatibility = '';
      this.variant = 'default';
      this.logo = 'bbva';
      this.cardType = 'visa';
      this.statusInfo = statusInfo;
      this.payCompatibilityInfo = payCompatibilityInfo;
      this.statusIconSize = 24;
      this.accessibilityText = '';
    }

    static get styles() {
      return [styles$a, getComponentSharedStyles('bbva-clip-card-shared-styles')];
    }

    render() {
      return html`
      ${!this.partner ? html`
            <span class="sr-only">
              <slot></slot>
              ${this._accessibleStatus}
            </span>
          ` : ''}
      ${this.partner || this.partnerLogo ? this.partnerCard : this.card}
      ${this.payCompatibility && !this.status ? this.payCompatibilityOverlay : ''}
      ${this.status ? this.statusOverlay : ''}
    `;
    }
    /**
     * HTML for partner card
     * @return {TemplateResult} HTML of partner card
     */


    get partnerCard() {
      return html`
      <div class="partner">
        <div class="partner-bg" aria-hidden="true"></div>
        ${this.partnerLogo ? html`
              <bbva-clip-entities
                class="partner-logo"
                size="small"
                entity="${this.partnerLogo}"
                variant="${ifDefined(this.partnerLogoVariant)}"
              ></bbva-clip-entities>
            ` : html`
              <span class="partner-text">
                <slot></slot>
                <span class="sr-only">
                  ${this._accessibleStatus}
                </span>
              </span>
            `}
      </div>
    `;
    }

    get _accessibleStatus() {
      return html`
      ${this.status ? `(${this.t(this.statusInfo[this.status].text)})` : ''}
      ${this.payCompatibility ? `(${this.t(this.payCompatibilityInfo[this.payCompatibility].text)})` : ''}
    `;
    }
    /**
     * HTML for card image and logos
     * @return {TemplateResult} HTML of card image and logos
     */


    get card() {
      return this.cardImage ? html`
          <img
            src="${this.cardImage}"
            id="cardImage"
            class="image-card"
            alt="${this.accessibilityText}"
          />
        ` : html`
          <div aria-hidden="true">
            ${this._cardAsset}
            <span class="main ${this.variant !== 'default' ? 'dark' : ''}">${this.mainLogo}</span>
            <span class="type">${this.typeLogo}</span>
          </div>
        `;
    }

    get _cardAsset() {
      return html`
      <span class="bg">
        ${svg`${cards[`${this.variant}Card`]}`}
      </span>
    `;
    }
    /**
     * SVG for card main logo
     * @return {TemplateResult} SVG for card main logo
     */


    get mainLogo() {
      return svg`${logo[this.logo]}`;
    }
    /**
     * SVG for card type logo
     * @return {TemplateResult} SVG for card type logo
     */


    get typeLogo() {
      return svg`${logo[this.cardType]}`;
    }
    /**
     * HTML for the status block
     * @return {TemplateResult} HTML of status block
     */


    get statusOverlay() {
      return html`
      <div class="overlay status" aria-hidden="true">
        <div class="overlay-bg"></div>
        <cells-icon
          class="overlay-icon"
          icon="${this.statusInfo[this.status].icon}"
          size="${this.statusIconSize}"
        ></cells-icon>
      </div>
    `;
    }
    /**
     * HTML for the pay compatibility block
     * @return {TemplateResult} HTML of pay compatibility block
     */


    get payCompatibilityOverlay() {
      return html`
      <div class="overlay pay" aria-hidden="true">
        <div class="overlay-bg"></div>
        <span class="overlay-icon"
          >${svg`${logo[this.payCompatibilityInfo[this.payCompatibility].logo]}`}</span
        >
      </div>
    `;
    }

  }
  customElements.define(BbvaClipCard.is, BbvaClipCard);

  const card = svg`
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 33 24">
  <defs>
    <path d="M0 22.957h31.854c.964 0 1.746-.831 1.746-1.856V1.856C33.6.831 32.818 0 31.854 0H0v22.957z" id="j"/>
  </defs>
  <g transform="translate(-1)" fill="none" fill-rule="evenodd">
    <path d="M33.6 22.144c0 1.026-.67 1.856-1.498 1.856H3.364c-.827 0-1.497-.83-1.497-1.856V2.9c0-1.025.67-1.857 1.497-1.857h28.738c.828 0 1.498.832 1.498 1.857v19.244z" fill="#004481"/>
    <path d="M33.6 21.101c0 1.025-.67 1.856-1.498 1.856H3.364c-.827 0-1.497-.831-1.497-1.856V1.856C1.867.831 2.537 0 3.364 0h28.738C32.93 0 33.6.831 33.6 1.856v19.245z" fill="#2A86CA"/>
    <mask id=k fill="#fff">
      <use xlink:href="#j"/>
    </mask>
    <path d="M0 29.36L31.34-5.218 42 22.735s-16.528 7.938-17.306 7.51c-.778-.43-14.194-1.288-14.194-1.288L0 29.359z" fill="#0977BA" mask="url(#k)"/>
    <path fill="#FFF" mask="url(#k)" d="M5.6 19.826h24.267v-3.13H5.6z"/>
    <path fill="#072146" mask="url(#k)" d="M1.867 8.348H33.6V4.174H1.867z"/>
  </g>
</svg>
`;
  const phone = svg`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 36">
  <g fill="none" fill-rule="evenodd">
    <path d="M19.403 34.247c0 .856-.754 1.55-1.685 1.55H1.717c-.93 0-1.685-.694-1.685-1.55V2.951c0-.857.755-1.55 1.685-1.55h16.001c.931 0 1.685.693 1.685 1.55v31.296z" fill="#004481"/>
    <path d="M19.403 32.93c0 .856-.754 1.55-1.685 1.55H1.717c-.93 0-1.685-.694-1.685-1.55V1.635c0-.856.755-1.55 1.685-1.55h16.001c.931 0 1.685.694 1.685 1.55v31.297z" fill="#49A5E6"/>
    <path fill="#004481" d="M.032 29.363h19.37V4.246H.033z"/>
    <path d="M11.147 31.897c0 .785-.64 1.42-1.43 1.42-.789 0-1.428-.635-1.428-1.42 0-.784.64-1.42 1.429-1.42.79 0 1.43.636 1.43 1.42" fill="#072146"/>
    <path d="M12.224.084H1.367C.612.084 0 .718 0 1.5v10.747L12.224.084z" fill="#FFF" opacity=".3"/>
  </g>
</svg>
`;
  const account = svg`
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 48 32">
  <defs>
    <path d="M41.071 0H.297C.133 0 0 .11 0 .246l.018 31.53c0 .137.115.224.279.224h16.187L48 31.97V.246C48 .11 47.925 0 47.761 0h-6.69z" id="a"/>
    <path d="M30.614.906l-30.26 30s32-.005 32 0V1.136c0-.127-.072-.23-.229-.23h-1.51z" id="c"/>
  </defs>
  <g fill="none" fill-rule="evenodd">
    <g>
      <mask id="b" fill="#fff">
        <use xlink:href="#a"/>
      </mask>
      <path fill="#004481" mask="url(#b)" d="M-4.637 36.654h57.451V-4.761H-4.637z"/>
    </g>
    <path fill="#237ABA" d="M6 25h36v-3H6zM26 19h16v-3H26z"/>
    <g transform="translate(14.647 .094)">
      <mask id="d" fill="#fff">
        <use xlink:href="#c"/>
      </mask>
      <path fill="#FFF" opacity=".2" mask="url(#d)" d="M-5.047 31.906l37.6.094V0H-5z"/>
    </g>
    <g fill="#FFF" fill-rule="nonzero">
      <path d="M7.668 4.747c.907 0 1.538.553 1.538 1.37 0 .486-.223.868-.578 1.053 0 0 .815.236.828 1.263 0 1.04-.644 1.567-1.88 1.567h-2.47A.104.104 0 015 9.895V4.852c0-.065.053-.105.105-.105zm5.284 0c.907 0 1.538.553 1.538 1.37 0 .486-.224.868-.579 1.053 0 0 .829.236.829 1.263 0 1.04-.645 1.567-1.88 1.567h-2.471a.104.104 0 01-.105-.105V4.852c0-.065.052-.105.105-.105zm2.734.013a.11.11 0 01.092.053L17.5 8.09c.04.066.144.066.184 0l1.722-3.278c.013-.04.052-.053.078-.053h.828c.053 0 .092.053.066.106l-2.707 5.081c-.027.066-.132.066-.171 0l-2.708-5.081c-.026-.04.013-.106.066-.106zm6.427-.71c.026-.066.132-.066.171 0l2.708 5.081c.026.04-.014.105-.066.105h-.828a.11.11 0 01-.092-.052l-1.722-3.278c-.04-.066-.145-.066-.184 0l-1.722 3.278c-.013.04-.052.052-.079.052h-.828c-.052 0-.092-.052-.065-.105zM7.51 7.63H5.96a.104.104 0 00-.106.106V9.13c0 .066.053.105.105.105H7.51c.75 0 1.065-.237 1.065-.816 0-.58-.328-.79-1.065-.79zm5.297 0h-1.55a.104.104 0 00-.106.106V9.13c0 .066.053.105.105.105h1.551c.736 0 1.065-.237 1.065-.816 0-.58-.329-.79-1.065-.79zm-5.31-2.12H5.96c-.052 0-.092.053-.092.093v1.172c0 .065.053.105.106.105h1.524c.565 0 .855-.237.855-.685 0-.447-.29-.684-.855-.684zm5.284 0h-1.525c-.052 0-.105.053-.105.093v1.172c0 .065.053.105.105.105h1.525c.565 0 .854-.237.854-.685 0-.447-.289-.684-.854-.684z"/>
    </g>
  </g>
</svg>
`;
  const receipt = svg`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 31">
  <g fill="none" fill-rule="evenodd">
    <path d="M23.298 2.378H2.84c-.323 0-.584.302-.584.672v26.68c0 .372.261.672.584.672h20.458c.322 0 .584-.3.584-.672V3.05c0-.37-.262-.672-.584-.672" fill="#1464A5"/>
    <path d="M21.627 27.352c0 .372-.262.672-.585.672H.585c-.323 0-.585-.3-.585-.672V.672C0 .302.262 0 .585 0h20.457c.323 0 .585.302.585.672v26.68z" fill="#FFF"/>
    <path stroke="#2A85C9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M3.637 7.704h10.491M3.637 11.425h10.491M3.637 15.209h10.491"/>
    <path d="M13.821 23.138a2.657 2.657 0 115.314 0 2.657 2.657 0 01-5.314 0" fill="#2A85C9"/>
    <path d="M0 27.29c0 .433.262.734.585.734h20.457c.323 0 .584-.3.584-.672V2.404L0 27.29z" fill="#00BEFF" opacity=".15"/>
  </g>
</svg>
`;

  var defaultMi = /*#__PURE__*/Object.freeze({
    __proto__: null,
    card: card,
    phone: phone,
    account: account,
    receipt: receipt
  });

  var styles$b = css`:host {
  --_bg-color: var(--bbva-clip-product-bg-color, var(--colorsSecondary100, ${unsafeCSS(colors.secondary100)}));
  --_secondary-bg-color: var(--bbva-clip-product-secondary-bg-color,var(--colorsSecondary200, ${unsafeCSS(colors.secondary200)}));
  display: inline-block;
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

.bg {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 4rem;
  height: 4rem;
  border-radius: 6.25rem;
  background-color: var(--_bg-color); }
  .bg.large {
    width: 3rem;
    height: 3rem; }

.item {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 2.125rem;
  height: 2.125rem; }

.avatar {
  display: flex;
  justify-content: center;
  align-items: center; }

svg {
  width: 100%;
  height: 100%; }

:host([variant='maximum']) .bg {
  width: 8.5rem;
  height: 4rem;
  background-image: linear-gradient(110deg, var(--_secondary-bg-color) 50%, transparent 0); }

:host([variant='maximum']) .item {
  flex-basis: 50%;
  width: 4rem;
  height: 2rem; }

:host([variant='maximum']) .avatar {
  flex-basis: 50%; }

:host([item='card']) .large .item {
  height: 1.5rem; }

:host([item='phone']) .large .item {
  height: 2.25rem; }
`;

  /**

  A product clip is an element with a microillustration to represent an account, card or device within an application.

  This component has two variants: 'minimum' (default, no variant) and 'maximum'. It can show one SVG or clip box from a predefined set, or two SVGs/one SVG and a clip box (only in the left position) in the 'maximum' variant. Text content of the tag will be used as accessible text for screen readers. User can show a custom SVG instead of the predefined ones including it in the 'item' or 'item-right' slots.

  Available SVGs are 'card', 'phone', 'account' and 'receipt'.

  Maximum

  The elements that make up the clip product maximum can be exchanged for the represented assets (Clip Box Initials, Illustration Account, Illustration Card, Illustration Receipt).

  Minimum

  It would have size 'large' (only for card & phone items) and 'xl' (default)

  The elements that make up the clip product minimum can be exchanged for the assets (Clip Box Initials, Clip Box Image, Illustration Account, Illustration Card, Illustration Receipt or Phone o) represented, they must respect the combinations

  Examples:

  Minimum with large size

  ```html
  <bbva-clip-product item="card" size="large">Card</bbva-clip-product>
  <bbva-clip-product item="phone" size="large">Phone</bbva-clip-product>
  ```

  Minimum with clip box

  ```html
  <bbva-clip-product user-image="images/avatar.png">Card of Jose Luis</bbva-clip-product>
  <bbva-clip-product user-text="Jose Luis">Card of Jose Luis</bbva-clip-product>>
  ```

  Minimum default

  ```html
  <bbva-clip-product item="card">Card</bbva-clip-product>
  ```

  Maximum

  ```html
  <bbva-clip-product variant="receipt" item="account">Account</bbva-clip-product>
  <bbva-clip-product variant="receipt" item="receipt">Receipt</bbva-clip-product>
  <bbva-clip-product variant="maximum" item-right="account" user-text="Jose Luis"> Account of Jose Luis</bbva-clip-product>
  <bbva-clip-product variant="maximum" item-right="card" user-image="images/avatar.png"
  > Card of Jose Luis</bbva-clip-product>
   <bbva-clip-product
    variant="maximum"
    user-image="images/avatar.png"
    user-image-right="images/avatar.png"
  >Clip</bbva-clip-product>
  ```

  ## Styling

  The following custom properties are available for styling:

  ### Custom properties

  | Selector                       | CSS Property          | CSS Variable                           | Theme Variable       | Foundations/Fallback                          |
  | ------------------------------ | --------------------- | -------------------------------------- | -------------------- | --------------------------------------------- |
  | :host([variant='maximum']) .bg | background-image      | --_secondary-bg-color                  |                      |                                               |
  | .bg                            | background-color      | --_bg-color                            |                      |                                               |
  | :host                          | --_bg-color           | --bbva-clip-product-bg-color           | --colorsSecondary100 | foundations.colors.secondary100 |
  | :host                          | --_secondary-bg-color | --bbva-clip-product-secondary-bg-color | --colorsSecondary200 | foundations.colors.secondary200 |
  > Styling documentation generated by Cells CLI

  @customElement bbva-clip-product
  @polymer
  @LitElement
  @demo demo/index.html
  */

  class BbvaClipProduct extends LitElement {
    static get is() {
      return 'bbva-clip-product';
    }

    static get properties() {
      return {
        /**
         * SVG item to show. Available items are 'card', 'phone', 'account', 'receipt' or a clip box element with initials or image
         */
        item: {
          type: String
        },

        /**
         * SVG item to show in right position for 'maximum' variant. Available items are 'card', 'account' and 'receipt' or a clip box element with initials
         */
        itemRight: {
          type: String,
          attribute: 'item-right'
        },

        /**
         * User name for clip box in 'minimum' variant
         */
        userText: {
          type: String,
          attribute: 'user-text'
        },

        /**
         * User name for clip box in 'maximum' variant
         */
        userTextRight: {
          type: String,
          attribute: 'user-text-right'
        },

        /**
         * User image for clip box in 'minimum' variant
         */
        userImage: {
          type: String,
          attribute: 'user-image'
        },

        /**
         * User image for clip box in 'maximum' variant
         */
        userImageRight: {
          type: String,
          attribute: 'user-image-right'
        },

        /**
         * Illustration size in 'minimum' variant
         */
        size: {
          type: String
        },

        /**
         * Variant of clip product. Available variants are 'minimum'(Default) and 'maximum'
         */
        variant: {
          type: String
        }
      };
    }

    static get styles() {
      return [styles$b, getComponentSharedStyles('bbva-clip-product-shared-styles')];
    }

    get _minimumDrawable() {
      return !this.variant || this.variant && this.variant.toLowerCase() === 'maximum' && this.item !== 'phone';
    }

    get _maximumDrawable() {
      return this._minimumDrawable && this.variant && this.variant.toLowerCase() === 'maximum' && this.itemRight !== 'phone';
    }

    get _largeSize() {
      return this.size === 'large' && this.variant !== 'maximum' && (this.item === 'card' || this.item === 'phone');
    }

    static showAvatar(item, userText, userImage) {
      return userText || userImage ? html`
          <div class="avatar">
            <bbva-clip-box
              size="large"
              class="bitone"
              .text="${userText}"
              .image="${userImage}"
            ></bbva-clip-box>
          </div>
        ` : html`
          <div class="item">
            ${defaultMi[item]}
          </div>
        `;
    }

    render() {
      return html`
      <span class="sr-only">
        <slot></slot>
      </span>
      <div
        class="${classMap({
      large: this._largeSize
    })} bg"
        aria-hidden="true"
      >
        ${this._minimumDrawable ? html`
              ${BbvaClipProduct.showAvatar(this.item, this.userText, this.userImage, this.size)}
            ` : ''}
        ${this._maximumDrawable ? html`
              ${BbvaClipProduct.showAvatar(this.itemRight, this.userTextRight, this.userImageRight)}
            ` : ''}
      </div>
    `;
    }

  }
  customElements.define(BbvaClipProduct.is, BbvaClipProduct);

  var styles$c = css`:host {
  display: block;
  box-sizing: border-box;
  padding: 0 calc(((2 * var(--gridSpacerVariant, var(--gridSpacer, ${unsafeCSS(grid.spacer)}))) / 16) * 1em) calc(((1 * var(--gridSpacerVariant, var(--gridSpacer, ${unsafeCSS(grid.spacer)}))) / 16) * 1em); }

:host([hidden]),
[hidden] {
  display: none !important; }

*,
*:before,
*:after {
  box-sizing: inherit; }

.row {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  flex-grow: 1; }

.column {
  display: flex;
  flex-direction: column;
  flex-grow: 1; }

.card > .column,
.contact > .column {
  margin-left: calc(((1 * var(--gridSpacerVariant, var(--gridSpacer, ${unsafeCSS(grid.spacer)}))) / 16) * 1rem); }

.balance {
  text-align: right; }

.name,
.content ::slotted([slot='number']),
.content ::slotted([slot='description']),
.content ::slotted([slot='details']) {
  font-size: var(--typographyTypeSmall, ${unsafeCSS(typography.typeSmall)});
  line-height: var(--lineHeightTypeSmall, ${unsafeCSS(lineHeight.typeSmall)}); }

.content ::slotted([slot='description']) {
  font-style: var(--fontFacePrimaryBookFontStyle, ${unsafeCSS(fontFacePrimary.book.fontStyle)});
  font-weight: var(--fontFacePrimaryBookFontWeight, ${unsafeCSS(fontFacePrimary.book.fontWeight)});
  color: var(--bbva-list-multistep-description-color, var(--colorsPrimaryCoreLightened, ${unsafeCSS(colors.primaryCoreLightened)})); }

.card .wrapper-name {
  min-width: 0;
  flex-basis: 35%;
  margin-right: calc(((1 * var(--gridSpacerVariant, var(--gridSpacer, ${unsafeCSS(grid.spacer)}))) / 16) * 1rem); }

.name {
  font-style: var(--fontFacePrimaryMediumFontStyle, ${unsafeCSS(fontFacePrimary.medium.fontStyle)});
  font-weight: var(--fontFacePrimaryMediumFontWeight, ${unsafeCSS(fontFacePrimary.medium.fontWeight)});
  display: block;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  color: var(--bbva-list-multistep-name-color, var(--colorsPrimaryCoreLightened, ${unsafeCSS(colors.primaryCoreLightened)})); }

.content ::slotted([slot='number']),
.content ::slotted([slot='details']) {
  font-style: var(--fontFacePrimaryBookItalicFontStyle, ${unsafeCSS(fontFacePrimary.bookItalic.fontStyle)});
  font-weight: var(--fontFacePrimaryBookItalicFontWeight, ${unsafeCSS(fontFacePrimary.bookItalic.fontWeight)}); }

.content ::slotted([slot='details']) {
  color: var(--bbva-list-multistep-slotted-details-color, var(--colorsPrimaryCoreLightened, ${unsafeCSS(colors.primaryCoreLightened)})); }

.amount {
  color: var(--bbva-list-multistep-amount-color, var(--colorsPrimaryCoreLightened, ${unsafeCSS(colors.primaryCoreLightened)})); }

.content ::slotted([slot='number']) {
  display: flex;
  color: var(--bbva-list-multistep-slotted-number-color, var(--colorsPrimaryCoreLightened, ${unsafeCSS(colors.primaryCoreLightened)})); }

:host([variant='maximum']) .row:not(.row-small) {
  flex-direction: column; }

:host([variant='maximum']) .description {
  order: 3; }

:host([variant='maximum']) .content ::slotted([slot='number']) {
  order: 4; }

:host([variant='maximum']) .card .clip {
  margin: calc(((1 * var(--gridSpacerVariant, var(--gridSpacer, ${unsafeCSS(grid.spacer)}))) / 16) * 1rem) 0; }
`;

  const LAYOUT = {
    AMOUNT: 'amount',
    CARD: 'card',
    CONTACT: 'contact',
    DEFAULT: 'default',
    DESCRIPTION: 'description'
  };
  /**
  A multistep list is used specifically for multistep processes. These lists should always live in the multistep expandable and utilize the multistep header to separate sections.

  Examples:

  Default

  ```html
  <bbva-list-multistep name="Account name" amount="9999999.99">
    <span slot="description">Saldo disponible</span>
    <span slot="number">&middot;3236</span>
  </bbva-list-multistep>
  ```

  Default Maximum

  ```html
  <bbva-list-multistep name="Account name" variant="maximum" amount="9999999.99">
    <span slot="description">Saldo disponible</span>
    <span slot="number">&middot;3236</span>
  </bbva-list-multistep>
  ```

  Description

  ```html
  <bbva-list-multistep layout="description">
    <span slot="description">Lorem ipsum dolor sit amet</span>
  </bbva-list-multistep>
  ```

  Affiliate

  ```html
  <bbva-list-multistep name="Account name" amount="9999999.99">
    <span slot="details">Expenses and commissions: 0.75€</span>
    <span slot="number">
      &middot;3236
      <bbva-clip-box bg-color="#fff" icon="coronita:fold"> </bbva-clip-box>
    </span>
  </bbva-list-multistep>
  ```

  Amount

  ```html
  <bbva-list-multistep layout="amount" amount="9999999.99">
    <span slot="description">$ 320,00 (Dolar USA)</span>
  </bbva-list-multistep>
  ```

  Amount Maximum

  ```html
  <bbva-list-multistep layout="amount" amount="9999999999999.99" amount-size="l">
    <span slot="description">$ 320,00 (Dolar USA)</span>
  </bbva-list-multistep>
  ```

  Description

  ```html
  <bbva-list-multistep layout="description">
    <span slot="description">Lorem ipsum dolor sit amet</span>
  </bbva-list-multistep>
  ```

  Contact

  ```html
  <bbva-list-multistep layout="contact" name="John Smith" initials="JS">
    <span slot="details">NTSBDEB1XXX</span>
    <span slot="number">ES12 3456 7890 1234 4567 8901</span>
  </bbva-list-multistep>
  ```

  Card

  ```html
  <bbva-list-multistep layout="card" name="Card name" amount="9999999.99">
    <span slot="description">Saldo disponible</span>
    <span slot="number">&middot;3236</span>
  </bbva-list-multistep>
  ```

  Card Maximum

  ```html
  <bbva-list-multistep layout="card" name="Card name" amount="9999999999999.99" variant="maximum">
    <span slot="description">Saldo disponible</span>
    <span slot="number">&middot;3236</span>
  </bbva-list-multistep>
  ```

  Card Voucher

  ```html
  <bbva-list-multistep layout="card" name="Card name" amount="9999999.99" show-voucher-icon>
    <span slot="description">Saldo disponible</span>
    <span slot="number">&middot;3236</span>
  </bbva-list-multistep>
  ```

  Card Voucher Maximum

  ```html
  <bbva-list-multistep
    layout="card"
    name="Card name"
    amount="9999999999999.99"
    variant="maximum"
    show-voucher-icon
  >
    <span slot="description">Saldo disponible</span>
    <span slot="number">&middot;1234</span>
  </bbva-list-multistep>
  ```

  ## Styling

  The following custom properties are available for styling:

  ### Custom properties

  | Selector                                 | CSS Property | CSS Variable                                | Theme Variable                        | Foundations/Fallback                                            |
  | ---------------------------------------- | ------------ | ------------------------------------------- | ------------------------------------- | --------------------------------------------------------------- |
  | :host([variant='maximum']) .card .clip   | margin       | --gridSpacerVariant                         | --gridSpacer                          | foundations.grid.spacer                           |
  | .content ::slotted([slot='number'])      | color        | --bbva-list-multistep-slotted-number-color  | --colorsPrimaryCoreLightened          | foundations.colors.primaryCoreLightened           |
  | .amount                                  | color        | --bbva-list-multistep-amount-color          | --colorsPrimaryCoreLightened          | foundations.colors.primaryCoreLightened           |
  | .content ::slotted([slot='details'])     | color        | --bbva-list-multistep-slotted-details-color | --colorsPrimaryCoreLightened          | foundations.colors.primaryCoreLightened           |
  | .content ::slotted([slot='number'])      | font-style   |                                             | --fontFacePrimaryBookItalicFontStyle  | foundations.fontFacePrimary.bookItalic.fontStyle  |
  | .content ::slotted([slot='details'])     | font-style   |                                             | --fontFacePrimaryBookItalicFontStyle  | foundations.fontFacePrimary.bookItalic.fontStyle  |
  | .content ::slotted([slot='number'])      | font-weight  |                                             | --fontFacePrimaryBookItalicFontWeight | foundations.fontFacePrimary.bookItalic.fontWeight |
  | .content ::slotted([slot='details'])     | font-weight  |                                             | --fontFacePrimaryBookItalicFontWeight | foundations.fontFacePrimary.bookItalic.fontWeight |
  | .name                                    | font-style   |                                             | --fontFacePrimaryMediumFontStyle      | foundations.fontFacePrimary.medium.fontStyle      |
  | .name                                    | font-weight  |                                             | --fontFacePrimaryMediumFontWeight     | foundations.fontFacePrimary.medium.fontWeight     |
  | .name                                    | color        | --bbva-list-multistep-name-color            | --colorsPrimaryCoreLightened          | foundations.colors.primaryCoreLightened           |
  | .card .wrapper-name                      | margin-right | --gridSpacerVariant                         | --gridSpacer                          | foundations.grid.spacer                           |
  | .content ::slotted([slot='description']) | font-style   |                                             | --fontFacePrimaryBookFontStyle        | foundations.fontFacePrimary.book.fontStyle        |
  | .content ::slotted([slot='description']) | font-weight  |                                             | --fontFacePrimaryBookFontWeight       | foundations.fontFacePrimary.book.fontWeight       |
  | .content ::slotted([slot='description']) | color        | --bbva-list-multistep-description-color     | --colorsPrimaryCoreLightened          | foundations.colors.primaryCoreLightened           |
  | .name                                    | font-size    |                                             | --typographyTypeSmall                 | foundations.typography.typeSmall                  |
  | .content ::slotted([slot='number'])      | font-size    |                                             | --typographyTypeSmall                 | foundations.typography.typeSmall                  |
  | .content ::slotted([slot='description']) | font-size    |                                             | --typographyTypeSmall                 | foundations.typography.typeSmall                  |
  | .content ::slotted([slot='details'])     | font-size    |                                             | --typographyTypeSmall                 | foundations.typography.typeSmall                  |
  | .name                                    | line-height  |                                             | --lineHeightTypeSmall                 | foundations.lineHeight.typeSmall                  |
  | .content ::slotted([slot='number'])      | line-height  |                                             | --lineHeightTypeSmall                 | foundations.lineHeight.typeSmall                  |
  | .content ::slotted([slot='description']) | line-height  |                                             | --lineHeightTypeSmall                 | foundations.lineHeight.typeSmall                  |
  | .content ::slotted([slot='details'])     | line-height  |                                             | --lineHeightTypeSmall                 | foundations.lineHeight.typeSmall                  |
  | .card > .column                          | margin-left  | --gridSpacerVariant                         | --gridSpacer                          | foundations.grid.spacer                           |
  | .contact > .column                       | margin-left  | --gridSpacerVariant                         | --gridSpacer                          | foundations.grid.spacer                           |
  | :host                                    | padding      | --gridSpacerVariant                         | --gridSpacer                          | foundations.grid.spacer                           |
  > Styling documentation generated by Cells CLI

  * @customElement bbva-list-multistep
  * @polymer
  * @LitElement
  * @demo demo/index.html
  * @appliesMixin CellsAmountMixin
  */

  class BbvaListMultistep extends CellsAmountMixin(LitElement) {
    static get is() {
      return 'bbva-list-multistep';
    }

    static get properties() {
      return {
        /**
         * Amount badge size
         * @default 4xl
         */
        amountSize: {
          type: String,
          attribute: 'amount-size'
        },

        /**
         * Contact initials for clip box
         */
        initials: {
          type: String
        },

        /**
         * Name text
         */
        name: {
          type: String
        },

        /**
         * Acount number
         */
        number: {
          type: String,
          attribute: 'number'
        },

        /**
         * Layout
         * @default default
         */
        layout: {
          type: String
        },

        /**
         * If true it shows bbva-clip-product. Otherwise, it shows bbva-clip-card.
         * @default false
         */
        showVoucherIcon: {
          type: Boolean,
          attribute: 'show-voucher-icon'
        },

        /**
         * Variant to use.
         * Allowed variants are 'default' (default) and 'maximum'.
         */
        variant: {
          type: String
        },

        /**
         * Property to set a card image
         * @type {string}
         */
        cardImage: {
          type: String,
          attribute: 'card-image'
        },

        /**
         * Property to set an accessibility text to image
         * @type {string}
         */
        accessibilityText: {
          type: String,
          attribute: 'accessibility-text'
        }
      };
    }

    constructor() {
      super();
      this.initials = '';
      this.layout = LAYOUT.DEFAULT;
      this.showVoucherIcon = false;
      this.currencyCode = 'EUR';
      this.localCurrency = 'EUR';
    }

    connectedCallback() {
      if (super.connectedCallback) {
        super.connectedCallback();
      }

      if (!this.amountSize) {
        this.setAmountSize(this.variant !== 'maximum' && this.layout === LAYOUT.AMOUNT ? '4xl' : 'l');
      }
    }

    static get styles() {
      return [styles$c, getComponentSharedStyles('bbva-list-multistep-shared-styles')];
    }

    setAmountSize(variant) {
      this.amountSize = variant;
    }

    get _initials() {
      return this.initials ? this.initials : this.name.split(' ').map(w => w[0]).join('').toUpperCase();
    }

    get _renderAmount() {
      return html`
      <div class="column">
        <bbva-amount
          class="amount"
          .amount=${this.amount}
          variant="${this.amountSize}"
          currency-code="${this.currencyCode}"
          local-currency="${this.localCurrency}"
        ></bbva-amount>
        ${BbvaListMultistep._renderDescription()}
      </div>
    `;
    }

    get _renderContact() {
      return html`
      <div class="contact row">
        <bbva-clip-box
          class="clipbox bitone"
          size="medium"
          .text="${this._initials}"
        ></bbva-clip-box>
        <div class="column">
          <span class="name">${this.name}</span>
          <slot name="number"></slot>
          <slot name="details"></slot>
        </div>
      </div>
    `;
    }

    get _cardIcon() {
      return this.showVoucherIcon ? html`
          <bbva-clip-product class="clip" item="card" size="large"></bbva-clip-product>
        ` : html`
          <bbva-clip-card
            class="clip"
            size="small"
            card-image="${ifDefined(this.cardImage)}"
            accessibility-text="${ifDefined(this.accessibilityText)}"
            >Card</bbva-clip-card
          >
        `;
    }

    get _renderCreditCard() {
      return this.variant === 'maximum' ? html`
          <div class="card">
            <span class="name">${this.name}</span>
            <div class="row row-small">
              <div class="column">
                ${this._cardIcon}
                <slot name="number"></slot>
              </div>
              <div class="balance">
                ${this._renderAmount}
              </div>
            </div>
          </div>
        ` : html`
          <div class="card row">
            ${this._cardIcon}
            <div class="column">${this._renderDefault}</div>
          </div>
        `;
    }

    get _renderDefault() {
      return html`
      <div class="details">
        <div class="row">
          <div class="wrapper-name">
            <span class="name">${this.name}</span>
          </div>
          <bbva-amount
            class="amount"
            .amount=${this.amount}
            variant="${this.amountSize}"
            currency-code="${this.currencyCode}"
            local-currency="${this.localCurrency}"
          ></bbva-amount>
        </div>
        <div class="row">
          <slot name="number"></slot>
          ${BbvaListMultistep._renderDescription()}
        </div>
        <div class="row">
          <slot name="details"></slot>
        </div>
      </div>
    `;
    }

    static _renderDescription() {
      return html`
      <slot name="description"></slot>
    `;
    }

    get _renderLayout() {
      let layout = null;

      switch (this.layout) {
        case LAYOUT.AMOUNT:
          layout = this._renderAmount;
          break;

        case LAYOUT.CARD:
          layout = this._renderCreditCard;
          break;

        case LAYOUT.CONTACT:
          layout = this._renderContact;
          break;

        case LAYOUT.DESCRIPTION:
          layout = BbvaListMultistep._renderDescription();
          break;

        default:
          layout = this._renderDefault;
      }

      return layout;
    }

    render() {
      return html`
      <slot></slot>
      <div class="content">
        ${this._renderLayout}
      </div>
    `;
    }

  }
  customElements.define(BbvaListMultistep.is, BbvaListMultistep);

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

  var styles$d = css`:host {
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
      return [styles$d, getComponentSharedStyles('cells-button-shared-styles')];
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

  var styles$e = css`:host {
  position: relative;
  width: auto;
  max-width: 100%;
  min-width: var(--bbva-button-default-min-width, 8.75rem);
  min-height: 3rem;
  padding: 0 calc(((4 * var(--gridSpacerVariant, var(--gridSpacer, ${unsafeCSS(grid.spacer)}))) / 15) * 1em);
  font-size: var(--bbva-button-default-font-size, var(--typographyTypeSmall, ${unsafeCSS(typography.typeSmall)}));
  line-height: var(--bbva-button-default-line-height, var(--lineHeightTypeSmall, ${unsafeCSS(lineHeight.typeSmall)}));
  font-weight: var(--bbva-button-default-font-weight, var(--fontFacePrimaryMediumFontWeight, ${unsafeCSS(fontFacePrimary.medium.fontWeight)}));
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  border: 1px solid var(--_border-color);
  border-radius: var(--bbva-button-default-border-radius, var(--borderRadiusSmall, ${unsafeCSS(borderRadius.small)}));
  background-color: var(--_bg-color);
  color: var(--_color);
  opacity: var(--_opacity);
  transition: background-color var(--fast-transition, 0.2s), color var(--fast-transition, 0.2s); }

:host([hidden]),
[hidden] {
  display: none !important; }

*,
*:before,
*:after {
  box-sizing: inherit; }

:host(:focus) {
  outline: none; }

:host(.full-width) {
  flex-grow: 1;
  width: 100%;
  min-width: 0; }

:host([disabled]) {
  color: var(--_color); }

:host,
:host(.primary),
:host([variant='primary']) {
  --_color: var(--bbva-button-default-color,var(--colorsPrimaryCoreLightened, ${unsafeCSS(colors.primaryCoreLightened)}));
  --_bg-color: var(--bbva-button-default-bg-color,var(--colorsPrimaryMedium, ${unsafeCSS(colors.primaryMedium)}));
  --_border-color: var(--bbva-button-default-border-color, transparent);
  --_opacity: var(--bbva-button-default-opacity, 1); }

:host([active]),
:host(.primary[active]),
:host([variant='primary'][active]) {
  --_color: var(--bbva-button-default-color-active,var(--colorsPrimaryCoreLightened, ${unsafeCSS(colors.primaryCoreLightened)}));
  --_bg-color: var(--bbva-button-default-bg-color-active,var(--colorsPrimaryCoreLight, ${unsafeCSS(colors.primaryCoreLight)}));
  --_border-color: var(--bbva-button-default-border-color-active, transparent);
  --_opacity: var(--bbva-button-default-opacity-active, 1); }

:host([disabled]),
:host(.primary[disabled]),
:host([variant='primary'][disabled]) {
  --_color: var(--bbva-button-default-color-disabled,var(--colorsSecondary400, ${unsafeCSS(colors.secondary400)}));
  --_bg-color: var(--bbva-button-default-bg-color-disabled,var(--colorsSecondary200, ${unsafeCSS(colors.secondary200)}));
  --_border-color: var(--bbva-button-default-border-color-disabled, transparent);
  --_opacity: var(--bbva-button-default-opacity-disabled, 1); }

:host(.secondary),
:host([variant='secondary']) {
  --_color: var(--bbva-button-default-secondary-color,var(--colorsPrimaryMedium, ${unsafeCSS(colors.primaryMedium)}));
  --_bg-color: var(--bbva-button-default-secondary-bg-color, transparent);
  --_border-color: var(--bbva-button-default-secondary-border-color,var(--colorsSecondary300, ${unsafeCSS(colors.secondary300)}));
  --_opacity: var(--bbva-button-default-secondary-opacity, 1); }

:host(.secondary[active]),
:host([variant='secondary'][active]) {
  --_color: var(--bbva-button-default-secondary-color-active,var(--colorsPrimaryMedium, ${unsafeCSS(colors.primaryMedium)}));
  --_bg-color: var(--bbva-button-default-secondary-bg-color-active,var(--colorsSecondary100, ${unsafeCSS(colors.secondary100)}));
  --_border-color: var(--bbva-button-default-secondary-border-color-active, transparent);
  --_opacity: var(--bbva-button-default-secondary-opacity-active, 1); }

:host(.secondary[disabled]),
:host([variant='secondary'][disabled]) {
  --_color: var(--bbva-button-default-secondary-color-disabled,var(--colorsSecondary400, ${unsafeCSS(colors.secondary400)}));
  --_bg-color: var(--bbva-button-default-secondary-bg-color-disabled,var(--colorsSecondary200, ${unsafeCSS(colors.secondary200)}));
  --_border-color: var(--bbva-button-default-secondary-border-color-disabled, transparent);
  --_opacity: var(--bbva-button-default-secondary-opacity-disabled, 0.4); }

:host(.positive),
:host([variant='positive']) {
  --_color: var(--bbva-button-default-positive-color,var(--colorsPrimaryCoreLightened, ${unsafeCSS(colors.primaryCoreLightened)}));
  --_bg-color: var(--bbva-button-default-positive-bg-color,var(--colorsPrimaryVariantDark, ${unsafeCSS(colors.primaryVariantDark)}));
  --_border-color: var(--bbva-button-default-positive-border-color, transparent);
  --_opacity: var(--bbva-button-default-positive-opacity, 1); }

:host(.positive[active]),
:host([variant='positive'][active]) {
  --_color: var(--bbva-button-default-positive-color-active,var(--colorsPrimaryCoreLightened, ${unsafeCSS(colors.primaryCoreLightened)}));
  --_bg-color: var(--bbva-button-default-positive-bg-color-active,var(--colorsPrimaryVariant, ${unsafeCSS(colors.primaryVariant)}));
  --_border-color: var(--bbva-button-default-positive-border-color-active, transparent);
  --_opacity: var(--bbva-button-default-positive-opacity-active, 1); }

:host(.positive[disabled]),
:host([variant='positive'][disabled]) {
  --_color: var(--bbva-button-default-positive-color-disabled,var(--colorsSecondary400, ${unsafeCSS(colors.secondary400)}));
  --_bg-color: var(--bbva-button-default-positive-bg-color-disabled,var(--colorsSecondary200, ${unsafeCSS(colors.secondary200)}));
  --_border-color: var(--bbva-button-default-positive-border-color-disabled, transparent);
  --_opacity: var(--bbva-button-default-positive-opacity-disabled, 0.4); }
`;

  css`[ambient^='light'] {
  --bbva-button-default-color: var(--colorsPrimaryCoreLightened, ${unsafeCSS(colors.primaryCoreLightened)});
  --bbva-button-default-bg-color: var(--colorsPrimaryMedium, ${unsafeCSS(colors.primaryMedium)});
  --bbva-button-default-border-color: transparent;
  --bbva-button-default-opacity: 1;
  --bbva-button-default-color-active: var(--colorsPrimaryCoreLightened, ${unsafeCSS(colors.primaryCoreLightened)});
  --bbva-button-default-bg-color-active: var(--colorsPrimaryCoreLight, ${unsafeCSS(colors.primaryCoreLight)});
  --bbva-button-default-border-color-active: transparent;
  --bbva-button-default-opacity-active: 1;
  --bbva-button-default-color-disabled: var(--colorsSecondary400, ${unsafeCSS(colors.secondary400)});
  --bbva-button-default-bg-color-disabled: var(--colorsSecondary200, ${unsafeCSS(colors.secondary200)});
  --bbva-button-default-border-color-disabled: transparent;
  --bbva-button-default-opacity-disabled: 1;
  --bbva-button-default-secondary-color: var(--colorsPrimaryMedium, ${unsafeCSS(colors.primaryMedium)});
  --bbva-button-default-secondary-bg-color: transparent;
  --bbva-button-default-secondary-border-color: var(--colorsSecondary300, ${unsafeCSS(colors.secondary300)});
  --bbva-button-default-secondary-opacity: 1;
  --bbva-button-default-secondary-color-active: var(--colorsPrimaryMedium, ${unsafeCSS(colors.primaryMedium)});
  --bbva-button-default-secondary-bg-color-active: var(--colorsSecondary100, ${unsafeCSS(colors.secondary100)});
  --bbva-button-default-secondary-border-color-active: transparent;
  --bbva-button-default-secondary-opacity-active: 1;
  --bbva-button-default-secondary-color-disabled: var(--colorsSecondary400, ${unsafeCSS(colors.secondary400)});
  --bbva-button-default-secondary-bg-color-disabled: var(--colorsSecondary200, ${unsafeCSS(colors.secondary200)});
  --bbva-button-default-secondary-border-color-disabled: transparent;
  --bbva-button-default-secondary-opacity-disabled: 0.4;
  --bbva-button-default-positive-color: var(--colorsPrimaryCoreLightened, ${unsafeCSS(colors.primaryCoreLightened)});
  --bbva-button-default-positive-bg-color: var(--colorsPrimaryVariantDark, ${unsafeCSS(colors.primaryVariantDark)});
  --bbva-button-default-positive-border-color: transparent;
  --bbva-button-default-positive-opacity: 1;
  --bbva-button-default-positive-color-active: var(--colorsPrimaryCoreLightened, ${unsafeCSS(colors.primaryCoreLightened)});
  --bbva-button-default-positive-bg-color-active: var(--colorsPrimaryVariant, ${unsafeCSS(colors.primaryVariant)});
  --bbva-button-default-positive-border-color-active: transparent;
  --bbva-button-default-positive-opacity-active: 1;
  --bbva-button-default-positive-color-disabled: var(--colorsSecondary400, ${unsafeCSS(colors.secondary400)});
  --bbva-button-default-positive-bg-color-disabled: var(--colorsSecondary200, ${unsafeCSS(colors.secondary200)});
  --bbva-button-default-positive-border-color-disabled: transparent;
  --bbva-button-default-positive-opacity-disabled: 0.4; }
`;

  css`[ambient^='dark'] {
  --bbva-button-default-color: var(--colorsPrimaryCoreLightened, ${unsafeCSS(colors.primaryCoreLightened)});
  --bbva-button-default-bg-color: var(--colorsPrimaryMedium, ${unsafeCSS(colors.primaryMedium)});
  --bbva-button-default-border-color: transparent;
  --bbva-button-default-opacity: 1;
  --bbva-button-default-color: var(--colorsPrimaryCoreLightened, ${unsafeCSS(colors.primaryCoreLightened)});
  --bbva-button-default-bg-color-active: var(--colorsPrimaryCoreLight, ${unsafeCSS(colors.primaryCoreLight)});
  --bbva-button-default-border-color-active: transparent;
  --bbva-button-default-opacity-active: 1;
  --bbva-button-default-color-disabled: var(--colorsPrimaryCoreLightened, ${unsafeCSS(colors.primaryCoreLightened)});
  --bbva-button-default-bg-color-disabled: var(--colorsPrimaryMedium, ${unsafeCSS(colors.primaryMedium)});
  --bbva-button-default-border-color-disabled: transparent;
  --bbva-button-default-opacity-disabled: 0.4;
  --bbva-button-default-secondary-color: var(--colorsPrimaryCoreLightened, ${unsafeCSS(colors.primaryCoreLightened)});
  --bbva-button-default-secondary-bg-color: transparent;
  --bbva-button-default-secondary-border-color: var(--colorsPrimaryCoreLightened, ${unsafeCSS(colors.primaryCoreLightened)});
  --bbva-button-default-secondary-opacity: 1;
  --bbva-button-default-secondary-color-active: var(--colorsPrimaryMedium, ${unsafeCSS(colors.primaryMedium)});
  --bbva-button-default-secondary-bg-color-active: var(--colorsPrimaryCoreLightened, ${unsafeCSS(colors.primaryCoreLightened)});
  --bbva-button-default-secondary-border-color-active: transparent;
  --bbva-button-default-secondary-opacity-active: 1;
  --bbva-button-default-secondary-color-disabled: var(--colorsSecondary400, ${unsafeCSS(colors.secondary400)});
  --bbva-button-default-secondary-bg-color-disabled: var(--colorsSecondary300, ${unsafeCSS(colors.secondary300)});
  --bbva-button-default-secondary-border-color-disabled: transparent;
  --bbva-button-default-secondary-opacity-disabled: 0.4;
  --bbva-button-default-positive-color: var(--colorsPrimaryCoreLightened, ${unsafeCSS(colors.primaryCoreLightened)});
  --bbva-button-default-positive-bg-color: var(--colorsPrimaryVariantDark, ${unsafeCSS(colors.primaryVariantDark)});
  --bbva-button-default-positive-border-color: transparent;
  --bbva-button-default-positive-opacity: 1;
  --bbva-button-default-positive-color-active: var(--colorsPrimaryCoreLightened, ${unsafeCSS(colors.primaryCoreLightened)});
  --bbva-button-default-positive-bg-color-active: var(--colorsPrimaryVariant, ${unsafeCSS(colors.primaryVariant)});
  --bbva-button-default-positive-border-color-active: transparent;
  --bbva-button-default-positive-opacity-active: 1;
  --bbva-button-default-positive-color-disabled: var(--colorsSecondary400, ${unsafeCSS(colors.secondary400)});
  --bbva-button-default-positive-bg-color-disabled: var(--colorsSecondary200, ${unsafeCSS(colors.secondary200)});
  --bbva-button-default-positive-border-color-disabled: transparent;
  --bbva-button-default-positive-opacity-disabled: 0.4; }

[ambient='dark100'] {
  --bbva-button-default-bg-color: var(--colorsPrimaryCore, ${unsafeCSS(colors.primaryCore)});
  --bbva-button-default-bg-color-active: var(--colorsPrimaryCoreDark, ${unsafeCSS(colors.primaryCoreDark)});
  --bbva-button-default-bg-color-disabled: var(--colorsPrimaryCore, ${unsafeCSS(colors.primaryCore)});
  --bbva-button-default-secondary-color-active: var(--colorsPrimaryMedium, ${unsafeCSS(colors.primaryMedium)});
  --bbva-button-default-secondary-bg-color-active: var(--colorsPrimaryCoreLightened, ${unsafeCSS(colors.primaryCoreLightened)});
  --bbva-button-default-secondary-opacity-active: 1; }
`;

  /**
  Default button with primary, secondary and positive types.

  Example:
  ```html
  <bbva-button-default
    text="Primary">
  </bbva-button-default>

  <bbva-button-default
    class="secondary"
    text="Secondary">
  </bbva-button-default>

  <bbva-button-default
    class="positive"
    text="Positive">
  </bbva-button-default>
  ```

  ## Styling

  The following custom properties are available for styling:

  ### Custom properties

  | Selector                               | CSS Property     | CSS Variable                                          | Theme Variable                    | Foundations/Fallback                                        |
  | -------------------------------------- | ---------------- | ----------------------------------------------------- | --------------------------------- | ----------------------------------------------------------- |
  | :host(.positive[disabled])             | --_color         | --bbva-button-default-positive-color-disabled         | --colorsSecondary400              | foundations.colors.secondary400               |
  | :host([variant='positive'][disabled])  | --_color         | --bbva-button-default-positive-color-disabled         | --colorsSecondary400              | foundations.colors.secondary400               |
  | :host(.positive[disabled])             | --_bg-color      | --bbva-button-default-positive-bg-color-disabled      | --colorsSecondary200              | foundations.colors.secondary200               |
  | :host([variant='positive'][disabled])  | --_bg-color      | --bbva-button-default-positive-bg-color-disabled      | --colorsSecondary200              | foundations.colors.secondary200               |
  | :host(.positive[disabled])             | --_border-color  | --bbva-button-default-positive-border-color-disabled  |                                   | transparent                                                 |
  | :host([variant='positive'][disabled])  | --_border-color  | --bbva-button-default-positive-border-color-disabled  |                                   | transparent                                                 |
  | :host(.positive[disabled])             | --_opacity       | --bbva-button-default-positive-opacity-disabled       |                                   | 0.4                                                         |
  | :host([variant='positive'][disabled])  | --_opacity       | --bbva-button-default-positive-opacity-disabled       |                                   | 0.4                                                         |
  | :host(.positive[active])               | --_color         | --bbva-button-default-positive-color-active           | --colorsPrimaryCoreLightened      | foundations.colors.primaryCoreLightened       |
  | :host([variant='positive'][active])    | --_color         | --bbva-button-default-positive-color-active           | --colorsPrimaryCoreLightened      | foundations.colors.primaryCoreLightened       |
  | :host(.positive[active])               | --_bg-color      | --bbva-button-default-positive-bg-color-active        | --colorsPrimaryVariant            | foundations.colors.primaryVariant             |
  | :host([variant='positive'][active])    | --_bg-color      | --bbva-button-default-positive-bg-color-active        | --colorsPrimaryVariant            | foundations.colors.primaryVariant             |
  | :host(.positive[active])               | --_border-color  | --bbva-button-default-positive-border-color-active    |                                   | transparent                                                 |
  | :host([variant='positive'][active])    | --_border-color  | --bbva-button-default-positive-border-color-active    |                                   | transparent                                                 |
  | :host(.positive[active])               | --_opacity       | --bbva-button-default-positive-opacity-active         |                                   | 1                                                           |
  | :host([variant='positive'][active])    | --_opacity       | --bbva-button-default-positive-opacity-active         |                                   | 1                                                           |
  | :host(.positive)                       | --_color         | --bbva-button-default-positive-color                  | --colorsPrimaryCoreLightened      | foundations.colors.primaryCoreLightened       |
  | :host([variant='positive'])            | --_color         | --bbva-button-default-positive-color                  | --colorsPrimaryCoreLightened      | foundations.colors.primaryCoreLightened       |
  | :host(.positive)                       | --_bg-color      | --bbva-button-default-positive-bg-color               | --colorsPrimaryVariantDark        | foundations.colors.primaryVariantDark         |
  | :host([variant='positive'])            | --_bg-color      | --bbva-button-default-positive-bg-color               | --colorsPrimaryVariantDark        | foundations.colors.primaryVariantDark         |
  | :host(.positive)                       | --_border-color  | --bbva-button-default-positive-border-color           |                                   | transparent                                                 |
  | :host([variant='positive'])            | --_border-color  | --bbva-button-default-positive-border-color           |                                   | transparent                                                 |
  | :host(.positive)                       | --_opacity       | --bbva-button-default-positive-opacity                |                                   | 1                                                           |
  | :host([variant='positive'])            | --_opacity       | --bbva-button-default-positive-opacity                |                                   | 1                                                           |
  | :host(.secondary[disabled])            | --_color         | --bbva-button-default-secondary-color-disabled        | --colorsSecondary400              | foundations.colors.secondary400               |
  | :host([variant='secondary'][disabled]) | --_color         | --bbva-button-default-secondary-color-disabled        | --colorsSecondary400              | foundations.colors.secondary400               |
  | :host(.secondary[disabled])            | --_bg-color      | --bbva-button-default-secondary-bg-color-disabled     | --colorsSecondary200              | foundations.colors.secondary200               |
  | :host([variant='secondary'][disabled]) | --_bg-color      | --bbva-button-default-secondary-bg-color-disabled     | --colorsSecondary200              | foundations.colors.secondary200               |
  | :host(.secondary[disabled])            | --_border-color  | --bbva-button-default-secondary-border-color-disabled |                                   | transparent                                                 |
  | :host([variant='secondary'][disabled]) | --_border-color  | --bbva-button-default-secondary-border-color-disabled |                                   | transparent                                                 |
  | :host(.secondary[disabled])            | --_opacity       | --bbva-button-default-secondary-opacity-disabled      |                                   | 0.4                                                         |
  | :host([variant='secondary'][disabled]) | --_opacity       | --bbva-button-default-secondary-opacity-disabled      |                                   | 0.4                                                         |
  | :host(.secondary[active])              | --_color         | --bbva-button-default-secondary-color-active          | --colorsPrimaryMedium             | foundations.colors.primaryMedium              |
  | :host([variant='secondary'][active])   | --_color         | --bbva-button-default-secondary-color-active          | --colorsPrimaryMedium             | foundations.colors.primaryMedium              |
  | :host(.secondary[active])              | --_bg-color      | --bbva-button-default-secondary-bg-color-active       | --colorsSecondary100              | foundations.colors.secondary100               |
  | :host([variant='secondary'][active])   | --_bg-color      | --bbva-button-default-secondary-bg-color-active       | --colorsSecondary100              | foundations.colors.secondary100               |
  | :host(.secondary[active])              | --_border-color  | --bbva-button-default-secondary-border-color-active   |                                   | transparent                                                 |
  | :host([variant='secondary'][active])   | --_border-color  | --bbva-button-default-secondary-border-color-active   |                                   | transparent                                                 |
  | :host(.secondary[active])              | --_opacity       | --bbva-button-default-secondary-opacity-active        |                                   | 1                                                           |
  | :host([variant='secondary'][active])   | --_opacity       | --bbva-button-default-secondary-opacity-active        |                                   | 1                                                           |
  | :host(.secondary)                      | --_color         | --bbva-button-default-secondary-color                 | --colorsPrimaryMedium             | foundations.colors.primaryMedium              |
  | :host([variant='secondary'])           | --_color         | --bbva-button-default-secondary-color                 | --colorsPrimaryMedium             | foundations.colors.primaryMedium              |
  | :host(.secondary)                      | --_bg-color      | --bbva-button-default-secondary-bg-color              |                                   | transparent                                                 |
  | :host([variant='secondary'])           | --_bg-color      | --bbva-button-default-secondary-bg-color              |                                   | transparent                                                 |
  | :host(.secondary)                      | --_border-color  | --bbva-button-default-secondary-border-color          | --colorsSecondary300              | foundations.colors.secondary300               |
  | :host([variant='secondary'])           | --_border-color  | --bbva-button-default-secondary-border-color          | --colorsSecondary300              | foundations.colors.secondary300               |
  | :host(.secondary)                      | --_opacity       | --bbva-button-default-secondary-opacity               |                                   | 1                                                           |
  | :host([variant='secondary'])           | --_opacity       | --bbva-button-default-secondary-opacity               |                                   | 1                                                           |
  | :host([disabled])                      | --_color         | --bbva-button-default-color-disabled                  | --colorsSecondary400              | foundations.colors.secondary400               |
  | :host(.primary[disabled])              | --_color         | --bbva-button-default-color-disabled                  | --colorsSecondary400              | foundations.colors.secondary400               |
  | :host([variant='primary'][disabled])   | --_color         | --bbva-button-default-color-disabled                  | --colorsSecondary400              | foundations.colors.secondary400               |
  | :host([disabled])                      | --_bg-color      | --bbva-button-default-bg-color-disabled               | --colorsSecondary200              | foundations.colors.secondary200               |
  | :host(.primary[disabled])              | --_bg-color      | --bbva-button-default-bg-color-disabled               | --colorsSecondary200              | foundations.colors.secondary200               |
  | :host([variant='primary'][disabled])   | --_bg-color      | --bbva-button-default-bg-color-disabled               | --colorsSecondary200              | foundations.colors.secondary200               |
  | :host([disabled])                      | --_border-color  | --bbva-button-default-border-color-disabled           |                                   | transparent                                                 |
  | :host(.primary[disabled])              | --_border-color  | --bbva-button-default-border-color-disabled           |                                   | transparent                                                 |
  | :host([variant='primary'][disabled])   | --_border-color  | --bbva-button-default-border-color-disabled           |                                   | transparent                                                 |
  | :host([disabled])                      | --_opacity       | --bbva-button-default-opacity-disabled                |                                   | 1                                                           |
  | :host(.primary[disabled])              | --_opacity       | --bbva-button-default-opacity-disabled                |                                   | 1                                                           |
  | :host([variant='primary'][disabled])   | --_opacity       | --bbva-button-default-opacity-disabled                |                                   | 1                                                           |
  | :host([active])                        | --_color         | --bbva-button-default-color-active                    | --colorsPrimaryCoreLightened      | foundations.colors.primaryCoreLightened       |
  | :host(.primary[active])                | --_color         | --bbva-button-default-color-active                    | --colorsPrimaryCoreLightened      | foundations.colors.primaryCoreLightened       |
  | :host([variant='primary'][active])     | --_color         | --bbva-button-default-color-active                    | --colorsPrimaryCoreLightened      | foundations.colors.primaryCoreLightened       |
  | :host([active])                        | --_bg-color      | --bbva-button-default-bg-color-active                 | --colorsPrimaryCoreLight          | foundations.colors.primaryCoreLight           |
  | :host(.primary[active])                | --_bg-color      | --bbva-button-default-bg-color-active                 | --colorsPrimaryCoreLight          | foundations.colors.primaryCoreLight           |
  | :host([variant='primary'][active])     | --_bg-color      | --bbva-button-default-bg-color-active                 | --colorsPrimaryCoreLight          | foundations.colors.primaryCoreLight           |
  | :host([active])                        | --_border-color  | --bbva-button-default-border-color-active             |                                   | transparent                                                 |
  | :host(.primary[active])                | --_border-color  | --bbva-button-default-border-color-active             |                                   | transparent                                                 |
  | :host([variant='primary'][active])     | --_border-color  | --bbva-button-default-border-color-active             |                                   | transparent                                                 |
  | :host([active])                        | --_opacity       | --bbva-button-default-opacity-active                  |                                   | 1                                                           |
  | :host(.primary[active])                | --_opacity       | --bbva-button-default-opacity-active                  |                                   | 1                                                           |
  | :host([variant='primary'][active])     | --_opacity       | --bbva-button-default-opacity-active                  |                                   | 1                                                           |
  | :host                                  | --_color         | --bbva-button-default-color                           | --colorsPrimaryCoreLightened      | foundations.colors.primaryCoreLightened       |
  | :host(.primary)                        | --_color         | --bbva-button-default-color                           | --colorsPrimaryCoreLightened      | foundations.colors.primaryCoreLightened       |
  | :host([variant='primary'])             | --_color         | --bbva-button-default-color                           | --colorsPrimaryCoreLightened      | foundations.colors.primaryCoreLightened       |
  | :host                                  | --_bg-color      | --bbva-button-default-bg-color                        | --colorsPrimaryMedium             | foundations.colors.primaryMedium              |
  | :host(.primary)                        | --_bg-color      | --bbva-button-default-bg-color                        | --colorsPrimaryMedium             | foundations.colors.primaryMedium              |
  | :host([variant='primary'])             | --_bg-color      | --bbva-button-default-bg-color                        | --colorsPrimaryMedium             | foundations.colors.primaryMedium              |
  | :host                                  | --_border-color  | --bbva-button-default-border-color                    |                                   | transparent                                                 |
  | :host(.primary)                        | --_border-color  | --bbva-button-default-border-color                    |                                   | transparent                                                 |
  | :host([variant='primary'])             | --_border-color  | --bbva-button-default-border-color                    |                                   | transparent                                                 |
  | :host                                  | --_opacity       | --bbva-button-default-opacity                         |                                   | 1                                                           |
  | :host(.primary)                        | --_opacity       | --bbva-button-default-opacity                         |                                   | 1                                                           |
  | :host([variant='primary'])             | --_opacity       | --bbva-button-default-opacity                         |                                   | 1                                                           |
  | :host([disabled])                      | color            | --_color                                              |                                   |                                                             |
  | :host                                  | min-width        | --bbva-button-default-min-width                       |                                   | 8.75rem                                                     |
  | :host                                  | padding          | --gridSpacerVariant                                   | --gridSpacer                      | foundations.grid.spacer                       |
  | :host                                  | font-size        | --bbva-button-default-font-size                       | --typographyTypeSmall             | foundations.typography.typeSmall              |
  | :host                                  | line-height      | --bbva-button-default-line-height                     | --lineHeightTypeSmall             | foundations.lineHeight.typeSmall              |
  | :host                                  | font-weight      | --bbva-button-default-font-weight                     | --fontFacePrimaryMediumFontWeight | foundations.fontFacePrimary.medium.fontWeight |
  | :host                                  | border           | --_border-color                                       |                                   |                                                             |
  | :host                                  | border-radius    | --bbva-button-default-border-radius                   | --borderRadiusSmall               | foundations.borderRadius.small                |
  | :host                                  | background-color | --_bg-color                                           |                                   |                                                             |
  | :host                                  | color            | --_color                                              |                                   |                                                             |
  | :host                                  | opacity          | --_opacity                                            |                                   |                                                             |
  | :host                                  | transition       | --fast-transition                                     |                                   | 0.2s                                                        |

  ## Ambient

  ### Custom properties

  | Selector            | CSS Property                                      | CSS Variable | Theme Variable               | Foundations/Fallback                                  |
  | ------------------- | ------------------------------------------------- | ------------ | ---------------------------- | ----------------------------------------------------- |
  | [ambient='dark100'] | --bbva-button-default-bg-color                    |              | --colorsPrimaryCore          | foundations.colors.primaryCore          |
  | [ambient='dark100'] | --bbva-button-default-bg-color-active             |              | --colorsPrimaryCoreDark      | foundations.colors.primaryCoreDark      |
  | [ambient='dark100'] | --bbva-button-default-bg-color-disabled           |              | --colorsPrimaryCore          | foundations.colors.primaryCore          |
  | [ambient='dark100'] | --bbva-button-default-secondary-color-active      |              | --colorsPrimaryMedium        | foundations.colors.primaryMedium        |
  | [ambient='dark100'] | --bbva-button-default-secondary-bg-color-active   |              | --colorsPrimaryCoreLightened | foundations.colors.primaryCoreLightened |
  | [ambient^='dark']   | --bbva-button-default-color                       |              | --colorsPrimaryCoreLightened | foundations.colors.primaryCoreLightened |
  | [ambient^='dark']   | --bbva-button-default-bg-color                    |              | --colorsPrimaryMedium        | foundations.colors.primaryMedium        |
  | [ambient^='dark']   | --bbva-button-default-color                       |              | --colorsPrimaryCoreLightened | foundations.colors.primaryCoreLightened |
  | [ambient^='dark']   | --bbva-button-default-bg-color-active             |              | --colorsPrimaryCoreLight     | foundations.colors.primaryCoreLight     |
  | [ambient^='dark']   | --bbva-button-default-color-disabled              |              | --colorsPrimaryCoreLightened | foundations.colors.primaryCoreLightened |
  | [ambient^='dark']   | --bbva-button-default-bg-color-disabled           |              | --colorsPrimaryMedium        | foundations.colors.primaryMedium        |
  | [ambient^='dark']   | --bbva-button-default-secondary-color             |              | --colorsPrimaryCoreLightened | foundations.colors.primaryCoreLightened |
  | [ambient^='dark']   | --bbva-button-default-secondary-border-color      |              | --colorsPrimaryCoreLightened | foundations.colors.primaryCoreLightened |
  | [ambient^='dark']   | --bbva-button-default-secondary-color-active      |              | --colorsPrimaryMedium        | foundations.colors.primaryMedium        |
  | [ambient^='dark']   | --bbva-button-default-secondary-bg-color-active   |              | --colorsPrimaryCoreLightened | foundations.colors.primaryCoreLightened |
  | [ambient^='dark']   | --bbva-button-default-secondary-color-disabled    |              | --colorsSecondary400         | foundations.colors.secondary400         |
  | [ambient^='dark']   | --bbva-button-default-secondary-bg-color-disabled |              | --colorsSecondary300         | foundations.colors.secondary300         |
  | [ambient^='dark']   | --bbva-button-default-positive-color              |              | --colorsPrimaryCoreLightened | foundations.colors.primaryCoreLightened |
  | [ambient^='dark']   | --bbva-button-default-positive-bg-color           |              | --colorsPrimaryVariantDark   | foundations.colors.primaryVariantDark   |
  | [ambient^='dark']   | --bbva-button-default-positive-color-active       |              | --colorsPrimaryCoreLightened | foundations.colors.primaryCoreLightened |
  | [ambient^='dark']   | --bbva-button-default-positive-bg-color-active    |              | --colorsPrimaryVariant       | foundations.colors.primaryVariant       |
  | [ambient^='dark']   | --bbva-button-default-positive-color-disabled     |              | --colorsSecondary400         | foundations.colors.secondary400         |
  | [ambient^='dark']   | --bbva-button-default-positive-bg-color-disabled  |              | --colorsSecondary200         | foundations.colors.secondary200         |

  ### Custom properties

  | Selector           | CSS Property                                      | CSS Variable | Theme Variable               | Foundations/Fallback                                  |
  | ------------------ | ------------------------------------------------- | ------------ | ---------------------------- | ----------------------------------------------------- |
  | [ambient^='light'] | --bbva-button-default-color                       |              | --colorsPrimaryCoreLightened | foundations.colors.primaryCoreLightened |
  | [ambient^='light'] | --bbva-button-default-bg-color                    |              | --colorsPrimaryMedium        | foundations.colors.primaryMedium        |
  | [ambient^='light'] | --bbva-button-default-color-active                |              | --colorsPrimaryCoreLightened | foundations.colors.primaryCoreLightened |
  | [ambient^='light'] | --bbva-button-default-bg-color-active             |              | --colorsPrimaryCoreLight     | foundations.colors.primaryCoreLight     |
  | [ambient^='light'] | --bbva-button-default-color-disabled              |              | --colorsSecondary400         | foundations.colors.secondary400         |
  | [ambient^='light'] | --bbva-button-default-bg-color-disabled           |              | --colorsSecondary200         | foundations.colors.secondary200         |
  | [ambient^='light'] | --bbva-button-default-secondary-color             |              | --colorsPrimaryMedium        | foundations.colors.primaryMedium        |
  | [ambient^='light'] | --bbva-button-default-secondary-border-color      |              | --colorsSecondary300         | foundations.colors.secondary300         |
  | [ambient^='light'] | --bbva-button-default-secondary-color-active      |              | --colorsPrimaryMedium        | foundations.colors.primaryMedium        |
  | [ambient^='light'] | --bbva-button-default-secondary-bg-color-active   |              | --colorsSecondary100         | foundations.colors.secondary100         |
  | [ambient^='light'] | --bbva-button-default-secondary-color-disabled    |              | --colorsSecondary400         | foundations.colors.secondary400         |
  | [ambient^='light'] | --bbva-button-default-secondary-bg-color-disabled |              | --colorsSecondary200         | foundations.colors.secondary200         |
  | [ambient^='light'] | --bbva-button-default-positive-color              |              | --colorsPrimaryCoreLightened | foundations.colors.primaryCoreLightened |
  | [ambient^='light'] | --bbva-button-default-positive-bg-color           |              | --colorsPrimaryVariantDark   | foundations.colors.primaryVariantDark   |
  | [ambient^='light'] | --bbva-button-default-positive-color-active       |              | --colorsPrimaryCoreLightened | foundations.colors.primaryCoreLightened |
  | [ambient^='light'] | --bbva-button-default-positive-bg-color-active    |              | --colorsPrimaryVariant       | foundations.colors.primaryVariant       |
  | [ambient^='light'] | --bbva-button-default-positive-color-disabled     |              | --colorsSecondary400         | foundations.colors.secondary400         |
  | [ambient^='light'] | --bbva-button-default-positive-bg-color-disabled  |              | --colorsSecondary200         | foundations.colors.secondary200         |
  > Styling documentation generated by Cells CLI

  @customElement bbva-button-default
  @polymer
  @LitElement
  @demo demo/index.html
  */

  class BbvaButtonDefault extends CellsButton {
    static get is() {
      return 'bbva-button-default';
    }

    static get properties() {
      return {
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
      this.type = 'button';
    }

    static get styles() {
      return [super.styles, styles$e, getComponentSharedStyles('bbva-button-default-shared-styles')];
    }

    render() {
      return html`
      ${this.text ? html`
            <span>${this.text}</span>
          ` : html`
            <slot></slot>
          `}
      ${this._button}
    `;
    }

  }
  customElements.define(BbvaButtonDefault.is, BbvaButtonDefault);

  var styles$f = css`:host {
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

  class CellsIcon$4 extends LitElement {
    static get is() {
      return 'cells-icon';
    }

    static get styles() {
      return [styles$f, getComponentSharedStyles('cells-icon-shared-styles')];
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
  customElements.define(CellsIcon$4.is, CellsIcon$4);

  var styles$g = css`:host {
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
      return [super.styles, styles$g, getComponentSharedStyles('bbva-link-shared-styles')];
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

  var styles$h = css`:host {
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

  class CellsIcon$5 extends LitElement {
    static get is() {
      return 'cells-icon';
    }

    static get styles() {
      return [styles$h, getComponentSharedStyles('cells-icon-shared-styles')];
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
  customElements.define(CellsIcon$5.is, CellsIcon$5);

  var styles$i = css`:host {
  display: block;
  box-sizing: border-box;
  position: relative;
  padding: 0 0 calc(((1 * var(--gridSpacerVariant, var(--gridSpacer, ${unsafeCSS(grid.spacer)}))) / 16) * 1em) calc(((3 * var(--gridSpacerVariant, var(--gridSpacer, ${unsafeCSS(grid.spacer)}))) / 16) * 1em);
  color: var(--bbva-list-bullet-color, var(--bbva-600, #121212));
  font-size: var(--typographyTypeSmall, ${unsafeCSS(typography.typeSmall)});
  line-height: var(--lineHeightTypeSmall, ${unsafeCSS(lineHeight.typeSmall)}); }

.icon {
  position: absolute;
  top: 0;
  left: 0;
  color: var(--bbva-list-bullet-icon-color, var(--bbva-medium-blue, #1973b8)); }

:host([hidden]),
[hidden] {
  display: none !important; }

*,
*:before,
*:after {
  box-sizing: inherit; }

:host(.transparent) {
  background: none;
  --bbva-list-bullet-icon-color: var(--bbva-aqua, #2dcccd);
  --bbva-list-bullet-color: var(--bbva-white, #ffffff); }
`;

  /**
  Text with a bullet icon such as an element of list with a dash

  Example:
  ```html
  <bbva-list-bullet>hello  item</bbva-list-bullet>
  ```

  To reset the html list styles use the bbva-list-bullet-ul-styles.js included in the component
  ```html

  <template>
    <ul></ul>
    <script type="module">
        import styles from '../bbva-list-bullet-ul-styles.js';
        import {html, render} from '../../../../node_modules/lit-html/lit-html.js';
        const items = ['blue', 'red'];
        const bulletTemplate = (items) => html`
          <style>styles,</style>
          ${items.map((item, i) => html`<li><bbva-list-bullet>${item}</bbva-list-bullet></li>`)}
        `;
        render(bulletTemplate(items), document.querySelector('ul'));
    </script>
  </template>
  ```

  ## Icons

  Since this component uses icons, it will need an [iconset](https://platform.bbva.com/en-us/developers/engines/cells/documentation/cells-architecture/composing-with-components/cells-icons) in your project as an application level dependency. In fact, this component uses an iconset in its demo.

  ## Styling

  The following custom properties are available for styling:

  ### Custom properties

  | Selector            | CSS Property                  | CSS Variable                  | Theme Variable        | Foundations/Fallback                           |
  | ------------------- | ----------------------------- | ----------------------------- | --------------------- | ---------------------------------------------- |
  | :host(.transparent) | --bbva-list-bullet-icon-color | --bbva-aqua                   |                       | #2dcccd                                        |
  | :host(.transparent) | --bbva-list-bullet-color      | --bbva-white                  |                       | #ffffff                                        |
  | .icon               | color                         | --bbva-list-bullet-icon-color | --bbva-medium-blue    | #1973b8                                        |
  | :host               | padding                       | --gridSpacerVariant           | --gridSpacer          | foundations.grid.spacer          |
  | :host               | color                         | --bbva-list-bullet-color      | --bbva-600            | #121212                                        |
  | :host               | font-size                     |                               | --typographyTypeSmall | foundations.typography.typeSmall |
  | :host               | line-height                   |                               | --lineHeightTypeSmall | foundations.lineHeight.typeSmall |
  > Styling documentation generated by Cells CLI

  @customElement bbva-list-bullet
  @polymer
  @LitElement
  @demo demo/index.html
  */

  class BbvaListBullet extends LitElement {
    static get is() {
      return 'bbva-list-bullet';
    }

    static get properties() {
      return {
        /**
         * Icon to display in each item of the list
         */
        icon: {
          type: String
        },

        /**
         * Size of the icon
         */
        iconSize: {
          type: Number,
          attribute: 'icon-size'
        }
      };
    }

    constructor() {
      super();
      this.icon = 'coronita:bullet1';
      this.iconSize = 24;
    }

    static get styles() {
      return [styles$i, getComponentSharedStyles('bbva-list-bullet-shared-styles')];
    }

    render() {
      return html`
      <cells-icon class="icon" size="${this.iconSize}" icon="${this.icon}"></cells-icon>
      <slot></slot>
    `;
    }

  }
  customElements.define(BbvaListBullet.is, BbvaListBullet);

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
