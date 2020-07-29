# `bbva-progress-vertical-step`

## `Semantic Dom`

####   `DOM - Structure test`

```html
<bbva-progress-vertical-step has-i18n="">
</bbva-progress-vertical-step>

```

####   `SHADOW DOM - Structure test`

```html
<ol class="steps">
  <li class="completed content">
    <span class="circle">
      <span class="sr-only">
        bbva-progress-vertical-step-completed
      </span>
    </span>
    <div class="main-content">
      <div class="step-heading">
        <span class="title">
          Shipped
        </span>
        <bbva-link
          aria-disabled="false"
          class="link"
          role="button"
          tabindex="0"
        >
          Button
          <button
            aria-hidden="true"
            style="display: none;"
            tabindex="-1"
            type="submit"
          >
          </button>
        </bbva-link>
      </div>
      <bbva-date
        class="date"
        date="April 23, 1995"
      >
      </bbva-date>
      <span class="subtitle">
        Subtitle
      </span>
      <div class="text">
        Lorem ipsum dolor sit amet consectetur adipiscing elit senectus justo sollicitudin non.
      </div>
    </div>
  </li>
  <li class="content error">
    <span class="circle">
      <span class="sr-only">
        bbva-progress-vertical-step-error
      </span>
    </span>
    <div class="main-content">
      <div class="step-heading">
        <span class="title">
          Delivery attempt
        </span>
        <bbva-link
          aria-disabled="false"
          class="link"
          role="link"
          tabindex="0"
        >
          BBVA
          <a
            aria-hidden="true"
            href="https://www.bbva.es"
            style="display: none;"
            tabindex="-1"
          >
          </a>
        </bbva-link>
      </div>
      <bbva-date
        class="date"
        date="April 29, 1995"
      >
      </bbva-date>
      <span class="subtitle">
        Subtitle
      </span>
      <div class="text">
        Lorem ipsum dolor sit amet consectetur adipiscing elit senectus justo sollicitudin non.
      </div>
      <bbva-notification-help
        class="notification"
        icon="coronita:alert"
        text="Error!"
      >
      </bbva-notification-help>
    </div>
  </li>
  <li class="content pending">
    <span class="circle">
      <span class="sr-only">
        bbva-progress-vertical-step-pending
      </span>
    </span>
    <div class="main-content">
      <div class="step-heading">
        <span class="title">
          Delivered
        </span>
        <bbva-link
          aria-disabled="false"
          class="link"
          role="link"
          tabindex="0"
        >
          Link
          <a
            aria-hidden="true"
            href="https://www.bbva.es"
            style="display: none;"
            tabindex="-1"
          >
          </a>
        </bbva-link>
      </div>
      <bbva-date
        class="date"
        date="May 7, 1995"
      >
      </bbva-date>
      <span class="subtitle">
        Subtitle
      </span>
      <div class="text">
        Lorem ipsum dolor sit amet consectetur adipiscing elit senectus justo sollicitudin non.
      </div>
    </div>
  </li>
</ol>

```

####   `LIGHT DOM - Structure test`

```html

```

