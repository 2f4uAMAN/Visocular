let obj = { a: 1, b: 2 };

let lauda = function (obj) {
  console.log('THIS IS LAUDA');
};
let another = function (obj) {
  console.log('My name is Naivedya Khare');
};
lauda.prototype.constructor = another;
let anime = new lauda(obj);
console.log('THIS HAPPENED FIRST');
