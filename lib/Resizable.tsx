import { DraggableCore } from '@marsio/vue-draggable'
import { defineComponent, onUnmounted, ref, Ref, VNode, cloneVNode, h, PropType, DefineComponent } from 'vue';
import { css } from '@emotion/css';

import { generateHandleStyles } from './utils'

import type { ResizeHandleAxis, VueRef, DragCallbackData, Props } from './propTypes';

const resizableStyle = css`
  position: relative;
  ${generateHandleStyles()}
`;

import { resizableProps, Axis } from "./propTypes";

export const Resizable = defineComponent({
  name: 'Resizable',
  props: {
    ...(resizableProps as DefineComponent<Props>['props']),
    axis: {
      type: String as PropType<Axis>,
      default: 'both',
    },
    handleSize: {
      type: Array,
      default: () => [20, 20],
    },
    lockAspectRatio: {
      type: Boolean,
      default: false,
    },
    minConstraints: {
      type: Array,
      default: () => [20, 20],
    },
    maxConstraints: {
      type: Array,
      default: () => [Infinity, Infinity],
    },
    resizeHandles: {
      type: Array as PropType<ResizeHandleAxis[]>,
      default: () => ['se'],
      required: true
    },
    transformScale: {
      type: Number,
      default: 1
    }
  },
  setup(props, { slots }) {
    const handleRefs: {[key: string]: Ref<HTMLElement | null>} = {};
    let lastHandleRect: DOMRect | null = null;
    let slack: [number, number] | null = null; 

    const runConstraints =(width: number, height: number): [number, number] => {
      const { lockAspectRatio } = props;
      const minConstraints = props.minConstraints as [number, number];
      const maxConstraints = props.maxConstraints as [number, number];
      // short circuit
      if (!minConstraints && !maxConstraints && !lockAspectRatio) return [width, height];
  
      // If constraining to min and max, we need to also fit width and height to aspect ratio.
      if (lockAspectRatio) {
        const ratio = props.width / props.height;
        const deltaW = width - props.width;
        const deltaH = height - props.height;
  
        // Find which coordinate was greater and should push the other toward it.
        // E.g.:
        // ratio = 1, deltaW = 10, deltaH = 5, deltaH should become 10.
        // ratio = 2, deltaW = 10, deltaH = 6, deltaW should become 12.
        if (Math.abs(deltaW) > Math.abs(deltaH * ratio)) {
          height = width / ratio;
        } else {
          width = height * ratio;
        }
      }
  
      const [oldW, oldH] = [width, height];
  
      // Add slack to the values used to calculate bound position. This will ensure that if
      // we start removing slack, the element won't react to it right away until it's been
      // completely removed.
      const [slackW, slackH] = slack || [0, 0];
      width += slackW;
      height += slackH;
  
      if (minConstraints) {
        width = Math.max(minConstraints[0], width);
        height = Math.max(minConstraints[1], height);
      }
      if (maxConstraints) {
        width = Math.min(maxConstraints[0], width);
        height = Math.min(maxConstraints[1], height);
      }
  
      // If the width or height changed, we must have introduced some slack. Record it for the next iteration.
      slack = [slackW + (oldW - width), slackH + (oldH - height)];
  
      return [width, height];
    }

    const resizeHandler = (handlerName: 'fnResize' | 'fnResizeStart' | 'fnResizeStop', axis: ResizeHandleAxis) => {
      return (e: MouseEvent, data: DragCallbackData) => {
        const { node } = data
        let { deltaX, deltaY } = data
        // Reset data in case it was left over somehow (should not be possible)
        if (handlerName === 'fnResizeStart') resetData();
  
        // Axis restrictions
        const canDragX = (props.axis === 'both' || props.axis === 'x') && axis !== 'n' && axis !== 's';
        const canDragY = (props.axis === 'both' || props.axis === 'y') && axis !== 'e' && axis !== 'w';
        // No dragging possible.
        if (!canDragX && !canDragY) return;
  
        // Decompose axis for later use
        const axisV = axis[0];
        const axisH = axis[axis.length - 1]; // intentionally not axis[1], so that this catches axis === 'w' for example
  
        // Track the element being dragged to account for changes in position.
        // If a handle's position is changed between callbacks, we need to factor this in to the next callback.
        // Failure to do so will cause the element to "skip" when resized upwards or leftwards.
        const handleRect = node.getBoundingClientRect();
        if (lastHandleRect != null) {
          // If the handle has repositioned on either axis since last render,
          // we need to increase our callback values by this much.
          // Only checking 'n', 'w' since resizing by 's', 'w' won't affect the overall position on page,
          if (axisH === 'w') {
            const deltaLeftSinceLast = handleRect.left - lastHandleRect.left;
            deltaX += deltaLeftSinceLast;
          }
          if (axisV === 'n') {
            const deltaTopSinceLast = handleRect.top - lastHandleRect.top;
            deltaY += deltaTopSinceLast;
          }
        }
        // Storage of last rect so we know how much it has really moved.
        lastHandleRect = handleRect;
  
        // Reverse delta if using top or left drag handles.
        if (axisH === 'w') deltaX = -deltaX;
        if (axisV === 'n') deltaY = -deltaY;
  
        // Update w/h by the deltas. Also factor in transformScale.
        let width: number = props.width + (canDragX ? deltaX / props.transformScale : 0);
        let height: number = props.height + (canDragY ? deltaY / props.transformScale : 0);
  
        // Run user-provided constraints.
        [width, height] = runConstraints(width, height);
  
        const dimensionsChanged = width !== props.width || height !== props.height;
  
        // Call user-supplied callback if present.
        const cb = typeof props[handlerName] === 'function' ? props[handlerName] : null;
        // Don't call 'fnResize' if dimensions haven't changed.
        const shouldSkipCb = handlerName === 'fnResize' && !dimensionsChanged;
        if (cb && !shouldSkipCb) {
          cb(e, {node, size: {width, height}, handle: axis});
        }
  
        // Reset internal data
        if (handlerName === 'fnResizeStop') resetData();
      };
    }

    const renderResizeHandle = (handleAxis: ResizeHandleAxis, refs: VueRef<HTMLElement>): VNode => {
      const {handle, handleSize = []} = props;
      const [width, height] = handleSize 
      // No handle provided, make the default
      if (!handle) {
        return (
          <span
            class={`vue-resizable-handle vue-resizable-handle-${handleAxis}`}
            style={{ width: `${width}px`, height: `${height}px` }} 
          />
        )
      }
      // Handle is a function, such as:
      if (typeof handle === 'function') {
        return handle(handleAxis, refs);
      }
      // Handle is a Vue component (composite or DOM).
      const isDOMElement = typeof handle.type === 'string';
      const prop = {
        ref: refs,
        // Add `handleAxis` prop iff this is not a DOM element,
        // otherwise we'll get an unknown property warning
        ...(isDOMElement ? {} : {handleAxis}),
        style: { width: `${width}px`, height: `${height}px` }
      };
      return cloneVNode(handle as VNode, prop);
  
    }

    onUnmounted(() => {
      lastHandleRect = null;
      slack = null;
    });

    const resetData = () => {
      lastHandleRect = null;
      slack = null;
    };
    return () => {
      /* eslint-disable @typescript-eslint/no-unused-vars */
      const {className, draggableOpts, width, height, handle, handleSize,
        lockAspectRatio, axis, minConstraints, maxConstraints, fnResize,
        fnResizeStop, fnResizeStart, resizeHandles, transformScale, hoverHandles, ...p} = props;
      /* eslint-enable @typescript-eslint/no-unused-vars */

      const children = slots.default ? slots.default() : [];

      const handlers = props.resizeHandles.map((handleAxis: ResizeHandleAxis) => {
        const refs = handleRefs[handleAxis] ?? (handleRefs[handleAxis] = ref(null));

        return (
          <DraggableCore
            {...props.draggableOpts}
            nodeRef={refs}
            key={`resizableHandle-${handleAxis}`}
            stopFn={resizeHandler('fnResizeStop', handleAxis)}
            startFn={resizeHandler('fnResizeStart', handleAxis)}
            dragFn={resizeHandler('fnResize', handleAxis)}
          >
            {renderResizeHandle(handleAxis, refs)}
          </DraggableCore>
        )
      })

      return children.map(child => {
        if (!child) return [];
        const nextChildren = !Array.isArray(child.children) ? [child.children] : child.children;
        return h(
          child.type as string,
          { 
            ...child.props,
            class: [props.className, 'vue-resizable', resizableStyle, child.props?.class, hoverHandles ? 'hover-handles' : undefined], // 合并类名
            ...p, // 传递其他属性
          },
          [...nextChildren, ...handlers]
        );
      });

    }
  },
})