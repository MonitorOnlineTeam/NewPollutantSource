/**
 * 功  能：气态污染物CEMS（含氧量）零点和量程漂移检测
 * 创建人：jab
 * 创建时间：2022.09.01
 */
import React, { useState, useEffect, Fragment } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Tag, Typography, Empty, TimePicker, Card, Button, Select, message, Row, Col, Tooltip, Divider, Modal, DatePicker, Radio, Spin, } from 'antd';
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
    formLoading: loading.effects[`${namespace}/getGasZeroRangeRecord`],
    pollutantLoading: loading.effects[`${namespace}/get72TestRecordPollutant`],
    delLoading: loading.effects[`${namespace}/deleteGasZeroRangeRecord`],
})

const dvaDispatch = (dispatch) => {
    return {
        updateState: (payload) => {
            dispatch({
                type: `${namespace}/updateState`,
                payload: payload,
            })
        },
        get72TestRecordPollutant: (payload, callback) => { //污染物列表
            dispatch({
                type: `${namespace}/get72TestRecordPollutant`,
                payload: payload,
                callback: callback
            })
        },
        getGasZeroRangeRecord: (payload, callback) => { //参数回填
            dispatch({
                type: `${namespace}/getGasZeroRangeRecord`,
                payload: payload,
                callback: callback
            })
        },
        addGasZeroRangeInfoRecord: (payload, callback) => { //保存 暂存
            dispatch({
                type: `${namespace}/addGasZeroRangeInfoRecord`,
                payload: payload,
                callback: callback
            })
        },
        deleteGasZeroRangeRecord: (payload, callback) => { //删除
            dispatch({
                type: `${namespace}/deleteGasZeroRangeRecord`,
                payload: payload,
                callback: callback
            })
        },
    }
}
const Index = (props) => {



    const [form] = Form.useForm();



    const [tableDatas, setTableDatas] = useState([1, 2, 3, 4]);

    const { pointId, pollutantLoading, formLoading, } = props;


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
                getFormData(defaultPollCode, pollData);
            }

        })

    }

    const getFormData = (pollCode, pollList) => {
        props.getGasZeroRangeRecord({
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

                    form.setFieldsValue({
                        ...res.MainTable,
                        // MinRange: res.MainTable.Range ? res.MainTable.Range.split('-')[0] : null,
                        // MaxRange: res.MainTable.Range ? res.MainTable.Range.split('-')[1] : null,
                    })
                    getPollutantName(pollOptions && pollOptions[0] ? pollOptions : pollList, pollCode) //获取污染物名称

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
                                [`RangeBegin${index}`]: item.RangeBegin,
                                [`RangeEnd${index}`]: item.RangeEnd,
                                [`RangeChange${index}`]: item.RangeChange,
                                [`RangeCalibration${index}`]: item.RangeCalibration,
                            })
                        })
                    }
                }
            }
        })
    }

    const getPollutantName = (list, value) => {
        list.map(item => {
            if (item.value == value) {
                form.setFieldsValue({ PollutantName: item.label })
            }
        })
    }
    const disabledDate = (current) => {
        //return current && current > moment().endOf('year') || current < moment().startOf('year');
    };
    // const [autoDateFlag, setAutoDateFlag] = useState(true)
    const onDateChange = (name) => {
        const values = form.getFieldValue('CreateDate0')
        // const date1 = form.getFieldValue('CreateDate1'),date2=form.getFieldValue('CreateDate2'),date3=form.getFieldValue('CreateDate3');
        // if (name == 'CreateDate0' &&  !date1 && !date2 && !date3) {
        if (name == 'CreateDate0') {
            if(!values){
                form.setFieldsValue({ CreateDate1: undefined, CreateDate2: undefined,CreateDate3:undefined, })
                return;
            }
            form.setFieldsValue({
                CreateDate1: moment(moment(values).add('day', 1)),
                CreateDate2: moment(moment(values).add('day', 2)),
                CreateDate3: moment(moment(values).add('day', 3)),
            })
            // setAutoDateFlag(false)
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

    const zeroReadBlur = (index, type) => {
        let value1, value2;
        if (type == 1) { //零点漂移绝对误差	
            value1 = form.getFieldValue(`ZeroBegin${index}`), value2 = form.getFieldValue(`ZeroEnd${index}`)
            if ((value1 || value1 == 0) && (value2 || value2 == 0)) {
                form.setFieldsValue({ [`ZeroChange${index}`]: (value2 - value1).toFixed(2) })
            }else{
                form.setFieldsValue({ [`ZeroChange${index}`]: undefined })
            }
        } else {
            value1 = form.getFieldValue(`RangeBegin${index}`), value2 = form.getFieldValue(`RangeEnd${index}`)
            if ((value1 || value1 == 0) && (value2 || value2 == 0)) {
                form.setFieldsValue({ [`RangeChange${index}`]: (value2 - value1).toFixed(2) })
            }else{

            }  form.setFieldsValue({ [`RangeChange${index}`]: undefined })
        }
    }

    const adjustChang = (name,name2,name3,index) =>{
        const value = form.getFieldValue(`${name}${index}`)
        const value2 = form.getFieldValue(`${name2}${index}`)
         if(value==2){
            value2&&form.setFieldsValue({[`${name3}${index+1}`] : value2})
         }
          
      }

    const [isReg, setIsReg] = useState(false)
    const [isTimeReg, setIsTimeReg] = useState(false)
     
     const smallFont = (text) =>{
        return <span style={{fontSize:12}}>{text}</span>
      }
    const columns = [
        {
            title: '日期',
            align: 'center',
            width: 140,
            render: (text, record, index) => {
                return <Form.Item name={`CreateDate${index}`} rules={[{ required: isTimeReg, message: '' }]}><DatePicker disabledDate={disabledDate} onChange={() => onDateChange(`CreateDate${index}`)} format="YYYY-MM-DD" /></Form.Item>;
            }
        },
        {
            title: '时间',
            align: 'center',
            children: [
                {
                    title: '开始',
                    align: 'center',
                    width: 120,
                    render: (text, record, index) => {
                        return <Form.Item name={`BTime${index}`} rules={[{ required: isTimeReg, message: '' }]}><TimePicker defaultOpenValue={moment('00:00', 'HH:mm')} onChange={() => onTimeChange(index, 'start')} format='HH:mm' /></Form.Item>;
                    }
                },
                {
                    title: '结束',
                    align: 'center',
                    width: 120,
                    render: (text, record, index) => {
                        return <Form.Item name={`ETime${index}`} rules={[{ required: isTimeReg, message: '' }]}><TimePicker defaultOpenValue={moment('00:00', 'HH:mm')} onChange={() => onTimeChange(index, 'end')} format='HH:mm' /></Form.Item>;
                    }
                },
            ]
        },
        {
            title: '零点读数',
            align: 'center',
            children: [
                {
                    title: <span>起始(Z{smallFont('0')})</span>,
                    align: 'center',
                    render: (text, record, index) => {
                        if(index==0){ return '/'  }
                        return <Form.Item name={`ZeroBegin${index}`} rules={[{ required: isReg, message: '' }]}><Input onBlur={() => zeroReadBlur(index, 1)} placeholder='请输入' /></Form.Item>;
                    }
                },
                {
                    title: <span>最终(Z{smallFont('i')})</span>,
                    align: 'center',
                    render: (text, record, index) => {
                        return <Form.Item name={`ZeroEnd${index}`} rules={[{ required: isReg, message: '' }]}><Input onBlur={() => zeroReadBlur(index, 1)} placeholder='请输入' /></Form.Item>;
                    }
                },
            ]
        },
        {
            title: '零点读数变化',
            align: 'center',
            children: [
                {
                    title: <span>∆Z=Z{smallFont('i')}-Z{smallFont('0')}</span>,
                    align: 'center',
                    render: (text, record, index) => {
                        if(index==0){ return '/'  }
                        return <Form.Item name={`ZeroChange${index}`} rules={[{ required: isReg, message: '' }]}><InputNumber  step='0.01' disabled  /></Form.Item>;
                    }
                },
            ]
        },
        {
            title: '校准零点否',
            align: 'center',
            render: (text, record, index) => {
                return <Form.Item name={`ZeroCalibration${index}`} rules={[{ required: isReg, message: '' }]}>
                    <Radio.Group  onChange={()=>{adjustChang(`ZeroCalibration`,'ZeroEnd','ZeroBegin',index)}}>
                        <Radio value="1">是</Radio>
                        <Radio value="2">否</Radio>
                    </Radio.Group>
                </Form.Item>;
            }
        },
        {
            title: '量程读数',
            align: 'center',
            children: [
                {
                    title:<span>起始(S{smallFont('0')})</span>,
                    align: 'center',
                    width: 100,
                    render: (text, record, index) => {
                        if(index==0){ return '/'  }
                        return <Form.Item name={`RangeBegin${index}`} rules={[{ required: isReg, message: '' }]}><InputNumber step='0.01' onBlur={() => zeroReadBlur(index, 2)} placeholder='请输入' /></Form.Item>;
                    }
                },
                {
                    title: <span>最终(S{smallFont('i')})</span>,
                    align: 'center',
                    width: 100,
                    render: (text, record, index) => {
                        return <Form.Item name={`RangeEnd${index}`} rules={[{ required: isReg, message: '' }]}><InputNumber  onBlur={() => zeroReadBlur(index, 2)} placeholder='请输入' /></Form.Item>;
                    }
                },
            ]
        },
        {
            title: '量程读数变化',
            align: 'center',
            children: [
                {
                    title: <span>∆S=S{smallFont('i')}-S{smallFont('0')}</span>,
                    align: 'center',
                    render: (text, record, index) => {
                        if(index==0){ return '/'  }
                        return <Form.Item name={`RangeChange${index}`} rules={[{ required: isReg, message: '' }]}><InputNumber step='0.01'  disabled  /></Form.Item>;
                    }
                },
            ]
        },
        {
            title: '校准量程否',
            align: 'center',
            render: (text, record, index) => {
                return <Form.Item name={`RangeCalibration${index}`} rules={[{ required: isReg, message: '' }]}>
                    <Radio.Group onChange={()=>{adjustChang(`RangeCalibration`,'RangeEnd','RangeBegin',index)}}>
                        <Radio value="1">是</Radio>
                        <Radio value="2">否</Radio>
                    </Radio.Group>
                </Form.Item>;
            }
        },
    ];

    const columns2 = () => [
        {
            title: '零点读数变化最大值',
            align: 'center',
            children: [
                {
                    title: '零点漂移',
                    align: 'center',
                    width: 300,
                    render: () => {
                        return '评价依据'
                    }
                },

            ]
        },
        {
            title: <span>{!isClears&&form.getFieldValue('ZeroErrorMaximum')}</span>,
            align: 'center',
            children: [
                {
                    title: <span>{!isClears&&form.getFieldValue('ZeroValue')}</span>,
                    align: 'center',
                    render: (text, record, index) => {
                        const obj = {
                            children: <span>{!isClears&&form.getFieldValue('EvaluationBasis')}</span>,
                            props: { colSpan: 3 },
                        };
                        return obj;
                    }
                },


            ]
        },
        {
            title: '量程读数变化最大值',
            align: 'center',
            children: [
                {
                    title: '跨度漂移',
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
            title: <span>{ !isClears&& form.getFieldValue('SpanErrorMaximum')}</span>,
            align: 'center',
            children: [
                {
                    title: <span>{!isClears&&form.getFieldValue('SpanValue')}</span>,
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
                        // Range: `${form.getFieldValue('MinRange') ? form.getFieldValue('MinRange') : ''}-${form.getFieldValue('MaxRange') ? form.getFieldValue('MaxRange') : ''}`,
                        PointId: pointId,
                        ZeroErrorMaximum: form.getFieldValue('ZeroErrorMaximum'),
                        SpanErrorMaximum: form.getFieldValue('SpanErrorMaximum'),
                        ZeroValue: form.getFieldValue('ZeroValue'),
                        SpanValue: form.getFieldValue('SpanValue'),
                        EvaluationBasis: form.getFieldValue('EvaluationBasis'),
                        PollutantCode:pollutantCode,

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
                        RangeBegin: values[`RangeBegin${index}`],
                        RangeEnd: values[`RangeEnd${index}`],
                        RangeChange: values[`RangeChange${index}`],
                        RangeCalibration: values[`RangeCalibration${index}`],
                        MainId: form.getFieldValue('ID'),
                    }

                })
                props.addGasZeroRangeInfoRecord(data, (isSuccess) => {
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
        Object.keys(value).map((item, index) => { //清除表格表单数据
            if(/\d/g.test(item)){
               form.setFieldsValue({[item]:undefined})
            }
        })
        setIsClears(true)//清除算法结果数据
    }
    const del = () => {
        props.deleteGasZeroRangeRecord({
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
                        <Input placeholder='请输入' allowClear />
                    </Form.Item>
                </Col>
                <Col span={4}></Col>
                <Col span={8}>
                    <Form.Item label="CEMS生产厂" name="CEMSPlant" >
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
                    <Form.Item label="CEMS型号、编号" name="CEMSModel" >
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
                    <Form.Item label="量程校准气体浓度" name="RangeCalibrationValue" >
                        <InputNumber step='0.01' placeholder='请输入' allowClear />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item label="CEMS原理" name="CEMSPrinciple">
                        <Input placeholder='请输入' allowClear />
                    </Form.Item>
                </Col>
                <Col span={4}></Col>
                <Col span={8}>
                    <Row>
                    <label style={{ width: 125, textAlign: 'right',lineHeight:'32px',  }}>量程<span style={{padding:'0 8px 0 2px'}}>:</span></label>
                        <Form.Item name="MinRange" style={{ width: 'calc(50% - 70px)' }}>
                            <InputNumber step='0.01' placeholder='最小值' allowClear />
                        </Form.Item>
                        <div style={{ width: 15, paddingTop: 4, textAlign: 'center' }}>-</div>
                        <Form.Item name="MaxRange" style={{ width: 'calc(50% - 70px)' }}>
                            <InputNumber step='0.01' placeholder='最大值' allowClear />
                        </Form.Item>
                    </Row>
                </Col>

                <Col span={8}>
                    <Form.Item label="污染物名称" name="PollutantName" >
                        <Input disabled  />
                    </Form.Item>
                </Col>
                <Col span={4}></Col>
                <Col span={8}>
                    <Form.Item label="计量单位" name="Unit">
                        <Input placeholder='请输入' allowClear />
                    </Form.Item>
                </Col>
                <Form.Item name="ID" hidden>
                    <Input />
                </Form.Item>
            </Row>
        </>

    };
    const onPollChange = ({ target: { value } }, ) => {
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
                    <BtnComponents {...props} saveLoading1={saveLoading1} saveLoading2={saveLoading2} delLoading={props.delLoading} delLoading={props.delLoading} submits={submits} clears={clears} del={del} />
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
                                bordered
                                dataSource={tableDatas}
                                columns={columns}
                                pagination={false}
                                className={'tableSty'}
                            />
                            <Table
                                size="small"
                                bordered
                                dataSource={['评价依据']}
                                columns={columns2()}
                                pagination={false}
                                className={'white-table-thead'}
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