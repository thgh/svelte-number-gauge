<script context="module">
  function interpolate(start, end, val) {
    return parseInt((end - start) * Math.min(1, Math.max(0, val)) + start)
  }
</script><script>
  export let value = 0
  export let arrows = ''
  export let thresholds = '50,70'
  export let colors = '#e8523b,#397d9b,#80b62e'

  let color
  let rotate
  let degrees

  $: {
    const levels = String(thresholds).split(',')
    const level = levels.indexOf(levels.find(a => value < parseInt(a, 10)))
    const colorArray = String(colors).split(',')
    color = colorArray[level] || colorArray[colorArray.length - 1]
  }

  $: rotate = (100 - value) * 1.8

  $: degrees = arrows
    ? String(arrows)
        .split(',')
        .map(a => parseInt(a) * 1.8)
        .filter(a => a > -1)
    : []
</script>

<div class="gauge">
  {#each degrees as degree}
  <div class="gauge-abs" style="transform:rotate({degree}deg)">
    <div class="gauge-max"></div>
  </div>
  {/each}
  <div class="gauge-overflow">
    <div class="gauge-fill gauge-bg"></div>
    <div
      class="gauge-fill"
      style="transform:rotate(-{rotate}deg);box-shadow: inset 0 0 0 1em {color};"
    ></div>
    <div class="gauge-white"></div>
    <div class="gauge-value">{value}</div>
  </div>
</div>

<style>
  .gauge {
    position: relative;
    width: 4em;
    height: 2em;
    box-sizing: border-box;
  }
  .gauge-fill {
    position: absolute;
    z-index: 2;
    width: 100%;
    height: 100%;
    border-radius: 2em 2em 0 0;
    transition: transform 0.2s;
    transform-origin: 50% 100%;
  }
  .gauge-bg {
    z-index: 1;
    box-shadow: inset 0 0 0 1em #ccc;
  }
  .gauge-max {
    position: absolute;
    z-index: 2;
    left: -6px;
    top: -6px;
    width: 6px;
    height: 0;
    border-top: 6px solid transparent;
    border-bottom: 6px solid transparent;
    border-left: 6px solid #000;
  }
  .gauge-overflow {
    position: absolute;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  .gauge-abs {
    position: absolute;
    z-index: 0;
    background: red;
    width: 100%;
    height: 0;
    border-radius: 2em 2em 0 0;
    transition: transform 0.2s;
    left: 0%;
    top: 100%;
  }
  .gauge-value {
    position: absolute;
    z-index: 4;
    bottom: 0;
    left: 0;
    right: 0;
    text-align: center;
    font-weight: bold;
    line-height: 1em;
  }
  .gauge-white {
    position: absolute;
    z-index: 3;
    top: 25%;
    left: 12.5%;
    width: 75%;
    height: 150%;
    border-radius: 100%;
    background: white;
  }
</style>
