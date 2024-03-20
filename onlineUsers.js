let onlineUsers = []

const onlineUsersInput = (data) => {
  onlineUsers.push(data)
  console.log(onlineUsers)
}
const onlineUsersDelete = (data) => {
  let idx = onlineUsers.indexOf(data)
  if(idx!=-1)
  onlineUsers.splice(idx, 1)
  console.log(onlineUsers)
}
const getCurrOnlineUser=()=>{
 return onlineUsers
}
export { onlineUsersInput, onlineUsersDelete, getCurrOnlineUser }
