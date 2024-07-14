let onlineVideoUsers = new Map()

const putOnlineVideoUsers = (key, val) => {
  if (onlineVideoUsers.has(key)||onlineVideoUsers.has(val)) return false
 for (let [k, value] of onlineVideoUsers)  {
    console.log(k)
    console.log(value)
    if (value === val||value===key){
     console.log("found common")
     return false;
    }
  }
  onlineVideoUsers.set(key, val)
  return true
}
const showOnlineVideoUsers = () => {
  console.log(onlineVideoUsers)
}
const removeOnlineVideoUsers = (data) => {
  if (onlineVideoUsers.has(data)) onlineVideoUsers.delete(data)
  else {
    onlineVideoUsers.forEach((value, key) => {
      if (value === data) onlineVideoUsers.delete(key)
    })
  }
}
export { putOnlineVideoUsers, showOnlineVideoUsers, removeOnlineVideoUsers }
