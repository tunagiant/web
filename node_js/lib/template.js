//refactoring
module.exports = {    // 함수들의 객체화
    HTML : function(title, list, body, control) {
        return `
        <!DOCTYPE html>
        <html>
        
        <head>
        <title>WEB3 - ${title}</title>
        <meta charset="utf-8">
        </head>
        
        <body>
        <h1><a href="/">WEB1</a></h1>
        ${list}
        ${control}
        ${body}
        </body>
        
        </html>
        `;
    },
    list : function (filelist) {
        let list = '<ul>';
        for (var i = 0; i < filelist.length; i++) {
            list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`
        }
        list = list + '</ul>';
        return list;
    }

}
