(function(params){

  Polymer('olos-envelope', {

    volume: 0.5,
    on: false,
    color: '#00CCFF',
    width: 200,
    height: 200,
    rootfolder: '../olos-envelope/',
    gainNode: null,

    // handle i/o
    inputdata: null,
    inputaudio: null,
    output: null,

    breakpoints: [],

    // duration in seconds
    duration: 1,

    // nexusUI multi envelope
    nexusEl: null,

    observe: {
      inputdata: 'inputdataChanged'
    },

    // gain node for control

    ready: function() {
      this._audioContext = audioContext;

      // nexus element
      this.nexusEl = nx.add("envmulti", {w:this.width, h:this.height});
      document.body.removeChild(this.nexusEl.canvas);
      this.$.container.appendChild(this.nexusEl.canvas);
      // this.nexusEl.canvas.style.width = "100%"; 
      // this.nexusEl.canvas.style.height = "100%"; 


      // gainNode
      this.inputaudio = this.output = this._audioContext.createGain();
      this.output.gain.value = 0;

      // input data
      this.inputdata = [0];
    },

    durationChanged: function() {
      this.nexusEl.duration = this.duration*1000;
      // also change the nexusUI animation
    },

    start: function() {
      this.nexusEl.start();

      // trigger the envelope
      var time = this._audioContext.currentTime;
      this.output.gain.cancelScheduledValues(time);
      // console.log(this.output.gain.value);
      this.output.gain.setValueAtTime(this.output.gain.value, time)
      // this.output.gain.linearRampToValueAtTime(0, time);

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

    },

    // these settings can be tweaked in the editor
    publicAudio: function() {
      this.duration = 1;
    },

    inputdataChanged: function() {
      // console.log(this.inputdata);
      for (var i = 0; i < this.inputdata.length; i++) {
        if (this.inputdata[i] > 0) {
          this.start();
        }
      }
    },

    // temporary fix because inputdataChanged is not working.
    update: function() {
      this.inputdataChanged();
    },

    resize: function() {
      // console.log('resize me');
      // this.nexusEl.width = this.$.container.offsetWidth;
      // this.nexusEl.height=this.$.container.offsetHeight;
      // console.log(this.$.container.offsetHeight);
      // cnv.width =this.$.container.width;
      // cnv.height=this.$.container.height;
    },

    animate: function() {
      // to do
    },

    dispose: function() {
      var self = this;

      // destroy nexus element
      self.nexusEl.destroy();

      // remove audio elements
      var nodes = ['inputAudio'];
      for (var i = 0; i < nodes.length; i++) {
        try {
          var node = self[nodes[i]];
          node.disconnect();
          node = null;
        } catch(e) { }
      }
    },

  });

})();