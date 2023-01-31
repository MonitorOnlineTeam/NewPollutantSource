/**
 * 功  能：监测数据线性回归分析
 * 创建时间：2023.01.30
 */
import React, { useState, useEffect, Fragment } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form,Empty, Tag, Typography, Card, Button, Select, message, Row, Col, Tooltip, Divider, Modal, DatePicker, Radio, Spin, } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined, UpOutlined, DownOutlined, ExportOutlined } from '@ant-design/icons';
import { connect } from "dva";
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
const { RangePicker } = DatePicker;
import RangePicker_ from '@/components/RangePicker/NewRangePicker';
import { DelIcon, DetailIcon, EditIcon, PointIcon } from '@/utils/icon'
const { Option } = Select;
import moment from 'moment'
const namespace = 'CO2Emissions'
import ReactEcharts from 'echarts-for-react';




const dvaPropsData = ({ loading, CO2Emissions, }) => ({
    entList: CO2Emissions.entList,
    entLoading: loading.effects[`${namespace}/getAllEnterprise`],
    chartDataLoading: loading.effects[`${namespace}/getCO2LinearAnalysisOther`],
    chartDatas: CO2Emissions.monitorLineAnalysisChartData,
})

const dvaDispatch = (dispatch) => {
    return {
        updateState: (payload) => {
            dispatch({
                type: `${namespace}/updateState`,
                payload: payload,
            })
        },
        getAllEnterprise: (payload, callback) => { // 企业
            dispatch({
                type: `${namespace}/getAllEnterprise`,
                payload: payload,
                callback: callback
            })

        },
        getCO2LinearAnalysisOther: (payload) => { //列表
            dispatch({
                type: `${namespace}/getCO2LinearAnalysisOther`,
                payload: payload,
            })
        },
    }
}
const Index = (props) => {

    const [form] = Form.useForm();

    const { entList, entLoading, chartDatas, chartDataLoading, } = props;
    useEffect(() => {
        props.getAllEnterprise({},(data)=>{ 
            data&&data[0]&&form.setFieldsValue({EntCode:data[0].EntCode})
            onFinish();
        })

    }, []);












    const onFinish = async () => {  //查询

        try {
            const values = await form.validateFields();
            props.getCO2LinearAnalysisOther({
                ...values,
                BeginTime: values.Time && moment(values.Time[0]).format('YYYY-MM-DD'),
                EndTime: values.Time && moment(values.Time[1]).format('YYYY-MM-DD'),
                Time:undefined,
            }, () => {
            })
        } catch (errorInfo) {
            console.log('Failed:', errorInfo);
        }
    }




    const getOption = () => {
        const { chartDatas } = props;
        let markLineOpt = {
          animation: false,
          label: {
            formatter: chartDatas.formula,
            align: 'right',
            fontSize: 16,
          },
          lineStyle: {
            type: 'solid'
          },
         itemStyle: {
            color:'#1677ff',
          },
          tooltip: {
            formatter: chartDatas.formula,
          },
          data: [[{
            coord: chartDatas.coordMin,
            symbol: 'none'
          }, {
            coord: chartDatas.coordMax,
            symbol: 'none'
          }]]
        };
    
        let option = {
          itemStyle: {
            color:'#52c41a',
          },
          grid: {
            left: '55px',
            right: '180px',
            bottom: 5,
            containLabel: true
          },
          tooltip: {
            formatter: function (params, ticket, callback) {
              return `直测二氧化碳排放当量:    ${params&&params.value[0]} tCO₂e <br />核算二氧化碳排放当量:    ${params&&params.value[1]} tCO₂e`
            }
          },
          toolbox: {
            show: true,
            feature: {
              dataZoom: {
                yAxisIndex: 'none'
              },
              dataView: { readOnly: false },
              restore: {},
              saveAsImage: {}
            }
          },
          xAxis: [
            { name: `直测二氧化碳排放当量(tCO₂e)`, gridIndex: 0, min: chartDatas.coordMin&&chartDatas.coordMin[0], max: chartDatas.coordMax&&chartDatas.coordMax[0] },
          ],
          yAxis: [
            // { name: `核算排放量(t)`, gridIndex: 0, min: chartDatas.coordMin[1] < 0 ? chartDatas.coordMin[1] - 5 : chartDatas.coordMin[1], max: chartDatas.coordMax[1] + 5 },
            { name: `核算二氧化碳排放当量(tCO₂e)`, gridIndex: 0, min: chartDatas.coordMin&&chartDatas.coordMin[1], max: chartDatas.coordMax&&chartDatas.coordMax[1] },
          ],
          series: [
            {
              name: '直测排放量 核算排放量',
              type: 'scatter',
              xAxisIndex: 0,
              yAxisIndex: 0,
              data: chartDatas.linearData,
              markLine: markLineOpt, //回归线段配置
            },
          ]
        };
    
        return option;
      }
    
    const searchComponents = () => {
        return <Form
            form={form}
            name="advanced_search"
            layout='inline'
            initialValues={{
                Time: [moment(new Date()).add(-30, 'day'), moment(),]
            }}
            //className={styles["ant-advanced-search-form"]}
            onFinish={() => { onFinish() }}
        >
            <Spin spinning={entLoading} size='small'>
             <Form.Item label="企业" name="EntCode" >
                    <Select placeholder='请选择企业名称'  showSearch
                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        style={{ width: 200 }}>
                        {
                            entList && entList[0] && entList.map(item => {
                                return <Option key={item.EntCode} value={item.EntCode}>{item.EntName}</Option>
                            })
                        }
                    </Select>
            </Form.Item>
            </Spin>
            <Form.Item name='Time' label='日期' >
                <RangePicker_ allowClear={false} format='YYYY-MM-DD' style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType='submit' style={{ marginRight: 8 }} loading={chartDataLoading}>
                    查询
            </Button>
            </Form.Item>
        </Form>
    }

    return (
        <div>
            <BreadcrumbWrapper>
                <Card title={searchComponents()}>
                  <Spin spinning={chartDataLoading}>
                        {
                            chartDatas ? <ReactEcharts
                                option={getOption()}
                                lazyUpdate
                                notMerge
                                style={{ width: '100%', height: 'calc(100vh - 260px)', minHeight: '200px', marginTop: 20 }}
                            /> :
                                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                        }
                    </Spin>
                </Card>
            </BreadcrumbWrapper>
        </div>
    );
};
export default connect(dvaPropsData, dvaDispatch)(Index);