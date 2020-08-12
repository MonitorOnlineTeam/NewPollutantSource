import React, { Component } from 'react';
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import NavigationTree from '@/components/NavigationTree'
import PageLoading from '@/components/PageLoading'
import  HistoryDatas from './components/HistoryDatas'
/**
 * 数据查询 历史数据
 * jab 2020.07.30
 */
import { connect } from 'dva';
@connect(({ loading,historyData }) => ({
    dgimn:historyData.dgimn
}))
class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dgimn: '',
            pointName: '',
            entName: '',
        };
    }

    changeDgimn = value => {
        // console.log(value)
        this.setState({
            dgimn: value[0].key,
            pointName: value[0].pointName,
            entName: value[0].entName,
        })
        let { dgimn, dispatch } = this.props;
         dgimn = value[0].key;
        
         dispatch({ type: 'historyData/updateState', payload: { dgimn  } })
    }

    render() {
        const { pointName, entName,dgimn } = this.state;
        return (
            <div id="historyData">

               <NavigationTree  domId="#dataquery" choice={false} runState='1' domId="#dataquery" choice={false} onItemClick={value => {
                    if (value.length > 0 && !value[0].IsEnt) {
                        this.changeDgimn(value)
                    }
                }} /> 


                <BreadcrumbWrapper extraName={ `${entName} - ${ pointName}`}>
                    {/* {
                        this.state.dgimn ?
                            (
                                this.props.location.query.type == 1 ? <DataQuery2 DGIMN={this.state.dgimn} pointName={pointName} entName={entName} initLoadData /> :
                                    <DataQuery DGIMN={this.state.dgimn} pointName={pointName} entName={entName} initLoadData />
                            )
                            : <PageLoading />
                    } */}
                    <HistoryDatas  DGIMN={dgimn} initLoadData/>
                </BreadcrumbWrapper>
            </div>
        );
    }
}
export default Index;
