import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'dva';
import { Row, Col,Modal} from 'antd';
import styles from '@/pages/SystemDashboard/styles.less';
import HomeCard from '@/pages/SystemDashboard/components/HomeCard';
import moment from 'moment';
import SupervisionAnalySumm from '@/pages/operations/supervisionAnalySumm';


let myChart;
const dvaPropsData = ({ sysDashboard, loading }) => ({
  level: sysDashboard.level,
  regionCode: sysDashboard.regionCode,
  entCode: sysDashboard.entCode,
  time: sysDashboard.time,
  loading: loading.effects[`sysDashboard/GetSupervisionQualifiedAnalysis`],
});

const DeviceInfoCount = props => {
  const [open, setOpen] = useState(false);
  const [nums, setNums] = useState({
      SumNum: 407,
      QualifieRate: "00.00%",
      CompleteRectificationRate: "00.00%"
  });

  const { dispatch, time, loading, level, regionCode, entCode } = props;

  useEffect(() => {
    getData();
  }, [level, regionCode, entCode, time]);

  const getData = () => {
    dispatch({
      type: 'sysDashboard/GetSupervisionQualifiedAnalysis',
      payload: {
        pLeve:level,
        regionCode: level == 2 ? regionCode : undefined,
        entCode: level == 3 ? entCode : undefined,
        btime: moment(time[0]).format('YYYY-MM-DD 00:00:00'),
        etime: moment(time[1]).format('YYYY-MM-DD 23:59:59'),
      },
      callback: res => {
        setNums(res);
      },
    });
  };

  const onOpenModal = () => {
    setOpen(true);
  };
 
  const boxSty = {
    width:100,
    height:99,
    background: 'url(/SystemDashboard/SupervisionVerifica/hgl_box1.png) no-repeat',
    backgroundSize:'100% 100%',
    nameColr:'#C3E3FF',
    cursor: 'pointer',
  }
  const boxSty2 = {
    width:136,
    height:139,
    background: 'url(/SystemDashboard/SupervisionVerifica/hgl_box2.png) no-repeat',
    backgroundSize:'100% 100%',
    nameColr:'#C3F0FF',
    cursor: 'pointer',
  }
  const textSty = {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
  }
  return (
    <HomeCard title="合格率分析" bodyStyle={{}} loading={loading} style={{minHeight:props.homeCardMinHight}}>
      <Row  justify='space-between' style={{padding:'0 18px'}}>
       <div style={{...boxSty,marginTop:28}} onClick={onOpenModal}>
           <div style={{...textSty}}>
           <span>{nums?.QualifieRate}</span>
           <span style={{color:boxSty.nameColr}}>合格率</span>
          </div>
       </div>
       <div style={{...boxSty2,marginTop:30}} onClick={onOpenModal}>
       <div style={{...textSty}}>
           <span style={{fontSize:24}}>{nums?.SumNum}</span>
           <span style={{color:boxSty.nameColr}}>督查套数</span>
          </div>
       </div>
       <div style={{...boxSty,marginTop:53}} onClick={onOpenModal}>
         <div style={{...textSty}}>
           <span>{nums?.CompleteRectificationRate}</span>
           <span style={{color:boxSty.nameColr}}>整改完成率</span>
          </div>
       </div>
      </Row>
      <Modal
      title='督查总结'
      destroyOnClose
      wrapClassName={'fullScreenModal'}
      bodyStyle={{padding:0}}
      visible={open}
      mask={false}
      onCancel={() => {
        setOpen(false);
      }}
    >
      <SupervisionAnalySumm
        tabType={1}
      />
    </Modal>
    </HomeCard>
  );
};

export default connect(dvaPropsData)(DeviceInfoCount);
