/**
 * 功  能：速度场系数
 * 创建人：jab
 * 创建时间：2022.09.02
 */
import React, { useState, useEffect, Fragment } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Tag, Typography, TimePicker, Card, Button, Select, message, Row, Col, Tooltip, Divider, Modal, DatePicker, Radio, Spin, } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined, UpOutlined, DownOutlined, ExportOutlined } from '@ant-design/icons';
import { connect } from "dva";
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
const { RangePicker } = DatePicker;
import { DelIcon, DetailIcon, EditIcon, PointIcon } from '@/utils/icon'
import { getSum, getAve, numVerify, arrDistinctByProp,timeCompare, } from '@/utils/utils'
import router from 'umi/router';
import Link from 'umi/link';
import moment, { RFC_2822 } from 'moment';
import RegionList from '@/components/RegionList'
import styles from "../style.less"
import Cookie from 'js-cookie';
import BtnComponents from './BtnComponents'
import GenerateTime from './GenerateTime'
const { TextArea } = Input;
const { Option } = Select;
import config from '@/config'
import { func } from 'prop-types';
const namespace = 'hourCommissionTest'




const dvaPropsData = ({ loading, hourCommissionTest, commissionTest, }) => ({
    formLoading: loading.effects[`${namespace}/getVelocityFieldCheckingRecord`],
    delLoading: loading.effects[`${namespace}/deleteVelocityFieldCheckingRecord`],
})

const dvaDispatch = (dispatch) => {
    return {
        updateState: (payload) => {
            dispatch({
                type: `${namespace}/updateState`,
                payload: payload,
            })
        },
        importDataNew: (payload, callback) => { //导入
            dispatch({
                type: `${namespace}/importDataNew`,
                payload: payload,
                callback: callback
            })
        },
        getVelocityFieldCheckingRecord: (payload, callback) => { //参数回填
            dispatch({
                type: `${namespace}/getVelocityFieldCheckingRecord`,
                payload: payload,
                callback: callback
            })
        },
        addVelocityFieldCheckingRecord: (payload, callback) => { //保存 暂存
            dispatch({
                type: `${namespace}/addVelocityFieldCheckingRecord`,
                payload: payload,
                callback: callback
            })
        },
        deleteVelocityFieldCheckingRecord: (payload, callback) => { //删除
            dispatch({
                type: `${namespace}/deleteVelocityFieldCheckingRecord`,
                payload: payload,
                callback: callback
            })
        },
    }
}
const Index = (props) => {


    const [tableDatas, setTableDatas] = useState([1, 2, 3, 4, 5, '平均值', 1, 2, 3, 4, 5, '平均值', 1, 2, 3, 4, 5, '平均值',]);
    const [tableDatas2, setTableDatas2] = useState([1, 2, 3, 4, 5, '平均值', '相对误差（%）', 1, 2, 3, 4, 5, '平均值', '相对误差（%）', 1, 2, 3, 4, 5, '平均值', '相对误差（%）']);

    const [form] = Form.useForm();




    const { pointId, tableLoading, formLoading, } = props;
    const [pollutantCode, setPollutantCode] = useState(508)
    const [recordName, setRecordName] = useState()
    const [recordType, setRecordType] = useState(1)
    useEffect(() => {
        if (!pointId) { return }
        initData()
    }, [pointId]);
    const initData = () => {
        props.getVelocityFieldCheckingRecord({
            PointCode: pointId,
            PollutantCode: pollutantCode,
            RecordDate: "",
            Flag: ""
        }, (res) => {
            if (res) {
                setRecordName(res.RecordName)
                setRecordType(res.RecordType)
                const avg1 = res.MainTable.AVG1 && res.MainTable.AVG1.split(',')[0],
                    avg4 = res.MainTable.AVG1 && res.MainTable.AVG1.split(',')[1],
                    avg7 = res.MainTable.AVG1 && res.MainTable.AVG1.split(',')[2],
                    avg2 = res.MainTable.AVG2 && res.MainTable.AVG2.split(',')[0],
                    avg5 = res.MainTable.AVG2 && res.MainTable.AVG2.split(',')[1],
                    avg8 = res.MainTable.AVG2 && res.MainTable.AVG2.split(',')[2],
                    avg3 = res.MainTable.AVG3 && res.MainTable.AVG3.split(',')[0],
                    avg6 = res.MainTable.AVG3 && res.MainTable.AVG3.split(',')[1],
                    avg9 = res.MainTable.AVG3 && res.MainTable.AVG3.split(',')[2];


                if (res.MainTable) {
                    form.resetFields();
                    setIsClears(false);

                    form.setFieldsValue({
                        ...res.MainTable,
                        PMUnit: res.MainTable.PMUnit ? res.MainTable.PMUnit : res.MainTable.Unit,
                        AVG1: avg1, AVG4: avg4, AVG7: avg7, AVG2: avg2, AVG5: avg5, AVG8: avg8, AVG3: avg3, AVG6: avg6, AVG9: avg9,
                    })

                    if (res.ChildTable) {
                        const data = [];
                        res.ChildTable.map(item => {
                            if (item.ChildList) {
                                item.ChildList.map(item2 => { data.push(item2) })
                            }
                        })
                        data.map(item => {
                            const index = item.Sort;
                            form.setFieldsValue({
                                [`CreateDate${index}`]: item.CreateDate && moment(item.CreateDate),
                                [`BTime${index}`]: item.BTime && moment(item.BTime),
                                [`ETime${index}`]: item.ETime && moment(item.ETime),
                                [`Manual${index}`]: item.Manual,
                                [`CEMSValue${index}`]: item.CEMSValue,
                                [`FactoryCoefficient${index}`]: item.FactoryCoefficient,
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
    const onDateChange = (name) => {
        const values = form.getFieldValue('CreateDate0')

        let dateIndex1, dateIndex2;
        if (recordType == 1) { dateIndex1 = 6, dateIndex2 = 12 } else { dateIndex1 = 7, dateIndex2 = 14 }
        if (name == 'CreateDate0') {
            if (!values) {
                form.setFieldsValue({ [`CreateDate${dateIndex1}`]: undefined, [`CreateDate${dateIndex2}`]: undefined, })
                return;
            }
            form.setFieldsValue({
                [`CreateDate${dateIndex1}`]: moment(moment(values).add('day', 1)),
                [`CreateDate${dateIndex2}`]: moment(moment(values).add('day', 2)),
            })
            // setAutoDateFlag(false)
        }
    }
    const onTimeChange = (index, type) => {
        const startTime = form.getFieldValue(`BTime${index}`) && form.getFieldValue(`BTime${index}`).format('HH:mm')
        const endTime = form.getFieldValue(`ETime${index}`) && form.getFieldValue(`ETime${index}`).format('HH:mm')
        props.timeCompare(startTime,endTime,()=>{
            if (type === 'start') {
                form.setFieldsValue({ [`BTime${index}`]: '' })
            } else {
                form.setFieldsValue({ [`ETime${index}`]: '' })
            }
        })   

    }
    const manualBlur = (index) => {
        fieldcoefficientCalcula(index)

    }
    const fieldcoefficientCalcula = (index) => { //场系数计算
        const value1 = form.getFieldValue(`Manual${index}`), value2 = form.getFieldValue(`CEMSValue${index}`);
        if ((value1 || value1 == 0) && (value2 || value2 == 0)) {
            form.setFieldsValue({ [`FactoryCoefficient${index}`]: (value1 / value2).toFixed(2) })
        } else {
            form.setFieldsValue({ [`FactoryCoefficient${index}`]: undefined })
        }
    }
    const [isReg, setIsReg] = useState(false)
    const [isTimeReg, setIsTimeReg] = useState(false)

    const columns = [
        {
            title: '日期',
            align: 'center',
            width: 140,
            render: (text, record, index) => {
                const number = index + 1 + 5;
                const obj = {
                    children: <Form.Item name={`CreateDate${index}`} rules={[{ required: isTimeReg, message: '' }]}><DatePicker disabledDate={disabledDate} onChange={() => onDateChange(`CreateDate${index}`)} format="YYYY-MM-DD" /></Form.Item>,
                    props: { rowSpan: number % 6 == 0 ? 6 : 0 },
                };
                return obj;
            }
        },
        {
            title: '时间(时、分)',
            align: 'center',
            children: [
                {
                    title: '开始',
                    align: 'center',
                    width: 140,
                    render: (text, record, index) => {
                        if ((index + 1) % 6 == 0) {
                            return {
                                children: '平均值',
                                props: { colSpan: 3 },
                            };
                        }
                        return <Form.Item name={`BTime${index}`} rules={[{ required: isTimeReg, message: '' }]}><TimePicker defaultOpenValue={moment('00:00', 'HH:mm')} onChange={() => onTimeChange(index, 'start')} format='HH:mm' /></Form.Item>;
                    }
                },
                {
                    title: '结束',
                    align: 'center',
                    width: 140,
                    render: (text, record, index) => {
                        if ((index + 1) % 6 == 0) { return { props: { colSpan: 0 }, } }
                        return <Form.Item name={`ETime${index}`} rules={[{ required: isTimeReg, message: '' }]}><TimePicker defaultOpenValue={moment('00:00', 'HH:mm')} onChange={() => onTimeChange(index, 'end')} format='HH:mm' /></Form.Item>;
                    }
                },
            ]
        },
        {
            title: '测定次数',
            align: 'center',
            width: 100,
            render: (text, record, index) => {
                if ((index + 1) % 6 == 0) { return { props: { colSpan: 0 }, } }
                return text;
            }
        },
        {
            title: '方法',
            align: 'center',
            children: [
                {
                    title: '手工',
                    align: 'center',
                    render: (text, record, index) => {
                        if ((index + 1) % 6 == 0) { //平均值
                            let i = (index + 1) / 6
                            // return <Form.Item name={`AVG${i}`} rules={[{ required: false, message: '' }]}><InputNumber step='0.01'    disabled  /></Form.Item>;
                            return <span>{!isClears && form.getFieldValue(`AVG${i}`)}</span>
                        }
                        return <Form.Item name={`Manual${index}`} rules={[{ required: isReg, message: '' }]}><InputNumber step='0.01' onBlur={() => manualBlur(index)} placeholder='请输入' /></Form.Item>;
                    }
                },
                {
                    title: 'CEMS',
                    align: 'center',
                    render: (text, record, index) => {
                        if ((index + 1) % 6 == 0) { //平均值
                            let i = (index + 1) / 6
                            // return <Form.Item name={`AVG${i+3}`} rules={[{ required: false, message: '' }]}><InputNumber step='0.01'   disabled  /></Form.Item>;
                            return <span>{!isClears && form.getFieldValue(`AVG${i + 3}`)}</span>
                        }
                        return <Form.Item name={`CEMSValue${index}`} rules={[{ required: isReg, message: '' }]}><InputNumber step='0.01' disabled placeholder='请导入' /></Form.Item>;
                    }
                },
                {
                    title: '场系数',
                    align: 'center',
                    render: (text, record, index) => {
                        if ((index + 1) % 6 == 0) { //平均值
                            let i = (index + 1) / 6
                            // return <Form.Item name={`AVG${i+6}`} rules={[{ required: false, message: '' }]}><InputNumber step='0.01'   disabled  placeholder='请输入' /></Form.Item>;
                            return <span>{!isClears && form.getFieldValue(`AVG${i + 6}`)}</span>

                        }
                        return <Form.Item name={`FactoryCoefficient${index}`} rules={[{ required: isReg, message: '' }]}><InputNumber step='0.01' step='0.01' disabled /></Form.Item>;
                    }
                },
            ]
        },
    ];
    const accuracyColumns = [
        {
            title: '日期',
            align: 'center',
            width: 140,
            render: (text, record, index) => {
                const number = index + 1 + 6;
                const obj = {
                    children: <Form.Item className={styles.reqSty} name={`CreateDate${index}`} rules={[{ required: isTimeReg, message: '' }]}><DatePicker disabledDate={disabledDate} onChange={() => onDateChange(`CreateDate${index}`)} format="YYYY-MM-DD" /></Form.Item>,
                    props: { rowSpan: number % 7 == 0 ? 7 : 0 },
                };
                return obj;
            }
        },
        {
            title: '时间(时、分)',
            align: 'center',
            children: [
                {
                    title: '开始',
                    align: 'center',
                    width: 140,
                    render: (text, record, index) => {
                        if ((index + 2) % 7 == 0) {
                            return {
                                children: '平均值',
                                props: { colSpan: 3 },
                            };
                        }
                        if ((index + 1) % 7 == 0) {
                            return {
                                children: '相对误差（%）',
                                props: { colSpan: 3 },
                            };
                        }
                        return <Form.Item className={styles.reqSty} name={`BTime${index}`} rules={[{ required: isTimeReg, message: '' }]}><TimePicker defaultOpenValue={moment('00:00', 'HH:mm')} onChange={() => onTimeChange(index, 'start')} format='HH:mm' /></Form.Item>;
                    }
                },
                {
                    title: '结束',
                    align: 'center',
                    width: 140,
                    render: (text, record, index) => {
                        if ((index + 1) % 7 == 0 || (index + 2) % 7 == 0) { return { props: { colSpan: 0 }, } }
                        return <Form.Item className={styles.reqSty} name={`ETime${index}`} rules={[{ required: isTimeReg, message: '' }]}><TimePicker defaultOpenValue={moment('00:00', 'HH:mm')} onChange={() => onTimeChange(index, 'end')} format='HH:mm' /></Form.Item>;
                    }
                },
            ]
        },
        {
            title: '测定次数',
            align: 'center',
            width: 100,
            render: (text, record, index) => {
                if ((index + 1) % 7 == 0 || (index + 2) % 7 == 0) { return { props: { colSpan: 0 }, } }
                return text;
            }
        },
        {
            title: '方法',
            align: 'center',
            children: [
                {
                    title: '手工',
                    align: 'center',
                    render: (text, record, index) => {

                        if ((index + 1) % 7 == 0) { //相对误差（%）
                            let i = (index + 1) / 7
                            return {
                                // children: <Form.Item name={`RelativeError${i}`} rules={[{ required: false, message: '' }]}><InputNumber step='0.01'   disabled  /></Form.Item>,
                                children: <span>{!isClears && form.getFieldValue(`RelativeError${i}`)}</span>,
                                props: { colSpan: 3 },
                            }
                        }
                        if ((index + 2) % 7 == 0) { //平均值
                            let i = (index + 2) / 7
                            // return <Form.Item name={`AVG${i}`} rules={[{ required: false, message: '' }]}><InputNumber step='0.01'   disabled  /></Form.Item>;
                            return <span>{!isClears && form.getFieldValue(`AVG${i}`)}</span>
                        }
                        return <Form.Item className={styles.reqSty} name={`Manual${index}`} rules={[{ required: isReg, message: '' }]}><InputNumber step='0.01' onBlur={() => manualBlur(index)} placeholder='请输入' /></Form.Item>;
                    }
                },
                {
                    title: 'CEMS',
                    align: 'center',
                    render: (text, record, index) => {
                        if ((index + 1) % 7 == 0) { return { props: { colSpan: 0 }, } }

                        let i = (index + 2) / 7
                        if ((index + 2) % 7 == 0) { //平均值
                            // return <Form.Item name={`AVG${i + 3 }`} rules={[{ required: false, message: '' }]}><InputNumber step='0.01'   disabled  /></Form.Item>;
                            return <span>{!isClears && form.getFieldValue(`AVG${i + 3}`)}</span>

                        }
                        return <Form.Item className={styles.importSty} name={`CEMSValue${index}`} rules={[{ required: isReg, message: '' }]}><InputNumber step='0.01' disabled placeholder='请导入' /></Form.Item>;
                    }
                },
                {
                    title: '场系数',
                    align: 'center',
                    render: (text, record, index) => {
                        if ((index + 1) % 7 == 0) { return { props: { colSpan: 0 }, } }

                        let i = (index + 2) / 7
                        if ((index + 2) % 7 == 0) { //平均值
                            // return <Form.Item name={`AVG${i + 6}`} rules={[{ required: false, message: '' }]}><InputNumber step='0.01'   disabled  /></Form.Item>;
                            return <span>{!isClears && form.getFieldValue(`AVG${i + 6}`)}</span>

                        }
                        return <Form.Item className={styles.calculaSty} name={`FactoryCoefficient${index}`} rules={[{ required: isReg, message: '' }]}><InputNumber step='0.01' disabled /></Form.Item>;
                    }
                },
            ]
        },
    ];
    const columns2 = () => [
        {
            title: '速度场系数均值',
            align: 'center',
            width: 200,
            render: () => {
                return '评价依据'
            }
        },
        {
            title: <span>{!isClears && form.getFieldValue('VelocityCoefficientAVG')}</span>,
            align: 'center',
            render: (text, record, index) => {
                const obj = {
                    children: <span>{!isClears && form.getFieldValue('Evaluation')}</span>,
                    props: { colSpan: 5 },
                };
                return obj;
            }


        },
        {
            title: '标准偏差',
            align: 'center',
            width: 150,
            render: (text, record, index) => {
                const obj = {
                    props: { colSpan: 0 },
                };
                return obj;
            }
        },
        {
            title: <span>{!isClears && form.getFieldValue('StandardDeviation')}</span>,
            align: 'center',
            render: (text, record, index) => {
                const obj = {
                    props: { colSpan: 0 },
                };
                return obj;
            }
        },
        {
            title: '相对标准偏差(%)',
            align: 'center',
            width: 200,
            render: (text, record, index) => {
                const obj = {
                    props: { colSpan: 0 },
                };
                return obj;
            }
        },
        {
            title: <span>{!isClears && form.getFieldValue('RelativeDeviation')}</span>,
            align: 'center',
            render: (text, record, index) => {
                const obj = {
                    props: { colSpan: 0 },
                };
                return obj;
            }
        },
    ]



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

                if (type == 2) {  // 提交时判断日期不能一样
                    let dateIndex1, dateIndex2;
                    if (recordType == 1) { dateIndex1 = 6, dateIndex2 = 12 } else { dateIndex1 = 7, dateIndex2 = 14 }
                    const date1 = form.getFieldValue('CreateDate0').format('YYYY-MM-DD')
                    const date2 = form.getFieldValue(`CreateDate${dateIndex1}`).format('YYYY-MM-DD')
                    const date3 = form.getFieldValue(`CreateDate${dateIndex2}`).format('YYYY-MM-DD')
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


                //   const avg1 = form.getFieldValue('AVG1') ? form.getFieldValue('AVG1') : '',
                //         avg2 = form.getFieldValue('AVG2') ? form.getFieldValue('AVG2') : '',
                //         avg3 = form.getFieldValue('AVG3') ? form.getFieldValue('AVG3') : '',
                //         avg4 = form.getFieldValue('AVG4') ? form.getFieldValue('AVG4') : '',
                //         avg5 = form.getFieldValue('AVG5') ? form.getFieldValue('AVG5') : '',
                //         avg6 = form.getFieldValue('AVG6') ? form.getFieldValue('AVG6') : '',
                //         avg7 = form.getFieldValue('AVG7') ? form.getFieldValue('AVG7') : '',
                //         avg8 = form.getFieldValue('AVG8') ? form.getFieldValue('AVG8') : '',
                //         avg9 = form.getFieldValue('AVG9') ? form.getFieldValue('AVG9') : '';
                let data = {
                    AddType: type,
                    MainTable: {
                        ...mainValue,
                        PointId: pointId,
                        PollutantCode: pollutantCode,
                        // AVG1: `${avg1},${avg4},${avg7}`,
                        // AVG2: `${avg2},${avg5},${avg8}`,
                        // AVG3: `${avg3},${avg6},${avg9}`,
                        // VelocityCoefficientAVG: form.getFieldValue('VelocityCoefficientAVG'),
                        // Evaluation: form.getFieldValue('Evaluation'),
                        // StandardDeviation: form.getFieldValue('StandardDeviation'),
                        // RelativeDeviation: form.getFieldValue('RelativeDeviation'),
                    },
                    ChildTable: [],
                }
                let dateArr = [];
                if (recordType == 1) {
                    tableDatas.map((item, index) => {
                        if ((index + 1) % 6 != 0) {
                            dateArr.push({
                                Sort: index,
                                CreateDate: index <= 5 ? values[`CreateDate0`] && values[`CreateDate0`].format('YYYY-MM-DD 00:00:00') : index > 5 && index <= 11 ? values[`CreateDate6`] && values[`CreateDate6`].format('YYYY-MM-DD 00:00:00') : values[`CreateDate12`] && values[`CreateDate12`].format('YYYY-MM-DD 00:00:00'),
                                BTime: index <= 5 ? values[`CreateDate0`] && values[`BTime${index}`] && `${values[`CreateDate0`].format('YYYY-MM-DD')} ${values[`BTime${index}`].format('HH:mm:00')}` : index > 5 && index <= 11 ? values[`CreateDate6`] && values[`BTime${index}`] && `${values[`CreateDate6`].format('YYYY-MM-DD')} ${values[`BTime${index}`].format('HH:mm:00')}` : values[`CreateDate12`] && values[`BTime${index}`] && `${values[`CreateDate12`].format('YYYY-MM-DD')} ${values[`BTime${index}`].format('HH:mm:00')}`,
                                ETime: index <= 5 ? values[`CreateDate0`] && values[`ETime${index}`] && `${values[`CreateDate0`].format('YYYY-MM-DD')} ${values[`ETime${index}`].format('HH:mm:00')}` : index > 5 && index <= 11 ? values[`CreateDate6`] && values[`BTime${index}`] && `${values[`CreateDate6`].format('YYYY-MM-DD')} ${values[`ETime${index}`].format('HH:mm:00')}` : values[`CreateDate12`] && values[`ETime${index}`] && `${values[`CreateDate12`].format('YYYY-MM-DD')} ${values[`ETime${index}`].format('HH:mm:00')}`,
                                Manual: values[`Manual${index}`],
                                CEMSValue: values[`CEMSValue${index}`],
                                FactoryCoefficient: values[`FactoryCoefficient${index}`],
                            })

                        }
                    })

                } else {//带准确度
                    tableDatas2.map((item, index) => {
                        if ((index + 1) % 7 != 0 && (index + 2) % 7 != 0) {
                            dateArr.push({
                                Sort: index,
                                CreateDate: index <= 6 ? values[`CreateDate0`] && values[`CreateDate0`].format('YYYY-MM-DD 00:00:00') : index > 6 && index <= 12 ? values[`CreateDate7`] && values[`CreateDate7`].format('YYYY-MM-DD 00:00:00') : values[`CreateDate14`] && values[`CreateDate14`].format('YYYY-MM-DD 00:00:00'),
                                BTime: index <= 6 ? values[`CreateDate0`] && values[`BTime${index}`] && `${values[`CreateDate0`].format('YYYY-MM-DD')} ${values[`BTime${index}`].format('HH:mm:00')}` : index > 6 && index <= 12 ? values[`CreateDate7`] && values[`BTime${index}`] && `${values[`CreateDate7`].format('YYYY-MM-DD')} ${values[`BTime${index}`].format('HH:mm:00')}` : values[`CreateDate14`] && values[`BTime${index}`] && `${values[`CreateDate14`].format('YYYY-MM-DD')} ${values[`BTime${index}`].format('HH:mm:00')}`,
                                ETime: index <= 6 ? values[`CreateDate0`] && values[`ETime${index}`] && `${values[`CreateDate0`].format('YYYY-MM-DD')} ${values[`ETime${index}`].format('HH:mm:00')}` : index > 6 && index <= 12 ? values[`CreateDate7`] && values[`BTime${index}`] && `${values[`CreateDate7`].format('YYYY-MM-DD')} ${values[`ETime${index}`].format('HH:mm:00')}` : values[`CreateDate14`] && values[`ETime${index}`] && `${values[`CreateDate14`].format('YYYY-MM-DD')} ${values[`ETime${index}`].format('HH:mm:00')}`,
                                Manual: values[`Manual${index}`],
                                CEMSValue: values[`CEMSValue${index}`],
                                FactoryCoefficient: values[`FactoryCoefficient${index}`],
                            })

                        }
                    })
                }
                data.ChildTable = dateArr;
                props.addVelocityFieldCheckingRecord(data, (isSuccess) => {
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
        props.deleteVelocityFieldCheckingRecord({
            ID: form.getFieldValue('ID'),
            PollutantCode: pollutantCode,
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
                    <Form.Item label="CEMS原理" name="CEMSPrinciple" >
                        <Input disabled placeholder='请输入' allowClear />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item label="参比仪器厂商" name="InstrumentPlant">
                        <Input disabled placeholder='请输入' allowClear />
                    </Form.Item>
                </Col>
                <Col span={4}></Col>
                <Col span={8}>
                    <Form.Item label="型号、编号" name="InstrumentModel" >
                        <Input disabled placeholder='请输入' allowClear />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item label="参比方法计量单位" name="PMUnit">
                        <Input disabled placeholder='请输入' allowClear />
                    </Form.Item>
                </Col>
                <Col span={4}></Col>
                <Col span={8}>
                    <Form.Item label="CEMS计量单位" name="Unit" >
                        <Input disabled placeholder='请输入' allowClear />
                    </Form.Item>
                </Col>
                <Col span={20}>
                    <Form.Item label="参比方法原理" name="ReferencePrinciple" >
                        <Input disabled placeholder='请输入' allowClear />
                    </Form.Item>
                </Col>
                <Form.Item name="ID" hidden>
                    <Input />
                </Form.Item>
            </Row>
        </>
    }
    const [fileList, setFileList] = useState([]);
    const uploadProps = {

        beforeUpload: (file) => {
            setFileList([]);
            setTimeout(() => {
                setFileList([file]);
            })
            return false;
        },
        onRemove: (file) => {
            const index = fileList.indexOf(file);
            const newFileList = fileList.slice();
            newFileList.splice(index, 1);
            setFileList(newFileList);
        },
        fileList,
    };

    const [importVisible, setImportVisible] = useState(false)
    const importVisibleChange = (newVisible) => {
        setImportVisible(newVisible);
    };
    const [uploading, setUploading] = useState(false)
    const [importReturnData, setImportReturnData] = useState([])
    const [mergeData, setMergeData] = useState([])

    const importOK = (value) => {
        if (!value.rowVal || !value.colVal) {
            message.warning('请输入行数和列数')
            return;
        }
        if (fileList.length <= 0) {
            message.warning('请上传文件')
            return;
        }
        setIsReg(false)
        setIsTimeReg(true)
        setTimeout(() => {
            form.validateFields().then((values) => {
                const timeData = []


                let index1, index2, dateNum;
                if (recordType == 1) {
                    index1 = 6, index2 = 12, dateNum = tableDatas.length - 2;
                } else {
                    index1 = 7, index2 = 14, dateNum = tableDatas2.length - 3;
                }
                let i = -1;
                Object.keys(values).map((item, index) => {


                    if (/Time/g.test(item)) {
                        i++;
                        if (i < index1) {
                            if (values['CreateDate0'] && form.getFieldValue(`BTime${i}`) && form.getFieldValue(`ETime${i}`)) {
                                timeData.push(`${moment(values['CreateDate0']).format('YYYY-MM-DD')} ${moment(form.getFieldValue(`BTime${i}`)).format('HH:mm')},${moment(values['CreateDate0']).format('YYYY-MM-DD')} ${moment(form.getFieldValue(`ETime${i}`)).format('HH:mm')},${i}|`)
                            }
                        } else if (i >= index1 && i < index2) {
                            if (values[`CreateDate${index1}`] && form.getFieldValue(`BTime${i}`) && form.getFieldValue(`ETime${i}`)) {
                                timeData.push(`${moment(values[`CreateDate${index1}`]).format('YYYY-MM-DD')} ${moment(form.getFieldValue(`BTime${i}`)).format('HH:mm')},${moment(values[`CreateDate${index1}`]).format('YYYY-MM-DD')} ${moment(form.getFieldValue(`ETime${i}`)).format('HH:mm')},${i}|`)
                            }
                        } else {
                            if (values[`CreateDate${index2}`] && form.getFieldValue(`BTime${i}`) && form.getFieldValue(`ETime${i}`)) {
                                i == dateNum ? timeData.push(`${moment(values[`CreateDate${index2}`]).format('YYYY-MM-DD')} ${moment(form.getFieldValue(`BTime${i}`)).format('HH:mm')},${moment(values[`CreateDate${index2}`]).format('YYYY-MM-DD')} ${moment(form.getFieldValue(`ETime${i}`)).format('HH:mm')},${i}`) : timeData.push(`${moment(values[`CreateDate${index2}`]).format('YYYY-MM-DD')} ${moment(form.getFieldValue(`BTime${i}`)).format('HH:mm')},${moment(values[`CreateDate${index2}`]).format('YYYY-MM-DD')} ${moment(form.getFieldValue(`ETime${i}`)).format('HH:mm')},${i}|`)
                            }
                        }
                    }
                })
                const formData = new FormData();
                fileList.forEach((file) => {
                    formData.append('files', file);
                });
                formData.append('firstRow', value.rowVal);
                formData.append('firstColumn', value.colVal);
                formData.append('PollutantCode', pollutantCode);
                formData.append('TimeList', timeData.toString().replaceAll('|,', '|'));
                setUploading(true);
                fetch('/api/rest/PollutantSourceApi/TaskFormApi/ImportDataNew', {
                    method: 'POST',
                    body: formData,
                    headers: {
                        Authorization: "Bearer " + Cookie.get(config.cookieName),

                    },

                }).then((res) => res.json()).then((data) => {
                    setUploading(false);
                    if (data.IsSuccess) {
                        setFileList([]);
                        setImportVisible(false)
                        message.success('导入成功');
                        let mergeData3 = [];
                        let resData = data.Datas ? data.Datas : [];
                        if (!importReturnData || !importReturnData[0]) {//首次导入
                            setImportReturnData(resData)
                            setMergeData(resData);
                            mergeData3 = resData;
                        }
                        if (resData && resData[0] && importReturnData && importReturnData[0]) {
                            let mergeData = [], mergeData2 = [];
                            mergeData = importReturnData.map((item1) => {
                                return {
                                    ...item1, ...resData.find((item2) => { // 合并key相同的对象
                                        return item1['key'] === item2['key']
                                    })
                                }
                            })

                            let list = resData.map(item => item.key)
                            let list2 = importReturnData.map(item => item.key)
                            const differentKey = list.concat(list2).filter(function (v, i, arr) {
                                return arr.indexOf(v) === arr.lastIndexOf(v);
                            });
                            resData.filter((item) => { //取key不同的对象
                                differentKey.map(itemKey => {
                                    if (item.key === itemKey) {
                                        mergeData2.push(item)
                                    }
                                })
                            })
                            mergeData2 = [...mergeData, ...mergeData2]

                            mergeData3 = mergeData2.map((item1) => {
                                return {
                                    ...item1, ...mergeData.find((item2) => { // 合并key相同的对象
                                        return item1['key'] === item2['key']
                                    })
                                }
                            })

                        }

                        setImportReturnData(mergeData3)
                        setMergeData(mergeData3)
                        mergeData3.map((item, index) => {
                            if (item.times) {
                                let i = item.times.split(",")[2]
                                form.setFieldsValue({ [`CEMSValue${i}`]: item.values })
                                fieldcoefficientCalcula(i)
                            }
                        })
                    } else {
                        setUploading(false);
                        message.error(data.Message);
                    }
                }).catch(() => {
                    setUploading(false);
                })
            }).catch((errorInfo) => {
                console.log('Failed:', errorInfo);
                message.warning('请输入完整的时间')
                return;

            })
        })

    }
    const onValuesChange = (hangedValues, allValues) => {
    }

    const generateTimeData = (res) => {
        if (res && res[0]) {
            const data = [];
            res.map(item => {
                if (item.ChildList) { 
                    item.ChildList.map(item2 => { data.push({...item2,CreateDate:item2.BTime&&moment(item2.BTime).format('YYYY-MM-DD 00:00:00')} ) })
                }
            })
            data.map((item, index) => {
                if (recordType == 1) {
                   let index1 = 5, index2 = 11;
                    if (index == index1 || index == index2) {
                        data.splice(index,0,'平均值') 
                    }
                } else {
                    let index1 = 5, index2 = 12;
                    if (index == index1 || index == index2) {
                        data.splice(index,0,'平均值', '相对误差（%）')
                    }
                }
            })
            data.map((item, index) => {
                console.log(item)     
                form.setFieldsValue({
                    [`CreateDate${index}`]: item.CreateDate && moment(item.CreateDate),
                    [`BTime${index}`]: item.BTime && moment(item.BTime),
                    [`ETime${index}`]: item.ETime && moment(item.ETime),
                })
            })      

        }
    }
    return (
        <div className={styles.totalContentSty}>
            <Spin spinning={formLoading}>
                <BtnComponents {...props} isImport importLoading={uploading} saveLoading1={saveLoading1} saveLoading2={saveLoading2} delLoading={props.delLoading} importOK={importOK} uploadProps={uploadProps} importVisible={importVisible} submits={submits} clears={clears} del={del} importVisibleChange={importVisibleChange} />
                <GenerateTime pointId={pointId} pollutantCode={pollutantCode} generateTimeData={generateTimeData} />
                <Form
                    form={form}
                    name="advanced_search"
                    initialValues={{}}
                    className={styles["ant-advanced-search-form"]}
                    onValuesChange={onValuesChange}
                >
                    <SearchComponents />
                    {recordType == 1 ? <Table
                        size="small"
                        loading={tableLoading}
                        bordered
                        dataSource={tableDatas}
                        columns={columns}
                        pagination={false}
                        className={'tableSty'}
                    /> :
                        <Table
                            size="small"
                            loading={tableLoading}
                            bordered
                            dataSource={tableDatas2}
                            columns={accuracyColumns}
                            pagination={false}
                            className={'tableSty'}
                        />}
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