var Excel = require('exceljs');
var workbook = new Excel.Workbook();
var asc = require('async')
var cheerio = require('cheerio')
var superagent = require('superagent')
var cookies = 'login-token=6c7954db-b968-4350-b995-641e489d529d%3aa49b6f55-d34e-4f5c-861d-7467f03d82d5_6223fffb7510390aaf37ff2df4881727%3acrx.default'
var login_url = "https://wcp.panasonic.cn/libs/cq/core/content/login.html/j_security_check"
var browserMsg = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.82 Safari/537.36",
    
    "accept": "*/*",
    "accept-language": "en-US,en;q=0.9,de;q=0.8,en-GB;q=0.7,it;q=0.6,zh-CN;q=0.5,zh;q=0.4,uk;q=0.3,cs;q=0.2",
    "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
    "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"98\", \"Google Chrome\";v=\"98\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    // "Referer": "https://wcp.panasonic.cn/libs/granite/core/content/login.html?resource=%2Fsiteadmin&$$login$$=%24%24login%24%24&j_reason=unknown&j_reason_code=unknown",
    "Referrer-Policy": "strict-origin-when-cross-origin"
};
let filename="br-pt_4392.xlsx"
// var xmlreader = require('xmlreader');
function getFirstAttr(obj) {
    for (var k in obj) return k;
}
// 读文件
async function readfile(filename) {
    await workbook.xlsx.readFile(filename)
    return workbook
}
// 写文件
async function writefile(workbook) {
    // var formdate=formatDate(new Date())
    await workbook.xlsx.writeFile(`./result/${filename}`)
    return 'done'
}
// function fetchnow(idx,worksheet){
//     return new Promise((resolve,reject)=>{
//         let row = worksheet.getRow(idx)
       
       
//         // let template=row.getCell(8).value
        
//         if(row.getCell(2).value!=''&&row.getCell(2).value!=null){
    
//             let prourl=row.getCell(2).value.replace('.html','/jcr:content.2.json')
//             // let prourl=row.getCell(3).value
//             // superagent.get(prourl).redirects(0).set(browserMsg).end((err,sres)=>{
//             superagent.get(prourl).redirects(0).set({ Cookie: cookies }).set(browserMsg).end((err,sres)=>{
//             if(err) {
//                 row.zgetCell(15).value=err.status
//                 resolve()
//                 // fetchnow(idx,worksheet)
//             } else{
              
//                 if (sres.body.globalcategory) {
                   
//                     row.getCell(7).value=sres.body.globalcategory
//                 } 
              
//                 resolve()
//             }
//         })
//         }else{
//             resolve()
//         }
        
//     })
// }
function fetchredir(idx,worksheet){
    return new Promise((resolve,reject)=>{
        let row = worksheet.getRow(idx)
        if(row.getCell(3).value!=''&&row.getCell(3).value!=null){
            let prourl=row.getCell(3).value
            console.log(prourl)
            superagent.get(prourl).redirects(0).set(browserMsg).end((err,sres)=>{
                if(err) {
                    console.log('issue'+prourl)
                    
                    let redir=sres.header.location?sres.header.location:''
                    console.log(err.status,redir)
                    if(redir&&redir.indexOf("https://www.panasonic.com")==-1) redir="https://www.panasonic.com"+redir
                    row.getCell(8).value=sres.header.location
                    if(err.status == 404){
                        row.getCell(9).value=404
                    }
                    
                    resolve()
                    // fetchnow(idx,worksheet)
                } else{
                    let $=cheerio.load(sres.text)
                    $('script').each(function(i,v){
                        if($(v).html().indexOf('glPageInfo.categoryAffinity')!=-1){
                            let temphtml=$(v).html().trim()
                            let gc=temphtml.split('glPageInfo.categoryAffinity = ')[1].replace(/\"/g,'').replace(/\;/g,'')
                            console.log(temphtml.split('glPageInfo.categoryAffinity = ')[1].replace(/\"/g,'').replace(/\;/g,''))
                            row.getCell(7).value=gc
                    
                        }
                    })
                    resolve()
            
                }
            })
        }
    })

}
var sleep = async (duration) => {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, duration);
    });
  };
async function excuteall() {
    file = await readfile(`./${filename}`)
    // 获取第一个sheet，从1开始
    let worksheet = file.getWorksheet(1)
    worksheet.getRow(1).getCell(7).value="Global Category"
    worksheet.getRow(1).getCell(8).value="redirect"

    for(count=2;count <=worksheet.rowCount;count++){
        // if(worksheet.getRow(count).getCell(2).value!=null){
        //     await sleep(100)
        // }
        await fetchredir(count, worksheet)
        // await fetchreview(pkey,count, worksheet)
        if(count%20==0||count==worksheet.rowCount){
            await writefile(file)
        }
    }
    console.log('alldone')
}
excuteall()