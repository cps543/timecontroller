var radio = 200;
var fontSize = 12;
var separationLetters = 3;
var ratioRadioCircles = 0.75;
var arcStrokeWidth = 5;
var markerWidth = 10;
var months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
var days = ['MON','TUE','WED','THU','FRI','SAT','SUN'];
var hours = ['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24'];
var arrayArcs = [];

var circles = [months,days,hours];

$(document).ready(function(){  
    var diameter = radio*2;

    for (var i = 0; i < circles.length; i++) {
        var ratio = (1 - ratioRadioCircles)*i;

        var divNames = $('<div>', {'id': i + '-names', 'class' : "divNames"});
        $('.time-controller').append(divNames);

        var divLines = $('<div>', {'id': i + '-lines', 'class' : "divLines"});
        $('.time-controller').append(divLines);

        fillCircle(i, divNames, divLines);

        var divArcs = $('<div>', {'id': i + '-arcs', 'class' : "divArcs"});
        divArcs.css("left",fontSize + ratio*radio);
        divArcs.css("top",fontSize + ratio*radio);
        divArcs.click(function(event) {
            if(event.target.className != "divArcs" && event.target.className != "marker") {
                var iCircle = this.id.split("-")[0];

                var initialDegrees = getClickDegrees(event, $(this));

                createArc(iCircle, $(this), initialDegrees);
            }
        });

        var diameter = radio*(1 - (1 - ratioRadioCircles)*i)*2;
        divArcs.width(diameter);
        divArcs.height(diameter);

        $('.time-controller').append(divArcs);

        createArc(i, divArcs, 0);
    }

    $('#time-pair-container-month').css("left",radio + fontSize);
    $('#time-pair-container-month').css("margin-left",-radio);
    $('#time-pair-container-month').css("top",fontSize);

    $('#time-pair-container-day').css("left",radio*ratioRadioCircles + fontSize);
    $('#time-pair-container-day').css("margin-left",-radio*ratioRadioCircles);
    $('#time-pair-container-day').css("top",fontSize);

    $('.time-controller').css("font-size",fontSize);



    $('#dynamic-container')[0].style.width = diameter + 'px'; 
    $('#dynamic-container')[0].style.height = diameter + 'px';
    $('#dynamic-container')[0].style.marginBottom = -diameter + 'px';

    $('#innerCircle')[0].style.width = diameter + 'px';
    $('#innerCircle')[0].style.height = diameter + 'px';
    $('#innerCircle')[0].style.marginBottom = -diameter + 'px';

    

    //createPair();  

    document.onkeydown = KeyPress;
        
}); 

//Adds names and lines for circle iCircle
function fillCircle(iCircle, divNames, divLines) {
    var ratio = 1 - (1 - ratioRadioCircles)*iCircle;

    for (var i = 0; i < circles[iCircle].length; i++) {
        for (var j = 0; j < circles[iCircle][i].length; j++) {
            var id = i*3 + j;
            var span = $('<span>', {'class' : "names"}).text(circles[iCircle][i].charAt(j));
            span.height(radio*ratio + fontSize);
            span.css('margin-bottom', -radio*ratio - fontSize);
            span.width(fontSize);
            span.css('margin-right', -fontSize);
            divNames.append(span);
            var rot = 360/circles[iCircle].length*i + 180/circles[iCircle].length + separationLetters*((j - circles[iCircle][i].length/2) + 1/2);
            span.css('transform','rotate(' + rot + 'deg)');
        }
        var span = $('<span>', {'class': "lines"});
        var rot = 360/circles[iCircle].length*i;
        span.css('transform','rotate(' + rot + 'deg)');
        span.height(radio*ratio);
        span.css('margin-bottom', -radio*ratio);
        span.width(fontSize);
        span.css('margin-right', -fontSize);
        divLines.append(span);
    }

    divNames.css('top', radio*(1-ratio));
    divNames.css('left', radio + fontSize/2);
    divLines.css('top', fontSize + radio*(1-ratio));
    divLines.css('left', radio + fontSize/2);
}

//Creates an arc for circle iCircle
function createArc(iCircle, divArcs, initialDegrees) {
    var ratio = 1 - (1 - ratioRadioCircles)*iCircle;

    var diametro = radio*ratio*2;
    var arc = {
        startAngle: initialDegrees,
        endAngle: initialDegrees,
        iCircle: iCircle
    };
    arc.markerStart = $('<div>', { id: "marker_" + arrayArcs.length + "_start", class: "marker"});
    arc.markerEnd = $('<div>', { id: "marker_" + arrayArcs.length + "_end", class: "marker"});

    arc.path = document.createElementNS("http://www.w3.org/2000/svg","svg");
    arc.path.id = "arc_" + arrayArcs.length;
    arc.path.setAttributeNS(null, "class", "arc"); 
    arc.path.style.width = diametro + 'px';
    arc.path.style.height = diametro + 'px';
    var newpath = document.createElementNS("http://www.w3.org/2000/svg","path");  
        newpath.setAttributeNS(null, "stroke", "#446688"); 
        newpath.setAttributeNS(null, "stroke-width", arcStrokeWidth); 
        newpath.setAttributeNS(null, "fill", "none");
    arc.path.appendChild(newpath);

    divArcs.append([arc.markerStart[0], arc.markerEnd[0]]);
    divArcs.append(arc.path);
    arrayArcs.push(arc);

    initMarkers(arc, arrayArcs.length - 1, 0, divArcs, initialDegrees);

}

//Initialize markers (arc beginning and end)
function initMarkers(arc, index, initialDegree, divArcs, initialDegrees) {
    var markerStart = arc.markerStart;
    var markerEnd = arc.markerEnd;

    var ratio = 1 - (1 - ratioRadioCircles)*arc.iCircle;
    var radioCircle = radio*ratio;
    var rotate = 'rotate(' + initialDegrees + 'deg)';

    markerStart.css("left", radioCircle - markerWidth/2);
    markerStart.css("transform-origin",  markerWidth/2 + "px " + radioCircle + "px 0px");
    markerStart.css("width", markerWidth);
    markerStart.css("height", markerWidth);
    markerStart.css("margin-bottom", -markerWidth);
    markerStart.css("margin-right", -markerWidth);
    markerStart.css({'-moz-transform': rotate, 'transform' : rotate, '-webkit-transform': rotate, '-ms-transform': rotate});
    markerStart.on('mousedown', function(){
        $('body').on('mousemove', function(event){
            rotateMarkers($(arc.path), event.pageX, event.pageY, markerStart, 'start', arc, index);     
        });                 
    });

    markerEnd.css("left", radioCircle - markerWidth/2);
    markerEnd.css("transform-origin", markerWidth/2 + "px " + radioCircle + "px 0px");
    markerEnd.css("width", markerWidth);
    markerEnd.css("height", markerWidth);
    markerEnd.css("margin-bottom", -markerWidth);
    markerEnd.css("margin-right", -markerWidth);
    markerEnd.css({'-moz-transform': rotate, 'transform' : rotate, '-webkit-transform': rotate, '-ms-transform': rotate});
    markerEnd.on('mousedown', function(){
        $('body').on('mousemove', function(event){
            rotateMarkers($(arc.path), event.pageX, event.pageY, markerEnd, 'end', arc, index);    
        });                 
    });
}

//Rotates markers on mouse down
function rotateMarkers(offsetSelector, xCoordinate, yCoordinate, ending, startOrEnd, arc, index){
    var ratio = 1 - (1 - ratioRadioCircles)*arc.iCircle;
    var radioCircle = radio*ratio;

    var x = xCoordinate - offsetSelector.offset().left - offsetSelector.width()/2;
    var y = -1*(yCoordinate - offsetSelector.offset().top - offsetSelector.height()/2);
    var theta = Math.atan2(y,x)*(180/Math.PI);        

    var cssDegs = convertThetaToCssDegs(theta);
    var rotate = 'rotate(' +cssDegs + 'deg)';
    ending.css({'-moz-transform': rotate, 'transform' : rotate, '-webkit-transform': rotate, '-ms-transform': rotate});
    var radioP = radioCircle - arcStrokeWidth/2;
    if (startOrEnd === 'start') {
        arrayArcs[index].startAngle = cssDegs;
    }
    else {
        arrayArcs[index].endAngle = cssDegs;
    }
    arc.path.childNodes[0].setAttributeNS(null, "d", describeArc(radioCircle, radioCircle, radioP, arrayArcs[index].startAngle, arrayArcs[index].endAngle));  
    
    $('body').on('mouseup', function(event){
        $('body').unbind('mousemove')
    });
}

function convertThetaToCssDegs(theta){
    var cssDegs = 90 - theta;
    if (cssDegs < 0) {
        cssDegs += 360;
    }
    return cssDegs;
}

function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
    var angleInRadians = (angleInDegrees-90) * Math.PI / 180.0;

    return {
        x: centerX + (radius * Math.cos(angleInRadians)),
        y: centerY + (radius * Math.sin(angleInRadians))
    };
}

function describeArc(x, y, radius, startAngle, endAngle){

    var start = polarToCartesian(x, y, radius, endAngle);
    var end = polarToCartesian(x, y, radius, startAngle);

    if (startAngle > endAngle) {
        startAngle -= 360;
    }

    var arcSweep = endAngle - startAngle <= 180 ? "0" : "1";

    var d = [
        "M", start.x, start.y, 
        "A", radius, radius, 0, arcSweep, 0, end.x, end.y
    ].join(" ");

    return d;       
}

//Convert click position to degrees
function getClickDegrees(event, element) {
   var offsetSelector = element;
    var x = event.clientX - offsetSelector.offset().left - offsetSelector.width()/2;
    var y = -1*(event.clientY - offsetSelector.offset().top - offsetSelector.height()/2);
    var theta = Math.atan2(y,x)*(180/Math.PI);
    return convertThetaToCssDegs(theta);
}

//Listen to ctrl+z to remove last arc added
function KeyPress(e) {
    var evtobj = window.event? event : e;
    if(evtobj.keyCode == 90 && (evtobj.ctrlKey || evtobj.metaKey) && arrayArcs.length > circles.length){
        var pairToRemove = arrayArcs[arrayArcs.length - 1];
        pairToRemove.markerStart.remove();
        pairToRemove.markerEnd.remove();
        pairToRemove.path.remove();
        arrayArcs.pop();
    }
}

