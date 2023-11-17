// @flow
import React from 'react'
import log from '../utils/log'
import isFun from '../utils/isFun'


class CircleEditor extends React.Component {


  constructor(props) {
    super(props)
    if (typeof window !== 'undefined') {
      if (!(props.__map__ && props.__circle__)) {
        log.warning('CIRCLE_INSTANCE_REQUIRED')
      } else {
        this.map = props.__map__
        this.element = this.map.getContainer()
        this.circle = props.__circle__
        this.editorActive = false
        this.onPropsUpdate(props)
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.map) {
      this.onPropsUpdate(nextProps)
    }
  }

  onPropsUpdate(props) {
    if ('active' in props && props.active === false) {
      this.toggleActive(false, props)
    } else {
      this.toggleActive(true, props)
    }
  }

  toggleActive(active, props) {
    if (active) {
      if (!this.editorActive) {
        this.activeEditor(props)
      }
    } else {
      if (this.editorActive) {
        this.inactiveEditor()
      }
    }
  }

  activeEditor(props) {
    this.loadCircleEditor(props).then((editor) => {
      this.editorActive = true
      editor.open()
    })
  }

  inactiveEditor() {
    this.editorActive = false
    if (this.circleEditor) {
      this.circleEditor.close()
    }
  }

  loadCircleEditor(props) {
    if (this.circleEditor) {
      return Promise.resolve(this.circleEditor)
    }
    return new Promise((resolve) => {
      this.map.plugin(['AMap.CircleEditor'], () => {
        resolve(this.createEditorInstance(props))
      })
    })
  }

  createEditorInstance(props) {
    this.circleEditor = new window.AMap.CircleEditor(
      this.map, this.circle
    )
    const events = this.exposeEditorInstance(props)
    events && this.bindEditorEvents(events)
    return this.circleEditor
  }

  exposeEditorInstance(props) {
    if ('events' in props) {
      const events = props.events || {}
      if (isFun(events.created)) {
        events.created(this.circleEditor)
      }
      delete events.created
      return events
    }
    return false
  }

  bindEditorEvents(events) {
    const list = Object.keys(events)
    list.length && list.forEach((evName) => {
      this.circleEditor.on(evName, events[evName])
    })
  }

  render() {
    return null
  }
}

export default CircleEditor
