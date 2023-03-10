/************************************crypto-js加解密****************************************************************/
const aesCrypto = require('crypto-js/aes')
const utf8Encode = require('crypto-js/enc-utf8')

// 加密
export const encryptCryptoJs = (text, secretKey) => {
  let encryptedText = aesCrypto.encrypt(utf8Encode.parse(text), secretKey).toString()
  return encryptedText
}
// 解密
export const decryptCryptoJs = (text, secretKey) => {
  let decryptText = aesCrypto.decrypt(text, secretKey).toString(utf8Encode)
  return decryptText.toString(utf8Encode)
}

/***************************************crypto-js加解密*************************************************************/

/***************************************node自带crypto加解密*************************************************************/
const crypto = require('crypto')

// const iv = crypto.randomBytes(12)

// （注意：秘密长度16位就是aes-1128-gcm,24位就是aes-192-gcm，32位就是aes-256-gcm）
// 对称加密
export function symmetricEncrypt(word, keyStr, iv) {
  // iv = crypto.randomBytes(12)
  const cipher = crypto.createCipheriv('aes-192-gcm', keyStr, iv)
  const encrypted = cipher.update(word, 'utf8')
  const end = cipher.final()
  const tag = cipher.getAuthTag()
  const res = Buffer.concat([iv, encrypted, end, tag])
  return res.toString('base64')
}

// 对称解密
export function symmetricDecrypt(data, keyStr, iv) {
  /*
  传入的key和iv需要和加密时候传入的key一致  
*/
  var bData = Buffer.from(data, 'base64')
  // const iv = bData.slice(0, 12)
  const tag = bData.slice(-16)
  const cdata = bData.slice(12, bData.length - 16)
  const decipher = crypto.createDecipheriv('aes-192-gcm', keyStr, iv)
  decipher.setAuthTag(tag)
  var msg = decipher.update(cdata)
  const fin = decipher.final()
  const decryptedStr = new TextDecoder('utf8').decode(Buffer.concat([msg, fin]))
  return decryptedStr
}

// 公钥加密方法
export const encrypt = (data, publicKey) => {
  // 注意，第二个参数是Buffer类型
  // 公钥加密结果
  const encData = crypto.publicEncrypt(publicKey, Buffer.from(data, 'base64'))
  return encData.toString('utf8')
}

// 私钥解密方法
export const decrypt = (encData, privateKey) => {
  // 注意，encrypted是Buffer类型
  const decData = crypto.privateDecrypt(
    { key: privateKey, padding: crypto.constants.RSA_PKCS1_PADDING },
    Buffer.from(encData, 'base64')
  )
  // 私钥解密结果
  return decData.toString('utf8')
}

// 使用私钥加密:
export const encryptPrivateKey = (data, privateKey) => {
  let enc_by_prv = crypto.privateEncrypt(privateKey, Buffer.from(data, 'base64'))
  return enc_by_prv.toString('utf8')
}
// 使用公钥解密
export const decryptPublicKey = (encData, publicKey) => {
  let enc_by_prv = crypto.publicDecrypt(publicKey, Buffer.from(encData, 'base64'))
  return enc_by_prv.toString('utf8')
}

export const createSignature = (data, privateKey) => {
  // 第一步：用私钥对传输的数据，生成对应的签名
  const sign = crypto.createSign('SHA256')
  // 添加数据
  sign.update(data, 'utf8')
  sign.end()
  // 根据私钥，生成签名
  const signature = sign.sign(privateKey, 'base64') //生成签名（私钥加密）
  // const signature = sign.sign(privateKey, 'hex') //生成签名（私钥加密）

  // 第二步：借助公钥验证签名的准确性
  // const verify = crypto.createVerify("RSA-SHA256");
  // verify.update(data, "utf8");
  // verify.end();
  // let verifyResult = verify.verify(pubKey, signature, 'hex') //验证签名（公钥解密）
  // console.log(verifyResult) //true

  return signature
}
