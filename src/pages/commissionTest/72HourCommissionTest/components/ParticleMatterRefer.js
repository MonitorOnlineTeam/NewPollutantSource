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
import { getSum, getAve, interceptTwo, numVerify,arrDistinctByProp, } from '@/utils/utils'
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
    formLoading: loading.effects[`${namespace}/getPMReferenceCalibrationRecord`],
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


    const [tableDatas,setTableDatas] = useState([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]);

    const [form] = Form.useForm();



    const { pointId, tableLoading, formLoading, } = props;


    const [recordName, setRecordName] = useState()
    const [recordType, setRecordType] = useState()
    useEffect(() => {
        if(!pointId){ return }
        initData()
    }, [pointId]);
    const initData = () => {
        props.getPMReferenceCalibrationRecord({
            PointCode: pointId,
            PollutantCode: 502,
            RecordDate: "",
            Flag: ""
        }, (res) => {
            if (res) {
                setRecordName(res.RecordName)
                setRecordType(res.RecordType)
            }
            if (res && res.MainTable) {
                form.setFieldsValue({
                    ...res.MainTable
                })
                if(res.ChildTable){
                    const data  =[];
                    res.ChildTable.map(item=>{
                        if(item.ChildList){
                            item.ChildList.map(item2=>{
                                data.push(item2)
                            })
                        }  
                   })
                   data.map(item=>{
                    const index = item.Sort -1 ;
                      form.setFieldsValue({
                        [`CreateDate${index}`]: item.CreateDate&&moment(item.CreateDate),
                        [`BTime${index}`]: item.BTime&&moment(item.BTime),
                        [`ETime${index}`]: item.ETime&&moment(item.ETime),
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


        })
    }
    const disabledDate = (current) => {
        return current && current > moment().endOf('year') || current < moment().startOf('year');
    };

    const [autoDateFlag, setAutoDateFlag] = useState(true)
    const onDateChange = (type) => {
        const values = form.getFieldValue('CreateDate0')
        if (type == 'CreateDate0' && autoDateFlag) {
            form.setFieldsValue({
                CreateDate5: moment(moment(values).add('day', 1)),
                CreateDate10: moment(moment(values).add('day', 2)),
            })
            setAutoDateFlag(false)
        }
    }
    const onTimeChange = (index, type) => {
        const startTime = form.getFieldValue(`BTime${index}`)
        const endTime = form.getFieldValue(`ETime${index}`)
        if (endTime && startTime && endTime.valueOf() <= startTime.valueOf()) {
            message.warning('结束时间必须大于开始时间')
            if (type === 'start') {
                form.setFieldsValue({ [`BTime${index}`]: '' })
            } else {
                form.setFieldsValue({ [`ETime${index}`]: '' })
            }

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
                const number = index + 1 + 4;
                const obj = {
                    children: <Form.Item name={`CreateDate${index}`} rules={[{ required: isTimeReg, message: '' }]}><DatePicker disabledDate={disabledDate} onChange={() => onDateChange(`CreateDate${index}`)} format="MM-DD" /></Form.Item>,
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
                        return <Form.Item name={`BTime${index}`} rules={[{ required: isTimeReg, message: '' }]}><TimePicker defaultOpenValue={moment('00:00', 'HH:mm')} onChange={() => onTimeChange(index, 'start')} format='HH:mm' /></Form.Item>;
                    }
                },
                {
                    title: '结束',
                    align: 'center',
                    width: 140,
                    render: (text, record, index) => {
                        return <Form.Item name={`ETime${index}`} rules={[{ required: isTimeReg, message: '' }]}><TimePicker defaultOpenValue={moment('00:00', 'HH:mm')} onChange={() => onTimeChange(index, 'end')} format='HH:mm' /></Form.Item>;
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
                        return <Form.Item name={`MembraneNum${index}`} rules={[{ required: isReg, message: '' }]}><Input placeholder='请输入' /></Form.Item>;
                    }
                },
                {
                    title: '颗粒物重(mg)',
                    align: 'center',
                    render: (text, record, index) => {
                        return <Form.Item name={`PMWeight${index}`} rules={[{ required: isReg, message: '' }]}><InputNumber onBlur={() => weightVolumeBlur(index)} placeholder='请输入' /></Form.Item>;
                    }
                },
                {
                    title: '标况体积(NL)',
                    align: 'center',
                    render: (text, record, index) => {
                        return <Form.Item name={`BenchmarkVolume${index}`} rules={[{ required: isReg, message: '' }]}><InputNumber  onBlur={() => weightVolumeBlur(index)} placeholder='请输入' /></Form.Item>;
                    }
                },
                {
                    title: '标杆浓度(mg/m3)',
                    align: 'center',
                    render: (text, record, index) => {
                        return <Form.Item name={`BenchmarkDensity${index}`} rules={[{ required: isReg, message: '' }]}><InputNumber step='0.01' disabled placeholder='请输入' /></Form.Item>;
                    }
                },
                {
                    title: '工况浓度(mg/m3)',
                    align: 'center',
                    render: (text, record, index) => {
                        return <Form.Item name={`OperatingModeDensity${index}`} rules={[{ required: isReg, message: '' }]}><InputNumber step='0.001'  disabled placeholder='请输入' /></Form.Item>;
                    }
                },
            ]
        },
        {
            title: 'CEMS法',
            align: 'center',
            width:150,
            children: [
                {
                    title: '测量值(无量纲)',
                    align: 'center',
                    width:150,
                    render: (text, record, index) => {
                        return <Form.Item name={`MeasuredValue${index}`} rules={[{ required: isReg, message: '' }]}><InputNumber disabled step='0.001' placeholder='请导入' /></Form.Item>;
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
                    width:300,
                    render: () => {
                        return '评价依据'
                    }
                },

            ]
        },
        {
            title: <span>{form.getFieldValue('Equation')}</span>,
            align: 'center',
            children: [
                {
                    title: <span>{form.getFieldValue('ConfidenceHalfWidth')}</span>,
                    align: 'center',
                    render: (text, record, index) => {
                        const obj = {
                            children: <span>{form.getFieldValue('EvaluationBasis')}</span>,
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
                    width:300,
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
            title: <span>{form.getFieldValue('CorrelationCoefficient') }</span>,
            align: 'center', 
            children: [
                {
                    title: <span>{form.getFieldValue('AllowHalfWidth') }</span>,
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
            width:300,
            render: (text, record, index) => {
                return '评价'
            }
        },
        {
            title: <span>{form.getFieldValue('KCoefficient')}</span>,
            align: 'center',
            render: (text, record, index) => {
                return <span>{form.getFieldValue('EvaluationBasis')}</span>
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
                    type == 1 ? setSaveLoading1(true) : setSaveLoading2(true)

                    let mainValue = {...values}
                    Object.keys(mainValue).map((item, index) => { //去除主表 多余字段
                        if(/Time/g.test(item) || /ReferenceValue/g.test(item) || /MeasuredValue/g.test(item) || /AlignmentValue/g.test(item)){
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
                            Sort: item,
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
                    props.addPMReferenceCalibrationRecord(data,()=>{
                        type == 1? setSaveLoading1(false) : setSaveLoading2(false)
                        initData()
                    })
                }).catch((errorInfo) => {
                    console.log('Failed:', errorInfo);
                    message.warning('请输入完整的数据')
                    return;
                });
        })


    }

    const clears = () => {
        form.resetFields();
    }
    const del = () => {
        props.deletePMReferenceCalibrationRecord({
            ID:form.getFieldValue('ID'),
        },()=>{
            initData()
        })
    }


    const weightVolumeBlur = (index) => {
        const weight = form.getFieldValue(`PMWeight${index}`), volume = form.getFieldValue(`BenchmarkVolume${index}`);
        if (weight && volume) {

            const benchmarkDensity =  Number(interceptTwo(weight / volume * 1000))
            form.setFieldsValue({ [`BenchmarkDensity${index}`]: benchmarkDensity }) //标杆浓度
            const atmos = Number(form.getFieldValue('Atmos'))
                 
                   const   SDvalues  = Number(form.getFieldValue(`SDvalues${index}`)),
                           WDvalues  = Number( form.getFieldValue(`WDvalues${index}`)),
                           YLvalues  = Number(form.getFieldValue(`YLvalues${index}`));
                    if ((atmos||atmos==0) &&  (SDvalues ||SDvalues==0) && (WDvalues||WDvalues==0) && (YLvalues||YLvalues==0) && (benchmarkDensity||benchmarkDensity==0) ) {
                        const operatingModeDensity = benchmarkDensity * (273 / (273 + WDvalues)) * ((atmos + YLvalues) / 101325) * (1 - SDvalues)
                        form.setFieldsValue({ [`OperatingModeDensity${index}`]: operatingModeDensity.toFixed(3) }) //工况浓度
                    }
                  
                
        }
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
            <Row gutter={36}>
                <Col span={8}>
                    <Form.Item label="当前大气压" name="Atmos" rules={[{ required: isReg, message: '' }]}>
                        <Input placeholder='请输入' allowClear suffix="Pa" onKeyUp={(e) => { numCheck(e, 'Atmos') }} />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item label="空气过剩系数" name="AirCoefficient" rules={[{ required: isReg, message: '' }]}>
                        <InputNumber placeholder='请输入' allowClear />

                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item label="排放限值" name="EmissionLimits"  rules={[{ required: isReg, message: '' }]}>
                        <Input placeholder='请输入' allowClear suffix="mg/m3" onKeyup={(e) => { numCheck(e, 'EmissionLimits') }} />
                    </Form.Item>
                </Col>
            </Row>
            <Row justify='center' style={{ fontSize: 16, fontWeight: 'bold', paddingBottom: 16 }}>{recordName}</Row>
            <Row justify='center' className={styles['advanced_search_sty']}>
                <Col span={8}>
                    <Form.Item label="测试人员" name="Tester">
                        <Input placeholder='请输入' allowClear />
                    </Form.Item>
                </Col>
                <Col span={4}></Col>
                <Col span={8}>
                    <Form.Item label="CEMS生产厂" name="SysManufactorName" >
                        <Input placeholder='请输入' allowClear />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item label="测试地点" name="TestSite">
                        <Input placeholder='请输入' allowClear />
                    </Form.Item>
                </Col>
                <Col span={4}></Col>
                <Col span={8}>
                    <Form.Item label="CEMS型号、编号" name="SystemModelCEMSNum" >
                        <Input placeholder='请输入' allowClear />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item label="测试位置" name="TestLocation">
                        <Input placeholder='请输入' allowClear />
                    </Form.Item>
                </Col>
                <Col span={4}></Col>
                <Col span={8}>
                    <Form.Item label="参比仪器原理" name="Basis" >
                        <Input placeholder='请输入' allowClear />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item label="参比仪器生产厂" name="ReferenceManufactorName">
                        <Input placeholder='请输入' allowClear />
                    </Form.Item>
                </Col>
                <Col span={4}></Col>
                <Col span={8}>
                    <Form.Item label="型号、编号" name="ParamModelNum" >
                        <Input placeholder='请输入' allowClear />
                    </Form.Item>
                </Col>
                <Form.Item  name="ID" hidden>
                        <Input  />
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
        // setIsTimeReg(true)
        setTimeout(() => {
            form.validateFields().then((values) => {
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
                                i == tableDatas.length-1 ? timeData.push(`${moment(values['CreateDate10']).format('YYYY-MM-DD')} ${moment(form.getFieldValue(`BTime${i}`)).format('HH:mm')},${moment(values['CreateDate10']).format('YYYY-MM-DD')} ${moment(form.getFieldValue(`ETime${i}`)).format('HH:mm')},${i}`) : timeData.push(`${moment(values['CreateDate10']).format('YYYY-MM-DD')} ${moment(form.getFieldValue(`BTime${i}`)).format('HH:mm')},${moment(values['CreateDate10']).format('YYYY-MM-DD')} ${moment(form.getFieldValue(`ETime${i}`)).format('HH:mm')},${i}|`)
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
                setUploading(true);
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
                        let mergeData3=[];
                        let resData = data.Datas? data.Datas :[];
                        if(!importReturnData || !importReturnData[0]){//首次导入
                            setImportReturnData(resData) 
                            setMergeData(resData);
                            mergeData3 = resData;
                        }
                        if(resData&&resData[0]&&importReturnData&&importReturnData[0]){
                            let mergeData = [],mergeData2=[];
                               mergeData = importReturnData.map((item1) => {
                                  return {...item1, ...resData.find((item2) => { // 合并key相同的对象
                                    return item1['key'] === item2['key'] 
                                  })}
                                })
                                mergeData2 = importReturnData.filter((item1, index, arr) => { //取key不同的对象
                                    let list = resData.map(item2 => item2.key)

                                    return list.indexOf(item1.key) == -1
                                  })
                                 mergeData3= mergeData.map((item1) => {
                                    return {...item1, ...mergeData2.find((item2) => { // 合并key相同的对象
                                      return item1['key'] === item2['key'] 
                                    })}
                                })
    
                        }  

                        setImportReturnData(mergeData3) 
                        setMergeData(mergeData3) 
                        console.log(mergeData3)
                        mergeData3.map((item, index) => {
                            if(item.times){
                              let i = item.times.split(",")[2]
                              form.setFieldsValue({ [`MeasuredValue${i}`]: item.values })
                              form.setFieldsValue({ [`O2values${i}`]: item.O2values })
                              form.setFieldsValue({ [`WDvalues${i}`]: item.WDvalues })
                              form.setFieldsValue({ [`SDvalues${i}`]: item.SDvalues })
                              form.setFieldsValue({ [`YLvalues${i}`]: item.YLvalues })
                            }
                        })
                    } else {
                        message.error(data.Message)
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
                <BtnComponents isImport importLoading={uploading} saveLoading1={saveLoading1} saveLoading2={saveLoading2} importOK={importOK} uploadProps={uploadProps} importVisible={importVisible} submits={submits} clears={clears} del={del} importVisibleChange={importVisibleChange} />
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