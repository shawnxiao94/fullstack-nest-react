import CryptoJS from 'crypto-js'
import jsencrypt from 'jsencrypt'
// 加密密钥
// 注意这个传输的时候需要转成base64字符
export const SECRET_KEY = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse('1234123412ABCDEF')) // 里面是十六位十六进制数，转成base64字符作为密钥进行传输
export const SECRET_IV = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse('ABCDEF1234123412')) // 十六位十六进制数作为密钥偏移量
// export const SECRET_KEY = CryptoJS.enc.Utf8.parse('1234123412ABCDEF') // 十六位十六进制数作为密钥
// export const SECRET_IV = CryptoJS.enc.Utf8.parse('ABCDEF1234123412') // 十六位十六进制数作为密钥偏移量

// 加密函數,secretKey:加密钥匙
export function encrypt(word, secretKey, iv) {
  if (typeof word === 'object') {
    // 如果传入的data是json对象，先转义为json字符串
    try {
      word = JSON.stringify(word)
    } catch (error) {
      console.log('error:', error)
    }
  }
  // 统一将传入的字符串转成UTF8编码
  const dataHex = CryptoJS.enc.Utf8.parse(word) // 需要加密的数据
  const keyHex = CryptoJS.enc.Utf8.parse(secretKey) // 秘钥
  const ivHex = CryptoJS.enc.Utf8.parse(iv) // 偏移量
  const encrypted = CryptoJS.AES.encrypt(dataHex, keyHex, {
    iv: ivHex,
    mode: CryptoJS.mode.CBC, // 加密模式
    padding: CryptoJS.pad.Pkcs7
  })
  let encryptedVal = encrypted.ciphertext.toString()
  return encryptedVal //  返回加密后的值
}

// 解密函數
export function decrypt(word, secretKey, iv) {
  /*
  传入的key和iv需要和加密时候传入的key一致  
*/
  // 统一将传入的字符串转成UTF8编码
  let encryptedHexStr = CryptoJS.enc.Hex.parse(word)
  let srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr)
  const keyHex = CryptoJS.enc.Utf8.parse(secretKey) // 秘钥
  const ivHex = CryptoJS.enc.Utf8.parse(iv) // 偏移量
  let decrypt = CryptoJS.AES.decrypt(srcs, keyHex, {
    iv: ivHex,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  })
  let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8)
  return decryptedStr.toString()
}

/** *******************************************************************************/
// crypto加密需要长度为16的密钥，且考虑到安全性密钥最好还是随机生成

// 创建密钥
export function createAesKey() {
  const expect = 16
  let str = Math.random().toString(36).substr(2)
  while (str.length < expect) {
    str += Math.random().toString(36).substr(2)
  }
  str = str.substr(0, 16)
  return str
}

// 加密
// ECB模式不需要偏移量。如果选择加密模式为CBC，则还需要生成16位数的iv
export function msgEncrypted(word, key) {
  let srcs = CryptoJS.enc.Utf8.parse(word)
  let kkey = CryptoJS.enc.Utf8.parse(key)
  let encrypted = CryptoJS.AES.encrypt(srcs, kkey, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  })
  return encrypted.ciphertext.toString().toUpperCase()
}

// 解密
// 解密模式同上，如果选择CBC，也需要传入相应的iv
export function msgDecrypted(content, key) {
  let sKey = CryptoJS.enc.Utf8.parse(key)
  let decrypt = CryptoJS.AES.decrypt(content, sKey, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  })
  let deRes = JSON.parse(CryptoJS.enc.Utf8.stringify(decrypt).toString())
  return deRes
}
/** *******************************************************************************/

// 加密
export function strEncrypted(word, key) {
  const aesCrypto = CryptoJS.AES
  const utf8Encode = CryptoJS.enc.Utf8
  let encrypted = aesCrypto.encrypt(utf8Encode.parse(word), key).toString()
  return encrypted
}

// 解密
export function strDecrypted(content, key) {
  const aesCrypto = CryptoJS.AES
  const utf8Encode = CryptoJS.enc.Utf8
  let decrypt = aesCrypto.decrypt(content, key).toString(utf8Encode)
  let deRes = decrypt.toString(utf8Encode)
  return deRes
}

/** *******************************************************************************/
/*
 * jsencrypt
 */

// RSA公钥加密
export async function encryptByPubKey(keyword, pubKey): Promise<string> {
  // 实例化 jsencrypt
  const JSencrypt = new jsencrypt()
  // 对实例化对象设置公钥
  JSencrypt.setPublicKey(pubKey)
  // 通过公钥对数据加密
  const securePass: string = JSencrypt.encrypt(keyword) || ''
  return securePass
}

// RSA私钥解密
export async function decryptByPrivateKey(keyword, pubKey): Promise<string> {
  // 实例化 jsencrypt
  const JSencrypt = new jsencrypt()
  // 对实例化对象设置公钥
  JSencrypt.setPrivateKey(pubKey)
  // 通过公钥对数据加密
  const pass: string = JSencrypt.decrypt(keyword) || ''
  return pass
}

/*
 *RSA验签
 *@param data 原始字符串
 *@param sign 签名
 *@return 是否验签通过
 */
export async function verifySignature(data, signature, publicKey) {
  const JSencrypt = new jsencrypt()
  // 设置公钥
  JSencrypt.setPublicKey(publicKey)
  return JSencrypt.verify(data, publicKey, signature)
}
/*
 *RSA验签
 *@param data 原始字符串
 *@param sign 签名
 *@return 是否验签通过
 */
export async function verifySignatureJSencrypt(data, signature, publicKey) {
  const JSencrypt = new jsencrypt()
  // 设置公钥
  JSencrypt.setPublicKey(publicKey)
  return JSencrypt.verify(data, signature, CryptoJS.SHA256)
}

// 总结
// 一般情况下，前端自己实现加解签没有问题，后端自己实现加解签也没有问题。问题主要出在2个方面：

// 前后端编码格式不一样
// 前端加签的结果传到后端，或者后端加签的结果传到前端，对方无法识别接收到的字符串。主要原因在于双方的字符串编码格式不一样，前端的是base64格式，后端的就不能是hex格式，需要使用同样的编码格式。
// 散列算法不一样
// 因为后端使用SHA散列算法，这是默认的SHA1算法，所以前端也要使用SHA1算法。
// 密钥格式不一样
// 后端Crypto++库生成的是key格式的密钥，前端jsrsasign库使用的是pem格式的密钥(JSEncrypt库可以兼容两种格式)，所以需要将key格式转换为pem格式
