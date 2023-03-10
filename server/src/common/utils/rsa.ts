import { generateKeyPair } from 'crypto'
import fs = require('fs')
import path = require('path')
import { promisify } from 'util'
const fsPromise = fs.promises

const filePathes = {
  public: path.join('.data', 'PUBLIC-KEY'),
  private: path.join('.data', 'PRIVATE_KEY')
}

const asyncGenerateKeyPair = promisify(generateKeyPair)

async function generateKeys() {
  const { publicKey, privateKey } = await asyncGenerateKeyPair('rsa', {
    modulusLength: 1024,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem'
    },
    privateKeyEncoding: {
      type: 'pkcs1',
      format: 'pem'
    }
  })

  await fsPromise.mkdir('.data')
  await Promise.allSettled([
    fsPromise.writeFile(filePathes.public, publicKey),
    fsPromise.writeFile(filePathes.private, privateKey)
  ])
}

async function getKey(type) {
  const filePath = filePathes[type]
  const getter = async () => {
    try {
      return await fsPromise.readFile(filePath, 'utf-8')
    } catch (err) {
      console.error('[error occur while read file', err)
      return
    }
  }
  const key = await getter()
  if (key) {
    return key
  }

  await generateKeys()
  return await getter()
}

export async function getPublicKey() {
  return getKey('public')
}

export async function getPrivateKey() {
  return getKey('private')
}
