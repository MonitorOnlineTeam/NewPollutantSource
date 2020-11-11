


import React from 'react';

import { Card,Table,Empty} from 'antd';

import { connect } from 'dva';

import PageLoading from '@/components/PageLoading'
import SdlTable from '@/components/SdlTable'


/**
 * 表格数据组件
 * jab 2020.07.30
 */
@connect(({ loading, dataquery,historyData }) => ({
    tableDatas:historyData.tableDatas,
    columns: historyData.columns,
    summary:historyData.summary,
    datatable: historyData.datatable,
    total: historyData.total,
    tablewidth: historyData.tablewidth,
    tableloading: historyData.tableloading,
    // isloading: loading.effects['historyData/getAllTypeDataList'],//当historyData的effects中的getAllTypeDataList有异步请求行为时为true，没有请求行为时为false
}))

class TableData extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        tableDatas:[],
        columns:[],
        tableloading:true
        // summary:[]
        };
    }
    static getDerivedStateFromProps(props, state) {
     
      // 只要当前 tableDatas 变化，
      // 重置所有跟 tableDatas 相关的状态。
      // if (props.tableDatas !== state.tableDatas) {
      //   return {
      //     tableDatas: props.tableDatas,
      //     columns: props.columns,
      //     tableloading:props.tableloading,
      //     // summary:props.summary
      //   };
      // }
      return null;

    }
    componentDidMount(){
    }
    handleChange = (pagination, filters, sorter) => {
      // const {dispatch,columns} = this.props;
    //  dispatch({ type: 'historyData/updateState', payload: { columns:[...columns] } })
    }; 
  render() {

    const { tableloading,total,tableDatas,columns} = this.props;
    return (<>
    {
      tableloading ?
        <PageLoading />:
          <>
           {
            columns&&columns.length >= 2?  
           <SdlTable
              rowKey={(record, index) => `complete${index}`}
              dataSource={ tableDatas}
              columns={columns}
              resizable
              defaultWidth={80}
              scroll={{ y:'calc(100vh - 65px - 180px - 180px)' || undefined}}
              pagination={{ total:total, showSizeChanger:true , showQuickJumper:true , defaultPageSize:20}}
              onChange={this.handleChange}
              // loading={ tableloading }
              // summary={() => (
              //   <Table.Summary.Row>
              //     {  
              //        summary? summary.map((item,index) => {
              //         return <Table.Summary.Cell index={index}>{item}</Table.Summary.Cell>
              //         }):null
                        
              //     }
              //   </Table.Summary.Row>
              // )}
          /> 
           : <div style={{ textAlign: 'center' }}><Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /></div>   
   } 
   </>
      }
      </>);
  }
}

export default TableData;