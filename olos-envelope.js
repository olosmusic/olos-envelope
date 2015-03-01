(function(params){

  Polymer('olos-envelope', {

    volume: 0.5,
    on: false,
    color: '#00CCFF',
    width: 300,
    height: 100,
    rootfolder: '../olos-envelope/',
    gainNode: null,

    // handle i/o
    input: null,
    output: null,
    inputCount: 1,
    outputCount: 1,
    inputs: [],
    outputs: [],

    breakpoints: [],

    // duration in seconds
    duration: 1,

    // nexusUI multi envelope
    nexusEl: null,

    // gain node for control

    ready: function() {
      this._audioContext = audioContext;

      // nexus element
      this.nexusEl = nx.add("envmulti", {w:300, h:300});
      document.body.removeChild(this.nexusEl.canvas);
      this.$.container.appendChild(this.nexusEl.canvas);

      // gainNode
      this.input = this.output = this._audioContext.createGain();
      this.output.gain.value = 0;
    },

    durationChanged: function() {
      this.nexusEl.duration = this.duration*1000;
      // also change the nexusUI animation
    },

    start: function() {
      console.log(this.nexusEl);
      this.nexusEl.start();
      console.log(this.nexusEl.val.points);


      // trigger the envelope
      var time = this._audioContext.currentTime;

      for (var i = 0; i <= this.nexusEl.val.points.length; i++) {
        // finally, ramp to 0
        var pointY = 0;
        var pointX = 1;
        if (i < this.nexusEl.val.points.length) {
          pointY = this.nexusEl.val.points[i].y;
          pointX = this.nexusEl.val.points[i].x;
        }
        var xTime = pointX * this.duration;
        this.output.gain.linearRampToValueAtTime(pointY, time + xTime);
      }

    }

  });

})();