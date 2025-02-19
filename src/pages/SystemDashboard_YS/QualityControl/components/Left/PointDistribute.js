import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Card, Row, Col, Space, Button, Form, Modal } from 'antd';
import moment from 'moment';
import SdlTable from '@/components/SdlTable';
import ReactEcharts from 'echarts-for-react';
import RegionList from '@/components/RegionList';
import EntAtmoList from '@/components/EntAtmoList';
import SearchSelect from '@/pages/AutoFormManager/SearchSelect';

const dvaPropsData = ({ loading, AbnormalIdentifyModel }) => ({
  warningForm: AbnormalIdentifyModel.warningForm,
  loading: loading.effects['AbnormalIdentifyModel/GetPointInfoAnalysis'],
});

const PointDistribute = props => {
  const [form] = Form.useForm();

  const { dispatch, loading, title, open, onCancel, reqParams, time, regionCode, entCode } = props;

  const [distributeData, setDistributeData] = useState({
    GongyiPie: [],
    IndusPie: [],
    RegionPie: [],
    TableData: [],
  });

  useEffect(() => {
    getPageData();
  }, []);

  //
  const getPageData = _dataType => {
    let bTime = moment(time[0]).format('YYYY-MM-DD HH:mm:ss');
    let eTime = moment(time[1]).format('YYYY-MM-DD HH:mm:ss');
    let values = form.getFieldsValue();
    dispatch({
      type: 'AbnormalIdentifyModel/GetPointInfoAnalysis',
      payload: {
        ...values,
        // beginTime: bTime,
        // endTime: eTime,
      },
      callback: result => {
        setDistributeData(result);
      },
    });
  };

  const getOption = (chartData, name) => {
    console.log('chartData', chartData);
    let seriesData = chartData.map(item => {
      return {
        value: item.count,
        name: item.key,
      };
    });
    let unit = '个';
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
          name: name,
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
        title: '企业',
        dataIndex: 'ParentName',
        key: 'ParentName',
        ellipsis: true,
      },
      {
        title: '排口',
        dataIndex: 'PointName',
        key: 'PointName',
        ellipsis: true,
      },
      {
        title: '行政区',
        dataIndex: 'RegionName',
        key: 'RegionName',
        ellipsis: true,
      },
      {
        title: '行业',
        dataIndex: 'IndustryTypeName',
        key: 'IndustryTypeName',
        ellipsis: true,
      },
      {
        title: '燃烧工艺',
        dataIndex: 'gongyi',
        key: 'gongyi',
        ellipsis: true,
      },
    ];
    return columns;
  };
  return (
    <Modal
      // title={title}
      title={'排口分布信息'}
      wrapClassName={'fullScreenModal'}
      destroyOnClose
      open={open}
      footer={false}
      bodyStyle={{ backgroundColor: '#eceef1', padding: 8 }}
      onCancel={onCancel}
    >
      {/* <div className={styles.PageWrapper}> */}
      <Row>
        <Col span={24}>
          <Card size="small">
            <Form
              name="searchForm"
              form={form}
              layout="inline"
              initialValues={{
                RegionCode: regionCode,
                EntCode: entCode,
              }}
              autoComplete="off"
              style={{ marginTop: 10 }}
            >
              <Form.Item label="行政区" name="RegionCode">
                <RegionList noFilter style={{ width: 140 }} />
              </Form.Item>
              <Form.Item label="行业" name="IndustryType">
                <SearchSelect
                  placeholder="排口所属行业"
                  style={{ width: 130 }}
                  configId={'IndustryType'}
                  itemName={'dbo.T_Cod_IndustryType.IndustryTypeName'}
                  itemValue={'dbo.T_Cod_IndustryType.IndustryTypeCode'}
                />
              </Form.Item>
              <Form.Item label="企业" name="EntCode">
                <EntAtmoList regionCode={form.getFieldValue('regionCode')} style={{ width: 200 }} />
              </Form.Item>
              <Form.Item>
                <Space>
                  <Button
                    type="primary"
                    loading={loading}
                    onClick={() => {
                      getPageData();
                    }}
                  >
                    查询
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
      <Row gutter={[0, 16]} style={{ height: 380, marginTop: 8 }}>
        <Col span={8} style={{ height: '100%' }}>
          <Card
            loading={loading}
            style={{
              height: '100%',
              marginRight: 8,
            }}
            bodyStyle={{ padding: '10px 24px', height: 'calc(100% - 58px)' }}
            title={<div className="innerCardTitle">区域排口分布情况</div>}
          >
            <ReactEcharts
              option={getOption(distributeData.RegionPie, '区域排口分布情况')}
              style={{ height: 'calc(100%)' }}
              className="echarts-for-echarts"
              theme="my_theme"
            />
          </Card>
        </Col>
        <Col span={8} style={{ height: '100%' }}>
          <Card
            loading={loading}
            style={{
              height: '100%',
              marginRight: 8,
            }}
            bodyStyle={{ padding: '10px 24px', height: 'calc(100% - 58px)' }}
            title={<div className="innerCardTitle">行业排口分布情况</div>}
          >
            <ReactEcharts
              option={getOption(distributeData.IndusPie, '行业排口分布情况')}
              style={{ height: 'calc(100%)' }}
              className="echarts-for-echarts"
              theme="my_theme"
            />
          </Card>
        </Col>
        <Col span={8} style={{ height: '100%' }}>
          <Card
            loading={loading}
            style={{
              height: '100%',
            }}
            bodyStyle={{ padding: '10px 24px', height: 'calc(100% - 58px)' }}
            title={<div className="innerCardTitle">燃烧工艺排口数量分布</div>}
          >
            <ReactEcharts
              option={getOption(distributeData.GongyiPie, '燃烧工艺排口数量分布')}
              style={{ height: 'calc(100%)' }}
              className="echarts-for-echarts"
              theme="my_theme"
            />
          </Card>
        </Col>
      </Row>
      <Card
        style={{ marginTop: 8 }}
        loading={loading}
        bodyStyle={{ padding: '10px 24px' }}
        title={<div className="innerCardTitle">排口信息</div>}
      >
        <SdlTable
          align="center"
          columns={getColumns()}
          dataSource={distributeData.TableData}
          pagination={false}
          // scroll={{ y: 'calc(100vh - )' }}
        />
      </Card>
    </Modal>
  );
};

export default connect(dvaPropsData)(PointDistribute);
