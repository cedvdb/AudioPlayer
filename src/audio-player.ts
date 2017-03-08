import { Loader } from './loader';

declare let BufferLoader:any;
declare let AudioContext:any;
declare let webkitAudioContext:any;

export class AudioPlayer{
	audioContext;
	soundContainer = {}; // cache
	release = 0.1;

	constructor(){
		let _AudioContext_ = AudioContext || webkitAudioContext;
		if(_AudioContext_ === undefined) 
			throw new Error('AudioContext or webkitAudioContext not supported in this browser...');
    this.audioContext = new _AudioContext_();
	}

	load(urlMap:any, name?:string){
		return new Loader(this.soundContainer).load(urlMap, name).catch(e => console.log(e));
	}

	play(sound:any){
		
		let buff = this.soundContainer[sound.instrument || 'acoustic_grand_piano' ][sound.name];
		console.log(this.soundContainer);
		
		this.audioContext.decodeAudioData(buff, (buffer) => {
      let source = this.audioContext.createBufferSource(); 
      let gainNode = this.audioContext.createGain();
      // pushing notes in note map
      //this.notesMap[key].push({ source, gainNode });
      source.buffer = buffer;                   
      source.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      // velocity ranges from 0 to 127. Gain is something else, I'm not sure what exactly but this seem to work:
      // seems like making the velocity squared works better, maybe gain isn't linear.
      gainNode.gain.value = 1;
			// if we have a stop time known in advance do it here
			if(sound.stop !== undefined){
				let stopTime = this.audioContext.currentTime + sound.stop;
				gainNode.gain.setValueAtTime(1, stopTime);
        gainNode.gain.linearRampToValueAtTime(0, stopTime + this.release);
			}
      source.start(sound.start || 0);
      //this._notes.next(notePlayed);
     });
	}


	simplePlay(soundName:string, velocity?:number, start?:number){
		this.play({name: soundName})
	}
}

let url = "https://raw.githubusercontent.com/cedvdb/soundfonts/master/SD/mp3/acoustic_grand_piano/A4.mp3";
let urjs = "https://raw.githubusercontent.com/cedvdb/soundfonts/master/SD/acoustic_grand_piano.json";
let p = new AudioPlayer();
let a = { soundfont : true, hd: true, http2: false}

p.load(a).then(d => p.play({name: 'A7', stop: 0.1}));
//p.oscillator();

