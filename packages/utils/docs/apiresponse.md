## ApiResponse 接口
## 属性

| Property | 类型 | 描述 |
|----------|------|-------------|
| code | `number` |  |
| data | `T` |  |
| message | `string` |  |

## RequestConfig 接口
## 属性

| Property | 类型 | 描述 |
|----------|------|-------------|
| cache | `RequestCache` | A string indicating how the request will interact with the browser's cache to set request's cache. |
| credentials | `RequestCredentials` | A string indicating whether credentials will be sent with the request always, never, or only when sent to a same-origin URL. Sets request's credentials. |
| data | `T` |  |
| headers | `HeadersInit` | A Headers object, an object literal, or an array of two-item arrays to set request's headers. |
| integrity | `string` | A cryptographic hash of the resource to be fetched by request. Sets request's integrity. |
| keepalive | `boolean` | A boolean to set request's keepalive. |
| method | `string` | A string to set request's method. |
| mode | `RequestMode` | A string to indicate whether the request will use CORS, or will be restricted to same-origin URLs. Sets request's mode. |
| params | `Record<string, string>` |  |
| priority | `RequestPriority` |  |
| redirect | `RequestRedirect` | A string indicating whether request follows redirects, results in an error upon encountering a redirect, or returns the redirect (in an opaque fashion). Sets request's redirect. |
| referrer | `string` | A string whose value is a same-origin URL, "about:client", or the empty string, to set request's referrer. |
| referrerPolicy | `ReferrerPolicy` | A referrer policy to set request's referrerPolicy. |
| signal | `AbortSignal<> | ` | An AbortSignal to set request's signal. |
| window | `null` | Can only be null. Used to disassociate request from any Window. |
