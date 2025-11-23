/**
 * 通用工具函数
 * @public
 * @author 朝阳
 * @version 1.0.0
 */

// 创建屏幕标记
function createScreenMarker(x, y) {
  const screenMarker = document.createElement("div");
  screenMarker.style.position = "absolute";
  screenMarker.style.left = x - 10 + "px";
  screenMarker.style.top = y - 10 + "px";
  screenMarker.style.width = "20px";
  screenMarker.style.height = "20px";
  screenMarker.style.borderRadius = "50%";
  screenMarker.style.backgroundColor = "red";
  screenMarker.style.border = "2px solid white";
  screenMarker.style.zIndex = "1000";
  screenMarker.style.pointerEvents = "none";

  document.getElementById("cesiumContainer").appendChild(screenMarker);

  // 3秒后移除标记
  setTimeout(() => {
    if (document.getElementById("cesiumContainer").contains(screenMarker)) {
      document.getElementById("cesiumContainer").removeChild(screenMarker);
    }
  }, 3000);
}

// 更新状态信息
function updateStatus(message) {
  const statusEl = document.getElementById("status");
  if (statusEl) {
    statusEl.textContent = message;

    // 3秒后清除状态
    setTimeout(() => {
      if (statusEl.textContent === message) {
        statusEl.textContent = "就绪";
      }
    }, 3000);
  }
}
