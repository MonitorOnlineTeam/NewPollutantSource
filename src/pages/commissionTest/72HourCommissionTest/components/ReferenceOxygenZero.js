/**
 * 功  能：参比方法评估气态污染物CEMS（含氧量）准确度
 * 创建人：jab
 * 创建时间：2022.08.11
 */
import React, { useState, useEffect, Fragment } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Tag, Typography, TimePicker, Empty, Card, Popover, Button, Select, message, Row, Col, Tooltip, Divider, Modal, DatePicker, Radio, Spin, } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined, UpOutlined, DownOutlined, ExportOutlined } from '@ant-design/icons';
import { connect } from "dva";
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
const { RangePicker } = DatePicker;
import { DelIcon, DetailIcon, EditIcon, PointIcon } from '@/utils/icon'
import { getSum, getAve, interceptTwo, numVerify, arrDistinctByProp, } from '@/utils/utils'
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
    pollutantLoading: loading.effects[`${namespace}/get72TestRecordPollutant`],
    timeLoading: loading.effects[`${namespace}/getTimesListByPollutant`],

})

const dvaDispatch = (dispatch) => {
    return {
        updateState: (payload) => {
            dispatch({
                type: `${namespace}/updateState`,
                payload: payload,
            })
        },
        get72TestRecordPollutant: (payload, callback) => { //获取污染物
            dispatch({
                type: `${namespace}/get72TestRecordPollutant`,
                payload: payload,
                callback: callback
            })
        },
        getTimesListByPollutant: (payload, callback) => { //根据污染物获取时间
            dispatch({
                type: `${namespace}/getTimesListByPollutant`,
                payload: payload,
                callback: callback
            })
        },
        getGasReferenceMethodAccuracyRecord: (payload, callback) => { //获取
            dispatch({
                type: `${namespace}/getGasReferenceMethodAccuracyRecord`,
                payload: payload,
                callback: callback
            })
        },
        addGasReferenceMethodAccuracyInfo: (payload, callback) => { //初始添加
            dispatch({
                type: `${namespace}/addGasReferenceMethodAccuracyInfo`,
                payload: payload,
                callback: callback
            })
        },
        addGasReferenceMethodAccuracyRecord: (payload, callback) => { //添加或修改 保存、暂存
            dispatch({
                type: `${namespace}/addGasReferenceMethodAccuracyRecord`,
                payload: payload,
                callback: callback
            })
        },
        deleteGasReferenceMethodAccuracyRecord: (payload, callback) => { //删除
            dispatch({
                type: `${namespace}/deleteGasReferenceMethodAccuracyRecord`,
                payload: payload,
                callback: callback
            })
        },

    }
}
const Index = (props) => {


    const [tableDatas, setTableDatas] = useState([]);

    const [form] = Form.useForm();



    const { pointId, pollutantLoading,timeLoading, } = props;


    const [recordName, setRecordName] = useState()
    const [formLoading, setFormLoading] = useState(false)


    const [pollOptions, setPollOptions] = useState([]);
    const [pollutantCode, setPollutantCode] = useState()


    const [dateOptions, setDateOptions] = useState([]);
    const [selectDate, setSelectDate] = useState()

    useEffect(() => {
        if(!pointId){ return }
        initData()
    }, [pointId]);
   
    const initData = (isDel) =>{
        props.get72TestRecordPollutant({
            PointCode: pointId,
            Flag: 1,
        }, (pollData, defaultPollCode) => {
            if (pollData[0]) {
                setPollOptions(pollData)
                setPollutantCode(defaultPollCode)
                getTimeFormData(defaultPollCode,isDel);
            }

        })
    }
    const getTimeFormData = (pollCode,isDel) =>{
        setFormLoading(true)
        props.getTimesListByPollutant({
            PointCode: pointId,
            PollutantCode: pollCode,
        }, (dateData, defaultDateCode) => {
            if (dateData[0]) {
                setDateOptions(dateData)
                if(selectDate && !isDel){ //已选中的情况
                    setSelectDate(selectDate)
                    setFormLoading(false) 
                    return;
                }
                setSelectDate(defaultDateCode)
                getFormData(pollCode,defaultDateCode)
            }else{
                setFormLoading(false) 
                setDateOptions([])
                setSelectDate(undefined)
            }
        })
    }
    const getFormData = (pollCode,date,) => {
        props.getGasReferenceMethodAccuracyRecord({
            PointCode: pointId,
            PollutantCode: pollCode,
            RecordDate: date,
            Flag: "",
            ID: form.getFieldValue('ID'),
        }, (res) => {
            if (res) {
                form.resetFields();
                setRecordName(res.RecordName)
       
            if (res.MainTable) {
                form.setFieldsValue({
                    ...res.MainTable,
                    PollutantCode: pollCode,
                    StandardGasName:res.MainTable.PollutantName,
                })

  
            }
            if (res.ChildTable) {
                const data = res.ChildTable;
                const tableData = res.ChildTable.map(item=>item.Sort)
                setTableDatas(tableData)
             
                data.map(item => {
                    const index = item.Sort - 1;
                    form.setFieldsValue({
                        [`BTime${index}`]: item.BTime && moment(item.BTime),
                        [`ETime${index}`]: item.ETime && moment(item.ETime),
                        [`ReferenceValue${index}`]: item.ReferenceValue,
                        [`MeasuredValue${index}`]: item. MeasuredValue,
                        [`AlignmentValue${index}`]: item.AlignmentValue,
                    })
                })
            }
            setFormLoading(false)
        }
        })
    }
    const disabledDate = (current) => {
        return current && current > moment().endOf('year') || current < moment().startOf('year');
    };

    const [autoDateFlag, setAutoDateFlag] = useState(true)
5
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
    const renderContent = (value, index) => {
        const obj = {
            children: value,
            props: {},
        };
        if (index >= tableDatas.length) {
            obj.props.colSpan = 0;
        }
        return obj;
    };
    const columns = [
        {
            title: '编号',
            align: 'center',
            width: 150,
            render: (text, record, index) => {
                if (index < tableDatas.length) {
                    return text;
                } else {
                    let textata = '';
                    switch (index) {
                        case tableDatas.length:
                            textata = '平均值'
                            break;
                        case tableDatas.length+1:
                            textata = '绝对误差'
                            break;
                        case tableDatas.length+2:
                            textata = '相对误差'
                            break;
                        case tableDatas.length+3:
                            textata = '相对准确值'
                            break;
                        case tableDatas.length+4:
                            textata = '评价依据'
                            break;
                    }
                    return {
                        children: textata,
                        props: { colSpan: 3 },
                    };
                }

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
                        return renderContent(<Form.Item name={`BTime${index}`} rules={[{ required: isTimeReg, message: '' }]}><TimePicker defaultOpenValue={moment('00:00', 'HH:mm')} onChange={() => onTimeChange(index, 'start')} format='HH:mm' /></Form.Item>, index)
                    }
                },
                {
                    title: '结束',
                    align: 'center',
                    width: 140,
                    render: (text, record, index) => {
                        return renderContent(<Form.Item name={`ETime${index}`} rules={[{ required: isTimeReg, message: '' }]}><TimePicker defaultOpenValue={moment('00:00', 'HH:mm')} onChange={() => onTimeChange(index, 'end')} format='HH:mm' /></Form.Item>, index)

                    }
                },
            ]
        },

        {
            title: '参比方法测量值A',
            align: 'center',
            render: (text, record, index) => {
                if (index < tableDatas.length) {
                    return <Form.Item name={`ReferenceValue${index}`} rules={[{ required: isReg, message: '' }]}><InputNumber onBlur={() => measuredValBlur(index)} placeholder='请输入' /></Form.Item>
                } else if (index == tableDatas.length) {
                    return <span> {form.getFieldValue('ReferenceAvg')} </span>
                } else if (index >= tableDatas.length+1) {
                    let value;
                    if(index==tableDatas.length+1){  value = form.getFieldValue('AbsoluteError') }
                    if(index==tableDatas.length+2){  value = form.getFieldValue('RelativeError')}
                    if(index==tableDatas.length+3){  value = form.getFieldValue('RelativeAccuracy')  }
                    if(index==tableDatas.length+4){  value = form.getFieldValue('Evaluation') }
                    return {
                        children: <span> {value} </span>,
                        props: { colSpan: 3 },
                    };
                }

            }
        },
        {
            title: 'CEMS测量值B',
            align: 'center',
            render: (text, record, index) => {
                if (index < tableDatas.length) {
                    return <Form.Item name={`MeasuredValue${index}`} rules={[{ required: isReg, message: '' }]}><InputNumber disabled  placeholder='请导入' /></Form.Item>
                } else if (index == tableDatas.length) {
                    return <span> {form.getFieldValue('MeasuredAvg')} </span>
                } else if (index >= tableDatas.length+1) {
                    return {
                        props: { colSpan: 0 },
                    };
                }

            }
        },

        {
            title: '相对误差=B-A',
            align: 'center',
            render: (text, record, index) => {
                if (index < tableDatas.length) {
                    return <Form.Item name={`AlignmentValue${index}`} rules={[{ required: isReg, message: '' }]}><InputNumber disabled placeholder='请输入' /></Form.Item>
                } else if (index == tableDatas.length) {
                    return <span> {form.getFieldValue('AlignmentAvg')}  </span>
                } else if (index >= tableDatas.length+1) {
                    return {
                        props: { colSpan: 0 },
                    };
                }

            }
        },
    ];

    const columns2 = () => [

        {
            title: '标准气体',
            align: 'center',
            width:135,
        },
        {
            title: '名称',
            align: 'center',
            children: [{
            title:<Form.Item name={`StandardGasName`} rules={[{ required: isReg, message: '' }]}><Input disabled placeholder='请输入' title={form.getFieldValue('StandardGasName')}/></Form.Item>,
            align: 'center',
            }]

        },
        {
            title: '保证值',
            align: 'center',
            children: [{
                title: <Form.Item name={`GuaranteedValue`} rules={[{ required: isReg, message: '' }]}><InputNumber  placeholder='请输入' /></Form.Item>,
                align: 'center',
            }]

        },

        {

            title: '参比方法测定结果',
            align: 'center',
            children: [
                {
                    title: '采样前',
                    align: 'center',
                    children: [{
                        title: <Form.Item name={`BeforeCollection`} rules={[{ required: isReg, message: '' }]}><InputNumber  placeholder='请输入' /></Form.Item>,
                        align: 'center',
                    }]
                },
                {
                    title: '采样后',
                    align: 'center',
                    children: [{
                        title: <Form.Item name={`AfterCollection`} rules={[{ required: isReg, message: '' }]}><InputNumber  placeholder='请输入' /></Form.Item>,
                        align: 'center',
                    }]

                },

            ]
        },
        {
            title: '采样前后相对误差(%)',
            align: 'center', 
            children: [{
                title: <span>{form.getFieldValue('RelativeCollection')}</span>,
                align: 'center',
            }]

        }










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
                            ReferenceAvg: form.getFieldValue('ReferenceAvg'),
                            MeasuredAvg: form.getFieldValue('MeasuredAvg'),
                            AlignmentAvg: form.getFieldValue('AlignmentAvg'),
                            RelativeError:  form.getFieldValue('RelativeError'),
                            RelativeAccuracy:  form.getFieldValue('RelativeAccuracy'),
                            Evaluation:   form.getFieldValue('Evaluation'),
                            RelativeCollection: form.getFieldValue('RelativeCollection'),
                            PointId: pointId,
                            PollutantCode:pollutantCode,
                        },
                        ChildTable: [],
                    }
                    data.ChildTable = tableDatas.map((item, index) => {
                        const dateData = form.getFieldValue('RecordDate');
                        return {
                            Sort: item,
                            BTime:  dateData && values[`BTime${index}`] && `${dateData} ${values[`BTime${index}`].format('HH:mm:00')}`,
                            ETime: dateData && values[`ETime${index}`] && `${dateData} ${values[`ETime${index}`].format('HH:mm:00')}`,
                            ReferenceValue: values[`ReferenceValue${index}`],
                            MeasuredValue: values[`MeasuredValue${index}`],
                            AlignmentValue: values[`AlignmentValue${index}`],
                        }

                    })
                    props.addGasReferenceMethodAccuracyRecord(data, () => {
                        type == 1 ? setSaveLoading1(false) : setSaveLoading2(false)
                        setFormLoading(true)
                        getFormData(pollutantCode,selectDate)
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
        props.deleteGasReferenceMethodAccuracyRecord({
            ID: form.getFieldValue('ID'),
            RecordDate:form.getFieldValue('RecordDate'),
        }, () => {
            initData('del')
        })
    }


    const measuredValBlur = (index) => {
        const valueA = form.getFieldValue(`ReferenceValue${index}`), valueB = form.getFieldValue(`MeasuredValue${index}`);
        if ((valueA || valueA==0)  && (valueB|| valueB==0) ) {
            const relativeError = valueB - valueA
            form.setFieldsValue({ [`AlignmentValue${index}`]: relativeError.toFixed(3) }) //相对误差=B-A
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
            <Row justify='center' style={{ fontSize: 16, fontWeight: 'bold', paddingBottom: 16, }}>{recordName}</Row>
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
                    <Form.Item label="CEMS原理" name="TestPrinciple" >
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
                    <Form.Item label="型号、编号" name="ParamModelNum">
                        <Input placeholder='请输入' allowClear />
                    </Form.Item>
                </Col>

                <Col span={8}>
                    <Row justify='space-between'>
                        <Form.Item label="测试日期" name="RecordDate" style={{ width: '50%' }} >
                            <Input disabled placeholder='请选择' title={form.getFieldValue('RecordDate')} allowClear />
                        </Form.Item>
                        <Form.Item label="污染物名称" name="PollutantName"  style={{ width: '50%' }} >
                            <Input disabled placeholder='请选择' allowClear  title={form.getFieldValue('PollutantName')}/>
                        </Form.Item>
                    </Row>
                </Col>
                <Col span={4}></Col>
                <Col span={8}>
                    <Form.Item label="计量单位" name="Unit" >
                        <Input placeholder='请输入' allowClear />
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
        setIsTimeReg(true)
        setTimeout(() => {
            form.validateFields().then((values) => {
                const timeData = []
                let i = -1;
              
                Object.keys(values).map((item, index) => {
                    const dateData = form.getFieldValue('RecordDate');
                    if (/Time/g.test(item)) {
                        i++;
                            if (dateData && form.getFieldValue(`BTime${i}`) && form.getFieldValue(`ETime${i}`)) {
                                i == tableDatas.length - 1 ? timeData.push(`${dateData} ${moment(form.getFieldValue(`BTime${i}`)).format('HH:mm')},${dateData} ${moment(form.getFieldValue(`ETime${i}`)).format('HH:mm')},${i}`) : timeData.push(`${dateData} ${moment(form.getFieldValue(`BTime${i}`)).format('HH:mm')},${dateData} ${moment(form.getFieldValue(`ETime${i}`)).format('HH:mm')},${i}|`)

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
                    headers: {Authorization: "Bearer " + Cookie.get(config.cookieName), },

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
                            mergeData2 = importReturnData.filter((item1, index, arr) => { //取key不同的对象
                                let list = resData.map(item2 => item2.key)

                                return list.indexOf(item1.key) == -1
                            })
                            mergeData3 = mergeData.map((item1) => {
                                return {
                                    ...item1, ...mergeData2.find((item2) => { // 合并key相同的对象
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

    const onPollChange = ({ target: { value } }) => {
        console.log('radio1 checked', value);
        setPollutantCode(value)
        getTimeFormData(value)
    };
    const PollutantComponents = () => {
        return <Radio.Group options={pollOptions} value={pollutantCode} optionType="button" buttonStyle="solid" onChange={onPollChange} />
    }


    const onSelectDateChange = ({ target: { value } }) => {
        setSelectDate(value)
        setFormLoading(true)
        getFormData(pollutantCode,value)
    };
    const DateComponents = () => {
        return <Radio.Group style={{ marginLeft: 10 }} options={dateOptions} value={selectDate} optionType="button" buttonStyle="solid" onChange={onSelectDateChange} />
    }

    const [addForm] = Form.useForm();
    const [addVisible, setAddVisible] = useState(false)
    const addContent = () => <Form form={addForm} name="add_advanced_search">
        <Form.Item name='RecordDate' label='测试日期'>
            <DatePicker style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name='BeginTime' label='开始时间'>
            <TimePicker style={{ width: '100%' }} defaultOpenValue={moment('00:00', 'HH:mm')} format='HH:mm' />
        </Form.Item>
        <Form.Item name='DataGroups' label='数组组数'>
            <InputNumber  min={5} max={16}  style={{ width: '100%' }} placeholder='请输入' />
        </Form.Item>
        <Form.Item name='DataTimes' label='数组对时长'>
            <Input   style={{ width: '100%' }} placeholder='请输入' suffix="min" onKeyUp={(e) => {e.target.value&& numVerify(e.target.value, (data) => {  addForm.setFieldsValue({ 'DataTimes': data }) })}}/>
        </Form.Item>
        <Form.Item>
            <Button type="primary" style={{ width: '100%', marginTop: 8 }} loading={addLoading} onClick={addSubmits} >确定</Button>
        </Form.Item>
    </Form>
    
    const [addLoading,setAddLoading] = useState(false)
    const addSubmits = () => {
        if(dateOptions&&dateOptions.length>=3){
            message.warning('最多添加三个日期')
            setAddVisible(false)
            return;
        }
        addForm.validateFields().then((values) => {
            setAddLoading(true)
            props.addGasReferenceMethodAccuracyInfo({  
                ...values,  
                PollutantCode:pollutantCode,
                RecordDate: values.RecordDate && values.RecordDate.format('YYYY-MM-DD 00:00:00'),
                BeginTime: values.BeginTime && values.RecordDate&& `${values.RecordDate.format('YYYY-MM-DD')} ${values.BeginTime.format('HH:mm:ss')}`,
                PointId: pointId,
            }, (data) => {
                if(data && data.ChildTable){
                props.addGasReferenceMethodAccuracyRecord({
                    AddType: 1,
                    MainTable: {...data.MainTable,PointId:pointId},
                    ChildTable: data.ChildTable,
                },()=>{
                    setAddLoading(false)
                    setAddVisible(false)
                    getTimeFormData(pollutantCode)
                  
                })
             }
            })
        }).catch((errorInfo) => {
            console.log('Failed:', errorInfo);
        });

    }
    const onValuesChange = (hangedValues, allValues) => {
    }
    return (
        <div className={styles.totalContentSty}>
            <Spin spinning={pollutantLoading}>
                {pollOptions[0] ? <>
                    {dateOptions[0] && <BtnComponents isImport importLoading={uploading} saveLoading1={saveLoading1} saveLoading2={saveLoading2} importOK={importOK} uploadProps={uploadProps} importVisible={importVisible} submits={submits} clears={clears} del={del} importVisibleChange={importVisibleChange} />}
                    <PollutantComponents />
                    {dateOptions[0] &&  <DateComponents />}
                    <Popover
                        placement="bottom"
                        content={addContent()}
                        trigger="click"
                        visible={addVisible}
                        overlayClassName={styles.popSty2}
                        onVisibleChange={(newVisible) => { addForm.resetFields(); setAddVisible(newVisible) }}
                    >  <Button style={{ margin: '0 0 10px 10px' }}>添加</Button></Popover>
                    <Spin spinning={formLoading}>
                    {dateOptions[0] ? <Form
                        form={form}
                        name="advanced_search"
                        initialValues={{}}
                        className={styles["ant-advanced-search-form"]}
                        onValuesChange={onValuesChange}
                    >
                        <SearchComponents />
                        <Table
                            size="small"
                            bordered
                            dataSource={[...tableDatas,...['平均值','绝对误差','相对误差','相对准确值','评价依据']]}
                            columns={columns}
                            pagination={false}
                            className={'tableSty'}
                        />
                        <Table
                            size="small"
                            bordered
                            dataSource={[]}
                            columns={columns2()}
                            pagination={false}
                            className={'white-table-thead hidden-tbody tableSty'}
                        />
                    </Form> : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}</Spin>   </> :
                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}

            </Spin>
        </div>
    );
};
export default connect(dvaPropsData, dvaDispatch)(Index);