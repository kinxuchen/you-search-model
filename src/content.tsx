// 只做一件事, 就是将 url 中的参数解析出来, 然后传递给 App 组件

const pathname = window.location.pathname;
const host = window.location.host;

// 支持的白名单模型
const youWhiteModel: Record<string, boolean> = {
  'gpt-4': true,
  default: true,
  'agent': true,
  'research': true,
  'create': true,
}
const hindWhiteModel: Record<string, boolean> = {
  'gpt-4': true,
  'Phind Model': true,
}
if (
  host === 'you.com' &&
  pathname === '/search' &&
  window.location.search) {
  const searchParams = new URLSearchParams(window.location.search);
  const tbm = searchParams.get('tbm');
  const cid = searchParams.get('cid');
  if (tbm && tbm === 'youchat' && !cid) {
    const model = searchParams.get('chat_mode') as string;
    console.log('修改模型', model)
    if (model && youWhiteModel[model]) {
      chrome.runtime.sendMessage({
        action: 'changeModel',
        payload: {
          storageLocation: 'cookie', // 存储位置
          name: 'chat_mode',
          value: model,
          url: 'https://you.com',
          domain: 'you.com',
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
console.log('host', host);
if (
  host === 'www.phind.com' &&
  pathname === '/search' &&
  window.location.search?.length > 0
) {
  const searchParams = new URLSearchParams(window.location.search);
  const cache = searchParams.get('cache');
  if (!cache) {
    const model = searchParams.get('answerModel') as string;
    if (model && hindWhiteModel[model]) {
      const oldModel = window.localStorage.getItem('answerModel');
      console.log('模型', oldModel, model)
      if (oldModel && oldModel !== `"${model}"`) {
        window.stop();
        window.localStorage.setItem('answerModel', `"${model}"`);
        window.location.reload();
      }
    }
  }
}

export {};
