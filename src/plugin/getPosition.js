// 获取相对于屏幕的坐标
export function getElementX (ele) {
  let relativeX = ele.offsetLeft // 相对父元素的位置
  let parentEle = ele.offsetParent
  while (parentEle !== null) {
    relativeX += parentEle.offsetLeft
    parentEle = parentEle.offsetParent
  }
  return relativeX
}
