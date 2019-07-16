/*
 * @desc: 根据code返回name
 * @Author: Jiaqi 
 * @Date: 2019-05-30 16:27:37 
 * @Last Modified by: Jiaqi
 * @Last Modified time: 2019-05-30 16:28:30
 * @params configId
 * @return String
 */
import React, { PureComponent } from 'react';
import { connect } from 'dva';

@connect(({ loading, autoForm }) => ({
  configIdList: autoForm.configIdList,
}))
class ReturnName extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { dispatch, configId } = this.props;
    dispatch({
      type: 'autoForm/getConfigIdList',
      payload: {
        configId: configId
      }
    })
  }

  _renderText() {
    const { configIdList, configId, itemKey, itemValue, itemName } = this.props;
    const dataList = configIdList[configId] || [];
    let filterList = dataList.filter(item => item[itemKey] == itemValue)
    return filterList.length ? filterList[0][itemName] : null
  }

  render() {
    return (
      <div>
        {this._renderText()}
      </div>
    );
  }
}

export default ReturnName;

