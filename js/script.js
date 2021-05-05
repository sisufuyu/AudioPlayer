(function($){
    function AudioPlayer(player){
        this.player = player;
        this.myAudio = this.player.find("#myAudio");
        this.audioNode = this.myAudio[0];
        this.cdNode = this.player.find(".CD");
        this.PlayNode = this.player.find(".play");
        this.pointer = this.player.find(".pointer");
        this.loopBtn = this.player.find(".loop");
        this.song = this.player.find(".song-name");
        this.singer = this.player.find(".singer");
        this.VolumeBar = this.player.find(".voice-bar");
        this.currTime = this.player.find(".currTime");
        this.durationNode = this.player.find(".duration");
        this.progress = this.player.find(".progress");
        this.progressLoad = this.progress.find(".progress-load");
        this.progressFill = this.progress.find(".progress-fill");
        this.progressThumb = this.progress.find(".progress-thumb");
        this.progressWidth = this.progress.width();
        this.progressOffset = this.progress.offset().left;
        this.prev = this.player.find(".prev");
        this.next = this.player.find(".next");
        this.firstMesg = this.player.find(".first-message");
        this.lastMesg = this.player.find(".last-message");
        this.musicList = [
            {
                name : "Rolling in the deep",
                singer : "Adele",
                src : "https://download.3mp3.buzz/d/Adele-Rolling-In-The-Deep.mp3",
                image: "./src/poster/Rolling_in_the_Deep.png"
            },{
                name : "Don't You Remember",
                singer : "adele",
                src : './src/mp3/Adele-Dont-You-Remember.mp3',
                image : './src/poster/Adele.png'
            },{
                name : "la vie en rose",
                singer: "lisa ono",
                src : './src/mp3/Lisa-Ono-La-Vie-En-Rose.mp3',
                image : './src/poster/lisa-ono.jpg'
            },{
                name : "Moon river",
                singer : "lisa ono",
                src : "https://download.3mp3.buzz/k/Lisa-Ono-Moon-River.mp3",
                image : "./src/poster/lisa-moon-river.jpg"
            },{
                name : "Hush",
                singer : "Lasse Lindh",
                src : "./src/mp3/Lasse Lindh - Hush.mp3",
                image : "./src/poster/guiguai.jpg"
            },{
                name : "夜曲",
                singer: "jay chou",
                src : './src/mp3/Jay-Chou-Ye-Qu.mp3',
                image : './src/poster/jay-chou.jpg'
            },{
                name: "简单爱",
                singer : "周杰伦",
                src: "https://download.3mp3.buzz/s/Jay-Chou-Jian-Dan-Ai-Simple-Love.mp3",
                image : "./src/poster/jian-dan-ai.jpg"
            },{
                name: "鸿雁",
                singer : "呼斯楞",
                src : "./src/mp3/鸿雁.mp3",
                image : "./src/poster/鸿雁.jpg"
            }
        ];
        this._init();
    }
    //Initialize player
    AudioPlayer.prototype._init = function(){
        var self = this;
        this.playing = false;
        this.loop = false;
        this.animation = false;
        this.currIndex = 0;
        this._setAudio(this.currIndex);
        this.audioNode.volume = 0.5;
        this.VolumeBar.val(50);
        this.player.on("animation-on",function(){
            self.audioNode.play();
        });
    }
    // get correct index of audio
    AudioPlayer.prototype._getCorrectIndex = function(index){
        if(index<0){
            index = 0;
        }else if(index >= this.musicList.length){
            index = this.musicList.length - 1;
        }
        return index;
    }
    // If flag is true add animation, else remove animation
    AudioPlayer.prototype._setAnimation = function(flag){ 
        var self = this;
        if(flag){
            //console.log("run animation");
            this.PlayNode.css({"background-image":"url(src/pause.png)"});
            this.pointer.addClass("pointer-on");
            setTimeout(function(){
                self.cdNode.css("animation-play-state","running");
                self.animation = true;
                self.player.trigger("animation-on");
            },1000);
        }else{
            //console.log("stop animation");
            this.PlayNode.css({"background-image":"url(src/play.png)"});
            this.pointer.removeClass("pointer-on");
            setTimeout(function(){
                self.cdNode.css("animation-play-state","paused");
                self.animation = false;
            },1000);
        }
    }
    AudioPlayer.prototype._changeTime = function(time){
        var min = parseInt(time/60),
            sec = parseInt(time%60);
        if(sec < 10){
            sec = '0' + sec;
        }
        return min + ":" +sec;
    };
    //show message of the first and last song
    AudioPlayer.prototype._showMesg = function(msg){
        msg.fadeIn();
        setTimeout(function(){
           msg.fadeOut(); 
        },1000)
    }
    //audio buffer handler, update the progress load bar width
    AudioPlayer.prototype._bufferHandler = function(){
        var buffered = this.audioNode.buffered;
        var len = buffered.length;
        //console.log("loading");
        if(len > 0){
            //console.log("start: " + buffered.start(len-1) + ",end: " + buffered.end(len-1));
            this.progress.find(".progress-load").css("width",buffered.end(len-1)*100/this.audioNode.duration+"%");
        }
    }
    //set audio src, duration and name, singer and handle audio buffer
    AudioPlayer.prototype._setAudio = function(index){
        var self = this;
        //set audio 
        index = this._getCorrectIndex(index);
        this.audioNode.src = this.musicList[index].src;
        this.audioNode.load();
        this.song.html(this.musicList[index].name);
        this.singer.html(this.musicList[index].singer);
        this.cdNode.css("background-image" , "url("+ this.musicList[index].image + ")");
        this.myAudio.one("canplay",function(){
            //console.log("canplay");
            self.durationNode.html(self._changeTime(self.audioNode.duration));
            self._bufferHandler();
        })
    }
    // if audio is already playing before, no need to set animation again, just play
    AudioPlayer.prototype._checkAnimation = function(){
        if(!this.animation){ 
            this._setAnimation(true);
         }else{
             this.audioNode.play();
         }
    }
    //switch video, if already first or last audio then show message
    AudioPlayer.prototype._switchAudio = function(i){
        var index = this._getCorrectIndex(i);
        if( this.currIndex != index){
            this.audioNode.pause();
            //set progress to start
            this.progressLoad.width(0);
            this.progressFill.width(0);
            this.progressThumb.css("left",0);
            //change audio and current index
            this._setAudio(index);
            this.currIndex = index;
            this._checkAnimation();
        }else{
            if(this.currIndex === 0){
                this._showMesg(this.firstMesg);
            }else if(this.currIndex === this.musicList.length-1){
                this._showMesg(this.lastMesg);
            }
        }
    }
    //handle audio loading, time update, ended, play, pause, switch and loop event
    AudioPlayer.prototype.Play = function(){
        var self = this;
        this.PlayNode.on("click",function(){
            if(self.playing){
                self.audioNode.pause();
                self._setAnimation(false);
            }else{
                self._setAnimation(true);
            }    
        });
        this.myAudio.on("progress",$.proxy(self._bufferHandler,self))
        .on("timeupdate",function(){
            self.currTime.html(self._changeTime(self.audioNode.currentTime));
            self.progressFill.width(self.audioNode.currentTime*self.progressWidth/self.audioNode.duration);
            self.progressThumb.css("left",self.progressFill.width());
        }).on("ended",function(){
            self.audioNode.pause();
            self.playing = false;
            self._setAnimation(false);
            if(! (self.audioNode.loop || self.currIndex === self.musicList.length-1)){
                self._switchAudio(self.currIndex+1);
            }
        }).on("pause",function(){
            self.playing = false;
            self.PlayNode.css({"background-image":"url(src/play.png)"});
        }).on("play",function(){
            self.playing = true;
            self.PlayNode.css({"background-image":"url(src/pause.png)"});
        })
        // .on("waiting",function(){
        //     console.log("waiting");
        // }).on("playing",function(){
        //     console.log("playing");
        // })
        this.prev.on("click",function(){
            self._switchAudio(self.currIndex-1);
        })
        this.next.on("click",function(){
            self._switchAudio(self.currIndex+1);
        })
        this.loopBtn.on("click",function(){
            if(self.loop){
                self.audioNode.loop = false;
                self.loop = false;
                self.loopBtn.css({"background-color":"#c1d2d8"});
            }else{
                self.audioNode.loop = true;
                self.loop = true;
                self.loopBtn.css({"background-color":"#4c6676"});
            }
        })
    }
    //change audio volume
    AudioPlayer.prototype.Volume = function(){
        var self = this;
        this.VolumeBar.on("input range",function(){
            var vol = parseInt($(this).val());
            self.audioNode.volume = vol/100;
            $(this).css("background", "linear-gradient(to right, #f6ede2 " + vol + "%, #c1d2d8 " + vol + "%)");
        })
    }
    //click or drag progress bar to update audio current play time 
    AudioPlayer.prototype._updateProgress = function(event){
        this.audioNode.pause();
        this.playing = false;
        var left = event.clientX - this.progressOffset;
        left = left < 0 ? 0 :left;
        left = left > this.progressWidth ? this.progressWidth : left;
        this.progressFill.width(left);
        this.progressThumb.css("left",left);
        if(this.audioNode.duration){
            var seekTime = left*this.audioNode.duration/this.progressWidth;
            this.audioNode.currentTime = seekTime;
        }
    }
    AudioPlayer.prototype.ChangeProgress = function(){
        var self = this;
        this.progress.on("click",function(event){
            self._updateProgress(event);
            //if audio is not playing before click progress bar, add animation and play video. Otherwise just play audio.
            self._checkAnimation();
        });
        this.progressThumb.on("mousedown",function(event){
            $(document).on("mousemove",$.proxy(self._updateProgress,self));
            $(document).on("mouseup",function(){
                $(document).off("mousemove mouseup");
                self._checkAnimation();
            })
            event.stopPropagation();
        })
    }    

    var music_player = new AudioPlayer($(".MusicPlayer"));
    music_player.Play();
    music_player.Volume();
    music_player.ChangeProgress();

})(jQuery)
