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
              <b-button @click="openSettings" pill size="sm" variant="info">
                <v-icon name="cogs" />Settings
              </b-button>
            </b-button-group>
          </b-col>
        </b-row>
        <b-row class="diff-view" no-gutters>
          <b-col>
            <MonacoEditor
              :language="language"
              :options="diffOptions"
              :theme="editorTheme"
              :value="left"
              class="editor"
            ></MonacoEditor>
          </b-col>
          <b-col>
            <MonacoEditor
              :language="language"
              :options="diffOptions"
              :theme="editorTheme"
              :value="base"
              class="editor"
            ></MonacoEditor>
          </b-col>
          <b-col>
            <MonacoEditor
              :language="language"
              :options="diffOptions"
              :theme="editorTheme"
              :value="right"
              class="editor"
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
              @change="onCodeChange"
              @editorDidMount="onEditorMount"
              class="merge-editor"
              ref="mergedEditor"
            ></MonacoEditor>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
    <!-- </b-container> -->

    <!-- Settings Modal -->
    <sweet-modal ref="settingsModal" title="Settings">
      <b-button @click="saveSettings()" class="right-button" variant="success">Save</b-button>
      <b-button @click="cancelSettings()" class="right-button" variant="outline-primary">Cancel</b-button>
    </sweet-modal>
  </div>
</template>

<script>
import MonacoEditor from './vue-monaco'
import { SweetModal } from 'sweet-modal-vue'
import { readLocalFile } from './utils/helper'

export default {
  name: 'Cards',

  components: {
    MonacoEditor,
    SweetModal
  },

  data() {
    return {
      // theme
      overallTheme: 'white',
      sidebarTheme: 'white-theme', // black-theme
      editorTheme: 'vs-light', // vs-dark

      // monaco options
      language: 'java',
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
      dirty: false, // if the merged is edited, show save button

      collapsed: false,
      menu: [
        {
          header: true,
          title: 'Conflicting Files'
          // component: componentName
          // visibleOnCollapse: true
          // class:''
          // attributes: {}
        },
        {
          title: 'src/github/SourceRoot.java',
          badge: {
            text: 'conflicting',
            class: 'default-badge'
          }
        },
        {
          title: 'src/github/Utils.java',
          badge: {
            text: 'conflicting',
            class: 'default-badge'
          }
        },
        {
          title: 'src/github/TreeConstructor.java',
          badge: {
            text: 'resolved',
            class: 'default-badge'
          }
        }
      ]
    }
  },
  created() {
    // !! just for demo
    // TODO get conflicting file relative paths, add item to the menu
    readLocalFile('src/components/data/base.java', 'utf-8')
      .then(res => {
        this.base = res
      })
      .catch(err => {
        console.log(err)
      })
    readLocalFile('src/components/data/left.java', 'utf-8')
      .then(res => {
        this.left = res
      })
      .catch(err => {
        console.log(err)
      })
    readLocalFile('src/components/data/right.java', 'utf-8')
      .then(res => {
        this.right = res
      })
      .catch(err => {
        console.log(err)
      })
    readLocalFile('src/components/data/merged.java', 'utf-8')
      .then(res => {
        this.merged = res
      })
      .catch(err => {
        console.log(err)
      })
  },
  methods: {
    onEditorMount(editor) {
      // this.$refs.mergedEditor.getEditor()
      console.log(editor)
    },
    onCodeChange(editor) {
      this.dirty = true
    },

    // side bar methods
    onCollapse(collapsed) {
      this.collapsed = collapsed
    },
    onItemClick(event, item) {
      // TODO get code content, index conflict blocks
      console.log(item)
      // console.log(event)
      // console.log(item)
    },
    // button methods

    // settings modal methods
    openSettings() {
      this.$refs.settingsModal.open()
    },
    saveSettings() {
      this.$refs.settingsModal.close()
    },
    cancelSettings() {
      this.$refs.settingsModal.close()
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
  height: 50vh;
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

.sweet-modal .sweet-title h2 {
  line-height: inherit;
}

.right-button {
  float: right;
  margin-top: 10px;
  margin-right: 10px;
}
</style>
