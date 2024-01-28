// @ts-ignore
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'changeModel' && request.payload.model) {
    console.log('设置 cookie')
    chrome.cookies.get({
      name: 'chat_mode',
      url: 'https://you.com'
    }).then(async oldModel => {
      if (oldModel && oldModel.value !== request.payload.model) {
        await chrome.cookies.remove({
          name: 'chat_mode',
          url: 'https://you.com'
        })
        await chrome.cookies.set({
          url: 'https://you.com',
          name: 'chat_mode',
          value: request.payload.model,
          domain: 'you.com',
          expirationDate: 9999999999,
          secure: true
        })
        sendResponse({
          action: 'changeModel',
          payload: true,
        })
      } else {
        sendResponse({
          action: 'changeModel',
          payload: false,
        })
      }
    })
  }
  return true;
});
