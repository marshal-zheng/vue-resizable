import { defineComponent, reactive, DefineComponent, PropType } from 'vue';
import { get } from 'lodash'

import { Resizable } from './Resizable';
import { resizableProps, Props } from "./propTypes";
import type { ResizableBoxState, Kv } from './propTypes';

type ResizableBoxInstanceProps = DefineComponent<Props>['props'];

const ResizableBox = defineComponent({
  props: {
    ...(resizableProps as DefineComponent<Props>['props']),
    styles: {
      type: Object as PropType<Kv>,
      default: () => ({}),
    },
  },
  setup(props: ResizableBoxInstanceProps, { emit, slots }) {
    const state = reactive<ResizableBoxState>({
      width: props.width,
      height: props.height,
      propsWidth: props.width,
      propsHeight: props.height,
    });

    const onResize = (event: Event, data) => {
      state.width = get(data, 'size.width') || 0;
      state.height = get(data, 'size.height') || 0;
      emit('resize', event, data);
    };

    return () => (
      <Resizable
        axis={props.axis}
        className={props.className}
        draggableOpts={props.draggableOpts}
        handle={props.handle}
        handleSize={props.handleSize}
        height={state.height}
        lockAspectRatio={props.lockAspectRatio}
        maxConstraints={props.maxConstraints}
        minConstraints={props.minConstraints}
        fnResizeStart={props.fnResizeStart}
        fnResize={onResize}
        fnResizeStop={props.fnResizeStop}
        resizeHandles={props.resizeHandles}
        transformScale={props.transformScale}
        width={state.width}
      >
        <div style={{ width: `${state.width}px`, height: `${state.height}px`}}>{slots.default?.()}</div>
      </Resizable>
    );
  },
});

export { Resizable, ResizableBox }