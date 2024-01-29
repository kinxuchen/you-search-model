chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'changeModel' && request.payload.value && request.payload.name) {
    if (request.payload.storageLocation === 'cookie') {
      chrome.cookies.get({
        name: request.payload.key,
        url: request.payload.url
      }).then(async oldModel => {
        if (oldModel && oldModel.value !== request.payload.model) {
          await chrome.cookies.remove({
            name: 'chat_mode',
            url: 'https://you.com'
          })
          await chrome.cookies.set({
            url: request.payload.url,
            name: request.payload.key,
            value: request.payload.value,
            domain: request.payload.domain,
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
    if (request.payload.storageLocation === 'localstorage') {
      console.log('修改 localstorage', request.payload)
      chrome.storage.local.set({
        [request.payload.key]: request.payload.value
      })
      sendResponse({
        action: 'changeModel',
        payload: true,
      })
    }
  }
  return true;
});
