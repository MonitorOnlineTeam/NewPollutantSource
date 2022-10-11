

/**
 * 功  能：污染源信息 监测点信息
 * 创建人：jab
 * 创建时间：2022.04.02
 */
import React, { useState, useEffect, Fragment } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Tag,Space, Typography, Card, Button, Select, message, Row, Col, Tooltip, Divider, Modal, DatePicker, Radio, Tree, Drawer, Empty, Spin } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined, UpOutlined, DownOutlined, ExportOutlined,FilterFilled, CreditCardFilled, ProfileFilled, DatabaseFilled } from '@ant-design/icons';
import { connect } from "dva";
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
const { RangePicker } = DatePicker;
import { DelIcon, DetailIcon, EditIcon, PointIcon } from '@/utils/icon'
import router from 'umi/router';
import Link from 'umi/link';
import moment from 'moment';
import RegionList from '@/components/RegionList'
import EntAtmoList from '@/components/EntAtmoList'
import NumTips from '@/components/NumTips'
import styles from "../style.less"
import Cookie from 'js-cookie';
import PageLoading from '@/components/PageLoading'

const { TextArea } = Input;
const { Option } = Select;

const namespace = 'pollutantInfo'




const dvaPropsData = ({ loading, pollutantInfo, global }) => ({
    tableDatas: pollutantInfo.pointListTableDatas,
    tableTotal: pollutantInfo.pointListTableTotal,
    tableLoading: loading.effects[`${namespace}/getPointInfoList`],
    exportLoading: loading.effects[`${namespace}/exportPointInfoList`],
    clientHeight: global.clientHeight,
})

const dvaDispatch = (dispatch) => {
    return {
        updateState: (payload) => {
            dispatch({
                type: `${namespace}/updateState`,
                payload: payload,
            })
        },
        getTableData: (payload,callback) => { //列表
            dispatch({
                type: `${namespace}/getPointInfoList`,
                payload: payload,
                callback:callback
            })
        },
        exportData: (payload, callback) => { // 导出
            dispatch({
                type: `${namespace}/exportPointInfoList`,
                payload: payload,
                callback: callback
            })

        },


    }
}
const Index = (props) => {



    const [form] = Form.useForm();

    const [manufacturerId, setManufacturerId] = useState(undefined)

    const { tableDatas, tableTotal, tableLoading, exportLoading } = props;


    useEffect(() => {
        onFinish(pageIndex, pageSize)
    }, []);
  
    const [filteredInfo,setFilteredInfo] = useState(null) 

//     const [operationStatus,setOperationStatus] = useState(null) 
//     const [judgeMissStatus,setJudgeMissStatus] = useState(null) 
//     const [operationNameStatus,setOperationNameStatus] = useState(null) 
  
  
//     const selectedVal = {
//       operationStatus : operationStatus,
//       judgeMiss:judgeMissStatus,
//       operationName:operationNameStatus,
//     } 
//     const   getFilterProps = dataIndex => {
      
//       const selectFlag =  `${dataIndex},${selectedVal[dataIndex]}` === filteredInfo;
//     return {
//       filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
//         <div>
//            <Radio.Group onChange={(e)=>{ 
//                console.log(dataIndex)
//              dataIndex=='operationStatus'?  setOperationStatus(e.target.value) : 
//              dataIndex=='judgeMiss'? setJudgeMissStatus(e.target.value) : 
//              dataIndex=='operationName'? setOperationNameStatus(e.target.value) : 
//              null ; 
//              }} value={selectedVal[dataIndex]}>
//            <Space direction="vertical">
//              <Radio value={'1'} style={{padding:'5px 12px 0 12px'}}>进行中</Radio>
//              <Radio value={'0'} style={{padding:'0  12px 5px 12px'}}>运维暂停</Radio>
//              </Space>
//            </Radio.Group>
            
//             <div className='ant-table-filter-dropdown-btns'>
//             <Button  disabled={!selectFlag && !selectedVal[dataIndex]} size="small" type="link" onClick={()=>{
//              dataIndex=='operationStatus'?  setOperationStatus(null) : 
//              dataIndex=='judgeMiss'? setJudgeMissStatus(null) : 
//              dataIndex=='operationName'? setOperationNameStatus(null) : 
//               null;
//               confirm({ closeDropdown: false })
//               setFilteredInfo(null)
//               onFinish(pageIndex,pageSize)
//               }}>
//               重置
//             </Button>
//             <Button type="primary" disabled={!selectFlag && !selectedVal[dataIndex]} onClick={() => {
//                 confirm({ closeDropdown: false })
//                 setFilteredInfo(`${dataIndex},${selectedVal[dataIndex]}`)
                
//                 dataIndex=='operationStatus'&&setJudgeMissStatus(null)&&setOperationNameStatus(null);  
//                 dataIndex=='judgeMiss'&&setOperationStatus(null)&&setOperationNameStatus(null);
//                 dataIndex=='operationName'&&setOperationStatus(null)&&setOperationNameStatus(null); 
  
//                 onFinish(pageIndex,pageSize,`${dataIndex},${selectedVal[dataIndex]}`)
//                }
//                }  size="small" >
//               确定
//             </Button>
//             </div>
//         </div>
//       ),
//       filterIcon: filtered => {     
//          return <FilterFilled style={{ color: selectFlag ? '#1890ff' : undefined }} />
//       },
//     }
//   }
    const columns = [
        {
            title: '序号',
            align: 'center',
            width: 50,
            ellipsis:true,
            render: (text, record, index) => {
                return  (index + 1) + (pageIndex-1)*pageSize;
            }
        },
        {
            title: '行政区',
            dataIndex: 'regionName',
            key: 'regionName',
            align: 'center',
            ellipsis:true,
        },

        {
            title: '企业名称',
            dataIndex: 'entName',
            key: 'entName',
            align: 'center',
            ellipsis:true,
        },
        {
            title: '监测点名称',
            dataIndex: 'pointName',
            key: 'pointName',
            align: 'center',
            ellipsis:true,
        },
        {
            title: '设备编号(MN)',
            dataIndex: 'DGIMN',
            key: 'DGIMN',
            align: 'center',
            ellipsis:true,
        },
        {
            title: '经纬度',
            dataIndex: 'longitude',
            key: 'longitude',
            align: 'center',
            ellipsis:true,
            render: (text, record, index) => {
                return `${text},${record.latitude}`
            }
        },
        {
            title: '污染源类型',
            dataIndex: 'pollutantTypeName',
            key: 'pollutantTypeName',
            align: 'center',
            width:130,
            ellipsis:true,
        },
        {
            title: '运维状态',
            dataIndex: 'operationStatus',
            key: 'operationStatus',
            align: 'center',
            width:150,
            ellipsis:true,
            // ...getFilterProps('operationStatus'),
            filters: [
                { text: '进行中', value: '0' },
                { text: '运维暂停', value: '1' },
              ],
            filterMultiple:false,
        },
        {
            title: '是否判断缺失数据',
            dataIndex: 'judgeMiss',
            key: 'missData',
            align: 'center',
            ellipsis:true,
            width:170,
            filters: [
                { text: '是', value: '1' },
                { text: '否', value: '0' },
              ],
            filterMultiple:false,
        },
        {
            title: '运维负责人',
            dataIndex: 'operationName',
            key: 'operationUser',
            align: 'center',
            width:150,
            ellipsis:true,
            filters: [
                { text: '设置', value: '1' },
                { text: '未设置', value: '2' },
              ],
            filterMultiple:false,
        },
    ]



    const onFinish = async (pageIndexs, pageSizes,filters) => {  //查询
        try {
            const values = await form.validateFields();

            props.getTableData({
                ...values,
                pageIndex: pageIndexs,
                pageSize: pageSizes,
                ...filters,
            },()=>{})

           
        } catch (errorInfo) {
            console.log('Failed:', errorInfo);
        }
    }

    const getCol =  () =>{
        const values =  form.getFieldsValue();
        if( values.pollutantType==2){ //废气
            columns.splice(columns.length-3,0,{
                title: '排口类型',
                dataIndex: 'outPutType',
                key: 'outPutType',
                align: 'center',
                ellipsis:true,
            },{
                title: 'CEMS监测原理',
                dataIndex: 'CEMSPrinciple',
                key: 'CEMSPrinciple',
                align: 'center',
                ellipsis:true,
            },{
                title: 'CEMS类型',
                dataIndex: 'CEMSType',
                key: 'CEMSType',
                align: 'center',  
                ellipsis:true,
            })
        }else{
          columns.filter(item=>item.title!='排口类型'&&item.title!='CEMS监测原理'&&item.title!='CEMS类型')
        }
        return columns;    
    }


    // const handleTableChange = (PageIndex, PageSize,) => {
    //     setPageIndex(PageIndex)
    //     setPageSize(PageSize)
    //     onFinish(PageIndex, PageSize)
    // }

    const tableChange = (pagination, filters, sorter) =>{

         const  PageIndex = pagination.current,PageSize=pagination.pageSize;
         setPageIndex(PageIndex)
         setPageSize(PageSize)
         setFilteredInfo(props.filteredHandle(filters))
         onFinish(PageIndex, PageSize,props.filteredHandle(filters))
    }
    const exports = async () => {
        const values = await form.validateFields();
        props.exportData({
            ...values,
            PageIndex: undefined,
            PageSize: undefined,
        })

    };
    const [pageSize, setPageSize] = useState(20)
    const [pageIndex, setPageIndex] = useState(1)

    const searchComponents = () => {
        return <><Form
            form={form}
            name="advanced_search"
            onFinish={() => {setPageIndex(1);  onFinish(1, pageSize,filteredInfo) }}
            initialValues={{
                pollutantType: 1
            }}
        >  
           <Row>

           <Form.Item label='企业名称' name='entName'>
            <Input allowClear placeholder='请输入'/>
           </Form.Item>
            <Form.Item label='行政区' name='regionCode' style={{padding:'8px 8px 0 8px'}}>
                <RegionList levelNum={2} style={{width:165}} />
            </Form.Item>

            <Form.Item label = '监测点类型' name='pollutantType' >
              <Select placeholder='请选择' style={{width:200}}>
               <Option value={2}>废气</Option>
                <Option value={1}>废水</Option>
               
               </Select>
             </Form.Item>
            </Row>
            <Row  align='middle'>
            <Form.Item style={{marginBottom:0}}>
                <Button loading={tableLoading} type="primary" loading={tableLoading} htmlType="submit">
                    查询
       </Button>
                <Button style={{ margin: '0 8px' }} onClick={() => { form.resetFields(); }}  >
                    重置
        </Button>
                <Button icon={<ExportOutlined />} loading={exportLoading} onClick={() => { exports() }}>
                    导出
         </Button>
         <span style={{ color: '#f5222d', fontSize: 14,margin: '0 8px' }}>
            下面列表只展示当前在运营的监测点，运营到期的监测点将不再显示。
           </span>
            </Form.Item>
            </Row>
        </Form>

        </>
    }
    return (
        <div className={styles.pollutantInfoSty}>
            <Card title={searchComponents()}>
                <SdlTable
                    resizable
                    loading={tableLoading}
                    bordered
                    dataSource={tableDatas}
                    columns={getCol()}
                    onChange={tableChange}
                    className={styles.pointInfoSty}
                    pagination={{
                        total: tableTotal,
                        pageSize: pageSize,
                        current: pageIndex,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        // onChange: handleTableChange,
                    }}
                />
            </Card>
        </div>
    );
};
export default connect(dvaPropsData, dvaDispatch)(Index);

