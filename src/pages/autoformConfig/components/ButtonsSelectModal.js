import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Tag, Modal, Space, Spin, message } from 'antd';

const { CheckableTag } = Tag;

const dvaPropsData = ({ loading, AbnormalIdentifyModel }) => ({
  getLoading: loading.effects[('fieldConfigModel/GetSelectedButton', 'autoForm/getAutoFormData')],
  saveLoading: loading.effects['fieldConfigModel/SaveSelectedButton'],
});

const ButtonsSelectModal = props => {
  const [tagsData, setTagsData] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { dispatch, record, getLoading, saveLoading } = props;

  useEffect(() => {}, []);

  const handleChange = (tag, checked) => {
    const nextSelectedTags = checked ? [...selectedTags, tag] : selectedTags.filter(t => t !== tag);
    setSelectedTags(nextSelectedTags);
  };

  const onShowModal = () => {
    getBtnList();
    GetSelectedButton();
    setIsModalOpen(true);
  };

  // 获取所有按钮
  const getBtnList = () => {
    dispatch({
      type: 'autoForm/getAutoFormData',
      payload: {
        configId: 'ButtonManager',
        otherParams: {
          pageIndex: 1,
          pageSize: 9999,
        },
      },
      callback: res => {
        setTagsData(res);
      },
    });
  };

  // 获取已关联的按钮
  const GetSelectedButton = () => {
    dispatch({
      type: 'fieldConfigModel/GetSelectedButton',
      payload: {
        menuId: record.Menu_Id,
      },
      callback: res => {
        let selected = [];
        res.map(item => {
          item.IsSelected && selected.push(item.Button_Id);
        });
        console.log('res', res);
        console.log('selected', selected);
        setSelectedTags(selected);
      },
    });
  };

  // 保存选中的按钮
  const handleOk = () => {
    dispatch({
      type: 'fieldConfigModel/SaveSelectedButton',
      payload: {
        menuId: record.Menu_Id,
        buttonList: selectedTags,
      },
      callback: res => {
        message.success('设置成功');
        setIsModalOpen(false);
      },
    });
  };

  return (
    <>
      <a onClick={onShowModal}>设置按钮</a>
      <Modal
        title="设置按钮"
        // width={800}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={() => setIsModalOpen(false)}
        confirmLoading={saveLoading}
      >
        <Spin spinning={!!getLoading}>
          <Space wrap>
            {tagsData.map(tag => {
              let id = tag['dbo.Base_Button.Button_ID'];
              return (
                <CheckableTag
                  key={id}
                  color="default"
                  checked={selectedTags.indexOf(id) > -1}
                  style={{ border: '1px solid #ccc' }}
                  onChange={checked => handleChange(id, checked)}
                >
                  {tag['dbo.Base_Button.Button_Name']}
                </CheckableTag>
              );
            })}
          </Space>
        </Spin>
      </Modal>
    </>
  );
};

export default connect(dvaPropsData)(ButtonsSelectModal);
