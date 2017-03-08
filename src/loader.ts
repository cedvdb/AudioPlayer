declare let fetch:any;
declare let MIDI:any;

const KEYS = ["A", "Bb", "B", "C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab"];
declare let Headers:any;

export class Loader{
		soundContainer;
		static INCORRECT_VAL = "Incorrect value for the load method, see github page";
		reqPromise:Promise<any>;
		url: string;
		name: string;
		instrument:string;
		keys = [];
		static SOUNDFONTS_BASE_URL = "https://raw.githubusercontent.com/cedvdb/soundfonts/master/";

    constructor(soundContainer){
			this.soundContainer = soundContainer;
			//pushing the keys in array.
			for(let octave = 1; octave < 8; octave++){
				for(let key of KEYS){
					this.keys.push(key + octave)
				}
			}
			this.keys.push('C8')
		}

		load(urlObject:any, name:string){
			this.instrument = urlObject.instrument || "acoustic_grand_piano";
			let type = typeof urlObject;
			if(type ===  "string") this.strUrl(urlObject, name); 
			else if(type === "object") this.objUrl(urlObject);
			else throw Error(Loader.INCORRECT_VAL);
			return this.reqPromise;
		}


		private strUrl(url:string, name:string){
				this.reqRaw(url, name);
		}

		private objUrl(urlObject){
			if(urlObject.soundfont === true){
				let lib = (urlObject.hd ? 'HD' : 'SD');
				if(urlObject.http2 === true){
					this.reqHttp2Sf(Loader.SOUNDFONTS_BASE_URL + lib + "/mp3/" + this.instrument);
				}else{
					this.reqSoundFont(Loader.SOUNDFONTS_BASE_URL + lib + "/"+ this.instrument + "-" + (urlObject.extension || "mp3") + ".json")
				}
			}
		}

		private convertName(url:string, name:string){
			// returning the name or the name of the file in the url if no name provided.
			if(name !== undefined)
				return name;
			else{
				//removing extension
				let filenameArr = url.substr(url.lastIndexOf('/') + 1).split(".");
				filenameArr.splice(-1,1)
				return filenameArr.join('');
			} 
		}


		private reqRaw(url:string, name:string){		
			console.log('there');
				var myHeaders = new Headers();
			this.reqPromise = fetch(url)
				.then(d => {console.log(d);d.arrayBuffer();})
				.then(d => {
					this.soundContainer[this.instrument] = {};
					this.soundContainer[this.instrument][this.convertName(url, name)] = d});console.log(this.soundContainer);
    }

		private reqSoundFont(url:string){
			this.reqPromise = fetch(url)
				.then(d => d.text())
				.then(d => JSON.stringify(d))
				.then(d => {
					for(let k in d){
						if(d.hasOwnProperty(k)) d[k] = atob(d[k].replace('data:audio/mp3;base64,//', ''));
					}
				})
				.then(d => this.soundContainer[this.instrument] = d );
		}

		private reqHttp2Sf(url:string){
			let promises = [];
			this.soundContainer[this.instrument] = {};
			this.keys.forEach(k => {
				promises.push(fetch(`${url}/${k}.mp3`)
					.then(r => r.arrayBuffer())
					.then(d =>  {
						this.soundContainer[this.instrument][k] = d;
				}));
			});
		this.reqPromise = Promise.all(promises).then(() => console.log(this.soundContainer));
	}

	private base64Decode(s){
			// Uint8Array.from(atob(s), c => c.charCodeAt(0))
	}
}

