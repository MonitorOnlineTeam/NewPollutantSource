import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'dva';
import { Select } from 'antd';
import { router } from 'umi';

const dvaPropsData = ({ projectManage, loading }) => ({
  projectList: projectManage.projectList,
  currentProjectID: projectManage.currentProjectID,
});

const ProjectManage = props => {
  const { dispatch, projectList, currentProjectID } = props;

  useEffect(() => {
    GetUserProjectList();
    GetUserProject();
  }, []);


  // 获取项目列表
  const GetUserProjectList = () => {
    dispatch({
      type: 'projectManage/GetUserProjectList',
      payload: {},
    });
  };

  // 获取当前项目
  const GetUserProject = () => {
    dispatch({
      type: 'projectManage/GetUserProject',
      payload: {},
    });
  };

  // 切换项目
  const UpdateUserProject = projectCode => {
    dispatch({
      type: 'projectManage/UpdateUserProject',
      payload: {
        projectCode,
      },
      callback: res => {
        let defaultNavigateUrl = sessionStorage.getItem('defaultNavigateUrl');
        if (defaultNavigateUrl === location.pathname) {
          location.reload();
        } else {
          router.push(defaultNavigateUrl);
        }
      },
    });
  };
  return (
    <Select
      value={currentProjectID}
      style={{ width: '100%' }}
      getPopupContainer={() => document.getElementById('AvatarMenu')}
      onClick={e => e.stopPropagation()}
      onChange={value => {
        UpdateUserProject(value);
      }}
      placeholder="选择项目"
      allowClear
    >
      {projectList.map(item => {
        return (
          <Option value={item.ID} key={item.ID}>
            {item.ProjectName}
          </Option>
        );
      })}
    </Select>
  );
};

export default connect(dvaPropsData)(ProjectManage);
