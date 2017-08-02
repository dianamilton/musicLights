var mic = require('mic');
var fs = require('fs');

var soundArray = [];
var sampleArray = [];
var newSampleArray = [];
var micInstance = mic({ 'rate': '16000', 'channels': '1', 'debug': true, 'exitOnSilence': 6, 'device': 'mic_channel1' });
var micInputStream = micInstance.getAudioStream();
var outputFileStream = fs.WriteStream('output.wav');

micInputStream.pipe(outputFileStream);

var chunkCounter = 0;

var dataCsv = fs.openSync('data.csv', 'w');

micInputStream.on('data', function(data) {
  var length = data.length;
  var index = 0;
  console.log('length: ' +length);
  while (index <= data.length/10-2) {
    var sample = data.readInt16LE(index);
    console.log(sample);
    fs.writeSync(dataCsv, sample +'\n');
    index++;
    sampleArray.push(sample);
    newSampleArray = sampleArray;
  }
  console.log('Received Input Stream of Size %d: %d', data.length, chunkCounter++);
  for (var i = 0; i < soundArray.length; i++) {
    soundArray.push(data);
  }
  console.log(newSampleArray);
  matrix.led('blue').render();
});

micInputStream.on('error', function(err) {
  console.log('Error in Input Stream: ' + err);
});

micInputStream.on('startComplete', function() {
  console.log('Got SIGNAL startComplete');
  setTimeout(function() {
    micInstance.pause();
  }, 5000);
});

function fourier( in_array ) {
  var len = in_array.length;
  var output = [];

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
  console.log(output);
}

function smaller( in_array ) {
  var index = 0;
  var size = 0;
  var sm = [];
  while (size < 768) {
    sm.push(in_array[index]);
    index++;
    size++;
  }
  if (size >= 768) {
    fourier(sm);
    size = 0;
    sm = [];
  }
  //512 or 1024 buffer size, 768
}

micInputStream.on('stopComplete', function() {
  console.log('Got SIGNAL stopComplete');
  matrix.led('red').render();
  console.log(newSampleArray);
  smaller(newSampleArray);
});

micInputStream.on('pauseComplete', function() {
  console.log('Got SIGNAL pauseComplete');
  setTimeout(function() {
    micInstance.resume();
  }, 5000);
});

micInputStream.on('resumeComplete', function() {
  console.log('Got SIGNAL resumeComplete');
  setTimeout(function() {
    micInstance.stop();
  }, 5000);
});


micInputStream.on('silence', function() {
  console.log('Got SIGNAL silence');
});

micInputStream.on('processExitComplete', function() {
  console.log('Got SIGNAL processExitComplete');
});

micInstance.start();
