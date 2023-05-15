// 多选下拉框组件

import React, { Component } from 'react';
import { connect } from 'dva';
import { Select, Spin } from 'antd';
import PropTypes from 'prop-types';
const { Option } = Select;


// const  waterDefault = ["011","060"]
// const  gasDefault =["a21002","a21026","a19001"]
@connect(({ loading, qcaCheck }) => ({
  pollLoading: loading.effects['qcaCheck/getPollutantListByDgimn'],
  pollutantlist: qcaCheck.pollutantList,
}))

class Index extends Component {

  static propTypes = {
    // defaultValue: PropTypes.string || PropTypes.array,
    style: PropTypes.object,
    className: PropTypes.string,
    optionDatas: PropTypes.array,
    changeCallback: PropTypes.func,
    maxTagCount: PropTypes.number,
    maxTagTextLength: PropTypes.number,
    pollutantlist: PropTypes.array,
    isDefaulltAll: PropTypes.number
  }
  static defaultProps = {
    style: { width: "100%" },
    placeholder: "请选择污染物",
    mode: "multiple",
    allowClear: false,
    maxTagCount: 1,//选择项最大个数
    maxTagTextLength: 2,//单个选择项文本长度 超出则是省略号显示
    pollutantlist: [],
    isdefaulltall: 0,
    customCode: [],
    isqca: ""

  }
  constructor(props) {
    super(props);
    this.state = {
      defaultValues: "",
      waterDefault: ["011", "060"],
      gasDefault: ["a21002", "a21026", "a19001"]
    };
  }

  componentDidMount() {

    this.changeDgimn(this.props.dgimn)
    this.props.onRef && this.props.onRef(this)// ->将child传递给this.props.onRef()方法


  }

  pollutantlist = () => {
    return this.props.pollutantlist.map(item => {
      return item.PollutantCode;
    })
  }
  // 在componentDidUpdate中进行异步操作，驱动数据的变化
  componentDidUpdate(prevProps) {
    if (prevProps.dgimn !== this.props.dgimn) {
      this.changeDgimn(this.props.dgimn);
    }
  }
  /** 切换排口  根据排口dgimn获取它下面的所有污染物*/
  changeDgimn = (dgimn) => {
    const { dispatch, isdefaulltall, polltype, isqca, pollutantlist, customcode, pollLoading } = this.props;
    const { waterDefault, gasDefault } = this.state;
    this.props.dispatch({
      type: "qcaCheck/getPollutantListByDgimn",
      payload: {
        DGIMN: dgimn,
      },
      callback: (data) => {
        console.log('adssadasd=', data);
        const pollDefaultSelect = data.length > 0 ? isdefaulltall ? data.map((item, index) => {
          return item.PollutantCode
        }) : customcode && customcode.length > 0 ? customcode : polltype == 1 ? waterDefault : polltype == 2 ? gasDefault : [] : [];
        console.log('pollDefaultSelect=', pollDefaultSelect);
        this.setState({ defaultValues: pollDefaultSelect })

      }
    })

  }

  getOption = () => {
    const { pollutantlist } = this.props;
    const res = [];
    if (pollutantlist.length > 0) {
      pollutantlist.map((item, key) => {
        res.push(<Option key={key} value={item.PollutantCode} >{item.PollutantName}</Option>);
      })
    }
    return res;
  }
  initData = () => {
    return this.state.defaultValues
  }
  render() {
    const { maxTagPlaceholder, pollLoading, pollutantlist, isdefaulltall, polltype, onChange, defaulltval, allowClear } = this.props;//超出最大选择项最大个数时 其余选择项的展示方式  默认为  " + {未展示选择项数量} ... " 

    const { defaultValues } = this.state;
    console.log('defaultValues=', defaultValues);
    return (
      !pollLoading ? <Select  {...this.props} defaultValue={defaultValues}>
        {this.getOption()}
      </Select> : <Spin size="small" style={{ paddingRight: 10 }} />

    );
  }
}
export default Index;
