import style from "./index.less";

function getScrollWidth() {
  var noScrollWidth, scrollWidth, noScrollHeight, scrollHeight, oDiv = document.createElement("DIV");
  oDiv.className = 'scrollBarCustom'
  oDiv.style.cssText = `position:absolute; top:-1000px; width:100px; height:100px; overflow:hidden;`;
  noScrollWidth = document.body.appendChild(oDiv).clientWidth;
  noScrollHeight = document.body.appendChild(oDiv).clientHeight;
  oDiv.style.overflow = "scroll";
  scrollWidth = oDiv.clientWidth;
  scrollHeight = oDiv.clientHeight;
  document.body.removeChild(oDiv);
  return {
    scrollBarWidth: noScrollWidth-scrollWidth,
    scrollBarHeight: noScrollHeight-scrollHeight,
  };
}
export default getScrollWidth