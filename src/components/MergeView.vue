<template>
  <div :class="[{'collapsed' : collapsed}]" id="demo">
    <!-- <b-container class="container" fluid> -->
    <b-row>
      <sidebar-menu
        :collapsed="collapsed"
        :menu="menu"
        :theme="sidebarTheme"
        @collapse="onCollapse"
      />
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
          <b-col>
          </b-col>
          <b-col cols="3"></b-col>
          <b-col>
            <b-button pill size="sm" variant="danger">
              <v-icon name="save" />Save
            </b-button>&nbsp;
            <b-button pill size="sm" variant="primary">
              <v-icon name="check" />Commit
            </b-button>&nbsp;
            <b-button pill size="sm" variant="info">
              <v-icon name="cogs" />Settings
            </b-button>
          </b-col>
        </b-row>
        <b-row class="diff-view" no-gutters>
          <b-col>
            <MonacoEditor :theme="editorTheme" class="editor" language="javascript" value="value"></MonacoEditor>
          </b-col>
          <b-col>
            <MonacoEditor :theme="editorTheme" class="editor" language="javascript" value="gege"></MonacoEditor>
          </b-col>
          <b-col>
            <MonacoEditor :theme="editorTheme" class="editor" language="javascript" value="gege"></MonacoEditor>
          </b-col>
        </b-row>
        <!-- merged -->
        <b-row>
          <b-col class="merge-view">
            <MonacoEditor
              :theme="editorTheme"
              class="merge-editor"
              language="javascript"
              value="gege"
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
      index: 0,
      options: {
        //Monaco Editor Options
      },
      sidebarTheme: 'black-theme',
      editorTheme: 'vs-dark',
      collapsed: false,
      menu: [
        {
          header: true,
          title: 'Main Navigation'
          // component: componentName
          // visibleOnCollapse: true
          // class:''
          // attributes: {}
        },
        {
          // item
          href: '/',
          title: 'Dashboard',
          icon: 'fa fa-user'
          /*
                        // custom icon
                        icon: {
                            element: 'span',
                            class: 'fa fa-user',
                            attributes: {}
                        }
                        */
          // disabled: true
          // class: ''
          // attributes: {}
          // alias: '/path'
          /*
                        badge: {
                            text: 'new',
                            class: 'default-badge'
                            // attributes: {}
                            // element: 'span'
                        }
                        */
        },
        {
          // item with child
          href: '/charts',
          title: 'Charts',
          icon: 'fa fa-chart-area',
          child: [
            {
              href: '/charts/sublink',
              title: 'Sub Link'
            }
          ]
        }
      ]
    }
  },
  methods: {
    onCollapse(collapsed) {
      this.collapsed = collapsed
    },
    onItemClick(event, item) {
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
  width: 10/12vw;
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
