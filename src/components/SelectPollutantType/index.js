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
    this.state = {
      pollutantTypelist: [],
      defaultPollutantCode: undefined
    };
  }
  componentDidMount() {
    const { onlyShowEnt, onlyShowAir } = this.props;
    this.props.dispatch({
      type: 'common/getPollutantTypeList',
      payload: {
        filterPollutantType: this.props.filterPollutantType//自定义显示污染物类型 wjw
      },
      showAll: this.props.showAll,
      callback: (data) => {
        let pollutantTypelist = data;
        if (onlyShowEnt) {
          pollutantTypelist = data.filter(item => item.pollutantTypeCode != 5);
        }
        if (onlyShowAir) {
          pollutantTypelist = data.filter(item => item.pollutantTypeCode == 5);
        }
        let defaultPollutantCode = pollutantTypelist[0] && pollutantTypelist[0]['pollutantTypeCode'];
        this.props.initCallback && this.props.initCallback(defaultPollutantCode)
        this.setState({
          pollutantTypelist: pollutantTypelist,
          defaultPollutantCode: defaultPollutantCode
        })
      }
    });
  }


  render() {
    const { loading, showType, showAll } = this.props;
    const { pollutantTypelist, defaultPollutantCode, } = this.state;
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
                defaultValue={this.props.showDefaultValue ? defaultPollutantCode : undefined}
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
