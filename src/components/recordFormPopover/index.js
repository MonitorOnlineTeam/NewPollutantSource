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
import styles from './styles.less';


const dvaPropsData = ({ loading, global, common, }) => ({
    imageListVisible: common.imageListVisible,
})
const dvaDispatch = (dispatch) => {
    return {
        updateState: (payload) => {
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

    const { columns, detailText } = props;
    const [open, setOpen] = useState(false);

    //表单
    const [detailVisible, setDetailVisible] = useState(false)
    const [typeID, setTypeID] = useState(null)
    const [taskID, setTaskID] = useState(1)
    const detail = (record) => { //详情
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
        <Popover
            zIndex={800}
            onOpenChange={(newOpen) => { setOpen(newOpen) }}
            trigger="click"
            open={open}
            overlayClassName={styles.popSty}
            content={
                <Table
                    bordered
                    size='small'
                    columns={columns? columns : [
                        {
                            align: 'center',
                            width: 50,
                            render: (text, record, index) => props.taskNum? record.taskNum : index + 1
                        },
                        {
                            align: 'center',
                            width: 100,
                        render: (text, record, index) => <a onClick={() => { detail(record) }}>{detailText? detailText : '查看详情'}</a>
                        }
                    ]}
                    dataSource={props.dataSource} pagination={false} />
            }>
            <a>查看详情</a>
        </Popover>
        <Modal //表单详情
            visible={detailVisible}
            title={'详情'}
            wrapClassName='spreadOverModal'
            footer={null}
            width={'100%'}
            onCancel={() => { setDetailVisible(false) }}
            destroyOnClose
        >
            <RecordForm hideBreadcrumb match={{ params: { typeID: typeID, taskID: taskID } }} />
        </Modal>
        {props.imageListVisible && <ViewImagesModal />}
    </div>
    );
};
export default connect(dvaPropsData, dvaDispatch)(Index);


