/*
 * @Author: jab
 * @Date: 2024-02-01
 * @Description：排污缺口
 */

import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Form, Card, Spin, Button, Space, Select, DatePicker,Pagination, Col, Input, Radio, Modal, Row, message, Popover, Table, Collapse, Cascader, Upload } from 'antd';
import { PlusOutlined, UpOutlined, DownOutlined, ExportOutlined } from '@ant-design/icons';
import styles from '../../styles.less';
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper';
import SdlTable from '@/components/SdlTable';
import moment from 'moment';
import RangePicker_ from '@/components/RangePicker/NewRangePicker';
import RegionList from '@/components/RegionList';
import EntAtmoList from '@/components/EntAtmoList';


const dvaPropsData = ({ loading, AbnormalIdentifyModel }) => ({
    queryLoading: loading.effects['AbnormalIdentifyModel/GetPollutionDischargeGap'],
    pointListLoading: loading.effects['common/getPointByEntCode'],
    entListLoading: loading.effects['common/GetEntByRegion'],
    queryPar: AbnormalIdentifyModel.pollutantDischargeGapQuery,
    exportLoading: loading.effects['AbnormalIdentifyModel/ExportPollutionDischargeGap'],
});

const Index = props => {
    const [form] = Form.useForm();


    const {
        dispatch,
        queryLoading,
        pointListLoading,
        entListLoading,
        exportLoading,
        queryPar
    } = props;
    const [pointList, setPointList] = useState([]);
    const [dataSource, setDataSource] = useState([]);
    const [total, setTotal] = useState(0);
    const quarter = [1, 2, 3, 4]
    const quarterText = { 1: '一', 2: '二', 3: '三', 4: '四' }
    const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11, 12]
    const [type, setType] = useState('1')
    useEffect(() => {
        onTableChange(1, 20)

    }, [type]);
    const renderContent = (text, record, ) => {
        let obj = {
            children: <div style={{ whiteSpace: 'pre-wrap' }}>{text}</div>,
            props: { rowSpan: record.Count },
        };
        return obj;
    }
    const commonCol = [
        {
            title: '企业',
            dataIndex: 'EntName',
            key: 'EntName',
            width: 200,
            ellipsis: true,
            render: renderContent,
        },
        {
            title: '排口',
            dataIndex: 'PointName',
            key: 'PointName',
            width: 200,
            ellipsis: true,
        },
    ]
    const getColumns = () => {
        const yearValue = queryPar&&queryPar.bTime? moment(queryPar.bTime).format('YYYY') : moment().format('YYYY')
        if( type == 1){
          return [
              ...commonCol,
              {
                title: `${yearValue}年度排放总量`,
                children: [
                    {
                        title: '烟尘排放量',
                        dataIndex: 'YCDischarge',
                        key: 'YCDischarge',
                        align: 'center',
                        width: 150,
                        ellipsis: true,
                    },
                    {
                        title: '烟尘排污许可证',
                        dataIndex: 'YCPD',
                        key: 'YCPD',
                        align: 'center',
                        width: 150,
                        ellipsis: true,
                        render: renderContent,
                    },
                    {
                        title: '烟尘排污缺口',
                        dataIndex: 'YCPDQ',
                        key: 'YCPDQ',
                        align: 'center',
                        width: 150,
                        ellipsis: true,
                        render: renderContent,
                    },
                    {
                        title: 'SO2排放量',
                        dataIndex: 'SO2Discharge',
                        key: 'SO2Discharge',
                        align: 'center',
                        width: 150,
                        ellipsis: true,
                    },
                    {
                        title: 'SO2排污许可证量',
                        dataIndex: 'SO2PD',
                        key: 'SO2PD',
                        align: 'center',
                        width: 150,
                        ellipsis: true,
                        render: renderContent,
                    },
                    {
                        title: 'SO2排污缺口',
                        dataIndex: 'SO2PDQ',
                        key: 'SO2PDQ',
                        align: 'center',
                        width: 150,
                        ellipsis: true,
                        render: renderContent,
                    },
                    {
                        title: 'NOx排放量',
                        dataIndex: 'NOXDischarge',
                        key: 'NOXDischarge',
                        align: 'center',
                        width: 150,
                        ellipsis: true,
                    },
                    {
                        title: 'NOx排污许可证量',
                        dataIndex: 'NOXPD',
                        key: 'NOXPD',
                        align: 'center',
                        width: 150,
                        ellipsis: true,
                        render: renderContent,
                    },
                    {
                        title: 'NOx排污缺口',
                        dataIndex: 'NOXPDQ',
                        key: 'NOXPDQ',
                        align: 'center',
                        width: 150,
                        ellipsis: true,
                        render: renderContent,
                    },
                ]
            } 
           ]
          }  else if(type==2){
            return [
                ...commonCol,
                ...quarter.map(item => {
                    return {
                    title: `第${quarterText[item]}季度排放总量（kg）`,
                    children: [
                        {
                            title: '烟尘',
                            dataIndex: `YCDischarge${item}`,
                            key: `YCDischarge${item}`,
                            align: 'center',
                            width: 150,
                            ellipsis: true,
                        },
                        {
                            title: 'SO2',
                            dataIndex: `SO2Discharge${item}`,
                            key: `SO2Discharge${item}`,
                            align: 'center',
                            width: 150,
                            ellipsis: true,
                        },
                        {
                            title: 'NOx',
                            dataIndex: `NOXDischarge${item}`,
                            key: `NOXDischarge${item}`,
                            align: 'center',
                            width: 150,
                            ellipsis: true,
                        },
                    ]
                }
                })
            ]
        }else{
        return [
           ...commonCol,
           ...months.map(item => ({
            title: `${item}月排放总量`,
            children: [
                {
                    title: '烟尘',
                    dataIndex: `YCDischarge${item}`,
                    key: `YCDischarge${item}`,
                    align: 'center',
                    width: 150,
                    ellipsis: true,
                },
                {
                    title: 'SO2',
                    dataIndex:  `SO2Discharge${item}`,
                    key:  `SO2Discharge${item}`,
                    align: 'center',
                    width: 150,
                    ellipsis: true,
                },
                {
                    title: 'NOx',
                    dataIndex: `NOXDischarge${item}`,
                    key: `NOXDischarge${item}`,
                    align: 'center',
                    width: 150,
                    ellipsis: true,
                },
            ]
        }))
             
        ];
    }
    };


    // 查询数据
    const onFinish = (pageIndex, pageSize) => {
        const values = form.getFieldsValue();
        props.dispatch({
            type: 'AbnormalIdentifyModel/GetPollutionDischargeGap',
            payload: {
                ...values,
                date: undefined,
                bTime: values.date ? values.date.format('YYYY-01-01 00:00:00') : undefined,
                eTime: values.date ? values.date.endOf('year').format('YYYY-MM-DD 23:59:59') : undefined,
                pageIndex: pageIndex,
                pageSize: pageSize
            },
            callback: res => {
                setDataSource(res.Datas);
                setTotal(res.Total);
            },
        });
    };


    // 分页
    const [pageIndex, setPageIndex] = useState(1)
    const [pageSize, setPageSize] = useState(20)
    const onTableChange = (current, pageSize) => {
        setPageIndex(current)
        setPageSize(pageSize)
        onFinish(current, pageSize);
    };

    const exportReport = () => {
        
        dispatch({
            type: 'AbnormalIdentifyModel/ExportPollutionDischargeGap',
            payload: {
                ...queryPar,
            },
            callback: res => {
            },
        });
    }

    // 根据企业获取排口
    const getPointList = (EntCode, callback) => {
        dispatch({
            type: 'common/getPointByEntCode',
            payload: {
                EntCode,
            },
            callback: res => {
                setPointList(res);
                callback && callback()
            },
        });
    };


    return (<div className={styles.pollutantDischargeGapWrapper}>
        <BreadcrumbWrapper>
            <Card style={{ paddingBottom: 24 }} title={
                <Form
                    name="basic3"
                    form={form}
                    initialValues={{
                        date: moment(),
                        dateType: "1",
                    }}
                >
                    <Row justify='space-between'>
                   <Row>
                    <Form.Item label="日期" name="date">
                        <DatePicker picker="year" allowClear={false}/>
                    </Form.Item>
                    {/* <Form.Item label="行政区" name="regionCode">
                        <RegionList style={{ width: 140 }} />
                    </Form.Item> */}
                    <Spin spinning={!!entListLoading} size="small" style={{ background: '#fff' }}>
                        <Form.Item label="企业" name="entCode">
                            <EntAtmoList

                                style={{ width: 200 }}
                                onChange={value => {
                                    if (!value) {
                                        form.setFieldsValue({ DGIMN: undefined });
                                    } else {
                                        form.setFieldsValue({ DGIMN: undefined });
                                        getPointList(value);
                                    }
                                }}
                            />
                        </Form.Item>
                    </Spin>
                    <Spin spinning={!!pointListLoading} size="small">
                        <Form.Item label="监测点名称" name="dgimn">
                            <Select
                                placeholder="请选择"
                                showSearch
                                allowClear
                                optionFilterProp="children"
                                style={{ width: 150 }}
                            >
                                {pointList.map(item => {
                                    return (
                                        <Option key={item.DGIMN} value={item.DGIMN}>
                                            {item.PointName}
                                        </Option>
                                    );
                                })}
                            </Select>
                        </Form.Item>
                    </Spin>
                    <Form.Item>
                        <Space>
                            <Button
                                type="primary"
                                loading={queryLoading}
                                onClick={() => {
                                    onTableChange(1, 20);
                                }}
                            >
                                查询
              </Button>
                            <Button loading={exportLoading} onClick={exportReport}>
                                <ExportOutlined />
                      导出
                    </Button>
                        </Space>
                    </Form.Item>
                    </Row>
                    <Form.Item name='dateType'  style={{marginRight:0}}>
                        <Radio.Group buttonStyle="solid" onChange={(e) => {
                            setType(e.target?.value)
                        }}>
                            <Radio.Button value="1">年度</Radio.Button>
                            <Radio.Button value="2">季度</Radio.Button>
                            <Radio.Button value="3">月度</Radio.Button>
                        </Radio.Group>
                    </Form.Item>
                    </Row>
                </Form>
            }>
                <SdlTable
                    rowKey={(record, index) => `${index}`}
                    align="center"
                    columns={getColumns()}
                    dataSource={dataSource}
                    loading={queryLoading}
                    rowClassName={null}
                    pagination={false}
                />
                {total && total > 0 ? <div style={{ textAlign: 'right', marginTop: 12 }}>
                    <Pagination
                        showSizeChanger
                        total={total}
                        current={pageIndex}
                        pageSize={pageSize}
                        onChange={onTableChange}
                        pageSizeOptions={[10,20,50,100]}
                        size='small'
                    />
                </div> : null}
            </Card>
        </BreadcrumbWrapper>
        </div>
    );
};

export default connect(dvaPropsData)(Index);
