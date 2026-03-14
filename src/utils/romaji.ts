const romajiToHiragana: Record<string, string> = {
  a: 'あ', i: 'い', u: 'う', e: 'え', o: 'お',
  ka: 'か', ki: 'き', ku: 'く', ke: 'け', ko: 'こ',
  sa: 'さ', si: 'し', su: 'す', se: 'せ', so: 'そ',
  ta: 'た', ti: 'ち', tu: 'つ', te: 'て', to: 'と',
  na: 'な', ni: 'に', nu: 'ぬ', ne: 'ね', no: 'の',
  ha: 'は', hi: 'ひ', hu: 'ふ', he: 'へ', ho: 'ほ',
  ma: 'ま', mi: 'み', mu: 'む', me: 'め', mo: 'も',
  ya: 'や', yu: 'ゆ', yo: 'よ',
  ra: 'ら', ri: 'り', ru: 'る', re: 'れ', ro: 'ろ',
  wa: 'わ', wo: 'を', n: 'ん',
  ga: 'が', gi: 'ぎ', gu: 'ぐ', ge: 'げ', go: 'ご',
  za: 'ざ', zi: 'じ', zu: 'ず', ze: 'ぜ', zo: 'ぞ',
  da: 'だ', di: 'でぃ', du: 'づ', de: 'で', do: 'ど',
  ba: 'ば', bi: 'び', bu: 'ぶ', be: 'べ', bo: 'ぼ',
  pa: 'ぱ', pi: 'ぴ', pu: 'ぷ', pe: 'ぺ', po: 'ぽ',
  kya: 'きゃ', kyu: 'きゅ', kyo: 'きょ',
  sha: 'しゃ', shu: 'しゅ', sho: 'しょ',
  cha: 'ちゃ', chu: 'ちゅ', cho: 'ちょ',
  nya: 'にゃ', nyu: 'にゅ', nyo: 'にょ',
  hya: 'ひゃ', hyu: 'ひゅ', hyo: 'ひょ',
  mya: 'みゃ', myu: 'みゅ', myo: 'みょ',
  rya: 'りゃ', ryu: 'りゅ', ryo: 'りょ',
  gya: 'ぎゃ', gyu: 'ぎゅ', gyo: 'ぎょ',
  ja: 'じゃ', ju: 'じゅ', jo: 'じょ',
  bya: 'びゃ', byu: 'びゅ', byo: 'びょ',
  pya: 'ぴゃ', pyu: 'ぴゅ', pyo: 'ぴょ',
  fa: 'ふぁ', fi: 'ふぃ', fe: 'ふぇ', fo: 'ふぉ',
  wi: 'うぃ', we: 'うぇ',
  va: 'ゔぁ', vi: 'ゔぃ', ve: 'ゔぇ', vo: 'ゔぉ',
};

const romajiToKatakana: Record<string, string> = {};

Object.keys(romajiToHiragana).forEach((key) => {
  romajiToKatakana[key] = romajiToHiragana[key].replace(/[\u3040-\u309f]/g, (char) => {
    const code = char.charCodeAt(0) + 0x60;
    return String.fromCharCode(code);
  });
});

export function romajiToKana(input: string, toHiragana = true): string {
  const map = toHiragana ? romajiToHiragana : romajiToKatakana;
  let result = '';
  let i = 0;
  
  while (i < input.length) {
    let matched = false;
    
    // Try 3-character match first
    if (i + 3 <= input.length) {
      const three = input.slice(i, i + 3).toLowerCase();
      if (map[three]) {
        result += map[three];
        i += 3;
        matched = true;
      }
    }
    
    // Try 2-character match
    if (!matched && i + 2 <= input.length) {
      const two = input.slice(i, i + 2).toLowerCase();
      if (map[two]) {
        result += map[two];
        i += 2;
        matched = true;
      }
    }
    
    // Try 1-character match
    if (!matched) {
      const one = input[i].toLowerCase();
      if (map[one]) {
        result += map[one];
      } else {
        result += input[i];
      }
      i += 1;
    }
  }
  
  return result;
}

export function katakanaToHiragana(input: string): string {
  return input.replace(/[\u30A0-\u30FF]/g, (char) => {
    const code = char.charCodeAt(0) - 0x60;
    return String.fromCharCode(code);
  });
}
