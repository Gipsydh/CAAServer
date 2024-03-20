const socketAuth=(socket,next)=>{
if (socket.request.session.email==null){
 next (new Error("not authorized"))
}
else{
 next();
}
}
export default socketAuth