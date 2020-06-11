<template>
    <div class="login_container layui-bg-cyan">
        <div class="login_box">
            <div class="login_title">
                <h2 class="title_text" style="font-family: KaiTi SimSun;">White Town</h2>
                <p style="color: #808080">GrainRain出品-模块化后台管理开发平台</p>
            </div>
            <div class="form_box layui-form">
                <div class="layui-form-item">
                    <label class="username_white_town layui-icon layui-icon-username" for="login-username"></label>
                    <input type="text" name="username" id="login-username" lay-verify="required" placeholder="请输入用户名" class="layui-input">
                </div>
                <div class="layui-form-item">
                    <label class="username_white_town layui-icon layui-icon-password" for="login-password"></label>
                    <input type="text" name="upassword" id="login-password" lay-verify="required" placeholder="请输入密码" class="layui-input">
                </div>
                <div class="layui-form-item">
                    <div class="layui-row">
                        <div class="layui-col-xs7">
                            <label class="username_white_town layui-icon layui-icon-vercode" for="login-vercode"></label>
                            <input type="text" name="vercode" id="login-vercode" lay-verify="required" placeholder="请输入验证码" class="layui-input">
                        </div>
                        <div class="layui-col-xs5">
                            <div style="margin-left: 10px;">
                                <img src="/erus/ver"  class="login_vercode" id="vercode">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="layui-form-item">
                    <button class="layui-btn layui-btn-fluid" lay-submit lay-filter="ogin-submit">登 录</button>
                </div>
            </div>
            <div class="login_image layui-trans">
                <div class="row">
                    <div class='layui-col-xs3'>
                        <label>快速登录</label>
                    </div>
                    <div class='layui-col-xs2'>
                        <a href="javascript:;"><img src="../assets/weixinic.png" width="45%"/></a>
                    </div>
                    <div class='layui-col-xs2'>
                        <a href="javascript:;"><img src="../assets/zhifubao.png" width="45%"/></a>
                    </div>
                    <div class='layui-col-xs2'>
                        <a href="javascript:;"><img src="../assets/githubblue.png" width="45%"/></a>
                    </div>
                </div>
            </div>
        </div>
        <div class="login-footer">
            <span>© 2018 </span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href="#"><span style="color: #336699">www.whitetown.cn</span></a>
        </div>
    </div>
</template>

<script>
export default {}
</script>

<style lang="less" scoped>
    .login_container {
        height: 100%;
    }
    .login_box {
        width: 370px;
        height:400px;
        position: absolute;
        left: 50%;
        top: 47%;
        transform: translate(-50%,-50%);
    }
    .login_box {
        text-align: center;
    }
    .login-footer{
        position: absolute;
        left: 50%;
        top: 82%;
        width: 370px;
        text-align: center;
        transform: translate(-50%,-50%);
        color: #B0B0B0;
    }
    .login_title {
        padding: 20px;
        text-align: center;
    }
    .title_text {
        color: #FFB800;
        font-size: 30px;
        padding: 10px;
    }
    .form_box {
        padding: 10px;
    }

    .layui-form-item {
        position:relative
    }
    .layui-input {
        padding-left:38px
    }
    .username_white_town {
        color: deepskyblue;
        position: absolute;
        left: 1px;
        top: 1px;
        width: 38px;
        line-height: 36px;
        text-align: center;
    }
    .login_vercode {
        max-height: 38px;
        width: 100%;
        cursor: pointer;
        box-sizing: border-box;
    }
    .login_other {
        position: absolute;
        left: 1px;
        top: 1px;
        width: 88px;
        line-height: 36px;
    }
    .login_image {
        position: absolute;
        width: 370px;
        left: -7px;
        font-size: 14px;
        color:rgb(152, 156, 117);
    }
    .login_other {
        padding: 20px;
        font-size: 14px;
        color: darkolivegreen;
    }
</style>
