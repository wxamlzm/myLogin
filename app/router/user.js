const express = require('express')
const User = require('../model/User')
const router = express.Router()

// 获取用户列表
router.get('/', async (req, res) => {
    // res.send('hello userRouter')
    const list = await User.find()
    res.send(list)
})

// 注册
router.post('/register', async (req, res) => {
    // req.body
    // newUser({username, password, name, isAdmin})
    const user = await User.findOne({username: req.body.username})
    if(user){ return res.status(409).send('该用户已存在') }
    // 密码加密

    const newUser = await new User(req.body).save()
    res.send(newUser)
})

// 登录
router.post('/login', async (req, res) => {
    // 1.查询用户是否存在
    const user = await User.findOne({username: req.body.username})

    if(!user){ return res.status(422).send('该用户不存在') }
    // 2.用户存在，判断密码
    // if(req.body.password !== user.password){

    //     return res.status(422).send('密码错误')
    // }else{
    //     return res.send('token')
    // }
    // 2.5解密

    // 返回token
    const token = user._id + '.' + user.username
    res.send(token)
})

// 验证
router.get('/verify', async (req, res) => {
    // console.log(req.headers.authorization)
    // 获取token
    const token = req.headers.authorization.split(' ')[1]
    const id = token.split('.')[0]
    const username = token.split('.')[1]
    // console.log(token, id, user)
    // 查询用户是否存在
    const user = await User.findById(id)
    if(!user){ return res.status(422).send('用户错误') }
    // 查看username
    if(username !== user.username){
        res.status(422).send('用户错误')
    }else{
        // 用户存在，查看权限
        if(user.isAdmin === '0'){
            res.status(409).send('没有权限')
        }else if(user.isAdmin === '1'){
            res.send('Admin')
        }
    }
})

module.exports = router
