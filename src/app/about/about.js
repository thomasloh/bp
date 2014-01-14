"use strict";

var t = require('./about.tpl.html');

var a = {
  b: 3,
  c: 5
};

function test(msg = "hi") {
  console.log(msg);
}

let multiply = x => x * x;

let identity = x => x;

let key_maker = x => ({'key': x});

let evens = [2, 4, 6, 8];
var odds = evens.map(v => v + 1);

const obj = {
  method: function() {
    return () => this;
  }
};

let something = {
  method: obj.method()
};

class Vehicle {

  constructor(brand, model) {
    this.brand = brand;
    this.model = model;
    this._mileage = 0;
  }

  drive() {
    console.log("Driving");
  }

  get isInGoodShape() {
    return this.mileage < 20000;
  }

  set mileage(value) {
    this._mileage = value * 1000;
  }

  get mileage() {
    return this._mileage;
  }

}

class Tank extends Vehicle {

  drive() {
    super.drive();
  }

}

module.exports = function () {
  console.log(identity(1));
  console.log(multiply(2));
  console.log(key_maker('value'));
  console.log(odds);
  console.assert(obj.method()() === obj);
  console.assert(something.method() === obj);

  let gti = new Vehicle('Volkswagen', 'GTI');

  console.log(gti.brand);
  console.log(gti.model);

  gti.drive();

  console.log(gti.isInGoodShape);

  gti.mileage = 2;

  console.log(gti.mileage);

  var [a, [b], c, [d, [e]]] = [1, [2], 3, [4, [5]]];

  console.log(a);
  console.log(b);
  console.log(c);
  console.log(d);
  console.log(e);

  var x = 2;

  function test_let() {

    let x = 1;

  }

  test_let();
  console.log(x);

  var o = [1, 2, 3];

  // rest

  function testingRest(category, ...items) {
    console.log(category);
    console.log(items);
  }
  testingRest('fruits', 'apple', 'banana', 'orange');

  // spreads

  var arr = [1, 2, 3];
  var stuff = [4, 5, 6];

  arr.push(...stuff);
  console.log(arr);

  // generators

  function* foo(x) {

    yield 2;

    yield 4;

    yield 7;

  }

  var f = foo(5);
  var s = f.next();
  console.log(s);
  s = f.next();
  console.log(s);
  s = f.next();
  console.log(s);
  // f.next();


  console.log("THIS IS AWESOME!");
};
