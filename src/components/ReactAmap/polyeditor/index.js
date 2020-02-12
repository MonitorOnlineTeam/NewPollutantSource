// @flow
import React from 'react'
import withPropsReactive from '../utils/withPropsReactive'
import log from '../utils/log'

 
class PolyEditor extends React.Component {

  
  constructor(props) {
    super(props)
    if (typeof window !== 'undefined') {
      if (!(props.__map__ && props.__poly__)) {
        log.warning('MAP_INSTANCE_REQUIRED')
      } else {
        const self = this
        this.setterMap = {
          active(val) {
            self.toggleActive(val)
          }
        }
        this.map = props.__map__
        this.poly = props.__poly__
        this.editorActive = false
        this.createEditorInstance().then(() => {
          this.props.onInstanceCreated && this.props.onInstanceCreated()
        })
      }
    }
  }

  get instance() {
    return this.polyEditor
  }

  toggleActive(active) {
    if (active) {
      if (!this.editorActive) {
        this.activeEditor()
      }
    } else {
      if (this.editorActive) {
        this.inactiveEditor()
      }
    }
  }

  activeEditor() {
    if (this.polyEditor) {
      this.editorActive = true
      this.polyEditor.open()
    }
  }

  inactiveEditor() {
    this.editorActive = false
    if (this.polyEditor) {
      this.polyEditor.close()
    }
  }

  createEditorInstance() {
    if (this.polyEditor) {
      return Promise.resolve(this.polyEditor)
    }
    return new Promise((resolve) => {
      this.map.plugin(['AMap.PolyEditor'], () => {
        this.polyEditor = new window.AMap.PolyEditor(
          this.map, this.poly
        )
        resolve(this.polyEditor)
      })
    })
  }

  render() {
    return null
  }
}

export default withPropsReactive(PolyEditor)
