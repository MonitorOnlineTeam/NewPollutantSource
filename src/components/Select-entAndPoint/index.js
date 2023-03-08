/*
 * @Author: JiaQi 
 * @Date: 2023-03-06 15:31:53 
 * @Last Modified by: JiaQi
 * @Last Modified time: 2023-03-07 11:18:06
 * @Description: 企业-排口级联选择组件
 */


import React, { Fragment, useEffect } from 'react';
import { connect } from 'dva';
import { Cascader } from 'antd'

const dvaPropsData = ({ loading, common, }) => ({
  entAndPointList: common.entAndPointList
})

const dvaDispatch = (dispatch) => {
  return {
    getEntAndPointList: (payload) => {
      dispatch({
        type: `common/getEntAndPointList`,
        payload: payload,
      })
    },
  }
}

const SelectEntAndPoint = (props) => {
  const { entAndPointList } = props;
  useEffect(() => {
    props.getEntAndPointList({ "Status": [], "RunState": "1", })
  }, []);

  return <Cascader
    options={entAndPointList}
    fieldNames={{ label: 'title', value: 'key', children: 'children' }}
    placeholder="请选择排口"
    allowClear={false}
    showSearch
    {...props}
  />
}

export default connect(dvaPropsData, dvaDispatch)(SelectEntAndPoint);