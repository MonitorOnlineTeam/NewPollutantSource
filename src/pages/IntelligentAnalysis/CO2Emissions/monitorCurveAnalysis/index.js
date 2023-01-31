/**
 * 功  能：监测数据曲线对比分析
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
    chartDataLoading: loading.effects[`${namespace}/getComparisonOfMonData`],
    chartDatas: CO2Emissions.monitorComparaAnalysisChartData,
    
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
        getComparisonOfMonData: (payload) => { //数据
            dispatch({
                type: `${namespace}/getComparisonOfMonData`,
                payload: payload,
            })
        },
    }
}
const Index = (props) => {

    const [form] = Form.useForm();

    const { entList, entLoading, chartDatas, tableTotal, chartDataLoading, } = props;
    useEffect(() => {
        props.getAllEnterprise({},(data)=>{ 
            data&&data[0]&&form.setFieldsValue({EntCode:data[0].EntCode})
            onFinish();
        })

    }, []);












    const onFinish = async () => {  //查询

        try {
            const values = await form.validateFields();

            props.getComparisonOfMonData({
                ...values,
                BeginTime: values.Time && moment(values.Time[0]).format('YYYY-MM-DD'),
                EndTime: values.Time && moment(values.Time[1]).format('YYYY-MM-DD'),
                Time:undefined,
                type:'echarts',
              
            }, () => {
            })
        } catch (errorInfo) {
            console.log('Failed:', errorInfo);
        }
    }




    const getOption = () => {
        return {
            title: {
                text: "直测及核算碳排放量比对分析图",
                left: 'center',
                top: 0,
                textStyle:{ fontSize:22,} //字体大小,
              },
            color:['#52c41a','#1677ff'],
            xAxis: {
                type: 'category',
                data: chartDatas.lineTime && chartDatas.lineTime,
            },
            yAxis: {
                name: 'kg',
                type: 'value',
            },
            legend: {
                data: ['监测量', '核算量',],
                padding:[40, 0,0,0],
            },
            grid: {
                left: 0,
                right: 0,
                bottom: 0,
                top:60,
                containLabel: true
              },
            series: [
                {
                    name: '监测量',
                    data: chartDatas.lineDis && chartDatas.lineDis,
                    type: 'line',
                    // smooth: true
                },
                {
                    name: '核算量',
                    data: chartDatas.lineAcc && chartDatas.lineAcc,
                    type: 'line',
                    // smooth: true
                },
            ]
        }
    };
    const searchComponents = () => {
        return <Form
            form={form}
            name="advanced_search"
            layout='inline'
            initialValues={{
                Time: [moment(new Date()).add(-30, 'day'), moment(),]
            }}
            //className={styles["ant-advanced-search-form"]}
            onFinish={() => { onFinish() }}>
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
                            chartDatas && Object.keys(chartDatas).length ? <ReactEcharts
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