import { DraggableCoreProps } from '@marsio/vue-draggable'
import { VNode, Ref } from 'vue'
declare module '@marsio/vue-resizable' {
  import { DefineComponent } from 'vue';

  export interface ResizeCallbackData {
    node: HTMLElement,
    size: {width: number, height: number},
    handle: ResizeHandleAxis
  }

  export interface ResizableProps {
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

  export interface ResizableBoxProps extends ResizableProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  }

  const Resizable: DefineComponent<ResizableProps>;
  const ResizableBox: DefineComponent<ResizableBoxProps>;
  export { Resizable, ResizableBox }
}
