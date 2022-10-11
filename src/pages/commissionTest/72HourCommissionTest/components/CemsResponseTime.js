/**
 * 功  能：气态污染物CEMS示值误差和系统响应时间检测
 * 创建人：jab
 * 创建时间：2022.09.02
 */
import React, { useState, useEffect, Fragment } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Tag, Typography, TimePicker, Empty, Card, Button, Select, message, Row, Col, Tooltip, Divider, Modal, DatePicker, Radio, Spin, } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined, UpOutlined, DownOutlined, ExportOutlined } from '@ant-design/icons';
import { connect } from "dva";
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
const { RangePicker } = DatePicker;
import { DelIcon, DetailIcon, EditIcon, PointIcon } from '@/utils/icon'
import { getSum, getAve, numVerify, arrDistinctByProp, } from '@/utils/utils'
import router from 'umi/router';
import Link from 'umi/link';
import moment from 'moment';
import RegionList from '@/components/RegionList'
import styles from "../style.less"
import Cookie from 'js-cookie';
import BtnComponents from './BtnComponents'
const { TextArea } = Input;
const { Option } = Select;
import config from '@/config'
import { func } from 'prop-types';
const namespace = 'hourCommissionTest'




const dvaPropsData = ({ loading, hourCommissionTest, commissionTest, }) => ({
    formLoading: loading.effects[`${namespace}/getGasIndicationErrorSystemResponseRecord`],
    pollutantLoading: loading.effects[`${namespace}/get72TestRecordPollutant`],
    delLoading: loading.effects[`${namespace}/deleteGasIndicationErrorSystemResponseRecord`],
})

const dvaDispatch = (dispatch) => {
    return {
        updateState: (payload) => {
            dispatch({
                type: `${namespace}/updateState`,
                payload: payload,
            })
        },
        get72TestRecordPollutant: (payload, callback) => { // 污染物列表
            dispatch({
                type: `${namespace}/get72TestRecordPollutant`,
                payload: payload,
                callback: callback
            })
        },
        getGasIndicationErrorSystemResponseRecord: (payload, callback) => { // 获取
            dispatch({
                type: `${namespace}/getGasIndicationErrorSystemResponseRecord`,
                payload: payload,
                callback: callback
            })
        },
        addGasIndicationErrorSystemResponseRecord: (payload, callback) => { //保存 暂存
            dispatch({
                type: `${namespace}/addGasIndicationErrorSystemResponseRecord`,
                payload: payload,
                callback: callback
            })
        },
        deleteGasIndicationErrorSystemResponseRecord: (payload, callback) => { //删除
            dispatch({
                type: `${namespace}/deleteGasIndicationErrorSystemResponseRecord`,
                payload: payload,
                callback: callback
            })
        },
    }
}
const Index = (props) => {



    const [form] = Form.useForm();


    const [tableDatas1, setTableDatas1] = useState([1, 2, 3, 4, 5, 6,]);
    const [tableDatas2, setTableDatas2] = useState([1, 2, 3,]);

    const { pointId, tableLoading, pollutantLoading, formLoading, } = props;


    const [recordName, setRecordName] = useState()


    const [pollOptions, setPollOptions] = useState([]);
    const [pollutantCode, setPollutantCode] = useState()


    useEffect(() => {
        if (!pointId) { return }
        initData()
    }, [pointId]);
    const initData = () => {

        props.get72TestRecordPollutant({
            PointCode: pointId,
            Flag: '',
        }, (pollData, defaultPollCode) => {
            if (pollData[0]) {
                setPollOptions(pollData)
                setPollutantCode(defaultPollCode)
                getFormData(defaultPollCode);
            }

        })

    }

    const getFormData = (pollCode) => {
        props.getGasIndicationErrorSystemResponseRecord({
            PointCode: pointId,
            PollutantCode: pollCode,
            Flag: "",
            ID: form.getFieldValue('ID'),
        }, (res) => {
            if (res) {
                setRecordName(res.RecordName)

                if (res.MainTable) {
                    form.resetFields();
                    setIsClears(false);

                    if (res.MainTable.RangeCalibration) { //首次获取标称值
                        form.setFieldsValue({ NominalValue: res.MainTable.RangeCalibration, })
                    }
                    form.setFieldsValue({
                        ...res.MainTable,
                        PollutantCode: pollCode,
                        PollutantName: res.MainTable.PollutantName,
                    })


                }
                if (res.ChildTable1 && res.ChildTable1[0]) {
                    const data1 = res.ChildTable1;

                    data1.map(item => {
                        const index = item.Sort;
                        form.setFieldsValue({
                            [`CreateTime`]: item.CreateTime && moment(item.CreateTime),
                            [`LabelGas80${index}`]: item.LabelGas80,
                            [`LabelGas50${index}`]: item.LabelGas50,
                            [`LabelGas20${index}`]: item.LabelGas20,
                            [`Remark${index}`]: item.Remark,
                        })
                    })
                }
                if (res.ChildTable2 && res.ChildTable2[0]) {
                    const data2 = res.ChildTable2;

                    data2.map(item => {
                        const index = item.Sort;
                        if (item.NominalValue) {
                            form.setFieldsValue({ [`NominalValue`]: item.NominalValue, })
                        }
                        form.setFieldsValue({
                            [`CreateTime${index}`]: item.CreateTime && moment(item.CreateTime),
                            [`TimeT1${index}`]: item.TimeT1,
                            [`TimeT2${index}`]: item.TimeT2,
                            [`ResponseTime${index}`]: item.ResponseTime,
                        })
                    })
                }
            }
        })
    }
    const disabledDate = (current) => {
        //return current && current > moment().endOf('year') || current < moment().startOf('year');
    };

    // const [autoDateFlag, setAutoDateFlag] = useState(true)
    const onDateChange = (name) => {
        const values = form.getFieldValue('CreateTime0')
        // const date1 = form.getFieldValue('CreateTime1'),date2=form.getFieldValue('CreateTime2');
        //  if (name == 'CreateTime0' && !date1 && !date2) {
         if (name == 'CreateTime0') {
            if(!values){
                form.setFieldsValue({ CreateTime1: undefined, CreateTime1: undefined, })
                return;
            }
            form.setFieldsValue({
                CreateTime1: moment(moment(values).add('day', 1)),
                CreateTime2: moment(moment(values).add('day', 2)),
            })
            // setAutoDateFlag(false)
        }
    }


    const labelGasBlur = (value1, value2, name, index) => {

        if (index > 0) { return; }
        const data = form.getFieldValue(name);
        const rangData = form.getFieldValue('MaxRange') - form.getFieldValue('MinRange');
        const minVal = Number((rangData * (value1 / 100)).toFixed(2)), maxVal = Number((rangData * (value2 / 100)).toFixed(2));
        if (data < minVal || data > maxVal) {
            message.warning(`标称值需要在${minVal}和${maxVal}之间`)
        }
    }

    const responseTimeBlur = (index) => {
        const timeT1 = form.getFieldValue(`TimeT1${index}`), timeT2 = form.getFieldValue(`TimeT2${index}`)
        if ((timeT1 || timeT1 == 0) && (timeT2 || timeT2 == 0)) {
            console.log(timeT1,timeT2)
            form.setFieldsValue({
                [`ResponseTime${index}`]: (Number(timeT1) + Number(timeT2)).toFixed(2)
            })
        }else{
            form.setFieldsValue({
                [`ResponseTime${index}`]: undefined
            })  
        }
        const resTime1 = form.getFieldValue(`ResponseTime0`), resTime2 = form.getFieldValue(`ResponseTime1`), resTime3 = form.getFieldValue(`ResponseTime2`);

        if ((resTime1 || resTime1 == 0) && (resTime2 || resTime2 == 0) && (resTime3 || resTime3 == 0)) {
            const resAvg = ((Number(resTime1) + Number(resTime2) + Number(resTime3) ) / 3).toFixed(2)
            form.setFieldsValue({ AVG: resAvg })
        }else{
            form.setFieldsValue({ AVG: undefined })
        }
    }
    const [isReg, setIsReg] = useState(false)
    const [isTimeReg, setIsTimeReg] = useState(false)

    const columns = [
        {
            title: '检测日期',
            align: 'center',
            width: 140,
            render: (text, record, index) => {
                if (index == 0) {
                    return {
                        children: <Form.Item name={`CreateTime`} rules={[{ required: isTimeReg, message: '' }]}><DatePicker disabledDate={disabledDate} format="YYYY-MM-DD" /></Form.Item>,
                        props: { rowSpan: 6 },
                    };
                } else if (index >= 1 && index < 6) {
                    return {
                        props: { rowSpan: 0 },
                    };
                } else {
                    return '评价依据'
                }

            }

        },
        {
            title: '标气名称',
            align: 'center',
            render: (text, record, index) => {
                if (index == 0) {
                    return {
                        children: <span>{form.getFieldValue('PollutantName')}</span>,
                        props: { rowSpan: 6 },
                    };
                } else if (index >= 1 && index < 6) {
                    return {
                        props: { rowSpan: 0 },
                    };
                } else {
                    return {
                        children: <div>{form.getFieldValue('EvaluationBasis')}</div>,
                        props: { colSpan: 7 },
                    };
                }

            }

        },
        {
            title: '标准气体',
            align: 'center',
            colSpan: 2,
            render: (text, record, index) => {
                if (index == 6) {
                    return { props: { colSpan: 0 }, };
                } else if (index == 0) {
                    return { children: '标称值', props: { colSpan: 2 }, };
                } else if (index == 5) {
                    return { children: '示值误差(%)', props: { colSpan: 2 }, };
                } else if (index == 1) {
                    return {
                        children: '实测值', props: { rowSpan: 4, },
                    }
                } else if (index > 1 && index < 5) {
                    return {
                        children: '实测值', props: { rowSpan: 0, },
                    }
                }

            }

        },
        {
            title: '标准气体2',
            align: 'center',
            colSpan: 0,
            render: (text, record, index) => {
                if (index == 6 || index == 0 || index == 5) {
                    return { props: { colSpan: 0 }, };
                } else {
                    return index == 4 ? '平均值' : index
                }

            }

        },
        {
            title: '80-100%满量程标准气体',
            align: 'center',
            render: (text, record, index) => {
                if (index == 6) {
                    return { props: { colSpan: 0 }, };
                }
                if(index == 4 || index == 5){
                    //   return <Form.Item name={`LabelGas80${index}`} rules={[{ required:  isReg, message: '' }]}><InputNumber step='0.01' disabled    /></Form.Item>
                      return <span>{!isClears&&form.getFieldValue(`LabelGas80${index}`)}</span>
                    }else{
                        return <Form.Item name={`LabelGas80${index}`} rules={[{ required: false, message: '' }]}><InputNumber step='0.01'    onBlur={() => { labelGasBlur(80, 100, `LabelGas80${index}`, index) }} placeholder='请输入'/></Form.Item>;   
                 }
            }


        },
        {
            title: '50-60%满量程标准气体',
            align: 'center',
            render: (text, record, index) => {
                if (index == 6) {
                    return { props: { colSpan: 0 }, };
                }
                if(index == 4 || index == 5){
                //   return <Form.Item name={`LabelGas50${index}`} rules={[{ required:  isReg, message: '' }]}><InputNumber step='0.01' disabled   /></Form.Item>
                  return <span>{!isClears&&form.getFieldValue(`LabelGas50${index}`)}</span>
                }else{
                    return <Form.Item name={`LabelGas50${index}`} rules={[{ required: false, message: '' }]}><InputNumber step='0.01'    onBlur={() => { labelGasBlur(50, 60, `LabelGas50${index}`, index) }}  placeholder='请输入'/></Form.Item>;   
                }

            }
        },
        {
            title: '20-30%满量程标准气体',
            align: 'center',
            render: (text, record, index) => {
                if (index == 6) {
                    return { props: { colSpan: 0 }, };
                }
                if(index == 4 || index == 5){
                    //   return <Form.Item name={`LabelGas20${index}`} rules={[{ required:  isReg, message: '' }]}><InputNumber step='0.01' disabled   placeholder='请输入' /></Form.Item>
                      return <span>{!isClears&&form.getFieldValue(`LabelGas20${index}`)}</span>
                    }else{
                        return <Form.Item name={`LabelGas20${index}`} rules={[{ required: false, message: '' }]}><InputNumber step='0.01'    onBlur={() => { labelGasBlur(20, 30, `LabelGas20${index}`, index) }} placeholder='请输入'/></Form.Item>;   
                    }

            }



        },
        {
            title: '备注',
            align: 'center',
            render: (text, record, index) => {
                if (index == 6) {
                    return { props: { colSpan: 0 }, };
                }
                return <Form.Item name={`Remark${index}`} rules={[{ required: false, message: '' }]}>
                    <TextArea rows={1} placeholder='请输入' />
                </Form.Item>;
            }
        },
    ];

    const columns2 = () => [
        {
            title: '检测日期',
            align: 'center',
            render: (text, record, index) => {
                return index == 3 ? '评价依据' : <Form.Item name={`CreateTime${index}`} rules={[{ required: isReg, message: '' }]}>
                    <DatePicker disabledDate={disabledDate} format="YYYY-MM-DD" onChange={() => onDateChange(`CreateTime${index}`)} />
                </Form.Item>
            }
        },
        {
            title: '标气名称',
            align: 'center',
            render: (text, record, index) => {
                if (index == 3) { return { children: <span>{!isClears&&form.getFieldValue('EvaluationBasis1')}</span>, props: { colSpan: 6 }, }; }
                // return <Form.Item name="PollutantName" >
                //     <Input disabled placeholder='请选择' allowClear title={form.getFieldValue('PollutantName')} />
                // </Form.Item>
                return <span>{form.getFieldValue('PollutantName')}</span>
            }
        },
        {
            title: '标称值',
            align: 'center',
            render: (text, record, index) => {
                if (index == 3) { return { props: { colSpan: 0 }, }; }
                // return <Form.Item name={`NominalValue`} rules={[{ required: false, message: '' }]}>
                //     <InputNumber step='0.01' disabled  />
                // </Form.Item>
                return <span>{!isClears&&form.getFieldValue(`NominalValue`)}</span>
            }
        },
        {
            title: '管路传输时间(T1)',
            align: 'center',
            render: (text, record, index) => {
                if (index == 3) { return { props: { colSpan: 0 }, }; }
                return <Form.Item name={`TimeT1${index}`} rules={[{ required: isReg, message: '' }]}>
                    <InputNumber step='0.01' placeholder='请输入' onBlur={() => { responseTimeBlur(index) }} />
                </Form.Item>
            }
        },
        {
            title: 'CEMS显示值达到标称值90%时的时间(T2)',
            align: 'center',
            render: (text, record, index) => {
                if (index == 3) { return { props: { colSpan: 0 }, }; }
                return <Form.Item name={`TimeT2${index}`} rules={[{ required: isReg, message: '' }]}>
                    <InputNumber step='0.01' placeholder='请输入' onBlur={() => { responseTimeBlur(index) }} />
                </Form.Item>
            }
        },
        {
            title: '响应时间(T1+T2)',
            align: 'center',
            render: (text, record, index) => {
                if (index == 3) { return { props: { colSpan: 0 }, }; }
                return <Form.Item name={`ResponseTime${index}`} rules={[{ required: isReg, message: '' }]}>
                    <Input  disabled  />
                </Form.Item>
            }
        },
        {
            title: '平均值',
            align: 'center',
            render: (text, record, index) => {
                if (index == 0) {
                    return {
                        children: <Form.Item name={`AVG`} rules={[{ required: isReg, message: '' }]}>
                                  <InputNumber  disabled  />
                                  </Form.Item>, 
                        props: { rowSpan: 3 },
                    };
                }
                if (index > 0 && index < 3) { return { props: { rowSpan: 0 }, }; }
                if (index == 3) { return { props: { colSpan: 0 }, }; }
            }
        },
    ]


    const imports = async () => {


    }

    const [saveLoading1, setSaveLoading1] = useState(false)
    const [saveLoading2, setSaveLoading2] = useState(false)

    const submits = (type) => { //暂存 or 提交
        if (type == 1) {
            setIsReg(false)
            setIsTimeReg(false)
        } else {
            setIsTimeReg(true)
            setIsReg(true)
        }
        setTimeout(() => {
            form.validateFields().then((values) => {

                if (type == 2) {   // 提交时判断日期不能一样
                    const date1 = form.getFieldValue('CreateTime0').format('YYYY-MM-DD')
                    const date2 = form.getFieldValue(`CreateTime1`).format('YYYY-MM-DD')
                    const date3 = form.getFieldValue(`CreateTime2`).format('YYYY-MM-DD')
                    if (date1 == date2 || date1 == date3 || date2 == date3) {
                        message.warning('日期不能相同，请修改日期')
                        return
                    }
                }

                type == 1 ? setSaveLoading1(true) : setSaveLoading2(true)

                let mainValue = { ...values }
                Object.keys(mainValue).map((item, index) => { //去除主表 多余字段
                    if (/\d/g.test(item)) {
                        delete mainValue[item];
                    }
                })
                let data = {
                    AddType: type,
                    MainTable: {
                        ...mainValue,
                        Range: `${form.getFieldValue('MinRange') ? form.getFieldValue('MinRange') : ''},${form.getFieldValue('MaxRange') ? form.getFieldValue('MaxRange') : ''}`,
                        PointId: pointId,
                        PollutantCode: pollutantCode,
                        // EvaluationBasis: form.getFieldValue('EvaluationBasis'),
                        // EvaluationBasis1: form.getFieldValue('EvaluationBasis1'),
                    },
                    ChildTable: [],
                }
                const data1 = tableDatas1.map((item, index) => {
                    return {
                        RecordType: 1,
                        Sort: index,
                        CreateTime: values[`CreateTime`] && values[`CreateTime`].format('YYYY-MM-DD 00:00:00'),
                        PollutantCode: pollutantCode,
                        LabelGas80: values[`LabelGas80${index}`],
                        LabelGas50: values[`LabelGas50${index}`],
                        LabelGas20: values[`LabelGas20${index}`],
                        Remark: values[`Remark${index}`],
                    }
                })
                const data2 = tableDatas2.map((item, index) => {
                    return {
                        RecordType: 2,
                        Sort: index,
                        PollutantCode: pollutantCode,
                        CreateTime: values[`CreateTime${index}`] && values[`CreateTime${index}`].format('YYYY-MM-DD 00:00:00'),
                        NominalValue: form.getFieldValue('NominalValue'),
                        TimeT1: values[`TimeT1${index}`],
                        TimeT2: values[`TimeT2${index}`],
                        ResponseTime: values[`ResponseTime${index}`],
                    }
                })
                data.ChildTable = [...data1, ...data2]
                props.addGasIndicationErrorSystemResponseRecord(data, (isSuccess) => {
                    type == 1 ? setSaveLoading1(false) : setSaveLoading2(false)
                    isSuccess&&getFormData(pollutantCode)
                    
                })
            }).catch((errorInfo) => {
                console.log('Failed:', errorInfo);
                message.warning('请输入完整的数据')
                return;
            });

        })


    }
    const [isClears,setIsClears] = useState(false)
    const clears = () => {
        const value = form.getFieldsValue()
        Object.keys(value).map((item, index) => { //清除表格表单数据 两个表单表单
            if(/\d/g.test(item) || /AVG/g.test(item)){
               form.setFieldsValue({[item]:undefined})
            }
        })
        setIsClears(true)//清除算法结果数据
    }
    const del = () => {
        props.deleteGasIndicationErrorSystemResponseRecord({
            ID: form.getFieldValue('ID'),
        }, () => {
            getFormData(pollutantCode)
        })
    }



    const numCheck = (e, name) => {
        const value = e.target.value
        if (value) {
            numVerify(value, (data) => {
                form.setFieldsValue({ [name]: data })
            })
        }

    }
    const SearchComponents = () => {
        return <>
            <Row justify='center' style={{ fontSize: 16, fontWeight: 'bold', paddingBottom: 16 }}>{recordName}</Row>
            <Row justify='center' className={styles['advanced_search_sty']}>
                <Col span={8}>
                    <Form.Item label="测试人员" name="Tester">
                        <Input disabled placeholder='请输入' allowClear />
                    </Form.Item>
                </Col>
                <Col span={4}></Col>
                <Col span={8}>
                    <Form.Item label="CEMS生产厂" name="CEMSPlant" >
                        <Input disabled placeholder='请输入' allowClear />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item label="测试地点" name="TestSite">
                        <Input disabled placeholder='请输入' allowClear />
                    </Form.Item>
                </Col>
                <Col span={4}></Col>
                <Col span={8}>
                    <Form.Item label="CEMS型号、编号" name="CEMSModel" >
                        <Input disabled placeholder='请输入' allowClear />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item label="测试位置" name="TestLocation">
                        <Input disabled placeholder='请输入' allowClear />
                    </Form.Item>
                </Col>
                <Col span={4}></Col>
                <Col span={8}>
                    <Form.Item label="CEMS原理" name="CEMSPrinciple" >
                        <Input disabled placeholder='请输入' allowClear />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item label="计量单位" name="Unit">
                        <Input disabled placeholder='请输入' allowClear />
                    </Form.Item>
                </Col>
                <Col span={4}></Col>
                <Col span={8}>
                    <Row>
                        <label style={{ width: 125, textAlign: 'right',lineHeight:'32px',  }}>量程<span style={{padding:'0 8px 0 2px'}}>:</span></label>
                        <Form.Item name="MinRange" style={{ width: 'calc(50% - 70px)' }}>
                            <InputNumber disabled placeholder='最小值' allowClear />
                        </Form.Item>
                        <div style={{ width: 15, paddingTop: 4, textAlign: 'center' }}>-</div>
                        <Form.Item name="MaxRange" style={{ width: 'calc(50% - 70px)' }}>
                            <InputNumber disabled  placeholder='最大值' allowClear />
                        </Form.Item>
                    </Row>
                </Col>

                <Col span={8}>
                    <Form.Item label="污染物名称" name="PollutantName" >
                        <Input disabled placeholder='请选择' allowClear title={form.getFieldValue('PollutantName')} />
                    </Form.Item>
                </Col>
                <Col span={4}></Col>
                <Col span={8}></Col>
                <Form.Item name="ID" hidden>
                    <Input />
                </Form.Item>
            </Row>
        </>

    };


    const onPollChange = ({ target: { value }, option }) => {
        console.log('radio1 checked', value);
        setPollutantCode(value)
        getFormData(value)
    };
    const PollutantComponents = () => {
        return <Radio.Group options={pollOptions} value={pollutantCode} optionType="button" buttonStyle="solid" onChange={onPollChange} />
    }


    const onValuesChange = (hangedValues, allValues) => {
    }
    return (
        <div className={styles.totalContentSty}>
            <Spin spinning={pollutantLoading}>
                {pollOptions[0] ? <>
                    <BtnComponents {...props} saveLoading1={saveLoading1} saveLoading2={saveLoading2} delLoading={props.delLoading} submits={submits} clears={clears} del={del} />
                    <PollutantComponents />
                    <Spin spinning={formLoading}>
                        <Form
                            form={form}
                            name="advanced_search"
                            initialValues={{}}
                            className={styles["ant-advanced-search-form"]}
                            onValuesChange={onValuesChange}
                        >
                            <SearchComponents />
                            <Table
                                size="small"
                                loading={tableLoading}
                                bordered
                                dataSource={[...tableDatas1, 7]}
                                columns={columns}
                                pagination={false}
                                className={'tableSty'}
                            />
                            <Table
                                size="small"
                                loading={tableLoading}
                                bordered
                                dataSource={[...tableDatas2, 4]}
                                columns={columns2()}
                                pagination={false}
                                className={'tableSty'}
                            // style={{marginTop:5}}
                            />
                        </Form>
                    </Spin>
                </> :
                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
            </Spin>
        </div>
    );
};
export default connect(dvaPropsData, dvaDispatch)(Index);