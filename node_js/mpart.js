let M = {
    v : 'v',
    f : function() {
        console.log(this.v);
    }
}

module.exports = M; // 모듈화 : 밖에서 mpart.js 모듈을 불러오면 M객체 사용가능