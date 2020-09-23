
import React, { Component } from 'react';
import BreadcrumbWrapper from "@/components/BreadcrumbWrapper"
import PageLoading from '@/components/PageLoading'
import  HistoryparData from './components/HistoryparData'

import NavigationTree from '@/components/NavigationTreeNew'


/**
 *动态管控 历史管控数据
 * jab 2020.09.01
 */

class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dgimn: props.location.query&&props.location.query.type==="alarm"?props.location.query.dgimn:"",
            title: '',
        };
    }

    changeDgimn = (value, selectItem)=> {
        this.setState({
            dgimn: value,
            title: selectItem.title,
        })
    }
   componentDidMount(){
       const { location } = this.props;
       if(location.query&&location.query.type==='alarm' ){
        this.setState({
            title: location.query.title,
        })  
       }
   }
    render() {
        const { dgimn,title } = this.state;

        const { location } = this.props;
        
        return (
            <div id='historyparData'>
              {location.query&&location.query.type==='alarm' ? null :  <NavigationTree onTreeSelect={(value,selectItem) => {  this.changeDgimn(value,selectItem) }} /> }

                <BreadcrumbWrapper extraName={ `${ title}`}>
                {location.query&&location.query.type==='alarm' ? <HistoryparData dgimn={location.query.dgimn} initLoadData location={this.props.location}/>  : dgimn?    <HistoryparData dgimn={dgimn} initLoadData location={this.props.location}/> : <PageLoading /> }  
                </BreadcrumbWrapper>
            </div>
        );
    }
}
export default Index;
