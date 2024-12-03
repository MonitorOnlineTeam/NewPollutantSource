import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Form, Card, Select, Button, Space, Modal, Row, Radio, Checkbox } from 'antd';
import { ExportOutlined } from '@ant-design/icons';
import SdlTable from '@/components/SdlTable';
import VerifyDetailsPop from '@/pages/dataSearch/exceedDataAlarmRecord/VerifyDetailsPop.js';
import EntAtmoList from '@/components/EntAtmoList';
import { uploadPrefix } from '@/config';

const Option = Select.Option;

const dvaPropsData = ({ loading, common, exceedDataAlarmModel }) => ({
  attentionList: common.attentionList,
  pollutantCodeList: common.pollutantCode,
  AlarmDealTypeList: exceedDataAlarmModel.AlarmDealTypeList,
  loading: loading.effects['exceedDataAlarmModel/GetAlarmVerifyDetail'],
  exportLoading: loading.effects['exceedDataAlarmModel/ExportAlarmVerifyDetail'],
});

const Level2Or3Content = props => {
  const [form] = Form.useForm();

  const { dispatch, params, loading, exportLoading, onCancel, data, AlarmDealTypeList } = props;
  console.log('props', props);
  const [dataSource, setDataSource] = useState([]);
  const [level3Open, setLevel3Open] = useState(false);
  const [currentRow, setCurrentRow] = useState({});
  const [status, setStatus] = useState(data.status);

  useEffect(() => {
    // form.setFieldValue('PollutantCodeList', res.Datas.map(item => item.field));
    if (open) {
      getPageData();
    }
  }, []);

  // 获取详情数据
  const getPageData = row => {
    let values = form.getFieldsValue();
    console.log('values', values);
    console.log('params', params);
    console.log('data', data);
    dispatch({
      type: 'exceedDataAlarmModel/GetAlarmVerifyDetail',
      payload: {
        ...params,
        ...values,
        EntCode: data.level === 2 ? data.CityCode : data.level === 3 ? data.entCode : values.EntCode,
        Status: values.Status || '',
        BeginTime: params.time[0].format('YYYY-MM-DD 00:00:00'),
        EndTime: params.time[1].format('YYYY-MM-DD 23:59:59'),
        time: undefined,
        PollutantCode: data.PollutantCode,
        OperationPersonnel: '',
        attentionCode: '',
        operationpersonnel: '',
        DGIMN: data.DGIMN,
        RegionCode: data.level == 1 ? data.regionCode : undefined,
        VerifyStatus: values.VerifyStatus || AlarmDealTypeList.map(item => item.code),
      },
      callback: res => {
        setDataSource(res.Datas);
      },
    });
  };

  // 导出
  const onExport = () => {
    let values = form.getFieldsValue();
    dispatch({
      type: 'exceedDataAlarmModel/ExportAlarmVerifyDetail',
      payload: {
        ...params,
        ...values,
        EntCode: data.level === 2 ? data.CityCode : data.level === 3 ? data.entCode : values.EntCode,
        Status: values.Status || '',
        BeginTime: params.time[0].format('YYYY-MM-DD 00:00:00'),
        EndTime: params.time[1].format('YYYY-MM-DD 23:59:59'),
        time: undefined,
        PollutantCode: data.PollutantCode,
        OperationPersonnel: '',
        attentionCode: '',
        operationpersonnel: '',
        DGIMN: data.DGIMN,
        RegionCode: data.level == 1 ? data.regionCode : undefined,
        VerifyStatus: values.VerifyStatus || AlarmDealTypeList.map(item => item.code),
      },
    });
  };

  const getColumns = type => {
    let columns = [
      {
        title: '序号',
        fixed: 'left',
      },
      // {
      //   title: '集团',
      //   dataIndex: 'ProvinceName',
      //   key: 'ProvinceName',
      //   fixed: 'left',
      // },
      {
        title: '分厂',
        dataIndex: 'entName',
        key: 'entName',
        fixed: 'left',
        width: 240,
      },
      {
        title: '监测点名称',
        dataIndex: 'pointName',
        key: 'pointName',
        fixed: 'left',
      },
      {
        title: '数据类型',
        width: 100,
        dataIndex: 'dataType',
        key: 'dataType',
      },
      {
        title: '报警因子',
        width: 100,
        dataIndex: 'pollutantName',
        key: 'pollutantName',
      },
      {
        title: '报警生成时间',
        width: 200,
        dataIndex: 'createTime',
        key: 'createTime',
      },
      {
        title: '报警信息',
        width: 300,
        dataIndex: 'message',
        key: 'message',
      },
      {
        title: '核实人',
        width: 100,
        dataIndex: 'dealPerson',
        key: 'dealPerson',
        render: text => {
          return text == '' ? '-' : text;
        },
      },
      {
        title: '核实结果',
        width: 100,
        dataIndex: 'verifymessage',
        key: 'verifymessage',
        render: text => {
          return text == '' ? '-' : text;
        },
      },
      {
        title: '核实时间',
        width: 200,
        dataIndex: 'verifyTime',
        key: 'verifyTime',
        render: text => {
          return text == '' ? '-' : text;
        },
      },
      {
        title: '核实状态',
        width: 100,
        dataIndex: 'status',
        key: 'status',
        render: text => {
          return text == '' ? '-' : text == '0' ? '待核实' : '已核实';
        },
      },
      {
        title: '核实详情',
        width: 100,
        dataIndex: 'remark',
        key: 'remark',
        render: (text, record) => {
          let sourc = [];
          if (!record.verifyImage && !record.remark) {
            sourc = [];
          } else {
            let obj = {};
            record.verifyImage &&
              record.verifyImage.map(item => {
                obj = {
                  name: item.FileName,
                  attach: `${uploadPrefix}/` + item.FileName,
                };
                sourc.push(obj);
              });
          }
          return <VerifyDetailsPop dataSource={sourc} remark={text} />;
        },
      },
    ];

    return columns;
  };

  return (
    <>
      <Form
        className="searchForm"
        layout={'inline'}
        form={form}
        initialValues={{
          VerifyStatus: AlarmDealTypeList.map(item => item.code),
          Status: status,
        }}
      >
        <div style={{ display: data.level === 1 ? 'block' : 'none' }}>
          <Space wrap style={{ width: '100%' }}>
            <Form.Item label="分厂" name="EntCode">
              <EntAtmoList style={{ width: 200 }} placeholder="请选择" />
            </Form.Item>
            <Form.Item
              name="Status"
              style={{
                display: data.status == '' ? 'block' : 'none',
                marginTop: 10,
              }}
            >
              <Radio.Group
                onChange={e => {
                  setStatus(e.target.value);
                }}
              >
                <Radio.Button key={''} value="">
                  全部
                </Radio.Button>
                <Radio.Button key={1} value="1">
                  已核实
                </Radio.Button>
                <Radio.Button key={0} value="0">
                  待核实
                </Radio.Button>
              </Radio.Group>
            </Form.Item>
            <Form.Item>
              <Space>
                <Button type="primary" onClick={() => getPageData()} loading={loading}>
                  查询
                </Button>
                <Button
                  icon={<ExportOutlined />}
                  //  onClick={this.template} loading={exloading}
                >
                  导出
                </Button>
              </Space>
            </Form.Item>
          </Space>
          <Row
            style={{
              display: status == '1' ? 'block' : 'none',
              marginTop: 10,
            }}
          >
            <Form.Item name="VerifyStatus" label="核实结果">
              <Checkbox.Group>
                {AlarmDealTypeList.map(item => {
                  return (
                    <Checkbox value={item.code} key={item.code}>
                      {item.name}
                    </Checkbox>
                  );
                })}
              </Checkbox.Group>
            </Form.Item>
          </Row>
        </div>
        <div style={{ display: data.level !== 1 ? 'block' : 'none' }}>
          <Button icon={<ExportOutlined />} onClick={onExport} loading={exportLoading}>
            导出
          </Button>
        </div>
      </Form>
      <SdlTable
        resizable
        rowKey="ModelWarningGuid"
        align="center"
        style={{ marginTop: 10 }}
        columns={getColumns(3)}
        dataSource={dataSource}
        loading={loading}
        pagination={false}
      />
    </>
  );
};

export default connect(dvaPropsData)(Level2Or3Content);
