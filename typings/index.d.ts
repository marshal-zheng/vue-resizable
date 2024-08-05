import { DraggableCoreProps } from '@marsio/vue-draggable'
import { VNode, Ref, CSSProperties } from 'vue'
// import type { Props as ResizableProps, ResizableBoxProps, ResizeCallbackData } from './propTypes';
declare module '@marsio/vue-resizable' {
  import { DefineComponent } from 'vue';
  type Axis = 'both' | 'x' | 'y' | 'none'
  type ResizeHandleAxis = 's' | 'w' | 'e' | 'n' | 'sw' | 'nw' | 'se' | 'ne'

  interface ResizeCallbackData {
    node: HTMLElement,
    size: {width: number, height: number},
    handle: ResizeHandleAxis
  }

  interface ResizableProps {
    height: number,
    fnResizeStop?: (e: Event, data: ResizeCallbackData) => void,
    fnResizeStart?: (e: Event, data: ResizeCallbackData) => void,
    fnResize?: (e: Event, data: ResizeCallbackData) => void,
    width: number,
    axis: Axis,
    handleSize: [number, number],
    lockAspectRatio: boolean,
    minConstraints: [number, number],
    maxConstraints: [number, number],
    resizeHandles: ResizeHandleAxis[],
    transformScale: number,
    handle?: ((resizeHandleAxis: ResizeHandleAxis) => VNode) | VNode,
    className?: string,
    draggableOpts?: Partial<DraggableCoreProps>,
    hoverHandles?: boolean
  }

  export interface ResizableBoxProps extends Props {
    styles: CSSProperties
  } 

  const Resizable: DefineComponent<Partial<ResizableProps>>;
  const ResizableBox: DefineComponent<Partial<ResizableBoxProps>>;
  export { Resizable, ResizableBox }
  export type { ResizableProps, ResizableBoxProps, ResizeCallbackData }
}
