const express = require('express')
const User = require('../model/User')
const router = express.Router()

// 获取用户列表
router.get('/', async (req, res) => {
    // res.send('hello userRouter')
    console.log('router.get')
    const list = await User.find()
    res.send(list)
})

// 注册
router.post('/register', async (req, res) => {
    // req.body
    // newUser({username, password, name, isAdmin})
    const user = await User.findOne({username: req.body.username})
    if(user){ return res.status(409).send('该用户已存在') }
    const newUser = await new User(req.body).save()
    res.send(newUser)
})

// 登录
router.post('/login', async (req, res) => {
    // 1.查询用户是否存在
    const user = await User.findOne({username: req.body.username})

    if(!user){ return res.status(422).send('该用户不存在') }
    // 2.用户存在，判断密码
    if(req.body.password !== user.password){

        return res.status(422).send('密码错误')
    }else{
        return res.send('token')
    }
})

module.exports = router
