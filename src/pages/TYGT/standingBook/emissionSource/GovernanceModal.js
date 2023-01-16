/*
 * @Author: JiaQi 
 * @Date: 2022-11-18 09:40:22 
 * @Last Modified by: JiaQi
 * @Last Modified time: 2022-12-26 16:21:27
 * @Description: 关联治理设施弹窗
 */
import React, { PureComponent } from 'react'
import { Modal, Transfer, Radio } from 'antd'
import { connect } from 'dva';

@connect(({ standingBook, loading }) => ({
  installationData: standingBook.installationData,
  governanceModalVisible: standingBook.governanceModalVisible,
  // loading: loading.effects['standingBook/getDayReportTableData'],
}))
class GovernanceModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      entCode: props.entCode,
      dataSource: [],
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
        "installationType": 1,
        "entCode": targetRowData['dbo.T_Bas_Enterprise.EntCode'],
      }
    }).then(() => {
      let { installationData } = this.props;
      console.log('installationData', installationData)
      let targetKeys = [], bindKeysArr = [];
      installationData.Duster.BindData.map(item => {
        targetKeys.push(item.Key + '|Duster');
      })
      installationData.EcoCar.BindData.map(item => {
        targetKeys.push(item.Key + '|EcoCar');
      })
      installationData.FogGun.BindData.map(item => {
        targetKeys.push(item.Key + '|BindData');
      })
      this.setState({
        targetKeys,
        bindKeysArr,
        dataSource: this.formatDataSource(installationData.Duster.AllData, 'Duster')
      })
    })
  }

  // 格式化数据
  formatDataSource = (dataSource, type) => {
    return dataSource.map(item => {
      return {
        key: item.Key + '|' + type,
        title: item.Value,
      }
    })
  }

  // 穿梭框Change
  handleChange = (newTargetKeys) => {
    console.log('newTargetKeys', newTargetKeys)
    this.setState({
      targetKeys: newTargetKeys
    })
  };

  // 类型选择
  onTypeChange = (e) => {
    let { installationData } = this.props;
    let targetValue = e.target.value;
    this.setState({
      dataSource: this.formatDataSource(installationData[targetValue].AllData, targetValue)
    })
  };

  // 提交保存
  onSubmitSave = () => {
    const { targetRowData } = this.props;
    let Duster = [], FogGun = [], EcoCar = [];
    this.state.targetKeys.map(item => {
      let items = item.split("|");
      if (items) {
        let key = items[0];
        if (items[1] === 'Duster') {
          Duster.push(key);
        }
        if (items[1] === 'FogGun') {
          FogGun.push(key);
        }
        if (items[1] === 'EcoCar') {
          EcoCar.push(key);
        }
      }
    })
    // return;
    this.props.dispatch({
      type: 'standingBook/SetInstallation',
      payload: {
        "relationIDs": {
          1: Duster.toString(),
          2: FogGun.toString(),
          3: EcoCar.toString()
        },
        "installationType": 1,
        "emissionID": targetRowData['dbo.T_Cod_UnEmissionAndEnt.EmissionID']
      }
    })
  }

  // 关闭弹窗
  onCancel = () => {
    this.props.dispatch({
      type: 'standingBook/updateState',
      payload: {
        governanceModalVisible: false
      }
    })
  }

  render() {
    const { governanceModalVisible } = this.props;
    const { dataSource, targetKeys } = this.state;
    console.log('dataSource', dataSource)
    return <Modal
      title="治理设施关系配置"
      visible={governanceModalVisible}
      width={800}
      onOk={this.onSubmitSave}
      onCancel={this.onCancel}
    >
      <Radio.Group onChange={this.onTypeChange} defaultValue="Duster" style={{ marginBottom: 20 }}>
        <Radio.Button value="Duster">除尘器</Radio.Button>
        <Radio.Button value="FogGun">雾炮</Radio.Button>
        {/* <Radio.Button value="EcoCar">环保车</Radio.Button> */}
      </Radio.Group>
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

export default GovernanceModal;