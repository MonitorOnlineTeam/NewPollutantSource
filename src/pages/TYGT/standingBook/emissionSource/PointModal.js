/*
 * @Author: JiaQi 
 * @Date: 2022-11-23 09:17:11 
 * @Last Modified by: JiaQi
 * @Last Modified time: 2022-11-23 09:17:41
 * @Description: 点位关联配置页面
 */
import React, { PureComponent } from 'react'
import { Modal, Transfer, Radio } from 'antd'
import { connect } from 'dva';
import SelectPollutantType from '@/components/SelectPollutantType'
import { formatDataSource } from './_utils'

@connect(({ standingBook, common, loading }) => ({
  installationData: standingBook.installationData,
  pointModalVisible: standingBook.pointModalVisible,
  pollutantTypelist: common.pollutantTypelist,
  // loading: loading.effects['standingBook/getDayReportTableData'],
}))
class PointModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      entCode: props.entCode,
      dataSource: [],
      allDataSource: [],
      targetKeys: [],
    };

    this._CONST = {
    }
  }

  componentDidMount() {
    this.getPageData();
  }

  // 获取页面数据
  getPageData = () => {
    const { targetRowData } = this.props;
    this.props.dispatch({
      type: 'standingBook/GetInstallationByEmission',
      payload: {
        "emissionID": targetRowData['dbo.T_Cod_UnEmissionAndEnt.EmissionID'],
        "installationType": 5,
        "entCode": targetRowData['dbo.T_Bas_Enterprise.EntCode'],
      }
    }).then(() => {
      let { installationData } = this.props;
      let targetKeys = [];
      installationData.Point.BindData.map(item => {
        targetKeys.push(item.Key);
      })
      this.setState({
        targetKeys,
        dataSource: formatDataSource(installationData.Point.AllData, ''),
        allDataSource: formatDataSource(installationData.Point.AllData, '')
      })
    })
  }

  // 穿梭框Change
  handleChange = (newTargetKeys) => {
    this.setState({
      targetKeys: newTargetKeys
    })
  };

  // 提交保存
  onSubmitSave = () => {
    const { targetRowData } = this.props;
    const { targetKeys } = this.state;
    // return;
    this.props.dispatch({
      type: 'standingBook/SetInstallation',
      payload: {
        "relationIDs": {
          5: targetKeys.toString(),
        },
        "installationType": 5,
        "emissionID": targetRowData['dbo.T_Cod_UnEmissionAndEnt.EmissionID']
      }
    })
  }

  // 关闭弹窗
  onCancel = () => {
    this.props.dispatch({
      type: 'standingBook/updateState',
      payload: {
        pointModalVisible: false
      }
    })
  }

  // 污染物类型选择
  onPollutantTypeChange = (e) => {
    const value = e.target.value + '';
    console.log('value', value)
    const { dataSource, allDataSource } = this.state;
    let temp_dataSource = [];
    if (value.split(',').length > 1) {
      // 全部
      temp_dataSource = allDataSource
    } else {
      temp_dataSource = allDataSource.filter(item => item.PollutantType === value);
    }
    this.setState({
      dataSource: temp_dataSource
    })
  }

  render() {
    const { pointModalVisible } = this.props;
    const { dataSource, targetKeys } = this.state;
    return <Modal
      title="环保点位关联关系配置"
      visible={pointModalVisible}
      width={800}
      onOk={this.onSubmitSave}
      onCancel={this.onCancel}
    >
      <SelectPollutantType
        style={{ marginBottom: 20 }}
        showType="radio"
        showAll
        onChange={this.onPollutantTypeChange}
      />
      <Transfer
        dataSource={dataSource}
        showSearch
        listStyle={{ width: '50%', height: 300 }}
        titles={['未关联', '已关联']}
        filterOption={(inputValue, option) => option.title.indexOf(inputValue) > -1}
        targetKeys={targetKeys}
        onChange={this.handleChange}
        render={(item) => `${item.title}`}
      />
    </Modal>
  }
}

export default PointModal;