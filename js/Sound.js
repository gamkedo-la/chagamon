var audioFormat;
var muteAll = false;

function setFormat() {
  var audio = new Audio();
  if (audio.canPlayType("audio/ogg")) {
      audioFormat = ".mp3";
 } else if (audio.canPlayType("audio/mp3")){
     audioFormat = ".ogg";
  }
}

function BackgroundMusicClass() {

  var musicSound = null;
    
  this.loopSong = function(filenameWithPath) {
    setFormat(); // calling this to ensure that audioFormat is set before needed
    
    if(musicSound != null) {
      musicSound.pause();
      musicSound = null;
    }
    musicSound = new Audio(filenameWithPath+audioFormat);
    musicSound.loop = true;
    musicSound.play();
  }
  
  this.startOrStopMusic = function() {
    if(musicSound == null || musicSound == undefined) {
      return;
    }
    if(musicSound.paused) {
      musicSound.play();
      showCredits = false;
    } else {
      musicSound.pause();
    }
  }

  this.restartMusic = function() {
    if(musicSound != null){
      musicSound.currentTime = 0;
      musicSound.play();
    }
  }
}


function SoundOverlapsClass(filenameWithPath) { // accepting argument for constructor
  
  setFormat(); // calling this to ensure that audioFormat is set before needed
  
  // All variables here are "private", hidden to outside. Use "var " - not "this."
  var mainSound = new Audio(filenameWithPath+audioFormat);
  var altSound = new Audio(filenameWithPath+audioFormat);

  var altSoundTurn = false;
  
  this.play = function() { // not "var ", keeping "this.", as we need it exposed!
    if(muteAll) {
      console.log("skipping sound play dude to muteAll status");
      return;
    }

    if(altSoundTurn) { // note: no "this." before altSoundTurn since "var" local/private
      altSound.currentTime = 0;
      altSound.play();
    } else {
      mainSound.currentTime = 0;
      mainSound.play();
    }
    altSoundTurn = !altSoundTurn; // toggle between true and false
  }

}