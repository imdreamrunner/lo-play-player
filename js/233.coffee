###
if (typeof File isnt "undefined") and not File::slice
  File::slice = File::webkitSlice  if File::webkitSlice
  File::slice = File::mozSlice  if File::mozSlice
###

sha1Stream = (input) ->
  blocksize = 512
  h = naked_sha1_head()
  i = 0
  while i < input.length
    len = Math.min(blocksize, input.length - i)
    block = input.substr(i, len)
    naked_sha1(str2binb(block), len * chrsz, h)
    i += blocksize
  return binb2hex(naked_sha1_tail(h))


processFile = (file) ->
  reader = new FileReader()

  #update precentage while file reading
  reader.onprogress = (evt) ->
    if evt.lengthComputable
      percentLoaded = Math.round((evt.loaded / evt.total) * 100)
      console.log evt.loaded
      console.log evt.total
      console.log percentLoaded
      # updateProgess percentLoaded  if percentLoaded <= 100

  step = 0
  step_name =
    0: "head"
    1: "body"
    2: "tail"
  #reading finish, do sha1 calcuate.
  reader.onloadend = (event) ->
    result = sha1Stream(event.target.result)
    console.log step_name[step] + ": " + result
    if step == 0
      mid = Math.floor( (file.size - block_size) / 2)
      reader.readAsBinaryString file.slice(mid, mid+block_size)
      step = 1
    else if step == 1
      reader.readAsBinaryString file.slice(file.size - block_size, file.size)
      step = 2
    ###
    url = URL.createObjectURL(file)
    player = document.getElementById("player")
    player.src = url
    player.playbackRate = 2
    player.play()
    ###
  block_size = 64 * 16 * 1024
  if file.size > block_size
    reader.readAsBinaryString file.slice(0, block_size)
  else
    step = 2
    reader.readAsBinaryString file.slice(0, block_size)

  # reader.readAsArrayBuffer(file)

$(document).ready ->
  $drop_here = $('#drop-here')

  onDragover = (e) ->
    e.preventDefault()
    e.stopPropagation()
    $drop_here.addClass('drag')

  $drop_here.on('dragover', onDragover)

  onDragend = (e) ->
    e.preventDefault()
    e.stopPropagation()
    $drop_here.removeClass('drag')

  $drop_here.on('dragend', onDragend)

  onDrop = (e) ->
    console.log 'here'
    $drop_here.removeClass('drag')
    e.preventDefault()
    e.stopPropagation()
    if not e.originalEvent.dataTransfer
      return
    file = e.originalEvent.dataTransfer.files[0];
    console.log file
    processFile(file)

  $drop_here.on('drop', onDrop)