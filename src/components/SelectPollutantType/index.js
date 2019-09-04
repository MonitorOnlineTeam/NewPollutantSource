import React, { PureComponent } from 'react';
import { Radio, Select } from 'antd'
import { connect } from 'dva';

const { Option } = Select;

@connect(({ common, loading }) => {
  return {
    loading: loading.effects['common/getPollutantTypeList'],
    pollutantTypelist: common.pollutantTypelist,
    defaultPollutantCode: common.defaultPollutantCode
  }
})
class SelectPollutantType extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    this.props.dispatch({
      type: 'common/getPollutantTypeList',
      payload: {
        filterPollutantType:this.props.filterPollutantType//自定义显示污染物类型 wjw
      },
    });
  }
  render() {
    const { pollutantTypelist, defaultPollutantCode, loading, showType } = this.props;
    if (!loading) {
      return (
        <>
          {
            showType === "radio" ?
              <Radio.Group
                defaultValue={defaultPollutantCode}
                {...this.props}
              >
                {
                  pollutantTypelist.map(item => {
                    return <Radio.Button key={item.pollutantTypeCode} value={item.pollutantTypeCode}>{item.pollutantTypeName}</Radio.Button>
                  })
                }
              </Radio.Group> :
              <Select
                placeholder="请选择污染物类型"
                // defaultValue={defaultPollutantCode}
                {...this.props}
              >
                {
                  pollutantTypelist.map(item => {
                    return <Option key={item.pollutantTypeCode} value={item.pollutantTypeCode}>{item.pollutantTypeName}</Option>
                  })
                }
              </Select>
          }
        </>
      );
    }
    return null;
  }
}

export default SelectPollutantType;
