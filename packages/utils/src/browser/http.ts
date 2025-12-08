import { ensureEnvironment } from "../common/env";

/**
 * 从指定 URL 下载文件并保存到本地
 * @public
 *
 * @param url - 文件下载地址（需符合 URL 规范）
 * @param filename - 保存时使用的文件名（需包含扩展名）
 * @memberof module:browser/downloadFile
 * @func 下载文件
 * @example
 * ```typescript
 * // 下载图片文件
 * await downloadFile('https://example.com/photo.jpg', 'vacation-photo.jpg');
 * ```
 */
export async function downloadFile(
  url: string,
  filename: string
): Promise<void> {
  ensureEnvironment("browser", "downloadFile");
  try {
    // 使用 fetch 获取文件内容
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`无法获取文件: ${response.statusText}`);
    }
    // 新增内容类型校验
    const contentType = response.headers.get("content-type");
    if (
      !contentType?.startsWith("application/octet-stream") &&
      !contentType?.includes("application/zip") &&
      !contentType?.startsWith("image/")
    ) {
      throw new Error("下载失败：服务器返回非文件类型内容");
    }
    // 将文件内容转换为 Blob
    const blob = await response.blob();

    // 创建一个指向 Blob 的临时 URL
    const blobUrl = URL.createObjectURL(blob);

    // 创建 <a> 标签并触发下载
    const aTag = document.createElement("a");
    aTag.href = blobUrl;
    aTag.download = filename; // 设置下载的文件名
    document.body.appendChild(aTag); // 将 <a> 标签添加到文档中
    aTag.click(); // 触发点击事件
    document.body.removeChild(aTag); // 移除 <a> 标签

    // 释放 Blob URL
    URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error("下载文件时出错:", error);
    throw error; // 抛出错误以便调用方处理
  }
}

export interface RequestConfig<T = unknown> extends Omit<RequestInit, "body"> {
  params?: Record<string, string>;
  data?: T;
}

// 统一接口规范，泛型TData使返回数据类型可配置
export interface ApiResponse<T> {
  code: number;
  data: T;
  message: string;
}

/**
 * 可配置的 HTTP 客户端实例
 * @public
 *
 * @remarks
 * 封装了常见的 HTTP 请求方法，支持自动拼接基础 URL 和请求配置
 * @memberof module:browser/http
 * @name 可配置的 HTTP 客户端实例
 * @func 可配置的 HTTP 客户端实例
 * @param baseURL - 基础 URL 路径，会自动拼接到所有请求端点前
 *
 * @example
 * ```typescript
 * // 创建 GitHub API 客户端
 * const http = new Http('https://api.github.com');
 *
 * // 发送带认证的请求
 * const httpWithAuth = new Http('https://api.example.com');
 * ```
 */
export class Http {
  private readonly baseURL: string;
  /**
   * 创建 HTTP 客户端实例
   * @param baseURL - 基础请求路径，将自动拼接到所有请求端点前（默认为空字符串）
   *
   * @example
   * ```typescript
   * // 带基础路径的实例
   * const apiClient = new Http('https://api.example.com/v1');
   *
   * // 使用相对路径的实例
   * const defaultClient = new Http();
   * ```
   */
  constructor(baseURL: string = "") {
    this.baseURL = baseURL;
  }

  /**
   * 执行 HTTP 请求的核心方法
   * @public
   *
   * @remarks
   * 封装了请求参数处理、响应解析和错误处理等通用逻辑，支持泛型类型参数
   *
   * @template TResponse - 响应结果数据类型
   * @template T - 请求体数据类型
   * @param endpoint - 接口端点路径（自动拼接基础 URL）
   * @param config - 请求配置（支持自定义请求头和参数）
   * @returns 符合<mcsymbol name="ApiResponse" filename="http.ts" path="src/utils/http.ts" startline="78" type="class"></mcsymbol>规范的响应对象
   * @throws 当发生网络错误或 HTTP 状态码非 2xx 时抛出异常
   *
   * @example
   * ```typescript
   * // 获取用户数据
   * const response = await http.request<User[]>('/users', {
   *   headers: { Authorization: 'Bearer token' }
   * });
   *
   * // 提交表单数据
   * await http.request<void>('/submit', {
   *   method: 'POST',
   *   data: { name: 'Alice' }
   * });
   * ```
   */
  async request<TResponse, T = unknown>(
    endpoint: string,
    config: RequestConfig<T> = {}
  ): Promise<ApiResponse<TResponse>> {
    const { params, data, headers = {}, method = "GET", ...rest } = config;

    // 处理 URL 参数
    const queryString = params ? `?${URLSearchParamsUtils(params)}` : "";
    const url = `${this.baseURL}${endpoint}${queryString}`;

    // 处理请求头
    const contentType = data ? { "Content-Type": "application/json" } : {};
    const finalHeaders = { ...contentType, ...headers } as HeadersInit;

    // 统一错误处理
    try {
      const response = await fetch(url, {
        method,
        headers: finalHeaders,
        body: data ? JSON.stringify(data) : null,
        ...rest,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      return result as ApiResponse<TResponse>;
    } catch (error) {
      throw error;
    }
  }
  /**
   * 发送 GET 请求获取资源
   * @public
   *
   * @remarks
   * 适用于获取集合数据或单个资源的只读操作，支持查询参数配置
   *
   * @template TResponse - 期望的响应数据类型
   * @param endpoint - 接口端点路径（自动拼接基础 URL）
   * @param config - 请求配置项（支持自定义请求头和查询参数）
   * @returns 包含<mcsymbol name="ApiResponse" filename="http.ts" path="src/utils/http.ts" startline="78" type="class"></mcsymbol>规范的响应对象
   *
   * @example
   * ```typescript
   * // 获取分页用户列表
   * const { data } = await http.get<PagedResponse<User>>('/users', {
   *   params: { page: 1, size: 20 }
   * });
   *
   * // 获取单个商品详情
   * const product = await http.get<Product>('/products/123');
   * ```
   */
  get<TResponse>(
    endpoint: string,
    config?: Omit<RequestConfig, "data" | "method">
  ) {
    return this.request<TResponse>(endpoint, { ...config, method: "GET" });
  }
  /**
   * 发送 POST 请求创建资源
   * @public
   *
   * @remarks
   * 适用于创建新资源或提交表单数据，请求体会自动序列化为 JSON 格式
   *
   * @template TResponse - 期望的响应数据类型
   * @template T - 请求体数据类型（默认为 unknown）
   * @param endpoint - 接口端点路径（自动拼接基础 URL）
   * @param data - 要提交的请求体数据
   * @param config - 请求配置项（支持自定义请求头等参数）
   * @returns 符合<mcsymbol name="ApiResponse" filename="http.ts" path="src/utils/http.ts" startline="78" type="class"></mcsymbol>规范的响应对象
   *
   * @example
   * ```typescript
   * // 创建新用户
   * await http.post<User>('/users', {
   *   name: 'Bob',
   *   email: 'bob@example.com'
   * });
   *
   * // 提交表单并获取操作结果
   * const response = await http.post<FormResult>('/submit', formData, {
   *   headers: { 'X-Custom-Header': 'value' }
   * });
   * ```
   */
  post<TResponse, T = unknown>(
    endpoint: string,
    data?: T,
    config?: Omit<RequestConfig, "data" | "method">
  ) {
    return this.request<TResponse, T>(endpoint, {
      ...config,
      data,
      method: "POST",
    });
  }

  /**
   * 发送 PUT 请求更新资源
   * @public
   *
   * @remarks
   * 用于替换整个资源，需要提供完整的更新数据，遵循 RESTful 规范
   *
   * @template TResponse - 更新后的资源数据类型
   * @template T - 请求体数据类型（默认为 unknown）
   * @param endpoint - 资源端点路径（自动拼接基础 URL）
   * @param data - 要替换的完整资源数据
   * @param config - 请求配置项（支持自定义请求头等参数）
   * @returns 包含<mcsymbol name="ApiResponse" filename="http.ts" path="src/utils/http.ts" startline="78" type="class"></mcsymbol>规范的响应对象
   *
   * @example
   * ```typescript
   * // 更新用户信息
   * await http.put<User>('/users/123', {
   *   name: '更新后的姓名',
   *   email: 'new@example.com'
   * });
   *
   * // 替换系统配置
   * const config = await http.put<SystemConfig>('/config', fullConfig, {
   *   headers: { 'If-Match': 'version-tag' }
   * });
   * ```
   */
  put<TResponse, T = unknown>(
    endpoint: string,
    data?: T,
    config?: Omit<RequestConfig, "data" | "method">
  ) {
    return this.request<TResponse, T>(endpoint, {
      ...config,
      data,
      method: "PUT",
    });
  }
  /**
   * 发送 DELETE 请求删除资源
   * @public
   *
   * @remarks
   * 用于删除指定资源，遵循 RESTful 规范
   *
   * @template TResponse - 响应数据类型（通常为 void）
   * @param endpoint - 要删除的资源端点路径（自动拼接基础 URL）
   * @param config - 请求配置项（支持自定义请求头等参数）
   * @returns 包含<mcsymbol name="ApiResponse" filename="http.ts" path="src/utils/http.ts" startline="78" type="class"></mcsymbol>规范的响应对象
   *
   * @example
   * ```typescript
   * // 删除用户数据
   * await http.delete<void>('/users/123');
   *
   * // 带条件删除的请求
   * await http.delete<AuditLog>('/logs/456', {
   *   headers: { 'If-Unmodified-Since': 'Wed, 21 Oct 2022 07:28:00 GMT' }
   * });
   * ```
   */
  delete<TResponse>(
    endpoint: string,
    config?: Omit<RequestConfig, "data" | "method">
  ) {
    return this.request<TResponse>(endpoint, { ...config, method: "DELETE" });
  }
}

/**
 * 将请求参数对象转换为 URL 查询字符串
 * @public
 * @memberof module:browser/URLSearchParamsUtils
 * @func 将请求参数对象转换为 URL 查询字符串。
 * @remarks
 * 支持数组和基本类型处理，自动进行 URI 组件编码。注意嵌套对象会被转换为字符串形式（如 [object Object]），
 * 建议使用扁平数据结构。本实现基于 URLSearchParams 标准 API，与 `qs` 等库的嵌套处理机制不同
 *
 * @param data - 包含查询参数的对象（支持 Record&lt;string, any&gt; 类型）
 * @returns 经过 URL 编码的查询字符串（不带问号前缀）
 *
 * @example
 * ```typescript
 * // 处理嵌套对象（实际开发中应避免）
 * URLSearchParamsUtils({ filter: { type: 'video', resolution: '1080p' } });
 * // 返回 'filter=[object%20Object]'
 * ```
 *
 * @example
 * ```typescript
 * // 处理数字和布尔值
 * URLSearchParamsUtils({ active: true, count: 42 });
 * // 返回 'active=true&count=42'
 * ```
 */
export function URLSearchParamsUtils(data: { [key: string]: any }) {
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(data)) {
    // 处理数组类型
    if (Array.isArray(value)) {
      value.forEach((item) => searchParams.append(key, item.toString()));
    } else {
      searchParams.append(key, value.toString());
    }
  }

  return searchParams.toString();
}

/**
 * @public
 * 下载本地文件
 * @param url - 文件下载地址
 * @param filename - 文件名
 * @returns
 * @throws {Error} - 下载失败时抛出错误
 */

/**
 * 下载本地文件
 * @public
 *
 * @param file - 要下载的文件（File 或 Blob 对象）
 * @param filename - 保存时使用的文件名（需包含扩展名）
 * @memberof module:browser/downloadLocalFile
 * @func 下载本地文件
 * @example
 * ```typescript
 * // 从文件输入获取文件并下载
 * const input = document.querySelector('input[type="file"]');
 * const file = input.files[0];
 * await downloadLocalFile(file, 'backup-file.pdf');
 *
 * // 直接下载 Blob 数据
 * const blob = new Blob(['Hello World'], { type: 'text/plain' });
 * await downloadLocalFile(blob, 'hello.txt');
 * ```
 */
export async function downloadLocalFile(
  file: File | Blob,
  filename: string
): Promise<void> {
  ensureEnvironment("browser", "downloadLocalFile");
  try {
    // 创建一个指向文件/Blob 的临时 URL
    const blobUrl = URL.createObjectURL(file);

    // 创建 <a> 标签并触发下载
    const aTag = document.createElement("a");
    aTag.href = blobUrl;
    aTag.download = filename; // 设置下载的文件名
    document.body.appendChild(aTag); // 将 <a> 标签添加到文档中
    aTag.click(); // 触发点击事件
    document.body.removeChild(aTag); // 移除 <a> 标签

    // 释放 Blob URL
    URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error("下载本地文件时出错:", error);
    throw error; // 抛出错误以便调用方处理
  }
}
