// import md5 from 'js-md5'
import { useState, useEffect } from 'react'
import { Button, Form, Input, message, Checkbox } from 'antd'
import { useNavigate } from 'react-router-dom'
import { Login } from '@/apis/interface'
import useLoginApi from '@/apis/modules/login'
import { HOME_URL, LOGIN_URL } from '@/config/config'
import { connect } from 'react-redux'
import { setToken, setTabsList, setUserInfo } from '@/store/app'
import { useTranslation } from 'react-i18next'
import { UserOutlined, LockOutlined, CloseCircleOutlined, SafetyCertificateOutlined } from '@ant-design/icons'
import Loading from '@/components/Loading'
import { SECRET_IV, SECRET_KEY, decrypt, encrypt, encryptByPubKey, verifySignatureJSencrypt, strDecrypted } from '@/utils/crypto'

type CaptchaType = {
  id: string
  img: string
}

const { loginApi, getCaptchaApi, getPublicKeyApi } = useLoginApi()

const REMEMBER_ME_USER_INFO = 'remember_me_user_info'
const PUBLIC_KEY_SECRET_INFO = 'public_key_secret_info'

const LoginForm = (props: any) => {
  const { t } = useTranslation()
  const { setToken, setUserInfo, setTabsList } = props
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [formVal, setFormVal] = useState({
    account: '',
    password: '',
    verifyCode: '',
    captchaId: '',
    remember: true
  })
  const [loading, setLoading] = useState<boolean>(false)
  const [loadingCaptcha, setLoadingCaptcha] = useState<boolean>(false)

  // 定义一个变量保存验证码图片信息
  const [captchaInfo, setCaptchaInfo] = useState<CaptchaType>({ id: '', img: '' })
  // 验证码
  const getCaptchaImg = async () => {
    try {
      setLoadingCaptcha(true)
      const res: any = await getCaptchaApi({ width: 100, height: 50 })
      if (res?.id) {
        setCaptchaInfo(res)
      }
    } catch {
      new Error('错误')
    } finally {
      setLoadingCaptcha(false)
    }
  }
  const getPublicKeyFn = async () => {
    try {
      const res: any = await getPublicKeyApi()
      if (res) {
        localStorage.setItem(PUBLIC_KEY_SECRET_INFO, res)
      }
    } catch {
      new Error('获取公钥错误')
    }
  }

  // 登录
  const onFinish = async (loginForm: Login.ReqLoginForm) => {
    try {
      setLoading(true)
      let pubKey = localStorage.getItem(PUBLIC_KEY_SECRET_INFO)
      if (!pubKey) {
        return
      }
      const secretPassword = await encryptByPubKey(loginForm.password, pubKey)
      const secretAccount = await encryptByPubKey(loginForm.account, pubKey)
      const hashClient = await encryptByPubKey(SECRET_KEY, pubKey)
      const ivClient = await encryptByPubKey(SECRET_IV, pubKey)
      const form = {
        ...formVal,
        account: secretAccount,
        password: secretPassword,
        verifyCode: loginForm.verifyCode,
        captchaId: captchaInfo.id,
        hashClient,
        ivClient
      }
      const data: any = await loginApi({ ...form })
      if (data?.token && data?.encryptUserInfo) {
        const flag = await verifySignatureJSencrypt(data?.encryptUserInfo, data?.signature, pubKey)
        if (!flag) {
          message.error('危险，数据被篡改了！')
          return
        }
        const user = strDecrypted(data?.encryptUserInfo, SECRET_KEY)
        setUserInfo(JSON.parse(user))
        setToken(data.token)
        setTabsList([])
        if (loginForm.remember) {
          rememberMe(loginForm)
        } else {
          clearLoginInfo()
        }
        message.success('登录成功！')
        navigate(HOME_URL)
      } else {
        message.error('登录失败！')
        navigate(LOGIN_URL)
      }
    } finally {
      setLoading(false)
    }
  }

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo)
  }

  const loadStoreLoginInfo = async () => {
    const infoStr = localStorage.getItem(REMEMBER_ME_USER_INFO)
    if (infoStr) {
      const publicKey = localStorage.getItem(PUBLIC_KEY_SECRET_INFO)
      const info = JSON.parse(infoStr)
      let account = decrypt(info.account, publicKey, SECRET_IV)
      let password = decrypt(info.password, publicKey, SECRET_IV)
      const value = {
        ...form.getFieldsValue(),
        account,
        password,
        remember: info.remember
      }
      setFormVal(value)
      form.setFieldsValue(value)
    }
  }
  const rememberMe = async loginForm => {
    const publicKey = localStorage.getItem(PUBLIC_KEY_SECRET_INFO)
    const account = encrypt(loginForm.account, publicKey, SECRET_IV)
    const password = encrypt(loginForm.password, publicKey, SECRET_IV)
    localStorage.setItem(
      REMEMBER_ME_USER_INFO,
      JSON.stringify({
        account,
        password,
        remember: loginForm.remember
      })
    )
  }
  const clearLoginInfo = () => {
    localStorage.removeItem(REMEMBER_ME_USER_INFO)
  }

  useEffect(() => {
    getCaptchaImg()
    if (!localStorage.getItem(PUBLIC_KEY_SECRET_INFO)) {
      getPublicKeyFn()
    }
    loadStoreLoginInfo()
  }, [])

  return (
    <Form
      form={form}
      name="basic"
      labelCol={{ span: 5 }}
      initialValues={{ ...formVal }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      size="large"
      autoComplete="off">
      <Form.Item name="account" rules={[{ required: true, message: '请输入用户名' }]}>
        <Input placeholder="用户名：admin / user" prefix={<UserOutlined />} />
      </Form.Item>
      <Form.Item name="password" rules={[{ required: true, message: '请输入密码' }]}>
        <Input.Password autoComplete="new-password" placeholder="密码：123456" prefix={<LockOutlined />} />
      </Form.Item>
      <Form.Item>
        {/* 验证码盒子 */}
        <div className="captcha-box">
          <Form.Item name="verifyCode" noStyle rules={[{ required: true, message: '请输入验证码' }]}>
            <Input placeholder="验证码" prefix={<SafetyCertificateOutlined />} />
          </Form.Item>
          <div className="captcha-img" onClick={getCaptchaImg}>
            {loadingCaptcha ? <Loading /> : <img height="38" src={captchaInfo?.img} alt="" />}
          </div>
        </div>
      </Form.Item>
      <Form.Item className="info-box">
        <Form.Item noStyle name="remember" valuePropName="checked">
          <Checkbox>Remember me</Checkbox>
        </Form.Item>
        <a className="login-form-forgot">Forgot password</a>
      </Form.Item>
      <Form.Item className="login-btn">
        <Button
          onClick={() => {
            form.resetFields()
          }}
          icon={<CloseCircleOutlined />}>
          {t('login.reset')}
        </Button>
        <Button type="primary" htmlType="submit" loading={loading} icon={<UserOutlined />}>
          {t('login.confirm')}
        </Button>
      </Form.Item>
    </Form>
  )
}

const mapDispatchToProps = { setToken, setTabsList, setUserInfo }
export default connect(null, mapDispatchToProps)(LoginForm)
