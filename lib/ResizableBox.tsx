import { defineComponent, reactive } from 'vue';
import VueTypes from 'vue-types'
import { get } from 'lodash'

import { Resizable } from './Resizable';
import {resizableProps} from "./propTypes";
import type { ResizableBoxState } from './propTypes';

const ResizableBox = defineComponent({
  props: {
    ...resizableProps,
    styles: VueTypes.object.def({})
  },
  setup(props, { emit, slots }) {
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