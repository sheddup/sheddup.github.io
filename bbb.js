var video = document.querySelector("video");
var assetURL = "frag_copy.mp4";
var mimeCodec = "video/mp4; codecs=\"avc1.64001f, mp4a.40.2\"";
var mediaSource = new MediaSource();
var seekButton = document.getElementById("seek");

mediaSource.addEventListener("sourceopen", onSourceOpen.bind(this));
video.src = window.URL.createObjectURL(mediaSource);

async function onSourceOpen(e){
  console.log("onSourceOpen");
  var sourceBuffer = mediaSource.addSourceBuffer(mimeCodec);
  var initSegment = await GetSegment(); // Append the initialization segment & first media segment
  sourceBuffer.appendBuffer(initSegment.slice(0, 2265772));
  seekButton.onclick = seekAppendHandler.bind(sourceBuffer);
}

async function GetSegment(){
  console.log("GetSegment");
  var response = await fetch(assetURL);
  response = await response.arrayBuffer();
  return response;
}

function dumpBuffers() {
    var out = "";
    for (var i = 0; i < video.buffered.length; i++) {
        out += "buffer: " + i + " start: " + video.buffered.start(i) + " end: " + video.buffered.end(i) + "\n";
    }
    console.log(out);
}

async function seekAppendHandler(){
  console.log("seekAppendHandler");
  var sourceBuffer = this;
  if(!sourceBuffer.updating){
    // Not sure exactly where 25 seconds, but this was the closest segment range
    // that you had here, which is 14400 / 1000 (14.4 seconds)
    var seekSegment = await fetch(assetURL); //seek to 25 seconds
    seekSegment = await seekSegment.arrayBuffer();
    sourceBuffer.appendBuffer(seekSegment.slice(4719375, 8588653)); // 2323092
    sourceBuffer.addEventListener("updateend", () => {
        video.currentTime = 25;
        dumpBuffers(video);
    }, { once: true});
  }
}
