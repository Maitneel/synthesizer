(function() {
  'use strict';

  const audio_tags_area = document.getElementById('audio_tags');
  const keyborad = document.getElementById('keyboard');

  
  let whitekey_div = [];
  let blackkey_div = [];
  (function() {
    for (let i = 0; i < 15; i++) {
      whitekey_div[i] = document.createElement('div');
      whitekey_div[i].className = 'whitekey';
      whitekey_div[i].style.marginLeft = 1 + (93 * i) + 'px';
      keyborad.appendChild(whitekey_div[i]);
    }
  })();

  (function() { 
    let ith_marginleft;
    for (let i = 0; i < 10; i++) {
      blackkey_div[i] = document.createElement('div');
      blackkey_div[i].className = 'blackkey';
      if (i == 0) {
        ith_marginleft = 70;
      } else if (i % 5 == 2 || i % 5 == 0) {
        ith_marginleft += 93 * 2;
      } else {
        ith_marginleft += 93;
      }
      blackkey_div[i].style.marginLeft = ith_marginleft + 'px';
      keyborad.appendChild(blackkey_div[i]);
    }
  })();

  let key_list = [];
  (function() {
    let whitekey_index = 0;
    let blackkey_index = 0;
    for (let i = 0; i < whitekey_div.length; i++) {
      key_list[whitekey_index + blackkey_index] = whitekey_div[whitekey_index];
      whitekey_index++;
      if (!(i % 7 == 2 || i % 7 == 6) && blackkey_index < blackkey_div.length) {
        key_list[whitekey_index + blackkey_index] = blackkey_div[blackkey_index];
        blackkey_index++;
      }
    }
    for (let i = 0; i < key_list.length; i++) {
      key_list[i].onmousedown = () => {
        audio_play(i);
      }
      key_list[i].onmouseup = () => {
        audio_stop(i);
      }
      key_list[i].onmouseout = () => {
        audio_stop(i);
      }
    }
  })();

  var wav_header = {
    RIFF: "RIFF",
    file_size: 0,
    WAVE: "WAVE",
    FMT: "fmt ",
    fmt_size: 16,
    format: 1,
    channel: 1,
    sampling_fre: 44100,
    bit_rate: 16,
    byte_per_s: 0,
    block_size: 0,
    DATA: "data",
    data_size: 0,
    header_size: 4 + 4 + 4 + 4 + 4 + 2 + 2 + 4 + 4 + 2 + 2 + 4 + 4,
    
    set: function() {
      this.byte_per_s = (this.channel * this.sampling_fre * (this.bit_rate / 8));
      this.block_size = (this.channel * (this.bit_rate / 8));
      console.log(this.block_size);
    }
  };
  wav_header.set();

  function int_to_string(n, byte) {
    let string = "";
    for (let i = 0; i < byte; i++) {
      string += String.fromCharCode(n % 256);
      n /= 256;
    }
    return string;
  }

  function create_sin_wave(wav_header, frequency, length) {
    // bit_rateが16以外の場合は考えないものとする
    if (wav_header.bit_rate != 16) {
      console.error('bit_rate dose not 16.');
      return;
    }
    let data_AB = new ArrayBuffer(wav_header.header_size + wav_header.byte_per_s * length);
    let data_ui8a = new Uint8Array(data_AB);
    let wave = new Int16Array(wav_header.sampling_fre * length);
    for (let i = 0; i < wave.length; i++) {
      wave[i] = Math.floor(Math.sin(i * Math.pi * frequency / wav_header.sampling_fre));
    }

    wav_header.data_size = wav_header.byte_per_s * length;
    wav_header.file_size = 4 + 4 + 4 + wav_header.fmt_size + wav_header.data_size + 4 + 4;

    let header_string = "";
    header_string += wav_header.RIFF;
    header_string += int_to_string(wav_header.file_size, 4);
    header_string += wav_header.FMT;
    header_string += int_to_string(wav_header.fmt_size, 4);
    header_string += int_to_string(wav_header.format, 2);
    header_string += int_to_string(wav_header.channel, 2);
    header_string += int_to_string(wav_header.sampling_fre, 4);
    header_string += int_to_string(wav_header.byte_per_s, 4);
    header_string += int_to_string(wav_header.block_size, 2);
    header_string += int_to_string(wav_header.bit_rate, 2);
    header_string += wav_header.DATA;
    header_string += int_to_string(wav_header.data_size, 4);
    
    let data_string = "";
    for (let i = 0; i < wave.length; i++) {  
      data_string += int_to_string(wave[i], 2);
    }

    let i;
    for (i = 0; i < header_string.length; i++) {
      data_ui8a[i] = header_string.charCodeAt(i);
    }

    for (i = 0; i < data_string; i++) {
      data_ui8a[i + header_string.length] = data_string.charCodeAt(i);
    }
    
    return data_AB;
  }

  
  let A4_frequency = 440;
  let frequency_list = [];
  (function() {
    frequency_list[9] = A4_frequency;
    for (let i = 9; i < key_list.length; i++) {
      frequency_list[i] = A4_frequency * Math.pow(2, (i - 9) / 12);
    }
    for (let i = 0; i < 9; i++) {
      frequency_list[i] = frequency_list[i + 12] / 2;
    }
  })();

  let wav_files = [];
  let wav_length = 60;
  (function() {
    for (let i = 0; i < frequency_list.length; i++) {
      wav_files[i] = create_sin_wave(wav_header, frequency_list[i], wav_length);
    }
  })();

  // create audio tags
  let audio = [];
  let wav_files_blob = [];
  (function() {
    for (let i = 0; i < key_list.length; i++) {
      wav_files_blob[i] = new Blob([wav_files[i]], {type: 'audio/wav'});
      audio[i] = document.createElement('audio');
      audio[i].src = URL.createObjectURL(wav_files_blob[i]);
      audio_tags_area.appendChild(audio[i]);
      console.log(i);
    }
  })();
  
  console.log(wav_files[0]);

  function audio_play(n) {
    console.log('onmousedown, pushed by ' + n);
    audio[n].play();
    // TODO
  }

  function audio_stop(n) {
    console.log('mouseout or onmouseup. by ' + n);
    audio[n].pause();
    // TODO
  }


})();