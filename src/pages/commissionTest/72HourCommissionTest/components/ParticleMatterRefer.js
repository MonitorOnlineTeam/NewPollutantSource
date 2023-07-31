/**
 * 功  能：颗粒物参比
 * 创建人：jab
 * 创建时间：2022.08.11
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
const namespace = 'hourCommissionTest'




const dvaPropsData = ({ loading, hourCommissionTest, commissionTest, }) => ({
    formLoading: loading.effects[`${namespace}/getPMReferenceCalibrationRecord`],
    delLoading: loading.effects[`${namespace}/deletePMReferenceCalibrationRecord`],

})

const dvaDispatch = (dispatch) => {
    return {
        updateState: (payload) => {
            dispatch({
                type: `${namespace}/updateState`,
                payload: payload,
            })
        },
        importData: (payload, callback) => { //导入
            dispatch({
                type: `${namespace}/importData`,
                payload: payload,
                callback: callback
            })
        },
        getPMReferenceCalibrationRecord: (payload, callback) => { //参数回填
            dispatch({
                type: `${namespace}/getPMReferenceCalibrationRecord`,
                payload: payload,
                callback: callback
            })
        },
        addPMReferenceCalibrationRecord: (payload, callback) => { //保存 暂存
            dispatch({
                type: `${namespace}/addPMReferenceCalibrationRecord`,
                payload: payload,
                callback: callback
            })
        },
        deletePMReferenceCalibrationRecord: (payload, callback) => { //删除
            dispatch({
                type: `${namespace}/deletePMReferenceCalibrationRecord`,
                payload: payload,
                callback: callback
            })
        },
    }
}
const Index = (props) => {


    const [tableDatas, setTableDatas] = useState([1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5]);

    const [form] = Form.useForm();



    const { pointId, tableLoading, formLoading, } = props;


    const [recordName, setRecordName] = useState()
    const [recordType, setRecordType] = useState(1)
    useEffect(() => {
        if (!pointId) { return }
        initData()
    }, [pointId]);
    const initData = () => {
        props.getPMReferenceCalibrationRecord({
            PointCode: pointId,
            PollutantCode: 502,
            RecordDate: "",
            Flag: "",
        }, (res) => {
            if (res) {
                setRecordName(res.RecordName)
                setRecordType(res.RecordType)

                if (res.MainTable) {
                    form.resetFields();
                    setIsClears(false);

                    form.setFieldsValue({
                        ...res.MainTable
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
                            const index = item.Sort - 1;
                            form.setFieldsValue({
                                [`CreateDate${index}`]: item.CreateDate && moment(item.CreateDate),
                                [`BTime${index}`]: item.BTime && moment(item.BTime),
                                [`ETime${index}`]: item.ETime && moment(item.ETime),
                                [`MembraneNum${index}`]: item.MembraneNum,
                                [`PMWeight${index}`]: item.PMWeight,
                                [`BenchmarkVolume${index}`]: item.BenchmarkVolume,
                                [`BenchmarkDensity${index}`]: item.BenchmarkDensity,
                                [`OperatingModeDensity${index}`]: item.OperatingModeDensity,
                                [`MeasuredValue${index}`]: item.MeasuredValue,
                                [`O2values${index}`]: item.O2values,
                                [`WDvalues${index}`]: item.WDvalues,
                                [`SDvalues${index}`]: item.SDvalues,
                                [`YLvalues${index}`]: item.YLvalues,
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
        if (name == 'CreateDate0') {
            if (!values) {
                form.setFieldsValue({ CreateDate5: undefined, CreateDate10: undefined, })
                return;
            }
            form.setFieldsValue({
                CreateDate5: moment(moment(values).add('day', 1)),
                CreateDate10: moment(moment(values).add('day', 2)),
            })
            // setAutoDateFlag(false)
        }
    }
    const [warnArr, setWarnArr] = useState([])
    const onTimeChange = (index, type) => {
        // const startTime = form.getFieldValue(`BTime${index}`)
        // const endTime = form.getFieldValue(`ETime${index}`)
        // if (endTime && startTime && endTime.valueOf() <= startTime.valueOf()) {
        //     message.warning('结束时间必须大于开始时间')
        //     if (type === 'start') {
        //         form.setFieldsValue({ [`BTime${index}`]: '' })
        //     } else {
        //         form.setFieldsValue({ [`ETime${index}`]: '' })
        //     }
        // } else {
        //     const timeInterValue = form.getFieldValue('TimeIntervals')
        //     if (timeInterValue && startTime) { //间隔时间不为空
        //         const generatEndTime = moment(moment(startTime).add(timeInterValue, 'minutes'));
        //         if (type === 'start') {
        //             form.setFieldsValue({ [`ETime${index}`]: generatEndTime })
        //         } else {
        //             const { confirm } = Modal;
        //             if (moment(endTime).format('HH:mm') != moment(generatEndTime).format('HH:mm')) {
        //                 confirm({
        //                     content: '选择采样时长与前一样品不同，是否确认修改?',
        //                     okText: '确定',
        //                     cancelText: '取消',
        //                     centered:true,
        //                     onOk() {
        //                         console.log('OK');
        //                     },
        //                     onCancel() {
        //                         form.setFieldsValue({ [`ETime${index}`]: generatEndTime })
        //                     },
        //                 });
        //             }

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
        }, (startTimeVal, endTimeVal) => {
            const duration = endTimeVal - startTimeVal;

            if (duration && duration < 20) {
                props.timeComparWarnMessAlert('采样时长过短，请核实')
                setWarnArr([...warnArr, index])
                return
            }
            const list = warnArr.filter(item => item != index); setWarnArr(list)

            const startTimeData = form.getFieldValue(`BTime${index}`)
            const timeInterValue = form.getFieldValue('TimeIntervals')
            if (timeInterValue && startTime) { //间隔时间不为空
                const generatEndTime = moment(moment(startTimeData).add(timeInterValue - 1, 'minutes'));
                if (type === 'start') {
                    form.setFieldsValue({ [`ETime${index}`]: generatEndTime })
                } else {
                    const { confirm } = Modal;
                    if (moment(endTime).format('HH:mm') != moment(generatEndTime).format('HH:mm')) {
                        confirm({
                            content: '选择采样时长与前一样品不同，是否确认修改?',
                            okText: '确定',
                            cancelText: '取消',
                            centered: true,
                            onOk() {
                                console.log('OK');
                            },
                            onCancel() {
                                form.setFieldsValue({ [`ETime${index}`]: generatEndTime })
                            },
                        });
                    }

                }
            }
        })
    }
    const [isReg, setIsReg] = useState(false)
    const [isTimeReg, setIsTimeReg] = useState(false)

    const columns = [
        {
            title: '日期',
            align: 'center',
            width: 140,
            render: (text, record, index) => {
                const number = index + 1 + 4;
                const obj = {
                    children: <Form.Item className={styles.reqSty} name={`CreateDate${index}`} rules={[{ required: isTimeReg, message: '' }]}><DatePicker disabledDate={disabledDate} onChange={() => onDateChange(`CreateDate${index}`)} format="YYYY-MM-DD" /></Form.Item>,
                    props: { rowSpan: number % 5 == 0 ? 5 : 0 },
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
                        return <Form.Item className={styles.reqSty} name={`BTime${index}`} rules={[{ required: isTimeReg, message: '' }]}><TimePicker defaultOpenValue={moment('00:00', 'HH:mm')} onChange={() => onTimeChange(index, 'start')} format='HH:mm' /></Form.Item>;
                    }
                },
                {
                    title: '结束',
                    align: 'center',
                    width: 140,
                    render: (text, record, index) => {
                        return <Form.Item className={warnArr.includes(index) ? styles.warnSty : styles.reqSty} name={`ETime${index}`} rules={[{ required: isTimeReg, message: '' }]}><TimePicker defaultOpenValue={moment('00:00', 'HH:mm')} onChange={() => onTimeChange(index, 'end')} format='HH:mm' /></Form.Item>;
                    }
                },
            ]
        },
        {
            title: '参比方法',
            align: 'center',
            children: [
                {
                    title: '序号',
                    align: 'center',
                    width: 50,
                    render: (text, record, index) => {
                        return record;
                    }
                },
                {
                    title: '滤筒/滤膜编号',
                    align: 'center',
                    render: (text, record, index) => {
                        return <Form.Item className={styles.reqSty} name={`MembraneNum${index}`} rules={[{ required: isReg, message: '' }]}><Input placeholder='请输入' /></Form.Item>;
                    }
                },
                {
                    title: '颗粒物重(mg)',
                    align: 'center',
                    render: (text, record, index) => {
                        return <Form.Item className={styles.reqSty} name={`PMWeight${index}`} rules={[{ required: isReg, message: '' }]}><InputNumber step='0.01' onBlur={() => weightVolumeBlur(index)} placeholder='请输入' /></Form.Item>;
                    }
                },
                {
                    title: '标况体积(NL)',
                    align: 'center',
                    render: (text, record, index) => {
                        return <Form.Item className={styles.reqSty} name={`BenchmarkVolume${index}`} rules={[{ required: isReg, message: '' }]}><InputNumber step='0.01' onBlur={() => weightVolumeBlur(index)} placeholder='请输入' /></Form.Item>;
                    }
                },
                {
                    title: '标干浓度(mg/m3)',
                    align: 'center',
                    render: (text, record, index) => {
                        return <Form.Item className={styles.importSty} name={`BenchmarkDensity${index}`} rules={[{ required: isReg, message: '' }]}><InputNumber step='0.01' disabled /></Form.Item>;
                    }
                },
                {
                    title: '工况浓度(mg/m3)',
                    align: 'center',
                    render: (text, record, index) => {
                        return <Form.Item className={styles.calculaSty} name={`OperatingModeDensity${index}`} rules={[{ required: isReg, message: '' }]}><InputNumber step='0.01' disabled /></Form.Item>;
                    }
                },
            ]
        },
        {
            title: 'CEMS法',
            align: 'center',
            width: 150,
            children: [
                {
                    title: '测定值(无量纲)',
                    align: 'center',
                    width: 150,
                    render: (text, record, index) => {
                        return <Form.Item className={styles.importSty} name={`MeasuredValue${index}`} rules={[{ required: isReg, message: '' }]}><InputNumber step='0.01' disabled placeholder='请导入' /></Form.Item>;
                    }
                },
            ]
        },
    ];

    const columns2 = () => [
        {
            title: '一元线性方程',
            align: 'center',
            children: [
                {
                    title: '置信区间半宽',
                    align: 'center',
                    width: 300,
                    render: () => {
                        return '评价依据'
                    }
                },

            ]
        },
        {
            title: <span>{!isClears && form.getFieldValue('Equation') != 0 && form.getFieldValue('Equation')}</span>,
            align: 'center',
            children: [
                {
                    title: <span style={{ color: '#fff', padding: !isClears && form.getFieldValue('ConfidenceHalfWidth') && 4, background: form.getFieldValue('Col2') == 1 ? '#73d13d' : '#ff4d4f' }}>{!isClears && form.getFieldValue('ConfidenceHalfWidth')}</span >,
                    align: 'center',
                    render: (text, record, index) => {
                        const evaluationArr = !isClears && form.getFieldValue('Evaluation') && form.getFieldValue('Evaluation').split(';')

                        const col1 = form.getFieldValue('Col1'), col2 = form.getFieldValue('Col2'), col3 = form.getFieldValue('Col3');
                        let evaluation1, evaluation2, evaluation3;
                        if (evaluationArr) {
                            evaluation1 = evaluationArr[0];
                            evaluation2 = evaluationArr[1];
                            evaluation3 = evaluationArr[2];
                        }
                        const obj = {
                            children: <ol style={{ textAlign: 'left' }}>
                                <li style={{ lineHeight: '24px', margin: 4 }}> <span style={{ color: '#fff', padding: evaluation1 && 4, background: col1 == 1 ? '#73d13d' : '#ff4d4f', }}>{evaluation1}</span></li>
                                <li style={{ lineHeight: '24px', margin: 4 }}> <span style={{ color: '#fff', padding: evaluation2 && 4, background: col2 == 1 ? '#73d13d' : '#ff4d4f', }}>{evaluation2}</span></li>
                                <li style={{ lineHeight: '24px', margin: 4 }}> <span style={{ color: '#fff', padding: evaluation3 && 4, background: col3 == 1 ? '#73d13d' : '#ff4d4f', }}>{evaluation3}</span> </li>
                            </ol>,
                            props: { colSpan: 3 },
                        };
                        return obj;
                    }
                },


            ]
        },
        {
            title: '相关系数',
            align: 'center',
            children: [
                {
                    title: '允许区间半宽',
                    width: 300,
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
        {
            title: <span style={{ color: '#fff', padding: !isClears && form.getFieldValue('CorrelationCoefficient') && 4, background: form.getFieldValue('Col1') == 1 ? '#73d13d' : '#ff4d4f' }}>{!isClears && form.getFieldValue('CorrelationCoefficient')}</span>,
            align: 'center',
            children: [
                {
                    title: <span style={{ color: '#fff', padding: !isClears && form.getFieldValue('AllowHalfWidth') && 4, background: form.getFieldValue('Col3') == 1 ? '#73d13d' : '#ff4d4f' }}>{!isClears && form.getFieldValue('AllowHalfWidth')}</span>,
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
    const columns3 = () => [
        {
            title: 'K系数',
            align: 'center',
            width: 300,
            render: (text, record, index) => {
                return '评价'
            }
        },
        {
            title: <span>{!isClears && form.getFieldValue('KCoefficient')}</span>,
            align: 'center',
            render: (text, record, index) => {
                return <span>{!isClears && form.getFieldValue('EvaluationBasis')}</span>
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
                    const date1 = form.getFieldValue('CreateDate0').format('YYYY-MM-DD')
                    const date2 = form.getFieldValue(`CreateDate5`).format('YYYY-MM-DD')
                    const date3 = form.getFieldValue(`CreateDate10`).format('YYYY-MM-DD')
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
                        PointId: pointId
                    },
                    ChildTable: [],
                }
                data.ChildTable = tableDatas.map((item, index) => {
                    return {
                        Sort: index + 1,
                        CreateDate: index <= 4 ? values[`CreateDate0`] && values[`CreateDate0`].format('YYYY-MM-DD 00:00:00') : index > 4 && index <= 9 ? values[`CreateDate5`] && values[`CreateDate5`].format('YYYY-MM-DD 00:00:00') : values[`CreateDate10`] && values[`CreateDate10`].format('YYYY-MM-DD 00:00:00'),
                        BTime: index <= 4 ? values[`CreateDate0`] && values[`BTime${index}`] && `${values[`CreateDate0`].format('YYYY-MM-DD')} ${values[`BTime${index}`].format('HH:mm:00')}` : index > 4 && index <= 9 ? values[`CreateDate5`] && values[`BTime${index}`] && `${values[`CreateDate5`].format('YYYY-MM-DD')} ${values[`BTime${index}`].format('HH:mm:00')}` : values[`CreateDate10`] && values[`BTime${index}`] && `${values[`CreateDate10`].format('YYYY-MM-DD')} ${values[`BTime${index}`].format('HH:mm:00')}`,
                        ETime: index <= 4 ? values[`CreateDate0`] && values[`ETime${index}`] && `${values[`CreateDate0`].format('YYYY-MM-DD')} ${values[`ETime${index}`].format('HH:mm:00')}` : index > 4 && index <= 9 ? values[`CreateDate5`] && values[`BTime${index}`] && `${values[`CreateDate5`].format('YYYY-MM-DD')} ${values[`ETime${index}`].format('HH:mm:00')}` : values[`CreateDate10`] && values[`ETime${index}`] && `${values[`CreateDate10`].format('YYYY-MM-DD')} ${values[`ETime${index}`].format('HH:mm:00')}`,
                        MembraneNum: values[`MembraneNum${index}`],
                        PMWeight: values[`PMWeight${index}`],
                        BenchmarkVolume: values[`BenchmarkVolume${index}`],
                        BenchmarkDensity: values[`BenchmarkDensity${index}`],
                        OperatingModeDensity: values[`OperatingModeDensity${index}`],
                        MeasuredValue: values[`MeasuredValue${index}`],
                        O2values: form.getFieldValue([`O2values${index}`]),
                        WDvalues: form.getFieldValue([`WDvalues${index}`]),
                        SDvalues: form.getFieldValue([`SDvalues${index}`]),
                        YLvalues: form.getFieldValue([`YLvalues${index}`]),
                    }

                })
                props.addPMReferenceCalibrationRecord(data, (isSuccess) => {
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
        props.deletePMReferenceCalibrationRecord({
            ID: form.getFieldValue('ID'),
        }, () => {
            initData()
        })
    }

    const [weightVolumeAsk, setWeightVolumeAsk] = useState([])
    const weightVolumeBlur = (index) => {
        const weight = form.getFieldValue(`PMWeight${index}`), volume = form.getFieldValue(`BenchmarkVolume${index}`);
        if (weight && volume) {
            if (weight >= 1 || volume >= 1000) {
                operatingCalcula(index)
            } else {
                props.timeComparWarnMessAlert('颗粒物重≥1mg，采样体积≥1000NL，二者至少满足其一')
                form.setFieldsValue({
                    [`PMWeight${index}`]: '',
                    [`BenchmarkVolume${index}`]: '',
                })
            }

        }
    }

    const operatingCalcula = (index) => {
        const weight = form.getFieldValue(`PMWeight${index}`), volume = form.getFieldValue(`BenchmarkVolume${index}`);
        if (weight && volume) {
            const benchmarkDensity = (weight / volume * 1000).toFixed(2) && Number((weight / volume * 1000).toFixed(2))
            form.setFieldsValue({ [`BenchmarkDensity${index}`]: benchmarkDensity }) //标杆浓度
            const atmos = form.getFieldValue('Atmos')
            const SDvalues = form.getFieldValue(`SDvalues${index}`) && Number(form.getFieldValue(`SDvalues${index}`)),
                WDvalues = form.getFieldValue(`WDvalues${index}`) && Number(form.getFieldValue(`WDvalues${index}`)),
                YLvalues = form.getFieldValue(`YLvalues${index}`) && Number(form.getFieldValue(`YLvalues${index}`));

            if ((atmos || atmos == 0) && (SDvalues || SDvalues == 0) && (WDvalues || WDvalues == 0) && (YLvalues || YLvalues == 0) && (benchmarkDensity || benchmarkDensity == 0)) {
                const operatingModeDensity = benchmarkDensity * (273 / (273 + Number(WDvalues))) * ((Number(atmos) + Number(YLvalues)) / 101325) * (1 - ((SDvalues / 100).toFixed(4)))
                form.setFieldsValue({ [`OperatingModeDensity${index}`]: operatingModeDensity.toFixed(2) }) //工况浓度
            } else {
                form.setFieldsValue({ [`OperatingModeDensity${index}`]: undefined })
            }


        } else {
            form.setFieldsValue({ [`BenchmarkDensity${index}`]: undefined })
            form.setFieldsValue({ [`OperatingModeDensity${index}`]: undefined })
        }
    }

    const operatingCalculaTotal = () => {
        tableDatas.map((item, index) => { //统一计算工况浓度
            operatingCalcula(index)
        })
    }
    const numCheck = (e, name, min) => {
        const value = e.target.value
        if (value) {
            numVerify(value, (data) => {
                if (min) {
                    if (data <= min) {
                        form.setFieldsValue({ [name]: '' })
                        return;
                    }
                }
                form.setFieldsValue({ [name]: data })
            })
        }

    }
    const [conversionVal, setConversionVal] = useState(1)
    const conversionChange = (value) => { //是否折算
        setConversionVal(value)
    }
    const SearchComponents = () => {
        return <>
            <Row gutter={36}>
                <Col span={recordType == 1 ? conversionVal == 1 ? 6 : 8 : 24}>
                    <Form.Item className={styles.reqSty} label="当地大气压" name="Atmos" rules={[{ required: isReg, message: '' }]}>
                        <Input placeholder='请输入' allowClear suffix="Pa" onBlur={operatingCalculaTotal} onKeyUp={(e) => { numCheck(e, 'Atmos') }} />
                    </Form.Item>
                </Col>
                {recordType == 1 && <>
                    <Col span={conversionVal == 1 ? 6 : 8}>
                        <Form.Item label="是否折算">
                            <Select value={conversionVal} onChange={conversionChange}>
                                <Option value={1}>折算</Option>
                                <Option value={2}>不折算</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    {conversionVal == 1 && <Col span={6}>
                        <Form.Item className={styles.reqSty} label="空气过剩系数" name="AirCoefficient" rules={[{ required: isReg, message: '' }]}>
                            <InputNumber step='0.01' placeholder='请输入' allowClear />
                        </Form.Item>
                    </Col>}
                    <Col span={conversionVal == 1 ? 6 : 8}>
                        <Form.Item className={styles.reqSty} label="排放限值" name="EmissionLimits" rules={[{ required: isReg, message: '' }]}>
                            <Input placeholder='请输入' suffix="mg/m3" onKeyUp={(e) => { numCheck(e, 'EmissionLimits') }} allowClear />
                        </Form.Item>
                    </Col></>}
            </Row>
            <Row gutter={36} className={styles.particleMatterReferTimeSty}>
                <Col span={recordType == 1 ? conversionVal == 1 ? 6 : 8 : 24}>
                    <Form.Item label="采样时长" name="TimeIntervals" rules={[{ required: false, message: '' }]}>
                        <Input placeholder='请输入' suffix="min" onKeyUp={(e) => { numCheck(e, 'TimeIntervals', '0') }} allowClear />{/* style={{width:recordType==1? '100%' : '282px'}} */}
                    </Form.Item>
                </Col>
            </Row>
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
                    <Form.Item label="参比仪器原理" name="ReferencePrinciple" >
                        <Input disabled placeholder='请输入' allowClear />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item label="参比仪器生产厂" name="InstrumentPlant">
                        <Input disabled placeholder='请输入' allowClear />
                    </Form.Item>
                </Col>
                <Col span={4}></Col>
                <Col span={8}>
                    <Form.Item label="型号、编号" name="InstrumentModel" >
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
                setUploading(true);
                const timeData = []
                let i = -1;
                Object.keys(values).map((item, index) => {
                    if (/Time/g.test(item)) {
                        i++;
                        if (i < 5) {
                            if (values['CreateDate0'] && form.getFieldValue(`BTime${i}`) && form.getFieldValue(`ETime${i}`)) {
                                timeData.push(`${moment(values['CreateDate0']).format('YYYY-MM-DD')} ${moment(form.getFieldValue(`BTime${i}`)).format('HH:mm')},${moment(values['CreateDate0']).format('YYYY-MM-DD')} ${moment(form.getFieldValue(`ETime${i}`)).format('HH:mm')},${i}|`)
                            }
                        } else if (i >= 5 && i < 10) {
                            if (values['CreateDate5'] && form.getFieldValue(`BTime${i}`) && form.getFieldValue(`ETime${i}`)) {
                                timeData.push(`${moment(values['CreateDate5']).format('YYYY-MM-DD')} ${moment(form.getFieldValue(`BTime${i}`)).format('HH:mm')},${moment(values['CreateDate5']).format('YYYY-MM-DD')} ${moment(form.getFieldValue(`ETime${i}`)).format('HH:mm')},${i}|`)
                            }
                        } else {
                            if (values['CreateDate10'] && form.getFieldValue(`BTime${i}`) && form.getFieldValue(`ETime${i}`)) {
                                i == tableDatas.length - 1 ? timeData.push(`${moment(values['CreateDate10']).format('YYYY-MM-DD')} ${moment(form.getFieldValue(`BTime${i}`)).format('HH:mm')},${moment(values['CreateDate10']).format('YYYY-MM-DD')} ${moment(form.getFieldValue(`ETime${i}`)).format('HH:mm')},${i}`) : timeData.push(`${moment(values['CreateDate10']).format('YYYY-MM-DD')} ${moment(form.getFieldValue(`BTime${i}`)).format('HH:mm')},${moment(values['CreateDate10']).format('YYYY-MM-DD')} ${moment(form.getFieldValue(`ETime${i}`)).format('HH:mm')},${i}|`)
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
                formData.append('PollutantCode', '');
                formData.append('TimeList', timeData.toString().replaceAll('|,', '|'));
                fetch('/api/rest/PollutantSourceApi/TaskFormApi/ImportData', {
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
                            // mergeData2 = importReturnData.filter((item1, index, arr) => { //取key不同的对象
                            //     let list = resData.map(item2 => item2.key)

                            //     return list.indexOf(item1.key) == -1
                            //   })
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
                                form.setFieldsValue({ [`MeasuredValue${i}`]: item.values })
                                form.setFieldsValue({ [`O2values${i}`]: item.O2values })
                                form.setFieldsValue({ [`WDvalues${i}`]: item.WDvalues })
                                form.setFieldsValue({ [`SDvalues${i}`]: item.SDvalues })
                                form.setFieldsValue({ [`YLvalues${i}`]: item.YLvalues })
                                operatingCalcula(i);
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
    return (
        <div className={styles.totalContentSty}>
            <Spin spinning={formLoading}>
                <BtnComponents {...props} {...props} isImport isPm importLoading={uploading} saveLoading1={saveLoading1} saveLoading2={saveLoading2} delLoading={props.delLoading} importOK={importOK} uploadProps={uploadProps} importVisible={importVisible} submits={submits} clears={clears} del={del} importVisibleChange={importVisibleChange} />
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
                        columns={recordType == 1 ? columns2() : columns3()}
                        pagination={false}
                        className={'white-table-thead tableSty'}
                    />
                </Form>
            </Spin>
        </div>
    );
};
export default connect(dvaPropsData, dvaDispatch)(Index);