import React, { Component } from 'react';
import { CascadeMultiSelect } from 'uxcore';
import { Input, Select, Checkbox, Empty } from 'antd';
import _ from 'lodash';
import { connect } from 'dva';

let oldOptions = [];
@connect()
class CascaderMultiple extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: "",
      currentChildren: [],
      checkedValues: [],
      checkedLabels: [],
      visible: false,
      options: props.options,
      currentEntLable: "",
    };

    this.oldOptions = props.options;
  }


  componentDidMount() {
    let cascaderMultiple = document.getElementById('cascaderMultiple');
    document.body.addEventListener("click", (e) => {
      if (!cascaderMultiple.contains(e.target)) {
        this.setState({ visible: false })
      }
    })

    if (this.props.loadData) {
      this.props.dispatch({
        type: "common/getEntAndPointList",
        payload: {

        }
      })
    }
  }


  componentWillReceiveProps(nextProps) {
    if (this.props.options !== nextProps.options) {
      this.oldOptions = nextProps.options;
      this.setState({ options: nextProps.options });
    }
    if (this.props.value !== nextProps.value) {
      let checkedLabels = [];
      let currentChildren = [];
      let currentIndex = 0;
      nextProps.options.map((item, index) => {
        if (item.children) {
          item.children.map(itm => {
            nextProps.value.map(val => {
              if (itm.key == val) {
                checkedLabels.push(itm.title)
                // currentChildren = item.children;
                // currentIndex = index
              }
            })
          })
        }
      })
      console.log("checkedLabels=",checkedLabels)
      this.setState({
        checkedValues: nextProps.value,
        checkedLabels: checkedLabels,
        // currentChildren: currentChildren,
        // currentIndex: currentIndex
      })
    }
  }


  render() {
    const config = [{ showSearch: true, checkable: true }, { showSearch: true, checkable: true }];
    const { currentIndex, currentChildren, checkedValues, checkedLabels, visible, options, inputValue, currentEntLable } = this.state;
    const { style } = this.props;
    console.log("CascaderMultiple=", this.props)
    return (
      <div id="cascaderMultiple" onClick={(e) => { e.stopPropagation() }} style={{ ...style }} >
        {/* <p>[{checkedValues.toString()}]</p> */}
        <div className="ant-select ant-select-enabled" style={{ width: "100%" }} onClick={(e) => {
          e.stopPropagation();
          document.getElementById('input').focus();
          this.setState({
            visible: true
          })
        }}>
          <div className="ant-select-selection ant-select-selection--multiple">
            <div className="ant-select-selection__rendered">
              <ul>
                {
                  checkedLabels.map((item, index) => {
                    return (
                      <li className="ant-select-selection__choice" title={item} style={{ userSelect: "none" }}>
                        <div className="ant-select-selection__choice__content">{item}</div>
                        <span className="ant-select-selection__choice__remove" onClick={(e) => {
                          e.stopPropagation();
                          let checkedLabels = [...this.state.checkedLabels];
                          let checkedValues = [...this.state.checkedValues];
                          _.remove(checkedLabels, (n) => n == item)
                          _.remove(checkedValues, (n, i) => i == index)
                          this.setState({ checkedValues, checkedLabels })
                        }}>
                          <i aria-label="图标: close" className="anticon anticon-close ant-select-remove-icon">
                            <svg viewBox="64 64 896 896" focusable="false" className="" data-icon="close" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                              <path d="M563.8 512l262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9A7.95 7.95 0 0 0 203 838h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z"></path>
                            </svg>
                          </i>
                        </span>
                      </li>
                    )
                  })
                }
                <li className="ant-select-search ant-select-search--inline">
                  <div className="ant-select-search__field__wrap">
                    <Input autocomplete="off" id="input" value={inputValue} style={{width: inputValue.length * 20, minWidth: 60}} className="ant-select-search__field cascader_multiple" onPressEnter={e => {
                      let inputValue = e.target.value;
                      let newOptions = [...this.oldOptions];
                      if (e.target.value) {
                        newOptions = newOptions.filter(item => item.title.indexOf(inputValue) != -1);
                      }
                      // if(newOptions.length) { inputValue = "" }
                      this.setState({
                        // inputValue: inputValue,
                        options: newOptions,
                        currentChildren: newOptions.length ? newOptions[0].children || [] : []
                      })
                    }}
                      onChange={(e) => {
                        let newOptions = this.state.options;
                        console.log('e.target.value=', e.target.value)
                        if (e.target.value == "") {
                          newOptions = this.oldOptions;
                        }
                        this.setState({
                          inputValue: e.target.value,
                          options: newOptions
                        })
                      }}
                    />
                    <span className="ant-select-search__field__mirror">&nbsp;</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
        {
          visible && <div className="ant-cascader-menus ant-cascader-menus-placement-bottomLeft" onClick={(e) => {
            console.log("click")
          }}>
            <div>
              <ul className="ant-cascader-menu">
                {
                  options.length ? options.map((item, index) => {
                    return (
                      <li className={`ant-cascader-menu-item ant-cascader-menu-item-expand ${currentIndex === index ? "ant-cascader-menu-item-active" : null}`} title="Zhejiang" role="menuitem" onClick={(e) => {
                        // <li className={`ant-cascader-menu-item ant-cascader-menu-item-expand`} title="Zhejiang" role="menuitem" onClick={(e) => {
                        e.stopPropagation();
                        this.setState({
                          currentIndex: index,
                          // inputValue: "",
                          visible: true,
                          currentEntLable: item.title,
                          currentChildren: item.children || []
                        })
                      }}>
                        {item.title}
                        {
                          item.children && item.children.length && <span className="ant-cascader-menu-item-expand-icon">
                            <i aria-label="图标: right" className="anticon anticon-right">
                              <svg viewBox="64 64 896 896" focusable="false" className="" data-icon="right" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                                <path d="M765.7 486.8L314.9 134.7A7.97 7.97 0 0 0 302 141v77.3c0 4.9 2.3 9.6 6.1 12.6l360 281.1-360 281.1c-3.9 3-6.1 7.7-6.1 12.6V883c0 6.7 7.7 10.4 12.9 6.3l450.8-352.1a31.96 31.96 0 0 0 0-50.4z"></path>
                              </svg>
                            </i>
                          </span>
                        }
                      </li>
                    )
                  }) : <li class="ant-cascader-menu-item ant-cascader-menu-item-disabled" title="" role="menuitem">
                      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                    </li>
                }
              </ul>

              {currentChildren.length ? <ul className="ant-cascader-menu">
                {
                  currentChildren.map((item, index) => {
                    return <li className="ant-cascader-menu-item" title="Zhejiang" role="menuitem">
                      <Checkbox checked={checkedLabels.indexOf(item.title) !== -1} onChange={(e) => {
                        let newCurrentChildren = [...this.state.currentChildren];
                        let checkedLabels = [...this.state.checkedLabels];
                        let checkedValues = [...this.state.checkedValues];

                        if (e.target.checked) {
                          checkedLabels.push(item.title)
                          checkedValues.push(item.key)
                        } else {
                          _.remove(checkedLabels, (n) => n == item.title)
                          _.remove(checkedValues, (n) => n == item.key)
                        }
                        // newCurrentChildren[index].checked = e.target.checked;
                        // if (newCurrentChildren.filter(itm => itm.checked).length === newCurrentChildren.length) {
                        //   console.log("123123123")
                        //   checkedLabels = [currentEntLable + "(全部)"]
                        // }
                        // e.target.checked ? checkedValues.push(item.label) : _.remove(checkedValues, (n) => n == item.label)
                        this.setState({
                          // inputValue: "",
                          // currentChildren: newCurrentChildren,
                          checkedLabels: checkedLabels,
                          checkedValues: checkedValues
                        })
                        this.props.form.setFieldsValue({ [this.props.id]: checkedValues});
                        // this.props.form.setFieldsValue({""})
                      }}>{item.title}</Checkbox>
                    </li>
                  })
                }
              </ul> : ""
              }
            </div>
          </div>
        }
      </div>
    );
  }
}

CascaderMultiple.defaultProps = {
  options: []
}

export default CascaderMultiple;