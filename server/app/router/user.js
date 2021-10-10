const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../model/User')
const router = express.Router()
const { secret } = require('../config/k')

// 定义验证身份中间件
const isAdmin = async (req, res, next) => {
    // jwt-token
    const token = req.headers.authorization.split(' ').pop()

    // 1. 解开token加密
    const { _id, username } = jwt.verify(token, secret)

    // 2.查询用户是否存在
    const user = await User.findById(_id)

    if(!user){ return res.status(422).send('用户错误') }
    // 3.查看username
    if(username !== user.username){
        res.status(422).send('用户错误')
    }else{
        // 用户存在，查看权限
        if(user.isAdmin === '0'){
            res.status(409).send('没有权限')
        }else if(user.isAdmin === '1'){
            next()
        }
    }
}

// 获取用户列表
router.get('/', isAdmin, async (req, res) => {
    const list = await User.find()
    res.send(list)
})

// 注册
router.post('/register', async (req, res) => { 
    const user = await User.findOne({username: req.body.username})

    if(user){ return res.status(409).send('该用户已存在') }

    const newUser = await new User(req.body).save()
    // console.log(newUser)
    res.send(newUser)
})

// 登录
router.post('/login', async (req, res) => {
    // 1.查询用户是否存在,如果存在则返回数据库中该用户的数据对象
    const user = await User.findOne({username: req.body.username})

    if(!user){ return res.status(422).send('该用户不存在') }

    // 2.解密密码加密和密码验证
    let isPassword = bcrypt.compareSync(req.body.password, user.password)
    if(!isPassword){ return res.status(422).send('密码错误')}

    // jwt-token
    const { _id, username } = user
    const token = jwt.sign(
        { _id, username },     // 传值规则
        secret,                // 加密规则
        { expiresIn: '24h' }   // 时间（有效时间？）
    )

    res.send(token)
})

// 验证
router.get('/verify', async (req, res) => {
    console.log(req.headers.authorization)
    // 1.获取token
    // const token = req.headers.authorization.split(' ')[1]
    // const id = token.split('.')[0]
    // const username = token.split('.')[1]
    // // console.log(token, id, user)
    // // 2.查询用户是否存在
    // const user = await User.findById(id)
    // if(!user){ return res.status(422).send('用户错误') }
    // // 3.查看username
    // if(username !== user.username){
    //     res.status(422).send('用户错误')
    // }else{
    //     // 用户存在，查看权限
    //     if(user.isAdmin === '0'){
    //         res.status(409).send('没有权限')
    //     }else if(user.isAdmin === '1'){
    //         res.send('Admin')
    //     }
    // }

    /*
    // jwt
    const token = req.headers.authorization.split(' ').pop()
    console.log(jwt.verify(token, secret))

    // 查询用户是否存在
    const { _id, username } = jwt.verify(token, secret)
    console.log(_id)
    */
})


module.exports = router
