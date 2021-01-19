let http = require('http');   // require(id)  id || ./path || allpath   모듈을 불러옴
let fs = require('fs');
let url = require('url');

// request : client->server   response : server->client
let app = http.createServer(function (request, response) {
    let _url = request.url;
    // parse : url문자열을 url객체로 가져옴     format, resolve : 반대기능
    // true : 문자열->객체  false : 객체->문자열    query : ?뒷부분
    let queryData = url.parse(_url, true).query;
    let pathname = url.parse(_url, true).pathname;  // pathname : path에서 querydata 제외한부분
    let title = queryData.id;
    /* let list = `<Ol>
    <li><a href="/?id=HTML">기술소개</a></li>
    <li><a href="/?id=CSS">기본문법</a></li>
    <li><a href="/?id=JS">하이퍼텍스트와 속성</a></li>
    </Ol>
    ` */

    if (pathname === '/') {
        fs.readdir('./data', function (err, filelist) {   // 파일목록을 가져오고 그 작업이 끝나면 function을 호출

            fs.readFile(`data/${queryData.id}`, 'utf-8', function (err, data) {

                title = queryData.id;
                if (queryData.id === undefined) {    // queryData가 없음 -> root값
                    title = 'Welcome';
                    data = "Hello, Node.js";
                }
                let list = '<ul>';
                for (var i = 0; i < filelist.length; i++) {
                    list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`
                }
                list = list + '</ul>';
                //`: 1옆에있는 억음부호 : 개행처리가능
                var template = `
<!DOCTYPE html>
<html>

<head>
<title>WEB1 - ${title}</title>
<meta charset="utf-8">
</head>

<body>
<h1><a href="/">WEB1</a></h1>
${list}

<h2>${title}</h2>
<p>${data}</p>
</body>

</html>
`;
                response.writeHead(200);
                response.end(template);
            });
        })

    } else {
        response.writeHead(404);
        response.end('Not found');
    }


});
app.listen(3000);
// repeat