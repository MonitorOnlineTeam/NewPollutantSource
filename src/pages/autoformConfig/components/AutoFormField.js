/**
 * 功  能：字段配置弹框
 * 创建人：张哲
 * 创建时间：2020.11.11
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Table, Row,Col,Card,Button,Tabs,Modal,Input,Radio,Checkbox,Select,InputNumber,Icon,Tooltip  } from 'antd';
import AutoFormAddTable from './AutoFormAddTable';
import moment from 'moment';
import styles from './AutoFormField.less';
import { Form } from '@ant-design/compatible';

const { Option } = Select;


const pageUrl = {
    // updateState:'historydata/updateState',
    // updateTreeState:'wtreedata/updateState',
    SaveFieldsConfig:'fieldConfigModel/SaveFieldsConfig',
    GetCfgFiledsDataFromDbByTableName:'fieldConfigModel/GetCfgFiledsDataFromDbByTableName',
};

@connect(({ loading,fieldConfigModel,dbTree}) => ({
    // loading: loading.effects[pageUrl.GetHourDataForOriginal],
    foreignTypeData: fieldConfigModel.foreignTypeData,
    dbTreeArray:dbTree.dbTreeArray

}))


class AutoFormField extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            validity:false,
            foreighdtconfigData:[],
            foreigh:[],
            WidgetTypeArr:[
                {TypeValue: '文本框',TypeName: '文本框'},
                {TypeValue: '下拉列表框',TypeName: '下拉列表框'},
                {TypeValue: '日期框',TypeName: '日期框'},
                //{TypeValue: '时间框',TypeName: '时间框'},
                {TypeValue: '单选',TypeName: '单选'},
                {TypeValue: '多选', TypeName: '多选'},
                {TypeValue: '多选下拉列表',TypeName: '多选下拉列表'},
                //{TypeValue: '下拉列表树',TypeName: '下拉列表树'},
                {TypeValue: '下拉搜索树',TypeName: '下拉搜索树'},
                {TypeValue: '多选下拉搜索树',TypeName: '多选下拉搜索树'},
                //{TypeValue: '下拉表格',TypeName: '下拉表格'},
                //{TypeValue: '搜索表格框',TypeName: '搜索表格框'},
                //{TypeValue: '数字',TypeName: '数字'},
                {TypeValue: '经度',TypeName: '经度'}, 
                {TypeValue: '纬度',TypeName: '纬度'},
                {TypeValue: '坐标集合',TypeName: '坐标集合'},
                {TypeValue: '上传',TypeName: '上传'},
                //{TypeValue: '富文本',TypeName: '富文本'},
                //{TypeValue: '密码框',TypeName: '密码框'},
                //{TypeValue: '地图',TypeName: '地图'},
                //{TypeValue: '三级行政区下拉框',TypeName: '三级行政区下拉框'}
            ],
            conditionTypeArr:[
                { TypeValue: '$=', TypeName: '相等' },
                { TypeValue: '$ne', TypeName: '不等' },
                { TypeValue: '$like', TypeName: '模糊匹配' },
                { TypeValue: '$gte', TypeName: '大于等于' },
                { TypeValue: '$gt', TypeName: '大于' },
                { TypeValue: '$lte', TypeName: '小于等于' },
                { TypeValue: '$lt', TypeName: '小于' },
                { TypeValue: '$nin', TypeName: '不包含' },
                { TypeValue: '$in', TypeName: '包含' }
            ],
            queryConditionTypeArr :[
                { TypeValue: '文本框', TypeName: '文本框' },
                { TypeValue: '下拉列表框', TypeName: '下拉列表框' },
                //{ TypeValue: '下拉列表树', TypeName: '下拉列表树' },
                //{ TypeValue: '下拉搜索树', TypeName: '下拉搜索树' },
                { TypeValue: '日期框', TypeName: '日期框' },
                { TypeValue: '单选', TypeName: '单选' },
                { TypeValue: '多选', TypeName: '多选' },
                { TypeValue: '下拉多选', TypeName: '下拉多选' },
                //{ TypeValue: '数字范围', TypeName: '数字范围' },
                //{ TypeValue: '下拉搜索表格', TypeName: '下拉搜索表格' },
                { TypeValue: '三级行政区下拉框', TypeName: '三级行政区下拉框' },
                { TypeValue: '日期范围', TypeName: '日期范围' },
                //{ TypeValue: '监控目标', TypeName: '监控目标' },
                { TypeValue: '监测点', TypeName: '监测点' }
            ],
            SearchTypeArr:[
                { TypeName: '不查询', TypeValue: 0 }, 
                { TypeName: '列表头部显示', TypeValue: 1 }, 
                { TypeName: '特殊位置显示', TypeValue: 2 }
            ], 
            FormatType : [
                { TypeName: '不格式化', TypeValue: '' }, 
                { TypeName: '进度条', TypeValue: '进度条' }, 
                { TypeName: '标签', TypeValue: '标签' }, 
                { TypeName: '小圆点', TypeValue: '小圆点' }, 
                { TypeName: '超链接', TypeValue: '超链接' }
            ],
            AlignType : [
                { TypeName: '左对齐', TypeValue: 'left' }, 
                { TypeName: '右对齐', TypeValue: 'right' }
            ], 
            MulType :[
                { TypeName: '无', TypeValue: 0 }, 
                { TypeName: '单选', TypeValue: 1 }, 
                { TypeName: '多选', TypeValue: 2 }
            ],
            foreignTypeArr : [
                { TypeName: '无', TypeValue: '0' }, 
                { TypeName: '表连接', TypeValue: '1' }, 
                { TypeName: '枚举', TypeValue: '2' }
            ], 
            foreignRelTypeArr : [
                { TypeName: '左连接', TypeValue: 'left join' }, 
                { TypeName: '右连接', TypeValue: 'right join' }, 
                { TypeName: '内连接', TypeValue: 'inner join' }
            ], 
            importTypeArr : [
                { TypeName: '不导入', TypeValue: '0' }, 
                { TypeName: '导入', TypeValue: '1' },
                { TypeName: '导入并校验重复', TypeValue: '2' }
            ],
            ValidateArray: [
                { TypeValue: "'number'", TypeName: "'数字'" },
                { TypeValue: "'double'", TypeName: "'数字或小数'" },
                { TypeValue: "'isHourRange'", TypeName: "'小时数'" },
                { TypeValue: "'maxLength[]'", TypeName: '最大长度[数值自行填写]' },
                { TypeValue: "'minLength[]'", TypeName: '最小长度[数值自行填写]' },
                { TypeValue: "'rangeLength[-]'", TypeName: '长度范围[最小值-最大值]' },
                { TypeValue: "'phone'", TypeName: '电话号码' },
                { TypeValue: "'mobile'", TypeName: '手机号码' },
                { TypeValue: "'email'", TypeName: '邮箱' },
                { TypeValue: "'fax'", TypeName: '传真' },
                { TypeValue: "'ZIP'", TypeName: '邮政编码' },
                { TypeValue: "'chinese'", TypeName: '汉字' },
                { TypeValue: "'isLongitude'", TypeName: '经度' },
                { TypeValue: "'isLatitude'", TypeName: '纬度' },
                { TypeValue: "'idcard'", TypeName: '中国居民身份证' },
                { TypeValue: "'QQ'", TypeName: 'QQ号码' },
                { TypeValue: "'mail'", TypeName: '邮箱' },
                { TypeValue: "'loginName'", TypeName: '只允许汉字、英文字母、数字及下划线' },
                { TypeValue: "'isExistDiy[]'", TypeName: '校验是否重复，需要填写校验服务地址例如：/conn1/isEqule?key=@@value，@@value为占位符，实际传递的为当前输入框值' },
                { TypeValue: "'enumValue'", TypeName: "'枚举值'" },
                { TypeValue: "'judge'", TypeName: "'中文字符，以及中文字符'" },
                { TypeValue: "'judgenumber'", TypeName: "'数字和横杠'" },
                { TypeValue: "'ip'", TypeName: "'IP'" },
                { TypeValue: "'port'", TypeName: "'端口'" },
                { TypeValue: "'require'", TypeName: "'必填'" }
            ]
        };
    }

    //首次渲染之前调用
    componentWillMount(){
    
    }

    componentDidMount() {
       
    }
    //弹框
    showModal = () => {
        let {record}=this.props;
        if(record.FOREIGH_DT_CONFIGID){
            this.props.dispatch({
                type: pageUrl.GetCfgFiledsDataFromDbByTableName,
                payload: {
                    configId: record.FOREIGH_DT_CONFIGID,
                    callBack:(date)=>{
                        this.setState({
                            foreighdtconfigData:date
                        })
                    }
                }
            });
        }
        this.setState({
          visible: true,
        });
    };
    
    handleOk = e => {
        this.setState({
            visible: false,
        });
    };

    handleCancel = e => {
        this.setState({
            visible: false,
        });
    };
   

    handleSubmit = e => {
        e.preventDefault();
        let {record,FieldReloadData,id,dbKey}=this.props;
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let saveCfgStr=[];
                let tabAllName=record.DT_NAME;
                let data={...record,...values,
                            DF_ISPRIMARYKEY:values.DF_ISPRIMARYKEY?1:null,
                            DF_ISNOTNULL:values.DF_ISNOTNULL?1:null,
                            DF_ISADD:values.DF_ISADD?1:null,
                            DF_ISEDIT:values.DF_ISEDIT?1:null,
                            LIST_ISSHOW:values.LIST_ISSHOW?1:null,
                            DF_ISFIXED:values.DF_ISFIXED?1:null,
                            LIST_ISEXPORT:values.LIST_ISEXPORT?1:null,
                            DF_HIDDEN:values.DF_HIDDEN?1:null,
                            DF_ISSORT:values.DF_ISSORT?1:null,
                            FOREIGN_DF_NAME:values.FOREIGN_DF_NAME?values.FOREIGN_DF_NAME.toString():null,
                            DF_VALIDATE:values.DF_VALIDATE?values.DF_VALIDATE.toString():null,
                            FOREIGH_DT_CONFIGID:values.FOREIGH_DT_CONFIGID?values.FOREIGH_DT_CONFIGID:""
                        };       
                this.props.dispatch({
                    type: pageUrl.SaveFieldsConfig,
                    payload: {
                        Fileid:data,
                        configId: this.props.id,
                        tabAllName,
                        callback:()=>{
                            FieldReloadData(1,id,dbKey);
                            this.setState({
                                visible: false
                            });
                        }
                    }
                });
            }
        });
    };

    //效验方式
    handleChange=(value)=> {
    }
    handleFocus=()=>{
        this.setState({
            validity:true
        })
    }
    handleBlur=()=>{
        this.setState({
            validity:false
        })
    }

    handleResArr=(data)=>{
        let res=[];
        if(data&&data.length>0){
            data.forEach((item,i)=>{
                res.push(
                    <Option key={i} value={item.TypeValue}>{item.TypeName}</Option>
                )
            })
        }
        return res;
    }

    //外表ConfigID
    handleForeighArr=()=>{
        let {dbTreeArray,dbKey,record}=this.props;
        let data=this.state.foreigh;
        let res=[];
        if(record.DF_FOREIGN_TYPE=='表链接'){
            if(dbTreeArray&&dbTreeArray.length>0){
                let treeFind=dbTreeArray.find(item=>item.id==dbKey);
                if(treeFind){
                    data=treeFind.children;
                }

             
            }
            // if(record.FOREIGN_DF_ID){
            //     this.props.dispatch({
            //         type: pageUrl.GetCfgFiledsDataFromDbByTableName,
            //         payload: {
            //             configId: record.FOREIGN_DF_ID,
            //             callBack:(date)=>{
            //                 console.log(date)
            //                 // this.setState({
            //                 //     foreighdtconfigData:date
            //                 // })
            //             }
            //         }
            //     });
            // }
        }
        if(data&&data.length>0){
            data.forEach((item,i)=>{
                res.push(
                    <Option key={i} value={item.id}>{item.title}</Option>
                )
            })
        }
        return res;
    }
    //外键类型change
    handelDFFOREIGNTYPE=(value)=>{
        let {dbTreeArray,dbKey,id}=this.props;
        if(value==="1"){
            if(dbTreeArray&&dbTreeArray.length>0){
                let data=dbTreeArray.find(item=>item.id==dbKey).children;
                this.setState({
                    foreigh:data
                })
                // console.log(record.FOREIGN_DF_ID);
                this.handelFOREIGHDT(id)
            }
          
        }else{
            const { setFieldsValue } = this.props.form;
            this.setState({
                foreigh:[]
            })
            setFieldsValue({
                FOREIGH_DT_CONFIGID:''
            })
        }

    }
    //外表ConfigID
    handelFOREIGHDT=(value)=>{
        this.props.dispatch({
            type: pageUrl.GetCfgFiledsDataFromDbByTableName,
            payload: {
                configId: value,
                callBack:(date)=>{
                    this.setState({
                        foreighdtconfigData:date
                    })
                }
            }
        });
    }
    //外键Code
    handleForeiGndfArr=()=>{
        let {record}=this.props;
        let data=this.state.foreighdtconfigData;
        let res=[];
      
        if(data&&data.length>0){
            data.forEach((item,i)=>{
                res.push(
                    <Option key={i} value={item.FullFieldName}>{item.DF_NAME}</Option>
                )
            })
        }
        return res;
    }

    render() {
        const title='编辑';
        const { getFieldDecorator} = this.props.form;
        let {record}=this.props;
        const { validity,
                WidgetTypeArr,              //表单控件
                ValidateArray,              //校验方式
                SearchTypeArr,              //查询
                queryConditionTypeArr,      //查询控件
                conditionTypeArr,           //查询方式
                foreignTypeArr,             //外键类型
                foreignRelTypeArr,          //关联关系
                importTypeArr,              //导入
                FormatType,                 //列格式化
                AlignType,                  //对齐方式
                } = this.state;
        const formItemLayout = {
            labelCol: {
               span:9
            },
            wrapperCol: {
               span: 15
            },
        };
        let width=210;
        return (
            <div>
                <a onClick={this.showModal}>
                    编辑
                </a>
                <Modal
                    title={title}
                    visible={this.state.visible}
                    className='AutoFormField'
                    classTitle='AutoFormField'
                    isCardHeight={true}
                    centered={true}
                    width={1100}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    footer={<Button type="primary"  onClick={this.handleSubmit}>保存</Button>}
                >
                        <Form {...formItemLayout} className={styles.Form} >
                            <Row gutter={24}>
                                <Col span={8}  >
                                    <Form.Item label='字段名'   >
                                        <div style={{width:width}}>{record&&record.DF_NAME}</div>
                                    </Form.Item>
                                </Col>
                                <Col span={8}  >
                                    <Form.Item label="显示名称" >
                                        {getFieldDecorator('DF_NAME_CN', {
                                            initialValue:record&&record.DF_NAME_CN
                                        })(
                                        <Input style={{ width: width }}/>
                                        )}
                                    </Form.Item>
                                </Col>
                                <Col span={8}  >
                                    <Form.Item label="列头排序" >
                                        {getFieldDecorator('DF_ORDER', {
                                            // rules: [{  message: 'Please input your username!' }],
                                            initialValue:record&&record.DF_ORDER
                                        })(
                                        <InputNumber  style={{ width: width }}/>
                                        )}
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={24}>
                                <Col span={8}  >
                                    <Form.Item label="主键" >
                                        {getFieldDecorator('DF_ISPRIMARYKEY', {
                                             valuePropName: 'checked',
                                             initialValue: record&&record.DF_ISPRIMARYKEY=="√"?true:false
                                        })(
                                            <Checkbox ></Checkbox>
                                        )}
                                    </Form.Item>
                                </Col>
                                <Col span={8}  >
                                    <Form.Item label="必填" >
                                        {getFieldDecorator('DF_ISNOTNULL', {
                                             valuePropName: 'checked',
                                             initialValue: record&&record.DF_ISNOTNULL=="√"?true:false
                                        })(
                                            <Checkbox ></Checkbox>
                                        )}
                                    </Form.Item>
                                </Col>
                                <Col span={8}  >
                                    <Form.Item label="添加" >
                                        {getFieldDecorator('DF_ISADD', {
                                             valuePropName: 'checked',
                                             initialValue: record&&record.DF_ISADD=="√"?true:false
                                        })(
                                            <Checkbox ></Checkbox>
                                        )}
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={24}>
                                <Col span={8}  >
                                    <Form.Item label="编辑" >
                                        {getFieldDecorator('DF_ISEDIT', {
                                            valuePropName: 'checked',
                                            initialValue: record&&record.DF_ISEDIT=="√"?true:false

                                        })(
                                            <Checkbox ></Checkbox>
                                        )}
                                    </Form.Item>
                                </Col>
                                <Col span={8}  >
                                    <Form.Item label="列表" >
                                        {getFieldDecorator('LIST_ISSHOW', {
                                            valuePropName: 'checked',
                                            initialValue: record&&record.LIST_ISSHOW=="√"?true:false
                                        })(
                                            <Checkbox ></Checkbox>
                                        )}
                                    </Form.Item>
                                </Col>
                                <Col span={8}  >
                                    <Form.Item label="固定" >
                                        {getFieldDecorator('DF_ISFIXED', {
                                            valuePropName: 'checked',
                                            initialValue: record&&record.DF_ISFIXED=="√"?true:false

                                        })(
                                            <Checkbox ></Checkbox>
                                        )}
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={24}>
                                <Col span={8}  >
                                    <Form.Item label="导出" >
                                        {getFieldDecorator('LIST_ISEXPORT', {
                                            valuePropName: 'checked',
                                            initialValue: record&&record.LIST_ISEXPORT=="√"?true:false

                                        })(
                                            <Checkbox ></Checkbox>
                                        )}
                                    </Form.Item>
                                </Col>
                                <Col span={8}  >
                                    <Form.Item label="隐藏" >
                                        {getFieldDecorator('DF_HIDDEN', {
                                            valuePropName: 'checked',
                                            initialValue: record&&record.DF_HIDDEN?true:false

                                        })(
                                            <Checkbox ></Checkbox>
                                        )}
                                    </Form.Item>
                                </Col>
                                <Col span={8}  >
                                    <Form.Item label="数据排序" >
                                        {getFieldDecorator('DF_ISSORT', {
                                             valuePropName: 'checked',
                                            initialValue: record&&record.DF_ISSORT=="√"?true:false
                                        })(
                                        <Checkbox></Checkbox>
                                        )}
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={24}>
                                <Col span={8} {...formItemLayout} >
                                    <Form.Item label="表单控件" >
                                        {getFieldDecorator('DF_CONTROL_TYPE', {
                                            //  initialValue:"lucy"
                                            initialValue: record&&record.DF_CONTROL_TYPE

                                        })(
                                            <Select  style={{ width: width }} >
                                                {this.handleResArr(WidgetTypeArr)}
                                            </Select>
                                        )}
                                    </Form.Item>
                                </Col>
                                <Col span={8}  >
                                    <Form.Item label={<span>校验方式<Tooltip placement="topLeft" title={'注：手写验证方式需要在验证方式前加reg字符串.'}><Icon type="question-circle" /></Tooltip></span>} >
                                        {getFieldDecorator('DF_VALIDATE', {
                                            //   initialValue:"lucy"
                                            initialValue: record&&record.DF_VALIDATE?record.DF_VALIDATE:undefined

                                        })(
                                            <Select  
                                                mode="tags"  
                                                style={{width:width}} 
                                                onChange={this.handleChange} 
                                                // onFocus={this.handleFocus}
                                                // onBlur={this.handleBlur}
                                            >
                                                {this.handleResArr(ValidateArray)}
                                            </Select >
                                        )}
                                    </Form.Item>
                                </Col>
                                <Col span={8}  >
                                    <Form.Item label="查询" >
                                        {getFieldDecorator('DF_ISQUERY', {
                                            initialValue: record&&record.DF_ISQUERY
                                        })(
                                            <Select  style={{ width: width }} >
                                                {this.handleResArr(SearchTypeArr)}
                                            </Select>
                                        )}
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={24}>
                                <Col span={8}  >
                                    <Form.Item label="查询控件" >
                                        {getFieldDecorator('DF_QUERY_CONTROL_TYPE', {
                                            initialValue: record&&record.DF_QUERY_CONTROL_TYPE
                                        })(
                                            <Select  style={{ width: width }} >
                                                {this.handleResArr(queryConditionTypeArr)}
                                            </Select>
                                        )}
                                    </Form.Item>
                                </Col>
                                <Col span={8}  >
                                    <Form.Item label="查询方式" >
                                        {getFieldDecorator('DF_CONDITION', {
                                            initialValue: record&&record.DF_CONDITION 
                                        })(
                                            <Select  style={{ width: width }} >
                                                {this.handleResArr(conditionTypeArr)}
                                            </Select>
                                        )}
                                    </Form.Item>
                                </Col>
                                <Col span={8}  >
                                    <Form.Item label="列表宽度" >
                                        {getFieldDecorator('LIST_WITH', {
                                            initialValue: record&&record.LIST_WITH 
                                        })(
                                            <InputNumber  min={0} style={{ width: width }}/>
                                        )}
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={24}>
                                <Col span={8}  >
                                    <Form.Item label="提示信息" >
                                        {getFieldDecorator('DF_TOOLTIP', {
                                            initialValue: record&&record.DF_TOOLTIP 
                                            //  initialValue:"lucy" 
                                        })(
                                            <Input  style={{ width: width }}/>
                                        )}
                                    </Form.Item>
                                </Col>
                                <Col span={8}  >
                                    <Form.Item label="列格式化" >
                                        {getFieldDecorator('DF_FORMAT', {
                                            initialValue: record&&record.DF_FORMAT 
                                        })(
                                            <Input  style={{ width: width }}/>
                                        )}
                                    </Form.Item>
                                </Col>
                                <Col span={8}  >
                                    <Form.Item label="宽度" >
                                        {getFieldDecorator('DF_WIDTH', {
                                            initialValue: record&&record.DF_WIDTH 
                                        })(
                                            <InputNumber  min={0} style={{ width: width }}/>
                                        )}
                                    </Form.Item>
                                </Col>
                               
                            </Row>
                            <Row gutter={24}>
                                <Col span={8}  >
                                    <Form.Item label="高度" >
                                        {getFieldDecorator('DF_HEIGHT', {
                                            initialValue: record&&record.DF_HEIGHT 
                                        })(
                                            <InputNumber min={0} style={{ width: width }}/>
                                        )}
                                    </Form.Item>
                                </Col>
                                <Col span={8}  >
                                    <Form.Item label="维护页面控件样式" >
                                        {getFieldDecorator('DF_OPECLASS', {
                                            initialValue: record&&record.DF_OPECLASS 
                                        })(
                                            <Input  style={{ width: width }}/>
                                        )}
                                    </Form.Item>
                                </Col>
                                <Col span={8}  >
                                    <Form.Item label="默认值" >
                                        {getFieldDecorator('DF_DEFAULTVALUE', {
                                            initialValue: record&&record.DF_DEFAULTVALUE 
                                        })(
                                            <Input  style={{ width: width }}/>
                                        )}
                                    </Form.Item>
                                </Col>
                              
                            </Row>
                            <Row gutter={24}>
                                <Col span={8}  >
                                    <Form.Item label="外键类型" >
                                        {getFieldDecorator('DF_FOREIGN_TYPE', {
                                            initialValue: record&&
                                            record.DF_FOREIGN_TYPE=="无"?'0':
                                            record.DF_FOREIGN_TYPE=="表链接"?'1': 
                                            record.DF_FOREIGN_TYPE=="枚举"?'2':undefined
                                        })(
                                            <Select  
                                                style={{ width: width }} 
                                                onChange={this.handelDFFOREIGNTYPE}
                                            >
                                                {this.handleResArr(foreignTypeArr)}
                                            </Select>
                                        )}
                                    </Form.Item>
                                </Col>
                                <Col span={8}  >
                                    <Form.Item label="关联关系" >
                                        {getFieldDecorator('FOREIGH_RELATION_TYPE', {
                                            initialValue: record&&record.FOREIGH_RELATION_TYPE 
                                        })(
                                            <Select  style={{ width: width }} >
                                                {this.handleResArr(foreignRelTypeArr)}
                                            </Select>
                                        )}
                                    </Form.Item>
                                </Col>
                                <Col span={8}  >
                                    <Form.Item label="外表ConfigID" >
                                        {getFieldDecorator('FOREIGH_DT_CONFIGID', {
                                            initialValue: record&&record.FOREIGH_DT_CONFIGID 
                                            //  initialValue:"lucy"
                                        })(
                                            <Select  
                                                style={{ width: width }} 
                                                onChange={this.handelFOREIGHDT}
                                            >
                                                {
                                                   this.handleForeighArr()
                                                }
                                              
                                            </Select>
                                        )}
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={24}>
                                <Col span={8}  >
                                    <Form.Item label="外键Code" >
                                        {getFieldDecorator('FOREIGN_DF_ID', {
                                            initialValue: record&&record.FOREIGN_DF_ID 
                                        })(
                                            <Select  
                                                style={{ width: width }} 
                                                // onChange={this.handelFOREIGNDF}
                                            >
                                                {this.handleForeiGndfArr()}
                                            </Select>
                                        )}
                                    </Form.Item>
                                </Col>
                                <Col span={8}  >
                                    <Form.Item label="外键Name" >
                                        {getFieldDecorator('FOREIGN_DF_NAME', {
                                            initialValue: record&&record.FOREIGN_DF_NAME?record.FOREIGN_DF_NAME:undefined
                                            // initialValue:"lucy" 
                                        })(
                                            <Select 
                                                style={{ width: width }} 
                                                mode="multiple"
                                            >
                                                {this.handleForeiGndfArr()}
                                            </Select>
                                        )}
                                    </Form.Item>
                                </Col>
                                <Col span={8}  >
                                    <Form.Item label="枚举值" >
                                        {getFieldDecorator('ENUM_NAME', {
                                            initialValue: record&&record.ENUM_NAME 
                                        })(
                                            <Input style={{ width: 134 }}/>
                                        )}
                                        <AutoFormAddTable setEnumName={this.props.form.setFieldsValue} getEnumName={this.props.form.getFieldValue} record={record}/>

                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={24}>
                                <Col span={8}  >
                                    <Form.Item label="其他配置" >
                                        {getFieldDecorator('DF_OtherOptions', {
                                            initialValue: record&&record.DF_OtherOptions 
                                            // initialValue:"lucy" 
                                        })(
                                            <Input style={{ width: width }}/>
                                        )}
                                    </Form.Item>
                                </Col>
                                <Col span={8}  >
                                    <Form.Item label="日期格式化" >
                                        {getFieldDecorator('DF_DATEFORMAT', {
                                            initialValue: record&&record.DF_DATEFORMAT 
                                        })(
                                            <Input style={{ width: width }}/>
                                        )}
                                    </Form.Item>
                                </Col>
                                <Col span={8}  >
                                    <Form.Item label="导入" >
                                        {getFieldDecorator('DF_ISIMPORT', {
                                            initialValue: record&&record.DF_ISIMPORT&&record.DF_ISIMPORT.toString()
                                        })(
                                            <Select  style={{ width: width }} >
                                              {this.handleResArr(importTypeArr)}
                                            </Select>
                                        )}
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={24}>
                                <Col span={8}  >
                                    <Form.Item label="单位" >
                                        {getFieldDecorator('DF_Unit', {
                                            initialValue: record&&record.DF_Unit 
                                        })(
                                            <Input style={{ width: width }}/>
                                        )}
                                    </Form.Item>
                                </Col>
                                <Col span={8}  >
                                    <Form.Item label="列格式化" >
                                        {getFieldDecorator('DF_ISFormat', {
                                            initialValue: record&&record.DF_ISFormat 
                                        })(
                                            <Select  style={{ width: width }} >
                                              {this.handleResArr(FormatType)}
                                            </Select>
                                        )}
                                    </Form.Item>
                                </Col>
                                <Col span={8}  >
                                    <Form.Item label="对齐方式" >
                                        {getFieldDecorator('DF_ALIGN', {
                                            initialValue: record&&record.DF_ALIGN 
                                        })(
                                            <Select  style={{ width: width }} >
                                              {this.handleResArr(AlignType)}
                                            </Select>
                                        )}
                                    </Form.Item>
                                </Col>
                            </Row>
                                   
                        </Form>
                </Modal>
          </div>
        );
    }
}
export default Form.create()(AutoFormField);
