/**
 * 功  能：颗粒物漂移
 * 创建人：jab
 * 创建时间：2022.09.01
 */
import React, { useState, useEffect, Fragment } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Tag, Typography, TimePicker, Card, Button, Select, message, Row, Col, Tooltip, Divider, Modal, DatePicker, Radio, Spin, } from 'antd';
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
    formLoading: loading.effects[`${namespace}/getPMZeroRangeRecord`],
    delLoading: loading.effects[`${namespace}/deletePMZeroRangeRecord`],
})

const dvaDispatch = (dispatch) => {
    return {
        updateState: (payload) => {
            dispatch({
                type: `${namespace}/updateState`,
                payload: payload,
            })
        },
        getPMZeroRangeRecord: (payload, callback) => { //参数回填
            dispatch({
                type: `${namespace}/getPMZeroRangeRecord`,
                payload: payload,
                callback: callback
            })
        },
        addPMZeroRangeRecord: (payload, callback) => { //保存 暂存
            dispatch({
                type: `${namespace}/addPMZeroRangeRecord`,
                payload: payload,
                callback: callback
            })
        },
        deletePMZeroRangeRecord: (payload, callback) => { //删除
            dispatch({
                type: `${namespace}/deletePMZeroRangeRecord`,
                payload: payload,
                callback: callback
            })
        },
    }
}
const Index = (props) => {



    const [form] = Form.useForm();


    const [tableDatas, setTableDatas] = useState([1, 2, 3, 4]);

    const { pointId, tableLoading, formLoading, } = props;


    const [recordName, setRecordName] = useState()
    useEffect(() => {
        if (!pointId) { return }
        initData()
    }, [pointId]);
    const initData = () => {
        props.getPMZeroRangeRecord({
            PointCode: pointId,
            PollutantCode: 502,
            RecordDate: "",
            Flag: ""
        }, (res) => {
            if (res) {
                setRecordName(res.RecordName)

                if (res.MainTable) {
                    form.resetFields();
                    setIsClears(false);

                    form.setFieldsValue({
                        ...res.MainTable,
                    })

                    if (res.ChildTable) {
                        const data = [];
                        res.ChildTable.map(item => {
                            if (item.ChildList) {
                                item.ChildList.map(item2 => {
                                    data.push(item2)
                                })
                            }
                        })
                        data.map(item => {
                            const index = item.Col1;
                            form.setFieldsValue({
                                [`CreateDate${index}`]: item.CreateDate && moment(item.CreateDate),
                                [`BTime${index}`]: item.BTime && moment(item.BTime),
                                [`ETime${index}`]: item.ETime && moment(item.ETime),
                                [`ZeroBegin${index}`]: item.ZeroBegin,
                                [`ZeroEnd${index}`]: item.ZeroEnd,
                                [`ZeroChange${index}`]: item.ZeroChange,
                                [`ZeroCalibration${index}`]: item.ZeroCalibration,
                                [`CalibrationBegin${index}`]: item.CalibrationBegin,
                                [`CalibrationEnd${index}`]: item.CalibrationEnd,
                                [`DriftAbsolute${index}`]: item.DriftAbsolute,
                                [`AdjustSpan${index}`]: item.AdjustSpan,
                                [`CleanLens${index}`]: item.CleanLens,
                                [`Remark${index}`]: item.Remark,
                            })
                        })
                    }
                }
            }

        })
    }
    const disabledDate = (current) => {
        //return current && current > moment().endOf('year') || current < moment().startOf('year');
    };

    // const [autoDateFlag, setAutoDateFlag] = useState(true)
    const onDateChange = (name, index) => {
        const values = form.getFieldValue('CreateDate0')
        // if (name == 'CreateDate0'  && autoDateFlag ) {
        if (name == 'CreateDate0') {
            if (!values) {
                form.setFieldsValue({ CreateDate1: undefined, CreateDate2: undefined, CreateDate3: undefined, })
                return;
            }
            form.setFieldsValue({
                CreateDate1: moment(moment(values).add('day', 1)),
                CreateDate2: moment(moment(values).add('day', 2)),
                CreateDate3: moment(moment(values).add('day', 3)),
            })
            // setAutoDateFlag(false)
        }
        const startTime = form.getFieldValue(`BTime${index}`) && form.getFieldValue(`BTime${index}`).format('HH:mm')
        timeComparison(index, startTime)
    }
    const onTimeChange = (index, type) => {
        // const dateData = form.getFieldValue(`CreateDate${index}`)? form.getFieldValue(`CreateDate${index}`).format('YYYY-MM-DD') : moment(new Date()).format('YYYY-MM-DD')
        // const startTime = form.getFieldValue(`BTime${index}`)?  form.getFieldValue(`BTime${index}`).format('HH:mm') : undefined;
        // const endTime = form.getFieldValue(`ETime${index}`) ? form.getFieldValue(`ETime${index}`).format('HH:mm') : undefined;
        // if (endTime && startTime) {
        //     const startTimeVal = moment(dateData + ' ' +startTime).valueOf() ;
        //     const endTimeVal = moment(dateData + ' ' +endTime).valueOf();
        //     if(endTimeVal <= startTimeVal){
        //         message.warning('结束时间必须大于开始时间')
        //         if (type === 'start') {
        //             form.setFieldsValue({ [`BTime${index}`]: '' })
        //         } else {
        //             form.setFieldsValue({ [`ETime${index}`]: '' })
        //         }
        //     }
        // }
        const startTime = form.getFieldValue(`BTime${index}`) && form.getFieldValue(`BTime${index}`).format('HH:mm')
        const endTime = form.getFieldValue(`ETime${index}`) && form.getFieldValue(`ETime${index}`).format('HH:mm')
        props.timeCompare(startTime, endTime, () => {
            if (type === 'start') {
                form.setFieldsValue({ [`BTime${index}`]: '' })
            } else {
                form.setFieldsValue({ [`ETime${index}`]: '' })
            }
        }, () => {
            if (type === 'start') {
                timeComparison(index, startTime)
            }
        })
    }
    
    const timeComparison = (index, time) => {
        const createDate1 = form.getFieldValue(`CreateDate${index - 1}`) && form.getFieldValue(`CreateDate${index - 1}`).format('YYYY-MM-DD')
        const createDate2 = form.getFieldValue(`CreateDate${index}`) && form.getFieldValue(`CreateDate${index}`).format('YYYY-MM-DD')
        const createDate3 = form.getFieldValue(`CreateDate${index + 1}`) && form.getFieldValue(`CreateDate${index + 1}`).format('YYYY-MM-DD')
        const time1 = form.getFieldValue(`BTime${index - 1}`) && form.getFieldValue(`BTime${index - 1}`).format('HH:mm')
        const time2 = time
        const time3 = form.getFieldValue(`BTime${index + 1}`) && form.getFieldValue(`BTime${index + 1}`).format('HH:mm')
        
        const createDateTime1 = createDate1 && time1 && moment(createDate1 + ' ' + time1);
        const createDateTime2 = createDate2 && time2 && moment(createDate2 + ' ' + time2);
        const createDateTime3 = createDate3 && time3 && moment(createDate3 + ' ' + time3);
        if (createDateTime2) {
            if (createDateTime1 && !createDateTime3) { //填入时间 和上一列时间表比较
                props.timeColCompareFun(1, index, createDateTime1, createDateTime2);
            }
            if (createDateTime3 && !createDateTime1) { //填入时间 和下一列时间表比较
                props.timeColCompareFun(2, index + 1, createDateTime2, createDateTime3);
            }
            if (createDateTime1 && createDateTime3) {
                props.timeColCompareFun(3, index, createDateTime1, createDateTime2, createDateTime3);
            }
        }
    }
    const zeroReadBlur = (index, type, positionType) => {
        let value1, value2;
        if (type == 1) { //零点漂移绝对误差	
            value1 = form.getFieldValue(`ZeroBegin${index}`), value2 = form.getFieldValue(`ZeroEnd${index}`)
            if ((value1 || value1 == 0) && (value2 || value2 == 0)) {
                form.setFieldsValue({ [`ZeroChange${index}`]: (value2 - value1).toFixed(2) })
            } else {
                form.setFieldsValue({ [`ZeroChange${index}`]: undefined })
            }
            if (positionType && form.getFieldValue(`ZeroCalibration${index}`) == 2) { //下一列起始值 赋值
                form.setFieldsValue({ [`ZeroBegin${index + 1}`]: form.getFieldValue(`ZeroEnd${index}`) })
            }
        } else {
            value1 = form.getFieldValue(`CalibrationBegin${index}`), value2 = form.getFieldValue(`CalibrationEnd${index}`)
            if ((value1 || value1 == 0) && (value2 || value2 == 0)) {
                form.setFieldsValue({ [`DriftAbsolute${index}`]: (value2 - value1).toFixed(2) })
            } else {
                form.setFieldsValue({ [`DriftAbsolute${index}`]: undefined })
            }
            if (positionType && form.getFieldValue(`AdjustSpan${index}`) == 2) { //下一列起始值 赋值
                form.setFieldsValue({ [`CalibrationBegin${index + 1}`]: form.getFieldValue(`CalibrationEnd${index}`) })
            }
        }

    }

    const adjustChang = (name, name2, name3, index) => {
        const value = form.getFieldValue(`${name}${index}`)
        const value2 = form.getFieldValue(`${name2}${index}`)

        if (value == 2) {
            value2 && form.setFieldsValue({ [`${name3}${index + 1}`]: value2 })
        }

    }
    const [isReg, setIsReg] = useState(false)
    const [isTimeReg, setIsTimeReg] = useState(false)


    const smallFont = (text) => {
        return <span style={{ fontSize: 12 }}>{text}</span>
    }
    const columns = [
        {
            title: '日期',
            align: 'center',
            width: 140,
            render: (text, record, index) => {
                return <Form.Item className={styles.reqSty} name={`CreateDate${index}`} rules={[{ required: isTimeReg, message: '' }]}><DatePicker disabledDate={disabledDate} onChange={() => onDateChange(`CreateDate${index}`, index)} format="YYYY-MM-DD" /></Form.Item>;
            }
        },
        {
            title: '时间(时、分)',
            align: 'center',
            children: [
                {
                    title: '开始',
                    align: 'center',
                    width: 115,
                    render: (text, record, index) => {
                        return <Form.Item className={props.warnArr.includes(index) ? styles.warnSty : styles.reqSty} name={`BTime${index}`} rules={[{ required: isTimeReg, message: '' }]}><TimePicker defaultOpenValue={moment('00:00', 'HH:mm')} onChange={() => onTimeChange(index, 'start')} format='HH:mm' /></Form.Item>;
                    }
                },
                {
                    title: '结束',
                    align: 'center',
                    width: 115,
                    render: (text, record, index) => {
                        return <Form.Item className={styles.reqSty} name={`ETime${index}`} rules={[{ required: isTimeReg, message: '' }]}><TimePicker defaultOpenValue={moment('00:00', 'HH:mm')} onChange={() => onTimeChange(index, 'end')} format='HH:mm' /></Form.Item> ;
                    }
                },
            ]
        },
        {
            title: <span>计量单位(mg/m3、mA、mV、不透明度%......)</span>,
            align: 'center',
            children: [
                {
                    title: '零点读数',
                    align: 'center',
                    children: [
                        {
                            title: <span>起始(Z{smallFont('0')})</span>,
                            align: 'center',
                            width: 100,
                            render: (text, record, index) => {
                                if (index == 0) { return '/' }
                                return <Form.Item className={styles.reqSty} name={`ZeroBegin${index}`} rules={[{ required: isReg, message: '' }]}><InputNumber step='0.01' onBlur={() => zeroReadBlur(index, 1)} placeholder='请输入' /></Form.Item>;
                            }
                        },
                        {
                            title: <span>最终(Z{smallFont('i')})</span>,
                            align: 'center',
                            width: 100,
                            render: (text, record, index) => {
                                return <Form.Item className={styles.reqSty} name={`ZeroEnd${index}`} rules={[{ required: isReg, message: '' }]}><InputNumber step='0.01' onBlur={() => zeroReadBlur(index, 1, 'end')} placeholder='请输入' /></Form.Item>;
                            }
                        },
                    ]
                },
                {
                    title: '零点漂移绝对误差',
                    align: 'center',
                    children: [
                        {
                            title: <span>∆Z=Z{smallFont('i')}-Z{smallFont('0')}</span>,
                            width: 130,
                            align: 'center',
                            render: (text, record, index) => {
                                if (index == 0) { return '/' }
                                return <Form.Item className={styles.calculaSty} name={`ZeroChange${index}`} rules={[{ required: isReg, message: '' }]}><InputNumber step='0.01' disabled /></Form.Item>;
                            }
                        },
                    ]
                },
                {
                    title: '调节零点否',
                    align: 'center',
                    render: (text, record, index) => {
                        return <Form.Item className={styles.reqRadioSty} name={`ZeroCalibration${index}`} rules={[{ required: isReg, message: '' }]}>
                            <Radio.Group onChange={() => { adjustChang(`ZeroCalibration`, 'ZeroEnd', 'ZeroBegin', index) }}>
                                <Radio value="1">是</Radio>
                                <Radio value="2">否</Radio>
                            </Radio.Group>
                        </Form.Item>;
                    }
                },
                {
                    title: '上标校准读数',
                    align: 'center',
                    children: [
                        {
                            title: <span>起始(S{smallFont('0')})</span>,
                            align: 'center',
                            width: 100,
                            render: (text, record, index) => {
                                if (index == 0) { return '/' }
                                return <Form.Item className={styles.reqSty} name={`CalibrationBegin${index}`} rules={[{ required: isReg, message: '' }]}><InputNumber step='0.01' onBlur={() => zeroReadBlur(index, 2)} placeholder='请输入' /></Form.Item>;
                            }
                        },
                        {
                            title: <span>最终(S{smallFont('i')})</span>,
                            align: 'center',
                            width: 100,
                            render: (text, record, index) => {
                                return <Form.Item className={styles.reqSty} name={`CalibrationEnd${index}`} rules={[{ required: isReg, message: '' }]}><InputNumber step='0.01' onBlur={() => zeroReadBlur(index, 2, 'end')} placeholder='请输入' /></Form.Item>;
                            }
                        },
                    ]
                },
                {
                    title: '量程漂移绝对误差',
                    align: 'center',
                    children: [
                        {
                            title: <span>∆S=S{smallFont('i')}-S{smallFont('0')}</span>,
                            width: 130,
                            align: 'center',
                            render: (text, record, index) => {
                                if (index == 0) { return '/' }
                                return <Form.Item className={styles.calculaSty} name={`DriftAbsolute${index}`} rules={[{ required: isReg, message: '' }]}><InputNumber step='0.01' disabled /></Form.Item>;
                            }
                        },
                    ]
                },
                {
                    title: '调节跨度否',
                    align: 'center',
                    render: (text, record, index) => {
                        return <Form.Item className={styles.reqRadioSty} name={`AdjustSpan${index}`} rules={[{ required: isReg, message: '' }]}>
                            <Radio.Group onChange={() => { adjustChang(`AdjustSpan`, 'CalibrationEnd', 'CalibrationBegin', index) }}>
                                <Radio value="1">是</Radio>
                                <Radio value="2">否</Radio>
                            </Radio.Group>
                        </Form.Item>;
                    }
                },
                {
                    title: '清洁镜头否',
                    align: 'center',
                    render: (text, record, index) => {
                        return <Form.Item className={styles.reqRadioSty} name={`CleanLens${index}`} rules={[{ required: isReg, message: '' }]}>
                            <Radio.Group>
                                <Radio value="1">是</Radio>
                                <Radio value="2">否</Radio>
                            </Radio.Group>
                        </Form.Item>;
                    }
                },
            ]
        },
        {
            title: '备注',
            align: 'center',
            width: 120,
            render: (text, record, index) => {
                return <Form.Item name={`Remark${index}`} rules={[{ required: false, message: '' }]}>
                    <TextArea rows={1} placeholder="请输入" />
                </Form.Item>;
            }

        },
    ];

    const columns2 = () => [
        {
            title: '零点漂移绝对误差最大值',
            align: 'center',
            children: [
                {
                    title: '零点漂移（%）',
                    align: 'center',
                    width: 300,
                    render: () => {
                        return '评价依据'
                    }
                },

            ]
        },
        {
            title: <span>{!isClears && form.getFieldValue('ZeroErrorMaximum')}</span>,
            align: 'center',
            children: [
                {
                    title: <span style={{ color: '#fff', padding: !isClears && form.getFieldValue('ZeroValue') && 4, background: form.getFieldValue('Col1') == 1 ? '#73d13d' : '#ff4d4f' }}>{!isClears && form.getFieldValue('ZeroValue')}</span>,
                    align: 'center',
                    render: (text, record, index) => {
                        const obj = {
                            children: <span style={{ color: '#fff', padding: !isClears && form.getFieldValue('EvaluationBasis') && 4, background: form.getFieldValue('Col1') == 1 && form.getFieldValue('Col2') == 1 ? '#73d13d' : '#ff4d4f' }}>{!isClears && form.getFieldValue('EvaluationBasis')}</span>,
                            props: { colSpan: 3 },
                        };
                        return obj;
                    }
                },


            ]
        },
        {
            title: '跨度漂移绝对误差最大值',
            align: 'center',
            children: [
                {
                    title: '跨度漂移（%）',
                    align: 'center',
                    width: 300,
                    render: (text, record, index) => {
                        const obj = {
                            props: { colSpan: 0 },
                        };
                        return obj;
                    }
                },
            ]
        },
        {
            title: <span>{!isClears && form.getFieldValue('SpanErrorMaximum')}</span>,
            align: 'center',
            children: [
                {
                    title: <span style={{ color: '#fff', padding: !isClears && form.getFieldValue('SpanValue') && 4, background: form.getFieldValue('Col2') == 1 ? '#52c41a' : '#f5222d' }}>{!isClears && form.getFieldValue('SpanValue')}</span>,
                    align: 'center',
                    render: (text, record, index) => {
                        const obj = {
                            props: { colSpan: 0 },
                        };
                        return obj;
                    }
                },

            ]
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
                        PointId: pointId,
                        // ZeroErrorMaximum: form.getFieldValue('ZeroErrorMaximum'),
                        // SpanErrorMaximum: form.getFieldValue('SpanErrorMaximum'),
                        // ZeroValue: form.getFieldValue('ZeroValue'),
                        // SpanValue: form.getFieldValue('SpanValue'),
                        // EvaluationBasis: form.getFieldValue('EvaluationBasis'),

                    },
                    ChildTable: [],
                }
                data.ChildTable = tableDatas.map((item, index) => {
                    return {
                        Col1: index,
                        CreateDate: values[`CreateDate${index}`] && values[`CreateDate${index}`].format('YYYY-MM-DD 00:00:00'),
                        BTime: values[`CreateDate${index}`] && values[`BTime${index}`] && `${values[`CreateDate${index}`].format('YYYY-MM-DD')} ${values[`BTime${index}`].format('HH:mm:00')}`,
                        ETime: values[`CreateDate${index}`] && values[`ETime${index}`] && `${values[`CreateDate${index}`].format('YYYY-MM-DD')} ${values[`ETime${index}`].format('HH:mm:00')}`,
                        ZeroBegin: values[`ZeroBegin${index}`],
                        ZeroEnd: values[`ZeroEnd${index}`],
                        ZeroChange: values[`ZeroChange${index}`],
                        ZeroCalibration: values[`ZeroCalibration${index}`],
                        CalibrationBegin: values[`CalibrationBegin${index}`],
                        CalibrationEnd: values[`CalibrationEnd${index}`],
                        DriftAbsolute: values[`DriftAbsolute${index}`],
                        AdjustSpan: values[`AdjustSpan${index}`],
                        CleanLens: values[`CleanLens${index}`],
                        Remark: values[`Remark${index}`],
                        MainId: form.getFieldValue('ID'),
                    }

                })
                props.addPMZeroRangeRecord(data, (isSuccess) => {
                    type == 1 ? setSaveLoading1(false) : setSaveLoading2(false)
                    isSuccess && initData()
                })
            }).catch((errorInfo) => {
                console.log('Failed:', errorInfo);
                message.warning('请输入完整的数据')
                return;
            });

        })


    }

    const [isClears, setIsClears] = useState(false)
    const clears = () => {
        const value = form.getFieldsValue()
        Object.keys(value).map((item, index) => { //清除表格表单数据
            if (/\d/g.test(item)) {
                form.setFieldsValue({ [item]: undefined })
            }
        })
        setIsClears(true)//清除算法结果数据
    }


    const del = () => {
        props.deletePMZeroRangeRecord({
            ID: form.getFieldValue('ID'),
        }, () => {
            initData()
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
                    <Form.Item label="量程校准值" name="RangeCalibrationValue" >
                        <InputNumber disabled placeholder='请输入' allowClear />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item label="CEMS原理" name="CEMSPrinciple">
                        <Input disabled placeholder='请输入' allowClear />
                    </Form.Item>
                </Col>
                <Col span={4}></Col>
                <Col span={8}>
                    <Row>
                        <label style={{ width: 125, textAlign: 'right', lineHeight: '32px', }}>量程<span style={{ padding: '0 8px 0 2px' }}>:</span></label>
                        <Form.Item name="MinRange" style={{ width: 'calc(50% - 70px)' }}>
                            <InputNumber disabled placeholder='最小值' allowClear />
                        </Form.Item>
                        <div style={{ width: 15, paddingTop: 4, textAlign: 'center' }}>-</div>
                        <Form.Item name="MaxRange" style={{ width: 'calc(50% - 70px)' }}>
                            <InputNumber disabled placeholder='最大值' allowClear />
                        </Form.Item>
                    </Row>
                </Col>
                <Form.Item name="ID" hidden>
                    <Input />
                </Form.Item>
            </Row>
        </>

    };


    const onValuesChange = (hangedValues, allValues) => {
    }
    return (
        <div className={styles.totalContentSty}>
            <Spin spinning={formLoading}>
                <BtnComponents {...props} saveLoading1={saveLoading1} saveLoading2={saveLoading2} delLoading={props.delLoading} submits={submits} clears={clears} del={del} />
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
                        dataSource={tableDatas}
                        columns={columns}
                        pagination={false}
                        className={'tableSty'}
                    />
                    <Table
                        size="small"
                        loading={tableLoading}
                        bordered
                        dataSource={['评价依据']}
                        columns={columns2()}
                        pagination={false}
                        className={'white-table-thead'}
                    />
                </Form>
            </Spin>
        </div>
    );
};
export default connect(dvaPropsData, dvaDispatch)(Index);