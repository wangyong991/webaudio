const container = document.getElementById("container");
const canvas = document.getElementById("canvas1");
const file = document.getElementById("fileupload");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext("2d");
let audioSource;
let analyser;

container.addEventListener("click", function () {
  // let audio1 = new Audio();
  let audio1 = document.getElementById("audio1");
  audio1.src = "./foom_0.wav";
  const audioContent = new AudioContext(); //创建并返回一个新的 AudioContext 对象。

  audio1.play();
  audioSource = audioContent.createMediaElementSource(audio1);
  analyser = audioContent.createAnalyser();
  audioSource.connect(analyser);
  analyser.connect(audioContent.destination);
  analyser.fftSize = 128;
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  const barWidth = canvas.width / 2 / bufferLength;
  let barHeight;
  let x;

  function animate() {
    x = 0;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    analyser.getByteFrequencyData(dataArray);
    drawVisualiser(bufferLength, x, barWidth, barHeight, dataArray);
    requestAnimationFrame(animate);
  }
  animate();
});

file.addEventListener("change", function () {
  console.log(this.files);
  const files = this.files;
  const audio1 = document.getElementById("audio1");
  audio1.src = URL.createObjectURL(files[0]);

  const audioContent = new AudioContext(); //创建并返回一个新的 AudioContext 对象。

  audio1.play();
  audioSource = audioContent.createMediaElementSource(audio1);
  analyser = audioContent.createAnalyser();
  audioSource.connect(analyser);
  analyser.connect(audioContent.destination);
  analyser.fftSize = 256;
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  const barWidth = 5;
  let barHeight;
  let x;

  function animate() {
    x = 0;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    analyser.getByteFrequencyData(dataArray);
    drawVisualiser(bufferLength, x, barWidth, barHeight, dataArray);
    requestAnimationFrame(animate);
  }
  animate();
});

function drawVisualiser(bufferLength, x, barWidth, barHeight, dataArray) {
  /* for (let i = 0; i < bufferLength; i++) {
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
  } */
  for (let i = 0; i < bufferLength; i++) {
    barHeight = dataArray[i] * 2;
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((i * (Math.PI * 4)) / bufferLength);
    const hue = i * 2;
    ctx.fillStyle = `hsl(${hue},100%, 50%)`;
    ctx.fillRect(0, 0, barWidth, barHeight);
    x += barWidth;
    ctx.restore();
  }
}
