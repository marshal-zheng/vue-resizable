const {VueResizable, Vue: VueInstance} = window;
const { createApp, ref, h, reactive } = VueInstance
const { ResizableBox, Resizable } = VueResizable

const customHandle = h('span', { class: 'custom-handle custom-handle-se' });

const App = {
  setup(props, { attrs }) {
    // 创建一个响应式对象
    const state = reactive({
      width: 200,
      height: 200,
      absoluteWidth: 200,
      absoluteHeight: 200,
      absoluteLeft: 0,
      absoluteTop: 0,
    });

    const absMargin = `${state.absoluteTop} 0 0 ${state.absoluteLeft}`

    const CustomResizeHandle = h('div', {
      class: `custom-handle custom-handle-${props.handleAxis} track-point-handle`,
      ...attrs,
    });

    const customHandle2 = (handleType, refs) => h('span', {
      class: `custom-handle custom-handle-${handleType}`,
      ref: refs,
    });

    const onFirstBoxResize = (event, {element, size, handle}) => {
      state.width = size.width;
      state.height = size.height;
    };

    const onResizeAbsolute = (event, {element, size, handle}) => {
      console.log('event', event)
      console.log('size', size)
      let newLeft = state.absoluteLeft;
        let newTop = state.absoluteTop;
        const deltaHeight = size.height - state.absoluteHeight;
        const deltaWidth = size.width - state.absoluteWidth;
        if (handle[0] === 'n') {
          newTop -= deltaHeight;
        } else if (handle[0] === 's') {
          newTop += deltaHeight;
        }
        if (handle[handle.length - 1] === 'w') {
          newLeft -= deltaWidth;
        } else if (handle[handle.length - 1] === 'e') {
          newLeft += deltaWidth;
        }

        // console.log('size', size.width)
        state.absoluteWidth = size.width
        state.absoluteHeight = size.height
        state.absoluteLeft = size.newLeft
        state.absoluteTop = size.newTop
        // console.log('state: ', state)
    };

    const onResetClick = () => {
      state.width = 200
      state.height = 200
      state.absoluteWidth = 200
    };


    return {
      state,
      onFirstBoxResize,
      onResetClick,
      CustomResizeHandle,
      customHandle,
      customHandle2,
      absMargin,
      onResizeAbsolute
    };
  },
  components: {
    Resizable,
    ResizableBox
  },
  template: `
    <div>
      <h1>Vue3 Resizable</h1>
      <div class="layoutRoot">
        <Resizable className="box" hoverHandles :height="state.height" :width="state.width" :fnResize="onFirstBoxResize" :resizeHandles="['sw', 'se', 'nw', 'ne', 'w', 'e', 'n', 's']">
          <div :style="{width: state.width + 'px', height: state.height + 'px'}">
            <span class="text">{{"Raw use of <Resizable> element. 200x200, all Resize Handles."}}</span>
            <button @click="onResetClick" :style="{'marginTop': '10px'}">Reset this element's width/height</button>
          </div>
        </Resizable>
        <ResizableBox className="box" :width="200" :height="200">
          <span class="text">{{"<ResizableBox>"}}</span>
        </ResizableBox>
        <ResizableBox
          className="custom-box box"
          :width="200"
          :height="200"
          :handle="customHandle"
          :handleSize="[8, 8]">
          <span class="text">{{"<ResizableBox> with custom overflow style & handle in SE corner."}}</span>
        </ResizableBox>
        <ResizableBox
          className="custom-box box track-point"
          :width="200"
          :height="200"
          :handle="CustomResizeHandle"
          :handleSize="[20, 20]"
        >
          <span class="text">{{"<ResizableBox> with a custom resize handle component."}}</span>
        </ResizableBox>
        <ResizableBox
          className="custom-box box"
          :width="200"
          :height="200"
          :handle="customHandle2"
          :handleSize="[8, 8]"
          :resizeHandles="['sw', 'se', 'nw', 'ne', 'w', 'e', 'n', 's']">
          <span class="text">{{"<ResizableBox> with custom handles in all locations."}}</span>
        </ResizableBox>
        <ResizableBox className="box" :width="200" :height="200" :draggableOpts="{grid: [25, 25]}">
          <span class="text">Resizable box that snaps to even intervals of 25px.</span>
        </ResizableBox>
        <ResizableBox className="box" :width="200" :height="200" :minConstraints="[150, 150]" :maxConstraints="[500, 300]">
          <span class="text">Resizable box, starting at 200x200. Min size is 150x150, max is 500x300.</span>
        </ResizableBox>
        <ResizableBox className="box" hoverHandles :width="200" :height="200" :minConstraints="[150, 150]" :maxConstraints="[500, 300]">
          <span class="text">Resizable box with a handle that only appears on hover.</span>
        </ResizableBox>
        <ResizableBox className="box" :width="200" :height="200" :lockAspectRatio="true" :resizeHandles="['sw', 'se', 'nw', 'ne', 'w', 'e', 'n', 's']">
          <span class="text">Resizable square with a locked aspect ratio.</span>
        </ResizableBox>
        <ResizableBox className="box" :width="200" :height="120" :lockAspectRatio="true" :resizeHandles="['sw', 'se', 'nw', 'ne', 'w', 'e', 'n', 's']">
          <span class="text">Resizable rectangle with a locked aspect ratio.</span>
        </ResizableBox>
        <ResizableBox className="box" :width="200" :height="200" axis="x">
          <span class="text">Only resizable by "x" axis.</span>
        </ResizableBox>
        <ResizableBox className="box" :width="200" :height="200" axis="y">
          <span class="text">Only resizable by "y" axis.</span>
        </ResizableBox>
        <ResizableBox className="box" :width="200" :height="200" axis="both">
          <span class="text">Resizable ("both" axis).</span>
        </ResizableBox>
        <ResizableBox className="box" :width="200" :height="200" axis="none">
          <span class="text">Not resizable ("none" axis).</span>
        </ResizableBox>
      </div>
      <h3>Absolutely Positioned Layout</h3>
      <div class="layoutRoot absoluteLayout">
        <ResizableBox className="box absolutely-positioned top-aligned left-aligned" :height="200" :width="200" :resizeHandles="['sw', 'se', 'nw', 'ne', 'w', 'e', 'n', 's']">
          <span class="text">Top-left Aligned</span>
        </ResizableBox>
        <ResizableBox className="box absolutely-positioned bottom-aligned left-aligned" :height="200" :width="200" :resizeHandles="['sw', 'se', 'nw', 'ne', 'w', 'e', 'n', 's']">
          <span class="text">Bottom-left Aligned</span>
        </ResizableBox>
        <ResizableBox className="box absolutely-positioned top-aligned right-aligned" :height="200" :width="200"  :transformScale="0.75" :resizeHandles="['sw', 'se', 'nw', 'ne', 'w', 'e', 'n', 's']">
          <span className="text">{{"<ResizableBox> with correct scale 0.75"}}</span>
        </ResizableBox>

        <ResizableBox className="box absolutely-positioned bottom-aligned right-aligned" :height="200" :width="200"  :transformScale="0.75" :resizeHandles="['sw', 'se', 'nw', 'ne', 'w', 'e', 'n', 's']">
          <span className="text">{"<ResizableBox> with correct scale 0.75"}</span>
        </ResizableBox>
      </div>
    </div>
  `
};

createApp(App).mount('#container')
