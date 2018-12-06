const video = document.querySelector("video");
const assetURL = "frag_copy.mp4";
const mimeCodec = "video/mp4; codecs=\"avc1.64001f, mp4a.40.2\"";
const mediaSource = new MediaSource();
const seekButton = document.getElementById("seek");

mediaSource.addEventListener("sourceopen", onSourceOpen);
video.src = window.URL.createObjectURL(mediaSource);

async function onSourceOpen(){
  console.log("onSourceOpen");
  
  const sourceBuffer = mediaSource.addSourceBuffer(mimeCodec);
  const initSegment = await GetSegment("0-2265771"); // Append the initialization segment & first media segment
  sourceBuffer.appendBuffer(initSegment);

  seekButton.onclick = seekAppendHandler.bind(sourceBuffer);
}

async function GetSegment(byteRange){
  console.log("GetSegment: bytes=" + byteRange);
  let response = await fetch(assetURL, { headers: { Range: "bytes=" + byteRange } });
  response = await response.arrayBuffer();
  return response;
}

function dumpBuffers(){
  let out = "";
  for(let i = 0; i < video.buffered.length; i++){
    out += "buffer: " + i + " start: " + video.buffered.start(i) + " end: " + video.buffered.end(i) + "\n";
  }
  console.log(out);
}

async function seekAppendHandler(){
  console.log("seekAppendHandler");
  const sourceBuffer = this;
  if(!sourceBuffer.updating){
    // Not sure exactly where 25 seconds, but this was the closest segment range
    // that you had here, which is 14400 / 1000 (14.4 seconds)
    const seekSegment = await GetSegment("4719375-8588652"); //seek to 25 seconds
    sourceBuffer.appendBuffer(seekSegment);
    sourceBuffer.addEventListener("updateend", () => {
      video.currentTime = 25;
      dumpBuffers(video);
    }, { once: true });
  }
}
