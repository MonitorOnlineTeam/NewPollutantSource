/**
 * 功  能：异常买模型识别 模型库管理  数据接入
 * 创建人：jab
 * 创建时间：2024.06
 */
import React, { useState, useEffect, Fragment } from 'react';
import { Table, Input, InputNumber, Popconfirm, Spin, Form, Typography, Badge, Card, Button, Select, message, Row, Col, Tooltip, Divider, Modal, DatePicker } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined, UpOutlined, DownOutlined, ExportOutlined, ProfileOutlined, AmazonCircleFilled, } from '@ant-design/icons';
import { connect } from "dva";
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
const { RangePicker } = DatePicker;
import { DelIcon, DetailIcon, EditIcon, PointIcon } from '@/utils/icon'
import router from 'umi/router';
import Link from 'umi/link';
import moment from 'moment';
import RegionList from '@/components/RegionList'
import SdlCascader from '@/pages/AutoFormManager/SdlCascader'
import styles from "../../styles.less"
import Cookie from 'js-cookie';
import RangePicker_ from '@/components/RangePicker/NewRangePicker';
const { Option } = Select;

const namespace = 'ModelBaseManage'



const dvaPropsData = ({ loading, ModelBaseManage, global, }) => ({
    configInfo: global.configInfo,
})

const Index = (props) => {



    const [form] = Form.useForm();


    const [tableDatas, setTableDatas] = useState([])
    const [tableLoading, setTableLoading] = useState(true)
    const [tableDatas2, setTableDatas2] = useState([])
    const [tableLoading2, setTableLoading2] = useState(true)
    const [tableDatas3, setTableDatas3] = useState([])
    const [tableLoading3, setTableLoading3] = useState(true)
    const [tableDatas4, setTableDatas4] = useState([])
    const [tableLoading4, setTableLoading4] = useState(true)
    const [tableDatas5, setTableDatas5] = useState([])
    const [tableLoading5, setTableLoading5] = useState(true)
    const [tableDatas6, setTableDatas6] = useState([])
    const [tableLoading6, setTableLoading6] = useState(true)

    const sumData = (array,key) =>{
        return array?.[0]? array.reduce((accumulator, currentValue) => {
            return accumulator + currentValue[key];
        }, 0) : 0
       }
    const obj1 = {
        '企业信息清洗': { time: tableDatas?.[0]?.cleanTime, numData: [{ label: '清洗企业数量', value: sumData(tableDatas,'successCount') + sumData(tableDatas,'falseCount')  || 0 }, { label: '入库数量', value: sumData(tableDatas,'successCount')  || 0  }], data: tableDatas,loading:tableLoading,taskType:1, logTitle:'企业日志',logUrl: 'GetProjectLogsInfoList' },
        '备案参数': { time: tableDatas3?.[0]?.cleanTime, numData: [{ label: '清洗企业数量', value: sumData(tableDatas3,'successCount') + sumData(tableDatas3,'falseCount') || 0  }, { label: '入库备案参数', value: sumData(tableDatas3,'successCount')  || 0  }, { label: '清洗失败', value: sumData(tableDatas3,'falseCount') }], data: tableDatas3,loading:tableLoading3,taskType:3,logTitle:'备案参数日志',logUrl: 'GetProjectLogsInfoList'  },
        '监测数据': { time: tableDatas6?.[0]?.cleanTime, numData: [{ label: '清洗数据', value: tableDatas6?.successCount || 0  }, { label: '非法', value: tableDatas6?.falseCount || 0  }], data: tableDatas6?.dataList,loading:tableLoading6,taskType:6, },
    }
    const obj2 = {
        '排放口信息清洗': { time: tableDatas2?.cleanTime, numData: [{ label: '清洗排放口数量', value: sumData(tableDatas2,'successCount') + sumData(tableDatas2,'falseCount') || 0  }, { label: '入库排放口数量', value: sumData(tableDatas2,'successCount') || 0  }], data: tableDatas2,loading:tableLoading2,taskType:2,logTitle:'排放口',logUrl: 'GetProjectLogsInfoList' },
        '污染物': { time: tableDatas4?.cleanTime, numData: [{ label: '清洗排放口数量', value: sumData(tableDatas4,'successCount') + sumData(tableDatas4,'falseCount') || 0  }, { label: '入库污染物数量', value: sumData(tableDatas4,'successCount')  || 0  }, { label: '清洗失败', value: sumData(tableDatas4,'falseCount') }], data: tableDatas4,loading:tableLoading4,taskType:4,logTitle:'污染物缺失',logUrl: 'GetMonitorPollutantLogsInfoList' },
        '排放标准': { time: tableDatas5?.[0]?.cleanTime, numData: [{ label: '清洗排放标准数量', value: sumData(tableDatas5,'successCount') + sumData(tableDatas5,'falseCount') || 0  }, { label: '入库排放标准', value: sumData(tableDatas5,'successCount') || 0  }, { label: '清洗失败', value: sumData(tableDatas5,'falseCount') || 0 }], data: tableDatas5,loading:tableLoading5,logTitle:'排放标准缺失',taskType:5,logUrl: 'GetMonitorAlarmLogsInfoList'  },
    }
    useEffect(() => {
        handleChange(1);

    }, []);
    const handleChange = (values) => {  //查询
        props.dispatch({
            type: `${namespace}/GetProjectLogsList`,
            payload: { projectType: values,taskType:1 },
            callback:(result)=>{
                setTableLoading(false)
                if(result.IsSuccess){ setTableDatas(result.Datas) }
            }
        });

        props.dispatch({
            type: `${namespace}/GetProjectLogsList`,
            payload: { projectType: values,taskType:2 },
            callback:(result)=>{
                setTableLoading2(false)
                if(result.IsSuccess){ setTableDatas2(result.Datas) }
            }
        });

        props.dispatch({
            type: `${namespace}/GetProjectLogsList`,
            payload: { projectType: values,taskType:3 },
            callback:(result)=>{
                setTableLoading3(false)
                if(result.IsSuccess){ setTableDatas3(result.Datas) }
            }
        });

        props.dispatch({
            type: `${namespace}/GetMonitorPollutantLogsList`,
            payload: { projectType: values,taskType:4 },
            callback:(result)=>{
                setTableLoading4(false)
                if(result.IsSuccess){ setTableDatas4([result.Datas]) }
            }
        });

        props.dispatch({
            type: `${namespace}/GetMonitorAlarmLogsList`,
            payload: { projectType: values,taskType:5 },
            callback:(result)=>{
                setTableLoading5(false)
                if(result.IsSuccess){ setTableDatas5([result.Datas]) }
            }
        });

        props.dispatch({
            type: `${namespace}/GetHourDataLogsList`,
            payload: { projectType: values,taskType:6 },
            callback:(result)=>{
                setTableLoading6(false)
                if(result.IsSuccess){ setTableDatas6(result.Datas) }
            }
        });


    }



    let columns = (title) => [
        {
            title: '参数类型',
            dataIndex: 'paramName',
            key: 'paramName',
            align: 'center',
            width: 140,
            ellipsis: true,
            render: (text, record) => {
                return  <span style={{cursor:'pointer'}} onClick={() => logQuery(title,{param:text})}>{text}</span>
            }
        },
        {
            title: '清洗成功',
            dataIndex: 'successCount',
            key: 'successCount',
            align: 'center',
            width: 120,
            ellipsis: true,
            render: (text, record) => {
                return  text&&text>0? <span style={{cursor:'pointer'}} onClick={() => logQuery(title,{status:true})}>{text}</span> :text
            }
        },
        {
            title: '清洗异常',
            dataIndex: 'falseCount',
            key: 'falseCount',
            align: 'center',
            width: 120,
            ellipsis: true,
            render: (text, record) => {
                return text > 0 ? <span style={{cursor:'pointer'}} className='red' onClick={() => logQuery(title,{status:false})}>{text}</span> : text
            }
        },
        {
            title: '备注',
            dataIndex: 'remark',
            key: 'remark',
            align: 'center',
            ellipsis: true,
            render: (text, record) => {
                const textArr = text?.split(',')
                return textArr ? <>  {textArr[0]&&<Button  onClick={() => logQuery(title,{remark:textArr[0]})} type='primary'>{textArr[0]}</Button>}    {textArr[1]&&<Button  onClick={() => logQuery(title,{remark:textArr[1]})}  type='primary'>{textArr[1]}</Button>}</> : text
            }
        },
    ];
    let columns2 = [
        {
            title: '企业',
            dataIndex: 'CarNum',
            key: 'CarNum',
            align: 'center',
            ellipsis: true,
        },
        {
            title: '排放口',
            dataIndex: 'VehicleType',
            key: 'VehicleType',
            align: 'center',
            ellipsis: true,
        },
        {
            title: '数据缺失率',
            dataIndex: 'BuyDate',
            key: 'BuyDate',
            align: 'center',
            ellipsis: true,
        },
        {
            title: '缺失数据',
            dataIndex: 'Status',
            key: 'Status',
            align: 'center',
            ellipsis: true,
        },
        {
            title: '应传数据',
            dataIndex: 'Status',
            key: 'Status',
            align: 'center',
            ellipsis: true,
        },
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
            ellipsis: true,
            
        },
    ]
  
    const [logVisible, setLogVisible] = useState(false)
    const [logTitle, setLogTitle] = useState()
    const [logData, setLogData] = useState({})
    const [logLoading, setLogLoading] = useState({})

    const logQuery = (title,par) => {
        setLogVisible(true)
        const objRequest = {
            ...obj1,...obj2
        }
        const logTitle = objRequest[title]?.logTitle
        
        setLogTitle(logTitle)
        setLogLoading({...logLoading,[logTitle]:true})
        const taskType = objRequest[title]?.taskType
        props.dispatch({
            type: `${namespace}/${title=='污染物' || title=='排放标准'?(par.status? objRequest[title]?.logUrl : objRequest[title]?.logUrl) : objRequest[title]?.logUrl}`,
            payload: {projectType: 1,taskType: taskType,...par},
            callback:(result)=>{
                setLogLoading({...logLoading,[logTitle]:false})
                if(result.isSuccess){
                    setLogLoading({...logData,[logTitle]:[result.Datas]})
                }
            }
        });
    }
    const missingDataChange = (value) => {
        console.log(value)
    }


    const typeStyle = { background: '#fafafa', padding: 4, borderRadius: 4, marginRight: 4 }
    const TitleComponents = ({ title, time, numData }) => {
        return <>
            <Row align='middle' justify='space-between'>
                <div style={{ fontSize: 18, fontWeight: 'bold' }}>{title}</div>
                <div>最近清洗时间：{time}</div>
            </Row>
            <Row style={{ margin: '8px 0' }}>
                {
                    numData.map(item => <div style={{ ...typeStyle }} >{item.label} <span style={{ color: item.label === '清洗失败' || item.label === '非法' ? '#f5222d' : '#d4ab32', fontWeight: 'bold', paddingLeft: 12 }}>{item.value}</span></div>)
                }
            </Row>
        </>
    }

    const searchComponents = () => {
        return <Form
            form={form}
            name="advanced_search"
            className={'ant-advanced-search-form'}
            layout='inline'
        >
            <Form.Item label='选择项目'>
                <Select
                    defaultValue="1"
                    style={{ width: 200 }}
                    onChange={handleChange}
                    placeholder='内蒙数据同步'
                    options={[
                        {
                            value: '1',
                            label: '内蒙数据',
                        },
                    ]}
                />
            </Form.Item>
        </Form>
    }

    const dischargeOutletType = [
        { label: '废气排放口', value: 80 || 0 }, { label: '废气非排放口', value: 80  || 0   }, { label: '废水排放口', value: 80 || 0  },
        { label: '废水非排放口', value: 80  || 0 }, { label: '常规焚烧炉CEMS排放口', value: 80 || 0  }, { label: '关联排放口', value: 80 || 0  },
    ]
    const logColObj = {
        '企业日志': logCommonCol.filter(item=>item.title!='排放口') ,
        '排放口': logCommonCol.filter(item=>item.title!='排放口'),data:[] ,
        '备案参数日志': logCommonCol,
        '污染物缺失': logCommonCol.filter(item=>item.title=='企业' || item.title=='排放口'),
        '排放标准缺失': logCommonCol.filter(item=>item.title=='企业' || item.title=='排放口')
    }

    return (
        <div className={`${styles.dataCleaningSty}`}>
            <BreadcrumbWrapper >
                <Card className='queryCriterTitleSty' bodyStyle={{ padding: '8px 24px' }}>{searchComponents()}</Card>
                <Row style={{ marginTop: 12, height: 'calc(100vh - 180px)', overflowY: 'auto' }}>
                    <Col span={12} style={{ paddingRight: 6 }}>
                        {
                            Object.keys(obj1).map(item => {
                                return <Card style={{ marginBottom: 12 }}>
                                    <TitleComponents title={item} time={obj1[item].time} numData={obj1[item].numData} />
                                    {item == '监测数据' && <Row align='middle' style={{ marginBottom: 8 }}><div style={{ paddingRight: 12 }}>数据缺失超过<span><InputNumber style={{ width: 80, margin: '0 4px' }} defaultValue={80 || 0} onChange={missingDataChange} />%</span></div> <div>排放口统计<span>{120 || 0}%</span></div></Row>}
                                    <SdlTable
                                        loading={obj1[item].loading}
                                        bordered
                                        dataSource={obj1[item].data}
                                        columns={item == '监测数据' ? columns2 : columns(obj1[item].logTitle)}
                                        scroll={{ y: 'hidden' }}
                                        rowClassName={null}
                                        pagination={false}
                                    />
                                </Card>
                            })
                        }
                    </Col>
                    <Col span={12} style={{ paddingLeft: 6 }}>
                        {
                            Object.keys(obj2).map(item => {
                                return <Card style={{ marginBottom: 12 }}>
                                    <TitleComponents title={item} time={obj2[item].time} numData={obj2[item].numData} />
                                    {item == '排放口信息清洗' &&
                                        <Row style={{ marginBottom: 8 }}>
                                            {dischargeOutletType.map(item => {
                                                return <div style={{ ...typeStyle, textAlign: 'center' }}>
                                                    <div><Badge color="#fa8c16" text={item.value} /></div>
                                                    <div>{item.label}</div>
                                                </div>
                                            })}

                                        </Row>


                                    }
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
                            })
                        }
                    </Col>
                </Row>
                <Modal
                    visible={logVisible}
                    title={logTitle}
                    onCancel={() => { setLogVisible(false) }}
                    destroyOnClose
                    footer={null}
                    width={700}
                >
                    <SdlTable
                        loading={logLoading[logTitle]}
                        bordered
                        dataSource={logData[logTitle]}
                        columns={logColObj[logTitle]}
                        scroll={{ y: 'hidden' }}
                        rowClassName={null}
                        pagination={false}
                    />
                </Modal>
            </BreadcrumbWrapper>
        </div>
    );
};
export default connect(dvaPropsData)(Index);