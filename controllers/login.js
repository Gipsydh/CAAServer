import users from '../models/users.js'
const login = async (req, res) => {

 
  try {
    const resp = await users.find({
      email: req.body.email,
    })
    if (resp.length === 0) {
      const obj = {
        email: req.body.email,
        fullName: req.body.name,
        firstName: req.body.given_name,
        picture: req.body.picture,
      }
      users.insertMany(obj)
    }
     req.session.email = req.body.email
     req.session.fullName = req.body.name
     return res.status(200).json({ msg: 'logged in successfully' })
   } catch (error) {}
   
  
}
const home = async (req, res) => {
  try {
   if(req.session.email){
    const resp = await users.find({
      email: req.session.email,
    })
    res.status(200).json(resp)

   }
   else{
    return res.status(200).json({"msg":"not loggedin"})
   }
  } catch (error) {}
}
export  { login, home }
