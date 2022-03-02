const button1 = document.getElementById("button1");
let audio1 = new Audio();
audio1.src = "./foom_0.wav";
const audioContent = new window.AudioContext(); //创建并返回一个新的 AudioContext 对象。
console.log(audioContent);

button1.addEventListener("click", function () {
  audio1.play();
  audio1.addEventListener("playing", function () {
    console.log("Audio1 started playing!");
  });
  audio1.addEventListener("ended", function () {
    console.log("Audio1 ended");
  });
});

const button2 = document.getElementById("button2");
button2.addEventListener("click", playSound);
function playSound() {
  const oscillator = audioContent.createOscillator(); // 创建一个OscillatorNode，它是一个表示周期性波形的源。 它基本上产生一个不变的音调。
  oscillator.type = "sine"; // 一个字符串，决定 OscillatorNode 播放的声音的周期波形; 它的值可以是基础值中的一个或者用户使用 PeriodicWave。不同的波形可以产生不同的声调。 基础值有 "sine", "square", "sawtooth", "triangle" and "custom". 默认值是"sine"。
  oscillator.frequency.value = 440; // value in hertz ;振动的频率（单位为赫兹hertz）;默认值是 440 Hz (基本的中A音高)
  oscillator.connect(audioContent.destination);
  oscillator.start();
  setTimeout(function () {
    oscillator.stop();
  }, 1000);
}
