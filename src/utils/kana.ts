export const hiragana: Record<string, string> = {
  // Vowels
  あ: 'a', い: 'i', う: 'u', え: 'e', お: 'o',
  // K-row
  か: 'ka', き: 'ki', く: 'ku', け: 'ke', こ: 'ko',
  // S-row
  さ: 'sa', し: 'shi', す: 'su', せ: 'se', そ: 'so',
  // T-row
  た: 'ta', ち: 'chi', つ: 'tsu', て: 'te', と: 'to',
  // N-row
  な: 'na', に: 'ni', ぬ: 'nu', ね: 'ne', の: 'no',
  // H-row
  は: 'ha', ひ: 'hi', ふ: 'fu', へ: 'he', ほ: 'ho',
  // M-row
  ま: 'ma', み: 'mi', む: 'mu', め: 'me', も: 'mo',
  // Y-row
  や: 'ya', ゆ: 'yu', よ: 'yo',
  // R-row
  ら: 'ra', り: 'ri', る: 'ru', れ: 're', ろ: 'ro',
  // W-row
  わ: 'wa', を: 'wo',
  // N
  ん: 'n',
  // Dakuon
  が: 'ga', ぎ: 'gi', ぐ: 'gu', げ: 'ge', ご: 'go',
  ざ: 'za', じ: 'ji', ず: 'zu', ぜ: 'ze', ぞ: 'zo',
  だ: 'da', ぢ: 'ji', づ: 'zu', で: 'de', ど: 'do',
  ば: 'ba', び: 'bi', ぶ: 'bu', べ: 'be', ぼ: 'bo',
  // Handakuon
  ぱ: 'pa', ぴ: 'pi', ぷ: 'pu', ぺ: 'pe', ぽ: 'po',
};

export const katakana: Record<string, string> = {
  // Vowels
  ア: 'a', イ: 'i', ウ: 'u', エ: 'e', オ: 'o',
  // K-row
  カ: 'ka', キ: 'ki', ク: 'ku', ケ: 'ke', コ: 'ko',
  // S-row
  サ: 'sa', シ: 'shi', ス: 'su', セ: 'se', ソ: 'so',
  // T-row
  タ: 'ta', チ: 'chi', ツ: 'tsu', テ: 'te', ト: 'to',
  // N-row
  ナ: 'na', ニ: 'ni', ヌ: 'nu', ネ: 'ne', ノ: 'no',
  // H-row
  ハ: 'ha', ヒ: 'hi', フ: 'fu', ヘ: 'he', ホ: 'ho',
  // M-row
  マ: 'ma', ミ: 'mi', ム: 'mu', メ: 'me', モ: 'mo',
  // Y-row
  ヤ: 'ya', ユ: 'yu', ヨ: 'yo',
  // R-row
  ラ: 'ra', リ: 'ri', ル: 'ru', レ: 're', ロ: 'ro',
  // W-row
  ワ: 'wa', ヲ: 'wo',
  // N
  ン: 'n',
  // Dakuon
  ガ: 'ga', ギ: 'gi', グ: 'gu', ゲ: 'ge', ゴ: 'go',
  ザ: 'za', ジ: 'ji', ズ: 'zu', ゼ: 'ze', ゾ: 'zo',
  ダ: 'da', ヂ: 'ji', ヅ: 'zu', デ: 'de', ド: 'do',
  バ: 'ba', ビ: 'bi', ブ: 'bu', ベ: 'be', ボ: 'bo',
  // Handakuon
  パ: 'pa', ピ: 'pi', プ: 'pu', ペ: 'pe', ポ: 'po',
};

export type KanaType = 'hiragana' | 'katakana' | 'mixed';

export interface KanaItem {
  symbol: string;
  romaji: string;
  type: 'hiragana' | 'katakana';
}

export function getKanaItems(type: KanaType): KanaItem[] {
  const items: KanaItem[] = [];
  
  if (type === 'hiragana' || type === 'mixed') {
    Object.entries(hiragana).forEach(([symbol, romaji]) => {
      items.push({ symbol, romaji, type: 'hiragana' });
    });
  }
  
  if (type === 'katakana' || type === 'mixed') {
    Object.entries(katakana).forEach(([symbol, romaji]) => {
      items.push({ symbol, romaji, type: 'katakana' });
    });
  }
  
  return items;
}

export function getRandomKana(count: number, type: KanaType = 'mixed'): KanaItem[] {
  const items = getKanaItems(type);
  const shuffled = [...items].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
