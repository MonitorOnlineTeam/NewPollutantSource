/**
 * 功  能：异常买模型识别 模型库管理  数据清洗
 * 创建人：jab
 * 创建时间：2024.06
 */
import React, { useState, useEffect, Fragment } from 'react';
import {
  Table,
  Input,
  InputNumber,
  Popconfirm,
  Spin,
  Form,
  Typography,
  Badge,
  Card,
  Button,
  Select,
  message,
  Row,
  Col,
  Tooltip,
  Divider,
  Modal,
  DatePicker,
  Space,
  Radio,
} from 'antd';
import SdlTable from '@/components/SdlTable';
import { connect } from 'dva';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import styles from '../../styles.less';
import Cookie from 'js-cookie';
import { throttle, debounce } from 'lodash'; // 使用 lodash 的节流函数、防抖函数
import ReactEcharts from 'echarts-for-react';
import AssistDataAnalysis from '@/pages/AbnormalIdentifyModel/AssistDataAnalysis';

const { Option } = Select;

const namespace = 'ModelBaseManage';

const dvaPropsData = ({ loading, ModelBaseManage, global }) => ({
  configInfo: global.configInfo,
  pointRelevantCountLoading: loading.effects[`${namespace}/GetPointRelevantCount`],
  JsHourDataInfoLoading: loading.effects[`${namespace}/JsHourDataInfo`],
});

const Index = props => {
  const [form] = Form.useForm();

  const [tableDatas, setTableDatas] = useState([]);
  const [tableLoading, setTableLoading] = useState(true);
  const [tableDatas2, setTableDatas2] = useState([]);
  const [tableLoading2, setTableLoading2] = useState(true);
  const [tableDatas3, setTableDatas3] = useState([]);
  const [tableLoading3, setTableLoading3] = useState(true);
  const [tableDatas4, setTableDatas4] = useState([]);
  const [tableLoading4, setTableLoading4] = useState(true);
  const [tableDatas5, setTableDatas5] = useState([]);
  const [tableLoading5, setTableLoading5] = useState(true);
  const [tableDatas6, setTableDatas6] = useState([]);
  const [tableLoading6, setTableLoading6] = useState(true);
  const [pointRelevantCountData, setPointRelevantCount] = useState({});
  const [dataType, setDataType] = useState('data');

  const sumData = (array, key) => {
    return array?.[0]
      ? array.reduce((accumulator, currentValue) => {
          return accumulator + currentValue[key];
        }, 0)
      : 0;
  };
  const obj1 = {
    企业信息清洗: {
      time: tableDatas?.[0]?.cleanTime,
      numData: [
        {
          label: '清洗企业数量',
          value:
            sumData(tableDatas?.filter(item => item.paramName == '企业名称'), 'successCount') +
              sumData(tableDatas?.filter(item => item.paramName == '企业名称'), 'falseCount') || 0,
        },
        {
          label: '入库数量',
          value:
            sumData(tableDatas?.filter(item => item.paramName == '企业名称'), 'successCount') || 0,
        },
      ],
      data: tableDatas,
      loading: tableLoading,
      taskType: 1,
      logTitle: '企业日志',
      logUrl: 'GetProjectLogsInfoList',
    },
    备案参数: {
      time: tableDatas3?.[0]?.cleanTime,
      numData: [
        {
          label: '清洗备案参数数量',
          value: sumData(tableDatas3, 'successCount') + sumData(tableDatas3, 'falseCount') || 0,
        },
        { label: '入库备案参数', value: sumData(tableDatas3, 'successCount') || 0 },
        { label: '清洗失败', value: sumData(tableDatas3, 'falseCount') },
      ],
      data: tableDatas3,
      loading: tableLoading3,
      taskType: 3,
      logTitle: '备案参数日志',
      logUrl: 'GetProjectLogsInfoList',
    },
    监测数据: {
      // time: tableDatas6?.cleanTime,
      //  numData: [{ label: '清洗数据', value: tableDatas6?.successCount || 0 }, { label: '非法', value: tableDatas6?.falseCount || 0 }],
      data: tableDatas6,
      loading: tableLoading6,
      taskType: 6,
    },
  };
  const obj2 = {
    排放口信息清洗: {
      time: tableDatas2?.[0]?.cleanTime,
      numData: [
        {
          label: '清洗排放口数量',
          value:
            sumData(tableDatas2?.filter(item => item.paramName == '站点名称'), 'successCount') +
              sumData(tableDatas2?.filter(item => item.paramName == '站点名称'), 'falseCount') || 0,
        },
        {
          label: '入库排放口数量',
          value:
            sumData(tableDatas2?.filter(item => item.paramName == '站点名称'), 'successCount') || 0,
        },
      ],
      data: tableDatas2,
      loading: tableLoading2,
      taskType: 2,
      logTitle: '排放口',
      logUrl: 'GetProjectLogsInfoList',
    },
    污染物: {
      time: tableDatas4?.[0]?.cleanTime,
      numData: [
        {
          label: '清洗排放口数量',
          value: sumData(tableDatas4, 'successCount') + sumData(tableDatas4, 'falseCount') || 0,
        },
        { label: '入库污染物数量', value: sumData(tableDatas4, 'successCount') || 0 },
        { label: '清洗失败', value: sumData(tableDatas4, 'falseCount') },
      ],
      data: tableDatas4,
      loading: tableLoading4,
      taskType: 4,
      logTitle: '污染物缺失',
      logUrl: 'GetMonitorPollutantLogsInfoList',
    },
    排放标准: {
      time: tableDatas5?.[0]?.cleanTime,
      numData: [
        {
          label: '清洗排放标准数量',
          value: sumData(tableDatas5, 'successCount') + sumData(tableDatas5, 'falseCount') || 0,
        },
        { label: '入库排放标准', value: sumData(tableDatas5, 'successCount') || 0 },
        { label: '清洗失败', value: sumData(tableDatas5, 'falseCount') || 0 },
      ],
      data: tableDatas5,
      loading: tableLoading5,
      logTitle: '排放标准缺失',
      taskType: 5,
      logUrl: 'GetMonitorAlarmLogsInfoList',
    },
  };
  const missDefaultValue = 80;
  useEffect(() => {
    handleChange(1);
    getHourDataLogsListRequest(missDefaultValue);
  }, []);

  // 获取监测数据
  const GetHourDataLogsList = missDefaultValue => {
    props.dispatch({
      type: `${namespace}/GetHourDataLogsList`,
      payload: { projectType: missDefaultValue, taskType: 6 },
      callback: result => {
        setTableLoading6(false);
        if (result.IsSuccess) {
          setTableDatas6(result.Datas);
        }
      },
    });
  };

  const handleChange = values => {
    //查询
    props.dispatch({
      type: `${namespace}/GetProjectLogsList`,
      payload: { projectType: values, taskType: 1 },
      callback: result => {
        setTableLoading(false);
        if (result.IsSuccess) {
          setTableDatas(result.Datas);
        }
      },
    });

    props.dispatch({
      type: `${namespace}/GetProjectLogsList`,
      payload: { projectType: values, taskType: 2 },
      callback: result => {
        setTableLoading2(false);
        if (result.IsSuccess) {
          setTableDatas2(result.Datas);
        }
      },
    });

    props.dispatch({
      type: `${namespace}/GetProjectLogsList`,
      payload: { projectType: values, taskType: 3 },
      callback: result => {
        setTableLoading3(false);
        if (result.IsSuccess) {
          setTableDatas3(result.Datas);
        }
      },
    });

    props.dispatch({
      type: `${namespace}/GetMonitorPollutantLogsList`,
      payload: { projectType: values, taskType: 4 },
      callback: result => {
        setTableLoading4(false);
        if (result.IsSuccess) {
          setTableDatas4(result.Datas ? [result.Datas] : []);
        }
      },
    });

    props.dispatch({
      type: `${namespace}/GetMonitorAlarmLogsList`,
      payload: { projectType: values, taskType: 5 },
      callback: result => {
        setTableLoading5(false);
        if (result.IsSuccess) {
          setTableDatas5(result.Datas ? [result.Datas] : []);
        }
      },
    });

    GetHourDataLogsList(values);
    props.dispatch({
      type: `${namespace}/GetPointRelevantCount`,
      payload: { projectType: values, taskType: 2 },
      callback: result => {
        setTableLoading6(false);
        setPointRelevantCount(result);
      },
    });
  };

  const getPrefixBeforeNumber = inputString => {
    // 使用正则表达式匹配数字前面的内容
    const match = inputString.match(/^(.*?)(?=\d)/);
    if (match) {
      return match[1]; // 返回匹配到的内容
    } else {
      return ''; // 如果没有匹配到，返回空字符串
    }
  };

  // 统计监测数据
  const getJsHourDataInfo = () => {
    props.dispatch({
      type: `${namespace}/JsHourDataInfo`,
      payload: {},
      callback: result => {
        message.success('统计完成！');
        GetHourDataLogsList(1);
      },
    });
  };

  let columns = title => [
    {
      title: '参数类型',
      dataIndex: 'paramName',
      key: 'paramName',
      align: 'center',
      width: 140,
      ellipsis: true,
      render: (text, record) => {
        return (
          <span style={{ cursor: 'pointer' }} onClick={() => logQuery(title, { param: text })}>
            {text}
          </span>
        );
      },
    },
    {
      title: '清洗成功',
      dataIndex: 'successCount',
      key: 'successCount',
      align: 'center',
      width: 120,
      ellipsis: true,
      render: (text, record) => {
        return text && text > 0 ? (
          <span
            style={{ cursor: 'pointer' }}
            onClick={() => logQuery(title, { param: record.paramName, status: true })}
          >
            {text}
          </span>
        ) : (
          text
        );
      },
    },
    {
      title: '清洗异常',
      dataIndex: 'falseCount',
      key: 'falseCount',
      align: 'center',
      width: 120,
      ellipsis: true,
      render: (text, record) => {
        return text > 0 ? (
          <span
            style={{ cursor: 'pointer' }}
            className="red"
            onClick={() => logQuery(title, { param: record.paramName, status: false })}
          >
            {text}
          </span>
        ) : (
          text
        );
      },
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
      align: 'center',
      width: 200,
      render: (text, record) => {
        const textArr = text?.split('，');
        return textArr ? (
          <>
            {textArr[0] && (
              <Button
                style={{ margin: '3px 0' }}
                onClick={() =>
                  logQuery(title, {
                    param: record.paramName,
                    remark: getPrefixBeforeNumber(textArr[0]),
                  })
                }
                size="small"
                type="primary"
              >
                {textArr[0]}
              </Button>
            )}
            {textArr[1] && (
              <Button
                style={{ margin: '3px 0' }}
                onClick={() =>
                  logQuery(title, {
                    param: record.paramName,
                    remark: getPrefixBeforeNumber(textArr[1]),
                  })
                }
                size="small"
                type="primary"
              >
                {textArr[1]}
              </Button>
            )}
          </>
        ) : (
          text
        );
      },
    },
  ];
  let columns2 = [
    {
      title: '编号',
      dataIndex: 'index',
      key: 'index',
      align: 'center',
      ellipsis: true,
      width: 60,
      render: (text, record, index) => {
        return index + 1;
      },
    },
    {
      title: '企业',
      dataIndex: 'entName',
      key: 'entName',
      align: 'center',
      ellipsis: true,
      render: (text, record) => {
        return <Tooltip title={text}>{text}</Tooltip>;
      },
    },
    {
      title: '排放口',
      dataIndex: 'pointName',
      key: 'pointName',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '数据条数',
      dataIndex: 'hourCount',
      key: 'hourCount',
      align: 'center',
      ellipsis: true,
      sorter: (a, b) => a.hourCount - b.hourCount,
    },
    // {
    //   title: '数据缺失率',
    //   dataIndex: 'rate',
    //   key: 'rate',
    //   align: 'center',
    //   ellipsis: true,
    //   render: text => {
    //     return text + '%';
    //   },
    // },
    // {
    //   title: '缺失数据',
    //   dataIndex: 'actualDataCount',
    //   key: 'actualDataCount',
    //   align: 'center',
    //   ellipsis: true,
    // },
    // {
    //   title: '应传数据',
    //   dataIndex: 'passeDataCount',
    //   key: 'passeDataCount',
    //   align: 'center',
    //   ellipsis: true,
    // },
  ];
  const logCommonCol = [
    {
      title: '企业',
      dataIndex: 'ParentName',
      key: 'ParentName',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '排放口',
      dataIndex: 'PointName',
      key: 'PointName',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '参数',
      dataIndex: 'DataType',
      key: 'DataType',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '原始数据',
      dataIndex: 'OldValue',
      key: 'OldValue',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '清洗数据',
      dataIndex: 'NewValue',
      key: 'NewValue',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '备注',
      dataIndex: 'Remark',
      key: 'Remark',
      align: 'center',
      width: 200,
      ellipsis: true,
    },
  ];

  const [logVisible, setLogVisible] = useState(false);
  const [logTitle, setLogTitle] = useState();
  const [logData, setLogData] = useState({});
  const [logLoading, setLogLoading] = useState({});

  const logQuery = (title, par) => {
    setLogVisible(true);
    const objRequest = {
      ...obj1,
      ...obj2,
    };
    const logTitle = objRequest[title]?.logTitle;

    setLogTitle(logTitle);
    setLogLoading({ ...logLoading, [logTitle]: true });
    const taskType = objRequest[title]?.taskType;

    const url = `${namespace}/${
      title == '污染物' || title == '排放标准'
        ? par.status
          ? objRequest[title]?.logUrl
          : objRequest[title]?.logUrl
        : objRequest[title]?.logUrl
    }`;
    props.dispatch({
      type: url,
      payload: { projectType: 1, taskType: taskType, ...par },
      callback: result => {
        setLogLoading({ ...logLoading, [logTitle]: false });
        if (result.IsSuccess) {
          setLogData({ ...logData, [logTitle]: result.Datas });
        }
      },
    });
  };

  const getHourDataLogsListRequest = value => {
    props.dispatch({
      type: `${namespace}/GetHourDataLogsList`,
      payload: { projectType: 1, taskType: 6, rate: value },
      callback: result => {
        setDischargePort(result.Datas?.successCount || 0 + result.Datas?.falseCount || 0);
        setDischargePortLoading(false);
      },
    });
  };

  const debounceSearch = debounce(value => {
    //防抖 防止多次请求
    getHourDataLogsListRequest(value);
  }, 700);

  const [dischargePort, setDischargePort] = useState(0);
  const [dischargePortLoading, setDischargePortLoading] = useState(true);
  const missingDataChange = value => {
    if (!value && value != 0) {
      return;
    }
    setDischargePortLoading(true);
    debounceSearch(value);
  };

  const typeStyle = { background: '#fafafa', padding: 4, borderRadius: 4, marginRight: 4 };
  const TitleComponents = ({ title, time, numData }) => {
    return (
      <>
        <Row align="middle" justify="space-between">
          <div style={{ fontSize: 18, fontWeight: 'bold' }}>{title}</div>
          {title !== '监测数据' && <div>最近清洗时间：{time}</div>}  
        </Row>
        {numData && (
          <Row style={{ margin: '8px 0' }}>
            {numData.map(item => (
              <div style={{ ...typeStyle }}>
                {item.label}{' '}
                <span
                  style={{
                    color:
                      item.label === '清洗失败' || item.label === '非法' ? '#f5222d' : '#d4ab32',
                    fontWeight: 'bold',
                    paddingLeft: 12,
                  }}
                >
                  {item.value}
                </span>
              </div>
            ))}
          </Row>
        )}
      </>
    );
  };

  const searchComponents = () => {
    return (
      <Form
        form={form}
        name="advanced_search"
        className={'ant-advanced-search-form'}
        layout="inline"
      >
        <Form.Item label="选择项目">
          <Select
            defaultValue="1"
            style={{ width: 200 }}
            onChange={handleChange}
            placeholder="内蒙数据同步"
            options={[
              {
                value: '1',
                label: '内蒙数据',
              },
            ]}
          />
        </Form.Item>
      </Form>
    );
  };

  const getOption = () => {
    const data = obj1.监测数据.data;
    const grid = {
      // left: 80,
      right: 0,
      bottom: 20,
      top: 10,
      // containLabel: true
    };
    if (!data) {
      return {};
    }
    let xAxisData = [],
      yAxisData = [];
    data.map(item => {
      xAxisData.push(item.entName);
      yAxisData.push(item.hourCount);
    });
    let option = {
      grid: {
        ...grid,
      },
      toolbox: {
        feature: {
          dataZoom: {
            show: true,
            yAxisIndex: 'none',
            title: {
              zoom: '区域缩放',
              back: '区域缩放还原',
            },
          },
          restore: { show: true, title: '还原' },
          saveAsImage: { show: true, title: '保存为图片' },
        },
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
        formatter: function(params) {
          let dataIndex = params[0].dataIndex;
          let currentData = data[dataIndex];
          let tooltipText = `企业：${currentData.entName} <br/>
                排放口：${currentData.pointName} <br/>
                数据条数：${currentData.hourCount} <br/>
                <span style="color: #faad14;font-weight: bold">点击查看该排放口所有因子的波动范围</span>
              `;
          return tooltipText;
        },
      },
      // dataZoom: [
      //   {
      //     type: 'inside',
      //     start: 0,
      //     end: 100,
      //   },
      // ],
      xAxis: {
        type: 'category',
        data: xAxisData,
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          name: '监测数据',
          type: 'bar',
          data: yAxisData,
        },
      ],
    };
    return option;
  };

  // 显示波动范围弹窗
  const [currentData, setCurrentData] = useState({});
  const [visible, setVisible] = useState(false);
  const onShowAbnormalJudgmentPage = row => {
    setCurrentData(row);
    setVisible(true);
  };

  const dischargeOutletType = [
    { label: '废气排放口', value: pointRelevantCountData?.fqpfk || 0 },
    { label: '废气非排放口', value: pointRelevantCountData?.fqopfk || 0 },
    { label: '废水排放口', value: pointRelevantCountData?.fspfk || 0 },
    { label: '废水非排放口', value: pointRelevantCountData?.fsopfk || 0 },
    // { label: '单粉尘CEMS排放口', value: pointRelevantCountData?.dust || 0 },
    // { label: '常规焚烧炉CEMS排放口', value: pointRelevantCountData?.burn || 0 },
    // { label: '关联排放口', value: pointRelevantCountData?.relaCount || 0 },
  ];
  const logColObj = {
    企业日志: logCommonCol?.filter(item => item.title != '排放口'),
    排放口: logCommonCol?.filter(item => item.title != '排放口'),
    data: [],
    备案参数日志: logCommonCol,
    污染物缺失: logCommonCol?.filter(item => item.title == '企业' || item.title == '排放口'),
    排放标准缺失: logCommonCol?.filter(item => item.title == '企业' || item.title == '排放口'),
  };

  return (
    <div className={`${styles.dataCleaningSty}`}>
      <BreadcrumbWrapper>
        {/* <Card className='queryCriterTitleSty' bodyStyle={{ padding: '8px 24px' }}>{searchComponents()}</Card> */}
        <Row style={{ height: 'calc(100vh - 130px)', overflowY: 'auto' }}>
          <Col span={12} style={{ paddingRight: 6 }}>
            {Object.keys(obj1).map(item => {
              return (
                <Card style={{ marginBottom: 12 }}>
                  <TitleComponents
                    title={item}
                    time={obj1[item].time}
                    numData={obj1[item].numData}
                  />
                  {item == '监测数据' && (
                    // <Row align="middle" style={{ margin: '8px 0' }}>
                    //   <div style={{ paddingRight: 12 }}>
                    //     数据缺失超过
                    //     <span>
                    //       <InputNumber
                    //         min={0}
                    //         max={100}
                    //         style={{ width: 70, margin: '0 4px' }}
                    //         defaultValue={missDefaultValue || 0}
                    //         onChange={missingDataChange}
                    //       />
                    //       %
                    //     </span>
                    //   </div>
                    //   排放口统计
                    //   {dischargePortLoading ? (
                    //     <span style={{ paddingLeft: 6 }}>
                    //       <LoadingOutlined />
                    //     </span>
                    //   ) : (
                    //     <span>{dischargePort || 0}%</span>
                    //   )}
                    // </Row>
                    <Space style={{ margin: '8px 0' }}>
                      <Radio.Group
                        onChange={e => {
                          setDataType(e.target.value);
                        }}
                        defaultValue="data"
                      >
                        <Radio.Button value="data">数据</Radio.Button>
                        <Radio.Button value="chart">图表</Radio.Button>
                      </Radio.Group>
                      <Button
                        type="primary"
                        onClick={getJsHourDataInfo}
                        loading={props.JsHourDataInfoLoading}
                      >
                        点击统计
                      </Button>
                    </Space>
                  )}
                  {item == '监测数据' && dataType == 'chart' ? (
                    <ReactEcharts
                      // ref={echart => {
                      //   echart && setEcharts2(echart.echarts);
                      // }}
                      option={getOption()}
                      style={{ height: '500px', width: '100%' }}
                      onEvents={{
                        click: event => {
                          onShowAbnormalJudgmentPage(obj1.监测数据.data[event.dataIndex]);
                        },
                      }}
                    />
                  ) : (
                    <SdlTable
                      style={{ margin: '8px 0' }}
                      loading={obj1[item].loading}
                      bordered
                      dataSource={obj1[item].data}
                      columns={item == '监测数据' ? columns2 : columns(item)}
                      scroll={{ y: item == '监测数据' ? 500 : 'hidden' }}
                      rowClassName={null}
                      pagination={false}
                    />
                  )}
                </Card>
              );
            })}
          </Col>
          <Col span={12} style={{ paddingLeft: 6 }}>
            {Object.keys(obj2).map(item => {
              return (
                <Card style={{ marginBottom: 12 }}>
                  <TitleComponents
                    title={item}
                    time={obj2[item].time}
                    numData={obj2[item].numData}
                  />
                  {item == '排放口信息清洗' && (
                    <Spin spinning={!!props.pointRelevantCountLoading} size="small">
                      <Row style={{ marginBottom: 8 }}>
                        {dischargeOutletType.map(item => {
                          return (
                            <div style={{ ...typeStyle, textAlign: 'center' }}>
                              <div>
                                <Badge color="#fa8c16" text={item.value?.toString()} />
                              </div>
                              <div>{item.label}</div>
                            </div>
                          );
                        })}
                      </Row>
                    </Spin>
                  )}
                  <SdlTable
                    loading={obj2[item].loading}
                    bordered
                    dataSource={obj2[item].data}
                    columns={columns(item)}
                    scroll={{ y: 'hidden' }}
                    rowClassName={null}
                    pagination={false}
                  />
                </Card>
              );
            })}
          </Col>
        </Row>
        <Modal
          visible={logVisible}
          title={logTitle}
          onCancel={() => {
            setLogVisible(false);
            setLogData({});
          }}
          destroyOnClose
          footer={null}
          width={1000}
        >
          <SdlTable
            loading={logLoading[logTitle]}
            bordered
            dataSource={logData[logTitle]}
            columns={logColObj[logTitle]}
            scroll={{ y: 'calc(100vh - 300px)' }}
            rowClassName={null}
            pagination={false}
          />
        </Modal>
        <Modal
          title={`波动范围（${currentData.entName} - ${currentData.pointName}）`}
          wrapClassName="spreadOverModal"
          destroyOnClose
          open={visible}
          footer={false}
          onCancel={() => setVisible(false)}
          bodyStyle={{ padding: 0 }}
        >
          <AssistDataAnalysis displayType="modal" DGIMN={currentData.DGIMN} defaultActiveKey="0" />
        </Modal>
      </BreadcrumbWrapper>
    </div>
  );
};
export default connect(dvaPropsData)(Index);
