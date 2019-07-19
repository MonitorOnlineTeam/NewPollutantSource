import React, { Component } from 'react'
import { Form, Select, Input, Button, Drawer, Radio, Collapse, Table,Badge,Icon,Divider,Row,Tree,Empty    } from 'antd';
import { connect } from 'dva';
import EnterprisePointCascadeMultiSelect from '../../components/EnterprisePointCascadeMultiSelect'

const RadioGroup = Radio.Group;
const { Panel } = Collapse;
const { Option } = Select;
const { Search } = Input;
const { TreeNode } = Tree;


const children = [];

@connect(({ navigationtree, loading }) => ({
  EntAndPoint: navigationtree.EntAndPoint,
  PollutantType: navigationtree.PollutantType,
  EntAndPointLoading: loading.effects['navigationTree/getentandpoint'],
  PollutantTypeLoading: loading.effects['navigationTree/getPollutantTypeList'],
}))
@Form.create()


class NavigationTree extends Component {
  state = { 
    columns: [
      {
        title: 'Name',
        dataIndex: 'Name',
        key: 'Name',
      },
      {
        title: 'Status',
        dataIndex: 'Status',
        key: 'Status',
        width: '12%',
        render: (text, record) =>{
          let sta="success";
          let title="正常"
          if(record.IsEnt==1)
          {
            return record.Status;
          }else
          {
            if(record.Status==-1)//没有状态
            {
              return "";
            }else
            {
              if(record.Status==0)//离线
              {
                sta="default";
                title="离线";
              } 
              if(record.Status==1)//正常
              {
                sta="success";
                title="正常";
              } 
              if(record.Status==2)//超标
              {
                sta="error";
                title="超标";
              } 
              if(record.Status==3)//异常
              {
                sta="warning";
                title="异常";
              } 
              return <Badge status={sta} dot={true} showZero={true} title={title} />
            }
          }
        }
         
      },
    ],
    visible: true,
    Name:"",
    Status:"",
    RegionCode:"",
    right:"caret-right",
    expandedKeys: [],
    autoExpandParent: true,
    checkedKeys: [],
    selectedKeys: [],
     placement: 'left',
     } 

     componentDidMount() {
      this.props.dispatch({
          type: 'navigationtree/getentandpoint',
          payload: {
          }
      })
      this.props.dispatch({
        type: 'navigationtree/getPollutantTypeList',
        payload: {
        }
       
    })
    
      // this.props.dispatch({
      //     type: 'roleinfo/getrolestreeandobj',
      //     payload: {}
      // })

      // this.props.dispatch({
      //     type: 'roleinfo/getdepbyuserid',
      //     payload: {
      //         User_ID: this.props.match.params.userid,
      //     }
      // })
  }
  componentWillReceiveProps(nextProps) {
    console.log("next=",nextProps.PollutantType);
    console.log("this=",this.props.PollutantType);
    if (this.props.PollutantType !== nextProps.PollutantType) {
      
     nextProps.PollutantType.map(m=> children.push(<Option key={m.pollutantTypeCode}>{m.pollutantTypeName}</Option>));
    }
    
   
}
  showDrawer = () => {
    this.setState({
      visible: true,
    });
  };

  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  onChange = e => {
    this.setState({
      placement: e.target.value,
    });
  };

  handleChange = (value) => {
    console.log(`selected ${value}`);
    value=value.toString()
    this.setState({
      PollutantTypes:value,
    })
    this.props.dispatch({
      type: 'navigationtree/getentandpoint',
      payload: {
        PollutantTypes:value,
        RegionCode:this.state.RegionCode,
        Name:this.state.Name,
      }
  })
  console.log("list=",this.props.EntAndPoint)
  }
  onTextChange=(value)=>{
    this.setState({
      Name:value
    })
    this.props.dispatch({
      type: 'navigationtree/getentandpoint',
      payload: {
        Name:value,
        PollutantTypes:this.state.PollutantTypes,
        RegionCode:this.state.RegionCode
      }
  })
  console.log("list=",this.props.EntAndPoint)
  }
  changeState=()=>{
    this.setState({
      visible:!this.state.visible,
      right:this.state.right==="caret-right"?"caret-left":"caret-right"
    });
  };
  regionChange=(value)=>{
    value=value.toString()
    this.setState({
      RegionCode:value
    })
    this.props.dispatch({
      type: 'navigationtree/getentandpoint',
      payload: {
        Name:this.state.Name,
        PollutantTypes:this.state.PollutantTypes,
        RegionCode:value
      }
  })
  console.log("list=",this.props.EntAndPoint)
  }
  onExpand = expandedKeys => {
    console.log('onExpand', expandedKeys);
    // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  };

  onCheck = checkedKeys => {
    console.log('onCheck', checkedKeys);
    this.setState({ checkedKeys });
  };
  GetColor=(item)=>{
    if(item.Status==0)
    {
      return "/gisunline.png"
    }
    if(item.Status==1)
    {
      return "/gisnormal.png"
    }
    if(item.Status==2)
    {
      return "/gisover.png"
    }
    if(item.Status==3)
    {
      return "/gisexception.png"
    }
  }

  onSelect = (selectedKeys, info) => {
    console.log('onSelect', selectedKeys);
    var list=this.state.checkedKeys;
    
  var children=info.node.props.children?info.node.props.children.map(m=>m.key):selectedKeys
  console.log("children=",info.node.props.children)
  console.log("cccc",children)
  children.map(item=>
    {
      console.log("oush")
      var index=list.indexOf(item)
      if (index== -1) {
        console.log("oush11")
        list.push(selectedKeys);
    }else
    {
      console.log("splice=",index)
      list.splice(index,1);
    }
  }
  )

    this.setState({ checkedKeys:list });
  };
  renderTreeNodes = data =>
  data.map(item => {
    if (item.children) {
      return (
        <TreeNode  style={{width:"100%"}} title={
        <div style={{width:"271px"}}><img src="/lablegas.png" style={{width:16,height:16,marginRight:3}} />{item.title}{item.IsEnt==0&&item.Status!=-1?<img src={this.GetColor(item)} style={{width:10,height:10, float: 'right',marginTop: 7}} />:""}</div>
        } key={item.key} dataRef={item}>
          {this.renderTreeNodes(item.children)}
        </TreeNode>
      );
    }
      return  <TreeNode   style={{width:"100%"}} title={
        <div style={{width:"253px"}}><img src="/lablegis.png" style={{width:16,height:16,marginRight:3}} />
        {item.title}{item.IsEnt==0&&item.Status!=-1?<img src={this.GetColor(item)} style={{width:10,height:10, float: 'right',marginTop: 7}} />:""}
        </div>
        } 
        key={item.key} dataRef={item}>
        </TreeNode>
  });
  render() {
   
    return (
      <div >
        <Button type="primary" onClick={this.showDrawer}>
          Open
      </Button>
      {/* <div visible={true} style={{
                position: "absolute",
                top: "50%",
                right: this.state.right,
                display: "flex",
                width: "18px",
                height: "48px",
                size: "16px",
                align: "center",
                textAlign:"center",
                background: "#1890FF",
                borderRadius:"4px 0 0 4px",
                cursor: "pointer",
          }} onClick={this.changeState}><Icon type="menu" /></div> */}
        <Drawer
          // title="导航菜单"
          placement={this.state.placement}
          closable={false}
          onClose={this.onClose}
          visible={this.state.visible}
          width={400}
          mask={false}
          style={{
            marginTop: 64
          }}
        >
          <Select
            mode="multiple"
            style={{ width: '100%', marginBottom: 10 }}
            placeholder="请选择污染物类型"
            // defaultValue={['a10', 'c12']}
            onChange={this.handleChange}
          >
            {children}
          </Select>
          <EnterprisePointCascadeMultiSelect
            // searchEnterprise={true}
            searchRegion={true}
            onChange={this.regionChange}
          />
          <Search
            placeholder="查询企业排口"
            onSearch={this.onTextChange}
            // onChange={console.log("111")}
            style={{ marginTop: 10 }}
          />
          <div style={{marginTop:15,marginLeft:30}}> 
          {/* <Badge status="success" dot={true} showZero={true} style={{marginLeft:20}} />正常
          <Badge status="default" dot={true} showZero={true} style={{marginLeft:20}}/>离线
          <Badge status="error" dot={true} showZero={true}  style={{marginLeft:20}}/>超标
          <Badge status="warning" dot={true} showZero={true}  style={{marginLeft:20}}/>异常 */}

          <img style={{marginLeft:20,width:11,height:11}} src="/gisnormal.png" />&nbsp;正常
          <img style={{marginLeft:20,width:11,height:11}} src="/gisunline.png" />&nbsp;离线
          <img style={{marginLeft:20,width:11,height:11}} src="/gisover.png" />&nbsp;超标
          <img style={{marginLeft:20,width:11,height:11}} src="/gisexception.png" />&nbsp;异常
          </div>
          <Divider />
          {/* <Collapse defaultActiveKey={['1']} bordered={false} width="100%">
            <Panel key='1' header="搜索条件" width="100%">
             
            </Panel>
          </Collapse> */}
  <div visible={true} style={{
                position: "absolute",
                top: "40%",
                // right: "400px",
                left:"400px",
                display: "flex",
                width: "18px",
                height: "48px",
                size: "16px",
                align: "center",
                textAlign:"center",
                background: "#1890FF",
                borderRadius:"4px 4px 4px 4px",
                cursor: "pointer",
          }} onClick={this.changeState}><a href="#"><Icon style={{marginTop:'110%',color:"#FFFFFF",marginLeft:"15%"}} type={this.state.right}/></a></div>
          
          {/* <Table  rowKey={(record,index) => record.ID} columns={this.state.columns} rowSelection={rowSelection} dataSource={this.props.EntAndPoint} size="middle" showHeader={false} pagination={false} style={{ marginTop: 20 }} 
          style={{ marginTop: "5%",maxHeight: 750, overflow: 'auto' }}
          /> */}
  {this.props.EntAndPoint.length ? <Tree
        checkable
        onExpand={this.onExpand}
        // expandedKeys={this.state.expandedKeys}
        defaultExpandAll={true}
        // autoExpandParent={this.state.autoExpandParent}
        onCheck={this.onCheck}
        checkedKeys={this.state.checkedKeys}
        onSelect={this.onSelect}
        selectedKeys={this.state.selectedKeys}
        style={{ marginTop: "5%",maxHeight: 750, overflow: 'auto',width:"100%" }}
      >
        {this.renderTreeNodes(this.props.EntAndPoint)}
      </Tree>:<Empty style={{ marginTop: 70 }} image={Empty.PRESENTED_IMAGE_SIMPLE} />}
          
        </Drawer>

      </div>


    );
  }
}

export default NavigationTree