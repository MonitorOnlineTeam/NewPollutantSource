/**
 * 功  能：新报警推送关联组件
 * 创建人：贾安波
 * 创建时间：2020.12.30
 */
import React, { Component } from 'react';
import {
    Form,
    Input,
    Button,
    Icon,
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
    Transfer, Switch, Tag, Select, Pagination, Empty,Radio
} from 'antd';
import { connect } from 'dva';
import moment from 'moment';
// import SdlCascader from '../../pages/AutoFormManager/SdlCascader'
import RegionList from '@/components/RegionList'
import styles from '@/pages/authorized/departInfo/index.less';

const { Search } = Input;
const FormItem = Form.Item;

@connect(({ loading,departinfo, user, autoForm, report }) => ({
    loadingGetData: loading.effects['user/getAlarmPushAuthor'],
    loadingInsertData: loading.effects['user/insertAlarmPushAuthor'],
}))

@Form.create()
class Index extends Component {
    constructor(props) {
        super(props);

        this.state = {
            mockData: [],
            targetKeys: [],
            options:[
                { label: '异常', value: '1' },
                { label: '超标', value: '2' },
                { label: '预警', value: '5' },
                { label: '超标核实推送', value: '6' },
                { label: '外显', value: '7' },
                { label: '核实', value: '8' },

              ]
        };
    }

    /** 初始化加载 */
    componentDidMount() {
        const { dispatch, alarmPushParam, FlagType, RoleIdOrDepId } = this.props;
        this.getData();
        dispatch({
            type: 'user/updateState',
            payload: {
                alarmPushParam: {
                    ...alarmPushParam,
                    pageSize: 12,
                    pageIndex: 1,
                    searchContent: '',
                    flagType: FlagType,
                    authorId: RoleIdOrDepId,
                    entCode: '',
                },
            },
        });

    }

    componentWillReceiveProps(nextProps) {

    }







    // 搜索
    onSearch = e => {
        // debugger //searchContent
        const { dispatch, alarmPushParam } = this.props;

        // if (e !== alarmPushParam.searchContent) {
        dispatch({
            type: 'user/updateState',
            payload: {
                alarmPushParam: {
                    ...alarmPushParam,
                    pageSize: 12,
                    pageIndex: 1,
                    searchContent: e,
                },
            },
        });
        dispatch({
            type: 'user/getAlarmPushAuthor',
            payload: {},
        })
        this.setState({ checkedYC: false, checkedCB: false, checkedYJ: false,checkedCS:false });

    }


    getData = () => {
        const targetKeys = [];
        const mockData = [];
        for (let i = 0; i < 20; i++) {
          const data = {
            key: i.toString(),
            title: `content${i + 1}`,
            description: `description of content${i + 1}`,
            chosen: Math.random() * 2 > 1,
          };
          if (data.chosen) {
            targetKeys.push(data.key);
          }
          mockData.push(data);
        }
        this.setState({ mockData, targetKeys });
      };
    
      filterOption = (inputValue, option) => option.description.indexOf(inputValue) > -1;
    
      handleChange = (targetKeys, direction, moveKeys) => { //穿梭框change事件
        console.log(targetKeys, direction, moveKeys)
        this.setState({ targetKeys });
      };
    
      handleSearch = (dir, value) => {
        console.log('search:', dir, value);
      };

      getAlarmRadioOptions=()=>{
          const { options } = this.state;
          const arr = []
           return options.map(item=>{
             return <Radio.Button value={item.value}>{item.label}</Radio.Button>
         })
      }
   changeCheckboxGroup=()=>{
      }
    changeRegion=()=>{

    }
    handleOk=()=>{
     console.log(1111)
    }
    render() {
        // const { alarmPushData, showAlarmState, alarmPushParam: { pageIndex, pageSize, total }, loadingGetData, loadingGetAlarmState, loadingInsertData } = this.props;
        // const { currentData, checkedYC, checkedCB, checkedYJ,checkedCS } = this.state;
        const { loadingInsertData,visibleAlarm,cancelAlarmModal } = this.props;
        const { options,mockData,targetKeys } = this.state;
        return (
            <Modal
            title="报警关联"
            visible={visibleAlarm}
            onOk={this.handleOk}
            onCancel={cancelAlarmModal}
            destroyOnClose
            width="70%"
          >
            <div className={styles.newAlarmPushRel}>
                <div>
                    <Row>
                        <Col>
                            <Card >
                                <Row>
                                        <Search
                                            placeholder="输入字符模糊搜索"
                                            allowClear
                                            onSearch={value => this.onSearch(value)}
                                            style={{ width: '200px' }}
                                        />
                                    <RegionList style={{ marginLeft: 10,width: 150  }} changeRegion={this.changeRegion} RegionCode={""}/>
                                    <div style={{display:'inline-block', paddingLeft: 10 }}>
                                    <Checkbox.Group
                                      options={options}
                                      onChange={this.changeCheckboxGroup}
                                     />

                                  <Radio.Group onChange={this.changeCheckboxGroup} >
                                      {this.getAlarmRadioOptions()}
                                        </Radio.Group>
                                     </div>
                                </Row>
                            </Card>
                        </Col>
                    </Row>

                </div>
               
                <Transfer
                    style={{marginTop:10,width:"100%"}}
                    dataSource={mockData}
                    showSearch
                    filterOption={this.filterOption}
                    targetKeys={targetKeys}
                    onChange={this.handleChange}
                    onSearch={this.handleSearch}
                    render={item => `${item.key} - ${item.title}`}
                 />
            </div >
            </Modal>
            );
    }
}
export default Index;
