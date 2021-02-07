let array1 = ['one', 'two'];
let array2 = ['three', 'four'];

const combined = [...array1, ...array2];
// let combined = [array1[0], array1[1], array2[0], array2[1]];

combined = array1.concat(array2);
combined = [].concat(array1, array2);


// let first = array1[0];
// let seond = array1[1];
// let three = array1[2] || 'empty'; // || : 추출할 요소가 없을 때 기본값 설정
const [first, second, three = 'empty', ...others] = array1; // first = 'one', second = 'two', three = 'empty', others = []


function func(...args) { //함수인자배열을 변수 args 에 할당
    let [first, ...others] = args;
}
// function func() {
//     let args = Array.prototype.slice.call(this, arguments); // 유사배열을 배열로 변환
//     let first = args[0];
//     let others = args.slice(1, args.length);
// }