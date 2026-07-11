//average of marks
/*let marks =[10,20,30,40,50];
let sum=0;
for(let i = 0;i<marks.length;i++){
    console.log("Marks:"+ marks[i]);
    sum = sum+marks[i];
    
}
let average = sum/marks.length;
console.log("Average Marks:" + average);*/

//discount price
/*let price=[200,400,300,500,600]
let discount = 0.1
for(let i=0;i<price.length;i++){
    console.log("Prices before discount:"+price[i]);
    discountPrice=price[i]*discount;
    price[i]=price[i]-discountPrice;
}
console.log("Discount prices:"+ price);*/

//array methods
/* let companies=["Microsoft","siemens","Google","Netflix"];
console.log(companies.shift());
companies.push("Amazon");
console.log(companies);*/

// Arrow Functions
// const sum=(a,b) => { 
//     console.log(a+b)
// }
// sum(3,2);

// function vowels(str){
//     let val=0;
//     console.log("inside "+ str);
//     let strVal = String(str);
//     vowelArray = ['a','e','i','o','u'];
//     for(let i of strVal){
//         for(let x of vowelArray ){            
//             if(x == i){                
//                 val = val+1;

//             }
//         }
//     }
//     console.log(val);
// }

// vowels("aeiouaeiuu");

//forEach Loop
// let num = [1,2,3,4,5];
// let newNum=num.map((num)=>{
//     return num*num;
// })
// num.forEach((num)=>{
//         console.log("Square of numbers:"+num*num);
        
// })

// let name = prompt("what is your name ?"," ");
// let age = prompt(" what is your age ?"," ");
// console.log(name,age);

// window.alert("No Internet");
//document.write("<P> Hi Aishu , How are you</P>");

//Function
function printNames() {
    //document.writeln("Number of names Passed:1 " + arguments.length + "<br />");
    window.document.writeln("Names are:<br/>");
    for(let i=0;i<arguments.length;i++)
        document.write(arguments[i],"<br />");       
    
     document.write("<br/");
}

printNames("Aishu");
printNames("Aishu","Soundarya");
printNames("Veena","Aishu","Sound");