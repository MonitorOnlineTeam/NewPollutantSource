import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import {
    Card,
    Button,
    Icon,
    Form,
    message
} from 'antd';
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import moment from 'moment';
import SdlForm from '@/pages/AutoFormManager/SdlForm';
import { routerRedux } from 'dva/router';
import styles from './addDataReport.less';
import { sdlMessage, handleFormData, getRowCuid } from '@/utils/utils';
@connect(({ loading, autoForm, datareport }) => ({
    loading: loading.effects['autoForm/getPageConfig'],
    autoForm,
    searchConfigItems: autoForm.searchConfigItems,
    tableInfo: autoForm.tableInfo,
    searchForm: autoForm.searchForm,
    routerConfig: autoForm.routerConfig,
    userandentInfo:datareport.userandentInfo
}))
@Form.create()
export default class addDataReport extends Component {
    
    constructor(props){
        super(props);
        this.state={
            cuid:null
        }
    }
    componentDidMount(){
      this.reloadPage();
    }
    reloadPage = () => {
      const { dispatch } = this.props;
      dispatch({type:'datareport/getDataReportUserAndEntInfo',payload:{}})
      dispatch({
          type: 'autoForm/updateState',
          payload: {
              routerConfig: "DataReporting",
          },
      });
      dispatch({
          type: 'autoForm/getPageConfig',
          payload: {
              configId:"DataReporting",
          },
      })
  }

    onSubmitForm=()=>{
        const { dispatch, match, pointDataWhere, form,userandentInfo,match: { params: { monitortime,entcode } } } = this.props;
        form.validateFields((err, values) => {
            if (!err) {
              const FormData = handleFormData(values);
              if (!Object.keys(FormData).length) {
                sdlMessage('数据为空', 'error');
                return false;
              }
              if (this.state.isEdit) {
                FormData.ID = this.props.match.id;
              }
            }
            let params={};
            if(match.params && match.params.id && match.params.id!="null")
            {
              params={
                MonitorTime:values.MonitorTime.format('YYYY-MM-DD 00:00:00'),
                SludgeWater:values.SludgeWater,
                DealSludge:values.DealSludge,
                DealMudCake:values.DealMudCake,
                CODEmissionReduction:values.CODEmissionReduction,
                NHEmissionReduction:values.NHEmissionReduction,
                Electricity:values.Electricity,
                PowerConsumption:values.PowerConsumption,
                PAMElectricity:values.PAMElectricity,
                RunningCost:values.RunningCost,
                DealSewageCost:values.DealSewageCost,
                EntCode: userandentInfo?userandentInfo.entID:null,
                ID:match.params.id
            };
            }
            else
            {
              params={
                ...values,
                EntCode: userandentInfo?userandentInfo.entID:null,
                MonitorTime:values.MonitorTime.format('YYYY-MM-DD 00:00:00'),
              };
            }
           
            dispatch({
               type:"datareport/addDataReport",
               payload:{
                ...params,
                callback:res=>{
                    if(res.IsSuccess)
                    {
                      dispatch(routerRedux.push(`/Intelligentanalysis/SewagePlant/DataReporting/DataReporting/${monitortime}/${entcode}`));
                    }
                }
               }
            })
          });
    }
    handleCancel=()=>{
      const {dispatch , match: { params: { monitortime,entcode } }}=this.props;
      dispatch(routerRedux.push(`/Intelligentanalysis/SewagePlant/DataReporting/DataReporting/${monitortime}/${entcode}`));
    }
    
    render() {
    const {userandentInfo,match}=this.props;
    let isEdit=false;
    let id=null;
    
    if(match.params && match.params.id && match.params.id!="null")
    {
       
       id=match.params.id;
       isEdit=true;
    }
        return (
        <BreadcrumbWrapper title="数据上报添加"> 
        <Card 
           title={
            <span>
              {userandentInfo?userandentInfo.entName:null}
              <Button
                style={{ marginLeft: 10 }}
                onClick={() => {
                  history.go(-1);
                }}
                type="link"
                size="small"
              >
                <Icon type="rollback" />
                返回上级
              </Button>
            </span>
          }>
         <SdlForm
                configId={"DataReporting"}
                onSubmitForm={this.onSubmitForm.bind(this)}
                form={this.props.form}
                noLoad
                hideBtns
                uid={this.state.cuid}
                isEdit={isEdit}
                keysParams={{ 'dbo.T_Bas_DataReporting.ID': id }}
              />
              <div className={styles.footer}>
                <Button className={styles.button} key="back" onClick={this.handleCancel}>
                    取消
                </Button>   
                <Button key="submit" type="primary" 
                onClick={this.onSubmitForm.bind(this)}>
                  确定
                 </Button>
            </div>
        </Card>
          </BreadcrumbWrapper>)
    }
}