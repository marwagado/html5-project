
class tracks{                                    // class to allocate form inputs

    constructor (track1 , track2 , track3 , track4 ,
         track1Percentage , track2Percentage , track3Percentage , track4Percentage
         ,course1_color , course2_color , course3_color , course4_color){

        this.track1= track1;
        this.track2= track2;
        this.track3= track3;
        this.track4= track4;

        this.track1Percentage = track1Percentage;
        this.track2Percentage = track2Percentage;
        this.track3Percentage = track3Percentage;
        this.track4Percentage = track4Percentage;

        this.course1_color = course1_color;
        this.course2_color = course2_color;
        this.course3_color = course3_color;
        this.course4_color = course4_color;


    }
}   

var graph_selector=[];                                           // empty array to put the checked inputs in 
///var colors = ["rgb(255,133,74)", "rgb(255,128,128)", "rgb(155,0,155)", "rgb(0,0,71)"];

function setAttributes(el, attrs) {                             // set attributes function
    for(var key in attrs) {
      el.setAttribute(key, attrs[key]);
    }
 }

document.getElementById("draw").addEventListener("click" , (e) => {   // event on click draw button

    e.preventDefault();

    document.getElementById("graphs").innerHTML = "";             //clear divs
    document.getElementById("summary").innerHTML = "";

    
    var Track1 =  document.forms["myForm"]["track1"].value ;    
    var track1Percent = document.forms["myForm"]["track1Percent"].value;
    var course1_color = document.forms["myForm"]["course1-color"].value;
    
    var Track2 =  document.forms["myForm"]["track2"].value ;
    var track2Percent =document.forms["myForm"]["track2Percent"].value;  // allocate the values of input fields
    var course2_color = document.forms["myForm"]["course2-color"].value;

    
    var Track3 =  document.forms["myForm"]["track3"].value;
    var track3Percent = document.forms["myForm"]["track3Percent"].value;
    var course3_color = document.forms["myForm"]["course3-color"].value;

    
    var Track4 =  document.forms["myForm"]["track4"].value ;
    var track4Percent = document.forms["myForm"]["track4Percent"].value;
    var course4_color = document.forms["myForm"]["course4-color"].value;
    

                                                                        
                                                                       
    var track = new tracks( Track1 , Track2 , Track3 , Track4 , 
                          track1Percent , track2Percent , track3Percent , track4Percent
                          ,course1_color , course2_color ,course3_color ,course4_color);  //instance of the class 
    percentage = [track.track1Percentage , track.track2Percentage , track.track3Percentage , track.track4Percentage]; // the percentage to draw the graph 
    text = [track.track1 ,track.track2 , track.track3 , track.track4 ];   // courses name
    colors = [track.course1_color , track.course2_color ,track.course3_color , track.course4_color];

    var checkboxes = document.querySelectorAll('input[name="graph"]:checked');  // get the checked inputs 

    checkboxes.forEach((checkbox) => {
       graph_selector.push(checkbox.value);
    });

    if(graph_selector.includes("pie_chart")){
        pieGraph(percentage,"pie_chart");
    }

    if(graph_selector.includes("doughnut")){
        pieGraph(percentage , "doughnut");
    }

    if(graph_selector.includes("line_chart")){
        line_chartGraph(percentage , "line_chart");
    }

    if(graph_selector.includes("bar_chart")){
        line_chartGraph(percentage , "bar_chart");
    }

     
    summarySvg = document.createElementNS("http://www.w3.org/2000/svg", "svg"); //draw summary svg
    summarySvg.setAttribute("width", 250);
    summarySvg.setAttribute("height", 200);
    
    let cy = 0;

    for(let i = 0 ; i<4 ; i++){

    let circlePoint = document.createElementNS("http://www.w3.org/2000/svg" , "circle");
    setAttributes(circlePoint , {"cx" : "50" , "cy" : 50+cy , "r" : "5" , "stroke" : colors[i] , "stroke-width" : "2" ,"fill" : colors[i]})
    summarySvg.appendChild(circlePoint);
   

    var summarySvgText = document.createElementNS("http://www.w3.org/2000/svg", "text"); 
        setAttributes (summarySvgText ,{"x": 65, "y" : 57+cy });
        summarySvgText.textContent = (text[i] +"   "+percentage[i] +"%");
        summarySvg.appendChild(summarySvgText);

        cy = cy+20;
    }

    document.getElementById("summary").appendChild(summarySvg);


    })
        
function pieGraph(percent , gragh){

   var labels = percent; 
   for(let i = 0 ; i< percent.length ; i++){
       percent[i] = parseInt(percent[i]);
   }
    var data = percent;

function drawSegment(canvas, context, i) {    
    context.save();
    var centerX = Math.floor(canvas.width / 2);
    var centerY = Math.floor(canvas.height / 2);
    radius = Math.floor(canvas.width / 2);

    var startingAngle = degreesToRadians(sumTo(data, i));
    var arcSize = degreesToRadians((data[i]));
    var endingAngle = startingAngle + arcSize;

    context.beginPath();
    context.moveTo(centerX, centerY);
    context.arc(centerX, centerY, radius, 
                startingAngle, endingAngle, false);
    context.closePath();

    context.fillStyle = colors[i];
    context.fill();

    context.restore();

    drawSegmentLabel(canvas, context, i);
}

function degreesToRadians(degrees) {
    return (3.6*degrees * Math.PI)/180;
}
function sumTo(a, i) {
    var sum = 0;
    for (var j = 0; j < i; j++) {
      sum += a[j];
    }
    return sum;
}


function drawSegmentLabel(canvas, context, i) {
    context.save();
    var x = Math.floor(canvas.width / 2);
    var y = Math.floor(canvas.height / 2);
    var angle = degreesToRadians(sumTo(data, i));
 
    context.translate(x, y);
    context.rotate(angle);
    var dx = Math.floor(canvas.width * 0.5) - 30;
    var dy = Math.floor(canvas.height * 0.05);
 
    context.textAlign = "right";
    var fontSize = Math.floor(canvas.height / 25);
    context.font = fontSize + "pt Helvetica";
 
    context.fillText(labels[i], dx, dy);
 
    context.restore();
 }

 var canvas = document.createElement("canvas");
 canvas.setAttribute("width" , "300px");
 canvas.setAttribute("height" , "300px");
 document.getElementById("graphs").appendChild(canvas);

 var context = canvas.getContext("2d");
 for (var i = 0; i < data.length; i++) {
     drawSegment(canvas, context, i);
 }

if(gragh == "doughnut"){                               // if doughnut is checked
    context.beginPath();
    context.moveTo((canvas.width / 2), (canvas.height / 2));                          //draw the white circle
    context.arc((canvas.width / 2), (canvas.height / 2), 50, 
                0, 2*Math.PI, false);
    context.closePath();

    context.fillStyle ="white";
    context.fill();
 }
}

// draw line graph
function line_chartGraph(percent , graph){
   
    for(let i = 0 ; i< percent.length ; i++){
        percent[i] = parseInt(percent[i]);
    }
     var data = percent;                        // convert string to integer

     var point1 = (330 - (3 * data[0]));        // get the y position for each degree
     var point2 =  (330 - (3 * data[1]));
     var point3 =  (330 - (3 * data[2]));
     var point4 =  (330 - (3 * data[3]));


     var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg"); //draw svg
     setAttributes (svg ,{"width": 350 , "height" : 350});
     document.getElementById("graphs").appendChild(svg);

     var xGrid = document.createElementNS("http://www.w3.org/2000/svg", "g"); //group of x axis 
     setAttributes (xGrid ,{"class": "grid x-grid" , "id" : "xGrid"});
     svg.appendChild(xGrid);

     var xLine = document.createElementNS("http://www.w3.org/2000/svg", "line"); // draw xLine
     setAttributes (xLine ,{"x1": "30" , "x2" : "30" , "y1" : "5" , "y2" : "325"});
     xGrid.appendChild(xLine);

    
     var yGrid = document.createElementNS("http://www.w3.org/2000/svg", "g"); //group of y axis
     setAttributes (yGrid ,{"class": "grid x-grid" , "id" : "yGrid"});
     svg.appendChild(yGrid);

     var yLine = document.createElementNS("http://www.w3.org/2000/svg", "line"); //draw y line
     setAttributes (yLine ,{"x1": "30" , "x2" : "350" , "y1" : "325" , "y2" : "325"});
     yGrid.appendChild(yLine);

     var yTextGroup = document.createElementNS("http://www.w3.org/2000/svg", "g"); //group of text beside y axis
     setAttributes (yTextGroup ,{"class": "labels y-labels" });
     svg.appendChild(yTextGroup);

     var yaxistext = ["100" , "90" , "80" , "70" , "60" , "50" , "40" , "30" ,"20" , "10"];  //sorry doesn't work with me
     var yStep = 0;
     for(let j = 0 ; j<yaxistext ; j++ ){                                    // write text on x line
        var yText = document.createElementNS("http://www.w3.org/2000/svg", "text"); 
        setAttributes (yText ,{"x": "25" , "y" : 30+yStep });
        yText.textContent = yaxistext[j];
        yTextGroup.appendChild(yText);
        yStep = yStep+30;
        console.log(yStep)

     }

     var xTextGroup = document.createElementNS("http://www.w3.org/2000/svg", "g"); //group of text beside x axis
     setAttributes (xTextGroup ,{"class": "labels x-labels" });
     svg.appendChild(xTextGroup);

     var xStep = 0;
     for(let i = 0 ; i<text.length ; i++ ){                            // write text on x line

        var xText = document.createElementNS("http://www.w3.org/2000/svg", "text"); 
        setAttributes (xText ,{"x": 75+xStep , "y" : "340" });
        xText.textContent = (text[i]);
        xTextGroup.appendChild(xText);
        xStep = xStep+75;

     }

   
    if(graph == "line_chart"){
   
        var polyline = document.createElementNS('http://www.w3.org/2000/svg','polyline');     // create polyline element
        polyline.setAttribute("points" , `75,${point1} 150,${point2} 225,${point3} 300,${point4}`);
        polyline.style.fill = "none";
        polyline.style.stroke = "black";                   // style for xline
        polyline.style.strokeWidth  = "2";  
        svg.appendChild(polyline);
    }

    if(graph == "bar_chart"){

        var rectangleGroup = document.createElementNS("http://www.w3.org/2000/svg", "g"); //group of rectangles
        svg.appendChild(rectangleGroup);

        let i = 0;
        var points =[point1 , point2 , point3 ,point4];
        var x = 0;

        for(let point = 0 ; point < 4 ; point++){                               //draw rectangles

            var rectangle = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            setAttributes(rectangle ,{"x" : 65+x , 
                                      "y" : points[point], 
                                      "height": 325-points[point] , 
                                      "width": "30px" 
                                    ,"style": `fill:${colors[i]};stroke-width:3;stroke:${colors[i]}`
                        })
            i++;
            x = x+75;
            rectangleGroup.appendChild(rectangle)

        }   
    }
}


// draw bar function

