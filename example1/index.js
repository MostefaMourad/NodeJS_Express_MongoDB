var rect = require('./rectangle');

function solveRect(l,b) {
    console.log("Solving for rectangle with l = " + l + "And b = "+b);
    rect(l,b,(err,rectangle)=> {
        if(err){
            console.log("ERROR : ",err.message)
        }else{
            console.log("The Area of the rect ("+l+","+b+") = "+rectangle.area());
            console.log("The Perimeter of the rect ("+l+","+b+") = "+rectangle.perimeter());
        }
    });
    console.log("This statement was after the call to rect()");
}

solveRect(2,4);
solveRect(3,5);
solveRect(0,5);
solveRect(-3,5);

