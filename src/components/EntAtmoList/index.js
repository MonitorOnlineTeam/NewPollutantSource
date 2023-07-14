
import React, { Component } from 'react'
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper'
import { connect } from 'dva'
import { Select,} from 'antd'
//企业 大气站 列表组件
@connect(({  common }) => ({
  entList:common.entList,
  noFilterEntList:common.noFilterEntList,
  atmoStationList:common.atmoStationList,
}))
export default class Index extends Component {
  static defaultProps = {
    type:1,
    regionCode:''
  };
  constructor(props) {
    super(props);

    this.state = {
    };
    
  }
  children = () => { //企业列表 or 大气站列表
    const { entList,atmoStationList,type,noFilter,noFilterEntList, } = this.props;

    const selectList = [];

    if(type==1){
      if(noFilter){
       if (noFilterEntList.length > 0) {
        noFilterEntList.map(item => {
          selectList.push(
           <Option key={item.EntCode} value={item.EntCode} title={item.EntName}>
             {item.EntName}
           </Option>,
        );
      }); 
      }
     }else{
       if (entList.length > 0) {
          entList.map(item => {
          selectList.push(<Option key={item.EntCode} value={item.EntCode} title={item.EntName}> {item.EntName}</Option>,
        );
       }); 
     }
    } 
   }else{
    if(atmoStationList.length > 0){
      atmoStationList.map(item => {
        selectList.push( <Option key={item.StationCode} value={item.StationCode} title={item.StationName}> {item.StationName} </Option>,
        );
      }); 
     }
  }

  return selectList;
  };
  componentDidMount() {
    const {type,dispatch,regionCode,pollutantType,entList,atmoStationList,noFilter,noFilterEntList,} = this.props;
    switch(type) {
        case 1: //企业
           if(noFilter){ //不用过滤的企业列表
             if(noFilterEntList&&noFilterEntList.length){return}
               dispatch({ type:'common/getEntNoFilterList', payload: { RegionCode: regionCode, PollutantType: pollutantType },  }) 
           }else{
            if(entList&&entList.length){return}
              dispatch({ type:'common/getEntByRegion', payload: { RegionCode: regionCode, PollutantType: pollutantType },  }) 
          }
             break;
         case 2: //空气站
          if(!(atmoStationList&&atmoStationList[0]&&regionCode)){
            dispatch({ type: 'defectData/getStationByRegion', payload: { RegionCode: regionCode },  }); 
          }
            break;
         }

   }
   componentDidUpdate(props) {
    const { type,dispatch,regionCode,pollutantType,noFilter } = this.props;
    if (props.regionCode !== regionCode || props.pollutantType !== pollutantType) {
       type==1? dispatch({ type: noFilter? 'common/getEntNoFilterList' : 'common/getEntByRegion', payload: { RegionCode: regionCode, PollutantType: pollutantType },  }) : dispatch({ type: 'defectData/getStationByRegion', payload: { RegionCode: regionCode },  });  
    }
  }
  render() {
      const {EntCode,changeEnt,type} = this.props
    return (
        <Select
        allowClear
        showSearch
        optionFilterProp="children"
        placeholder={type==1? "企业列表":"大气站列表"}
        onChange={changeEnt}
        value={EntCode ? EntCode : undefined}
        style={{width:'200px'}}
        {...this.props}
      >
        {this.children()}
      </Select>
    );
  }
}
                                                                                             