const userLoginVerify = async (req, res, next) => {
  if (req.session.email) {
    next()
  } else {
    return res.status(401).json({ msg: 'unauthrized' })
  }
}
export default userLoginVerify
