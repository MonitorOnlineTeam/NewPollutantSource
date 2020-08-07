import React, { Component } from 'react';
import sytles from './index.less';
import { connect } from 'dva';
import { Input, Select, AutoComplete } from 'antd';
/*
组件：企业和监测点位组件
add by hsh 19.10.31
*/
const InputGroup = Input.Group;
const Option = Select.Option;
@connect(({ tasklistNew }) => ({
  EnterList: tasklistNew.EnterList,
  OneEnterPointList: tasklistNew.OneEnterPointList,
}))
export default class DepartmentPeople extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      pointDataSource: [],
      sltEnter: [],
      sltPoint: [],
    };
  }
  componentWillMount() {
    if (this.props.onRef !== undefined) {
      this.props.onRef(this);
    }
    this.props.dispatch({
      type: 'enterinfo/GetEnterListByName',
      payload: {
        PollutantType: this.props.pollutantType,
      },
    });
  }

  handleSearch = value => {
    if (this.props.EnterList === null || this.props.EnterList.length < 1 || value == '') {
      this.props.dispatch({
        type: 'pointinfo/updateState',
        payload: { OneEnterPointList: [] },
      });

      this.setState({
        dataSource: [],
      });
      return;
    }

    let data = this.props.EnterList.filter(item => item.enterName.indexOf(value) > -1);
    if (data.length > 0) {
      this.setState({
        dataSource: data.map(item => <Option key={item.enterCode}>{item.enterName}</Option>),
      });
    } else {
      this.setState({
        dataSource: [],
      });
    }
  };

  onSelect = (value, option) => {
    this.props.dispatch({
      type: 'pointinfo/GetPointInfoByEntNoPage',
      payload: {
        EnterCode: value,
        PollutantType: this.props.pollutantType,
      },
    });
    this.setState({
      sltPoint: [],
    });
  };

  onChange = value => {
    this.setState({
      sltEnter: value,
      sltPoint: [],
    });
    this.props.updateSltEnterModel(value);
    this.props.updateSltPointModel();
  };

  GetPoints = () => {
    let point = [];
    let OneEnterPointList = this.props.OneEnterPointList;
    if (OneEnterPointList != null && OneEnterPointList.length > 0) {
      OneEnterPointList.map(u =>
        point.push(
          <Option key={u.DGIMN} value={u.DGIMN}>
            {u.PointName}
          </Option>,
        ),
      );
    }
    return point;
  };

  onPointSelect = value => {
    this.setState({
      sltPoint: value,
    });
    this.props.updateSltPointModel(value);
  };

  //置空
  Reset = () => {
    this.setState({
      sltPoint: [],
      sltEnter: [],
      dataSource: [],
    });
  };

  render() {
    const { width, minWidth, pollutantType } = this.props;
    return (
      <div style={{ margin: 0, width: width, minWidth: minWidth }}>
        <InputGroup compact>
          <AutoComplete
            style={{ width: '50%' }}
            className="certain-category-search"
            dropdownClassName="certain-category-search-dropdown"
            dropdownMatchSelectWidth={false}
            dropdownStyle={{ width: 300 }}
            allowClear
            onSearch={this.handleSearch}
            onSelect={this.onSelect}
            onChange={this.onChange}
            value={this.state.sltEnter}
            placeholder="请输入企业名称"
          >
            {this.state.dataSource}
          </AutoComplete>
          <Select
            allowClear
            className="certain-category-search"
            dropdownClassName="certain-category-search-dropdown"
            dropdownMatchSelectMinWidth={false}
            dropdownStyle={{ minWidth: 150 }}
            value={this.state.sltPoint}
            style={{ width: '50%' }}
            placeholder="请选择监测点"
            onChange={this.onPointSelect}
            {...this.props}
          >
            {this.GetPoints()}
          </Select>
        </InputGroup>
      </div>
    );
  }
}
