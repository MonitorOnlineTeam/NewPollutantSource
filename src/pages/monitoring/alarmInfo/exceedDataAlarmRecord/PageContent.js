import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Form, Card, Select, Button, Space, Tooltip, Modal } from 'antd';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import RegionList from '@/components/RegionList';
import SelectPollutantType from '@/components/SelectPollutantType';
import RangePicker_ from '@/components/RangePicker/NewRangePicker';
import moment from 'moment';
import { ExportOutlined } from '@ant-design/icons';
import SdlTable from '@/components/SdlTable';
import Level2Or3Content from './Level2Or3Content';
import DetailsModal from './DetailsModal';

const Option = Select.Option;

const dvaPropsData = ({ loading, common }) => ({
  attentionList: common.attentionList,
  pollutantCodeList: common.pollutantCode,
  loading: loading.effects['exceedDataAlarmModel/GetAlarmVerifyRate'],
  exportLoading: loading.effects['exceedDataAlarmModel/ExportAlarmVerifyRateDetail'],
});

const Training = props => {
  const [form] = Form.useForm();

  const { dispatch, attentionList, pollutantCodeList, loading, exportLoading } = props;
  const [dataType, setDataType] = useState('HourData');
  const [dataSource, setDataSource] = useState([]);
  const [column, setColumn] = useState([]);
  const [currentRow, setCurrentRow] = useState({});
  const [regionOpen, setRegionOpen] = useState(false);
  const [detailsData, setDetailsData] = useState({});
  const [detailsOpen, setDetailsOpen] = useState(false);

  useEffect(() => {
    getAttentionDegreeList();
    getAllPollutantCode(2, true);
    GetOverToExamineOperation();
  }, []);

  // 获取页面数据
  const getPageData = (_pageIndex, _pageSize) => {
    let values = form.getFieldsValue();
    dispatch({
      type: 'exceedDataAlarmModel/GetAlarmVerifyRate',
      payload: {
        ...values,
        BeginTime: values.time[0].format('YYYY-MM-DD 00:00:00'),
        EndTime: values.time[1].format('YYYY-MM-DD 23:59:59'),
        PageIndex: _pageIndex || pageIndex,
        PageSize: _pageSize || pageSize,
        IsGroupEnt: configInfo.isGroupEnt,
        // operationpersonnel: '',
        // RegionCode: '',
        // attentionCode: ''
      },
      callback: res => {
        setColumn(res.Datas.column);
        setDataSource(res.Datas.data);
        setTotal(res.Total);
      },
    });
  };

  // 导出
  const onExport = () => {
    let values = form.getFieldsValue();
    dispatch({
      type: 'exceedDataAlarmModel/ExportAlarmVerifyRate',
      payload: {
        ...values,
        BeginTime: values.time[0].format('YYYY-MM-DD 00:00:00'),
        EndTime: values.time[1].format('YYYY-MM-DD 23:59:59'),
        IsGroupEnt: configInfo.isGroupEnt,
      },
      callback: res => {
        setColumn(res.Datas.column);
        setDataSource(res.Datas.data);
        setTotal(res.Total);
      },
    });
  };

  // 获取核实结果
  const GetOverToExamineOperation = () => {
    dispatch({
      type: 'exceedDataAlarmModel/GetOverToExamineOperation',
      payload: {},
    });
  };

  // 获取关注列表
  const getAttentionDegreeList = () => {
    dispatch({
      type: 'common/getAttentionDegreeList',
      payload: {},
    });
  };

  // 根据企业类型查询监测因子
  const getAllPollutantCode = (value, isLoadData) => {
    dispatch({
      type: 'common/getAllPollutantCode',
      payload: {
        pollutantTypes: value,
      },
      callback: res => {
        form.setFieldValue('PollutantCodeList', res.Datas.map(item => item.field));
        isLoadData && getPageData();
      },
    });
  };

  // 行政区点击
  const onClickRegion = row => {
    setCurrentRow(row);
    setRegionOpen(true);
  };

  const getColumns = () => {
    let pollutantColumnList = column.map(col => {
      return {
        title: col.PollutantName,
        align: 'center',
        children: [
          {
            title: '报警次数',
            width: 100,
            align: 'center',
            dataIndex: col.PollutantCode + '_alarmCount',
            key: col.PollutantCode + '_alarmCount',
            render: (text, record) => {
              return (
                <a
                  onClick={() => {
                    setDetailsOpen(true);
                    setDetailsData({
                      ...record,
                      PollutantCode: col.PollutantCode,
                      regionCode: '',
                      status: '',
                      level: 1,
                    });
                  }}
                >
                  {text}
                </a>
              );
            },
          },
          {
            title: '已核实报警次数',
            width: 120,
            align: 'center',
            dataIndex: col.PollutantCode + '_respondedCount',
            key: col.PollutantCode + '_respondedCount',
            render: (text, record) => {
              return (
                <a
                  // onClick={this.AlreadyAlarmNumHandle.bind(
                  //   this,
                  //   record.ProvinceName == '全部合计' ? this.state.regionCode : record.regionCode,
                  //   col.PollutantCode,
                  //   record.regionName,
                  // )}
                  onClick={() => {
                    setDetailsOpen(true);
                    setDetailsData({
                      ...record,
                      PollutantCode: col.PollutantCode,
                      regionCode: '',
                      status: '1',
                      level: 1,
                    });
                  }}
                >
                  {text}
                </a>
              );
            },
          },
          {
            title: '待核实报警次数',
            width: 120,
            align: 'center',
            dataIndex: col.PollutantCode + '_noRespondedCount',
            key: col.PollutantCode + '_noRespondedCount',
            render: (text, record) => {
              return (
                <a
                  // onClick={this.StayAlarmNumHandle.bind(
                  //   this,
                  //   record.ProvinceName == '全部合计' ? this.state.regionCode : record.regionCode,
                  //   col.PollutantCode,
                  //   record.regionName,
                  // )}
                  onClick={() => {
                    setDetailsOpen(true);
                    setDetailsData({
                      ...record,
                      PollutantCode: col.PollutantCode,
                      regionCode: '',
                      status: '0',
                      level: 1,
                    });
                  }}
                >
                  {text}
                </a>
              );
            },
          },
        ],
      };
    });

    return [
      {
        title: '序号',
        dataIndex: 'index',
        key: 'index',
        width: 60,
        ellipsis: true,
        fixed: 'left',
        render: (text, record, index) => {
          return (pageIndex - 1) * pageSize + index + 1;
        },
      },
      {
        title: '集团',
        dataIndex: 'regionName',
        key: 'regionName',
        fixed: 'left',
        render: (text, record) => {
          return <a onClick={() => onClickRegion(record)}> {text} </a>;
        },
      },
      {
        title: '超标报警企业数',
        dataIndex: 'entCount',
        key: 'entCount',
      },
      {
        title: '超标报警监测点数',
        dataIndex: 'pointCount',
        key: 'pointCount',
      },
      {
        title: '数据类型',
        dataIndex: 'dataType',
        key: 'dataType',
      },
      ...pollutantColumnList,
    ];
  };

  // 分页
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [total, setTotal] = useState(0);
  const onTableChange = (current, pageSize) => {
    setPageIndex(current);
    setPageSize(pageSize);
    getPageData(current, pageSize);
  };

  let detailsTitle = detailsOpen
    ? `${detailsData.ProvinceName}
  ${moment(form.getFieldValue('time')[0]).format('YYYY-MM-DD HH:mm:ss')}至
  ${moment(form.getFieldValue('time')[1]).format('YYYY-MM-DD HH:mm:ss')}
  ${detailsData.status === '1' ? '已核实报警' : detailsData.status === '0' ? '待核实报警' : '报警'}详情`
    : '';

  return (
    <Card
      title={
        <Form
          className="searchForm"
          layout={'inline'}
          form={form}
          initialValues={{
            PollutantType: 2,
            DataType: dataType,
            time: [moment().subtract(1, 'day'), moment()],
          }}
        >
          <Space size={16} wrap>
            {/* <Form.Item label="行政区" name="RegionCode">
              <RegionList
                noFilter
                style={{ width: 150 }}
                onChange={value => {
                  // 重置企业列表
                  setRegionCode(value);
                  form.setFieldsValue({ EntCode: undefined });
                }}
              />
            </Form.Item> */}
            <Form.Item label="关注程度" name="attentionCode">
              <Select allowClear placeholder="关注程度" style={{ width: 150 }}>
                {attentionList.map(item => {
                  return (
                    <Option key={item.AttentionCode} value={item.AttentionCode}>
                      {item.AttentionName}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
            <Form.Item name="PollutantType" label="排口类型">
              <SelectPollutantType
                style={{ width: 100 }}
                singleHidden
                placeholder="请选择排口类型"
                onChange={value => {
                  getAllPollutantCode(value);
                }}
              />
            </Form.Item>
            <Form.Item name="DataType" label="数据类型">
              <Select
                placeholder="数据类型"
                style={{ width: 150 }}
                onChange={value => {
                  setDataType(value);
                  value === 'HourData'
                    ? form.setFieldValue('time', [moment().subtract(1, 'day'), moment()])
                    : form.setFieldValue('time', [moment().subtract(1, 'month'), moment()]);
                }}
              >
                <Option key="0" value="HourData">
                  小时
                </Option>
                <Option key="1" value="DayData">
                  日均
                </Option>
              </Select>
            </Form.Item>
            <Form.Item name="time" label="时间">
              <RangePicker_
                format="YYYY-MM-DD"
                dateValue={dataType}
                allowClear={false}
                style={{ width: 300 }}
              />
            </Form.Item>
            <Form.Item name="PollutantCodeList" label="污染物">
              {/* <Checkbox.Group>
                  {pollutantCodeList.map(item => {
                    return <Checkbox value={item.field}>{item.name}</Checkbox>;
                  })}
                </Checkbox.Group> */}

              <Select
                placeholder="污染物选择"
                style={{ width: 400 }}
                mode="multiple"
                maxTagCount="responsive"
                maxTagPlaceholder={omittedValues => (
                  <Tooltip
                    overlayStyle={{
                      pointerEvents: 'none',
                    }}
                    title={omittedValues.map(({ label }) => label).join(', ')}
                  >
                    <span>...</span>
                  </Tooltip>
                )}
              >
                {pollutantCodeList.map(item => {
                  return (
                    <Option key={item.field} value={item.field}>
                      {item.name}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
            <Form.Item>
              <Space>
                <Button
                  type="primary"
                  loading={loading}
                  onClick={() => {
                    onTableChange(1, 20);
                  }}
                >
                  查询
                </Button>
                <Button>重置</Button>
                <Button icon={<ExportOutlined />} onClick={onExport} loading={exportLoading}>
                  导出
                </Button>
              </Space>
            </Form.Item>
          </Space>
        </Form>
      }
    >
      <SdlTable
        resizable
        rowKey="ModelWarningGuid"
        align="center"
        style={{ marginTop: 10 }}
        columns={getColumns()}
        dataSource={dataSource}
        loading={loading}
        pagination={{
          showSizeChanger: true,
          showQuickJumper: true,
          pageSize: pageSize,
          current: pageIndex,
          onChange: onTableChange,
          total: total,
        }}
      />

      <Modal
        title={`${currentRow.regionName} - 数据详情`}
        wrapClassName="spreadOverModal"
        open={regionOpen}
        destroyOnClose
        footer={false}
        onCancel={() => {
          setRegionOpen(false);
        }}
        // bodyStyle={{
        //   height: 'calc(100vh - 40px)',
        //   overflowY: 'auto',
        //   backgroundColor: '#f0f2f5',
        //   padding: 12,
        // }}
      >
        {regionOpen && (
          <Level2Or3Content
            params={{
              ...form.getFieldsValue(),
              RegionCode: currentRow.RegionCode,
            }}
          />
        )}
      </Modal>

      <Modal
        title={detailsTitle}
        wrapClassName="spreadOverModal"
        open={detailsOpen}
        destroyOnClose
        footer={false}
        onCancel={() => setDetailsOpen(false)}
      >
        {detailsOpen && <DetailsModal data={detailsData} params={{ ...form.getFieldsValue() }} />}
      </Modal>
    </Card>
  );
};

export default connect(dvaPropsData)(Training);
