export function getActions(apisObject) {
  let action_pre = {};
  for (let prop in apisObject) {
    action_pre[prop] = (store, payload) => {
      return new Promise((resolve, reject) => {
        apisObject[prop](payload)
          .then((res) => {
            const data = res.data.data;
            resolve(data);
          })
          .catch((err) => {
            reject(err);
          });
      });
    };
  }

  return action_pre;
}
