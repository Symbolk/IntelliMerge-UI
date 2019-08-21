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
              <b-button @click="highlight()" variant="warning">{{index}}/{{conflictBlocks.length}}</b-button>
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
              ref="leftEditor"
            ></MonacoEditor>
          </b-col>
          <b-col>
            <MonacoEditor
              :language="language"
              :options="diffOptions"
              :theme="editorTheme"
              :value="base"
              class="editor"
              ref="baseEditor"
            ></MonacoEditor>
          </b-col>
          <b-col>
            <MonacoEditor
              :language="language"
              :options="diffOptions"
              :theme="editorTheme"
              :value="right"
              class="editor"
              ref="rightEditor"
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
      conflictBlocks: [], // start from 0
      filePaths: [],
      left: '',
      base: '',
      right: '',
      merged: '',
      dirty: false, // if the merged is edited, show save button

      collapsed: true,
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
    for (let path of window.process.argv.slice(-4)) {
      this.filePaths.push(String(path))
    }

      readLocalFile(this.filePaths[1], 'utf-8')
        .then(res => {
          this.base = res
        })
        .catch(err => {
          console.log(err)
        })
      readLocalFile(this.filePaths[0], 'utf-8')
        .then(res => {
          this.left = res
        })
        .catch(err => {
          console.log(err)
        })
      readLocalFile(this.filePaths[2], 'utf-8')
        .then(res => {
          this.right = res
        })
        .catch(err => {
          console.log(err)
        })
      readLocalFile(this.filePaths[3], 'utf-8')
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
    this.leftEditor = this.$refs.leftEditor.getEditor()
    this.baseEditor = this.$refs.baseEditor.getEditor()
    this.rightEditor = this.$refs.rightEditor.getEditor()
  },
  methods: {
    onEditorMount(editor) {
      // this.mergeEditor = this.$refs.mergeEditor.getEditor()
      // this.highlight()
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
      this.conflictBlocks = []
      let lines = this.merged.split(/\r?\n/)
      // get three way start line
      let block = {
        left_start: -1,
        base_start: -1,
        right_start: -1,
        right_end: -1,
        left_code: [],
        base_code: [],
        right_code: []
      }
      let insideBlock = -1 // 1=left 0=base 2=right
      for (let i in lines) {
        let line = lines[i]
        if (insideBlock < 0) {
          if (line.startsWith('<<<<<<')) {
            block = {
              left_start: -1,
              base_start: -1,
              right_start: -1,
              right_end: -1,
              left_code: [],
              base_code: [],
              right_code: []
            }
            block.left_start = parseInt(i) + 1
            insideBlock = 1
            continue
          }
        } else {
          if (line.startsWith('|||||||')) {
            block.base_start = parseInt(i) + 1
            insideBlock = 0
            continue
          }
          if (line.startsWith('======')) {
            block.right_start = parseInt(i) + 1
            insideBlock = 2
            continue
          }
          if (line.startsWith('>>>>>>>')) {
            block.right_end = parseInt(i) + 1
            this.conflictBlocks.push(block)
            block = {
              left_start: -1,
              base_start: -1,
              right_start: -1,
              right_end: -1,
              left_code: [],
              base_code: [],
              right_code: []
            }
            insideBlock = -1
            continue
          }
          switch (insideBlock) {
            case 1:
              block.left_code.push(line)
              break
            case 0:
              block.base_code.push(line)
              break
            case 2:
              block.right_code.push(line)
              break
          }
        }
      }
    },
    // button methods
    highlight() {
      // show the first by default
      if (this.conflictBlocks.length > 0) {
        this.index = 1
        this.mergeEditor.revealLineInCenter(this.conflictBlocks[0].right_start)
      }
      // highlight conflicting lines
      let decorations = []
      this.conflictBlocks.forEach(conflictBlock => {
        if (conflictBlock.base_start > 0) {
          // diff3
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
          // diff2
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

      this.mergeEditor.deltaDecorations(
        this.mergeEditor.getModel().getAllDecorations(),
        decorations
      )
      // three way diff
      this.leftEditor.deltaDecorations(
        [],
        [
          {
            range: new monaco.Range(119, 1, 121, 1),
            options: {
              marginClassName: 'leftLineDecoration'
            }
          },
          {
            range: new monaco.Range(126, 1, 135, 1),
            options: {
              marginClassName: 'leftLineDecoration',
              hoverMessage: {
                value: 'Extracted from [saveAll()]'
              }
            }
          }
        ]
      )
      this.baseEditor.deltaDecorations(
        [],
        [
          {
            range: new monaco.Range(79, 1, 85, 1),
            options: {
              marginClassName: 'baseLineDecoration'
            }
          }
        ]
      )

      this.rightEditor.deltaDecorations(
        [],
        [
          {
            range: new monaco.Range(84, 1, 90, 1),
            options: {
              marginClassName: 'rightLineDecoration'
            }
          }
        ]
      )
    },
    previousConflict() {
      if (this.index - 1 >= 1) {
        this.index -= 1
      } else {
        this.index = this.conflictBlocks.length
      }
      this.mergeEditor.revealLineInCenter(
        this.conflictBlocks[this.index - 1].right_start
      )
    },
    nextConflict() {
      if (this.index + 1 <= this.conflictBlocks.length) {
        this.index += 1
      } else {
        this.index = 1
      }
      this.mergeEditor.revealLineInCenter(
        this.conflictBlocks[this.index - 1].right_start
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
  background: rgb(241, 238, 6);
  /* width: 5px !important;
  margin-left: 3px; */
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
