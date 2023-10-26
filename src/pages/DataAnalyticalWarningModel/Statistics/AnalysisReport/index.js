/*
 * @Author: JiaQi
 * @Date: 2023-08-31 09:26:19
 * @Last Modified by: JiaQi
 * @Last Modified time: 2023-10-25 20:08:04
 * @Description：场景模型分析报告
 */
import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import {
  Form,
  Card,
  Spin,
  Button,
  Space,
  Tooltip,
  Descriptions,
  Row,
  Col,
  Select,
  Empty,
  message,
} from 'antd';
import styles from '../../styles.less';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import SearchSelect from '@/pages/AutoFormManager/SearchSelect';
import RangePicker_ from '@/components/RangePicker/NewRangePicker';
import RegionList from '@/components/RegionList';
import EntAtmoList from '@/components/EntAtmoList';
import ReactEcharts from 'echarts-for-react';
import SdlTable from '@/components/SdlTable';
import moment from 'moment';
import { DetailIcon } from '@/utils/icon';
import { router } from 'umi';
import { ModelNumberIdsDatas, ModalNameConversion } from '../../CONST';


const noData = {
  value: 0,
  name: '暂无数据',
  itemStyle: {
    color: '#ccc',
  },
};

const dvaPropsData = ({ loading, dataModel }) => ({
  warningForm: dataModel.warningForm,
  modelListLoading: loading.effects['dataModel/GetModelList'],
  modelInfoLoading: loading.effects['dataModel/StatisAlarmInfoSum'],
  exportLoading: loading.effects['dataModel/ExportStatisAlarmReport'],
  allExportLoading: loading.effects['dataModel/ExportStatisAlarmAllReport'],
  queryLoading:
    loading.effects[
      ('dataModel/StatisAlarmInfoSum',
      'dataModel/StatisAlarmInfoCheck',
      'dataModel/StatisAlarmInfoIndiz')
    ],
  // todoList: wordSupervision.todoList,
  // todoListLoading: loading.effects['wordSupervision/GetToDoDailyWorks'],
});

const Index = props => {
  const [form] = Form.useForm();

  const {
    dispatch,
    modelListLoading,
    modelInfoLoading,
    queryLoading,
    exportLoading,
    allExportLoading,
    warningForm,
  } = props;
  const [modelList, setModelList] = useState([]);
  const [regionCode, setRegionCode] = useState();
  const [modelInfo, setModelInfo] = useState([]);
  const [entChartData, setEntChartData] = useState([]);
  const [reasonsAndCheckData, setReasonsAndCheckData] = useState({
    reasonsData: [],
    checkData: [],
  });
  const [dataSource, setDataSource] = useState([]);

  useEffect(() => {
    GetModelList();
    handleLocationParams();
  }, []);

  // 处理地址栏参数
  const handleLocationParams = () => {
    let locationParams = props.history.location.query.params;
    if (locationParams) {
      let values = JSON.parse(locationParams);
      values.date = [moment(values.date[0]), moment(values.date[1])];
      form.setFieldsValue(values);
      getPageData();
    }
  };

  // 获取页面数据
  const getPageData = () => {
    const values = form.getFieldsValue();
    if (!values.modelGuid) {
      message.error('请选择场景后查询！');
      return;
    }
    StatisAlarmInfoSum();
    getStatisAlarmInfoCheck();
    StatisAlarmInfoIndiz();
  };

  // 获取数据模型列表
  const GetModelList = () => {
    dispatch({
      type: 'dataModel/GetModelList',
      payload: {},
      callback: (res, unfoldModelList) => {
        setModelList(unfoldModelList);
      },
    });
  };

  // 获取模型详情及统计数据
  const StatisAlarmInfoSum = () => {
    let reqBody = getRequestBody();
    dispatch({
      type: 'dataModel/StatisAlarmInfoSum',
      payload: {
        ...reqBody,
        modelGuid: [reqBody.modelGuid],
      },
      callback: res => {
        setModelInfo({
          ...res.ModelInfo,
          ...res.NumInfo,
        });
      },
    });
  };

  // 线索信息统计 - 核实情况、异常原因
  const getStatisAlarmInfoCheck = () => {
    let reqBody = getRequestBody();
    dispatch({
      type: 'dataModel/StatisAlarmInfoCheck',
      payload: {
        ...reqBody,
        modelGuid: [reqBody.modelGuid],
      },
      callback: res => {
        // 统计核实
        let checkData = res.finalResult.map(item => {
          // 1：工况正常、2：有异常、3：待核实
          return { value: item.Count, name: item.CheckedResult };
        });

        // 异常情况
        let reasonsData = res.reasonResult.map(item => {
          // 1：工况正常、2：有异常、3：待核实
          return { value: item.ReasonCount, name: item.UntruthReason };
        });

        setReasonsAndCheckData({
          checkData: checkData.length ? checkData : [noData],
          reasonsData: reasonsData.length ? reasonsData : [noData],
        });
      },
    });
  };

  // 线索信息统计
  const StatisAlarmInfoIndiz = () => {
    let reqBody = getRequestBody();
    dispatch({
      type: 'dataModel/StatisAlarmInfoIndiz',
      payload: {
        ...reqBody,
        modelGuid: [reqBody.modelGuid],
      },
      callback: res => {
        setDataSource(res.finalResult);
        // 发现线索企业
        let entChartData = [noData];
        if (res.entResult.length) {
          entChartData = res.entResult.map(item => {
            // 1：工况正常、2：有异常、3：待核实
            return { value: item.DisCulesNum, name: item.EntName };
          });
        }
        setEntChartData(entChartData);
      },
    });
  };

  // 导出
  const onExportStatisAlarmReport = type => {
    let reqBody = getRequestBody();
    let modelGuid = [reqBody.modelGuid];
    let actionType = 'dataModel/ExportStatisAlarmReport';
    // 全模型导出
    if (type === 'all') {
      actionType = 'dataModel/ExportStatisAlarmAllReport';
      modelGuid = modelList.map(item => item.ModelGuid);
    }
    dispatch({
      type: actionType,
      payload: {
        ...reqBody,
        modelGuid: modelGuid,
      },
    });
  };

  // 获取请求参数
  const getRequestBody = () => {
    const values = form.getFieldsValue();
    return {
      ...values,
      date: undefined,
      EntCode: values.EntCode || [],
      BeginTime: moment(values.date[0]).format('YYYY-MM-DD HH:mm:ss'),
      EndTime: moment(values.date[1]).format('YYYY-MM-DD HH:mm:ss'),
    };
  };

  // 统计核实、异常情况
  const getOption = (data, title) => {
    return {
      color: ['#91cc75', '#fac858', '#5470c6'],
      title: {
        text: title,
        left: 'center',
        top: 20,
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)',
      },
      grid: {
        bottom: '10%',
        containLabel: true,
      },
      series: [
        {
          name: title,
          type: 'pie',
          radius: '55%',
          center: ['50%', '60%'],
          data: data,
          itemStyle: {
            normal: {
              label: {
                //饼图图形上的文本标签
                show: true,
                position: 'inner', //标签的位置
                textStyle: {
                  // color: 'rgba(0, 0, 0, 0.85)',
                  fontWeight: 500,
                  fontSize: 13, //文字的字体大小
                },
                formatter: '{d}%',
              },

              labelLine: {
                show: false, //隐藏标示线
              },
            },
          },

          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
        {
          // 设置指示线和指示线上的文字的饼状图
          name: title,
          type: 'pie',
          radius: '55%',
          center: ['50%', '60%'],
          itemStyle: {
            normal: {
              label: {
                //饼图图形上的文本标签
                show: true,
              },

              labelLine: {
                show: true, //隐藏标示线
              },
            },
          },
          data: data,
        },
      ],
    };
  };

  // 发现线索企业
  const getEntOption = () => {
    return {
      // color: ['#91cc75', '#fac858', '#5470c6'],
      title: {
        text: '发现线索企业',
        left: 'center',
        top: 20,
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b} : {c} ({d}%)',
      },
      grid: {
        bottom: '10%',
        containLabel: true,
      },
      series: [
        {
          name: '企业',
          type: 'pie',
          radius: '55%',
          center: ['50%', '60%'],
          data: entChartData,
          itemStyle: {
            normal: {
              label: {
                //饼图图形上的文本标签
                show: true,
                // position: 'inner', //标签的位置
                textStyle: {
                  // color: 'rgba(0, 0, 0, 0.85)',
                  fontWeight: 500,
                  fontSize: 13, //文字的字体大小
                },
                formatter: '{d}%',
              },

              labelLine: {
                // show: false, //隐藏标示线
              },
            },
          },

          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      ],
    };
  };

  // 重置表单
  const onReset = () => {
    form.resetFields();
  };

  //
  const getPageContent = () => {
    return (
      <Card bodyStyle={{ paddingBottom: 20 }}>
        <Spin spinning={modelInfoLoading}>
          <h1>{ModalNameConversion(modelInfo.ModelName)}</h1>
          <p className={styles.description}>{modelInfo.ModelDes}</p>

          <Card title={<div className={styles.title}>执行结果</div>}>
            <p className={styles.resultInfo}>
              模型对{modelInfo.AllUniqueParentCodeCount}
              家企业{modelInfo.AllDGIMNCount}
              个排放口{dateString[0]}至{dateString[1]}的小时数据进行分析，共发现
              {modelInfo.UniqueParentCodeCount}家企业{modelInfo.DGIMNCount}
              个排放口符合数据特征，发现线索{modelInfo.DisCulesNum}次，已核实
              {modelInfo.VerifiedNum}次
              {/* ，经核发现有异常{modelInfo.CheckedResult2Count}次 */}
              。
            </p>
            <Descriptions bordered column={1} size="small" className={styles.DescriptionsWrapper}>
              <Descriptions.Item label="数据特征">{modelInfo.DataAttr}</Descriptions.Item>
              <Descriptions.Item label="分析周期">{modelInfo.Ciclo}</Descriptions.Item>
              <Descriptions.Item label="分析时长">{modelInfo.Dura}</Descriptions.Item>
              <Descriptions.Item label="分析数据">
                {/* {modelInfo.CheckedResult2Count}家企业{modelInfo.DGIMNCount} */}
                {modelInfo.AllUniqueParentCodeCount}家企业{modelInfo.AllDGIMNCount}
                个排放口{dateString[0]}至{dateString[1]}的小时数据
              </Descriptions.Item>
              <Descriptions.Item label="模型运行总次数">
                {modelInfo.ModelExcAllNum}次
              </Descriptions.Item>
              <Descriptions.Item label="有效执行次数">{modelInfo.EffNum}次</Descriptions.Item>
              <Descriptions.Item label="发现线索次数">{modelInfo.DisCulesNum}次</Descriptions.Item>
              {/* <Descriptions.Item label="已核实">{modelInfo.VerifiedNum}次</Descriptions.Item>
              <Descriptions.Item label="工况正常">
                {modelInfo.CheckedResult1Count}次
              </Descriptions.Item>
              <Descriptions.Item label="有异常">
                {modelInfo.CheckedResult2Count}次
              </Descriptions.Item>
              <Descriptions.Item label="异常原因">{modelInfo.Reason || '-'}</Descriptions.Item> */}
            </Descriptions>
          </Card>
        </Spin>
        <Card title={<div className={styles.title}>线索信息统计</div>} style={{ marginTop: 10 }}>
          <Row className={styles.ClueInfoChartWrapper}>
            <Col span={24}>
              <ReactEcharts
                theme="light"
                option={getEntOption()}
                lazyUpdate
                notMerge
                style={{ width: '100%', height: '100%' }}
              />
            </Col>
            {/* <Col span={8}>
              <ReactEcharts
                theme="light"
                option={getOption(reasonsAndCheckData.checkData, '核实情况')}
                lazyUpdate
                notMerge
                style={{ width: '100%', height: '100%' }}
              />
            </Col>
            <Col span={8}>
              <ReactEcharts
                theme="light"
                option={getOption(reasonsAndCheckData.reasonsData, '异常原因')}
                lazyUpdate
                notMerge
                style={{ width: '100%', height: '100%' }}
              />
            </Col> */}
          </Row>
          <SdlTable
            columns={columns}
            dataSource={dataSource}
            align="center"
            pagination={false}
            scroll={{
              y: 400,
            }}
          />
        </Card>
      </Card>
    );
  };

  const columns = [
    {
      title: '序号',
    },
    {
      title: '企业',
      dataIndex: 'EntName',
      width: 200,
    },
    {
      title: '排放口',
      dataIndex: 'PointName',
      ellipsis: true,
      width: 200,
    },
    {
      title: '发现线索次数',
      dataIndex: 'DisCulesNum',
      ellipsis: true,
      sorter: (a, b) => a.DisCulesNum - b.DisCulesNum,
    },
    {
      title: '已核实',
      dataIndex: 'VerifiedNum',
      ellipsis: true,
      sorter: (a, b) => a.VerifiedNum - b.VerifiedNum,
    },
    // {
    //   title: '核实有异常',
    //   ellipsis: true,
    //   dataIndex: 'CheckedResult2Count',
    //   sorter: (a, b) => a.CheckedResult2Count - b.CheckedResult2Count,
    // },
    // {
    //   ellipsis: true,
    //   title: '异常原因',
    //   dataIndex: 'ExceptionReason',
    //   width: 200,
    //   render: (text, record) => {
    //     return text || '-';
    //   },
    // },
    {
      title: '操作',
      dataIndex: 'handle',
      width: 100,
      render: (text, record) => {
        return (
          <Tooltip title="查看">
            <a
              onClick={() => {
                let body = form.getFieldsValue();
                body.EntCode = record.EntCode;
                body.DGIMN = record.DGIMN;
                body.warningTypeCode = body.modelGuid;
                let menuKey = findKeyByModelGuid(body.modelGuid);
                console.log('menuKey', menuKey);

                props.dispatch({
                  type: 'dataModel/updateState',
                  payload: {
                    warningForm: {
                      ...warningForm,
                      [menuKey]: {
                        ...warningForm[menuKey],
                        ...body,
                        pageIndex: 1,
                        pageSize: 20,
                      },
                    },
                  },
                });

                // return;
                router.push(
                  `/DataAnalyticalWarningModel/Warning/ModelType/${menuKey}?notResetForm=${true}`,
                );
              }}
            >
              <DetailIcon />
            </a>
          </Tooltip>
        );
      },
    },
  ];

  // 根据modelGuid找到对应的key
  const findKeyByModelGuid = modelGuid => {
    for (let key in ModelNumberIdsDatas) {
      if (ModelNumberIdsDatas.hasOwnProperty(key)) {
        if (ModelNumberIdsDatas[key].includes(modelGuid)) {
          return key;
        }
      }
    }
    return null; // 如果找不到对应的key，则返回null
  };

  const valueDatas = form.getFieldValue('date');
  const modelGuid = form.getFieldValue('modelGuid');
  let dateString = [];
  if (valueDatas) {
    dateString = [
      moment(valueDatas[0]).format('YYYY-MM-DD'),
      moment(valueDatas[1]).format('YYYY-MM-DD'),
    ];
  }
  let EmptyDescription = modelGuid ? '暂无数据' : '请选择场景后查询！';
  return (
    <BreadcrumbWrapper>
      <div className={styles.AnalysisReport}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Card bodyStyle={{ paddingTop: 0 }}>
            <Form
              name="basic"
              form={form}
              layout="inline"
              style={{ padding: '10px 0' }}
              // style={{ padding: '10px 0', marginBottom: 10 }}
              initialValues={{
                modelGuid: undefined,
                date: [
                  moment()
                    .subtract(3, 'month')
                    .startOf('day'),
                  moment().endOf('day'),
                ],
              }}
              autoComplete="off"
              // onValuesChange={onValuesChange}
              onValuesChange={(changedFields, allFields) => {
                // console.log('changedFields', changedFields);
                // console.log('allFields', allFields);
                // dispatch({
                //   type: 'dataModel/updateState',
                //   payload: {
                //     warningForm: {
                //       ...props.warningForm,
                //       ...changedFields,
                //     },
                //   },
                // });
              }}
            >
              <Form.Item label="行政区" name="regionCode">
                <RegionList
                  noFilter
                  style={{ width: 140 }}
                  onChange={value => {
                    // 重置企业列表
                    setRegionCode(value);
                    form.setFieldsValue({ EntCode: undefined });
                  }}
                />
              </Form.Item>
              <Form.Item label="企业" name="EntCode">
                <EntAtmoList
                  mode="multiple"
                  maxTagCount={2}
                  maxTagTextLength={6}
                  maxTagPlaceholder="..."
                  regionCode={regionCode}
                  style={{ width: 300 }}
                />
              </Form.Item>
              <Form.Item label="行业" name="IndustryTypeCode">
                <SearchSelect
                  placeholder="排口所属行业"
                  style={{ width: 130 }}
                  configId={'IndustryType'}
                  itemName={'dbo.T_Cod_IndustryType.IndustryTypeName'}
                  itemValue={'dbo.T_Cod_IndustryType.IndustryTypeCode'}
                />
              </Form.Item>
              <Spin spinning={modelListLoading} size="small">
                <Form.Item label="场景类别" name="modelGuid">
                  <Select
                    allowClear
                    placeholder="请选择场景类别"
                    style={{ width: 240 }}
                    showSearch
                    filterOption={(input, option) =>
                      option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {modelList.map(item => {
                      return (
                        <Option key={item.ModelGuid} value={item.ModelGuid}>
                          {ModalNameConversion(item.ModelName)}
                        </Option>
                      );
                    })}
                  </Select>
                </Form.Item>
              </Spin>
              <Form.Item label="日期" name="date">
                <RangePicker_
                  allowClear={false}
                  dataType="day"
                  format="YYYY-MM-DD"
                  style={{ width: 250 }}
                />
              </Form.Item>
              <Form.Item>
                <Space>
                  <Button
                    type="primary"
                    loading={queryLoading}
                    onClick={() => {
                      getPageData();
                    }}
                  >
                    查询
                  </Button>
                  <Button onClick={() => onReset()}>重置</Button>
                  <Button
                    type="primary"
                    onClick={() => onExportStatisAlarmReport()}
                    loading={exportLoading}
                  >
                    导出
                  </Button>
                  <Button
                    type="primary"
                    onClick={() => onExportStatisAlarmReport('all')}
                    loading={allExportLoading}
                  >
                    全模型导出
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Card>
          {!modelInfoLoading && !modelInfo.ModelName ? (
            <Card bodyStyle={{ paddingBottom: 20 }}>
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={EmptyDescription} />
            </Card>
          ) : (
            getPageContent()
          )}
        </Space>
      </div>
    </BreadcrumbWrapper>
  );
};

export default connect(dvaPropsData)(Index);
