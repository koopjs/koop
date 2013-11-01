@land: lighten(#080,20%);
@line: #1abc9c;
@blue: #2c3e50;

#point { 
  marker-fill: @blue;
  marker-line-color: lighten(@blue, 30%);
  marker-width:4;
  marker-line-width:1;
  marker-opacity:1;
  marker-allow-overlap:true;
}

#polygon {
  polygon-fill: #16a085;
  line-color: @line;
  line-width: 1;
}

#linestring {
  line-color: @line;
  line-width: 2;
}
