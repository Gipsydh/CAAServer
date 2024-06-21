let onlineUsers = []

const onlineUsersInput = (data) => {
  var foundIndex = -1
  var foundObject = onlineUsers.find(function (obj, index) {
    if (obj["data"] === data) {
      foundIndex = index
    }
  })
  console.log('index:' + foundIndex)
  if (foundIndex !== -1) {
    onlineUsers[foundIndex].time = 'now'
  } else {
    onlineUsers.push({ data: data, time: 'now' })
  }
  console.log(onlineUsers)
}
const onlineUsersDelete = (data) => {
  var foundIndex = -1
  var foundObject = onlineUsers.find(function (obj, index) {
    if (obj["data"] === data) {
      foundIndex = index
    }
  })
  if (foundIndex !== -1) onlineUsers[foundIndex].time = new Date()
  // onlineUsers.splice(idx, 1)
  console.log(onlineUsers)
}
const getCurrOnlineUser = () => {
  return onlineUsers
}
export { onlineUsersInput, onlineUsersDelete, getCurrOnlineUser }
