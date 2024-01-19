/*
 * @Author: JiaQi
 * @Date: 2023-06-01 09:07:41
 * @Last Modified by: JiaQi
 * @Last Modified time: 2024-01-18 11:07:47
 * @Description：模型管理
 */

import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Card, Tooltip, Switch, message } from 'antd';
import styles from '../styles.less';
import { SettingOutlined, MinusCircleTwoTone } from '@ant-design/icons';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import SdlTable from '@/components/SdlTable';
import { router } from 'umi';
import { modelStatusRelation } from '../CONST';
// import { ModalNameConversion } from '@/pages/DataAnalyticalWarningModel/CONST';

function findKeyByValue(obj, value) {
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (obj[key].includes(value)) {
        return key;
      }
    }
  }
  return null;
}

const dvaPropsData = ({ loading, AbnormalIdentifyModel }) => ({
  modelList: AbnormalIdentifyModel.modelList,
  unfoldModelList: AbnormalIdentifyModel.unfoldModelList,
  loading: loading.effects['AbnormalIdentifyModel/GetModelList'],
});

const General = props => {
  const { dispatch, loading, modelList, unfoldModelList } = props;

  useEffect(() => {
    loadData();
  }, []);

  // 获取数据模型列表
  const loadData = () => {
    dispatch({
      type: 'AbnormalIdentifyModel/GetModelList',
      payload: {},
    });
  };

  // 状态开启、关闭
  const changeStatus = (guid, checked) => {
    let modelGuid = [];

    // 打开
    if (checked) {
      modelGuid = guid;
      // 主
      if (modelStatusRelation[guid]) {
        modelGuid = [...modelStatusRelation[guid], guid];
      } else {
        // 从
        let key = findKeyByValue(modelStatusRelation, guid);
        if (key) {
          let parent = unfoldModelList.find(item => item.ModelGuid === key);
          if (!parent.Status) {
            // 父级是关闭状态
            message.error(`请开启${parent.ModelName}`);
            return;
          }
        }
      }
    } else {
      modelGuid = guid;
      // 关闭
      if (modelStatusRelation[guid]) {
        // 是否是零值
        let isZero = guid === 'DD47D527-E34F-4EAE-A9D6-908B62E6008B';
        // 是否恒值
        let isConstant = guid === '438229E2-D05A-4204-BE04-1361A51BD4E6';
        // 零值状态
        let zeroStatus = !!unfoldModelList.find(
          item => item.ModelGuid === 'DD47D527-E34F-4EAE-A9D6-908B62E6008B',
        ).Status;
        // 恒值状态
        let ConstantStatus = !!unfoldModelList.find(
          item => item.ModelGuid === '438229E2-D05A-4204-BE04-1361A51BD4E6',
        ).Status;

        if (isZero || isConstant) {
          if ((zeroStatus && !ConstantStatus) || (!zeroStatus && ConstantStatus)) {
            modelGuid = [...modelStatusRelation[guid], guid];
          }
        } else {
          modelGuid = [...modelStatusRelation[guid], guid];
        }
      }
    }

    console.log('modelGuid', modelGuid);
    // return;
    dispatch({
      type: 'AbnormalIdentifyModel/SetMoldStatus',
      payload: {
        modelGuid: modelGuid.toString(),
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
        width: 100,
        align: 'center',
        render: (text, record, index) => {
          return <span style={{ fontWeight: 'bold' }}>{index + 1}</span>;
        },
      },
      {
        title: '场景名称',
        dataIndex: 'ModelTypeName',
        key: 'ModelTypeName',
        ellipsis: true,
        width: 1300,
        align: 'left',
        render: (text, record) => {
          return (
            <Tooltip title={text}>
              <span className={'textOverflow'} style={{ fontWeight: 'bold' }}>
                {text}
              </span>
            </Tooltip>
          );
        },
      },
    ];
  };

  const getExpandedColumns = (flag, index) => {
    return [
      {
        title: '编号',
        dataIndex: 'index',
        key: 'index',
        width: 80,
        align: 'center',
        render: (text, record, idx) => {
          return flag ? `${index + 1}.${idx + 1}` : idx + 1;
        },
      },
      {
        title: '场景名称',
        dataIndex: 'ModelName',
        key: 'ModelName',
        ellipsis: true,
        width: 200,
        align: 'left',
        render: (text, record) => {
          // let _text = ModalNameConversion(text);
          return (
            <Tooltip title={text}>
              <span className={'textOverflow'}>{text}</span>
            </Tooltip>
          );
        },
      },
      {
        title: '场景描述',
        dataIndex: 'ModelDes',
        key: 'ModelDes',
        ellipsis: true,
        width: 200,
        align: 'left',
        render: (text, record) => {
          return (
            <Tooltip title={text}>
              <span className={'textOverflow'}>{text}</span>
            </Tooltip>
          );
        },
      },
      // {
      //   title: '适用场景',
      //   dataIndex: 'SuitScene',
      //   key: 'SuitScene',
      //   ellipsis: true,
      //   width: 180,
      //   render: (text, record) => {
      //     return (
      //       <Tooltip title={text}>
      //         <span className={styles.textOverflow}>{text}</span>
      //       </Tooltip>
      //     );
      //   },
      // },
      {
        title: '数据特征',
        dataIndex: 'DataAttr',
        key: 'DataAttr',
        ellipsis: true,
        width: 220,
        align: 'left',
        render: (text, record) => {
          return (
            <Tooltip title={text}>
              <span className={'textOverflow'}>{text}</span>
            </Tooltip>
          );
        },
      },
      {
        title: '准确度',
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
              <a
                style={{ fontSize: 16 }}
                onClick={() => {
                  router.push(
                    `/AbnormalIdentifyModel/modelBase/general/setting/${record.ModelGuid}`,
                  );
                }}
              >
                <SettingOutlined />
              </a>
            </Tooltip>
          );
        },
      },
    ];
  };

  const expandedRowRender = (record, index, indent, expanded) => {
    return (
      <SdlTable
        columns={getExpandedColumns(true, index)}
        dataSource={record.ModelList}
        pagination={false}
        scroll={{ y: true }}
        rowClassName={{}}
      />
    );
  };

  return (
    <BreadcrumbWrapper>
      <div className={styles.PageWrapper}>
        {modelList.map(item => {
          return (
            <Card
              // loading={loading}
              className={styles.ModelTableWrapper}
              bodyStyle={{ paddingBottom: 10 }}
              key={item.ModelBaseTypeCode}
            >
              <div className="innerCardTitle" style={{ marginBottom: 20 }}>
                {item.ModelBaseTypeName}
              </div>
              {item.ModelBaseList && item.ModelBaseList.length > 1 ? (
                // 三级
                <SdlTable
                  loading={loading}
                  columns={getColumns()}
                  dataSource={item.ModelBaseList}
                  pagination={false}
                  scroll={{ y: true }}
                  rowClassName={{}}
                  expandable={{
                    indentSize: 1000,
                    expandedRowRender,
                    childrenColumnName: 'childrenColumnName',
                    defaultExpandAllRows: true,
                    // defaultExpandedRowKeys: ['0'],
                  }}
                />
              ) : (
                // 两级
                <SdlTable
                  columns={getExpandedColumns(false)}
                  dataSource={item.ModelBaseList[0].ModelList}
                  pagination={false}
                  scroll={{ y: true }}
                />
              )}
            </Card>
          );
        })}
      </div>
    </BreadcrumbWrapper>
  );
};

export default connect(dvaPropsData)(General);
