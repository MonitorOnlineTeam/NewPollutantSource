import { Tag } from 'antd';

export const taskType = {
  3: '运维回访任务',
  4: '成套回访任务',
  5: '办事处检查',
  6: '人员培训记录',
  7: '检查考勤和日志',
  8: '现场工作',
  9: '部门内其他工作事项',
  10: '支持其他部门工作',
  11: '应收账款催收'
};

// 3.运维回访客户、4.成套回访客户.5.办事处检查、6、人员培训、7、检查考勤和日志、8、现场工作、9、部门内其他工作事项、10、支持其他部门工作、11、应收账款催收

// 按年获取每个月列
export function getMonthColumnsByYear(date) {
  const y = date.format('YYYY年');
  let months = [];
  for (let i = 1; i <= 12; i++) {
    let index = i < 10 ? '0' + i : i;
    let title = `${y}${index}月`;
    months.push({
      title: title,
      dataIndex: title,
      key: title,
      render: text => {
        if (text === 0) {
          return <Tag color="error">未达标</Tag>;
        } else if (text === 1) {
          return <Tag color="success">已达标</Tag>;
        }
        return text;
      },
    });
  }
  return months;
}
