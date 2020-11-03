var rect = require('./rectangle');

function solveRect(l,b) {
    console.log("Solving for rectangle with l = " + l + "And b = "+b);
    if((l<=0) || (b<=0)){
        console.log("Rectangle dimension should be >= 0");
    }
    else{
        console.log("The area of the rectangle is "+ rect.area(l,b));
        console.log("The area of the rectangle is "+ rect.perimeter(l,b));
    }
}

solveRect(2,4);

