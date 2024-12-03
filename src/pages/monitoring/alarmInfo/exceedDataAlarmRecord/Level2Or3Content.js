import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Form, Card, Select, Button, Space, Modal, Row } from 'antd';
import { ExportOutlined } from '@ant-design/icons';
import SdlTable from '@/components/SdlTable';
import DetailsModal from './DetailsModal';
import moment from 'moment';

const Option = Select.Option;

const dvaPropsData = ({ loading, common }) => ({
  attentionList: common.attentionList,
  pollutantCodeList: common.pollutantCode,
  loading: loading.effects['exceedDataAlarmModel/GetAlarmVerifyRate'],
  exportLoading: loading.effects['exceedDataAlarmModel/ExportAlarmVerifyRate'],
  loading3: loading.effects['exceedDataAlarmModel/GetAlarmVerifyRateDetail'],
  exportLoading3: loading.effects['exceedDataAlarmModel/ExportAlarmVerifyRateDetail'],
});

const Level2Or3Content = props => {
  const [form] = Form.useForm();

  const {
    dispatch,
    params,
    pollutantCodeList,
    loading,
    exportLoading,
    loading3,
    exportLoading3,
  } = props;
  const [dataSource, setDataSource] = useState([]);
  const [column, setColumn] = useState([]);
  const [dataSource3, setDataSource3] = useState([]);
  const [column3, setColumn3] = useState([]);
  const [level3Open, setLevel3Open] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsData, setDetailsData] = useState({});
  const [currentRow, setCurrentRow] = useState({});

  useEffect(() => {
    // form.setFieldValue('PollutantCodeList', res.Datas.map(item => item.field));
    getPageData();
  }, []);

  // 获取页面数据
  const getPageData = (_pageIndex, _pageSize) => {
    let values = params;
    dispatch({
      type: 'exceedDataAlarmModel/GetAlarmVerifyRate',
      payload: {
        ...values,
        BeginTime: values.time[0].format('YYYY-MM-DD 00:00:00'),
        EndTime: values.time[1].format('YYYY-MM-DD 23:59:59'),
        IsGroupEnt: configInfo.isGroupEnt,
        regionLevel: 2,
        // operationpersonnel: '',
        // RegionCode: '',
        // attentionCode: ''
      },
      callback: res => {
        setColumn(res.Datas.column);
        setDataSource(res.Datas.data);
      },
    });
  };

  // 导出2级
  const onExport = () => {
    let values = params;
    dispatch({
      type: 'exceedDataAlarmModel/ExportAlarmVerifyRate',
      payload: {
        ...values,
        BeginTime: values.time[0].format('YYYY-MM-DD 00:00:00'),
        EndTime: values.time[1].format('YYYY-MM-DD 23:59:59'),
        IsGroupEnt: configInfo.isGroupEnt,
        regionLevel: 2,
      },
    });
  };

  // 获取三级数据
  const getLevel3Data = row => {
    let values = params;
    dispatch({
      type: 'exceedDataAlarmModel/GetAlarmVerifyRateDetail',
      payload: {
        ...values,
        BeginTime: values.time[0].format('YYYY-MM-DD 00:00:00'),
        EndTime: values.time[1].format('YYYY-MM-DD 23:59:59'),
        // RegionCode: row.regionCode,
        EntCode: row.CityCode,
        IsGroupEnt: configInfo.isGroupEnt,
        // operationpersonnel: '',
        // RegionCode: '',
        // attentionCode: ''
      },
      callback: res => {
        setDataSource3(res.Datas.data);
        setColumn3(res.Datas.column);
      },
    });
  };

  // 导出3级
  const onExport3 = () => {
    let values = params;
    dispatch({
      type: 'exceedDataAlarmModel/ExportAlarmVerifyRateDetail',
      payload: {
        ...values,
        BeginTime: values.time[0].format('YYYY-MM-DD 00:00:00'),
        EndTime: values.time[1].format('YYYY-MM-DD 23:59:59'),
        // RegionCode: row.regionCode,
        EntCode: currentRow.CityCode,
        IsGroupEnt: configInfo.isGroupEnt,
      },
    });
  };

  const onLevel2Click = row => {
    getLevel3Data(row);
    setCurrentRow(row);
    setLevel3Open(true);
  };

  const getColumns = type => {
    let columnList = column;
    if (type === 3) {
      // 2级
      columnList = column3;
    }

    let pollutantColumnList = columnList.map(col => {
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
                      status: '',
                      level: type,
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
                  onClick={() => {
                    setDetailsOpen(true);
                    setDetailsData({
                      ...record,
                      PollutantCode: col.PollutantCode,
                      status: '1',
                      level: type,
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
                  onClick={() => {
                    setDetailsOpen(true);
                    setDetailsData({
                      ...record,
                      PollutantCode: col.PollutantCode,
                      status: '0',
                      level: type,
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

    let columns = [
      {
        title: '序号',
        fixed: 'left',
      },
      {
        title: '集团',
        dataIndex: 'ProvinceName',
        key: 'ProvinceName',
        fixed: 'left',
        render: (text, record) => {
          return <a onClick={this.paneAdd.bind(this, text, record.regionCode)}> {text} </a>;
        },
        render: (text, record) => {
          // const name = record.ProvinceName == '全部合计' ? '全部合计' : text;
          return {
            props: { colSpan: text == '全部合计' ? 2 : 1 },
            children: text,
          };
        },
      },
      {
        title: '分厂',
        dataIndex: 'CityName',
        key: 'CityName',
        fixed: 'left',
        width: 240,
        render: (text, record, index) => {
          if (record.ProvinceName == '全部合计') {
            return {
              props: { colSpan: 0 },
              // children: <a onClick={() => onLevel2Click(record)}>{text}</a>,
            };
          }
          return <a onClick={() => onLevel2Click(record)}> {text} </a>;
        },
        // render: (text, record) => {
        //   return <a onClick={this.paneAdd.bind(this, text, record.regionCode)}> {text} </a>;
        // },
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

    let columns3 = [
      {
        title: '序号',
      },
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
        dataIndex: 'dataType',
        key: 'dataType',
      },
      ...pollutantColumnList,
    ];

    return type === 2 ? columns : columns3;
  };

  let detailsTitle = detailsOpen
    ? `${detailsData.entName}
${moment(params.time[0]).format('YYYY-MM-DD HH:mm:ss')}至
${moment(params.time[1]).format('YYYY-MM-DD HH:mm:ss')}
${detailsData.status === '1' ? '已核实报警' : detailsData.status === '0' ? '待核实报警' : '报警'}详情`
    : '';

  return (
    <>
      <Row>
        <Button icon={<ExportOutlined />} onClick={onExport} loading={exportLoading}>
          导出
        </Button>
      </Row>
      <SdlTable
        resizable
        align="center"
        style={{ marginTop: 10 }}
        columns={getColumns(2)}
        dataSource={dataSource}
        loading={loading}
      />
      <Modal
        title={`${currentRow.regionName} / ${currentRow.CityName} - 数据详情`}
        wrapClassName="spreadOverModal"
        open={level3Open}
        destroyOnClose
        footer={false}
        onCancel={() => {
          setLevel3Open(false);
        }}
        // bodyStyle={{
        //   height: 'calc(100vh - 40px)',
        //   overflowY: 'auto',
        //   backgroundColor: '#f0f2f5',
        //   padding: 12,
        // }}
      >
        <Row>
          <Button icon={<ExportOutlined />} onClick={onExport3} loading={exportLoading3}>
            导出
          </Button>
        </Row>
        <SdlTable
          resizable
          align="center"
          style={{ marginTop: 10 }}
          columns={getColumns(3)}
          dataSource={dataSource3}
          loading={loading3}
        />
      </Modal>
      <Modal
        title={detailsTitle}
        wrapClassName="spreadOverModal"
        open={detailsOpen}
        destroyOnClose
        footer={false}
        onCancel={() => setDetailsOpen(false)}
      >
        {detailsOpen && <DetailsModal data={detailsData} params={params} />}
      </Modal>
    </>
  );
};

export default connect(dvaPropsData)(Level2Or3Content);
