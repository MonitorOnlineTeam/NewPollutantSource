/*
 * @Author: JiaQi 
 * @Date: 2023-05-30 14:30:02 
 * @Last Modified by:   JiaQi 
 * @Last Modified time: 2023-05-30 14:30:02 
 * @Description：运维评价报告
 */
import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import {
  Card,
  Form,
  DatePicker,
  Button,
  Space,
  Spin,
  Divider,
  Select,
  Row,
  Col,
  message,
  Table,
} from 'antd';
import moment from 'moment';
import styles from './style.less';
import SdlTable from '@/components/SdlTable';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import RegionList from '@/components/RegionList';
import EntAtmoList from '@/components/EntAtmoList';
import CBBJ from './components/CBBJ';
import YCBJ from './components/YCBJ';
import QSBJ from './components/QSBJ';
import SBYC from './components/SBYC';
import GZXF from './components/GZXF';
import YXCS from './components/YXCS';
import YWQK from './components/YWQK';
import YWPD from './components/YWPD';
import YWTZ from './components/YWTZ';
import HCGH from './components/HCGH';

const { RangePicker } = DatePicker;

const dvaPropsData = ({ loading, common }) => ({
  entLoading: common.noFilterEntLoading,
  exportLoading: loading.effects['OperationReport/exportTaskRecord'],
  tableLoading: loading.effects['OperationReport/GetOperationEvaReportList'],
});

const OperationReport = props => {
  const [form] = Form.useForm();
  const { entLoading, tableLoading, exportLoading, dispatch } = props;
  const [dataSource, setDataSource] = useState([]);
  const [pointList, setPointList] = useState([]);
  const [pointLoading, setPointLoading] = useState(false);
  const [rangeType, setRangeType] = useState('ent');
  const [requestParams, setRequestParams] = useState({});
  const [currentTitleName, setCurrentTitleName] = useState();
  const [reportTitle, setReportTitle] = useState();

  useEffect(() => {
    // onFinish();
  }, []);

  // 查询数据
  const onFinish = async () => {
    const values = await form.validateFields();
    console.log('values', values);
    const requestParams = {
      ...values,
      date: undefined,
      rangeType: undefined,
      DGIMN: values.DGIMN ? values.DGIMN.toString() : undefined,
      beginTime: moment(values.date[0]).format('YYYY-MM-DD HH:mm:ss'),
      endTime: moment(values.date[1]).format('YYYY-MM-DD HH:mm:ss'),
    };
    setRequestParams(requestParams);

    let title = `${currentTitleName} ${values.date[0].format(
      'YYYY-MM-DD',
    )} ~ ${values.date[1].format('YYYY-MM-DD')} 运维报告`;
    setReportTitle(title);
    props.dispatch({
      type: 'OperationReport/GetOperationEvaReportList',
      payload: requestParams,
      callback: res => {
        setDataSource(res);
      },
    });
  };

  // 导出
  const onExport = async () => {
    const values = await form.validateFields();
    const body = getParams(values);
    props.dispatch({
      type: 'wordSupervision/exportTaskRecord',
      payload: {
        ...body,
        apiName: 'ExportOtherWorkList',
      },
    });
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
      type: 'OperationReport/getPointByEntCode',
      payload: {
        EntCode: value,
      },
      callback: res => {
        setPointList(res);
        setPointLoading(false);
        // form.setFieldsValue({ DGIMN: res[0].DGIMN });
      },
    });
  };

  const onValuesChange = (changedValues, allValues) => {
    const fieldName = Object.keys(changedValues).join();
    const value = allValues[fieldName];
    switch (fieldName) {
      case 'rangeType':
        // 统计范围
        setRangeType(value);
        break;
      case 'entCode':
        // 企业
        getPointListByEntCode(value);
        break;
    }

    console.log('allValues', allValues);
  };

  // 获取列头
  const getColumns = () => {
    let columns = [
      {
        title: '序号',
        dataIndex: 'index',
        key: 'index',
        render: (text, record, index) => {
          return index + 1;
        },
      },
      {
        title: '省',
        dataIndex: 'province',
        key: 'province',
      },
      {
        title: '市',
        dataIndex: 'city',
        key: 'city',
      },
      {
        title: '企业',
        dataIndex: 'entName',
        key: 'entName',
        width: 240,
      },
      {
        title: '行业类型',
        dataIndex: 'industryTypeName',
        key: 'industryTypeName',
      },
      {
        title: '监测点名称',
        dataIndex: 'pointName',
        key: 'pointName',
        width: 220,
      },
      {
        title: '排放类型',
        dataIndex: 'pollutantTypeName',
        key: 'pollutantTypeName',
      },
      {
        title: '巡检完成率',
        dataIndex: 'inspectionRate',
        key: 'inspectionRate',
        render: text => {
          return text !== '-' ? text + '%' : text;
        },
      },
      {
        title: '校准完成率',
        dataIndex: 'calibrationRate',
        key: 'calibrationRate',
        render: text => {
          return text !== '-' ? text + '%' : text;
        },
      },
      {
        title: '超标报警核实率',
        dataIndex: 'allRespondedRate',
        key: 'allRespondedRate',
        render: text => {
          return text !== '-' ? text + '%' : text;
        },
      },
      {
        title: '异常报警响应率',
        dataIndex: 'exceptionRate',
        key: 'exceptionRate',
        render: text => {
          return text !== '-' ? text + '%' : text;
        },
      },
      {
        title: '缺失报警响应率',
        dataIndex: 'missRate',
        key: 'missRate',
        render: text => {
          return text !== '-' ? text + '%' : text;
        },
      },
      {
        title: '设备异常率',
        dataIndex: 'deviceExceptionRate',
        key: 'deviceExceptionRate',
        render: text => {
          return text !== '-' ? text + '%' : text;
        },
      },
      {
        title: '故障修复率',
        dataIndex: 'repairRate',
        key: 'repairRate',
        render: text => {
          return text !== '-' ? text + '%' : text;
        },
      },
      {
        title: '有效传输率',
        dataIndex: 'transmissionEffectiveRate',
        key: 'transmissionEffectiveRate',
        render: text => {
          return text !== '-' ? text + '%' : text;
        },
      },
    ];

    return columns;
  };

  return (
    <BreadcrumbWrapper>
      <Card className={styles.OperationReportWrapper}>
        <Form
          name="basic"
          form={form}
          layout="inline"
          style={{ paddingTop: '10px' }}
          initialValues={{
            rangeType: 'ent',
            date: [
              moment()
                .subtract(1, 'month')
                .startOf('day'),
              moment().endOf('day'),
            ],
          }}
          onFinish={onFinish}
          onValuesChange={onValuesChange}
          // autoComplete="off"
        >
          <Form.Item label="统计范围" name="rangeType">
            <Select placeholder="请选择统计范围" style={{ width: 130 }}>
              <Option value={'ent'}>按企业统计</Option>
              <Option value={'region'}>按行政区统计</Option>
            </Select>
          </Form.Item>
          {rangeType === 'ent' ? (
            <>
              <Spin spinning={entLoading} size="small" style={{ top: -3, left: 39 }}>
                <Form.Item
                  label="企业"
                  name="entCode"
                  style={{ marginLeft: 8, marginRight: 8 }}
                  rules={[
                    {
                      required: true,
                      message: '请选择企业',
                    },
                  ]}
                >
                  <EntAtmoList
                    noFilter
                    style={{ width: 300 }}
                    onChange={(value, Option) => {
                      setCurrentTitleName(Option.title);
                    }}
                  />
                </Form.Item>
              </Spin>
              <Spin spinning={pointLoading} size="small" style={{ top: -3, left: 44 }}>
                <Form.Item label="点位名称" name="DGIMN">
                  <Select
                    mode="multiple"
                    placeholder="请选择"
                    showSearch
                    optionFilterProp="children"
                    style={{ width: 200 }}
                    onChange={(value, Option) => {
                      let pointNames = Option.map(item => item.title).toString();
                      setCurrentTitleName(pointNames);
                    }}
                  >
                    {pointList[0] &&
                      pointList.map(item => {
                        return (
                          <Option key={item.DGIMN} value={item.DGIMN} title={item.PointName}>
                            {item.PointName}
                          </Option>
                        );
                      })}
                  </Select>
                </Form.Item>
              </Spin>
            </>
          ) : (
            <Form.Item
              label="行政区"
              name="regionCode"
              rules={[
                {
                  required: true,
                  message: '请选择行政区',
                },
              ]}
            >
              <RegionList
                noFilter
                levelNum={2}
                style={{ width: 150 }}
                onSelect={(value, node, extra) => {
                  console.log('value', value);
                  console.log('node', node);
                  console.log('extra', extra);
                  let ragionName = node.parentTitle ? node.parentTitle + node.title : node.title;
                  setCurrentTitleName(ragionName);
                }}
              />
            </Form.Item>
          )}
          <Form.Item label="统计日期" name="date">
            <RangePicker allowClear={false} />
          </Form.Item>
          <Form.Item label="排放类型" name="pollutantType">
            <Select placeholder="请选择排放类型" style={{ width: 120 }}>
              <Option value={'1'}>废水</Option>
              <Option value={'2'}>废气</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" onClick={() => onFinish()} loading={tableLoading}>
                查询
              </Button>
              <Button loading={exportLoading} onClick={() => onExport()}>
                导出
              </Button>
            </Space>
          </Form.Item>
        </Form>
        {/* <Row style={{ minWidth: 1322 }}> */}
        <h3 className={styles.titleBar}>{reportTitle}</h3>
        <SdlTable
          loading={tableLoading}
          align="center"
          columns={getColumns()}
          dataSource={dataSource}
          scroll={{
            y: 300,
          }}
        />
        {/* </Row> */}
        <div className={styles.statisticWrapper}>
          <Row gutter={10} style={{ marginTop: 10, flexWrap: 'nowrap' }}>
            <Col flex={1}>
              {/* 超标报警核实统计 */}
              <CBBJ requestParams={requestParams} />
            </Col>
            <Col flex={1}>
              {/* 异常报警响应统计 */}
              <YCBJ requestParams={requestParams} />
            </Col>
            <Col flex="360px">
              {/* 缺失报警响应统计 */}
              <QSBJ requestParams={requestParams} />
            </Col>
          </Row>
          <Row gutter={10} style={{ marginTop: 10, flexWrap: 'nowrap' }}>
            <Col flex={1}>
              {/* 设备异常统计 */}
              <SBYC requestParams={requestParams} />
            </Col>
            <Col flex="360px">
              {/* 故障修复率 */}
              <GZXF />
            </Col>
            <Col flex={1}>
              {/* 有效传输率 */}
              <YXCS requestParams={requestParams} />
            </Col>
          </Row>
          <Row gutter={10} style={{ marginTop: 10, flexWrap: 'nowrap' }}>
            <Col flex="420px">
              {/* 运维情况统计 */}
              <YWQK requestParams={requestParams} />
            </Col>
            <Col flex={1}>
              {/* 运维派单次数统计 */}
              <YWPD requestParams={requestParams} />
            </Col>
          </Row>
          <Row gutter={10} style={{ marginTop: 10, flexWrap: 'nowrap' }}>
            <Col flex={1}>
              {/* 运维台账填报数量统计 */}
              <YWTZ requestParams={requestParams} />
            </Col>
            <Col flex="600px">
              {/* 耗材更换 */}
              <HCGH requestParams={requestParams} />
            </Col>
          </Row>
        </div>
      </Card>
    </BreadcrumbWrapper>
  );
};

export default connect(dvaPropsData)(OperationReport);
