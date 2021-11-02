import crypto from 'crypto'
import axios from 'axios'
import dotenv from 'dotenv'
import fs from 'fs'

const { parsed: env } = dotenv.config()
// console.log(env)
const baseURL = 'https://mage.uibot.com.cn/v1'
const api = axios.create({ baseURL })

const get_header = ({ publicKey, secretKey }) => {
  if (!publicKey) throw 'Invalid public key'
  if (!secretKey) throw 'Invalid secret key'

  const nounce = crypto.randomBytes(16).toString('hex') // some randome string
  const timestampString = `${Math.floor(+new Date() / 1000)}` // seconds
  const signToken = crypto
    .createHash('sha1')
    .update(nounce + timestampString + secretKey)
    .digest('hex')

  return {
    'Api-Auth-nonce': nounce,
    'Api-Auth-pubkey': publicKey,
    'Api-Auth-timestamp': timestampString,
    'Api-Auth-sign': signToken
  }
}

// ==================================
// NLP
// ==================================

// 地址标准化
export const normalizeAddress = (address = '') => {
  const headers = get_header({ publicKey: env.GeoExtractPublicKey, secretKey: env.GeoExtractSecretKey })
  return api.post('/mage/nlp/geoextract', { text: address }, { headers })
}

// 文本分类
export const classifyDocumentContent = (doc = '') => {
  const headers = get_header({ publicKey: env.DocContentClassifyPublicKey, secretKey: env.DocContentClassifySecretKey })
  return api.post('/document/classify', { doc }, { headers })
}

// 文本匹配
export const getMatchText = (text = '') => {
  const headers = get_header({ publicKey: env.TextMatchPublicKey, secretKey: env.TextMatchSecretKey })
  return api.post('/mage/nlp/textmatch', { text }, { headers })
}

// 信息抽取
export const extractInfoFromDocumentContent = (docContent = '') => {
  const headers = get_header({ publicKey: env.DocContentExtractPublicKey, secretKey: env.DocContentExtractSecretKey })
  return api.post('/document/extract', { doc: docContent }, { headers })
}

// 文档抽取-提交任务
// This api will return a task_id, you can use this task_id to query the result later on
export const submitDocument = (filePath) => {
  const headers = get_header({ publicKey: env.DocExtractPublicKey, secretKey: env.DocExtractSecretKey })
  const file = fs.readFileSync(filePath, { encoding: 'base64' })
  return api.post('/mage/nlp/docextract/create', { file_base64: file }, { headers })
}
// 文档抽取-获取结果
// Use this api to get the process result with the task_id given from 文档抽取-提交任务 api
export const queryDocumentResult = (taskID = '') => {
  const headers = get_header({ publicKey: env.DocExtractPublicKey, secretKey: env.DocExtractSecretKey })
  return api.post('/mage/nlp/docextract/query', { task_id: taskID }, { headers })
}

// ==================================
// OCR
// ==================================

// 验证码识别
export const ocrCaptcha = (filePath) => {
  const headers = get_header({ publicKey: env.VerificationPublicKey, secretKey: env.VerificationSecretKey })
  const image = fs.readFileSync(filePath, { encoding: 'base64' })
  return api.post('/document/ocr/verification', { img_base64: image }, { headers })
}
// 通用卡证识别
export const ocrLicense = (filePath) => {
  const headers = get_header({ publicKey: env.LicensePublicKey, secretKey: env.LicenseSecretKey })
  const image = fs.readFileSync(filePath, { encoding: 'base64' })
  return api.post('/mage/ocr/license', { img_base64: image }, { headers })
}
// 印章识别
export const ocrStamp = (filePath) => {
  const headers = get_header({ publicKey: env.StampPublicKey, secretKey: env.StampSecretKey })
  const image = fs.readFileSync(filePath, { encoding: 'base64' })
  return api.post('/mage/ocr/stamp', { img_base64: image }, { headers })
}
// 通用多票据识别
export const ocrBill = (filePath) => {
  const headers = get_header({ publicKey: env.BillsPublicKey, secretKey: env.BillsSecretKey })
  const image = fs.readFileSync(filePath, { encoding: 'base64' })
  return api.post('/mage/ocr/bills', { img_base64: image }, { headers })
}
// 通用表格识别
export const ocrTable = (filePath) => {
  const headers = get_header({ publicKey: env.TablePublicKey, secretKey: env.TableSecretKey })
  const image = fs.readFileSync(filePath, { encoding: 'base64' })
  return api.post('/mage/ocr/table', { img_base64: [image] }, { headers })
}
// 模板识别
export const ocrTemplate = (filePath) => {
  const headers = get_header({ publicKey: env.TemplatePublicKey, secretKey: env.TemplateSecretKey })
  const image = fs.readFileSync(filePath, { encoding: 'base64' })
  return api.post('/document/ocr/template', { img_base64: image }, { headers })
}
// 通用文字识别
export const ocrGeneral = (filePath) => {
  const headers = get_header({ publicKey: env.GeneralPublicKey, secretKey: env.GeneralSecretKey })
  const image = fs.readFileSync(filePath, { encoding: 'base64' })
  return api.post('/mage/ocr/general', { img_base64: [image] }, { headers })
}

// ==================================
// Contract
// ==================================
export const submitContract = (filePath1, filePath2) => {
  const headers = get_header({ publicKey: env.ContractPublicKey, secretKey: env.ContractSecretKey })
  const file1 = fs.readFileSync(filePath1, { encoding: 'base64' })
  const file2 = fs.readFileSync(filePath2, { encoding: 'base64' })
  return api.post('/mage/solution/contract/compare', { file_base: file1, file_compare: file2 }, { headers })
}
export const queryContractResult = (taskID) => {
  const headers = get_header({ publicKey: env.ContractPublicKey, secretKey: env.ContractSecretKey })
  return api.post('/mage/solution/contract/detail', { task_id: taskID }, { headers })
}
export const downloadContract = (taskID) => {
  const headers = get_header({ publicKey: env.ContractPublicKey, secretKey: env.ContractSecretKey })
  return api.post('/mage/solution/contract/files', { task_id: taskID }, { headers })
}

// ==================================
// IDP
// ==================================
export const submitFlow = (filePath, fileName) => {
  const headers = get_header({ publicKey: env.FlowPublicKey, secretKey: env.FlowSecretKey })
  const file = fs.readFileSync(filePath, { encoding: 'base64' })
  return api.post('/mage/idp/flow/task/create', { file: { base64: file, name: fileName } }, { headers })
}
export const queryFlowResult = (taskID, withOcrResult = true) => {
  const headers = get_header({ publicKey: env.FlowPublicKey, secretKey: env.FlowSecretKey })
  return api.post('/mage/idp/flow/task/query', { task_id: taskID, with_ocr_general: withOcrResult }, { headers })
}
