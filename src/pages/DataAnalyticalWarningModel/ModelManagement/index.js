/*
 * @Author: JiaQi
 * @Date: 2023-06-01 09:07:41
 * @Last Modified by: JiaQi
 * @Last Modified time: 2023-06-07 11:23:09
 * @Description：模型管理
 */

import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Card, Tooltip, Switch } from 'antd';
import styles from '../styles.less';
import { SettingOutlined } from '@ant-design/icons';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import SdlTable from '@/components/SdlTable';

const dvaPropsData = ({ loading, dataModel }) => ({
  modelList: dataModel.modelList,
  loading: loading.effects['dataModel/GetModelList'],
});

const ModelManagement = props => {
  const { dispatch, loading, modelList } = props;

  useEffect(() => {
    loadData();
  }, []);

  // 获取数据模型列表
  const loadData = () => {
    dispatch({
      type: 'dataModel/GetModelList',
      payload: {},
    });
  };

  // 状态开启、关闭
  const changeStatus = (modelGuid, checked) => {
    dispatch({
      type: 'dataModel/SetMoldStatus',
      payload: {
        modelGuid: modelGuid,
        status: checked ? 1 : 0,
      },
      callback: () => {
        loadData();
      },
    });
  };

  const getColumns = () => {
    return [
      {
        title: '编号',
        dataIndex: 'index',
        key: 'index',
        width: 80,
        align: 'center',
        render: (text, record, index) => {
          return index + 1;
        },
      },
      {
        title: '模型名称',
        dataIndex: 'ModelName',
        key: 'ModelName',
        ellipsis: true,
        width: 200,
        render: (text, record) => {
          return (
            <Tooltip title={text}>
              <span className={styles.textOverflow}>{text}</span>
            </Tooltip>
          );
        },
      },
      {
        title: '模型描述',
        dataIndex: 'ModelDes',
        key: 'ModelDes',
        ellipsis: true,
        width: 200,
        render: (text, record) => {
          return (
            <Tooltip title={text}>
              <span className={styles.textOverflow}>{text}</span>
            </Tooltip>
          );
        },
      },
      {
        title: '适用场景',
        dataIndex: 'SuitScene',
        key: 'SuitScene',
        ellipsis: true,
        width: 180,
        render: (text, record) => {
          return (
            <Tooltip title={text}>
              <span className={styles.textOverflow}>{text}</span>
            </Tooltip>
          );
        },
      },
      {
        title: '数据特征',
        dataIndex: 'DataAttr',
        key: 'DataAttr',
        ellipsis: true,
        width: 220,
        render: (text, record) => {
          return (
            <Tooltip title={text}>
              <span className={styles.textOverflow}>{text}</span>
            </Tooltip>
          );
        },
      },
      {
        title: '模型准确度',
        dataIndex: 'Accuracy',
        key: 'Accuracy',
        ellipsis: true,
        width: 160,
        align: 'center',
      },
      {
        title: '启用状态',
        dataIndex: 'Status',
        key: 'Status',
        width: 160,
        align: 'center',
        render: (text, record) => {
          return (
            <Switch
              checkedChildren="启用"
              unCheckedChildren="停用"
              checked={!!text}
              onChange={checked => {
                changeStatus(record.ModelGuid, checked);
              }}
            />
          );
        },
      },
      {
        title: '操作',
        key: 'handle',
        align: 'center',
        width: 120,
        render: (text, record) => {
          return (
            <Tooltip title={'设置'}>
              <a style={{ fontSize: 16 }}>
                <SettingOutlined />
              </a>
            </Tooltip>
          );
        },
      },
    ];
  };

  return (
    <BreadcrumbWrapper>
      <Card>
        <SdlTable
          loading={loading}
          columns={getColumns()}
          dataSource={modelList}
          pagination={false}
        />
      </Card>
    </BreadcrumbWrapper>
  );
};

export default connect(dvaPropsData)(ModelManagement);
