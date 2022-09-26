/**
 * 功  能：问题管理
 * 创建人：jab
 * 创建时间：2022.09
 */
import React, { useState,useEffect,Fragment  } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form,Tag,Spin, Typography,Tree,Card,Button,Select, message,Row,Col,Tooltip,Divider,Modal,DatePicker,Radio   } from 'antd';
import SdlTable from '@/components/SdlTable'
import { PlusOutlined,UpOutlined,DownOutlined,ExportOutlined } from '@ant-design/icons';
import { connect } from "dva";
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
const { RangePicker } = DatePicker;
import { DelIcon, DetailIcon, EditIcon,PointIcon } from '@/utils/icon'
import router from 'umi/router';
import Link from 'umi/link';
import moment from 'moment';
import RegionList from '@/components/RegionList'
import NumTips from '@/components/NumTips'
import styles from "./style.less"
import Cookie from 'js-cookie';



const { TextArea,Search, } = Input;
 
const { Option } = Select;

const namespace = 'helpCenter'


const dvaPropsData =  ({ loading,helpCenter }) => ({
  tableDatas:helpCenter.tableDatas,
  pointDatas:helpCenter.pointDatas,
  tableLoading:helpCenter.tableLoading,
  tableTotal:helpCenter.tableTotal,
  loadingAddConfirm: loading.effects[`${namespace}/addManufacturer`],
  loadingEditConfirm: loading.effects[`${namespace}/editManufacturer`],
})

const  dvaDispatch = (dispatch) => {
  return {
    updateState:(payload)=>{ 
      dispatch({
        type: `${namespace}/updateState`,
        payload:payload,
      })
    },
    getManufacturerList:(payload)=>{ //列表
      dispatch({
        type: `${namespace}/getManufacturerList`,
        payload:payload,
      })
    },
    addManufacturer : (payload,callback) =>{ // 添加
      dispatch({
        type: `${namespace}/addManufacturer`,
        payload:payload,
        callback:callback
      })
      
    },
    editManufacturer : (payload,callback) =>{ // 修改
      dispatch({
        type: `${namespace}/editManufacturer`,
        payload:payload,
        callback:callback
      })
      
    },
    delManufacturer:(payload,callback)=>{ //删除
      dispatch({
        type: `${namespace}/delManufacturer`, 
        payload:payload,
        callback:callback
      }) 
    },
  }
}


const Index = (props) => {



  const [form] = Form.useForm();



  const [helpVisible,sethelpVisible] = useState(false)



  
  
  
  const  { tableDatas,tableTotal,tableLoading,loadingAddConfirm,loadingEditConfirm, } = props; 
  useEffect(() => {
    onSearch();
  
  },[]);

  const columns = [
    {
      title: '公告标题',
      dataIndex: 'ManufacturerCode',
      key:'ManufacturerCode',
      align:'center',
    },
    {
      title: '发布人',
      dataIndex: 'ManufacturerName',
      key:'ManufacturerName',
      align:'center',
    },
    {
      title: '发布时间',
      dataIndex: 'Abbreviation',
      key:'Abbreviation',
      align:'center',
    },
    {
      title: '生效时间',
      dataIndex: 'ManufacturerCode',
      key:'ManufacturerCode',
      align:'center',
    },
    {
      title: '失效时间',
      dataIndex: 'ManufacturerCode',
      key:'ManufacturerCode',
      align:'center',
    },
    {
      title: '公关状态',
      dataIndex: 'Status',
      key:'Status', 
      align:'center',
      render: (text, record) => {
        if (text === 1) {
          return <span><Tag color="green">显示</Tag></span>;
        }
        if (text === 2) {
          return <span><Tag color="red">不显示</Tag></span>;
        }
        if (text === 3) {
          return <span><Tag color="blue">置顶</Tag></span>;
        }
      },
    }, 
    {
      title: '公告状态',
      dataIndex: 'ManufacturerName',
      key:'ManufacturerName',
      align:'center',
    },
    {
      title: '查看公告单位',
      dataIndex: 'ManufacturerName',
      key:'ManufacturerName',
      align:'center',
    },  
    {
      title: '查看公告角色',
      dataIndex: 'ManufacturerName',
      key:'ManufacturerName',
      align:'center',
    }, 
    {
      title: <span>操作</span>,
      dataIndex: 'x',
      key: 'x',
      align: 'center',
      width:180,
      render: (text, record) =>{
        return  <span>
               <Fragment><Tooltip title="编辑"> <a  onClick={()=>{edit(record)}} ><EditIcon /></a> </Tooltip><Divider type="vertical" /> </Fragment>
               <Fragment><Tooltip title="详情"> <a  onClick={()=>{detail(record)}} ><DetailIcon /></a> </Tooltip><Divider type="vertical" /> </Fragment>
             
               <Fragment> <Tooltip title="删除">
                  <Popconfirm  title="确定要删除此条信息吗？"   style={{paddingRight:5}}  onConfirm={()=>{ del(record)}} okText="是" cancelText="否">
                  <a><DelIcon/></a>
               </Popconfirm>
               </Tooltip>
               </Fragment> 
             </span>
      }
    },
  ];



  const detail = (data) =>{
    sethelpVisible(true)

  }




  
  


  const [pageIndex,setPageIndex] = useState(1)
  const [pageSize,setPageSize] = useState(20)
  const onSearch  = async (pageIndexs,pageSizes) =>{  //查询
      
    try {
      const values = await form.validateFields();
      pageIndexs&& typeof  pageIndexs === "number"? setPageIndex(pageIndexs) : setPageIndex(1); //除分页和编辑  每次查询页码重置为第一页

      props.getManufacturerList({
        pageIndex:pageIndexs&& typeof  pageIndexs === "number" ?pageIndexs:1,
        pageSize:pageSizes?pageSizes:pageSize,
        ...values,
      })
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  }



  const handleTableChange =   async (PageIndex,PageSize )=>{ //分页
    setPageSize(PageSize)
    setPageIndex(PageIndex)
    onFinish(PageIndex,PageSize)
  }
  
  const onSelect = (selectedKeys, info) => {
    console.log('selected', selectedKeys, info);
  };


  const treeData = [
        {
          title: `网页端`,
          key: '0-0',
          children: [
            {
              title: `常见问题`,
              key: '0-0-1',
            },
            {
              title: `功能使用`,
              key: '0-0-2',
            },
          ],
        },
        {
          title: '运维APP端',
          key: '0-1',
          children: [
            {
              title: '常见问题',
              key: '0-1-1',
            },
            {
              title: '功能使用',
              key: '0-1-2',
            },
          ],
        },

  ];
  return (
    <div>
    <BreadcrumbWrapper>
    <Card>
      <Row>
    <Tree
      defaultExpandAll 
      defaultSelectedKeys={['0-0-1']}
      onSelect={onSelect}
      treeData={treeData}
      style={{ width: 170 }}
    />
       <div style={{width:'calc(100% - 170px)'}}>
      <Search placeholder="input search text" onSearch={onSearch} enterButton />
      <SdlTable
        loading = {tableLoading}
        bordered
        dataSource={tableDatas}
        columns={columns}
        pagination={{
          total:tableTotal,
          pageSize: pageSize,
          current: pageIndex,
          showSizeChanger: true,
          showQuickJumper: true,
          onChange: handleTableChange,
        }}
      />
      </div>
      </Row>
   </Card>
   </BreadcrumbWrapper>
   
   <Modal
        // title={type==='add'? '添加':'编辑'}
        visible={helpVisible}
        confirmLoading={loadingEditConfirm}
        onCancel={()=>{sethelpVisible(false)}}
        className={styles.helpCenterModal}
        destroyOnClose
      >

      </Modal>
        </div>
  );
};
export default connect(dvaPropsData,dvaDispatch)(Index);