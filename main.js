(function () {
  'use strict';

  const input_v0_A4_frequency = document.getElementById('v0_A4_frequency')
  const input_v0_sin_wave = document.getElementById('v0_sin_wave');
  const input_v0_square_wave = document.getElementById('v0_square_wave');
  const input_v0_sawtooth_wave = document.getElementById('v0_sawtooth_wave');
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

  function create_file(header_bin, wave) {
    let data_AB = new ArrayBuffer(wav_header.file_size + 4 + 4);
    let data_ui8a = new Uint8Array(data_AB);

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
    let header_bin = create_header_ui8a_bin(wav_header);

    let wave = new Int16Array(wav_header.sampling_fre * length);
    for (let i = 0; i < wave.length; i++) {
      wave[i] = Math.floor(Math.sin(i * 2 * Math.PI * frequency / wav_header.sampling_fre) * 30000);
    }

    return create_file(header_bin, wave);
  }

  function create_square_wave(wav_header, frequency, length) {
    // bit_rateが16以外の場合は考えないものとする
    // create_sin_wave でもしたけど wav_header の file_size と data_size 以外変更するかは未定
    if (wav_header.bit_rate != 16) {
      console.error('bit_rate dose not 16.');
      return;
    }
    
    if (1 < tweak_length(frequency, wav_header.sampling_fre)) {
      // TODO? とりあえず 1 より大きい場合バグると思うので弾く
      console.error('\'tweak_length(frequency, wav_header.sampling_fre)\' is greater than \'1\'.');
    }

    set_sizes(wav_header, frequency, length);
    let header_bin = create_header_ui8a_bin(wav_header);

    let wave = new Int16Array(wav_header.sampling_fre * length);
    let boost = 30000;
    for (let i = 0; i < wave.length; i++) {
      wave[i] = (Math.floor((2 * i) / (wav_header.sampling_fre / frequency)) % 2) * boost - boost / 2;
    }

    return create_file(header_bin, wave);
  }

  /*
  // 矩形波，のこぎり波をフーリエ級数で計算したかったが(倍音が多すぎることになるので)，なぜかうまくいかないのでとりあえず1回放置する
  let sawtooth = [];
  function clac_sawtooth(sampling_fre, max_x) {
    // ここでの sampling_fre は他の sampling_fre とは全くもって違うものである
    //   →他のところにおけるものはwavファイルのサンプリング周波数であるのに対し，これはのこぎり波の波形の計算をする時にどの程度でサンプリングするかの周波数である
    sawtooth[0] = [];
    for (let i = 0; i < sampling_fre; i++) {
      sawtooth[0][i] = -Math.sin(2 * Math.PI * i / sampling_fre) - Math.sin(2 * Math.PI * i * 2 / sampling_fre) / 2;
      // console.log(-Math.sin(2 * Math.PI * i / sampling_fre) - Math.sin(2 * Math.PI * i * 2 / sampling_fre) / 2);
    }
    // console.log('hoge');
    for (let i = 1; i < max_x; i++) {
      sawtooth[i] = [];
      for (let j = 0; j < sampling_fre; j++) {
        sawtooth[i][j] = sawtooth[i - 1][j] + (sawtooth[i - 1][(j * 2) % sampling_fre]) / 2;
        // console.log(sawtooth[i - 1][j] + ' ' + sawtooth[i - 1][((j * 2) % sampling_fre)] + ' ' + (j * 2) % sampling_fre);
      }
    }
  }
  */

  function create_sawtooth_wave(wav_header, frequency, length) {
    // bit_rateが16以外の場合は考えないものとする
    // create_sin_wave でもしたけど wav_header の file_size と data_size 以外変更するかは未定
    if (wav_header.bit_rate != 16) {
      console.error('bit_rate dose not 16.');
      return;
    }
    
    if (1 < tweak_length(frequency, wav_header.sampling_fre)) {
      // TODO? とりあえず 1 より大きい場合バグると思うので弾く
      console.error('\'tweak_length(frequency, wav_header.sampling_fre)\' is greater than \'1\'.');
    }

    set_sizes(wav_header, frequency, length);
    let header_bin = create_header_ui8a_bin(wav_header);

    let wave = new Int16Array(wav_header.sampling_fre * length);
    let boost = 30000;
    for (let i = 0; i < wave.length; i++) {
      wave[i] = (((2 * i) / (wav_header.sampling_fre / frequency)) % 2) * boost - boost / 2;
    }

    return create_file(header_bin, wave);
  }


  let v0_A4_frequency = input_v0_A4_frequency.value;
  let frequency_list = [];
  // calc frequency and create frequency list
  function create_frequency_list(A4_frequency, voice) {
    frequency_list[voice] = []
    frequency_list[voice][9] = A4_frequency;
    for (let i = 9; i < key_list.length; i++) {
      frequency_list[voice][i] = A4_frequency * Math.pow(2, (i - 9) / 12);
    }
    for (let i = 0; i < 9; i++) {
      frequency_list[voice][i] = frequency_list[voice][i + 12] / 2;
    }
  };

  let wav_files = [];
  let wav_length = 1;
  // frequency_list の周波数を元にサイン波を作成し，それを配列に保存する
  function set_sin_wave(voice) {
    for (let i = 0; i < frequency_list[voice].length; i++) {
      wav_files[i] = create_sin_wave(wav_header, frequency_list[voice][i], wav_length);
    }
  };

  function set_square_wave(voice) {
    for (let i = 0; i < frequency_list[voice].length; i++) {
      wav_files[i] = create_square_wave(wav_header, frequency_list[voice][i], wav_length);
    }
  }

  function set_sawtooth_wave(voice) {
    for (let i = 0; i < frequency_list[voice].length; i++) {
      wav_files[i] = create_sawtooth_wave(wav_header, frequency_list[voice][i], wav_length);
    }
  }

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
  function update_audio(selected_wave_type, voice) {
    console.log(selected_wave_type);
    create_frequency_list(v0_A4_frequency, voice);
    if (selected_wave_type === 'sin') {
      set_sin_wave(voice);
    } else if (selected_wave_type === 'square') {
      set_square_wave(voice);
    } else if (selected_wave_type === 'sawtooth') {
      set_sawtooth_wave(voice);
    } else {
      set_sin_wave(voice);
    }
    remove_all_children(audio_tags_area);
    create_audio();
  }

  let selected_wave_type;

  input_v0_A4_frequency.onchange = () => {
    v0_A4_frequency = input_v0_A4_frequency.value;
    console.log(audio[0].src);
    update_audio(selected_wave_type, 0);
    console.log(audio[0].src);
  }

  // 初期化
  (function () {
    create_frequency_list(v0_A4_frequency, 0);
    set_sin_wave(0);
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

  input_v0_sin_wave.onclick = () => {
    selected_wave_type = 'sin';
    update_audio(selected_wave_type, 0);
    console.log('change sin');
  }

  input_v0_square_wave.onclick = () => {
    selected_wave_type = 'square';
    update_audio(selected_wave_type, 0);
  }

  input_v0_sawtooth_wave.onclick = () => {
    selected_wave_type = 'sawtooth';
    update_audio(selected_wave_type, 0);
  }

})();