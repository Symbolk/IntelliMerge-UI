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
              <b-button @click="previousConflict()" variant="success">
                <v-icon name="arrow-up" />Previous
              </b-button>
              <b-button @click="highlight()" variant="warning">{{index}}/{{indexToLineMap.length}}</b-button>
              <b-button @click="nextConflict()" variant="info">
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
              ref="mergeEditor"
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
const monaco = require('monaco-editor')
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

      // monaco instance
      mergeEditor: '',
      decorations: '',

      // data
      index: 0, // start from 1
      indexToLineMap: [], // start from 0
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
        this.scanConflictBlocks()
      })
      .catch(err => {
        console.log(err)
      })
  },
  mounted() {
    this.mergeEditor = this.$refs.mergeEditor.getEditor()
  },
  methods: {
    onEditorMount(editor) {
      // console.log(editor)
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

    // preparation
    scanConflictBlocks() {
      // scan the merged code to get the map between index and conflict blocks start line number
      this.indexToLineMap = []
      let lines = this.merged.split(/\r?\n/)
      // get three way start line
      let block = {}
      let insideBlock = false
      for (let i in lines) {
        if (!insideBlock && lines[i].startsWith('<<<<<<')) {
          block = {}
          block['left_start'] = parseInt(i) + 1
          insideBlock = true
          continue
        }
        // undefined if in diff2 style
        if (insideBlock && lines[i].startsWith('|||||||')) {
          block['base_start'] = parseInt(i) + 1
          continue
        }
        if (insideBlock && lines[i].startsWith('======')) {
          block['right_start'] = parseInt(i) + 1
          continue
        }
        if (insideBlock && lines[i].startsWith('>>>>>>>')) {
          block['right_end'] = parseInt(i) + 1
          this.indexToLineMap.push(block)
          block = {}
          insideBlock = false
          continue
        }
      }
    },
    // button methods
    highlight() {
      // show the first by default
      if (this.indexToLineMap.length > 0) {
        console.log(this.indexToLineMap[0])
        this.index = 1
        this.mergeEditor.revealLineInCenter(this.indexToLineMap[0].right_start)
      }
      // highlight conflicting lines
      let decorations = []
      this.indexToLineMap.forEach(conflictBlock => {
        if (conflictBlock.base_start) {
          decorations.push({
            range: new monaco.Range(
              conflictBlock.left_start,
              0,
              conflictBlock.base_start - 1,
              0
            ),
            options: {
              isWholeLine: true,
              className: 'leftLineDecoration',
              marginClassName: 'leftLineDecoration'
            }
          })
          decorations.push({
            range: new monaco.Range(
              conflictBlock.base_start,
              0,
              conflictBlock.right_start - 1,
              0
            ),
            options: {
              isWholeLine: true,
              className: 'baseLineDecoration',
              marginClassName: 'baseLineDecoration'
            }
          })
          decorations.push({
            range: new monaco.Range(
              conflictBlock.right_start,
              0,
              conflictBlock.right_end,
              0
            ),
            options: {
              isWholeLine: true,
              className: 'rightLineDecoration',
              marginClassName: 'rightLineDecoration'
            }
          })
        } else {
          decorations.push({
            range: new monaco.Range(
              conflictBlock.left_start,
              0,
              conflictBlock.right_start - 1,
              0
            ),
            options: {
              isWholeLine: true,
              className: 'leftLineDecoration',
              marginClassName: 'leftLineDecoration'
            }
          })
          decorations.push({
            range: new monaco.Range(
              conflictBlock.right_start,
              0,
              conflictBlock.right_end,
              0
            ),
            options: {
              isWholeLine: true,
              className: 'rightLineDecoration',
              marginClassName: 'rightLineDecoration'
            }
          })
        }
      })
      // need to review
      // {
      //   range: new monaco.Range(14, 1, 17, 1),
      //   options: {
      //     isWholeLine: true,
      //     linesDecorationsClassName: 'lineNumberDecoration'
      //     // marginClassName: 'leftLineDecoration'
      //   }
      // },
      this.mergeEditor.deltaDecorations(
        this.mergeEditor.getModel().getAllDecorations(),
        decorations
      )
    },
    previousConflict() {
      if (this.index - 1 >= 1) {
        this.index -= 1
      } else {
        this.index = this.indexToLineMap.length
      }
      this.mergeEditor.revealLineInCenter(
        this.indexToLineMap[this.index - 1].right_start
      )
    },
    nextConflict() {
      if (this.index + 1 <= this.indexToLineMap.length) {
        this.index += 1
      } else {
        this.index = 1
      }
      this.mergeEditor.revealLineInCenter(
        this.indexToLineMap[this.index - 1].right_start
      )
    },

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

<style>
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

.lineNumberDecoration {
  background: orange;
  width: 5px !important;
  margin-left: 3px;
}

.leftLineDecoration {
  background: lightblue;
}

.baseLineDecoration {
  background: lightgrey;
}

.rightLineDecoration {
  background: pink;
}
</style>
