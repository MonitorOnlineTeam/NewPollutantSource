import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Card, Form, Button, Select, Spin, Space } from 'antd';
import styles from '../styles.less';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import EntAtmoList from '@/components/EntAtmoList';
import SdlTable from '@/components/SdlTable';

const dvaPropsData = ({ loading, wordSupervision }) => ({
  // todoList: wordSupervision.todoList,
  queryLoading: loading.effects['dataModel/GetEvaluationList'],
});

const Index = props => {
  const [form] = Form.useForm();
  const { dispatch, queryLoading } = props;
  const [dataSource, setDataSource] = useState({
    modelAcc: '-',
  });
  const [pointList, setPointList] = useState([]);
  const [pointLoading, setPointLoading] = useState(false);
  const [versionList, setVersionList] = useState([]);

  useEffect(() => {
    GetEvaluationVersionList();
  }, []);

  // 获取模型精度版本列表
  const GetEvaluationVersionList = () => {
    dispatch({
      type: 'dataModel/GetEvaluationVersionList',
      payload: {},
      callback: res => {
        form.setFieldsValue({ Version: res[0] });
        setVersionList(res);
        GetEvaluationList();
      },
    });
  };

  // 获取模型精度数据
  const GetEvaluationList = () => {
    const values = form.getFieldsValue();
    dispatch({
      type: 'dataModel/GetEvaluationList',
      payload: { ...values },
      callback: res => {
        setDataSource(res);
      },
    });
  };

  // 获取列头
  const getColumns = () => {
    let columns = [
      {
        title: '序号',
        width: 60,
      },
      {
        title: '企业',
        dataIndex: 'EntName',
        key: 'EntName',
        width: 200,
      },
      {
        title: '点位名称',
        dataIndex: 'PointName',
        key: 'PointName',
        width: 200,
      },
      {
        title: '模型训练时间',
        dataIndex: 'ExerciseTime',
        key: 'ExerciseTime',
        width: 200,
      },
      {
        title: '版本号',
        dataIndex: 'Version',
        key: 'Version',

        // width: 100,
      },
      {
        title: '准确度(acc)',
        dataIndex: 'Acc',
        key: 'Acc',
        render: text => {
          return text + '%';
        },
      },
      {
        title: '精确度',
        dataIndex: 'Flscore',
        key: 'Flscore',
        render: text => {
          return text + '%';
        },
      },
      {
        title: 'AUC',
        dataIndex: 'Auc',
        key: 'Auc',
        render: text => {
          return text + '%';
        },
      },
    ];

    return columns;
  };

  // 根据企业获取排口
  const getPointListByEntCode = value => {
    if (!value) {
      //清空时 不走请求
      form.setFieldsValue({ DGIMN: undefined });
      setPointList([]);
      return;
    }
    setPointLoading(true);
    dispatch({
      type: 'dataModel/getPointByEntCode',
      payload: {
        EntCode: value,
      },
      callback: res => {
        setPointList(res);
        setPointLoading(false);
      },
    });
  };

  const Version = form.getFieldValue('Version');

  return (
    <BreadcrumbWrapper>
      <Card className={styles.warningWrapper}>
        <Form
          name="basic"
          form={form}
          layout="inline"
          // style={{ marginBottom: 6 }}
          initialValues={{}}
          autoComplete="off"
          onValuesChange={(changedFields, allFields) => {
            const fieldName = Object.keys(changedFields).join();
            const value = allFields[fieldName];
            if (fieldName === 'EntCodes') {
              getPointListByEntCode(value);
            }
          }}
        >
          <Form.Item label="企业" name="EntCodes">
            <EntAtmoList noFilter style={{ width: 200 }} />
          </Form.Item>
          <Spin spinning={pointLoading} size="small" style={{ top: -10 }}>
            <Form.Item label="点位名称" name="DGIMN">
              <Select
                placeholder="请选择"
                allowClear
                showSearch
                optionFilterProp="children"
                style={{ width: 200 }}
              >
                {pointList[0] &&
                  pointList.map(item => {
                    return (
                      <Option key={item.DGIMN} value={item.DGIMN}>
                        {item.PointName}
                      </Option>
                    );
                  })}
              </Select>
            </Form.Item>
          </Spin>
          <Form.Item label="版本号" name="Version">
            <Select allowClear style={{ width: 120 }} placeholder="请选择版本">
              {versionList.map(item => {
                return <Option value={item} key={item}>{`${item}`}</Option>;
              })}
            </Select>
          </Form.Item>
          <Form.Item>
            <Space>
              <Button
                type="primary"
                loading={queryLoading}
                onClick={() => {
                  GetEvaluationList();
                }}
              >
                查询
              </Button>
              {/* <Button onClick={() => onReset()}>重置</Button> */}
            </Space>
          </Form.Item>
        </Form>
        <SdlTable
          // rowKey="ModelWarningGuid"
          // align="center"
          columns={getColumns()}
          dataSource={dataSource.pointList}
          loading={queryLoading}
          pagination={false}
          footer={() => (
            <span
              style={{ fontWeight: 'bold', color: 'rgba(0, 0, 0, 0.85)', fontSize: 14 }}
            >{`版本${Version}模型准确度：${dataSource.modelAcc} %`}</span>
          )}
        />
      </Card>
    </BreadcrumbWrapper>
  );
};

export default connect(dvaPropsData)(Index);
