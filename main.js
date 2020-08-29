(function () {
  'use strict';

  // この辺時間があればもう少し for を使うとかして見やすくしたい
  const div_voice0 = document.getElementById('voice0');
  const input_v0_A4_frequency = document.getElementById('v0_A4_frequency')
  const input_v0_sin_wave = document.getElementById('v0_sin_wave');
  const input_v0_sin_wave_label = document.getElementById('v0_sin_wave_label');
  const input_v0_square_wave = document.getElementById('v0_square_wave');
  const input_v0_square_wave_label = document.getElementById('v0_square_wave_label');
  const input_v0_sawtooth_wave = document.getElementById('v0_sawtooth_wave');
  const input_v0_sawtooth_wave_label = document.getElementById('v0_sawtooth_wave_label');
  const input_v0_volume = document.getElementById('v0_volume');

  const div_voice1 = document.getElementById('voice1');
  const input_v1_A4_frequency = document.getElementById('v1_A4_frequency')
  const input_v1_sin_wave = document.getElementById('v1_sin_wave');
  const input_v1_sin_wave_label = document.getElementById('v1_sin_wave_label');
  const input_v1_square_wave = document.getElementById('v1_square_wave');
  const input_v1_square_wave_label = document.getElementById('v1_square_wave_label');
  const input_v1_sawtooth_wave = document.getElementById('v1_sawtooth_wave');
  const input_v1_sawtooth_wave_label = document.getElementById('v1_sawtooth_wave_label');
  const input_v1_volume = document.getElementById('v1_volume');

  const div_voice2 = document.getElementById('voice2');
  const input_v2_A4_frequency = document.getElementById('v2_A4_frequency')
  const input_v2_sin_wave = document.getElementById('v2_sin_wave');
  const input_v2_sin_wave_label = document.getElementById('v2_sin_wave_label');
  const input_v2_square_wave = document.getElementById('v2_square_wave');
  const input_v2_square_wave_label = document.getElementById('v2_square_wave_label');
  const input_v2_sawtooth_wave = document.getElementById('v2_sawtooth_wave');
  const input_v2_sawtooth_wave_label = document.getElementById('v2_sawtooth_wave_label');
  const input_v2_volume = document.getElementById('v2_volume');
  
  const v0_audio_tags_area = document.getElementById('v0_audio_tags');
  const v1_audio_tags_area = document.getElementById('v1_audio_tags');
  const v2_audio_tags_area = document.getElementById('v2_audio_tags');
  const keyborad = document.getElementById('keyboard');

  const audio_tags_area = [v0_audio_tags_area, v1_audio_tags_area, v2_audio_tags_area];
  const inputs_A4_frequency = [input_v0_A4_frequency, input_v1_A4_frequency, input_v2_A4_frequency];
  const inputs_sin_wave = [input_v0_sin_wave, input_v1_sin_wave, input_v2_sin_wave];
  const inputs_square_wave = [input_v0_square_wave, input_v1_square_wave, input_v2_square_wave];
  const inputs_sawtooth_wave = [input_v0_sawtooth_wave, input_v1_sawtooth_wave, input_v2_sawtooth_wave];
  const div_voice = [div_voice0, div_voice1, div_voice2];
  const v0_label = [input_v0_sin_wave_label, input_v0_square_wave_label, input_v0_sawtooth_wave_label];
  const v1_label = [input_v1_sin_wave_label, input_v1_square_wave_label, input_v1_sawtooth_wave_label];
  const v2_label = [input_v2_sin_wave_label, input_v2_square_wave_label, input_v2_sawtooth_wave_label];
  const labels = [v0_label, v1_label, v2_label];
  const input_volume = [input_v0_volume, input_v1_volume, input_v2_volume];





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

  // データ1バイトあたりに分割する関数
  // ただし，このデータは下位バイトから先に分割される
  // → 0x12345678 は [0x78, 0x56, 0x34, 0x12] のように保存される
  function create_per0x100_array(n, byte_length) {
    let result = [];
    let i;
    for (let i = 0; i < byte_length; i++) {
      result[i] = n % 256;
      n = Math.floor(n / 256);
    }
    return result;
  }

  // wav ファイルの長さを調節する関数
  function tweak_length(frequency, sampling_fre, length) {
    return (sampling_fre / frequency * Math.max(Math.floor(frequency * length) , 2) / sampling_fre);
  }

  // file_size, data_size を設定する関数
  function set_sizes(wav_header, frequency, length) {
    wav_header.data_size = wav_header.block_size * Math.round(wav_header.sampling_fre * tweak_length(frequency, wav_header.sampling_fre, length));
    wav_header.file_size = 4 + 4 + 4 + wav_header.fmt_size + 4 + 4 + wav_header.data_size;
  }

  // wav ファイルの'RIFF'チャンクからデータサイズまでの情報を Uint8Arry に保存する関数
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

  // wav ファイルを作成する関数
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


  // サイン波を作成する関数
  function create_sin_wave(wav_header, frequency, length) {
    // bit_rateが16以外の場合は考えないものとする
    if (wav_header.bit_rate != 16) {
      console.error('bit_rate dose not 16.');
      return;
    }

    set_sizes(wav_header, frequency, length);
    let header_bin = create_header_ui8a_bin(wav_header);

    let wave = new Int16Array(wav_header.sampling_fre * length);
    for (let i = 0; i < wave.length; i++) {
      wave[i] = Math.floor(Math.sin(i * 2 * Math.PI * frequency / wav_header.sampling_fre) * 30000);
    }

    return create_file(header_bin, wave);
  }

  // 矩形波を作成する関数
  function create_square_wave(wav_header, frequency, length) {
    // bit_rateが16以外の場合は考えないものとする
    // create_sin_wave でもしたけど wav_header の file_size と data_size 以外変更するかは未定
    if (wav_header.bit_rate != 16) {
      console.error('bit_rate dose not 16.');
      return;
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

  // のこぎり波を作成する関数
  function create_sawtooth_wave(wav_header, frequency, length) {
    // bit_rateが16以外の場合は考えないものとする
    // create_sin_wave でもしたけど wav_header の file_size と data_size 以外変更するかは未定
    if (wav_header.bit_rate != 16) {
      console.error('bit_rate dose not 16.');
      return;
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
  let v1_A4_frequency = input_v1_A4_frequency.value;
  let v2_A4_frequency = input_v2_A4_frequency.value;

  let A4_frequency = [input_v0_A4_frequency.value, input_v1_A4_frequency.value, input_v2_A4_frequency.value];

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
  let wav_length = 0.5;
  // frequency_list の周波数を元にサイン波を作成し，それを配列に保存する
  function set_sin_wave(voice) {
    wav_files[voice] = [];
    for (let i = 0; i < frequency_list[voice].length; i++) {
      wav_files[voice][i] = create_sin_wave(wav_header, frequency_list[voice][i], wav_length);
    }
  };

  function set_square_wave(voice) {
    wav_files[voice] = [];
    for (let i = 0; i < frequency_list[voice].length; i++) {
      wav_files[voice][i] = create_square_wave(wav_header, frequency_list[voice][i], wav_length);
    }
  }

  function set_sawtooth_wave(voice) {
    wav_files[voice] = [];
    for (let i = 0; i < frequency_list[voice].length; i++) {
      wav_files[voice][i] = create_sawtooth_wave(wav_header, frequency_list[voice][i], wav_length);
    }
  }

  // create audio tags
  let audio = [];
  let wav_files_blob = [];
  function create_audio (voice) {
    audio[voice] = [];
    wav_files_blob[voice] = [];
    for (let i = 0; i < key_list.length; i++) {
      wav_files_blob[voice][i] = new Blob([wav_files[voice][i]], {type: 'audio/wav'});
      audio[voice][i] = document.createElement('audio');
      audio[voice][i].src = URL.createObjectURL(wav_files_blob[voice][i]);
      audio[voice][i].loop = true;
      audio[voice][i].volume = input_volume[voice].value;
      audio_tags_area[voice].appendChild(audio[voice][i]);
      console.log(i);
    }
  };

  function remove_all_children(id) {
    while (id.firstChild) {
      id.removeChild(id.firstChild);
    }
  }

  // A4 の周波数が変更された時に audio タグを変更する為に呼び出される関数
  function update_audio(selected_wave_type, A4_frequency, voice) {
    console.log(selected_wave_type);
    create_frequency_list(A4_frequency, voice);
    if (selected_wave_type === 'sin') {
      set_sin_wave(voice);
    } else if (selected_wave_type === 'square') {
      set_square_wave(voice);
    } else if (selected_wave_type === 'sawtooth') {
      set_sawtooth_wave(voice);
    } else {
      set_sin_wave(voice);
    }
    remove_all_children(audio_tags_area[voice]);
    create_audio(voice);
  }

  let selected_wave_type = [];

  // 初期化
  (function () {
    /*
    create_frequency_list(v0_A4_frequency, 0);
    set_sin_wave(0);
    create_audio(0);
    create_frequency_list(v1_A4_frequency, 1);
    set_sin_wave(1);
    create_audio(1);

    create_frequency_list(v2_A4_frequency, 2);
    set_sin_wave(2);
    create_audio(2);
    // */
  })();

  console.log(wav_files[0]);


  // キーを押した時，音を鳴らす処理
  function audio_play(n) {
    console.log('onmousedown, pushed by ' + n);
    let start = new Date().getTime();
    for (let i = 0; i < audio.length; i++) {
      if (voice_power_on[i] == true) {
        audio[i][n].play();
      }
    }
    console.log('time: ' +( start - new Date().getTime()));
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

  // キーを離した時，音を止める処理
  function audio_stop(n) {
    console.log('mouseout or onmouseup. by ' + n);
    for (let i = 0; i < audio.length; i++) {
      if (voice_power_on[i] == true) {
        audio[i][n].pause();
        audio[i][n].currentTime = 0;
      }
    }
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

  let voice_power_on = [false, false, false];
  let voice_changed = [true, true, true];



  // ------------------------------------
  // ↓ .onclick, .onchange などの処理指定
  // ------------------------------------
  for (let i = 0; i < inputs_A4_frequency.length; i++) {
    inputs_A4_frequency[i].onchange = () => {
      A4_frequency[i] = inputs_A4_frequency[i].value;
      if (voice_power_on[i] == true) {
        update_audio(selected_wave_type[i], A4_frequency[i], i);
        console.log(audio[0].src);
      } else {
        voice_changed[i] = true;
      }
    }
  }

  for (let i = 0; i < inputs_A4_frequency.length; i++) {
    inputs_A4_frequency[i].onclick = () => {
      console.log('input a4 click');
      voice_power_on[i] ^= 1;
    }
  }

  for (let i = 0; i < inputs_sin_wave.length; i++) {
    inputs_sin_wave[i].onclick = () => {
      selected_wave_type[i] = 'sin';
      if (voice_power_on[i] == true) {
        update_audio(selected_wave_type[i], A4_frequency[i], i);
      } else {
        voice_changed[i] = true;
      }
      voice_power_on[i] ^= 1;
    }
  }

  for (let i = 0; i < inputs_square_wave.length; i++) {
    inputs_square_wave[i].onclick = () => {
      selected_wave_type[i] = 'square';
      if (voice_power_on[i] == true) {
        update_audio(selected_wave_type[0], A4_frequency[i], i);
      } else {
        voice_changed[i] = true;
      }
      voice_power_on[i] ^= 1;
    }
  }

  for (let i = 0; i < inputs_sawtooth_wave.length; i++) {
    inputs_sawtooth_wave[i].onclick = () => {
      selected_wave_type[i] = 'sawtooth';
      if (voice_power_on[i] == true) {
        update_audio(selected_wave_type[i], A4_frequency[i], i);
      } else {
        voice_changed[i] = true;
      }
      voice_power_on[i] ^= 1;
    }
  }
  for (let i = 0; i < div_voice.length; i++) {
    div_voice[i].onclick = () => {
      voice_power_on[i] ^= 1;
      if (voice_power_on[i] == true) {
        if (voice_changed[i] == true) {
          update_audio(selected_wave_type[i], A4_frequency[i], i);
        }
        div_voice[i].classList.remove('voice_off');
        div_voice[i].classList.add('vocie_on');
      } else {
        div_voice[i].classList.remove('vocie_on');
        div_voice[i].classList.add('voice_off');
      }
    }
  }

  for (let i = 0; i < labels.length; i++) {
    for (let j = 0; j < labels[i].length; j++) {
      labels[i][j].onclick = () => {
        voice_power_on[i] ^= 1;
      }
    }
  }

  for (let i = 0; i < input_volume.length; i++) {
    input_volume[i].onclick = () => {
      voice_power_on[i] ^= 1;
    }
  }

  console.log(labels);
  console.log(v0_label);

})();