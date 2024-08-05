import { DraggableCoreProps } from '@marsio/vue-draggable'
import { VNode, Ref, PropType } from 'vue'

export type VueRef<T extends HTMLElement> = Ref<T | null>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Kv<T = any> = Record<string, T>

export type Axis = 'both' | 'x' | 'y' | 'none'
export type ResizeHandleAxis = 's' | 'w' | 'e' | 'n' | 'sw' | 'nw' | 'se' | 'ne'
export type ResizableState = void
export interface ResizableBoxState {
  width: number,
  height: number,
  propsWidth: number,
  propsHeight: number
}
export interface DragCallbackData {
  node: HTMLElement,
  x: number,
  y: number,
  deltaX: number, deltaY: number,
  lastX: number, lastY: number
}
export interface ResizeCallbackData {
  node: HTMLElement,
  size: {width: number, height: number},
  handle: ResizeHandleAxis
}
export type DefaultProps = {
  axis: Axis,
  handleSize: [number, number],
  lockAspectRatio: boolean,
  minConstraints: [number, number],
  maxConstraints: [number, number],
  resizeHandles: ResizeHandleAxis[],
  transformScale: number,
};

export const RESIZABLE_PROPS_ARR: string[] = ['axis', 'className', 'draggableOpts', 'height', 'width', 'handle', 'handleSize', 'lockAspectRatio', 'maxConstraints', 'minConstraints', 'fnResizeStop', 'fnResizeStart', 'fnResize', 'resizeHandles', 'transformScale']

export interface Props extends DefaultProps {
  className?: string,
  draggableOpts?: Partial<DraggableCoreProps>,
  height: number,
  handle?: ((resizeHandleAxis: ResizeHandleAxis) => VNode) | VNode,
  fnResizeStop?: (e: Event, data: ResizeCallbackData) => void,
  fnResizeStart?: (e: Event, data: ResizeCallbackData) => void,
  fnResize?: (e: Event, data: ResizeCallbackData) => void,
  width: number,
}

export interface ResizableBoxProps extends Props {
  styles: Kv
} 

export const resizableProps = {
  axis: {
    type: String,
    default: 'both',
    validator: (value: string) => ['both', 'x', 'y', 'none'].includes(value),
  },
  className: String,
  draggableOpts: {
    type: Object as PropType<Partial<DraggableCoreProps>>
  },
  height: {
    type: Number,
    required: true,
  },
  handle: {
    type: [Object, Function] as PropType<HTMLElement | (() => HTMLElement)>,
    default: () => null,
  },
  handleSize: {
    type: Array as PropType<number[]>,
    validator: (value) => value.every((v) => typeof v === 'number'),
  },
  lockAspectRatio: {
    type: Boolean,
    default: false,
  },
  hoverHandles: {
    type: Boolean,
    default: false,
  },
  maxConstraints: {
    type: Array as PropType<number[]>,
    validator: (value: [number, number]) => value.length === 2 && value.every(Number.isFinite),
  },
  minConstraints: {
    type: Array as PropType<number[]>,
    validator: (value: [number, number]) => value.length === 2 && value.every(Number.isFinite),
  },
  /* eslint-disable @typescript-eslint/no-explicit-any */
  fnResizeStop: Function as PropType<(e: Event, data: ResizeCallbackData) => any>,
  fnResizeStart: Function as PropType<(e: Event, data: ResizeCallbackData) => any>,
  fnResize: Function as PropType<(e: Event, data: ResizeCallbackData) => any>,
  /* eslint-disable @typescript-eslint/no-explicit-any */
  resizeHandles: {
    type: Array as PropType<ResizeHandleAxis[]>,
    default: () => ['se'],
    required: true,
  },
  // resizeHandles: {
  //   type: Array as PropType<ResizeHandleAxis[]>,
  //   default: () => [],
  // },
  transformScale: {
    type: Number,
    default: 1,
  },
  width: {
    type: Number,
    required: true,
  }
}
