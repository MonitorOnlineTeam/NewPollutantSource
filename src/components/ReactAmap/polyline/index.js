// @flow
import React from 'react'
import withPropsReactive from '../utils/withPropsReactive'
import log from '../utils/log'
import PolyEditor from '../polyeditor'
import { toLnglat } from '../utils/common'

const Component = React.Component

const configurableProps = [
  'path',
  'extData',
  'draggable',

  /* 扩展属性*/
  'visible',
  'style'
]

const allProps = configurableProps.concat([
  'zIndex',
  'bubble',
  'showDir'
])



class Polyline extends Component {

 

  constructor(props) {
    super(props)
    if (typeof window !== 'undefined') {
      if (!props.__map__) {
        log.warning('MAP_INSTANCE_REQUIRED')
      } else {
        const self = this
        this.setterMap = {
          visible(val) {
            if (val) {
              self.polyline && self.polyline.show()
            } else {
              self.polyline && self.polyline.hide()
            }
          },
          style(val) {
            self.polyline.setOptions(val)
          }
        }
        this.converterMap = {
          path(val) {
            return self.buildPathValue(val)
          }
        }
        this.state = {
          loaded: false
        }
        this.map = props.__map__
        this.element = this.map.getContainer()
        setTimeout(() => {
          this.createMapPolyline(props)
        }, 13)
      }
    }
  }

  get instance() {
    return this.polyline
  }

  createMapPolyline(props) {
    const options = this.buildCreateOptions(props)
    options.map = this.map
    this.polyline = new window.AMap.Polyline(options)
    this.setState({
      loaded: true
    })
    this.props.onInstanceCreated && this.props.onInstanceCreated()
  }

  buildCreateOptions(props) {
    const options = {}
    allProps.forEach((key) => {
      if (key in props) {
        if ((key === 'style') && props.style) {
          const styleItem = Object.keys(props.style)
          styleItem.forEach((item) => {
            // $FlowFixMe
            options[item] = props.style[item]
          })
          // visible 做特殊处理
        } else if (key !== 'visible') {
          options[key] = this.getSetterValue(key, props[key])
        }
      }
    })
    return options
  }

  detectPropChanged(key, nextProps) {
    return this.props[key] !== nextProps[key]
  }

  getSetterValue(key, value) {
    if (key in this.converterMap) {
      return this.converterMap[key](value)
    }
    return value
  }

  buildPathValue(path) {
    if (path.length) {
      if ('getLng' in path[0]) {
        return path
      }
      return path.map((p) => (toLnglat(p)))
    }
    return path
  }

  renderEditor(children) {
    if (!children) {
      return null
    }
    if (React.Children.count(children) !== 1) {
      return null
    }
    const child = React.Children.only(children)
    if (child.type === PolyEditor) {
      return React.cloneElement(child, {
        __poly__: this.polyline,
        __map__: this.map
      })
    }
    return null
  }

  render() {
    return this.state.loaded ? (this.renderEditor(this.props.children)) : null
  }
}

export default withPropsReactive(Polyline)
