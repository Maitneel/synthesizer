(function() {
  'use strict';

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

  function audio_play(n) {
    console.log('onmousedown, pushed by ' + n);
    // TODO
  }

  function audio_stop(n) {
    console.log('mouseout or onmouseup. by ' + n);
    // TODO
  }


})();