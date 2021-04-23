function getScrollWidth() {
  var noScroll, scroll, oDiv = document.createElement("DIV");
  oDiv.style.cssText = "position:absolute; top:-1000px; width:100px; height:100px; overflow:hidden;";
  noScroll = document.body.appendChild(oDiv).clientWidth;
  oDiv.style.overflowY = "scroll";
  scroll = oDiv.clientWidth;
  document.body.removeChild(oDiv);
  return noScroll-scroll;
}
export default getScrollWidth