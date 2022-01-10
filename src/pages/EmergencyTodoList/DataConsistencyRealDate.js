/*
 * @Author: jab
 * @Date: 2021-12-03
 * @LastEditors: jab
 * @LastEditTime: 2021-12-03
 * @Description: 数据一致性表单 小时与日数据
 */
import React, { Component } from 'react';
import { Spin,Image  } from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import styles from "./ConsumablesReplaceRecordContent.less";
import MonitorContent from '../../components/MonitorContent/index';
import SdlTable from '@/components/SdlTable';

@connect(({ task, loading }) => ({
    isloading: loading.effects['task/GetDataConsistencyRecordNewForPCList'],
    dataConsistencyDateRecordList: task.dataConsistencyDateRecordList
}))
/*
页面：数据一致性表单 小时与日数据
*/
class RepalceRecordList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isloading:this.props.isloading
        };
    }

    componentDidMount() {
        this.props.dispatch({
            type: 'task/GetDataConsistencyRecordNewForPCList',
            payload: {
                TaskID: this.props.TaskID,
                TypeID: this.props.TypeID,
            },
        });
        this.setState({
            isloading: false
        });
    }
    tableData = (type,ColumnList,hourRecordList) =>{
        return   <>  <tr>
            <td  rowSpan={hourRecordList&&hourRecordList.length + 1} style={{ minWidth: 100, height: '50px', textAlign: 'center', fontSize: '14px' }}>
                      {type}
          </td>  
         {ColumnList.map(item=>{

                return <td  colSpan={item=='监测参数'||item=='时间'?1 :2} style={{ textAlign: 'center',minWidth:item.length>=5?170 :100, fontSize: '14px' }}>
                 {item}
                  </td> 
            })
        }
      </tr>
       { hourRecordList.map((item,index)=>{
            return   <tr>
                       
                       {
                         Object.keys(item).map((objItem,objIndex)=>{
                           return objItem=='时间'&&index==0?
                           <td rowSpan={ hourRecordList.length} style={{ textAlign: 'center'}}> {item[objItem]} </td>
                           :
                           index>0&&objItem=='时间' || objItem=='DataType'?
                           ''
                           :
                           objItem=='监测参数'?
                          <td  style={{ textAlign: 'center'}}> {item[objItem]} </td>
                          :
                          <>
                          <td  style={{ textAlign: 'center',minWidth:100}}> {item[objItem]? item[objItem].split(",")[0] : ""} </td>
                          <td  style={{ textAlign: 'center',minWidth:100}}> {item[objItem]? item[objItem].split(",")[1] : ""} </td>
                          </>
                

                        })   
                       }
                     </tr> 
        })
       }
      </>
    }
    render() {
        const appStyle = this.props.appStyle;
        let style = null;
        if (appStyle) {
            style = appStyle;
        }
        else {
            style = {
                height: 'calc(100vh - 200px)' 
            }
        }
        const SCREEN_HEIGHT=this.props.scrolly==="none"?{overflowY:'none'}:{height:document.querySelector('body').offsetHeight - 250};
        const Data=this.props.dataConsistencyDateRecordList!==null?this.props.dataConsistencyDateRecordList:null;
        const Content=Data!==null?Data.Record.Content:null;
        const RecordList=Data!==null?Data.Record.RecordList:null;
        const ColumnList = Data?Data.ColumnList : null
        const PingList=Data?Data.PingList: null;
 
        let columns =[]


        if(ColumnList){
            ColumnList.map((item,index)=>{
                PingList.map(items=>{
                   if(items.split(",")[0]==item){
                       const spliceItem = `${item}${items.split(",")[1]}`
                       ColumnList.splice(index,1,spliceItem)
                   }
                })
            })
            ColumnList.map(item=>{
                columns.push({
                        title: item,
                        dataIndex: item,
                })
            })
        }

        let hourRecordList,dayRecordList;
        if(RecordList){

            hourRecordList = RecordList.filter((item,index)=>{
                return item.DataType==2
            })
            dayRecordList = RecordList.filter((item,index)=>{
                return item.DataType==3
            })
        }
        
        if (this.props.isloading) {
            return (<Spin
                style={{
                    width: '100%',
                    height: 'calc(100vh/2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
                size="large" 
            />);
        }

  
        return (
            <div className={styles.FormDiv} style={style}>
                <div className={styles.FormName}></div>
                 <table
                    className={styles.FormTable}
                >
                    <tbody>
                          <tr>
                            <td colSpan={ColumnList&&ColumnList.length *2}  style={{ textAlign:'center',fontWeight:'bold',fontSize:16}}>
                                 数据一致性检查表(小时与日数据)
                            </td>
                        </tr> 
                        <tr>
                            <td colSpan="2" style={{  height: '50px', textAlign: 'center', fontSize: '14px' }}>
                                        企业名称
                            </td>
                            <td colSpan={ColumnList&&ColumnList.length*2 - 1 - 5} style={{minWidth:250, textAlign: 'center', fontSize: '14px' }}>
                                {Content !== null ?Content.EnterpriseName  :null}
                            </td>
                            <td colSpan="2" style={{ height: '50px', textAlign: 'center', fontSize: '14px' }}>
                                        监测点名称
                            </td>
                            <td  style={{textAlign: 'center', fontSize: '14px'}}>
                                {Content !== null ?Content.PointName :null}
                            </td>
                        </tr>
                     <tr>
                </tr>
            );
        }
                          {ColumnList&&hourRecordList&&this.tableData('小时数据',ColumnList,hourRecordList)}
                          {ColumnList&&dayRecordList&&this.tableData('日数据',[],dayRecordList)}
                   
                    </tbody> 
                </table> 
            </div>
        );
    }
}

export default RepalceRecordList;