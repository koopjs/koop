@land: lighten(#080,20%);
@line: #fff;

#point { 
  marker-fill: #2c3e50;
  marker-line-color: lighten(#2c3e50, 10%);
  marker-width:4;
  marker-line-width:1;
  marker-opacity:1;
  marker-allow-overlap:true;
}

#polygon {
  polygon-fill: #999;
  line-color: @line;
  line-width: 1;
}

#linestring {
  line-color: #2c3e50;
  line-width: 2;
}
