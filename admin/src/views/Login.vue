<template>
    <div class="register-box">
        <h3>登录页面</h3>
        <el-form :model="registerData" :rules="rules" ref="registerForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="账号" prop="username">
                <el-input v-model="registerData.username"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input type="password" v-model="registerData.password"></el-input>
            </el-form-item>
            <div class="input-button">
                <el-button type="primary" @click="submitForm('registerForm')">登录</el-button>
            </div>
        </el-form>
    </div>
</template>

<script>
export default {
    data(){
        return{
            registerData: {
                username: '',
                password: ''
            },
            rules: {
                username: [{required: true, message: '账号不得为空', trigger: 'blur'},
                            {min: 3, max: 32, message: '长度应该在3-32之间', tigger: 'blur'}
                ],
                password: [{required: true, message: '密码不得为空', trigger: 'blur'},
                           {min: 3, max: 32, message:'长度应该在3-32之间', tigger: 'blur'}
                ]
            }
        }
    },
    methods: {
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    const datastr = `username=${this.registerData.username}&password=${this.registerData.password}`
                    this.$axios.post('/login', datastr).then(res => {
                        console.log(res.data)
                        this.$message({
                            type: 'success',
                            message: '用户登录成功'
                        })
                        localStorage.setItem('elementToken', 'Bearer ' + res.data);
                        this.$router.push('/index');
                    })
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
    }
}
</script>

<style lang="scss">
.register-box {
    width: 500px;
    height: 400px;
    margin: 100px auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 10px;
    box-shadow: 0 0 5px #ccc;

    h3 {
        text-align: center;
    }
    .el-input {
        width: 92%;
    }
    .input-button {
        display: flex;
        button {
            width: 120px;
            margin: 0 auto;
        }
    }
}
</style>