var readexcel = require('./readexcel.js');
var data = readexcel.read('url.xlsx')
var cheerio = require('cheerio');
var superagent = require('superagent');
var async = require('async');
var fs=require('fs')
var cookies = 'login-token=6c7954db-b968-4350-b995-641e489d529d%3a52c8b87a-dd99-431d-8c08-90289d38bde4_11300e64423c1acc8c55aa9e4a5ee947%3acrx.default';
var urls = data.urls
console.log(urls)
// var browserMsg = {
//     "User-Agent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.101 Safari/537.36",
//     'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
// };

// var fetchP = function (product) {
//     return new Promise(function (resolve, reject) {
        
//         superagent.get(product.url).set({ Cookie: cookies }).set(browserMsg).redirects(0).end(function(err, res) {
//             // if(err){console.log(err)}
//             if(res){
//                 if(res.statusCode == '301' || res.statusCode == '302'){
//                     // product.status = 'yes'
//                     // product.redirect = res.header.location
//                 }
//                 product.globalCategory = res.body.globalcategory || ''
//                 console.log(product.globalCategory)
//             }
//             resolve()
//         })
//     })
// }
// async.mapLimit(urls, 1, function (url, callback) {
//     var product = {
//         url:'',
//         productpath:'',
//         globalCategory:''
//     }
//     url = url.replace('.html', '')        
//     url += '/jcr:content.2.json'
//     product.url = url;
//     console.log(product.url)
    
//     Promise.all([fetchP(product)]).then((result) => {
//         callback(null, product)
//     })

// }, function (err, result) {
//     var Excel = require('exceljs');
//     var workbook = new Excel.Workbook();
//     var ws1 = workbook.addWorksheet('result');
//     ws1.addRow(['globalCategory'])
//     for(var i = 0;i <result.length;i++){
//         ws1.addRow([result[i].globalCategory])
//     }
//     workbook.xlsx.writeFile('./result/result.xlsx')
//     .then(function(){
//         console.log('生成 xlsx');
//     });
// })