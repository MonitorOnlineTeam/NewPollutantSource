/*
 * @Description: 设置点位访问权限
 * @Author: outman0611
 * @Date: 2024-09-30 10:42:07
 * @LastEditors: outman0611
 * @LastEditTime: 2025-01-14 09:49:40
 */
import React, { Component, Fragment } from 'react';
import { ExportOutlined } from '@ant-design/icons';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import {
  Card,
  Table,
  DatePicker,
  Progress,
  Row,
  Popover,
  Col,
  Badge,
  Modal,
  Input,
  Button,
  Select,
  Tooltip,
  Popconfirm,
  Divider,
  TreeSelect,
  Spin,
  Empty,
} from 'antd';

import { connect } from 'dva';
import AutoFormTable from '@/pages/AutoFormManager/AutoFormTable';
import SearchWrapper from '@/pages/AutoFormManager/SearchWrapper';
import { UserOutlined, DatabaseOutlined, CloseCircleOutlined } from '@ant-design/icons';
import SelectPollutantType from '@/components/SelectPollutantType';
import TreeTransfer from '@/components/TreeTransfer';
const { SHOW_PARENT } = TreeSelect;

@connect(({ loading, autoForm, common }) => ({
  regionInfoTree: autoForm.regionList,
  entAndPointList: common.entAndPointList,
  getEntPointLoading: loading.effects['common/getEntAndPointList'],
  getPollutantTypeListLoading: loading.effects['common/getPollutantTypeList'],
}))
@Form.create()
export default class Index extends Component {
  constructor(props) {
    super(props);

    this.state = {
      regionCode: undefined,
      pollutantType: 2,
      entPointName: '',
      pointPermissionCheckedKeys: [],
      settingPointPermission: false,
    };
  }

  componentDidMount() {
    // this.initData();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.visible !== this.props.visible && this.props.visible) {
      this.initData();
    }
  }

  initData = () => {
    this.getEntAndPointList();
  };

  // 获取企业和排口
  getEntAndPointList = () => {
    this.props.dispatch({
      type: 'common/getEntAndPointList',
      payload: {
        Status: [],
        RunState: 1,
        RegionCode: this.state.regionCode?.toString(),
        PollutantTypes: this.state.pollutantType,
        Name: this.state.entPointName,
      },
    });
  };

  /** 设置点位访问权限切换行政区 */
  regionChange = value => {
    this.setState(
      {
        regionCode: value,
      },
      () => {
        this.getEntAndPointList();
      },
    );
    this.props.getSettingPointList({ RegionCode: value?.toString() });
  };
  /** 设置点位访问权限切换污染物 */
  pollutantChange = e => {
    this.setState({ pollutantType: e.target.value }, () => {
      this.getEntAndPointList();
    });
    this.props.getSettingPointList({ PollutantType: e.target.value });
  };

  pointAccessClick = () => {
    this.getEntAndPointList();
    this.props.getSettingPointList({});
  };

  render() {
    const tProps = {
      treeData: this.props.regionInfoTree,
      value: this.state.regionCode,
      onChange: this.regionChange,
      treeCheckable: true,
      showCheckedStrategy: SHOW_PARENT,
      searchPlaceholder: '行政区',
      treeDefaultExpandedKeys: ['0'],
      style: {
        width: 200,
        marginLeft: 16,
      },
      dropdownStyle: {
        maxHeight: '700px',
        overflowY: 'auto',
      },
      showSearch: true,
      filterOption: (input, option) => {
        if (option && option.props && option.props.title) {
          return option.props.title === input || option.props.title.indexOf(input) !== -1;
        } else {
          return true;
        }
      },
    };
    return (
      <Modal
        title={`设置点位访问权限 - ${this.props.title}`}
        visible={this.props.visible}
        destroyOnClose
        onCancel={() => {
          this.setState({
            regionCode: undefined,
            pollutantType: 2,
            entPointName: '',
            pointPermissionCheckedKeys: [],
            settingPointPermission: false,
          });
          this.props.onCancel();
        }}
        width={1100}
        footer={null}
        bodyStyle={{
          overflowY: 'auto',
          maxHeight: this.props.clientHeight - 240,
        }}
      >
        {
          <div>
            <Row style={{ background: '#fff', paddingBottom: 10, zIndex: 1 }}>
              <Spin size="small" spinning={this.props.getPollutantTypeListLoading}>
                <SelectPollutantType
                  showType="radio"
                  mode="multiple"
                  value={this.state.pollutantType}
                  onChange={this.pollutantChange}
                  onlyShowEnt
                />
              </Spin>
              <TreeSelect {...tProps} treeCheckable={false} allowClear placeholder="请选择行政区" />
              <Input.Group compact style={{ width: 290, marginLeft: 16, display: 'inline-block' }}>
                <Input
                  style={{ width: 200 }}
                  allowClear
                  placeholder="请输入企业名称"
                  onBlur={e => this.setState({ entPointName: e.target.value })}
                />
                <Button
                  type="primary"
                  loading={
                    this.props.getEntPointLoading ||
                    this.props.getSettingPointPointLoading ||
                    !!this.props.settingPointLoading ||
                    !!this.props.getPollutantTypeListLoading
                  }
                  onClick={this.pointAccessClick}
                >
                  查询
                </Button>
              </Input.Group>
            </Row>
            {this.props.getEntPointLoading || this.props.getSettingPointPointLoading ? (
              <Spin
                style={{
                  width: '100%',
                  height: 'calc(100vh/2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                size="large"
              />
            ) : this.props.entAndPointList?.length > 0 ? (
              <Spin spinning={!!this.props.settingPointLoading}>
                <TreeTransfer
                  key="key"
                  treeData={this.props.entAndPointList}
                  disabled={this.props.disabled}
                  listDisabled={this.props.listDisabled}
                  checkedKeys={this.props.checkedKeys}
                  targetKeysChange={(key, type, callback) => {
                    const entKeyArray = this.props.entAndPointList.map(obj => obj.key);
                    key = key.filter(value => !entKeyArray.includes(value)); // 过滤key值包含企业key的值  全选某个企业会出现包含企业key值的情况
                    this.props.targetKeysChange(key, type == 1 ? 1 : 2, callback);
                  }}
                />
              </Spin>
            ) : (
              <Empty style={{ marginTop: 70 }} image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
          </div>
        }
      </Modal>
    );
  }
}
