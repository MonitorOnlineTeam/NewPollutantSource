import React, { PureComponent } from 'react';
import { CascadeMultiSelect } from 'uxcore';
import { Input, Select, Checkbox, Empty } from 'antd';
import _ from 'lodash';
import { connect } from 'dva';
import config from '@/config';
import defaultSettings from '../../../config/defaultSettings'
import styles from './index.less'

let oldOptions = [];
@connect(({ common }) => ({
  entAndPointList: common.entAndPointList,
}))
class CascaderMultiple extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: "", // 搜索时input值
      currentChildren: [], // 当前选中的children
      checkedValues: [],
      checkedLabels: [],
      visible: false,
      options: props.options || [],
      currentEntLable: "",
      all: false
    };

    this.oldOptions = [
      {
        title: "全部",
        key: "0",
      },
      ...props.options || []
    ];
  }


  componentDidMount() {
    let activeElement = document;
    if (config.isShowTabs && defaultSettings.layout === "sidemenu") {
      activeElement = document.getElementsByClassName("ant-tabs-tabpane-active")[0];
    }
    let cascaderMultiple = activeElement.getElementsByClassName('cascaderMultipleBox')[0];
    document.body.addEventListener("click", (e) => {
      if (!cascaderMultiple.contains(e.target)) {
        this.setState({ visible: false, inputValue: "", options: this.oldOptions })
        let inputEle = document.getElementById('input');
        if (inputEle && inputEle.style) {
          inputEle.style.display = "none";
        }
      }
    })

    if (!this.props.options) {
      this.getDataList(this.props.pollutantTypes, this.props.regionCode)
    }
  }


  getDataList = (pollutantTypes, RegionCode) => {
    this.props.dispatch({
      type: "common/getEntAndPointList",
      payload: {
        "PollutantTypes": pollutantTypes,
        "RegionCode": RegionCode,
        "Name": "",
        "Status": [0, 1, 2, 3],
        "QCAUse": "",
        "RunState": "",
        "isFilter": true
      },
      callback: res => {
        const entAndPointList = res;
        let currentChildren = [];
        let currentIndex = undefined;
        let currentEntLable = "";
        // 计算全部长度
        let checkedValues = [];
        entAndPointList.filter(item => {
          if (item.key != 0) {
            item.children.map(itm => {
              checkedValues.push(itm.key)
            })
          }
        });

        this.oldOptions = [
          {
            title: "全部",
            key: "0",
          },
          ...entAndPointList,
        ];

        let checkedLabels = [];
        entAndPointList.map((item, index) => {
          if (item.children) {
            item.children.map(itm => {
              this.props.value && this.props.value.map(val => {
                if (itm.key == val) {
                  checkedLabels.push(item.title + "/" + itm.title)
                  currentChildren = item.children;
                  currentIndex = this.props.value ? 1 : undefined;
                  currentEntLable = item.title
                }
              })
            })
          }
        })

        this.setState({
          options: [
            {
              title: "全部",
              key: "0",
            },
            ...entAndPointList,
          ],
          allLength: checkedValues.length,
          checkedValues: this.props.value || [],
          checkedLabels: checkedLabels,
          all: this.props.value ? checkedValues.length === this.props.value.length : false,
          currentChildren: currentChildren,
          currentIndex: currentIndex,
          currentEntLable: currentEntLable
        })


        // this.setState({
        //   checkedValues: nextProps.value,
        //   checkedLabels: checkedLabels,
        //   all: this.state.allLength === nextProps.value.length
        //   // currentChildren: currentChildren,
        //   // currentIndex: currentIndex
        // })
      }
    })
  }


  componentWillReceiveProps(nextProps) {

    if (this.props.value !== nextProps.value) {
      let checkedLabels = [];
      let currentChildren = [];
      let currentIndex = 0;
      // let options = nextProps.options ? nextProps.options : nextProps.entAndPointList;
      let options = this.state.options || [];
      options.map((item, index) => {
        if (item.children) {
          item.children.map(itm => {
            nextProps.value && nextProps.value.map(val => {
              if (itm.key == val) {
                checkedLabels.push(item.title + "/" + itm.title)
                // currentChildren = item.children;
                // currentIndex = index
              }
            })
          })
        }
      })
      this.setState({
        checkedValues: nextProps.value,
        checkedLabels: checkedLabels,
        all: nextProps.value ? this.state.allLength === nextProps.value.length : false,
        // currentChildren: currentChildren,
        // currentIndex: currentIndex
      })
    }

    // 传入的污染物类型发生变化，重新请求数据
    if (this.props.pollutantTypes !== nextProps.pollutantTypes || this.props.regionCode !== nextProps.regionCode) {
      this.props.form.setFieldsValue({ [nextProps.id]: [] });
      this.getDataList(nextProps.pollutantTypes, nextProps.regionCode)
    }

    // if (this.props.entAndPointList !== nextProps.entAndPointList) {
    //   // 计算全部长度
    //   let checkedValues = [];
    //   nextProps.entAndPointList.filter(item => {
    //     if (item.key != 0) {
    //       item.children.map(itm => {
    //         checkedValues.push(itm.key)
    //       })
    //     }
    //   });

    //   // this.oldOptions = nextProps.entAndPointList;
    //   this.oldOptions = [
    //     {
    //       title: "全部",
    //       key: "0",
    //     },
    //     ...nextProps.entAndPointList,
    //   ];
    //   this.setState({
    //     options: [
    //       {
    //         title: "全部",
    //         key: "0",
    //       },
    //       ...nextProps.entAndPointList,
    //     ],
    //     allLength: checkedValues.length
    //   })
    // }
  }


  render() {
    const { currentIndex, currentChildren, checkedValues, checkedLabels, visible, options, inputValue, currentEntLable, all } = this.state;
    const { style } = this.props;
    const ele = document.querySelector(".ant-select-selection--multiple")
    let width = 200;
    let showNum = 2;
    let showLabel = checkedLabels;
    if (ele && checkedLabels.length) {
      width = ele.clientWidth;
      let index1Length = checkedLabels[1] ? checkedLabels[1].length : 0;
      showNum = (checkedLabels[0].length + index1Length) * 20 < width * .6 ? 2 : 1
      showLabel = checkedLabels.length > 1 ? [...checkedLabels.slice(0, showNum), "..."] : [...checkedLabels.slice(0, showNum)]
    }
    return (
      <div className={`${styles.cascaderMultiple} cascaderMultipleBox`} onClick={(e) => { e.stopPropagation(); }} style={{ ...style, maxHeight: 40 }}>
        {/* <p>[{checkedValues.toString()}]</p> */}
        <div className="ant-select ant-select-enabled" style={{ width: "100%" }} onClick={(e) => {
          e.stopPropagation();
          let inputEle = document.getElementById('input');
          inputEle.style.display = "inline";
          inputEle.focus();
          this.setState({
            visible: true
          })
        }}>
          <div className="ant-select-selection ant-select-selection--multiple" style={{ maxHeight: 64, overflowY: 'auto', marginTop: 4 }}>
            <div className="ant-select-selection__rendered">
              <ul>
                {
                  all ? <li className="ant-select-selection__choice" style={{ userSelect: "none" }}>
                    <div className="ant-select-selection__choice__content">
                      全部
                    </div>
                    <span className="ant-select-selection__choice__remove" onClick={(e) => {
                      e.stopPropagation();
                      this.setState({
                        all: false,
                        checkedLabels: [],
                        checkedValues: [],
                      })
                      this.props.form && this.props.form.setFieldsValue({ [this.props.id]: [] });
                      this.props.onChange && this.props.onChange([])
                    }}>
                      <i aria-label="图标: close" className="anticon anticon-close ant-select-remove-icon">
                        <svg viewBox="64 64 896 896" focusable="false" className="" data-icon="close" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                          <path d="M563.8 512l262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9A7.95 7.95 0 0 0 203 838h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z"></path>
                        </svg>
                      </i>
                    </span>
                  </li> :
                    showLabel.map((item, index) => {
                      return <li key={index} className="ant-select-selection__choice" title={item} style={{ userSelect: "none", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "80%" }}>
                        {item}
                        <span className="ant-select-selection__choice__remove" onClick={(e) => {
                          e.stopPropagation();
                          if (item !== "...") {
                            let newCurrentChildren = [...this.state.currentChildren];
                            let checkedLabels = [...this.state.checkedLabels];
                            let checkedValues = [...this.state.checkedValues];
                            // let label = item.split("/")[1];
                            // newCurrentChildren[index].checked = false;
                            _.remove(checkedLabels, (n) => n == item)
                            _.remove(checkedValues, (n, i) => i == index)
                            this.setState({ checkedValues, checkedLabels })
                            this.props.form && this.props.form.setFieldsValue({ [this.props.id]: checkedValues });
                            this.props.onChange && this.props.onChange(checkedValues)
                          }
                        }}>
                          {item !== "..." && <i aria-label="图标: close" className="anticon anticon-close ant-select-remove-icon">
                            <svg viewBox="64 64 896 896" focusable="false" className="" data-icon="close" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                              <path d="M563.8 512l262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9A7.95 7.95 0 0 0 203 838h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z"></path>
                            </svg>
                          </i>}
                        </span>
                      </li>
                    })
                }
                <li className="ant-select-search ant-select-search--inline">
                  <div className="ant-select-search__field__wrap">
                    <Input autocomplete="off" id="input" value={inputValue} style={{ width: inputValue.length * 20, minWidth: 60, display: "none" }} className="ant-select-search__field cascader_multiple" onPressEnter={e => {
                      let inputValue = e.target.value;
                      let newOptions = [...this.oldOptions];
                      if (e.target.value) {
                        newOptions = newOptions.filter(item => item.title.indexOf(inputValue) != -1);
                      }
                      // if(newOptions.length) { inputValue = "" }
                      this.setState({
                        // inputValue: inputValue,
                        options: newOptions,
                        currentIndex: 0,
                        currentEntLable: newOptions[0] ? newOptions[0].title : "",
                        currentChildren: newOptions.length ? newOptions[0].children || [] : []
                      })

                    }}
                      onChange={(e) => {
                        let newOptions = this.state.options;
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
          // visible &&
          <div className="ant-cascader-menus ant-cascader-menus-placement-bottomLeft" style={{ marginTop: -4, display: visible ? "block" : "none" }} onClick={(e) => {
          }}>
            <div>
              <ul className="ant-cascader-menu">
                {
                  options.length ? options.map((item = {}, index) => {
                    return (
                      <li key={index} className={`ant-cascader-menu-item ant-cascader-menu-item-expand ${currentIndex === index ? "ant-cascader-menu-item-active" : null}`} title={item.title} role="menuitem" onClick={(e) => {
                        // <li className={`ant-cascader-menu-item ant-cascader-menu-item-expand`} title="Zhejiang" role="menuitem" onClick={(e) => {
                        e.stopPropagation();
                        // 全部
                        if (item.key == 0) {
                          let checkedLabels = [];
                          let checkedValues = [];
                          this.oldOptions.filter(item => {
                            if (item.key != 0) {
                              item.children.map(itm => {
                                checkedLabels.push(item.title + "/" + itm.title)
                                checkedValues.push(itm.key)
                              })
                            }
                          });
                          // let checkedLabels = options.filter(item => { if (item.key != 0) return item.title });
                          // let checkedValues = options.filter(item => { if (item.key != 0) return item.key });
                          this.setState({ checkedLabels, checkedValues, all: true })
                          this.props.form && this.props.form.setFieldsValue({ [this.props.id]: checkedValues });
                          this.props.onChange && this.props.onChange(checkedValues)
                        } else {
                          this.setState({
                            currentIndex: index,
                            // inputValue: "",
                            visible: true,
                            currentEntLable: item.title,
                            currentChildren: item.children || []
                          })
                        }
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
                  }) : <li className="ant-cascader-menu-item ant-cascader-menu-item-disabled" title="" role="menuitem">
                      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                    </li>
                }
              </ul>
              <ul className="ant-cascader-menu" style={{ display: currentChildren.length ? "inline-block" : "none" }}>
                {
                  currentChildren.length ? currentChildren.map((item, index) => {
                    return <li key={item.key} className={`ant-cascader-menu-item`} title={item.title} role="menuitem">
                      <Checkbox key={item.key} checked={checkedLabels.includes(currentEntLable + "/" + item.title)} onChange={(e) => {
                        e.stopPropagation()
                        // <Checkbox checked={item.checked} onChange={(e) => {
                        let newCurrentChildren = [...this.state.currentChildren];
                        let checkedLabels = [...this.state.checkedLabels];
                        let checkedValues = [...this.state.checkedValues];
                        let title = currentEntLable + "/" + item.title;
                        let all = this.state.all;
                        if (e.target.checked) {
                          checkedLabels.push(title)
                          checkedValues.push(item.key)
                        } else {
                          all = false;
                          _.remove(checkedLabels, (n) => n == title)
                          _.remove(checkedValues, (n) => n == item.key)
                        }
                        newCurrentChildren[index].checked = e.target.checked;
                        // if (newCurrentChildren.filter(itm => itm.checked).length === newCurrentChildren.length) {
                        //   console.log("123123123")
                        //   checkedLabels = [currentEntLable + "(全部)"]
                        // }
                        // e.target.checked ? checkedValues.push(item.label) : _.remove(checkedValues, (n) => n == item.label)
                        this.setState({
                          // inputValue: "",
                          currentChildren: newCurrentChildren,
                          checkedLabels: checkedLabels,
                          checkedValues: checkedValues,
                          visible: true,
                          all
                        })
                        this.props.form && this.props.form.setFieldsValue({ [this.props.id]: checkedValues });
                        this.props.onChange && this.props.onChange(checkedValues)
                        // this.props.form.setFieldsValue({""})
                      }}>{item.title}</Checkbox>
                    </li>
                  }) : ""
                }
              </ul>
            </div>
          </div>
        }
      </div>
    );
  }
}

CascaderMultiple.defaultProps = {
  // options: []
}

export default CascaderMultiple;
