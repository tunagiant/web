function a() {
    console.log('A');
}
a();

function slowfunc(callback) {
    callback();
}

slowfunc(a);