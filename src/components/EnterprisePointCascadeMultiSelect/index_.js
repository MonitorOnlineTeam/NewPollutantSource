import React, { Component } from 'react';
import CascadeMultiSelect from 'uxcore/lib/CascadeMultiSelect';
import blue from '../../../node_modules/uxcore/assets/blue.css';
import iconfont from '../../../node_modules/uxcore/assets/iconfont.css';
import sytles from './index.less';
import { connect } from 'dva';
/*
组件：行政区划、企业选择点位组件
add by hsh 19.4.11
*/
@connect(({ region }) => ({
  enterpriseList: region.enterpriseList,
}))
export default class EnterpriseMultiSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentLevelNode: null,
      // valueList:[]
    };
  }
  componentWillMount() {
    this.props.dispatch({
      type: 'region/GetEntRegion',
      payload: {
        RegionCode: '',
      },
    });
  }

  render() {
    const config = [
      { checkable: false, showSearch: true },
      { checkable: true },
      { checkable: true },
    ];
    const { width, minWidth } = this.props;
    return (
      <div style={{ margin: 0, width: width, minWidth: minWidth }}>
        <CascadeMultiSelect
          config={config}
          className={sytles['kuma-cascader-wrapper']}
          dropdownClassName={'ucms-drop'}
          options={this.props.enterpriseList}
          cascadeSize={3}
          placeholder={this.props.placeholder || '请选择'}
          notFoundContent={'沒有数据'}
          onOk={(valueList, labelList, leafList) => {
            const values = leafList.map(p => p.value);
            this.props.updatePointModel(values);
          }}
          value={[]}
          size={'small'}
          onItemClick={(item, level) => {
            if (level === 1 && this.state.currentLevelNode !== item.value) {
              this.props.dispatch({
                type: 'region/GetEntRegion',
                payload: {
                  RegionCode: item.value,
                },
              });
              this.setState({ currentLevelNode: item.value });
            }
          }}
          onCancel={() => {}}
        />
      </div>
    );
  }
}
