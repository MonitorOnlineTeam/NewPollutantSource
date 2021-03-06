
import React, { Component } from 'react'
import BreadcrumbWrapper from '@/components/BreadcrumbWrapper'
import { connect } from 'dva'
import { Select,} from 'antd'
//企业 大气站 列表组件
@connect(({  common }) => ({
  priseList:common.priseList,
  atmoStationList:common.atmoStationList,
}))
export default class Index extends Component {
  static defaultProps = {
    type:'1',
    regionCode:''
  };
  constructor(props) {
    super(props);

    this.state = {
    };
    
  }
  children = () => { //企业列表 or 大气站列表
    const { priseList,atmoStationList,type } = this.props;

    const selectList = [];
    if(type==1){
     if (priseList.length > 0) {
      priseList.map(item => {
        selectList.push(
          <Option key={item.EntCode} value={item.EntCode} title={item.EntName}>
            {item.EntName}
          </Option>,
        );
      }); 
    } 
   }else{
    if(atmoStationList.length > 0){
      atmoStationList.map(item => {
        selectList.push(
          <Option key={item.StationCode} value={item.StationCode} title={item.StationName}>
            {item.StationName}
          </Option>,
        );
      }); 
     }
  }

  return selectList;
  };
  componentDidMount() {
    const {type,dispatch,regionCode} = this.props;
    type==1? dispatch({ type: 'common/getEntByRegion', payload: { RegionCode: regionCode },  }) : dispatch({ type: 'defectData/getStationByRegion', payload: { RegionCode: regionCode },  });  
 
  
   }
   componentDidUpdate(props) {
    const { type,dispatch,regionCode } = this.props;

    if (props.regionCode !== regionCode) {
       type==1? dispatch({ type: 'common/getEntByRegion', payload: { RegionCode: regionCode },  }) : dispatch({ type: 'defectData/getStationByRegion', payload: { RegionCode: regionCode },  });  

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
                                                                                             