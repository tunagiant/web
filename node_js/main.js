let http = require('http'); // require(id)  id || ./path || allpath   모듈을 불러옴
let fs = require('fs');
let url = require('url');
let qs = require('querystring');
let template = require('./lib/template.js');
let path = require('path');
let sanitizeHtml = require('sanitize-html');    // 정보보호(script악성코드 걸러줌)

// request : client->server   response : server->client
let app = http.createServer(function (request, response) {  // 서버생성
    let _url = request.url;
    // parse : url문자열을 url객체로 가져옴     format, resolve : 반대기능
    // true : 문자열->객체  false : 객체->문자열    query : ?뒷부분
    let queryData = url.parse(_url, true).query;
    let pathname = url.parse(_url, true).pathname; // pathname : path에서 querydata(?부터시작하는것) 제외한부분
    let title = queryData.id;

    if (pathname === '/') {
        if (queryData.id === undefined) { // queryData가 없음 -> root값(home)
            fs.readdir('./data', function (err, filelist) { // 파일목록을 가져오고 그 작업이 끝나면 function을 호출
                title = 'Welcome';
                let description = "Hello, Node.js";

                let list = template.list(filelist);
                let html = template.HTML(title, list,
                    `<h2>${title}</h2><p>${description}</p>`,
                    `<a href="/create">create</a>`
                );
                response.writeHead(200);
                response.end(html);
                /* let list = templateList(filelist);
                let template = templateHTML(title, list,
                    `<h2>${title}</h2><p>${description}</p>`,
                    `<a href="/create">create</a>`
                );
                response.writeHead(200);
                response.end(template); */


            });
        } else {        // home 아닐때
            fs.readdir('./data', function (err, filelist) {
                let filteredId = path.parse(queryData.id).base;     // 경로보호
                fs.readFile(`data/${filteredId}`, 'utf-8', function (err, description) {
                    title = queryData.id;
                    
                    let sanitizedTitle = sanitizeHtml(title);
                    let sanitizedDescription = sanitizeHtml(description, {  // h1태그는 허용한단의미
                        allowedTags:['h1']
                    });
                    let list = template.list(filelist);
                    // delete는 페이지변환이 되면 안되기 때문에 <a>사용X form으로 구현함
                    let html = template.HTML(title, list,
                        `<h2>${sanitizedTitle}</h2><p>${sanitizedDescription}</p>`,
                        `   <a href="/create">create</a>
                            <a href="/update?id=${sanitizedTitle}">update</a>
                            <form action="delete_process" method="POST" onsubmit="">
                            <input type="hidden" name="id" value="${sanitizedTitle}">
                            <input type="submit" value="delete">
                            </form>`
                    );

                    /*
                    let list = templateList(filelist);
                    // delete는 페이지변환이 되면 안되기 때문에 <a>사용X form으로 구현함
                    var template = templateHTML(title, list,
                        `<h2>${title}</h2><p>${description}</p>`,
                        `   <a href="/create">create</a>
                            <a href="/update?id=${title}">update</a>
                            <form action="delete_process" method="POST" onsubmit="">
                            <input type="hidden" name="id" value="${title}">
                            <input type="submit" value="delete">
                            </form>`
                    ); */
                    response.writeHead(200);
                    response.end(html);
                });
            });
        }
    } else if (pathname === '/create') {
        fs.readdir('./data', function (err, filelist) {
            title = 'WEB - create';

            let list = template.list(filelist);
            let html = template.HTML(title, list, `
            
<form action="/create_process" method="POST">
<p><input type="text" name="title" placeholder="title"></p>
<p><textarea name="description" id="" cols="30" rows="10" placeholder="description"></textarea></p>
<p><input type="submit"></p>

</form>
            `, '');
            response.writeHead(200);
            response.end(html);
        });

    } else if (pathname === '/create_process') {
        let body = '';
        request.on('data', function (data) {     // 너무 큰 데이터 과부하 되는것 방지. 조각조각내서 더하는식으로
            body += data;
            if (body.length > 1e6) {
                request.connection.destroy();
            }
        });
        request.on('end', function () {      // 더이상 들어올 정보가 없을때(정보수신이 끝났다고 판단)
            let post = qs.parse(body);
            title = post.title;
            let description = post.description;
            fs.writeFile(`data/${title}`, description, 'utf-8', function (err) { // 파일생성
                response.writeHead(302, { Location: `/?id=${title}` });   // 302 : 리다이랙션
                response.end();
            })
        });

    } else if (pathname === '/update') {
        fs.readdir('./data', function (err, filelist) {
            let filteredId = path.parse(queryData.id).base;
            fs.readFile(`data/${filteredId}`, 'utf-8', function (err, description) {
                title = queryData.id;

                let list = template.list(filelist);
                /* hidden 넣는 이유 : 사용자가 제목 수정할 시, (ex CSS->CSS3) CSS3이라고 파일이 생기진않음
                따라서 기존의 CSS라는 이름으로 식별이 가능하면서, 제목이 CSS3으로 변하는 효과(분리해서 전송)
                뒤에서 id값(기존값) title값(변경값) 처리하는 조건문있음 */
                let html = template.HTML(title, list, `
                <form action="/update_process" method="POST">
                <input type="hidden" name="id" value="${title}">
                <p><input type="text" name="title" placeholder="title" value="${title}"></p>
                <p><textarea name="description" cols="30" rows="10" placeholder="description">
                ${description}</textarea></p>
                <p><input type="submit"></p>
                </form>
                `,

                    `<h2>${title}</h2><p>${description}</p>`, `
                    <a href="/create">create</a> <a href="/update?id=${title}">update</a>`
                );
                response.writeHead(200);
                response.end(html);
            });
        });

    } else if (pathname === '/update_process') {
        let body = '';
        request.on('data', function (data) {     // 너무 큰 데이터 과부하 되는것 방지. 조각조각내서 더하는식으로
            body += data;
            if (body.length > 1e6) {
                request.connection.destroy();
            }
        });
        request.on('end', function () {      // 더이상 들어올 정보가 없을때(정보수신이 끝났다고 판단)
            let post = qs.parse(body);
            var id = post.id;
            title = post.title;
            let description = post.description;
            fs.rename(`data/${id}`, `data/${title}`, function (err) {    // 제목수정
                fs.writeFile(`data/${title}`, description, 'utf-8', function (err) {    // 내용수정
                    response.writeHead(302, { Location: `/?id=${title}` });
                    response.end();
                })
            })
        });
    } else if (pathname === '/delete_process') {
        let body = '';
        request.on('data', function (data) {
            body += data;
            if (body.length > 1e6) {
                request.connection.destroy();
            }
        });
        request.on('end', function () {
            let post = qs.parse(body);
            let id = post.id;
            let filteredId = path.parse(id).base;
            fs.unlink(`data/${filteredId}`, function(err) {     // 삭제
            response.writeHead(302, { Location: `/` }); // 홈으로 돌아감
            response.end();
            })
        });
    } else {
        response.writeHead(404);
        response.end('Not found');
    }


});
app.listen(4000);   // http.Server.listen : 서버구동