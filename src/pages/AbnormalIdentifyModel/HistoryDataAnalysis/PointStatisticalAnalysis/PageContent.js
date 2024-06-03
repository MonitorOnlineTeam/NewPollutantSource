/*
 * @Author: JiaQi
 * @Date: 2024-01-18 14:30:07
 * @Last Modified by: JiaQi
 * @Last Modified time: 2024-04-24 18:27:18
 * @Description:  历史数据综合评价/统计分析页面
 */
import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import {
  Card,
  Descriptions,
  Select,
  Row,
  Col,
  DatePicker,
  Space,
  Button,
  Statistic,
  Progress,
} from 'antd';
import styles from '../../styles.less';
import moment from 'moment';
import SdlTable from '@/components/SdlTable';
import { getModelGuidsByBaseTypeCode, handleHomeDate } from '@/pages/AbnormalIdentifyModel/CONST';
import WarningTableData from '@/pages/AbnormalIdentifyModel/Home/ModalPage/WarningTableData';
import { isArray } from 'lodash';

const style_center = {
  textAlign: 'center',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

const dvaPropsData = ({ loading, AbnormalIdentifyModel }) => ({
  // todoList: wordSupervision.todoList,
  warningForm: AbnormalIdentifyModel.warningForm,
  loading: loading.effects['AbnormalIdentifyModel/GetHistoricalDataEvaluation'],
});

const PointStatisticalAnalysis = props => {
  const { dispatch, pageTitle, entCode, DGIMN, loading, warningForm } = props;
  const [date, setDate] = useState(moment()); // 时间
  const [pointInfo, setPointInfo] = useState({}); // 排口信息
  const [dataSource, setDataSource] = useState([]);
  const [statisticalData, setStatisticalData] = useState({});
  const [dataType, setDataType] = useState('1');
  const [quotaType, setQuotaType] = useState(); // 查询数据类型
  const [isShowCluesList, setIsShowCluesList] = useState(); // 是否显示线索列表
  const [modalTitle, setModalTitle] = useState();
  const [modelList, setModelList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTime, setModalTime] = useState();

  useEffect(() => {
    loadData();
    GetModelList();
  }, [DGIMN]);

  // 获取数据模型列表
  const GetModelList = () => {
    dispatch({
      type: 'AbnormalIdentifyModel/GetModelList',
      payload: {
        type: 1, // 过滤掉打标记和数据现象
      },
      callback: modelList => {
        setModelList(modelList);
      },
    });
  };

  //
  const loadData = () => {
    let range = '';
    switch (dataType) {
      case '1':
        range = 'year';
        break;
      case '2':
        range = 'quarter';
        break;
      case '3':
        range = 'month';
        break;
    }

    let bTime = moment(date).startOf(range);

    let eTime = moment(date).endOf(range);

    setModalTime([bTime, eTime]);

    dispatch({
      type: 'AbnormalIdentifyModel/GetHistoricalDataEvaluation',
      payload: {
        dgimn: DGIMN,
        bTime: bTime.format('YYYY-MM-DD HH:mm:ss'),
        eTime: eTime.format('YYYY-MM-DD HH:mm:ss'),
        dateType: dataType,
      },
      callback: res => {
        setPointInfo(res.PointInfo);
        setDataSource(res.Discharge);
        setStatisticalData(res.StatisticalRate.length ? res.StatisticalRate[0] : {});
      },
    });
  };

  const getColumns = () => {
    const columns = [
      {
        title: '企业',
        dataIndex: 'EntName',
        key: 'EntName',
      },
      {
        title: '排口',
        dataIndex: 'PointName',
        key: 'PointName',
      },
      {
        title: '时间',
        dataIndex: 'TimeString',
        key: 'TimeString',
      },
      {
        title: '烟尘排放量(kg)',
        dataIndex: 'Yanchen',
        key: 'Yanchen',
      },
      {
        title: 'SO2排放量(kg)',
        dataIndex: 'SO2',
        key: 'SO2',
      },
      {
        title: 'NOx排放量(kg)',
        dataIndex: 'NOX',
        key: 'NOX',
      },
    ];
    return columns;
  };

  // 小数数点击事件 - 打开数据工况表格
  const onHourNumClick = (quotaType, title, isShowCluesList) => {
    debugger;
    setQuotaType(quotaType);
    setModalTitle(title);
    setIsShowCluesList(isShowCluesList);
    setIsModalOpen(true);
  };

  // 更新异常线索清单model状态
  const updateCluesListFormState = type => {
    let warningTypeCode = [];
    if (isArray(type)) {
      // 合并数组，数据异常小时数包括：人为干预和故障
      warningTypeCode = getModelGuidsByBaseTypeCode(modelList, type[0]).concat(
        getModelGuidsByBaseTypeCode(modelList, type[1]),
      );
    } else {
      warningTypeCode = getModelGuidsByBaseTypeCode(modelList, type);
    }

    let params = {
      date: [],
      date1: [modalTime[0], modalTime[1]],
      regionCode: undefined,
      warningTypeCode: warningTypeCode,
      PollutantCode: '',
      pageSize: 20,
      pageIndex: 1,
      EntCode: entCode,
      DGIMN: DGIMN,
    };

    // 进入线索列表，传入时间、场景类型、企业、污染物
    dispatch({
      type: 'AbnormalIdentifyModel/updateState',
      payload: {
        warningForm: {
          ...warningForm,
          all: {
            ...warningForm['all'],
            rowKey: undefined,
            scrollTop: 0,
            ...params,
          },
        },
      },
    });
  };

  return (
    <div className={styles.PageWrapper}>
      <Card title={pageTitle}>
        <Descriptions column={4}>
          <Descriptions.Item label="企业">{pointInfo.ParentName}</Descriptions.Item>
          <Descriptions.Item label="站点名称">{pointInfo.PointName}</Descriptions.Item>
          <Descriptions.Item label="所属行业">
            {pointInfo.IndustryTypeCode || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="编号">{pointInfo.DGIMN}</Descriptions.Item>
          <Descriptions.Item label="设备类型">{'废气'}</Descriptions.Item>
          <Descriptions.Item label="行政区划">
            {pointInfo.ParentRegionCode || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="地址">{pointInfo.EntAddress || '-'}</Descriptions.Item>
        </Descriptions>
        <Row style={{ lineHeight: '32px', marginTop: 4, marginBottom: 10 }}>
          <label>选择日期：</label>
          <Space>
            <Select
              defaultValue={dataType}
              style={{ width: 60 }}
              onChange={value => {
                setDataType(value);
              }}
              options={[
                {
                  value: '1',
                  label: '年',
                },
                {
                  value: '2',
                  label: '季',
                },
                {
                  value: '3',
                  label: '月',
                },
              ]}
            />
            <DatePicker
              value={date}
              onChange={(value, dataString) => {
                setDate(value);
              }}
              picker={dataType === '1' ? 'year' : dataType === '2' ? 'quarter' : 'month'}
              allowClear={false}
            />
            <Button type="primary" onClick={loadData} loading={loading}>
              查询
            </Button>
          </Space>
        </Row>
      </Card>
      {/* 监测数据质量评价 */}
      <Card
        loading={loading}
        style={{ marginTop: 10 }}
        bodyStyle={{ padding: '10px 24px' }}
        title={<div className="innerCardTitle">监测数据质量评价</div>}
      >
        <Row gutter={16}>
          <Col span={9}>
            <Card>
              <Row>
                <Col
                  span={8}
                  onClick={() => {
                    onHourNumClick('ExceptionHour', '异常数据小时数', true);
                    updateCluesListFormState(['1', '2']);
                  }}
                >
                  <Statistic
                    title="异常数据小时数"
                    value={statisticalData.ExceptionHour}
                    valueStyle={{
                      color: '#1890ff',
                      cursor: 'pointer',
                    }}
                  />
                </Col>
                <Col
                  span={8}
                  onClick={() => {
                    onHourNumClick('NormalMissHour', '缺失小时数', true);
                    updateCluesListFormState('4');
                  }}
                >
                  <Statistic
                    title="缺失小时数"
                    value={statisticalData.MissHour}
                    valueStyle={{
                      color: '#1890ff',
                      cursor: 'pointer',
                    }}
                  />
                </Col>
                <Col
                  span={8}
                  onClick={() => {
                    onHourNumClick('DefendHour', '维护数据小时数');
                  }}
                >
                  <Statistic
                    title="维护数据小时数"
                    value={statisticalData.DefendHour}
                    valueStyle={{
                      color: '#1890ff',
                      cursor: 'pointer',
                    }}
                  />
                </Col>
              </Row>
            </Card>
          </Col>
          <Col span={5}>
            <Card bodyStyle={{ padding: '0 24px' }}>
              <Row>
                <Col span={10}>
                  <Statistic
                    style={{ padding: '24px 0' }}
                    title="设备维护量"
                    value={statisticalData.EquipmentMaintenanceRate}
                    suffix="%"
                  />
                </Col>
                <Col span={14} style={style_center}>
                  <Progress
                    type="circle"
                    percent={statisticalData.EquipmentMaintenanceRate}
                    width={90}
                    strokeWidth={16}
                    format={percent => ``}
                  />
                </Col>
              </Row>
            </Card>
          </Col>
          <Col span={5}>
            <Card bodyStyle={{ padding: '0 24px' }}>
              <Row>
                <Col span={10}>
                  <Statistic
                    style={{ padding: '24px 0' }}
                    title="数据有效率"
                    value={statisticalData.DataEfficiency}
                    suffix="%"
                  />
                </Col>
                <Col span={14} style={style_center}>
                  <Progress
                    type="circle"
                    percent={statisticalData.DataEfficiency}
                    width={90}
                    strokeWidth={16}
                    format={percent => ``}
                  />
                </Col>
              </Row>
            </Card>
          </Col>
          <Col span={5}>
            <Card bodyStyle={{ padding: '0 24px' }}>
              <Row>
                <Col span={10}>
                  <Statistic
                    style={{ padding: '24px 0' }}
                    title="CEMS故障率"
                    value={statisticalData.CEMSFailureRate}
                    suffix="%"
                  />
                </Col>
                <Col span={14} style={style_center}>
                  <Progress
                    type="circle"
                    percent={statisticalData.CEMSFailureRate}
                    width={90}
                    strokeWidth={16}
                    format={percent => ``}
                  />
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </Card>
      {/* 运行情况统计评价 */}
      <Card
        loading={loading}
        style={{ marginTop: 10 }}
        bodyStyle={{ padding: '10px 24px' }}
        title={<div className="innerCardTitle">运行情况统计评价</div>}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Card>
              <Row>
                <Col span={5}>
                  <Statistic title="排放源运行小时数" value={statisticalData.RunHour} />
                </Col>
                <Col span={5}>
                  <Statistic title="停运小时数" value={statisticalData.StopHour} />
                </Col>
                <Col span={4}>
                  <Statistic title="停运次数" value={statisticalData.StopNum} />
                </Col>
                <Col span={5}>
                  <Statistic title="总时长" value={statisticalData.TotalHour} />
                </Col>
                <Col
                  span={5}
                  onClick={() => {
                    onHourNumClick('DefendHour', '维护数据小时数');
                  }}
                >
                  <Statistic
                    title="超标小时数"
                    value={statisticalData.OverHour}
                    valueStyle={{
                      color: '#1890ff',
                      cursor: 'pointer',
                    }}
                  />
                </Col>
              </Row>
            </Card>
          </Col>
          <Col span={6}>
            <Card bodyStyle={{ padding: '0 24px' }}>
              <Row>
                <Col span={10}>
                  <Statistic
                    style={{ padding: '24px 0' }}
                    title="排放源运行率"
                    value={statisticalData.EmissionSourceOperatingRate}
                    suffix="%"
                  />
                </Col>
                <Col span={14} style={style_center}>
                  <Progress
                    type="circle"
                    percent={statisticalData.EmissionSourceOperatingRate}
                    width={90}
                    strokeWidth={16}
                    format={percent => ``}
                  />
                </Col>
              </Row>
            </Card>
          </Col>
          <Col span={6}>
            <Card bodyStyle={{ padding: '0 24px' }}>
              <Row>
                <Col span={10}>
                  <Statistic
                    style={{ padding: '24px 0' }}
                    title="超标率"
                    value={statisticalData.OverRate}
                    suffix="%"
                  />
                </Col>
                <Col span={14} style={style_center}>
                  <Progress
                    type="circle"
                    percent={statisticalData.OverRate}
                    width={90}
                    strokeWidth={16}
                    format={percent => ``}
                  />
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
        <Card title="排放总量统计" size="small" bordered={false} style={{ marginTop: 20 }}>
          <SdlTable columns={getColumns()} dataSource={dataSource} pagination={false} />
        </Card>
      </Card>
      {isModalOpen && (
        <WarningTableData
          open={isModalOpen}
          DGIMN={DGIMN}
          quotaType={quotaType}
          date={modalTime}
          title={modalTitle}
          isShowCluesList={isShowCluesList}
          onCancel={() => {
            setIsModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default connect(dvaPropsData)(PointStatisticalAnalysis);
