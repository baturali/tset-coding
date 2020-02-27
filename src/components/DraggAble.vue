<template>
  <div class="drop-container">
    <div class="shape-container" v-if="shapeGetter === 'Cuboid'">
      <div
        class="wrapper cuboid"
        v-for="(data, i) in cuboid"
        :key="'cuboid' + i"
      >
        <drop
          class="drop list"
          :key="'cuboid-drop' + i"
          @drop="handleDrop"
          @dragover="handleDragover({ data, i }, ...arguments)"
        >
          <div class="item-holder" v-if="data && data.length">
            <div
              v-for="(property, ind) of data"
              :key="'cuboid-inline-' + property.val + ind"
            >
              <drag
                class="draggable-inside-drop"
                :key="'cuboid-surface-' + property.val + ind"
                :transfer-data="property"
                @dragstart="handleMove(i, true)"
                @dragend="handleMove(i, true)"
              >
                <p :key="'cuboid-data-' + property.val + ind">
                  {{ property.propertyName + ":" }}{{ property.val }}
                </p>
              </drag>
            </div>
          </div>
        </drop>
      </div>
    </div>
    <div class="shape-container" v-if="shapeGetter === 'Cylinder'">
      <div
        class="wrapper cylinder"
        v-for="(data, i) in cylinder"
        :key="'cylinder' + i"
      >
        <drop
          class="drop list"
          :key="'cylinder-drop' + i"
          @drop="handleDrop"
          @dragover="handleDragover({ data, i }, ...arguments)"
        >
          <div class="item-holder" v-if="data && data.length">
            <div v-for="(property, ind) of data" :key="property.val + ind">
              <drag
                class="draggable-inside-drop"
                :key="'cylinder-surface-' + property.val + i"
                :transfer-data="property"
                @dragstart="handleMove(i, true)"
                @dragend="handleMove(i, true)"
              >
                <p :key="'cylinder-data-' + property.val + ind">
                  {{ property.propertyName + ":" }}{{ property.val }}
                </p>
              </drag>
            </div>
          </div>
        </drop>
      </div>
    </div>
    <div class="toolbar">
      <h2>Toolbar</h2>
      <div
        class="tool-drag"
        v-for="(tool, i) in lists"
        :key="'toolbar-drag' + i"
      >
        <drag
          v-if="tool.propertyName === 'drilling'"
          :key="'toolbar-drilling' + tool.val + i"
          :transfer-data="drilling"
          @dragstart="handleMove(i, false)"
          @dragend="handleMove(i, false)"
        >
          <div class="drag-inline">
            <label> {{ tool.propertyName }} </label>
            <input
              style="font-size: 22px;"
              type="number"
              :key="'drilling' + tool.val + i"
              v-model="drilling.val"
              :placeholder="tool.val"
            />
          </div>
        </drag>
        <drag
          v-if="tool.propertyName === 'tolerance'"
          :key="'toolbar-tolerance' + tolerance + i"
          :transfer-data="tolerance"
        >
          <div class="drag-inline">
            <label> {{ tool.propertyName }} </label>
            <select style="font-size: 22px;" v-model="tolerance.val">
              <option
                style="font-size: 22px;"
                v-for="(el, ind) of lists[1].val"
                :key="'tolerance-tool' + ind"
                >{{ el }}</option
              >
            </select>
          </div>
        </drag>
        <drag
          v-if="tool.propertyName === 'surface'"
          :key="'toolbar-surface' + tool.val + i"
          :transfer-data="surface"
        >
          <div class="drag-inline">
            <label> {{ tool.propertyName }} </label>
            <input
              style="font-size: 22px;"
              type="text"
              :key="'surface-tool' + tool.val + i"
              v-model="surface.val"
              :placeholder="tool.val"
            />
          </div>
        </drag>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Drag, Drop } from "vue-drag-drop";
import { mapGetters } from "vuex";

export default Vue.extend({
  name: "DraggAble",
  components: { Drag, Drop },
  data() {
    return {
      onSection: false,
      comeFrom: 0,
      box: 0,
      drilling: {
        val: null,
        propertyName: "drilling"
      },
      tolerance: {
        val: "Fine",
        propertyName: "tolerance"
      },
      surface: {
        val: "Flat",
        propertyName: "surface"
      },
      lists: [
        {
          propertyName: "drilling",
          val: 25
        },
        {
          propertyName: "tolerance",
          val: ["Fine", "Medium", "Rough"]
        },
        {
          propertyName: "surface",
          val: "surface"
        }
      ],
      cuboid: [[], [], [], [], [], []],
      cylinder: [[], [], []]
    };
  },
  computed: {
    ...mapGetters({
      shapeGetter: "shapeGetter"
    })
  },
  watch: {
    shapeGetter(val, oldVal) {
      if (val != oldVal) {
        this.cuboid = [[], [], [], [], [], []];
        this.cylinder = [[], [], []];
      }
    },
    cuboid: {
      handler: function(val) {
        this.cuboid = val;
      },
      deep: true
    },
    cylinder: {
      handler: function(val) {
        this.cylinder = val;
      },
      deep: true
    }
  },
  methods: {
    handleDragover(group: any) {
      this.box = group.i;
    },
    handleMove(position: number, bool: boolean) {
      this.onSection = bool;
      this.comeFrom = position;
    },
    handleDrop(data: any) {
      const boxInd = this.box;
      const pushObj = {
        val: data.val,
        propertyName: data.propertyName
      };

      if (data.propertyName === "drilling" && data.val < 0) {
        alert("Drilling can not be negative");
      } else {
        if (this.shapeGetter === "Cuboid") {
          if (this.cuboid[boxInd] && this.cuboid[boxInd].length) {
            if (
              this.cuboid[boxInd].some(
                item =>
                  item.propertyName === pushObj.propertyName ||
                  item.val === pushObj.val
              )
            ) {
              alert("The Cuboid can only have one of the same Property");
            } else {
              if (this.onSection) {
                debugger // eslint-disable-line
                const filtered = this.cuboid[this.comeFrom].filter(
                  item => item.propertyName != pushObj.propertyName
                );
                this.cuboid[this.comeFrom] = filtered;
              }
              this.cuboid[boxInd].push(pushObj);
            }
          } else {
            debugger // eslint-disable-line
            if (this.onSection) {
              const filtered = this.cuboid[this.comeFrom].filter(
                item => item.propertyName != pushObj.propertyName
              );
              this.cuboid[this.comeFrom] = filtered;
            }
            this.cuboid[boxInd].push(pushObj);
          }
        } else if (this.shapeGetter === "Cylinder") {
          if (this.cylinder[boxInd] && this.cylinder[boxInd].length) {
            if (
              this.cylinder[boxInd].some(
                item =>
                  item.propertyName === pushObj.propertyName ||
                  item.val === pushObj.val
              )
            ) {
              alert("The Cylinder can only have one of the same Property");
            } else {
              if (this.onSection) {
                const filtered = this.cylinder[this.comeFrom].filter(
                  item => item.propertyName != pushObj.propertyName
                );
                this.cylinder[this.comeFrom] = filtered;
              }
              this.cylinder[boxInd].push(pushObj);
            }
          } else {
            if (this.onSection) {
              const filtered = this.cylinder[this.comeFrom].filter(
                item => item.propertyName != pushObj.propertyName
              );
              this.cylinder[this.comeFrom] = filtered;
            }
            this.cylinder[boxInd].push(pushObj);
          }
        }
      }

      this.drilling.val = null;
      this.tolerance.val = "";
      this.surface.val = "";
    }
  }
});
</script>

<style lang="scss" scoped>
.drop-container {
  align-items: flex-start;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  width: 100%;
  height: 100%;

  > .shape-container {
    align-items: flex-start;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    width: 612px;
    height: 100%;
  }
  .wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
  }
  .wrapper.cuboid:first-child {
    flex-basis: 100%;
  }
  .wrapper.cuboid:nth-of-type(2) {
    flex-basis: 33%;
  }
  .wrapper.cuboid:nth-of-type(3) {
    flex-basis: 33%;
  }
  .wrapper.cuboid:nth-of-type(4) {
    flex-basis: 33%;
  }
  .wrapper.cuboid:nth-of-type(5) {
    flex-basis: 100%;
  }
  .wrapper.cuboid:nth-of-type(6) {
    flex-basis: 100%;
  }

  .wrapper.cylinder:first-child {
    > .drop {
      border-radius: 50%;
    }
  }
  .wrapper.cylinder:nth-of-type(3) {
    > .drop {
      border-radius: 50%;
    }
  }
}
.drag {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 200px;
  min-width: 200px !important;
  height: 40px;

  label {
    font-size: 18px;
    font-weight: 500;
  }
  span {
    font-size: 20px;
    font-weight: 600;
  }
}
.drop {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  padding: 0;
  margin: 0;
  border: 1px dotted rgb(73, 73, 73);
  width: 200px;
  max-width: 200px;
  height: 130px;

  .item-holder {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .draggable-inside-drop {
    border: 2px dashed #131313;
    cursor: all-scroll;
    padding: 9px;
    margin: 1px;
    width: 150px;

    p {
      margin: 0;
      max-width: 100%;
      text-overflow: ellipsis;
      display: block;
      overflow: hidden;
      white-space: nowrap;
    }
  }
}
.toolbar {
  position: absolute;
  top: 150px;
  right: 0;
  width: 200px;
  height: auto;
  padding-bottom: 20px;
  align-items: flex-start;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  background-color: #fff;
  border-top-left-radius: 20px;
  border-bottom-left-radius: 20px;
  border: 1px dotted rgb(73, 73, 73);

  .tool-drag {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0;
    margin: 0;
    width: 200px;
    max-width: 200px;
    height: 130px;
  }
  .drag-inline {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    width: 150px;
    position: relative;
    background-color: #e9e9e9;
    border-style: dashed;
    padding: 7px;
    cursor: all-scroll;

    label {
      padding-bottom: 7px;
      text-transform: uppercase;
    }
    select {
      border-radius: 3px;
    }
    input {
      border-radius: 5px;
      padding-left: 7px;
      max-width: 100%;
      -webkit-appearance: none;
      border: 1px solid gray;
    }
  }
}
</style>
