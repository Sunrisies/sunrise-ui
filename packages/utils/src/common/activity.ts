/**
 * 活动监控器配置选项接口
 * @description 用于配置活动监控器的行为，包括超时设置、回调函数和自动控制选项
 * @memberof module:common/activity
 * @public
 */
export interface ActivityMonitorOptions {
  /**
   * 设置活动超时时间（毫秒）
   * @remarks 超过此时间未检测到活动将触发onTimeout回调
   * @defaultValue 300000 (5分钟)
   */
  timeout: number;

  /**
   * 超时时执行的回调函数
   * @remarks 当达到timeout时间后自动调用，此回调为必需项
   */
  onTimeout: () => void;

  /**
   * 检测到活动时执行的回调函数
   * @remarks 当用户活动（如鼠标移动、键盘输入等）被检测到时触发
   * @defaultValue undefined
   */
  onActivity?: () => void;

  /**
   * 监控器首次启动时执行的回调函数
   * @remarks 仅在监控器第一次启动时调用一次
   * @defaultValue undefined
   */
  onStart?: () => void;

  /**
   * 监控器停止时执行的回调函数
   * @remarks 当监控器被手动停止或自动结束时调用
   * @defaultValue undefined
   */
  onStop?: () => void;

  /**
   * 是否在创建监控器实例时自动启动监控
   * @remarks 设置为true时，监控器将在创建后立即开始工作
   * @defaultValue true
   */
  autoStart?: boolean;

  /**
   * 是否在窗口失去焦点时暂停监控
   * @remarks 当浏览器标签页或窗口失去焦点时暂停计时
   * @defaultValue true
   */
  pauseOnBlur?: boolean;

  /**
   * 是否在窗口重新获得焦点时恢复监控
   * @remarks 当浏览器标签页或窗口重新获得焦点时恢复计时
   * @defaultValue true
   */
  resumeOnFocus?: boolean;
}

/**
 * 活动监控器状态接口
 * @description 用于跟踪和监控活动状态的接口，包含活动状态、剩余时间和已运行时间等信息
 * @memberof module:common/activity
 * @public
 */
export interface ActivityMonitorState {
  /**
   * 指示当前监控器是否处于活动状态
   * @defaultValue false
   */
  isActive: boolean;

  /**
   * 活动剩余时间（毫秒）
   * @remarks 当活动正在进行时，表示距离活动结束还剩余的时间
   * @defaultValue 0
   */
  remainingTime: number;

  /**
   * 活动已运行时间（毫秒）
   * @remarks 从活动开始到当前时刻的总时长
   * @defaultValue 0
   */
  elapsedTime: number;
}

/**
 * 活动监控器
 * @public
 *
 * @remarks
 * 用于监控用户活动状态，可以设置超时时间和各种回调函数。
 * 支持自动启动、暂停恢复等功能，适用于会话超时、屏保等场景。
 *
 * @func 活动监控器
 *
 * @memberof module:common/activity
 *
 * @example
 * ```typescript
 * // 基本用法
 * const monitor = createActivityMonitor({
 *   timeout: 5000,
 *   onTimeout: () => console.log('超时'),
 *   onActivity: () => console.log('检测到活动')
 * });
 *
 * // 启动监控
 * monitor.start();
 *
 * // 手动触发活动检查
 * monitor.check();
 *
 * // 停止监控
 * monitor.stop();
 * ```
 */
export function createActivityMonitor(options: ActivityMonitorOptions) {
  let timer: number | null = null;
  let isActive = false;
  let startTime = 0;
  let lastActivityTime = 0;

  /**
   * 创建活动监控器的配置对象
   * @description 合并默认配置和用户提供的配置选项
   * @remarks
   * 默认配置包括：
   * - autoStart: false - 不自动启动监控
   * - pauseOnBlur: true - 窗口失去焦点时暂停
   * - resumeOnFocus: true - 窗口获得焦点时恢复
   *
   * 用户提供的options会覆盖这些默认值
   *
   * @example
   * ```typescript
   * const config = {
   *   autoStart: false,
   *   pauseOnBlur: true,
   *   resumeOnFocus: true,
   *   ...options,
   * };
   * ```
   */
  const config = {
    autoStart: false,
    pauseOnBlur: true,
    resumeOnFocus: true,
    ...options,
  };

  /**
   * 获取当前监控器状态
   * @returns 返回包含当前活动状态、剩余时间和已运行时间的对象
   * @example
   * ```typescript
   * const state = getState();
   * console.log(state.isActive); // 是否处于活动状态
   * console.log(state.remainingTime); // 剩余时间（毫秒）
   * ```
   */
  const getState = (): ActivityMonitorState => ({
    isActive,
    remainingTime: timer ? config.timeout - (Date.now() - lastActivityTime) : 0,
    elapsedTime: startTime ? Date.now() - startTime : 0,
  });

  /**
   * 检查并更新活动状态
   * @description 重置计时器，更新最后活动时间，并触发相应的回调函数
   * @remarks
   * - 如果是首次活动，会触发onStart回调
   * - 每次活动都会触发onActivity回调
   * - 设置新的超时计时器，超时后触发onTimeout回调
   */
  const check = () => {
    if (timer) clearTimeout(timer);

    const now = Date.now();
    lastActivityTime = now;

    // 首次触发启动回调
    if (!isActive) {
      isActive = true;
      startTime = now;
      config.onStart?.();
    }

    // 每次活动触发回调
    config.onActivity?.();

    // 设置超时检测
    timer = window.setTimeout(() => {
      config.onTimeout();
      isActive = false;
      startTime = 0;
    }, config.timeout) as unknown as number;
  };

  /**
   * 停止监控器
   * @description 完全停止监控，清除计时器并重置所有状态
   * @remarks
   * - 清除当前计时器
   * - 如果处于活动状态，触发onStop回调
   * - 重置活动状态和开始时间
   */
  const stop = () => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    if (isActive) {
      isActive = false;
      config.onStop?.();
    }
    startTime = 0;
  };

  /**
   * 启动监控器
   * @description 开始监控用户活动
   * @remarks 仅在监控器未活动时才会启动
   */
  const start = () => {
    if (!isActive) {
      check();
    }
  };

  /**
   * 暂停监控器
   * @description 暂时停止监控，但保持活动状态
   * @remarks 仅清除计时器，不改变活动状态，可以通过resume恢复
   */
  const pause = () => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  };

  /**
   * 恢复监控器
   * @description 恢复被暂停的监控
   * @remarks 仅在监控器处于活动状态时才会恢复
   */
  const resume = () => {
    if (isActive) {
      check();
    }
  };

  /**
   * 根据配置自动启动监控器
   * @remarks 仅在config.autoStart为true时执行
   */
  if (config.autoStart) {
    start();
  }

  return {
    check,
    start,
    stop,
    pause,
    resume,
    getState,
  };
}
