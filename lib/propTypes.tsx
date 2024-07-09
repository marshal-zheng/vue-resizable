import { DraggableCoreProps } from '@marsio/vue-draggable'
import { VNode, Ref } from 'vue'
import VueTypes from 'vue-types'

export type VueRef<T extends HTMLElement> = Ref<T | null>;

export type Axis = 'both' | 'x' | 'y' | 'none'
export type ResizeHandleAxis = 's' | 'w' | 'e' | 'n' | 'sw' | 'nw' | 'se' | 'ne'
export type ResizableState = void
export interface ResizableBoxState {
  width: number, height: number,
  propsWidth: number, propsHeight: number
}
export interface DragCallbackData {
  node: HTMLElement,
  x: number, y: number,
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

export interface Props {
  axis: Axis,
  className?: string,
  draggableOpts?: Partial<DraggableCoreProps>,
  height: number,
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
}

export const resizableProps = {
  axis: VueTypes.oneOf(['both', 'x', 'y', 'none']),
  className: VueTypes.string,
  draggableOpts: VueTypes.object,
  height: VueTypes.number.isRequired,
  handle: VueTypes.oneOfType([
    VueTypes.object,
    VueTypes.func
  ]).def(() => null),
  handleSize: VueTypes.arrayOf(VueTypes.number),
  lockAspectRatio: VueTypes.bool.def(false),
  maxConstraints: VueTypes.arrayOf(VueTypes.number),
  minConstraints: VueTypes.arrayOf(VueTypes.number),
  fnResizeStop: VueTypes.func,
  fnResizeStart: VueTypes.func,
  fnResize: VueTypes.func,
  resizeHandles: VueTypes.arrayOf(VueTypes.oneOf(['s', 'w', 'e', 'n', 'sw', 'nw', 'se', 'ne'])),
  transformScale: VueTypes.number.def(1),
  width: VueTypes.number.isRequired,
}
