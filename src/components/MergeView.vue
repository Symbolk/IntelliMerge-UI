<template>
  <div :class="[{'collapsed' : collapsed}]" id="demo">
    <!-- <b-container class="container" fluid> -->
    <b-row>
      <sidebar-menu
        :collapsed="collapsed"
        :menu="menu"
        :theme="sidebarTheme"
        @collapse="onCollapse"
      >
        <span slot="collapse-icon">
          <v-icon name="arrows-alt-h" />
        </span>
      </sidebar-menu>
      <!-- left-base-right -->
      <b-col :key="collapsed">
        <b-row class="button-area">
          <b-col cols="3">
            <b-button-group size="sm">
              <b-button variant="success">
                <v-icon name="arrow-up" />Previous
              </b-button>
              <b-button variant="warning">Current index: {{index}}</b-button>
              <b-button variant="info">
                <v-icon name="arrow-down" />Next
              </b-button>
            </b-button-group>
          </b-col>
          <b-col></b-col>
          <b-col cols="3"></b-col>
          <b-col style="text-align: right;margin-right:10px">
            <b-button-group size="sm">
              <b-button pill size="sm" v-if="dirty" variant="danger">
                <v-icon name="save" />Save
              </b-button>&nbsp;
              <b-button pill size="sm" variant="primary">
                <v-icon name="check" />Commit
              </b-button>&nbsp;
              <b-button pill size="sm" variant="info">
                <v-icon name="cogs" />Settings
              </b-button>
            </b-button-group>
          </b-col>
        </b-row>
        <b-row class="diff-view" no-gutters>
          <b-col>
            <MonacoEditor
              :options="diffOptions"
              :theme="editorTheme"
              :value="left"
              class="editor"
              language="javascript"
            ></MonacoEditor>
          </b-col>
          <b-col>
            <MonacoEditor
              :options="diffOptions"
              :theme="editorTheme"
              :value="base"
              class="editor"
              language="javascript"
            ></MonacoEditor>
          </b-col>
          <b-col>
            <MonacoEditor
              :options="diffOptions"
              :theme="editorTheme"
              :value="right"
              class="editor"
              language="javascript"
            ></MonacoEditor>
          </b-col>
        </b-row>
        <!-- merged -->
        <b-row no-gutters>
          <b-col class="merge-view">
            <MonacoEditor
              :language="language"
              :theme="editorTheme"
              :value="merged"
              class="merge-editor"
            ></MonacoEditor>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
    <!-- </b-container> -->
  </div>
</template>

<script>
import MonacoEditor from './vue-monaco'

export default {
  name: 'Cards',

  components: {
    MonacoEditor
  },

  data() {
    return {
      // theme
      overallTheme: 'white',
      sidebarTheme: 'white-theme',
      editorTheme: 'vs-light',

      // monaco options
      language: 'javascript',
      diffOptions: {
        //Monaco Editor Options
        readOnly: true
      },

      // data
      index: 0,
      left: '',
      base: '',
      right: '',
      merged: '',
      dirty: false, // TODO if the merged is edited, show save button

      collapsed: false,
      menu: [
        {
          header: true,
          title: 'Conflicting Files'
          // component: componentName
          // visibleOnCollapse: true
          // class:''
          // attributes: {}
        }
      ]
    }
  },
  methods: {
    init() {
      // TODO get conflicting file relative paths, add item to the menu
    },
    onCollapse(collapsed) {
      this.collapsed = collapsed
    },
    onItemClick(event, item) {
      // TODO get code content, index conflict blocks
      console.log(item)
      // console.log(event)
      // console.log(item)
    }
  }
}
</script>

<style scoped>
.button-area {
  padding: 1px;
  padding-top: 2px;
}

.diff-view {
  height: 45vh;
}

.merge-view {
  height: 45vh;
}

.editor {
  height: 45vh;
  /* width: 10/36vw; */
  margin: 0px;
  padding: 0px;
  border: 1px solid grey;
}

.merge-editor {
  height: 50vh;
  /* width: 10/12vw; */
  /* margin: 0px; */
  padding: 0px;
  border: 1px solid grey;
}

#demo {
  padding-left: 350px;
}
#demo.collapsed {
  padding-left: 50px;
}
</style>
