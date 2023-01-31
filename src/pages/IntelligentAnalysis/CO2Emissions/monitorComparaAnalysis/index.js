/**
 * 功  能：监测数据对比分析
 * 创建时间：2023.01.30
 */
import React, { useState, useEffect, Fragment } from 'react';
import { Table, Input, InputNumber, Popconfirm, Upload,Form, Tag, Typography, Card, Button, Select, message, Row, Col, Tooltip, Divider, Modal, DatePicker, Radio, Spin, } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined, UpOutlined, DownOutlined,UploadOutlined,ImportOutlined, ExportOutlined, } from '@ant-design/icons';
import { connect } from "dva";
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
const { RangePicker } = DatePicker;
import RangePicker_ from '@/components/RangePicker/NewRangePicker';
import { DelIcon, DetailIcon, EditIcon, PointIcon } from '@/utils/icon'
const { Option } = Select;
import moment from 'moment'
const namespace = 'CO2Emissions'




const dvaPropsData = ({ loading, CO2Emissions, }) => ({
    entList: CO2Emissions.entList,
    entLoading: loading.effects[`${namespace}/getAllEnterprise`],
    tableLoading: loading.effects[`${namespace}/getComparisonOfMonData`],
    tableDatas: CO2Emissions.monitorComparaAnalysisData,
    tableTotal: CO2Emissions.tableTotal,
})

const dvaDispatch = (dispatch) => {
    return {
        updateState: (payload) => {
            dispatch({
                type: `${namespace}/updateState`,
                payload: payload,
            })
        },
        getAllEnterprise: (payload, callback) => { // 企业
            dispatch({
                type: `${namespace}/getAllEnterprise`,
                payload: payload,
                callback: callback
            })

        },
        getComparisonOfMonData: (payload, callback) => { //列表
            dispatch({
                type: `${namespace}/getComparisonOfMonData`,
                payload: payload,
                callback: callback
            })
        },
        exportTemplet: (payload, callback) => { // 导入模板
            dispatch({
                type: `autoForm/exportTemplet`,
                payload: payload,
                callback: callback
            })

        },
    }
}
const Index = (props) => {



    const [form] = Form.useForm();





    const { entList, entLoading, tableDatas, tableCol, tableLoading, } = props;
    useEffect(() => {
        props.getAllEnterprise({}, (data) => {
            data && data[0] && form.setFieldsValue({ EntCode: data[0].EntCode })
            onFinish();
        })

    }, []);

    const rowSpan = (text, record, index) => {
        const number = index + 4;
        return {
            children: text,
            props: { rowSpan: number % 4 == 0 ? 4 : 0 },
        };
    }

    const [columns, setColumns] = useState([]);

    const defalutCols = [
        {
            title: '数据对比开始日期',
            dataIndex: 'CreateUserName',
            key: 'CreateUserName',
            align: 'center',
            fixed: 'left',
            render: (text, record, index) => {
                const val = form.getFieldsValue();
                const data = val.Time && val.Time.startOf('M').format('YYYY-MM-DD')
                return rowSpan(data, record, index)
            }
        },
        {
            title: '数据对比',
            dataIndex: 'CreateUserName',
            key: 'CreateUserName',
            align: 'center',
            fixed: 'left',
            render: (text, record, index) => {
                if ((index + 4) % 4 == 0) {
                    return '监测量(kg)'
                }
                if ((index + 4 - 1) % 4 == 0) {
                    return '核算量(kg)'
                }
                if ((index + 4 - 2) % 4 == 0) {
                    return '相差量(kg)'
                }
                if ((index + 4 - 3) % 4 == 0) {
                    return '相差百分比(%)'
                }
            }
        },
        {
            title: '月度数据',
            dataIndex: 'Month',
            key: 'Month',
            align: 'center',
        },
    ]
    const onFinish = async (pageIndexs, pageSize) => {  //查询

        try {
            const values = await form.validateFields();

            props.getComparisonOfMonData({
                // pageIndex: pageIndexs,
                // pageSize: pageSize,
                ...values,
                BeginTime: values.Time && values.Time.startOf('M').format('YYYY-MM-DD'),
                EndTime: values.Time && values.Time.endOf('M').format('YYYY-MM-DD'),
                Time: undefined,
                type: 'table',
            }, (col) => {

                let columnsTotal = defalutCols;
                if (col && Object.keys(col).length) {
                    // tableCol.map((item, index) => {
                    //     columnsTotal.splice(columns.length - 1, 0, { title: `${item}`, dataIndex: 222, key: 111, width: 80, align: 'center' })
                    // })
                    for (let colKey in col) {
                        columnsTotal.splice(defalutCols.length - 1, 0,
                            {
                                title: col[colKey],
                                dataIndex: colKey,
                                key: colKey,
                                width: 100,
                                align: 'center',
                            })
                    }
                    setColumns(columnsTotal)
                }
            })
        } catch (errorInfo) {
            console.log('Failed:', errorInfo);
        }
    }




    // const [pageIndex, setPageIndex] = useState(1)
    // const [pageSize, setPageSize] = useState(20)
    // const handleTableChange = async (PageIndex, PageSize) => { //分页
    //     const values = await form.validateFields();
    //     setPageSize(PageSize)
    //     setPageIndex(PageIndex)
    //     props.getComparisonOfMonData({ ...values, PageIndex, PageSize })
    // }
    
    const searchComponents = () => {
        return <Form
            form={form}
            name="advanced_search"
            layout='inline'
            initialValues={{
                Time: moment(),
            }}
            // onFinish={()=>{setPageIndex(1); onFinish(1,pageSize) } }
            onFinish={() => { onFinish() }}
        >
            <Spin spinning={entLoading} size='small'>
                <Form.Item label="企业" name="EntCode" >
                    <Select placeholder='请选择企业名称' showSearch
                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        style={{ width: 200 }}>
                        {
                            entList && entList[0] && entList.map(item => {
                                return <Option key={item.EntCode} value={item.EntCode}>{item.EntName}</Option>
                            })
                        }
                    </Select>
                </Form.Item>
            </Spin>
            <Form.Item name='Time' label='日期' >
                <DatePicker allowClear={false} picker="month" style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType='submit' style={{ marginRight: 8 }} loading={tableLoading}>
                    查询
                </Button>
                <Button  icon={<ImportOutlined/>}  style={{ marginRight: 8 }}  onClick={()=>{setImpVisible(true)}}>
                    导入
                </Button>
            </Form.Item>
        </Form>
    }
    const [impVisible, setImpVisible] = useState(false);
    return (
        <div>
            <BreadcrumbWrapper>
                <Card title={searchComponents()}>
                    <SdlTable
                        title={()=>{return <div style={{fontSize:22, textAlign:'center',fontWeight:'bold',}}>直测及核算碳排放量比对分析统计表</div>}}
                        loading={tableLoading}
                        bordered
                        dataSource={tableDatas}
                        columns={columns}
                        pagination={false}
                    // pagination={{
                    //     total: tableTotal,
                    //     pageSize: pageSize,
                    //     current: pageIndex,
                    //     showSizeChanger: true,
                    //     showQuickJumper: true,
                    //     onChange: handleTableChange,
                    // }}
                    />
                </Card>
         <Modal
          title="导入"
          visible={impVisible}
          onOk={()=>{setImpVisible(false)}}
          onCancel={()=>{setImpVisible(false)}}
        >
          <Row>
            <Col span={18}>
              <Upload {...props}>
                <Button>
                  <UploadOutlined /> 请选择文件
                </Button>
              </Upload>
            </Col>
            <Col span={6} style={{ marginTop: 6 }}>
              <a onClick={() => {
                props.exportTemplet({configId:'AEnterpriseTest'})
              }}>下载导入模板</a></Col>
          </Row>
        </Modal>
            </BreadcrumbWrapper>
        </div>
    );
};
export default connect(dvaPropsData, dvaDispatch)(Index);