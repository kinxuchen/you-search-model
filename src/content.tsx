// 只做一件事, 就是将 url 中的参数解析出来, 然后传递给 App 组件
const pathname = window.location.pathname;
console.log(pathname)
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
  console.log(window.location.search)
  const cid = searchParams.get('cid');
  if (tbm && tbm === 'youchat' && !cid) {
    const cookie = document.cookie;
    const cookieList = cookie.split(';');
    const cookieMap = cookieList.reduce<Record<string, string>>((cur, next) => {
      const [key, value] = next.split('=');
      cur[key.trim()] = value.trim();
      return cur;
    }, {});
    const oldModel = cookieMap['chat_mode'];
    const model = searchParams.get('chat_mode') as string;
    if (model && model !== oldModel) {
      document.cookie = `chat_mode=${model}`;
      window.location.reload();
    }
  }
}

export {};
