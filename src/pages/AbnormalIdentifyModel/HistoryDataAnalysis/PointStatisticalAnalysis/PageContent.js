/*
 * @Author: JiaQi
 * @Date: 2024-01-18 14:30:07
 * @Last Modified by: JiaQi
 * @Last Modified time: 2024-01-18 14:31:46
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

const style_center = {
  textAlign: 'center',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

const dvaPropsData = ({ loading, wordSupervision }) => ({
  // todoList: wordSupervision.todoList,
  loading: loading.effects['AbnormalIdentifyModel/GetHistoricalDataEvaluation'],
});

const PointStatisticalAnalysis = props => {
  const { dispatch, pageTitle, DGIMN, loading } = props;
  const [date, setDate] = useState(moment()); // 时间
  const [pointInfo, setPointInfo] = useState({}); // 排口信息
  const [dataSource, setDataSource] = useState([]);
  const [statisticalData, setStatisticalData] = useState({});
  const [dataType, setDataType] = useState('1');

  useEffect(() => {
    loadData();
  }, [DGIMN]);

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

    dispatch({
      type: 'AbnormalIdentifyModel/GetHistoricalDataEvaluation',
      payload: {
        dgimn: DGIMN,
        bTime: moment(date)
          .startOf(range)
          .format('YYYY-MM-DD HH:mm:ss'),
        eTime: moment(date)
          .endOf(range)
          .format('YYYY-MM-DD HH:mm:ss'),
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

  return (
    <div className={styles.PageWrapper}>
      <Card title={pageTitle}>
        <Descriptions column={4}>
          <Descriptions.Item label="站点名称">{pointInfo.PointName}</Descriptions.Item>
          <Descriptions.Item label="企业">{pointInfo.ParentName}</Descriptions.Item>
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
                <Col span={8}>
                  <Statistic title="异常数据小时数" value={statisticalData.ExceptionHour} />
                </Col>
                <Col span={8}>
                  <Statistic title="缺失小时数" value={statisticalData.MissHour} />
                </Col>
                <Col span={8}>
                  <Statistic title="维护数据小时数" value={statisticalData.DefendHour} />
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
                <Col span={6}>
                  <Statistic title="排放源运行小时数" value={statisticalData.RunHour} />
                </Col>
                <Col span={6}>
                  <Statistic title="停运小时数" value={statisticalData.StopHour} />
                </Col>
                <Col span={6}>
                  <Statistic title="总时长" value={statisticalData.TotalHour} />
                </Col>
                <Col span={6}>
                  <Statistic title="超标小时数" value={statisticalData.OverHour} />
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
    </div>
  );
};

export default connect(dvaPropsData)(PointStatisticalAnalysis);
