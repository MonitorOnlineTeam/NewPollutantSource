import styles from './utils.less';
import {Tag} from 'antd';
export function getPointStatusImg(record, noticeList) {
  const { stop, status, DGIMN } = record;
  // if (stop) {
  //   return '';
  // }
  let imgSrc, imgWidth;
  imgWidth = 14;
  imgSrc = '/gisunline.png';
  if (status === 1) {
    imgSrc = '/gisnormal.png';
  }
  if (status === 2) {
    imgSrc = '/gisover.png';
  }
  if (status === 3) {
    imgSrc = '/gisexception.png';
  }
  if (!!noticeList.find(m => m.DGIMN === DGIMN)) {
    return <div className={styles.container} style={{ display: "inline" }}>
      <img style={{ width: imgWidth }} src={imgSrc} />
      {/* <div className={styles.pulse}></div> */}
      {/* <div className={styles.pulse1}></div> */}
    </div>
  }
  return <img style={{ width: imgWidth }} src={imgSrc} />;
}


export function getPointStatusText(record, noticeList) {
  const { stop, status, DGIMN } = record;
  // if (stop) {
  //   return '';
  // }
  let color = '#999999',
    text = '离线';
  switch (status) {
    case 0:
      color = '#999999';
      text = '离线';
      break;
    case 1:
      color = '#009933';
      text = '在线';
      break;
    case 2:
      color = '#FF0000';
      text = '超标';
      break;
    case 3:
      color = '#FF9900';
      text = '异常';
      break;
    case 4:
      color = '#FF9900';
      text = '核查异常';
      break;
    case 5:
      color = '#FF9900';
      text = '备案不符';
      break;
  }
  if (!!noticeList.find(m => m.DGIMN === DGIMN)) {
    // return <div className={styles.container} style={{ display: "inline" }}>
    //   <img style={{ width: imgWidth }} src={imgSrc} />
    // </div>
    return <Tag color={color}>{text}</Tag>;
  }
  return <Tag color={color}>{text}</Tag>;
}
