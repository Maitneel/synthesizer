(function () {
  'use strict';

  const input_A4_frequency = document.getElementById('A4_frequency')
  const audio_tags_area = document.getElementById('audio_tags');
  const keyborad = document.getElementById('keyboard');


  let whitekey_div = [];
  let blackkey_div = [];
  // create white key
  (function () {
    for (let i = 0; i < 15; i++) {
      whitekey_div[i] = document.createElement('div');
      whitekey_div[i].classList.add('whitekey', 'not_pressed_whitekey');
      whitekey_div[i].style.marginLeft = 1 + (93 * i) + 'px';
      keyborad.appendChild(whitekey_div[i]);
    }
  })();

  // creat black key
  (function () {
    let ith_marginleft;
    for (let i = 0; i < 10; i++) {
      blackkey_div[i] = document.createElement('div');
      blackkey_div[i].classList.add('blackkey', 'not_pressed_blackkey');
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
  (function () {
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

  // wav file format
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

    set: function () {
      this.byte_per_s = (this.channel * this.sampling_fre * (this.bit_rate / 8));
      this.block_size = (this.channel * (this.bit_rate / 8));
      // console.log(this.block_size);
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

  function create_per0x100_array(n, byte_length) {
    let result = [];
    let i;
    for (let i = 0; i < byte_length; i++) {
      result[i] = n % 256;
      n = Math.floor(n / 256);
    }
    return result;
  }

  function tweak_length(frequency, sampling_fre) {
    return (sampling_fre / frequency * Math.max(Math.floor(frequency) , 2) / sampling_fre);
  }

  function set_sizes(wav_header, frequency, length) {
    wav_header.data_size = wav_header.block_size * length * Math.round(wav_header.sampling_fre * tweak_length(frequency, wav_header.sampling_fre));
    wav_header.file_size = 4 + 4 + 4 + wav_header.fmt_size + 4 + 4 + wav_header.data_size;
  }

  function create_header_ui8a_bin(wav_header) {
    let index = 0;
    let header_bin = new Uint8Array(wav_header.data_size);
    let i;
    for (let i = 0; i < wav_header.RIFF.length; i++) {
      header_bin[i + index] += wav_header.RIFF.charCodeAt(i);
    }
    index += wav_header.RIFF.length;

    let file_size_bin = create_per0x100_array(wav_header.file_size, 4)
    for (let i = 0; i < file_size_bin.length; i++) {
      let index = 0;
      let header_bin = new Uint8Array(wav_header.data_size);
      let i;
      for (let i = 0; i < wav_header.RIFF.length; i++) {
        header_bin[i + index] += wav_header.RIFF.charCodeAt(i);
      }
      index += wav_header.RIFF.length;

      let file_size_bin = create_per0x100_array(wav_header.file_size, 4)
      for (let i = 0; i < file_size_bin.length; i++) {
        header_bin[i + index] += file_size_bin[i];
      }
      index += file_size_bin.length;

      for (let i = 0; i < wav_header.WAVE.length; i++) {
        header_bin[i + index] += wav_header.WAVE.charCodeAt(i);
      }
      index += wav_header.WAVE.length;

      for (let i = 0; i < wav_header.FMT.length; i++) {
        header_bin[i + index] += wav_header.FMT.charCodeAt(i);
      }
      index += wav_header.FMT.length;

      let fmt_size_bin = create_per0x100_array(wav_header.fmt_size, 4);
      for (let i = 0; i < fmt_size_bin.length; i++) {
        header_bin[i + index] += fmt_size_bin[i];
      }
      index += fmt_size_bin.length;

      let format_bin = create_per0x100_array(wav_header.format, 2);
      for (let i = 0; i < format_bin.length; i++) {
        header_bin[i + index] += format_bin[i];
      }
      index += format_bin.length;

      let channel_bin = create_per0x100_array(wav_header.channel, 2);
      for (let i = 0; i < channel_bin.length; i++) {
        header_bin[i + index] += channel_bin[i];
      }
      index += channel_bin.length;

      let sampling_fre_bin = create_per0x100_array(wav_header.sampling_fre, 4);
      for (let i = 0; i < sampling_fre_bin.length; i++) {
        header_bin[i + index] += sampling_fre_bin[i];
      }
      index += sampling_fre_bin.length;


      let byte_per_s_bin = create_per0x100_array(wav_header.byte_per_s, 4);
      for (let i = 0; i < byte_per_s_bin.length; i++) {
        header_bin[i + index] += byte_per_s_bin[i];
      }
      index += byte_per_s_bin.length;

      let block_size_bin = create_per0x100_array(wav_header.block_size, 2);
      for (let i = 0; i < block_size_bin.length; i++) {
        header_bin[i + index] += block_size_bin[i];
      }
      index += block_size_bin.length;

      let bit_rate_bin = create_per0x100_array(wav_header.bit_rate, 2);
      for (let i = 0; i < bit_rate_bin.length; i++) {
        header_bin[i + index] += bit_rate_bin[i];
      }
      index += bit_rate_bin.length;

      for (let i = 0; i < wav_header.DATA.length; i++) {
        header_bin[i + index] += wav_header.DATA.charCodeAt(i);
      }
      index += wav_header.DATA.length;

      let data_size_bin = create_per0x100_array(wav_header.data_size, 4);
      for (let i = 0; i < data_size_bin.length; i++) {
        header_bin[i + index] += data_size_bin[i];
      }
      return header_bin;
    }
  }


  function create_sin_wave(wav_header, frequency, length) {
    // bit_rateが16以外の場合は考えないものとする
    if (wav_header.bit_rate != 16) {
      console.error('bit_rate dose not 16.');
      return;
    }
    
    if (1 < tweak_length(frequency, wav_header.sampling_fre)) {
      // TODO? とりあえず 1 より大きい場合バグると思うので弾く
      console.error('\'tweak_length(frequency, wav_header.sampling_fre)\' is greater than \'1\'.');
    }

    set_sizes(wav_header, frequency, length);

    let data_AB = new ArrayBuffer(wav_header.file_size + 4 + 4);
    let data_ui8a = new Uint8Array(data_AB);
    let wave = new Int16Array(wav_header.sampling_fre * length);
    for (let i = 0; i < wave.length; i++) {
      wave[i] = Math.floor(Math.sin(i * 2 * Math.PI * frequency / wav_header.sampling_fre) * 30000);
    }

    let header_bin = create_header_ui8a_bin(wav_header);

    let i;
    for (let i = 0; i < wav_header.header_size; i++) {
      data_ui8a[i] = header_bin[i];
    }

    let sample;
    for (let i = 0; i < wav_header.data_size; i++) {
      sample = create_per0x100_array(wave[i], 2);
      for (let j = 0; j < 2; j++) {
        data_ui8a[wav_header.header_size + i * 2 + j] = sample[j];
      }
    }

    return data_AB;
  }

  let A4_frequency = input_A4_frequency.value;
  let frequency_list = [];
  // calc frequency and create frequency list
  function create_frequency_list() {
    frequency_list[9] = A4_frequency;
    for (let i = 9; i < key_list.length; i++) {
      frequency_list[i] = A4_frequency * Math.pow(2, (i - 9) / 12);
    }
    for (let i = 0; i < 9; i++) {
      frequency_list[i] = frequency_list[i + 12] / 2;
    }
  };

  let wav_files = [];
  let wav_length = 1;
  // frequency_list の周波数を元にサイン波を作成し，それを配列に保存する
  function set_sin_wave() {
    for (let i = 0; i < frequency_list.length; i++) {
      wav_files[i] = create_sin_wave(wav_header, frequency_list[i], wav_length);
    }
  };

  // create audio tags
  let audio = [];
  let wav_files_blob = [];
  function create_audio () {
    for (let i = 0; i < key_list.length; i++) {
      wav_files_blob[i] = new Blob([wav_files[i]], {type: 'audio/wav'});
      audio[i] = document.createElement('audio');
      audio[i].src = URL.createObjectURL(wav_files_blob[i]);
      audio[i].loop = true;
      audio_tags_area.appendChild(audio[i]);
      console.log(i);
    }
  };

  function remove_all_children(id) {
    while (id.firstChild) {
      id.removeChild(id.firstChild);
    }
  }

  // A4 の周波数が変更された時に audio タグを変更する為に呼び出される関数
  function update_audio() {
    create_frequency_list();
    set_sin_wave();
    remove_all_children(audio_tags_area);
    create_audio();
  }

  input_A4_frequency.onchange = () => {
    A4_frequency = input_A4_frequency.value;
    console.log(audio[0].src);
    update_audio();
    console.log(audio[0].src);
  }

  // 初期化
  (function () {
    create_frequency_list();
    set_sin_wave();
    create_audio();
  })();

  console.log(wav_files[0]);

  function audio_play(n) {
    console.log('onmousedown, pushed by ' + n);
    audio[n].play();
    if (((n % 12) < 5 && (n % 12) % 2 == 0) || ((5 <= (n % 12)) && (n % 12) % 2 == 1)) {
      key_list[n].classList.remove('not_pressed_whitekey');
      key_list[n].classList.add('pressed_whitekey');
    } else {
      key_list[n].classList.remove('not_pressed_blackkey');
      key_list[n].classList.add('pressed_blackkey');
    }

    key_list[n].classList.add('on_press_whitekey');
    console.log(audio[n].src);
    // TODO
  }

  function audio_stop(n) {
    console.log('mouseout or onmouseup. by ' + n);
    audio[n].pause();
    audio[n].currentTime = 0;
    console.log(n + ' ' + (n % 12) + ' ' + (((n % 12) < 5 && (n % 12) % 2 == 0) || ((5 <= (n % 12)) && (n % 12) % 2 == 1)))
    if (((n % 12) < 5 && (n % 12) % 2 == 0) || ((5 <= (n % 12)) && (n % 12) % 2 == 1)) {
      key_list[n].classList.remove('pressed_whitekey');
      key_list[n].classList.add('not_pressed_whitekey');
    } else {
      key_list[n].classList.remove('pressed_blackkey');
      key_list[n].classList.add('not_pressed_blackkey');
    }
    // key_list[n].className -= 'on_press_whitekey';
    // TODO
  }


})();