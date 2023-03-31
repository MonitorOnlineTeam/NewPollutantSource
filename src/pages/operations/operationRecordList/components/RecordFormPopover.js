/**
 * 功  能：电子表单弹框
 * 创建人：jsb
 * 创建时间：2023.3.23
 */
import React, { useState, useEffect, Fragment,useMemo, } from 'react';
import { Tooltip, Popover, Table,Modal   } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { connect } from "dva";
import RecordForm from '@/pages/operations/recordForm'
import ViewImagesModal from '@/pages/operations/components/ViewImagesModal';
import styles from '../style.less';


const dvaPropsData = ({ loading, global, common, }) => ({
    imageListVisible: common.imageListVisible,
})
const dvaDispatch = (dispatch) => {
    return { 
        updateState: (namespace,payload) => {
            dispatch({
                type: `${namespace}/updateState`,
                payload: payload,
            })
        },
        getOperationImageList: (payload, callback) => { //电子表单 图片类型
            dispatch({
                type: 'common/getOperationImageList',
                payload: payload,
                callback: callback
            })
        },

    }
}

const Index = (props) => {

    const {dataSource, keys, } = props;
    const [popVisible, setPopVisible] = useState(false);
    const [popKey, setPopKey] = useState(-1);
    const [isPop, setIsPop] = useState(1);

    //表单
    const [detailVisible, setDetailVisible] = useState(false)
    const [typeID, setTypeID] = useState(null)
    const [taskID, setTaskID] = useState(1)
    const detail = (record,type,) => { //详情
        setIsPop(type)
        if (record.RecordType == 1) {
            setTypeID(record.TypeID);
            setTaskID(record.TaskID)
            setDetailVisible(true)
        } else {
            // 获取详情 图片类型表单
            props.getOperationImageList({ FormMainID: record.FormMainID })

        }
    }
    return (
       <div>
        {dataSource.length&&dataSource.length>1? <Popover
            zIndex={999}
            onVisibleChange={(newVisible) => {setPopVisible(newVisible) }}
            trigger="click"
            visible={keys==popKey&&popVisible}
            overlayClassName={styles.detailPopSty}
            // getPopupContainer={trigger => trigger.parentNode}
            content={
                <Table
                    bordered
                    size='small'
                    showHeader={false}
                    columns={[
                        {
                            align: 'center',
                            width: 50,
                            render: (text, record, index) => props.taskNum? record.taskNum : index + 1
                        },
                        {
                            align: 'center',
                            width: 100,
                        render: (text, record, index) => <a onClick={() => { detail(record,1) }}>查看详情</a>
                        }
                    ]}
                    dataSource={dataSource} pagination={false} />
            }>
            <a onClick={()=>{ setPopKey(keys);}}>查看详情</a>
        </Popover>:
          <a onClick={() => { setPopKey(keys);detail(dataSource[0],2) }}>查看详情</a>
           }
        <Modal //表单详情
            visible={detailVisible}
            title={'详情'}
            wrapClassName='spreadOverModal'
            footer={null}
            width={'100%'}
            onCancel={() => {setDetailVisible(false);isPop==1? setPopVisible(true) : setPopKey(-1); }}
            destroyOnClose
        >
            <RecordForm hideBreadcrumb match={{ params: { typeID: typeID, taskID: taskID } }} />
        </Modal>
        <ViewImagesModal visible={isPop==1? keys==popKey&&popVisible&&props.imageListVisible : keys==popKey&&props.imageListVisible } destroyOnClose onCloseRequest={()=>{
                  props.updateState('common',{ imageListVisible: false})
                  isPop==1? setPopVisible(true) : setPopKey(-1); 
        }}/>
    </div>
    );
};
export default connect(dvaPropsData, dvaDispatch)(Index);


