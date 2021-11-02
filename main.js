import {
  normalizeAddress,
  classifyDocumentContent,
  getMatchText,
  extractInfoFromDocumentContent,
  submitDocument,
  queryDocumentResult,
  ocrCaptcha,
  ocrLicense,
  ocrStamp,
  ocrBill,
  ocrTable,
  ocrTemplate,
  ocrGeneral,
  submitContract,
  queryContractResult,
  downloadContract,
  submitFlow,
  queryFlowResult
} from './api.js'

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const testDocumentProcess = async () => {
  let result = await submitDocument('./files/cv.pdf')
  const task_id = result.data.task_id
  console.log('Document uploaded. Got task_id: ', task_id)

  console.log('wait 10 seconds to get the result...')
  await sleep(10000)
  result = await queryDocumentResult(task_id)

  const { data } = result
  console.log(data)
}

const testContractProcess = async () => {
  let result = await submitContract('./files/contract1.docx', './files/contract2.png')
  const task_id = result.data.task_id
  console.log(`Contracts uploaded. Got task_id: `, task_id)

  console.log('wait 20 seconds to get the result...')
  await sleep(20000)
  result = await queryContractResult(task_id)
  console.log(result.data)

  console.log('get result download link')
  await sleep(1000)
  result = await downloadContract(task_id)
  console.log(result.data)
}

const testFlowProcess = async () => {
  let result = await submitFlow('./files/idp_contract.pdf', 'idp_contract.pdf')
  const task_id = result.data.task_id
  console.log('IDP flow uploaded. Got task_id: ', task_id)

  console.log('wait 10 seconds to get the result...')
  await sleep(10000)
  result = await queryFlowResult(task_id)

  const { data } = result
  console.log(data)
}

const main = async () => {
  try {
    // Please uncomment following lines to test each api
    let result
    // result = await normalizeAddress('徐汇区虹漕路70号')
    result = await classifyDocumentContent('西瓜')
    // result = await getMatchText('西瓜')
    // result = await extractInfoFromDocumentContent('韩国通信运营商KT的有线、无线网络发生了无法连接的状况，导致全国企业、餐馆、普通家庭等上不了网，带来不便。')
    // result = await ocrCaptcha('./files/captcha.jpeg')
    // result = await ocrLicense('./files/id_card.jpeg')
    // result = await ocrStamp('./files/red_stamp.png')
    // result = await ocrBill('./files/bill.jpg')
    // result = await ocrTable('./files/table.png')
    // result = await ocrTemplate('./files/date-template.png')
    // result = await ocrGeneral('./files/general.jpg')
    const { data } = result
    console.log(data)

    // await testDocumentProcess()
    // await testContractProcess()
    // await testFlowProcess()
  } catch (e) {
    console.error(e)
  }
}

main()
