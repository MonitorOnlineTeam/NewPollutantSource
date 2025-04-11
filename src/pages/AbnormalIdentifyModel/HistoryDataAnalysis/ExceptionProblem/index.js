import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import {
  Card,
  Tag,
  Radio,
  Row,
  Col,
  Space,
  Button,
  Statistic,
  Form,
  InputNumber,
  Modal,
} from 'antd';
import styles from '@/pages/AbnormalIdentifyModel/styles.less';
import moment from 'moment';
import SdlTable from '@/components/SdlTable';
import ReactEcharts from 'echarts-for-react';
import CluesListModal from '@/pages/AbnormalIdentifyModel/Home/ModalPage/CluesListModal.js';
import PointCluesStatistics from './PointCluesStatistics';
import { convertTextByConfig } from '@/utils/utils';

const dvaPropsData = ({ loading, AbnormalIdentifyModel }) => ({
  warningForm: AbnormalIdentifyModel.warningForm,
  loading: loading.effects['AbnormalIdentifyModel/GetExcepInfoPageData'],
});

const ExceptionProblem = props => {
  const [form] = Form.useForm();

  const { dispatch, DGIMN, title, open, onCancel, reqParams, warningForm } = props;

  const [cluesListModalOpen, setCluesListModalOpen] = useState(false);
  const [dataType, setDataType] = useState('nums');
  const [loading, setLoading] = useState(false);
  const [pointCluesModalOpen, setPointCluesModalOpen] = useState();
  const [currentPointData, setCurrentPointData] = useState({});

  const [dataSource, setDataSource] = useState([]);
  const [dataSource2, setDataSource2] = useState([]);

  useEffect(() => {
    loadData();

    return () => {
      // 组件销毁，重置数据
      resetCluesListParams();
    };
  }, []);

  // 重置数据列表表单
  const resetCluesListParams = () => {
    // 重置表单
    dispatch({
      type: 'AbnormalIdentifyModel/onReset',
      payload: {
        modelNumber: 'all',
      },
    });
  };

  //
  const loadData = _dataType => {
    setLoading(true);
    let bTime = moment(reqParams.date[0]).format('YYYY-MM-DD HH:mm:ss');
    let eTime = moment(reqParams.date[1]).format('YYYY-MM-DD HH:mm:ss');
    dispatch({
      type: 'AbnormalIdentifyModel/GetExcepInfoPageData',
      payload: {
        ...reqParams,
        beginTime: bTime,
        endTime: eTime,
        date: undefined,
      },
      callback: result => {
        if (result.IsSuccess) {
          setDataSource(result.Datas.QuesTable);
          setDataSource2(result.Datas.TableData);
        }
        setLoading(false);
      },
    });
  };

  // 更新异常线索清单model状态
  const updateCluesListFormState = (data, row) => {
    const { ModelGuid, Str } = data;
    const { ParentKey, Key } = row;
    let body = {
      date: [],
      date1: reqParams.date,
      pollutantType: reqParams.pollutantType,
      pageSize: 20,
      pageIndex: 1,
      rowKey: undefined,
      scrollTop: 0,
      warningTypeCode: ModelGuid.split(','),
      EntCode: ParentKey,
      DGIMN: Key,
    };

    // 进入线索列表，传入时间、场景类型、企业、污染物
    dispatch({
      type: 'AbnormalIdentifyModel/updateState',
      payload: {
        warningForm: {
          ...warningForm,
          all: {
            ...warningForm['all'],
            ...body,
          },
        },
      },
    });
    setCluesListModalOpen(true);
  };

  const getOption = () => {
    let seriesData = dataSource.map(item => {
      return {
        value: dataType === 'nums' ? item.WarningCount : item.OccurrenceCount,
        name: item.ModelName,
      };
    });
    let unit = dataType === 'nums' ? '次' : '小时';
    let option = {
      // color: ['#5cdc9f', '#fac858'],
      tooltip: {
        trigger: 'item',
        valueFormatter: function(value) {
          return value + unit;
        },
        // formatter: '{a} <br/>{b}：{c}个 ({d}%)',
      },
      series: [
        {
          name: '异常问题分布',
          type: 'pie',
          radius: [0, 80],
          // roseType: 'area',
          itemStyle: {
            normal: {
              shadowBlur: 10,
              shadowColor: 'rgba(44,44,44,0.2)',
            },
          },
          label: {
            show: true,
            position: 'outside',
            color: 'inherit', //继承饼图颜色
            formatter: function(params) {
              return '{b|' + params.name + '}\n{c|' + params.value + unit + '}\n{hr|●}';
            },
            rich: {
              // a: {
              //   fontSize: 18,
              //   padding: [18, 0, 0, 0],
              // },
              b: {
                fontFamily: 'Source Han Sans CN',
                fontWeight: 500,
                fontSize: 14,
                color: '#999999',
                padding: [18, 8, 0, 6],
              },
              c: {
                fontFamily: 'Microsoft YaHei',
                fontWeight: 500,
                fontSize: 16,
                padding: [4, 0, 0, 4],
                align: 'left',
                // color: '#0055FE',
              },
              hr: {
                color: 'inherit',
                // borderRadius: 100,
                width: 4,
                height: 4,
                verticalAlign: 'top',
                lineHeight: -20,
                padding: [-28, -10, 0, -10],
                // shadowColor: 'inherit',
                // shadowBlur: 1,
                // shadowOffsetX: '0',
                // shadowOffsetY: '-26',
              },
            },
          },
          labelLine: {
            lineStyle: {
              // length: 20,
              // length2: 5,
              width: 2, // 引导线宽度
            },
          },
          data: seriesData,
        },
      ],
    };

    return option;
  };

  const getColumns = () => {
    const columns = [
      {
        title: '序号',
        width: 40,
      },
      {
        title: '异常场景',
        dataIndex: 'ModelName',
        key: 'ModelName',
        ellipsis: true,
        width: 200,
      },
      {
        title: '异常次数',
        dataIndex: 'WarningCount',
        key: 'WarningCount',
        width: 100,
        sorter: (a, b) => a.WarningCount - b.WarningCount,
      },
      {
        title: '异常小时数',
        dataIndex: 'OccurrenceCount',
        key: 'OccurrenceCount',
        width: 100,
        sorter: (a, b) => a.OccurrenceCount - b.OccurrenceCount,
      },
      {
        title: '涉及排口数量',
        dataIndex: 'UniqueDGIMNCount',
        key: 'UniqueDGIMNCount',
        ellipsis: true,
        width: 100,
        sorter: (a, b) => a.UniqueDGIMNCount - b.UniqueDGIMNCount,
        render: (text, record) => {
          return (
            <a
              onClick={() => {
                setPointCluesModalOpen(true);
                setCurrentPointData(record);
              }}
            >
              {text}
            </a>
          );
        },
      },
    ];
    return columns;
  };

  const getColumns2 = () => {
    const columns = [
      {
        title: '序号',
        width: 40,
      },
      {
        title: convertTextByConfig('企业'),
        dataIndex: 'ParentName',
        key: 'ParentName',
        ellipsis: true,
      },
      {
        title: '排口',
        dataIndex: 'Name',
        key: 'Name',
        ellipsis: true,
        sorter: (a, b) => a.ExcepRate - b.ExcepRate,
      },
      {
        title: '异常小时数',
        dataIndex: 'ExcepHours',
        key: 'ExcepHours',
        width: 100,
        sorter: (a, b) => a.ExcepHours - b.ExcepHours,
      },
      {
        title: '异常次数',
        dataIndex: 'ExcepNums',
        key: 'ExcepNums',
        width: 100,
        sorter: (a, b) => a.ExcepNums - b.ExcepNums,
      },

      {
        title: '异常现象',
        dataIndex: 'ReasonList',
        key: 'ReasonList',
        // ellipsis: true,
        width: 400,
        render: (text, record) => {
          return text.map(item => {
            return (
              <Tag
                style={{ margin: '2px 4px', cursor: 'pointer' }}
                onClick={() => updateCluesListFormState(item, record)}
                color="processing"
              >
                {item.Str}
              </Tag>
            );
          });
        },
      },
    ];
    return columns;
  };
  console.log('reqParams222', reqParams)
  return (
    <Modal
      title={title}
      wrapClassName={
        window.location.pathname === '/SystemDashboard/AbnormalIdentify'
          ? 'fullScreenModal'
          : 'spreadOverModal'
      }
      destroyOnClose
      open={open}
      footer={false}
      // bodyStyle={
      //   window.location.pathname === '/SystemDashboard/AbnormalIdentify' ? { padding: 0 } : {}
      // }
      onCancel={onCancel}
    >
      {/* <div className={styles.PageWrapper}> */}
      <Row gutter={[0, 16]} style={{ height: 380, marginTop: 8 }}>
        <Col span={8} style={{ height: '100%' }}>
          <Card
            loading={loading}
            style={{
              height: '100%',
              // display: 'flex',
              // flexDirection: 'column',
              marginRight: 8,
            }}
            bodyStyle={{ padding: '10px 24px', height: 'calc(100% - 41px)' }}
            title={<div className="innerCardTitle">异常问题分布图</div>}
            extra={
              <Radio.Group
                size="small"
                onChange={e => {
                  setDataType(e.target.value);
                }}
                defaultValue="nums"
              >
                <Radio.Button value="nums">异常次数</Radio.Button>
                <Radio.Button value="hours">异常时长</Radio.Button>
              </Radio.Group>
            }
          >
            <ReactEcharts
              option={getOption()}
              style={{ height: 'calc(100%)' }}
              className="echarts-for-echarts"
              theme="my_theme"
            />
          </Card>
        </Col>
        <Col span={16} style={{ height: '100%' }}>
          <Card
            loading={loading}
            style={{
              height: '100%',
              marginRight: 8,
            }}
            bodyStyle={{ padding: '10px 24px', height: 'calc(100% - 41px)' }}
            title={<div className="innerCardTitle">异常问题分布</div>}
          >
            <SdlTable
              size="small"
              align="center"
              columns={getColumns()}
              dataSource={dataSource}
              pagination={false}
              scroll={{ y: '260px' }}
            />
          </Card>
        </Col>
      </Row>
      <Card
        style={{ marginTop: 8 }}
        loading={loading}
        bodyStyle={{ padding: '10px 24px' }}
        title={<div className="innerCardTitle">排口异常问题详情</div>}
      >
        <SdlTable
          align="center"
          columns={getColumns2()}
          dataSource={dataSource2}
          pagination={false}
          // scroll={{ y: 'calc(100vh - )' }}
        />
      </Card>
      <CluesListModal open={cluesListModalOpen} onCancel={() => setCluesListModalOpen(false)} />
      {pointCluesModalOpen && (
        <PointCluesStatistics
          open={pointCluesModalOpen}
          onCancel={() => setPointCluesModalOpen(false)}
          data={currentPointData}
          reqParams={reqParams}
          pollutantType={reqParams.pollutantType}
        />
      )}
    </Modal>
  );
};

export default connect(dvaPropsData)(ExceptionProblem);
