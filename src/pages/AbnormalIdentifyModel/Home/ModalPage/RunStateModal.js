import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'dva';
import { Card, Form, Button, Select, Input, Progress } from 'antd';
import SdlTable from '@/components/SdlTable';
import styles from '../../styles.less';
import RangePicker_ from '@/components/RangePicker/NewRangePicker';
import SearchSelect from '@/pages/AutoFormManager/SearchSelect';
import { handleHomeDate } from '@/pages/AbnormalIdentifyModel/CONST';
import EntAtmoList from '@/components/EntAtmoList';
import { RollbackOutlined } from '@ant-design/icons';
import DataQueryModal from './DataQueryModal';

const dvaPropsData = ({ loading, AbnormalIdentifyModelHome }) => ({
  // todoList: wordSupervision.todoList,
  requestParams: AbnormalIdentifyModelHome.requestParams,
  entRequestParams: AbnormalIdentifyModelHome.entRequestParams,
  OverRate: AbnormalIdentifyModelHome.OverRate,
  loading: !!loading.effects['AbnormalIdentifyModelHome/GetRunningStateDrillDownData'],
});

const RunStateModal = props => {
  const [form] = Form.useForm();
  const { dispatch, loading } = props;
  let requestParams = props.level == 3 ? props.entRequestParams : props.requestParams;
  const [dataSource, setDataSource] = useState([[], [], []]);
  const [level, setLevel] = useState(props.level);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [DGIMN, setDGIMN] = useState();
  const [dataStatus, setDataStatus] = useState();
  const [modalTitle, setModalTitle] = useState();
  const [pointName, setPointName] = useState();
  const [entName, setEntName] = useState();

  useEffect(() => {
    const { btime, etime } = handleHomeDate(requestParams.btime, requestParams.dateType);
    form.setFieldsValue({
      date: [btime, etime],
      ...requestParams,
      regionCode: requestParams.regionCode || undefined,
      industryCode: requestParams.industryCode || undefined,
      entCode: requestParams.entCode || undefined,
      entCode_temp: requestParams.entCode || undefined,
    });
    getPageData(level);
  }, []);

  // 获取页面数据
  const getPageData = dataType => {
    const values = form.getFieldsValue();
    dispatch({
      type: 'AbnormalIdentifyModelHome/GetRunningStateDrillDownData',
      payload: {
        regionCode: values.regionCode,
        entCode: values.entCode,
        btime: values.date[0].format('YYYY-MM-DD HH:mm:ss'),
        etime: values.date[1].format('YYYY-MM-DD HH:mm:ss'),
        pLeve: dataType,
        industryCode: values.industryCode,
        pollutantCode: requestParams.pollutantCode,
      },
      callback: res => {
        let dataSource_temp = [...dataSource];
        dataSource_temp[dataType] = res;
        setDataSource(dataSource_temp);
      },
    });
  };

  const getColumns = () => {
    let columns = [
      {
        title: '序号',
        dataIndex: 'index',
        key: 'index',
        width: 80,
        render: (text, record, index) => {
          return index + 1;
        },
      },
    ];
    switch (level) {
      case 1:
        columns.push(
          {
            title: '行政区',
            dataIndex: 'RegionName',
            key: 'RegionName',
            render: (text, record) => {
              return text !== '合计' ? (
                <a
                  onClick={e => {
                    form.setFieldsValue({ regionCode: record.RegionCode });
                    setLevel(2);
                    getPageData(2);
                  }}
                >
                  {text}
                </a>
              ) : (
                text
              );
            },
          },
          {
            title: '企业数',
            dataIndex: 'EntNum',
            key: 'EntNum',
            width: 160,
            sorter: (a, b) => a.EntNum - b.EntNum,
          },
          {
            title: '监测点数',
            dataIndex: 'PointNum',
            key: 'PointNum',
            width: 160,
            sorter: (a, b) => a.PointNum - b.PointNum,
          },
          {
            title: '正常',
            width: 160,
            children: [
              {
                title: '企业（家）',
                dataIndex: 'NormalEntNum',
                key: 'NormalEntNum',
                width: 160,
                align: 'center',
                sorter: (a, b) => a.NormalEntNum - b.NormalEntNum,
              },
              {
                title: '排口（个）',
                dataIndex: 'NormalPointNum',
                key: 'NormalPointNum',
                align: 'center',
                width: 160,
                sorter: (a, b) => a.NormalPointNum - b.NormalPointNum,
              },
            ],
          },
          {
            title: '异常',
            width: 160,
            children: [
              {
                title: '企业（家）',
                dataIndex: 'ExceptionEntNum',
                key: 'ExceptionEntNum',
                width: 160,
                align: 'center',
                sorter: (a, b) => a.ExceptionEntNum - b.ExceptionEntNum,
              },
              {
                title: '排口（个）',
                dataIndex: 'ExceptionPointNum',
                key: 'ExceptionPointNum',
                width: 160,
                align: 'center',
                sorter: (a, b) => a.ExceptionPointNum - b.ExceptionPointNum,
              },
            ],
          },
          {
            title: '超标',
            width: 160,
            children: [
              {
                title: '企业（家）',
                dataIndex: 'OverEntNum',
                key: 'OverEntNum',
                width: 160,
                align: 'center',
                sorter: (a, b) => a.OverEntNum - b.OverEntNum,
              },
              {
                title: '排口（个）',
                dataIndex: 'OverPointNum',
                key: 'OverPointNum',
                width: 160,
                align: 'center',
                sorter: (a, b) => a.OverPointNum - b.OverPointNum,
              },
            ],
          },
          {
            title: '停运',
            width: 160,
            children: [
              {
                title: '企业（家）',
                dataIndex: 'StopEntNum',
                key: 'StopEntNum',
                width: 160,
                align: 'center',
                sorter: (a, b) => a.StopEntNum - b.StopEntNum,
              },
              {
                title: '排口（个）',
                dataIndex: 'StopPointNum',
                key: 'StopPointNum',
                width: 160,
                align: 'center',
                sorter: (a, b) => a.StopPointNum - b.StopPointNum,
              },
            ],
          },
        );
        break;
      case 2:
        columns.push(
          {
            title: '行政区',
            dataIndex: 'RegionName',
            key: 'RegionName',
          },
          {
            title: '企业',
            dataIndex: 'EntName',
            key: 'EntName',
            width: 160,
            render: (text, record) => {
              return record.RegionName !== '合计' ? (
                <a
                  onClick={e => {
                    form.setFieldsValue({ entCode: record.EntCode });
                    setLevel(3);
                    getPageData(3);
                  }}
                >
                  {text}
                </a>
              ) : (
                text
              );
            },
          },
          {
            title: '监测点数',
            dataIndex: 'PointNum',
            key: 'PointNum',
            width: 160,
            sorter: (a, b) => a.PointNum - b.PointNum,
          },
          {
            title: '正常点位数',
            dataIndex: 'NormalPointNum',
            key: 'NormalPointNum',
            width: 160,
            sorter: (a, b) => a.NormalPointNum - b.NormalPointNum,
          },
          {
            title: '异常点位数',
            dataIndex: 'OverPointNum',
            key: 'OverPointNum',
            width: 160,
            sorter: (a, b) => a.OverPointNum - b.OverPointNum,
          },
          {
            title: '超标点位数',
            dataIndex: 'ExceptionPointNum',
            key: 'ExceptionPointNum',
            width: 160,
            sorter: (a, b) => a.ExceptionPointNum - b.ExceptionPointNum,
          },
          {
            title: '停运点位数',
            dataIndex: 'StopPointNum',
            key: 'StopPointNum',
            width: 160,
            sorter: (a, b) => a.StopPointNum - b.StopPointNum,
          },
        );
        break;
      case 3:
        columns.push(
          {
            title: '行政区',
            dataIndex: 'RegionName',
            key: 'RegionName',
          },
          {
            title: '企业',
            dataIndex: 'EntName',
            key: 'EntName',
            width: 160,
          },
          {
            title: '监测点',
            dataIndex: 'PointName',
            key: 'PointName',
            width: 160,
          },
          {
            title: '正常小时数',
            dataIndex: 'NormalHourSum',
            key: 'NormalHourSum',
            width: 160,
            sorter: (a, b) => a.NormalHourSum - b.NormalHourSum,
            render: (text, record) => {
              return level == 3 && record.RegionName !== '合计' ? (
                <a
                  onClick={e => {
                    onHourNumClick(record, '0', '正常数据');
                  }}
                >
                  {text}
                </a>
              ) : (
                text
              );
            },
          },
          {
            title: '异常小时数',
            dataIndex: 'ExceptionHourSum',
            key: 'ExceptionHourSum',
            width: 160,
            sorter: (a, b) => a.ExceptionHourSum - b.ExceptionHourSum,
            render: (text, record) => {
              return level == 3 && record.RegionName !== '合计' ? (
                <a
                  onClick={e => {
                    onHourNumClick(record, '2', '异常数据');
                  }}
                >
                  {text}
                </a>
              ) : (
                text
              );
            },
          },
          {
            title: '超标小时数',
            dataIndex: 'OverHourSum',
            key: 'OverHourSum',
            width: 160,
            sorter: (a, b) => a.OverHourSum - b.OverHourSum,
            render: (text, record) => {
              return level == 3 && record.RegionName !== '合计' ? (
                <a
                  onClick={e => {
                    onHourNumClick(record, '3', '超标数据');
                  }}
                >
                  {text}
                </a>
              ) : (
                text
              );
            },
          },
          {
            title: '停运小时数',
            dataIndex: 'StopHourSum',
            key: 'StopHourSum',
            width: 160,
            sorter: (a, b) => a.StopHourSum - b.StopHourSum,
            render: (text, record) => {
              return level == 3 && record.RegionName !== '合计' ? (
                <a
                  onClick={e => {
                    onHourNumClick(record, '1', '停运数据');
                  }}
                >
                  {text}
                </a>
              ) : (
                text
              );
            },
          },
        );
        break;
      default:
        break;
    }

    return columns;
  };

  // 返回
  const onBack = () => {
    if (level == 2) {
      form.setFieldsValue({ entCode: undefined, regionCode: undefined, entCode_temp: undefined });
    }
    let level_temp = level - 1;
    setLevel(level_temp);
  };

  // 小数数点击事件 - 打开历史数据
  const onHourNumClick = (record, quotaType, title) => {
    setDataStatus(quotaType);
    setDGIMN(record.DGIMN);
    setIsModalOpen(true);
    setModalTitle(`${record.EntName} - ${record.PointName}（${title}）`);
    setPointName(record.PointName);
    setEntName(record.EntName);
  };

  // 处理历史数据污染物（加上折算）
  const dataQueryPollutantCodes = [];
  requestParams.pollutantCode.split(',').map(item => {
    dataQueryPollutantCodes.push(item);
    dataQueryPollutantCodes.push('zs' + item);
  });

  return (
    <Card bordered={false} bodyStyle={{ padding: 0 }}>
      <Form
        name="searchForm"
        form={form}
        layout="inline"
        // initialValues={{
        //   ...requestParams,
        // }}
        autoComplete="off"
        onValuesChange={(changedFields, allFields) => {}}
      >
        <div style={{ display: level == 1 ? 'flex' : 'none' }}>
          <Form.Item label="日期" name="date">
            <RangePicker_ dataType="day" format="YYYY-MM-DD" style={{ width: 250 }} />
          </Form.Item>
          <Form.Item label="行业" name="industryCode">
            <SearchSelect
              placeholder="排口所属行业"
              style={{ width: 130 }}
              configId={'IndustryType'}
              itemName={'dbo.T_Cod_IndustryType.IndustryTypeName'}
              itemValue={'dbo.T_Cod_IndustryType.IndustryTypeCode'}
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" onClick={() => getPageData(1)} loading={loading}>
              查询
            </Button>
          </Form.Item>
        </div>
        <Form.Item label="行政区" name="regionCode" style={{ display: 'none' }}>
          <Input />
        </Form.Item>
        <Form.Item label="企业" name="entCode" style={{ display: 'none' }}>
          <Input />
        </Form.Item>
        <Form.Item
          label="企业"
          name="entCode_temp"
          style={{ display: level == 2 ? 'block' : 'none' }}
        >
          <EntAtmoList
            regionCode={form.getFieldValue('regionCode')}
            style={{ width: 200 }}
            onChange={value => {
              form.setFieldValue('entCode', value);
              getPageData(2);
            }}
          />
        </Form.Item>
        {level != 1 && props.level !== level && (
          <Form.Item>
            <Button onClick={() => onBack()}>
              <RollbackOutlined />
              返回
            </Button>
          </Form.Item>
        )}
      </Form>
      <SdlTable
        rowKey={(record, index) => index}
        defaultWidth={200}
        loading={loading}
        dataSource={dataSource[level]}
        columns={getColumns()}
        scroll={{ y: 'calc(100vh - 250px)' }}
      />
      {isModalOpen && (
        <DataQueryModal
          open={isModalOpen}
          DGIMN={DGIMN}
          dataStatus={dataStatus}
          date={form.getFieldValue('date')}
          title={modalTitle}
          pointName={pointName}
          entName={entName}
          pollutantCode={dataQueryPollutantCodes.toString()}
          onCancel={() => {
            setIsModalOpen(false);
          }}
        />
      )}
    </Card>
  );
};

export default connect(dvaPropsData)(RunStateModal);
