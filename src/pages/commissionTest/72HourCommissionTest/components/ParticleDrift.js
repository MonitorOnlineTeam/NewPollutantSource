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
    const [form2] = Form.useForm();


    const [tableDatas,setTableDatas] = useState([1,2,3,4]);

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
                form2.setFieldsValue({
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
            title: '日期',
            align: 'center',
            width: 140,
            render: (text, record, index) => {
                return <Form.Item name={`CreateDate${index}`} rules={[{ required: isTimeReg, message: '' }]}><DatePicker disabledDate={disabledDate} onChange={() => onDateChange(`CreateDate${index}`)} format="MM-DD" /></Form.Item>;
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
            title: <span>计量单位(mg/m3、mA、mV、不透明度%......)</span>,
            align: 'center',
            children: [
                {
                    title: '零点读数',
                    align: 'center',
                    children: [
                        {
                            title: '起始(Z0)',
                            align: 'center',
                            render: (text, record, index) => {
                                return <Form.Item name={`MembraneNum${index}`} rules={[{ required: isReg, message: '' }]}><Input placeholder='请输入' /></Form.Item>;
                            }
                        },
                        {
                            title: '最终(Zi)',
                            align: 'center',
                            render: (text, record, index) => {
                                return <Form.Item name={`MembraneNum${index}`} rules={[{ required: isReg, message: '' }]}><Input placeholder='请输入' /></Form.Item>;
                            }
                        },
                    ]
                },
                {
                    title: '零点漂移绝对误差',
                    align: 'center',
                    children: [
                        {
                            title: '∆Z=Zi-Z0',
                            align: 'center',
                            render: (text, record, index) => {
                                return <Form.Item name={`MembraneNum${index}`} rules={[{ required: isReg, message: '' }]}><Input placeholder='请输入' /></Form.Item>;
                            }
                        },
                    ]
                },
                {
                    title: '调节零点否',
                    align: 'center',
                    render: (text, record, index) => {
                        return <Form.Item name={`PMWeight${index}`} rules={[{ required: isReg, message: '' }]}>
                            <Radio.Group>
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
                            title: '起始(S0)',
                            align: 'center',
                            render: (text, record, index) => {
                                return <Form.Item name={`MembraneNum${index}`} rules={[{ required: isReg, message: '' }]}><Input placeholder='请输入' /></Form.Item>;
                            }
                        },
                        {
                            title: '最终(Si)',
                            align: 'center',
                            render: (text, record, index) => {
                                return <Form.Item name={`MembraneNum${index}`} rules={[{ required: isReg, message: '' }]}><Input placeholder='请输入' /></Form.Item>;
                            }
                        },
                    ]
                },
                {
                    title: '量程漂移绝对误差',
                    align: 'center',
                    children: [
                        {
                            title: '∆S=Si-S0',
                            align: 'center',
                            render: (text, record, index) => {
                                return <Form.Item name={`MembraneNum${index}`} rules={[{ required: isReg, message: '' }]}><Input placeholder='请输入' /></Form.Item>;
                            }
                        },
                    ]
                },
                {
                    title: '调节跨度否',
                    align: 'center',
                    render: (text, record, index) => {
                        return <Form.Item name={`PMWeight${index}`} rules={[{ required: isReg, message: '' }]}>
                            <Radio.Group>
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
                        return <Form.Item name={`PMWeight${index}`} rules={[{ required: isReg, message: '' }]}>
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
            width: 150,
            render: (text, record, index) => {
                return <Form.Item name={`MeasuredValue${index}`} rules={[{ required: isReg, message: '' }]}>
                    <TextArea rows={1} placeholder="请输入"  />
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
            title: '跨度漂移绝对误差最大值',
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
            title: <span>{form.getFieldValue('CorrelationCoefficient')}</span>,
            align: 'center',
            children: [
                {
                    title: <span>{form.getFieldValue('AllowHalfWidth')}</span>,
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
            form.validateFields();form2.validateFields();
            form2.validateFields().then((values2) => {
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

            }).catch((errorInfo) => {
                console.log('Failed:', errorInfo);
                message.warning('请输入完整的数据')
                return;
            });
        })


    }

    const clears = () => {
        form.resetFields();
        form2.resetFields();
    }
    const del = () => {
        props.deletePMReferenceCalibrationRecord({
            ID: form2.getFieldValue('ID'),
        }, () => {
            initData(pointId)
        })
    }


    const weightVolumeBlur = (index) => {
        const weight = form.getFieldValue(`PMWeight${index}`), volume = form.getFieldValue(`BenchmarkVolume${index}`);
        if (weight && volume) {

            const benchmarkDensity = Number(interceptTwo(weight / volume * 1000))
            form.setFieldsValue({ [`BenchmarkDensity${index}`]: benchmarkDensity }) //标杆浓度
            const atmos = Number(form2.getFieldValue('Atmos'))

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
                form2.setFieldsValue({ [name]: data })
            })
        }

    }
    const SearchComponents = () => {
        return <Form
            form={form2}
            name="advanced_search2"
            className={styles["ant-advanced-search-form2"]}
        >
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
                    <Form.Item label="量程校准值" name="Basis" >
                        <Input placeholder='请输入' allowClear />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item label="CEMS原理" name="ReferenceManufactorName">
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

                <Form.Item name="ID" hidden>
                    <Input />
                </Form.Item>
            </Row>
        </Form>
    
    };


    const onValuesChange = (hangedValues, allValues) => {
    }
    return (
        <div className={styles.totalContentSty}>
            <Spin spinning={formLoading}>
                <BtnComponents   saveLoading1={saveLoading1} saveLoading2={saveLoading2}   submits={submits} clears={clears} del={del} />
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