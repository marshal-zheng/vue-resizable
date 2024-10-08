// A Vue 3 equivalent that merges style & class.
import { cloneVNode, VNode } from 'vue';

export function cloneElement(vnode: VNode, props) {
  const mergedProps = { ...vnode.props };

  // Merge style
  if (props.style && vnode.props && vnode.props.style) {
    mergedProps.style = { ...vnode.props.style, ...props.style };
  }

  // Merge class
  if (props.class && vnode.props && vnode.props.class) {
    const existingClasses = Array.isArray(vnode.props.class) ? vnode.props.class : [vnode.props.class];
    const newClasses = Array.isArray(props.class) ? props.class : [props.class];
    mergedProps.class = [...existingClasses, ...newClasses];
  }

  return cloneVNode(vnode, mergedProps);
}

export function generateHandleStyles (): string {
  return `
    &.hover-handles:hover .vue-resizable-handle {
      display: block;
    }
    &.hover-handles .vue-resizable-handle {
      display: none;
    }
    .vue-resizable-handle {
      position: absolute;
      width: 20px;
      height: 20px;
      background-repeat: no-repeat;
      background-origin: content-box;
      box-sizing: border-box;
      background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2IDYiIHN0eWxlPSJiYWNrZ3JvdW5kLWNvbG9yOiNmZmZmZmYwMCIgeD0iMHB4IiB5PSIwcHgiIHdpZHRoPSI2cHgiIGhlaWdodD0iNnB4Ij48ZyBvcGFjaXR5PSIwLjMwMiI+PHBhdGggZD0iTSA2IDYgTCAwIDYgTCAwIDQuMiBMIDQgNC4yIEwgNC4yIDQuMiBMIDQuMiAwIEwgNiAwIEwgNiA2IEwgNiA2IFoiIGZpbGw9IiMwMDAwMDAiLz48L2c+PC9zdmc+');
      background-position: bottom right;
      padding: 0 3px 3px 0;
    }
    .vue-resizable-handle-sw {
      bottom: 0;
      left: 0;
      cursor: sw-resize;
      transform: rotate(90deg);
    }
    .vue-resizable-handle-se {
      bottom: 0;
      right: 0;
      cursor: se-resize;
    }
    .vue-resizable-handle-nw {
      top: 0;
      left: 0;
      cursor: nw-resize;
      transform: rotate(180deg);
    }
    .vue-resizable-handle-ne {
      top: 0;
      right: 0;
      cursor: ne-resize;
      transform: rotate(270deg);
    }
    .vue-resizable-handle-w,
    .vue-resizable-handle-e {
      top: 50%;
      margin-top: -10px;
      cursor: ew-resize;
    }
    .vue-resizable-handle-w {
      left: 0;
      transform: rotate(135deg);
    }
    .vue-resizable-handle-e {
      right: 0;
      transform: rotate(315deg);
    }
    .vue-resizable-handle-n,
    .vue-resizable-handle-s {
      left: 50%;
      margin-left: -10px;
      cursor: ns-resize;
    }
    .vue-resizable-handle-n {
      top: 0;
      transform: rotate(225deg);
    }
    .vue-resizable-handle-s {
      bottom: 0;
      transform: rotate(45deg);
    }
  `
}