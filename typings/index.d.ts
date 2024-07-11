import { DraggableCoreProps } from '@marsio/vue-draggable'
import { VNode, Ref } from 'vue'
import type { Props as ResizableProps, ResizableBoxProps, ResizeCallbackData } from './propTypes';
declare module '@marsio/vue-resizable' {
  import { DefineComponent } from 'vue';

  const Resizable: DefineComponent<ResizableProps>;
  const ResizableBox: DefineComponent<ResizableBoxProps>;
  export { Resizable, ResizableBox }
  export type { ResizableProps, ResizableBoxProps, ResizeCallbackData }
}
