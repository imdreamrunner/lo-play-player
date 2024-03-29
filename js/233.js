// Generated by CoffeeScript 1.6.3
/*
if (typeof File isnt "undefined") and not File::slice
  File::slice = File::webkitSlice  if File::webkitSlice
  File::slice = File::mozSlice  if File::mozSlice
*/


(function() {
  var processFile, sha1Stream;

  sha1Stream = function(input) {
    var block, blocksize, h, i, len;
    blocksize = 512;
    h = naked_sha1_head();
    i = 0;
    while (i < input.length) {
      len = Math.min(blocksize, input.length - i);
      block = input.substr(i, len);
      naked_sha1(str2binb(block), len * chrsz, h);
      i += blocksize;
    }
    return binb2hex(naked_sha1_tail(h));
  };

  processFile = function(file) {
    var block_size, reader, step, step_name;
    reader = new FileReader();
    reader.onprogress = function(evt) {
      var percentLoaded;
      if (evt.lengthComputable) {
        percentLoaded = Math.round((evt.loaded / evt.total) * 100);
        console.log(evt.loaded);
        console.log(evt.total);
        return console.log(percentLoaded);
      }
    };
    step = 0;
    step_name = {
      0: "head",
      1: "body",
      2: "tail"
    };
    reader.onloadend = function(event) {
      var mid, result;
      result = sha1Stream(event.target.result);
      console.log(step_name[step] + ": " + result);
      if (step === 0) {
        mid = Math.floor((file.size - block_size) / 2);
        reader.readAsBinaryString(file.slice(mid, mid + block_size));
        return step = 1;
      } else if (step === 1) {
        reader.readAsBinaryString(file.slice(file.size - block_size, file.size));
        return step = 2;
      }
      /*
      url = URL.createObjectURL(file)
      player = document.getElementById("player")
      player.src = url
      player.playbackRate = 2
      player.play()
      */

    };
    block_size = 64 * 16 * 1024;
    if (file.size > block_size) {
      return reader.readAsBinaryString(file.slice(0, block_size));
    } else {
      step = 2;
      return reader.readAsBinaryString(file.slice(0, block_size));
    }
  };

  $(document).ready(function() {
    var $drop_here, onDragend, onDragover, onDrop;
    $drop_here = $('#drop-here');
    onDragover = function(e) {
      e.preventDefault();
      e.stopPropagation();
      return $drop_here.addClass('drag');
    };
    $drop_here.on('dragover', onDragover);
    onDragend = function(e) {
      e.preventDefault();
      e.stopPropagation();
      return $drop_here.removeClass('drag');
    };
    $drop_here.on('dragend', onDragend);
    onDrop = function(e) {
      var file;
      console.log('here');
      $drop_here.removeClass('drag');
      e.preventDefault();
      e.stopPropagation();
      if (!e.originalEvent.dataTransfer) {
        return;
      }
      file = e.originalEvent.dataTransfer.files[0];
      console.log(file);
      return processFile(file);
    };
    return $drop_here.on('drop', onDrop);
  });

}).call(this);

/*
//@ sourceMappingURL=233.map
*/
