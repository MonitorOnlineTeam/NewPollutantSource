/*
 * @Author: outman0611 jia_anbo@163.com
 * @Date: 2024-06-07 10:56:38
 * @LastEditors: outman0611 jia_anbo@163.com
 * @LastEditTime: 2024-08-23 09:40:07
 * @FilePath: \merged_master\src\components\SelectPollutantType\index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React, { PureComponent, Fragment } from 'react';
import { Radio, Select, Spin } from 'antd';
import { connect } from 'dva';

const { Option } = Select;

@connect(({ common, loading,gl }) => {
  return {
    loading: loading.effects['common/getPollutantTypeList'],
    pollutantTypelist: common.pollutantTypelist,
    defaultPollutantCode: common.defaultPollutantCode,
    configInfo: global.configInfo,
  };
})
class SelectPollutantType extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      pollutantTypelist: [],
      defaultPollutantCode: undefined,
    };
  }
  componentDidMount() {
    this.getData();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.filterPollutantType !== prevProps.filterPollutantType) {
      this.getData();
    }
  }

  getData = () => {
    this.props.dispatch({
      type: 'common/getPollutantTypeList',
      payload: {
        filterPollutantType:
          this.props.filterPollutantType === 'undefined'
            ? undefined
            : this.props.filterPollutantType, //自定义显示污染物类型 wjw
        filterInvalidData: this.props.filterInvalidData, //自定义显示污染物类型 wjw
      },
      showAll: this.props.showAll,
      callback: data => {
        let defaultPollutantCode = data[0] && data[0]['pollutantTypeCode'];
        this.props.initCallback && this.props.initCallback(defaultPollutantCode);
        this.setState({
          pollutantTypelist: data,
          defaultPollutantCode: defaultPollutantCode,
        });
      },
    });
  };

  render() {
    const { loading, showType, showAll, configInfo: { IsOpera }, } = this.props;
    const { pollutantTypelist, defaultPollutantCode } = this.state;
    const noShow = IsOpera && pollutantTypelist?.length <=1 //运维项目 单个污染物不用显示
    return (<div  style={{display: noShow && 'none'}}>
        {showType === 'radio' ? <Spin size='small' spinning={loading} style={{height:32}}> 
          <Radio.Group defaultValue={defaultPollutantCode} {...this.props}>
            {pollutantTypelist.map(item => {
              return (
                <Radio.Button key={item.pollutantTypeCode} value={item.pollutantTypeCode}>
                  {item.pollutantTypeName}
                </Radio.Button>
              );
            })}
          </Radio.Group>
         </Spin> : (
          <Select
            placeholder="请选择污染物类型"
            defaultValue={this.props.showDefaultValue ? defaultPollutantCode : undefined}
            {...this.props}
             value={noShow? defaultPollutantCode : this.props.value}
          >
            {pollutantTypelist.map(item => {
              return (
                <Option key={item.pollutantTypeCode} value={item.pollutantTypeCode}>
                  {item.pollutantTypeName}
                </Option>
              );
            })}
          </Select>
        )}
       </div>
    );
  }
}

export default SelectPollutantType;
