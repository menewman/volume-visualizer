(function() {
  'use strict';

  var VolumeProcessorFactory = function (context) {
    var processor = context.createScriptProcessor();
    processor.connect(context.destination);

    processor.volume = 0;
    processor.averaging = 0.95;

    processor.onaudioprocess = function (event) {
      var buffer = event.inputBuffer.getChannelData(0);
      var sum = 0;
      for (var i = 0; i < buffer.length; i++) {
        var x = buffer[i];
        sum += (x * x);
      }
      var rootMeanSquared =  Math.sqrt(sum / buffer.length);
      this.volume = Math.max(rootMeanSquared, this.volume * this.averaging);
    }

    processor.shutdown = function () {
      this.disconnect();
      this.onaudioprocess = null;
    };

    return processor;
  };

  var constraints = { audio: true };
  navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
    var audioTracks = stream.getAudioTracks();
    console.log('Using audio device: ' + audioTracks[0].label);

    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    var context = new window.AudioContext();

    var source = context.createMediaStreamSource(stream);
    var volumeProcessor = VolumeProcessorFactory(context);
    source.connect(volumeProcessor);

    var fps = 10;
    var timeout = 1000 / fps;
    var heading = document.getElementById('heading');
    var canvas = document.getElementById('canvas');
    function animate() {
      setTimeout(function () {
        var lum = volumeProcessor.volume * 360;
        heading.style.color = 'hsl(116, 43%, ' + lum + '%)';

        var shadowSize = volumeProcessor.volume * 30;
        canvas.style['box-shadow'] = '0 0 0 ' + shadowSize + 'px #447044';

        var ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#0AC92D";
        var barHeight = Math.min(volumeProcessor.volume * 360, canvas.height);
        ctx.fillRect(0, canvas.height - barHeight, canvas.width, canvas.height);
        requestAnimationFrame(animate);
      }, timeout);
    }
    animate();
  });
})();
