const container = document.getElementById("container");
const canvas = document.getElementById("canvas1");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext("2d");

const audioContent = new window.AudioContext(); //创建并返回一个新的 AudioContext 对象。
console.log(audioContent);
const audio1 = document.getElementById("audio1");
let analyserL = audioContent.createAnalyser();
let analyserR = audioContent.createAnalyser();

audio1.addEventListener("playing", function () {
  console.log("Audio1 started playing!");
  var source = audioContent.createMediaElementSource(audio1);
  var splitter = audioContent.createChannelSplitter(2);
  source.connect(splitter);

  var biquadFilter = audioContent.createBiquadFilter();
  // 左声道连接analyser
  splitter.connect(biquadFilter, 0);
  biquadFilter.connect(analyserL, 0);
  // 右声道连接analyser
  splitter.connect(analyserR, 1);
  console.log(splitter);

  var merger = audioContent.createChannelMerger(2);
  console.log(merger);

  analyserL.connect(merger, 0, 0);
  analyserR.connect(merger, 0, 1);
  merger.connect(audioContent.destination);
  analyserL.fftSize = 64;
  analyserR.fftSize = 64;

  const bufferLengthL = analyserL.frequencyBinCount;
  const bufferLengthR = analyserR.frequencyBinCount;

  const dataArrayL = new Uint8Array(bufferLengthL);
  const dataArrayR = new Uint8Array(bufferLengthR);

  const barWidth = canvas.width / 2 / bufferLengthL;
  let barHeight;
  let x;

  function animate() {
    x = 0;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    analyserL.getByteFrequencyData(dataArrayL);
    analyserR.getByteFrequencyData(dataArrayR);
    drawVisualiser(bufferLengthL, x, barWidth, barHeight, dataArrayL);
    drawVisualiser(
      bufferLengthR,
      x - canvas.width / 2,
      barWidth,
      barHeight,
      dataArrayR
    );
    // console.log(dataArrayL, dataArrayR);
    requestAnimationFrame(animate);
  }
  animate();

  // Reduce the volume of the left channel only
  /* var gainNode = audioContent.createGain();
  gainNode.gain.setValueAtTime(0.5, audioContent.currentTime);
  splitter.connect(gainNode, 0);

  // Connect the splitter back to the second input of the merger: we
  // effectively swap the channels, here, reversing the stereo image.
  gainNode.connect(merger, 0, 1); */
  // splitter.connect(merger, 1, 1);
  // splitter.connect(merger, 1, 0);

  // var dest = audioContent.createMediaStreamDestination();

  // Because we have used a ChannelMergerNode, we now have a stereo
  // MediaStream we can use to pipe the Web Audio graph to WebRTC,
  // MediaRecorder, etc.
});
function drawVisualiser(bufferLength, x, barWidth, barHeight, dataArray) {
  for (let i = 0; i < bufferLength; i++) {
    barHeight = dataArray[i] * 2;
    ctx.fillStyle = "white";
    ctx.fillRect(
      canvas.width / 2 - x,
      canvas.height - barHeight - 30,
      barWidth,
      15
    );
    let red = (i * barHeight) / 20;
    let green = i * 4;
    let blue = barHeight / 2;
    ctx.fillStyle = `rgb(${red},${green}, ${blue})`;
    ctx.fillRect(
      canvas.width / 2 - x,
      canvas.height - barHeight,
      barWidth,
      barHeight
    );
    x += barWidth;
  }
}
