import styles from './utils.less'
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
      <div className={styles.pulse1}></div>
    </div>
  }
  return <img style={{ width: imgWidth }} src={imgSrc} />;
}
