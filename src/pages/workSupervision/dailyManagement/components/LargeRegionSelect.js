import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Form, Select, Typography } from 'antd';

const dvaPropsData = ({ loading, provinceAllList, common }) => ({});

const LargeRegionSelect = props => {
  const [largeRegionList, setLargeRegionList] = useState([]);
  const [provinceAllList, setProvinceAllList] = useState([]);

  const { dispatch, type, required, label, style, name } = props;

  useEffect(() => {
    type === 'ct' ? getCtLargeRegion() : getLargeRegion();
  }, []);

  // 获取成套大区及省份
  const getCtLargeRegion = () => {
    dispatch({
      type: 'common/getCTLargeRegion',
      payload: {},
      callback: res => {
        setLargeRegionList(res.CtLargeRegionList);
      },
    });
  };

  // 获取运维大区及省份
  const getLargeRegion = () => {
    dispatch({
      type: 'common/getLargeRegion',
      payload: {},
      callback: res => {
        setProvinceAllList(res.provinceList);
      },
    });
  };

  if (type === 'ct') {
    return (
      <Form.Item
        name={name}
        label={label ? label : '大区'}
        rules={[
          {
            required: required,
            message: '请选择，不能为空！',
          },
        ]}
      >
        <Select placeholder="请选择" style={{ width: 140, ...style }} allowClear>
          {largeRegionList.map(item => {
            return (
              <Option value={item.ID} key={item.ID}>
                {item.LargeRegion}
              </Option>
            );
          })}
        </Select>
      </Form.Item>
    );
  } else {
    return (
      <Form.Item
        name={name}
        label={label ? label : '省份'}
        rules={[
          {
            required: required,
            message: `请选择，不能为空！`,
          },
        ]}
      >
        <Select placeholder="请选择" style={{ width: 140, ...style }} allowClear>
          {provinceAllList.map(item => {
            return (
              <Option value={item.RegionCode} key={item.RegionCode}>
                {item.RegionName}
              </Option>
            );
          })}
        </Select>
      </Form.Item>
    );
  }
};

LargeRegionSelect.defaultProps = {
  name: 'regionCode',
  style: {},
  required: false,
};

export default connect(dvaPropsData)(LargeRegionSelect);
