/**
 * 功  能：新报警推送关联组件
 * 创建人：jab
 * 创建时间：2020.12.30
 */
import React, { Component } from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import {
  Input,
  Button,
  Card,
  Spin,
  Row,
  Col,
  Table,
  Modal,
  Checkbox,
  TreeSelect,
  message,
  Divider,
  Popconfirm,
  Tooltip,
  Transfer,
  Switch,
  Tag,
  Select,
  Pagination,
  Empty,
  Radio,
} from 'antd';
import { connect } from 'dva';
import moment from 'moment';
// import SdlCascader from '../../pages/AutoFormManager/SdlCascader'
import RegionList from '@/components/RegionList'
import styles from '@/pages/authorized/departInfo/index.less';
import difference from 'lodash/difference';

const { Search } = Input;
const FormItem = Form.Item;
// Customize Table Transfer

@connect(({ loading,alarmPush, user, autoForm, report}) => ({
    alarmPushLoading:alarmPush.alarmPushLoading,
    alarmPushDepOrRoleList:alarmPush.alarmPushDepOrRoleList,
    alarmPushSelect:alarmPush.alarmPushSelect,
    alarmPushParam:alarmPush.alarmPushParam,
    alarmPushFlag:alarmPush.alarmPushFlag,
    alarmPushParLoading:alarmPush.alarmPushParLoading
}))

@Form.create()
class Index extends Component {
    constructor(props) {
        super(props);

        this.state = {
            mockData: [],
            targetKeys: [],
            confirmLoading:false,
            options:[
                { label: '异常', value: '1' },
                { label: '超标', value: '2' },
                { label: '预警', value: '5' },
                { label: '超标核实推送', value: '6' },
                { label: '处置', value: '7' },
                { label: '核实', value: '8' },
                { label: '响应', value: '9' },
              ],
              
        };
        this.leftTableColumns = [
            {
              dataIndex: 'RegionName',
              title: '行政区',
            },
            {
              dataIndex: 'EntName',
              title: '企业名称',
              ellipsis:true,
            },
            {
              dataIndex: 'PointName',
              title: '监测点名称',
              ellipsis:true,
            },
          ];
          this.rightTableColumns = [
            {
                dataIndex: 'RegionName',
                title: '行政区',
              },
              {
                dataIndex: 'EntName',
                title: '企业名称',
                ellipsis:true,
              },
              {
                dataIndex: 'PointName',
                title: '监测点名称',
                ellipsis:true,
              },
          ];
    }

    /** 初始化加载 */
    componentDidMount() {
        const { dispatch, alarmPushParam, FlagType,type,alarmPushData,alarmPushFlag } = this.props;
       
        const alarmType = (flag)=>flag? "" : '1'
        dispatch({
          type: 'alarmPush/getFirstAlarmpar',
          payload: {   Type: type, RegionCode: "", ID:alarmPushData.key,AlarmType: ''},
          callback:(flag)=>{
            const par = {
              Type: type,
              RegionCode: "",
              ID:alarmPushData.key,
              AlarmType: alarmType(flag)
          }
             dispatch({
              type: 'alarmPush/updateState',
              payload: { alarmPushParam:{...alarmPushParam, ...par}}
            })
            this.getData( {Type: type, RegionCode: "", ID:alarmPushData.key,AlarmType:  alarmType(flag)});
          }
        });


    }

    componentWillReceiveProps(nextProps) {
 
    }

    TableTransfer = ({ leftColumns, rightColumns, ...restProps }) => (
        <Transfer {...restProps} showSelectAll={false}>
          {({
            direction,
            filteredItems,
            onItemSelectAll,
            onItemSelect,
            selectedKeys: listSelectedKeys,
            disabled: listDisabled,
          }) => {
            const columns = direction === 'left' ? leftColumns : rightColumns;
      
            const rowSelection = {
              getCheckboxProps: item => ({ disabled: listDisabled || item.disabled }),
              onSelectAll(selected, selectedRows) {
                const treeSelectedKeys = selectedRows
                  .filter(item => !item.disabled)
                  .map(({ key }) => key);
                const diffKeys = selected
                  ? difference(treeSelectedKeys, listSelectedKeys)
                  : difference(listSelectedKeys, treeSelectedKeys);
                onItemSelectAll(diffKeys, selected);
              },
              onSelect({ key }, selected) {
                onItemSelect(key, selected);
              },
              selectedRowKeys: listSelectedKeys,
            };
      
            return (
              <Table
                rowSelection={rowSelection}
                columns={columns}
                dataSource={filteredItems}
                size="small"
                loading={this.props.alarmPushLoading}
                style={{ pointerEvents: listDisabled ? 'none' : null }}
                scroll={{y:'calc(100vh - 550px)'}}
                // pagination={false}
                onRow={({ key, disabled: itemDisabled }) => ({
                  onClick: () => {
                    if (itemDisabled || listDisabled) return;
                    onItemSelect(key, !listSelectedKeys.includes(key));
                  },
                })}
              />
            );
          }}
        </Transfer>
      );






    getData = (data) => {
        const { dispatch, alarmPushParam } = this.props;
        dispatch({
            type: 'alarmPush/getAlarmPushDepOrRole',
            payload: data? data : { ...alarmPushParam },
            callback:(targetKeys)=>{
                this.setState({targetKeys})
            }
        });

      };
    
      filterOption = (inputValue, option) => option.EntName.indexOf(inputValue) > -1;
    
      handleChange = (targetKeys, direction, moveKeys) => { //穿梭框change事件
        console.log(targetKeys)
        this.setState({ targetKeys });
      };
    

      getAlarmRadioOptions=()=>{
          const { options } = this.state;
          const arr = []
           return options.map(item=>{
             return <Radio.Button value={item.value}>{item.label}</Radio.Button>
         })
      }



    updateQueryState = payload => {
        const { alarmPushParam, dispatch } = this.props;
    
        dispatch({
          type: "alarmPush/updateState",
          payload: { alarmPushParam: { ...alarmPushParam, ...payload } },
        });
      };
    changeRegion=(value)=>{
        this.updateQueryState({
            RegionCode: value? value : '',
          });
    }
    changeCheckboxGroup=(data)=>{
      
       if(data.target){ //单选
           const {alarmPushParam:{AlarmType}} = this.props;
           const selectType = data.target.value
           this.updateQueryState({AlarmType: selectType });
           setTimeout(()=>{
            this.getData();
           })
       }else{
        this.updateQueryState({ AlarmType: data.join(","), });
       }
    }
    handleOk=()=>{

        const { dispatch,FlagType,type,alarmPushParam:{AlarmType}, alarmPushData} = this.props;
        
        const { targetKeys } = this.state;
      
       let parData = targetKeys.length>0 ? targetKeys.map(item=>{
          return  {  
                    RoleIdOrDepId: alarmPushData.key,
                    FlagType: type,
                    DGIMN: item,
                    AlarmType: AlarmType,
                  }
        })
        :
        [{  
          RoleIdOrDepId: alarmPushData.key,
          FlagType: type,
          DGIMN: 'ALL',
          AlarmType: AlarmType,
        }]

        this.setState({confirmLoading:true })
        dispatch({
            type: 'alarmPush/insertAlarmDepOrRole',
            payload: { Datas:[...parData]},
            callback:()=>{
                this.setState({
                    confirmLoading:false
                },()=>{
                    // this.props.cancelAlarmModal();

                })
            }
        });

 
    }

    render() {
        // const { alarmPushData, showAlarmState, alarmPushParam: { pageIndex, pageSize, total }, loadingGetData, loadingGetAlarmState, loadingInsertData } = this.props;
        // const { currentData, checkedYC, checkedCB, checkedYJ,checkedCS } = this.state;
        const { loadingInsertData,visibleAlarm,cancelAlarmModal,alarmPushDepOrRoleList,alarmPushParLoading,alarmPushFlag,alarmPushParam:{RegionCode,AlarmType},alarmPushData } = this.props;
        const { options,targetKeys,confirmLoading } = this.state;
        
        const TableTransfer = this.TableTransfer;
        return (
            <Modal
            title={`${alarmPushData.UserGroup_Name|| alarmPushData.CreateUserName}-报警关联`}
            visible={visibleAlarm}
            onOk={this.handleOk}
            onCancel={cancelAlarmModal}
            confirmLoading={confirmLoading}
            destroyOnClose
            width="70%"
            okText='保存'
          >
            <div className={styles.newAlarmPushRel}>
                <div>
                    <Row>
                        <Col>
                                <Row align='middle'>
                                    <RegionList style={{width:165}} changeRegion={this.changeRegion} RegionCode={RegionCode}/>
                                    <div style={{display:'inline-block', padding: '0 10px' }}>
                                    {!alarmPushParLoading?  <>{alarmPushFlag?  <Checkbox.Group
                                      // defaultValue={["1","2","5","6","7","8","9"]}
                                      options={options}
                                      onChange={this.changeCheckboxGroup}
                                     />

                                  : <Radio.Group  defaultValue={"1"} onChange={this.changeCheckboxGroup} >
                                      {this.getAlarmRadioOptions()}
                                        </Radio.Group>} </>
                                        :
                                        <Spin size="small" /> } 
                                     </div>
                                    

                                     <Button type="primary" onClick={()=>{this.getData()}}>查询</Button>
                                </Row>
                        </Col>
                    </Row>

                </div>
               
                <TableTransfer
                    rowKey={record => record.DGIMN}
                    style={{marginTop:20,width:"100%"}}
                    dataSource={alarmPushDepOrRoleList}
                    showSearch
                    filterOption={this.filterOption}
                    searchPlaceholder={"请输入企业名称"}
                    targetKeys={targetKeys}
                    onChange={this.handleChange}
                    leftColumns={this.leftTableColumns}
                    rightColumns={this.rightTableColumns}
                 /> 
            </div >
            </Modal>
            );
    }
}
export default Index;
