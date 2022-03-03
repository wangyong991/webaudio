const container = document.getElementById("container");
const canvas = document.getElementById("canvas1");
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
  analyser.fftSize = 64;
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  const barWidth = canvas.width / bufferLength;
  let barHeight;
  let x;

  function animate() {
    x = 0;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    analyser.getByteFrequencyData(dataArray);
    for (let i = 0; i < bufferLength; i++) {
      if (canvas.height - dataArray[i] < 0) {
        console.log(canvas.height - dataArray[i]);
      }
      barHeight = dataArray[i];
      ctx.fillStyle = "white";
      ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
      x += barWidth;
    }
    requestAnimationFrame(animate);
  }
  animate();
});
