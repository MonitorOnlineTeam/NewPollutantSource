/*
 * @Author: outman0611
 * @Date: 2024-07-04 11:25:06
 * @LastEditors: outman0611
 * @LastEditTime: 2024-11-28 13:38:08
 */
import React from 'react';
import { Form, Select, Spin } from 'antd';
import { connect } from 'dva';

const namespace = 'ctCommon';

const dvaPropsData = ({ loading, ctCommon }) => ({
  largeRegionListLoading: loading.effects[`${namespace}/GetLargeRegionList`],
  largeRegionList: ctCommon.largeRegionList || [],
});

const dvaDispatch = (dispatch) => {
  return {
    GetLargeRegionList: (payload) => {
      dispatch({
        type: `${namespace}/GetLargeRegionList`,
        payload,
      });
    },
  };
};

const LargeRegionList = props => {
  const {
    name = 'serviceAreaCode',
    label = '服务大区',
    rules,
    largeRegionListLoading,
    formItemClassName,
    GetLargeRegionList,
    largeRegionList,
    ...rest
  } = props;

  React.useEffect(() => {
    if (!largeRegionList.length) {
      GetLargeRegionList({});
    }
  }, []);

  return (
    <Form.Item
      name={name}
      label={label}
      className={formItemClassName}
      rules={rules}
    >
      {largeRegionListLoading ? (
        <Spin size='small'>
          <Select placeholder='请选择' style={{minWidth:130, width:'100%'}}/>
        </Spin>
      ) : (
        <Select
          placeholder='请选择'
          allowClear
          showSearch
          optionFilterProp="children"
          style={{minWidth:130, width:'100%'}}
        >
          {largeRegionList.map(item => (
            <Select.Option key={item.ID} value={item.ID}>
              {item.LargeRegion}
            </Select.Option>
          ))}
        </Select>
      )}
    </Form.Item>
  );
};

export default connect(dvaPropsData, dvaDispatch)(LargeRegionList);
