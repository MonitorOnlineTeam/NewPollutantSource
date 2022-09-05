/**
 * 功  能：气态污染物CEMS示值误差和系统响应时间检测
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
    }
}
const Index = (props) => {



    const [form] = Form.useForm();


    const [tableDatas, setTableDatas] = useState([1, 2, 3, 4, 5, 6, 7,]);

    const { pointId, tableLoading, formLoading, } = props;


    const [recordName, setRecordName] = useState()
    const [recordType, setRecordType] = useState()
    useEffect(() => {
        if(!pointId){ return }
        initData(pointId)
    }, [pointId]);
    const initData = (pointId) => {
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
                        // form.setFieldsValue({
                        //     [`CreateDate${index}`]: item.CreateDate && moment(item.CreateDate),
                        //     [`BTime${index}`]: item.BTime && moment(item.BTime),
                        //     [`ETime${index}`]: item.ETime && moment(item.ETime),
                        //     [`MembraneNum${index}`]: item.MembraneNum,
                        //     [`PMWeight${index}`]: item.PMWeight,
                        //     [`BenchmarkVolume${index}`]: item.BenchmarkVolume,
                        //     [`BenchmarkDensity${index}`]: item.BenchmarkDensity,
                        //     [`OperatingModeDensity${index}`]: item.OperatingModeDensity,
                        //     [`MeasuredValue${index}`]: item.MeasuredValue,
                        //     [`O2values${index}`]: item.O2values,
                        //     [`WDvalues${index}`]: item.WDvalues,
                        //     [`SDvalues${index}`]: item.SDvalues,
                        //     [`YLvalues${index}`]: item.YLvalues,
                        // })
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
            title: '检测日期',
            align: 'center',
            width: 140,
            render: (text, record, index) => {
                if (index == 0) {
                    return {
                        children: <Form.Item name={`CreateDate${index}`} rules={[{ required: isTimeReg, message: '' }]}><DatePicker disabledDate={disabledDate} onChange={() => onDateChange(`CreateDate${index}`)} format="MM-DD" /></Form.Item>,
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
                        children: <span>{pollutantName}</span>,
                        props: { rowSpan: 6 },
                    };
                } else if (index >= 1 && index < 6) {
                    return {
                        props: { rowSpan: 0 },
                    };
                } else {
                    return {
                        children: <div>{6666666}</div>,
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
                return <Form.Item name={`MembraneNum${index}`} rules={[{ required: isReg, message: '' }]}><Input placeholder='请输入' /></Form.Item>;
            }


        },
        {
            title: '50-100%满量程标准气体',
            align: 'center',
            render: (text, record, index) => {
                if (index == 6) {
                    return { props: { colSpan: 0 }, };
                }
                return <Form.Item name={`PMWeight${index}`} rules={[{ required: isReg, message: '' }]}>
                    <Input placeholder='请输入' />
                </Form.Item>;
            }
        },
        {
            title: '20-30%满量程标准气体',
            align: 'center',
            render: (text, record, index) => {
                if (index == 6) {
                    return { props: { colSpan: 0 }, };
                }
                return <Form.Item name={`MembraneNum${index}`} rules={[{ required: isReg, message: '' }]}><Input placeholder='请输入' /></Form.Item>;
            }



        },
        {
            title: '备注',
            align: 'center',
            render: (text, record, index) => {
                if (index == 6) {
                    return { props: { colSpan: 0 }, };
                }
                return <Form.Item name={`PMWeight${index}`} rules={[{ required: isReg, message: '' }]}>
                    <TextArea rows={1} />
                </Form.Item>;
            }
        },
    ];

    const columns2 = () => [
        {
            title: '检测日期',
            align: 'center',
            render: (text, record, index) => {
                return index == 3 ? '评价依据' : <Form.Item name={`PMWeight${index}`} rules={[{ required: isReg, message: '' }]}>
                    <DatePicker />
                </Form.Item>
            }
        },
        {
            title: '标气名称',
            align: 'center',
            render: (text, record, index) => {
                if (index == 3) { return { children: <span>{2332323}</span>, props: { colSpan: 6 }, }; }
                return <Form.Item name={`PMWeight${index}`} rules={[{ required: isReg, message: '' }]}>
                    <Input placeholder='请输入' />
                </Form.Item>
            }
        },
        {
            title: '标称值',
            align: 'center',
            render: (text, record, index) => {
                if (index == 3) { return { props: { colSpan: 0 }, }; }
                return <Form.Item name={`PMWeight${index}`} rules={[{ required: isReg, message: '' }]}>
                    <Input placeholder='请输入' />
                </Form.Item>
            }
        },
        {
            title: '管路传输时间(T1)',
            align: 'center',
            render: (text, record, index) => {
                if (index == 3) { return { props: { colSpan: 0 }, }; }
                return <Form.Item name={`PMWeight${index}`} rules={[{ required: isReg, message: '' }]}>
                    <Input placeholder='请输入' />
                </Form.Item>
            }
        },
        {
            title: 'CEMS显示值达到90%时的时间(T2)',
            align: 'center',
            render: (text, record, index) => {
                if (index == 3) { return { props: { colSpan: 0 }, }; }
                return <Form.Item name={`PMWeight${index}`} rules={[{ required: isReg, message: '' }]}>
                    <Input placeholder='请输入' />
                </Form.Item>
            }
        },
        {
            title: '响应时间(T1+T2)',
            align: 'center',
            render: (text, record, index) => {
                if (index == 3) { return { props: { colSpan: 0 }, }; }
                return <Form.Item name={`PMWeight${index}`} rules={[{ required: isReg, message: '' }]}>
                    <Input placeholder='请输入' />
                </Form.Item>
            }
        },
        {
            title: '平均值',
            align: 'center',
            render: (text, record, index) => {
                if (index == 0) {
                    return {
                        children: <Form.Item name={`PMWeight${index}`} rules={[{ required: isReg, message: '' }]}>
                            <Input placeholder='请输入' disabled/>
                        </Form.Item>, props: { rowSpan: 3 },
                    };
                }
                if (index > 0 && index < 3) { return { props: { rowSpan: 0 }, }; }
                if (index == 3) { return { props: { colSpan: 0 }, }; }
                return <Form.Item name={`PMWeight${index}`} rules={[{ required: isReg, message: '' }]}>
                    <Input placeholder='请输入' />
                </Form.Item>
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
                    let data = {
                        AddType: type,
                        MainTable: {
                            ...values2,
                            PointId: pointId
                        },
                        ChildTable: [],
                    }
                    data.ChildTable = tableDatas.map((item, index) => {
                        return {
                            Sort: item,
                            CreateDate: index <= 4 ? values[`CreateDate0`] && values[`CreateDate0`].format('YYYY-MM-DD 00:00:00') : index > 4 && index <= 9 ? values[`CreateDate5`] && values[`CreateDate5`].format('YYYY-MM-DD 00:00:00') : values[`CreateDate10`] && values[`CreateDate10`].format('YYYY-MM-DD 00:00:00'),
                            BTime: index <= 4 ? values[`CreateDate0`] && values[`BTime${index}`] && `${values[`CreateDate0`].format('YYYY-MM-DD')} ${values[`BTime${index}`].format('HH:mm:00')}` : index > 4 && index <= 9 ? values[`CreateDate5`] && values[`BTime${index}`] && `${values[`CreateDate5`].format('YYYY-MM-DD')} ${values[`BTime${index}`].format('HH:mm:00')}` : values[`CreateDate0`] && values[`BTime${index}`] && `${values[`CreateDate10`].format('YYYY-MM-DD')} ${values[`BTime${index}`].format('HH:mm:00')}`,
                            ETime: index <= 4 ? values[`CreateDate0`] && values[`ETime${index}`] && `${values[`CreateDate0`].format('YYYY-MM-DD')} ${values[`ETime${index}`].format('HH:mm:00')}` : index > 4 && index <= 9 ? values[`CreateDate5`] && values[`BTime${index}`] && `${values[`CreateDate5`].format('YYYY-MM-DD')} ${values[`ETime${index}`].format('HH:mm:00')}` : values[`CreateDate0`] && values[`ETime${index}`] && `${values[`CreateDate10`].format('YYYY-MM-DD')} ${values[`ETime${index}`].format('HH:mm:00')}`,
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
                    props.addPMReferenceCalibrationRecord(data, () => {
                        type == 1 ? setSaveLoading1(false) : setSaveLoading2(false)
                        initData(pointId)
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
            ID: form.getFieldValue('ID'),
        }, () => {
            initData(pointId)
        })
    }


    const weightVolumeBlur = (index) => {
        const weight = form.getFieldValue(`PMWeight${index}`), volume = form.getFieldValue(`BenchmarkVolume${index}`);
        if (weight && volume) {

            const benchmarkDensity = Number(interceptTwo(weight / volume * 1000))
            form.setFieldsValue({ [`BenchmarkDensity${index}`]: benchmarkDensity }) //标杆浓度
            const atmos = Number(form.getFieldValue('Atmos'))

            const SDvalues = Number(form.getFieldValue(`SDvalues${index}`)),
                WDvalues = Number(form.getFieldValue(`WDvalues${index}`)),
                YLvalues = Number(form.getFieldValue(`YLvalues${index}`));
            console.log(atmos, SDvalues, WDvalues, YLvalues, benchmarkDensity)
            if (atmos && SDvalues && WDvalues && YLvalues && benchmarkDensity) {
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
                    <Form.Item label="CEMS原理" name="Basis" >
                        <InputNumber placeholder='请输入' allowClear />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item label="计量单位" name="ReferenceManufactorName">
                        <Input placeholder='请输入' allowClear />
                    </Form.Item>
                </Col>
                <Col span={4}></Col>
                <Col span={8}>
                    <Row justify='space-between'>
                        <Form.Item label="量程" name="ParamModelNum" >
                            <InputNumber placeholder='最小值' allowClear />
                        </Form.Item>
                    -
                    <Form.Item name="ParamModelNum">
                            <InputNumber placeholder='最大值' allowClear />
                        </Form.Item>
                    </Row>
                </Col>

                <Col span={8}>
                    <Form.Item label="污染物名称" name="Basis" >
                        <Input disabled />
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
    const [pollOptions, setPollOptions] = useState([
        {
            label: 'Apple',
            value: 'Apple',
        },
        {
            label: 'Pear',
            value: 'Pear',
        },
        {
            label: 'Orange',
            value: 'Orange',
        },
    ]);
    const [pollutantCode, setPollutantCode] = useState()
    const [pollutantName, setPollutantName] = useState()

    const onPollChange = ({ target: { value }, option }) => {
        console.log('radio1 checked', value);
        setPollutantCode(value)
        // setPollutantName
    };
    const PollutantComponents = () => {
        return <Radio.Group options={pollOptions} value={pollutantCode} optionType="button" buttonStyle="solid" onChange={onPollChange} />
    }


    const onValuesChange = (hangedValues, allValues) => {
    }
    return (
        <div className={styles.totalContentSty}>
            <Spin spinning={formLoading}>
                <BtnComponents saveLoading1={saveLoading1} saveLoading2={saveLoading2} submits={submits} clears={clears} del={del} />
                <PollutantComponents />
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
                        className={'tableSty1'}
                    />
                    <Table
                        size="small"
                        loading={tableLoading}
                        bordered
                        dataSource={[1, 2, 3, 4]}
                        columns={columns2()}
                        pagination={false}
                        className={'tableSty1'}
                    />
                </Form>
            </Spin>
        </div>
    );
};
export default connect(dvaPropsData, dvaDispatch)(Index);