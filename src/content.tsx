// 只做一件事, 就是将 url 中的参数解析出来, 然后传递给 App 组件
import { isElementOfType } from "react-dom/test-utils";

const pathname = window.location.pathname;

// 支持的白名单模型
const whiteModel: Record<string, boolean> = {
  'gpt-4': true,
  default: true,
  'agent': true,
  'research': true,
  'create': true,
}
if (
  pathname === '/search' &&
  window.location.search?.length > 0) {
  const searchParams = new URLSearchParams(window.location.search);
  const tbm = searchParams.get('tbm');
  const cid = searchParams.get('cid');
  if (tbm && tbm === 'youchat' && !cid) {
    const model = searchParams.get('chat_mode') as string;
    if (model && whiteModel[model]) {
      chrome.runtime.sendMessage({
        action: 'changeModel',
        payload: {
          model
        }
      }, response => {
        if (response.action === 'changeModel') {
          if (response.payload) {
            window.location.reload();
          }
        }
      })
    }
  }
}

export {};
