<template>
  <div>
    <!-- <b-container class="container" fluid> -->
    <b-row>
      <b-col cols="2">1</b-col>
      <!-- left-base-right -->
      <b-col cols="10">
        <b-row class="button-area">
          <b-col>
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
          <b-col>
            <b-button size="sm" variant="danger">Save</b-button>
          </b-col>
        </b-row>
        <b-row class="diff-view">
          <b-col cols="4">
            <MonacoEditor class="editor" language="javascript" theme="vs-light" value="value"></MonacoEditor>
          </b-col>
          <b-col cols="4">
            <MonacoEditor class="editor" language="javascript" theme="vs-light" value="gege"></MonacoEditor>
          </b-col>
          <b-col cols="4">
            <MonacoEditor class="editor" language="javascript" theme="vs-light" value="gege"></MonacoEditor>
          </b-col>
        </b-row>
        <!-- merged -->
        <b-row class="merge-view">
          <b-col>
            <MonacoEditor class="merge-editor" language="javascript" theme="vs-light" value="gege"></MonacoEditor>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
    <!-- </b-container> -->
  </div>
</template>

<script>
// import MonacoEditor from 'monaco-editor-vue'
// import MonacoEditor from 'vue-monaco-editor'
import MonacoEditor from './vue-monaco'

export default {
  name: 'Cards',

  components: {
    MonacoEditor
  },

  data() {
    return {
      index: 0,
      options: {
        //Monaco Editor Options
      }
    }
  },
  methods: {}
}
</script>

<style scoped>
/* .button-area {
  height: 4vh;
} */

.diff-view {
  height: 45vh;
}

.merge-view {
  height: 45vh;
}

.editor {
  height: 50vh;
  width: 10/36vw;
  margin: 0px;
  padding: 0px;
}

.merge-editor {
  height: 50vh;
  width: 10/12vw;
  margin: 0px;
  padding: 0px;
}
</style>
