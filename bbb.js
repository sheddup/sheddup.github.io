/*eslint-disable no-var*/ /*eslint-disable vars-on-top*/ /*eslint-disable no-shadow*/
var video = document.querySelector("video");
var ranges = ["0-1104898", "1104899-2209797", "2209798-3314696", "3314697-4419595", "4419596-5524494"];
var assetURL = "frag_bunny.mp4";
var mimeCodec = "video/mp4; codecs=\"avc1.42E01E, mp4a.40.2\"";
var mediaSource = new MediaSource();
var appendButton = document.getElementById("append");
var seekButton = document.getElementById("seek");

mediaSource.addEventListener("sourceopen", onSourceOpen.bind(this));
video.src = window.URL.createObjectURL(mediaSource);

async function onSourceOpen(e){
  console.log("onSourceOpen");
  var mediaSource = e.target;

  var sourceBuffer = mediaSource.addSourceBuffer(mimeCodec);
  sourceBuffer.mode = "sequence";
  sourceBuffer.addEventListener("updateend", updateEnd);

  // Append the initialization segment.
  var initSegment = await GetSegment();
  sourceBuffer.appendBuffer(initSegment);

  appendButton.onclick = appendHandler.bind(sourceBuffer);
  seekButton.onclick = seekAppendHandler.bind(sourceBuffer);
}

async function GetSegment(){
  console.log("GetSegment");
  var nextRange = ranges.shift();
  var response = await fetch(assetURL, { headers: { Range: "bytes=" + nextRange } });
  response = await response.arrayBuffer();
  return response;
}

async function appendHandler(){
  console.log("appendHandler");
  var sourceBuffer = this;
  if(!sourceBuffer.updating){
    var nextSegment = await GetSegment();
    sourceBuffer.appendBuffer(nextSegment);
  }
}

async function seekAppendHandler(){
  console.log("seekAppendHandler");
  var sourceBuffer = this;
  sourceBuffer.abort();
  var seekSegment = await fetch(assetURL, { headers: { Range: "bytes=2209798-3314696" } }); //seek to 25 seconds, range=2209798-3314696
  seekSegment = await seekSegment.arrayBuffer();
  sourceBuffer.appendBuffer(seekSegment);
  video.currentTime = 25;
}

function updateEnd(e){
  var sourceBuffer = e.target;
  if(ranges.length === 0){
    console.log("Ending MSE");
    mediaSource.endOfStream();
    mediaSource.removeEventListener("sourceopen", onSourceOpen);
    sourceBuffer.removeEventListener("updateend", appendHandler);
  }
}
