# Vue Resizable 

A simple widget that can be resized via one or more handles. supports Vue3, with compatibility for both web and mobile platforms.

You can either use the `<Resizable>` element directly, or use the much simpler `<ResizableBox>` element.

See the example and associated code in [ExampleLayout](/example/example.js) and
[ResizableBox](/lib/ResizableBox.tsx) for more details.

![resizable](https://github.com/marshal-zheng/vue-resizable/assets/24412317/f2713596-a6a7-45e9-a09f-feb527dfbeee)

[**[Demo](https://marsio.top/vue-resizable/) | [Changelog](/CHANGELOG.md) | [View Example](/example/example.js)**]

## ✨ Features
- **Compatibility**: Compatible with server-rendered apps, PC, and mobile devices.
- **Resizable Component**: Allows elements to be resized with optional constraints. It supports the following features:
  - Customizable axis of resizing (`x`, `y`, or `both`).
  - Optional locking of aspect ratio.
  - Minimum and maximum size constraints.
  - Customizable handles for resizing, including the ability to use custom Vue components or functions as handles.
  - Integration with a draggable component (`DraggableCore`) for smooth resizing.
  - Emits events for resize start, resize, and resize stop, allowing for custom logic and integration.
  - Supports transform scale adjustments, useful for elements within transformed parents.

- **ResizableBox Component**: A higher-level component that wraps the `Resizable` component, providing a simpler interface for common use cases. It includes:
  - All features of the `Resizable` component.
  - Direct control over the size of the box through reactive state, automatically updating the size during resize actions.
  - Easy integration with slots to place custom content inside the resizable box.
  - Predefined styles for immediate use, with the option to override or extend these styles via props.

## Quick Start

This package has two major exports:

* [`<Resizable>`](/lib/Resizable.tsx): A raw component that does not have state. Use as a building block for larger components, by listening to its
  callbacks and setting its props.
* [`<ResizableBox>`](/lib/ResizableBox.tsx): A simple `<div {...props} />` element that manages basic state. Convenient for simple use-cases.

To quickly start using `@marsio/vue-resizable`, follow the steps below:

### Step 1: Installation

First, you need to install the package. Run the following command in your project directory:

```bash
npm install @marsio/vue-resizable
```

or if you prefer using Yarn:

```bash
yarn add @marsio/vue-resizable
```

or if you prefer using Pnpm:

```bash
pnpm add @marsio/vue-resizable
```


### Step 2: Importing

In your Vue component, import `@marsio/vue-resizable`:

```javascript
import { ResizableBox, Resizable } from '@marsio/vue-resizable';
```

### Step 3: Using `@marsio/vue-resizable`

Now, you can use the `Draggable` component in your Vue application. Wrap any element with `<Draggable>` to make it draggable:

```vue
<template>
  <ResizableBox className="box" :width="200" :height="200">
    <span class="text">I can now resize the box</span>
  </ResizableBox>
</template>

<script>
import { ResizableBox } from '@marsio/vue-resizable';

export default {
  components: {
    ResizableBox
  }
}
</script>

<style>
</style>
```

### Step 4: Enjoy!

That's it! You've successfully integrated resizable functionality into your Vue application. Customize it further according to your needs.


A simple component for making elements resizable box.

```js
<ResizableBox className="box" :width="200" :height="200">
  <span class="text">{{"<ResizableBox>"}}</span>
</ResizableBox>
```

#### `<Resizable>`
```js
const {Resizable} = require('@marsio/vue-resizable');

// ES6
import { Resizable } from '@marsio/vue-resizable';

const Example = defineComponent({
  const state = reactive({
    width: 200,
    height: 200
  });
  setup () {
    const onResize = (event, {node, size, handle}) => {
    state.width = size.width
    state.height = size.height
    };
    return () => (
      <Resizable height={this.state.height} width={this.state.width} fnResize={this.onResize}>
        <div className="box" style={{width: this.state.width + 'px', height: this.state.height + 'px'}}>
          <span>Contents</span>
        </div>
      </Resizable>
    )
  }
})
```

#### `<ResizableBox>`
```js
const {ResizableBox} = require('@marsio/vue-resizable');

// ES6
import { ResizableBox } from '@marsio/vue-resizable';

const Example = defineComponent({
  const state = reactive({
    width: 200,
    height: 200
  });
  setup () {
    const onResize = (event, {node, size, handle}) => {
    state.width = size.width
    state.height = size.height
    };
    return () => (
      <ResizableBox width={200} height={200} draggableOpts={{grid: [25, 25]}}
          minConstraints={[100, 100]} maxConstraints={[300, 300]}>
        <span>Contents</span>
      </ResizableBox>
    )
  }
})
```

### Props

These props apply to both `<Resizable>` and `<ResizableBox>`. Unknown props that are not in the list below will be passed to the child component.

```js
type ResizeCallbackData = {
  node: HTMLElement,
  size: {width: number, height: number},
  handle: ResizeHandleAxis
};
type ResizeHandleAxis = 's' | 'w' | 'e' | 'n' | 'sw' | 'nw' | 'se' | 'ne';

type ResizableProps {
    axis: 'both' | 'x' | 'y' | 'none' = 'both',
    className?: string,
    draggableOpts?: Object,
    handle?: ((resizeHandleAxis: ResizeHandleAxis) => VNode) | VNode,
    handleSize: [number, number],
    lockAspectRatio: boolean,
    minConstraints: [number, number],
    maxConstraints: [number, number],
    fnResizeStop?: (e: Event, data: ResizeCallbackData) => void,
    fnResizeStart?: (e: Event, data: ResizeCallbackData) => void,
    fnResize?: (e: Event, data: ResizeCallbackData) => void,
    resizeHandles: ResizeHandleAxis[],
    transformScale: number,
    width: number,
    height: number,
    hoverHandles?: boolean
  }
```

The following props can also be used on `<ResizableBox>`:

```js
{
  style?: Object
}
```

If a `width` or `height` is passed to `<ResizableBox>`'s `style` prop, it will be ignored as it is required for internal function.

#### Resize Handle

If you override the resize handle, we expect that any `ref` passed to your new handle with represent the underlying DOM element.

This is required, as `vue-resizable` must be able to access the underlying DOM node to attach handlers and measure position deltas.

There are a few ways to do this:

##### Native DOM Element

This requires no special treatment.

```js
<Resizable handle={<div class="foo" />} />
```

##### Custom Function

You can define a function as a handle, which will simply receive an axis (see above `ResizeHandleAxis` type) and ref. This may be more clear to read, depending on your coding style.

```js
const MyHandle = (props) => {
  return <div ref={props.innerRef} className="foo" {...props} />;
};

<Resizable handle={(handleAxis, ref) => <MyHandle innerRef={ref} className={`foo handle-${handleAxis}`} {...props} />} />
```

### Modern browsers.

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Safari | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/opera/opera_48x48.png" alt="Opera" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Opera |
| --- | --- | --- | --- | --- |
| Edge | last 2 versions | last 2 versions | last 2 versions | last 2 versions |

### Changelog.

Detailed changes for each release are documented in the [release notes](CHANGELOG.md).

### Release checklist

- Update CHANGELOG
- `pnpm release`
- `pnpm publish`

### License

MIT
