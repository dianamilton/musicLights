function fourier( in_array ) {
 var len = in_array.length;
 var output = new Array();

 for( var k=0; k < len; k++ ) {
   var real = 0;
   var imag = 0;
   for( var n=0; n < len; n++ ) {
     real += in_array[n]*Math.cos(2*Math.PI*k*n/len);
     imag += in_array[n]*Math.sin(-2*Math.PI*k*n/len);
   }
   real = 2/len * real;
   imag = - 2/len * imag;
   output.push( [ real, imag ] );
 }
 return output;
}
