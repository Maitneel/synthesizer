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

  const organ_section = document.getElementById('organ_section');
  const input_organ_A4_frequency = document.getElementById('organ_A4_frequency');
  const input_organ_sin_wave = document.getElementById('organ_sin_wave');
  const input_organ_sin_wave_label = document.getElementById('organ_sin_wave_label');
  const input_organ_square_wave = document.getElementById('organ_square_wave');
  const input_organ_square_wave_label = document.getElementById('organ_square_wave_label');
  const input_organ_sawtooth_wave = document.getElementById('organ_sawtooth_wave');
  const input_organ_sawtooth_wave_label = document.getElementById('organ_sawtooth_wave_label');
  const input_organ_volume = document.getElementById('organ_volume');
  const drawbar_section = document.getElementById('drawbar_section');
  const organ_audio_tags = document.getElementById('organ_audio_tags');

  const memory_section = document.getElementById('memory_section');
  const memory0 = document.getElementById('memory0');
  const memory1 = document.getElementById('memory1');
  const memory2 = document.getElementById('memory2');
  const cancel = document.getElementById('cancel');
  const check = document.getElementById('check');

  const div_key_setting = document.getElementById('key_setting');

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
  const organ_labels = [input_organ_sin_wave_label, input_organ_square_wave_label, input_organ_sawtooth_wave_label];
  const memory = [memory0, memory1, memory2]





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
  let key_list_span = [];
  // 白鍵と黒鍵を1つの配列にまとめて，鍵盤を押した時の挙動を定義する
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
        if (now_setting == true) {
          key_number = i;
        } else {
          audio_play(i);
        }
      }
      key_list[i].onmouseup = () => {
        if (now_setting != true) {
          audio_stop(i);
        }
      }
      key_list[i].onmouseout = () => {
        if (now_setting != true) {
          audio_stop(i);
        }
      }
      key_list_span[i] = document.createElement('span');
      key_list_span[i].className = 'key_span';
      key_list[i].appendChild(key_list_span[i]);
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

  // ↓の create_per0x100_array の代わりに使おうと思っていた関数(このソースの中で使用はしない)
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
  // 波形のできるだけ周期ごとに近いところにしておくと，audio の loop で回した時にきれいに聞こえる(FireFox)
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
  // とりあえずあとでやろうと思ってコメントアウトしたけど結局できなかった...
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


  // なぜか使っていないのに定義されてる周波数たち
  let v0_A4_frequency = input_v0_A4_frequency.value;
  let v1_A4_frequency = input_v1_A4_frequency.value;
  let v2_A4_frequency = input_v2_A4_frequency.value;

  // A4 というのは，音の高さのことで，中央のC音(Do)の上のA音(La)のことである
  // このプログラムでは，htmlを表示した時，1番下にあるA音がA4である。
  let A4_frequency = [input_v0_A4_frequency.value, input_v1_A4_frequency.value, input_v2_A4_frequency.value];

  // 平均律によるそれぞれの音の周波数のリスト
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
  let wav_length = 2;
  // frequency_list の周波数を元にサイン波を作成し，それを配列に保存する
  function set_sin_wave(voice) {
    wav_files[voice] = [];
    for (let i = 0; i < frequency_list[voice].length; i++) {
      wav_files[voice][i] = create_sin_wave(wav_header, frequency_list[voice][i], wav_length);
    }
  };

  // set_sin_wave の矩形波版
  function set_square_wave(voice) {
    wav_files[voice] = [];
    for (let i = 0; i < frequency_list[voice].length; i++) {
      wav_files[voice][i] = create_square_wave(wav_header, frequency_list[voice][i], wav_length);
    }
  }

  // set_sin_wave ののこぎり波版
  function set_sawtooth_wave(voice) {
    wav_files[voice] = [];
    for (let i = 0; i < frequency_list[voice].length; i++) {
      wav_files[voice][i] = create_sawtooth_wave(wav_header, frequency_list[voice][i], wav_length);
    }
  }

  // create audio tags
  let audio = [];
  let audio_length = [];
  let wav_files_blob = [];
  function create_audio (voice) {
    audio[voice] = [];
    // audio_length[voice] []
    wav_files_blob[voice] = [];
    for (let i = 0; i < key_list.length; i++) {
      wav_files_blob[voice][i] = new Blob([wav_files[voice][i]], {type: 'audio/wav'});
      audio[voice][i] = document.createElement('audio');
      audio[voice][i].src = URL.createObjectURL(wav_files_blob[voice][i]);
      // audio_length[voice][i] = tweak_length()

      // audio[voice][i].addEventListener('ended', (event) => {
      //   let stop = new Date().getTime();
      //   audio[voice][i].currentTime = 0;
      //   audio[voice][i].play()
      //   console.log(new Date().getTime() - stop);
      // });

      

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
    // 開発当初の名残
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

  // chrome audio.loop がうまくいかない問題を解決使用とした関数。うまくいかなかったので使ってない
  function reload(n) {
    console.log('reload flag' + is_keydowning);
    if (is_mousedowning == true) {
      audio_play(n);
    }
  }
  let interval_id = undefined;
  let is_mousedowning = false;
  // キーを押した時，音を鳴らす処理
  function audio_play(n) {
    console.log('audio_play');
    is_mousedowning = true;
    console.log('onmousedown, pushed by ' + n);
    let start = new Date().getTime();
    for (let i = 0; i < audio.length; i++) {
      
      if (voice_power_on[i] == true) {
        if (audio[i][n].currentTime > wav_length * 0.95) {
          audio[i][n].currentTime = 0;
        }
        audio[i][n].play();
      }
    }
    if (organ_power_on == true) {
      for (let i = 0; i < organ_audio[n].length; i++) {
        if (organ_audio[n][i].currentTime > wav_length * 0.95) {
          organ_audio[n][i].currentTime %= 1.75;
        }
        organ_audio[n][i].play();
      }
    }
    console.log('flag iskey ' + is_keydowning)
    if (is_keydowning != true) {
      if (interval_id == undefined) {
        // interval_id = setInterval(reload(n), length * 0.9 * 1000);
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
    is_mousedowning = false;
    clearInterval(interval_id);
    interval_id = undefined;
    console.log('mouseout or onmouseup. by ' + n);
    for (let i = 0; i < audio.length; i++) {
      if (voice_power_on[i] == true) {
        audio[i][n].pause();
        audio[i][n].currentTime = 0;
      }
    }
    if (organ_power_on == true) {
      console.log('n = ' + n + ' organ_audio.length = ' + organ_audio.length)
      for (let i = 0; i < organ_audio[n].length; i++) {
        organ_audio[n][i].pause();
        organ_audio[n][i].currentTime = 0;
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

  // ---------------------------
  // ------ Organ Section ------
  // ---------------------------

  // 基本的に上のシンセと同じようなことをしているが，ドローバーのを実装する関係で別関数，別変数になった
  // (思いつきで機能を足していったのでオルガン版の変数，関数名は今までの定義したのと似たような名前で organ とだいたいがついている)

  let drawbar_volume = [];

  // ドローバーが変更された時に音のvolumeを変更する
  function change_balance(bar_index, balance) {
    for (let i = 1; i < drawbar_position[bar_index].length; i++) {
      if (i <= balance) {
        drawbar_position_status[bar_index][i] = true;
      } else {
        drawbar_position_status[bar_index][i] = false;
      }
    }
    if (balance == 0) {
      drawbar_position_status[bar_index][0] = true;
    } else {
      drawbar_position_status[bar_index][0] = false;
    }
    for (let i = 0; i < drawbar_position[bar_index].length; i++) {
      drawbar_position[bar_index][i].classList.remove('drawbar_on');
      drawbar_position[bar_index][i].classList.remove('drawbar_off');
      if (drawbar_position_status[bar_index][i]) {
        drawbar_position[bar_index][i].classList.add('drawbar_on');
      } else {
        drawbar_position[bar_index][i].classList.add('drawbar_off');
      }
    }
    drawbar_volume[bar_index] = balance / 8;
    for (let i = 0; i < organ_audio.length; i++) {
      organ_audio[i][bar_index].volume = input_organ_volume.value * drawbar_volume[bar_index];
      console.log('[' + i + '][' + bar_index + '].volume = ' + input_organ_volume.value * drawbar_volume[bar_index])
    }
  }

  // ドローバーのhtmlを作るのに使う
  let drawbar = [];
  let drawbar_overtone = [];
  let drawbar_overtone_class = [];
  let drawbar_overtone_feet = ['16\'', '5 1/3\'', '8\'', '4\'', '2 2/3\'', '2\'', '1 3/5\'', '1 1/3\'', '1\''];
  let drawbar_position = [];
  let drawbar_position_status = []; // on の場合 true, off の場合 false

  // 音の設定関係
  let organ_power_on = false;
  let selected_organ_wave_type = 'sin';
  let organ_voice_changed = true;

  // wav ファイル関係
  let organ_wav_files = []; // organ_wav_files[key_list.length][drawbar.length]
  let organ_audio = [];
  let organ_wav_files_blob = [];

  // organ_section の UI 関係の初期化
  // ドローバーのhtmlを作る
  (function () {
    for (let i = 0; i < 9; i++) {
      drawbar[i] = document.createElement('div');
      drawbar[i].className = 'drawbar';
      drawbar_section.appendChild(drawbar[i]);
      drawbar_overtone[i] = document.createElement('div');
      drawbar_overtone[i].className = 'overtone';
      let feet_span = document.createElement('span');
      feet_span.className = 'feet_text';
      feet_span.innerText = drawbar_overtone_feet[i];
      drawbar_overtone[i].appendChild(feet_span);
      if (drawbar_overtone_feet[i] == '16\'' || drawbar_overtone_feet[i] == '5 1/3\'') {
        drawbar_overtone[i].classList.add('sixteen_feet');
      } else if (drawbar_overtone_feet[i].length == 2) {
        drawbar_overtone[i].classList.add('octave');
      } else {
        drawbar_overtone[i].classList.add('not_octave');
      }
      drawbar[i].appendChild(drawbar_overtone[i]);
      drawbar_position[i] = [];
      drawbar_position_status[i] = [];
      for (let j = 0; j < 9; j++) {
        drawbar_position[i][j] = document.createElement('div');
        drawbar_position[i][j].className = 'drawbar_position';
        let drawbar_span = document.createElement('span');
        drawbar_span.innerText = j;
        drawbar_position[i][j].appendChild(drawbar_span);
        if (j == 0) {
          drawbar_position_status[i][j] = true;;
          drawbar_position[i][j].classList.add('drawbar_on');
        } else {
          drawbar_position_status[i][j] = false;
          drawbar_position[i][j].classList.add('drawbar_off');
        }
        drawbar_position[i][j].onclick = () => {
          change_balance(i, j);
        }
        drawbar[i].appendChild(drawbar_position[i][j]);

      }
      drawbar_volume[i] = 0;
      // let line = document.createElement('div');
      // line.className = 'drawbar_line';
      // drawbar[i].appendChild(line);
    }
  })();

  // 上の方で定義した audio_tags のオルガン版
  let drawbar_audio_tags = [];
  (function() {
    for (let i = 0; i < drawbar.length; i++) {
      drawbar_audio_tags[i] = document.createElement('div');
      organ_audio_tags.appendChild(drawbar_audio_tags[i]);
    }
  })();

  // 周波数リスト
  // ドローバー関係の倍音が入るので2次元配列になる
  let organ_frequency_list = []; // organ_frequency[key_list.length][organ_overtone_raito];
  const organ_overtone_ratio = [1 / 2, (1 / 2) * 3 ,1 , 2, 3, 4, 5, 6, 8];

  // organ_freqency_list の作成
  function create_organ_frequency_list(A4_frequency) {
    for (let i = 0; i < key_list.length; i++) {
      organ_frequency_list[i] = [];
    }
    organ_frequency_list[9][2] = A4_frequency;
    for (let i = 9; i < key_list.length; i++) {
      organ_frequency_list[i][2] = A4_frequency * Math.pow(2, (i - 9) / 12);
    }
    for (let i = 0; i < 9; i++) {
      organ_frequency_list[i][2] = organ_frequency_list[i + 12][2] / 2;
    }
    console.log('overtone_frequency.length ' + organ_frequency_list.length)
    console.log(organ_overtone_ratio.length);
    for (let i = 0; i < organ_frequency_list.length; i++) {
      console.log('i = ' + i);
      for (let j = 0; j < organ_overtone_ratio.length; j++) {
        organ_frequency_list[i][j] = organ_frequency_list[i][2] * organ_overtone_ratio[j];
      }
    }
  }

  // サイン波を organ_wav_file にセットする(set_sin_wave のオルガン版)
  function set_organ_sin_wave() {
    for (let i = 0; i < organ_frequency_list.length; i++) {
      organ_wav_files[i] = [];
      for (let j = 0; j < organ_frequency_list[i].length; j++) {
        organ_wav_files[i][j] = create_sin_wave(wav_header, organ_frequency_list[i][j],wav_length);
      }
    }
  }

  // 矩形波を organ_wav_file にセットする(set_square_wave のオルガン版)
  function set_organ_square_wave() {
    for (let i = 0; i < organ_frequency_list.length; i++) {
      organ_wav_files[i] = [];
      for (let j = 0; j < organ_frequency_list[i].length; j++) {
        organ_wav_files[i][j] = create_square_wave(wav_header, organ_frequency_list[i][j],wav_length);
      }
    }
  }

  // のこぎり波を organ_wav_file にセットする(set_sawtooth_wave のオルガン版)
  function set_organ_sawtooth_wave() {
    for (let i = 0; i < organ_frequency_list.length; i++) {
      organ_wav_files[i] = [];
      for (let j = 0; j < organ_frequency_list[i].length; j++) {
        organ_wav_files[i][j] = create_sawtooth_wave(wav_header, organ_frequency_list[i][j],wav_length);
      }
    }
  }

  
  // create_audio のオルガン版
  // 倍音を実装するのでcreate_audioより9倍遅い
  function create_organ_audio () {
    organ_audio = []; // organ_audio[][]
    organ_wav_files_blob = [];
    for (let i = 0; i < organ_frequency_list.length; i++) {
      organ_audio[i] = [];
      organ_wav_files_blob[i] = [];
      for (let j = 0; j < organ_frequency_list[i].length; j++) {
        console.log(organ_wav_files[i][j]);
        organ_wav_files_blob[i][j] = new Blob([organ_wav_files[i][j]], {type: 'audio/wav'});
        organ_audio[i][j] = document.createElement('audio');
        organ_audio[i][j].src = URL.createObjectURL(organ_wav_files_blob[i][j]);
        organ_audio[i][j].loop = true;
        organ_audio[i][j].volume = drawbar_volume[j] * input_organ_volume.value;
        drawbar_audio_tags[j].appendChild(organ_audio[i][j]);
      }
    }
  }


  // 周波数，波形のどちらかが変更された場合に呼び出され更新する
  function update_organ_audio(selected_organ_wave_type) {
    create_organ_frequency_list(input_organ_A4_frequency.value);
    if (selected_organ_wave_type == 'sin') {
      set_organ_sin_wave();
    } else if (selected_organ_wave_type == 'square') {
      set_organ_square_wave();
    } else if (selected_organ_wave_type == 'sawtooth') {
      set_organ_sawtooth_wave();
    } else {
      console.error('?');
      console.log(selected_organ_wave_type);
    }
    for (let i = 0; i < drawbar_audio_tags.length; i++) {
      remove_all_children(drawbar_audio_tags[i]);
    }
    console.log(organ_wav_files);
    create_organ_audio();
  }
  

  // -----------------------------
  // ------ memory section -------
  // -----------------------------

  // シンセ，オルガンの設定を保存する

  let memory_data = [];
  // memory_data[0] に現在の，その他にそれぞれのmemory[n]を入れる
  
  for (let i = 0; i < memory.length + 1; i++) {
    memory_data[i] = {
     voice0: {
       A4_frequency: 440,
         wave_type: 'sin',
         volume: 1
       },
     voice1: {
       A4_frequency: 440,
       wave_type: 'sin',
       volume: 1
     },
     voice2: {
       A4_frequency: 440,
       wave_type: 'sin',
       volume: 1
     },
     organ: {
       A4_frequency: 440,
       wave_type: 'sin',
       volume: 1
     },
     drawbar: [0, 0, 0, 0, 0, 0, 0, 0, 0]
   }
  }

  // memory_data に現在の設定を保存する
  function set_memory_data() {
    memory_data[0].voice0.A4_frequency = inputs_A4_frequency[0].value;
    memory_data[0].voice0.wave_type = selected_wave_type[0];
    memory_data[0].voice0.volume = input_volume[0].value;
    memory_data[0].voice1.A4_frequency = inputs_A4_frequency[1].value;
    memory_data[0].voice1.wave_type = selected_wave_type[1];
    memory_data[0].voice1.volume = input_volume[1].value;
    memory_data[0].voice2.A4_frequency = inputs_A4_frequency[2].value;
    memory_data[0].voice2.wave_type = selected_wave_type[2];
    memory_data[0].voice2.volume = input_volume[2].value;
    memory_data[0].organ.A4_frequency = input_organ_A4_frequency.value;
    memory_data[0].organ.wave_type = selected_organ_wave_type;
    memory_data[0].organ.volume = input_organ_volume.value
    for (let i = 0; i < drawbar_volume.length; i++) {
      memory_data[0].drawbar[i] = drawbar_volume[i] * 8;
    }
  }

  // memory_data から設定を書き換える(この時点で設定は変わらない)
  function change_config(memory_data) {
    inputs_A4_frequency[0].value = memory_data.voice0.A4_frequency;
    console.log('foo flag' + inputs_A4_frequency[0].value + ' ' + memory_data.voice0.A4_frequency);
    selected_wave_type[0] = memory_data.voice0.wave_type;
    input_volume[0].value = memory_data.voice0.volume;
    inputs_A4_frequency[1].value = memory_data.voice1.A4_frequency;
    selected_wave_type[1] = memory_data.voice1.wave_type;
    input_volume[1].value = memory_data.voice1.volume;
    inputs_A4_frequency[2].value = memory_data.voice2.A4_frequency;
    selected_wave_type[2] = memory_data.voice2.wave_type;
    input_volume[2].value = memory_data.voice2.volume;
    input_organ_A4_frequency.value = memory_data.organ.A4_frequency;
    selected_organ_wave_type = memory_data.organ.wave_type;
    input_organ_volume.value = memory_data.organ.volume;

    for (let i = 0; i < selected_wave_type.length; i++) {
      if (selected_wave_type[i] == 'sin') {
        inputs_sin_wave[i].checked = true;
      } else if (selected_wave_type[i] == 'square') {
        inputs_square_wave[i].checked = true;
      } else if (selected_wave_type[i] == 'sawtooth') {
        inputs_sawtooth_wave[i].checked = true;
      } else {
        console.log('?' + i + ' ' + selected_wave_type[i]);
      }
    }

    if (selected_organ_wave_type == 'sin') {
      input_organ_sin_wave.checked = true;
    } else if (selected_organ_wave_type == 'square') {
      input_organ_square_wave.checked = true;
    } else if (selected_organ_wave_type == 'sawtooth') {
      input_organ_sawtooth_wave.checked = true;
    } else {
      console.log('?' + i + ' ' + selected_organ_wave_type);
    }

    for (let i = 0; i < memory_data.drawbar.length; i++) {
      drawbar_position[i][memory_data.drawbar[i]].onclick();
    }
  }

  
  let is_config_changed = false;
  let change_memory_number = -1

  // 変更するメモリされた時に上の関数を呼び出してメモリの入れ替えを行う
  for (let i = 0; i < memory.length; i++) {
    memory[i].onclick = () => {
      is_config_changed = true;
      change_memory_number = i;
      set_memory_data();
      change_config(memory_data[i + 1]);
      console.log(memory_data[0])
    }
  }


  // 元の設定に戻す
  cancel.onclick = () => {
    is_config_changed = false;
    change_memory_number = -1
    console.log('hogehoge');
    change_config(memory_data[0]);
  }

  // 変更を確定させる
  // check より change のほうがいい気がする
  check.onclick = () => {
    if (confirm('現在の設定とmemory' + (change_memory_number + 1) + 'を入れ替えますか？')) {
      memory_data[change_memory_number + 1].voice0.A4_frequency = memory_data[0].voice0.A4_frequency
      memory_data[change_memory_number + 1].voice0.wave_type = memory_data[0].voice0.wave_type
      memory_data[change_memory_number + 1].voice0.volume = memory_data[0].voice0.volume
      memory_data[change_memory_number + 1].voice1.A4_frequency = memory_data[0].voice1.A4_frequency
      memory_data[change_memory_number + 1].voice1.wave_type = memory_data[0].voice1.wave_type
      memory_data[change_memory_number + 1].voice1.volume = memory_data[0].voice1.volume
      memory_data[change_memory_number + 1].voice2.A4_frequency = memory_data[0].voice2.A4_frequency
      memory_data[change_memory_number + 1].voice2.wave_type = memory_data[0].voice2.wave_type
      memory_data[change_memory_number + 1].voice2.volume = memory_data[0].voice2.volume
      memory_data[change_memory_number + 1].organ.A4_frequency = memory_data[0].organ.A4_frequency
      memory_data[change_memory_number + 1].organ.wave_type = memory_data[0].organ.wave_type
      memory_data[change_memory_number + 1].organ.volume = memory_data[0].organ.volume
      for (let i = 0; i < memory_data[0].drawbar.length; i++) {
        memory_data[change_memory_number + 1].drawbar[i] = memory_data[0].drawbar[i];
      }
      voice_power_on = [false, false, false];
      voice_changed = [true, true, true];
    }
  }

  // メモリが選択されている時に他のところをクリックした場合，選択をキャンセルする
  let onclick_in_memory_section = false
  memory_section.onclick = () => {
    onclick_in_memory_section = true;
    is_config_changed ^= 1;
  }

  document.body.onclick = () => {
    if (is_config_changed == true) {
      cancel.onclick();
    }
    if (onclick_in_memory_section == true) {
      is_config_changed ^= 1;
      onclick_in_memory_section = false
    }
    console.log('click document')
  }

  // TODO cookie にメモリを保存しようと思ってつくった関数。そのうちcookieに保存できるようにして再読み込み，ブラウザを閉じても復元できるようにする
  function create_memory_cookie(memory_data, memory_number) {
    let result = 'memory' + memory_number + '=';

    result += memory_data.voice0.A4_frequency + '_';
    result += memory_data.voice0.wave_type + '_';
    result += memory_data.voice0.volume + '_';
    result += memory_data.voice1.A4_frequency + '_';
    result += memory_data.voice1.wave_type + '_';
    result += memory_data.voice1.volume + '_';
    result += memory_data.voice2.A4_frequency + '_';
    result += memory_data.voice2.wave_type + '_';
    result += memory_data.voice2.volume + '_';
    result += memory_data.organ.A4_frequency + '_';
    result += memory_data.organ.wave_type + '_';
    result += memory_data.organ.volume + '_';
    for (let i = 0; i < memory_data.drawbar.length; i++) {
      result += memory_data.drawbar[i] + '_';
    }

    return result;
  }

  // cookie を読んでメモリーに保存する関数
  function read_memory_cookie(cookie_string) {
    // TODO
  } 





  // それぞれのボイス(シンセ)がオンかオフかの配列
  let voice_power_on = [false, false, false];
  // ボイスがオフの間に変更されていた場合wavファイルを作り直すために変更されたかを保持する配列
  // 初期はページを読み込んだタイミングではwavファイルは作成されないので全てtrue
  let voice_changed = [true, true, true];



  // ------------------------------------
  // ↓ .onclick, .onchange などの処理指定
  // ------------------------------------

  // 周波数，波形等の変化があった時に変更するための処理

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

  input_organ_A4_frequency.onclick = () => {
    organ_power_on ^= 1;
  }

  input_organ_A4_frequency.onchange = () => {
    create_organ_frequency_list(input_organ_A4_frequency.value);
    if (organ_power_on == true) {
      update_organ_audio(selected_organ_wave_type);
    } else {
      organ_voice_changed = true;
    }
  }

  input_organ_sin_wave.onclick = () => {
    selected_organ_wave_type = 'sin';
    if (organ_power_on == true) {
      update_organ_audio(selected_organ_wave_type);
    } else {
      organ_voice_changed = true;
    }
    organ_power_on ^= 1;
  }

  input_organ_square_wave.onclick = () => {
    selected_organ_wave_type = 'square';
    if (organ_power_on == true) {
      update_organ_audio(selected_organ_wave_type);
    } else {
      organ_voice_changed = true;
    }
    organ_power_on ^= 1;
  }

  input_organ_sawtooth_wave.onclick = () => {
    selected_organ_wave_type = 'sawtooth';
    if (organ_power_on == true) {
      update_organ_audio(selected_organ_wave_type);
    } else {
      organ_voice_changed = true;
    }
    organ_power_on ^= 1;
  }

  for (let i = 0; i < organ_labels.length; i++) {
    organ_labels[i].onclick = () => {
      organ_power_on ^= 1;
    }
  }

  input_organ_volume.onclick = () => {
    organ_power_on ^= 1;
  }

  drawbar_section.onclick = () => {
    organ_power_on ^= 1;
  }

  organ_section.onclick = () => {
    organ_power_on ^= 1;
    if (organ_power_on == true) {
      if (organ_voice_changed == true) {
        organ_voice_changed = false;
        update_organ_audio(selected_organ_wave_type);
      }
      organ_section.classList.remove('voice_off');
      organ_section.classList.add('voice_on');
    } else {
      organ_section.classList.remove('voice_on');
      organ_section.classList.add('voice_off');
    }
  }

  // ------------------------
  // ----- キーの割り当て -----
  // ------------------------

  // キーの割り当てをするための処理群
  // 雑な処理をしてるので，関係ないタイミングでエラーが出る

  let now_setting = false;
  let key_number = -1;
  let key_list_of_play_audio = [];
  let key_list_of_assigned = [-1];
  let using_key_list = [];
  let key_setting_span = document.createElement('span');
  let key_setting_span_innerText = ['ここをクリックするとキーの割り当てを開始します', 'ここをクリックするとキーの割り当てを終了します\nキーを割り振りたい音を選択して割り振りたいキーを押すと登録できます。\nesc, backspaceは割り振れません\nescで終了\n削除したい音を選択してbackspaceを\n押すと割り当てを削除'];
  key_setting_span.innerText = key_setting_span_innerText[0];
  // key_setting_span.style.fontSize = '15px';
  div_key_setting.appendChild(key_setting_span);
  div_key_setting.onclick = () => {
    key_number = -1;
    now_setting ^= 1;
    if (now_setting == true) {
      key_setting_span.innerText = key_setting_span_innerText[1];
    } else {
      key_setting_span.innerText = key_setting_span_innerText[0];
    }
    console.log(key_list_of_play_audio);
  }

  let is_keydowning = false;

  document.onkeydown = (event) => {
    is_keydowning = true;
    if (now_setting == true) {
      if (event.key == 'Escape') {
        div_key_setting.onclick();
      } else if (event.key == 'Backspace') {
        key_list_of_play_audio[key_list_of_assigned[key_number]] = -1;
        key_list_of_assigned[key_number] = -1;
        key_list_span[key_number].innerText = '';
      } else {
        for (let i = 0; i < key_list_of_assigned.length; i++) {
          if (key_list_of_assigned[i] == event.keyCode && i != key_number) {
            alert('同じ文字を違う音に割り振ることはできません。');
            break;
          }
          if (i == key_list_of_assigned.length - 1) {
            key_list_of_play_audio[event.keyCode] = key_number;
            key_list_of_assigned[key_number] = event.keyCode;
            key_list_span[key_number].innerText = event.key;
          }
        }
      }
    } else {
      if (key_list_of_play_audio[event.keyCode] != -1) {
        key_list[key_list_of_play_audio[event.keyCode]].onmousedown();
      }
    }
  }

  document.onkeyup = (event) => {
    is_keydowning = false;
    if (now_setting != true) {
      key_list[key_list_of_play_audio[event.keyCode]].onmouseup();
    }
  }

  console.log(labels);
  console.log(v0_label);

})();