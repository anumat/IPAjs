MathJax.Extension["ipa"] = {
  version: "0.0.1"
}


MathJax.Hub.Register.StartupHook("TeX Jax Ready", function() {
	// TEX parser class
	var TEX = MathJax.InputJax.TeX


	// IPA parser class
	var IPA = MathJax.Object.Subclass({
		string: "",   // The \ipa string being parsed.
		i: 0,         // The current position in the string.
		tex: "",      // The processed TeX result.
		ast: [],	  // The AST generated so far.


		/**
		 * Contructor to initialize input string.
		 *
		 * @param {String} string
		 * @api private
		 */

		Init: function(string) {
			this.string = string
		},


		// Unicode characters for output corresponding to small letter input.
		SmallLetterCharacterMap: {
			'a': '0061', // a
			'b': '0062', // b
			'c': '0063', // c
			'd': '0064', // d
			'e': '0065', // e
			'f': '0066', // f
			'g': '0067', // g
			'h': '0068', // h
			'i': '0069', // i
			'j': '006A', // j
			'k': '006B', // k
			'l': '006C', // l
			'm': '006D', // m
			'n': '006E', // n
			'o': '006F', // o
			'p': '0070', // p
			'q': '0071', // q
			'r': '0072', // r
			's': '0073', // s
			't': '0074', // t
			'u': '0075', // u
			'v': '0076', // v
			'w': '0077', // w
			'x': '0078', // x
			'y': '0079', // y
			'z': '007A'  // z
		},


		// Unicode characters for output corresponding to capital letter input.
		CapitalLetterCharacterMap: {
			'A': '0251', // 'ɑ'
			'B': '03B2', // 'β' 
			'C': '0255', // 'ɕ' 
			'D': '00F0', // 'ð' 
			'E': '025B', // 'ε' 
			'F': '03D5', // 'ϕ' 
			'G': '0194', // 'Ɣ' 
			'H': '0266', // 'ɦ'
			'I': '026A', // 'ɪ' 
			'J': '029D', // 'ʝ' 
			'K': '0281', // 'ʁ' 
			'L': '028E', // 'ʎ' 
			'M': '0271', // 'ɱ',
			'N': '014B', // 'ŋ'
			'O': '0254', // 'ɔ' 
			'P': '0294', // 'ʔ' 
			'Q': '0295', // 'ʕ'
			'R': '027E', // 'ɾ' 
			'S': '0283', // 'ʃ' 
			'T': '03F4', // 'ϴ' 
			'U': '028A', // 'ʊ' 
			'V': '028B', // 'ʋ' 
			'W': '026F', // 'ɯ' 
			'X': '03C7', // 'χ' 
			'Y': '028F', // 'ʏ' 
			'Z': '0292'  // 'ʒ' 
		},


		// Unicode characters for output corresponding to numeric input.
		NumberCharacterMap: {
			'0': '0289', // 'ʉ'
			'1': '0268', // 'ɨ' 
			'2': '028C', // 'ʌ'
			'3': '025C', // 'ɜ' 
			'4': '0265', // 'ɥ' 
			'5': '0250', // 'ɐ' 
			'6': '0252', // 'ɒ' 
			'7': '0264', // 'ɤ' 
			'8': '0275', // 'ɵ' 
			'9': '0259'  // 'ɘ' 
		},


		// Unicode characters for output corresponding to punctuation, etc. input
		MiscCharacterMap: {
			'!': '0021',  // !
			'`': '2018',  // ‘
			'\'': '2019', // ’
			'(': '0028',  // (
			')': '0029',  // )
			'*': '002A',  // *
			'+': '002A',  // +
			',': '002C',  // ,
			'-': '002A',  // -
			'/': '002F',  // /
			'=': '002A',  // =
			'?': '003F',  // ?
			'[': '0029',  // [
			']': '005D',  // ]
			':': '02D0',  // ː
			';': '02D1',   // ˑ
			'|': '007C',    // |
			'||': '01C1', // 'ǁ'
			'"': '02C8',    // ˈ
			'""': '02CC',   // ˌ
			'``': '201C',   // “
			'\'\'': '201D',  // ”
			'@': '0259', // 'ə'
			'.': '002E' // '.'
		},


		// Unicode characters for output corresponding to commands starting with '\'.
		MacroMap: {
			'textturna': '0250', // 'ɐ' 
			'textscripta': '0251', // 'ɑ'
			'textturnscripta': '0252', // 'ɒ' 
			'ae': '00E6', // 'æ'
			'textsca': '1D00', // 'ᴀ'
			';A': '1D00', // 'ᴀ'
			'textturnv': '0245', // 'ʌ'
			'textsoftsign': '042C', // 'Ь'
			'texthardsign': '042A', // 'Ъ'
			'texthtb': '0253', // 'ɓ'
			'!b': '0253', // 'ɓ'
			'textscb': '0299', // 'ʙ'
			';B': '0299', // 'ʙ'
			'textcrb': '0180', // 'ƀ' 
			// 'textbarb': '', // 
			'textbeta': '03B2', // 'β' 
			'textbarc': 'A793', // 'ꞓ'
			'texthtc': '0188', // 'ƈ'
			'textctc': '0255', // 'ɕ' 
			'textstretchc': '0297', // 'ʗ'
			'textcrd': '0111', // 'đ'
			// 'textbard': '', // 
			'texthtd': '0257', // 'ɗ'
			'!d': '0257', // 'ɗ'
			'textrtaild': '0256', // 'ɖ'
			':d': '0256', // 'ɖ'
			'textctd': '0221', // 'ȡ'
			'textdzlig': '02A3', // 'ʣ'
			'textdctzlig': '02A5', // 'ʥ'
			'textdyoghlig': '02A4', // ʤ
			'textctdctzlig': ['0221', '0291'], // ȡʑ
			'dh': '00F0', // 'ð' 
			'textschwa': '0259', // 'ə'
			'textrhookschwa': '025A', // 'ɚ'
			'textreve': '0258', // 'ɘ'
			'textsce': '1D07', // 'ᴇ'
			';E': '1D07', // 'ᴇ'
			'textepsilon': '025B', // 'ε' 
			'textcloseepsilon': '029A', // 'ʚ'
			'textrevepsilon': '025C', // 'ɜ' 
			'textrhookrevepsilon': '025D', // 'ɝ'
			'textcloserevepsilon': '025E', // 'ɞ'
			'textg': '0067', // 'g'
			// 'textbarg': 'A7A1', // 'ꞡ'
			'textcrg': '01E5', // 'ǥ'
			'texthtg': '0260', // 'ɠ'
			'!g': '0260', // 'ɠ'
			'textscg': '0262', // 'ɢ'
			';G': '0262', // 'ɢ'
			'texthtscg': '029B', // 'ʛ'
			'!G': '029B', // 'ʛ'
			'textgamma': '0263', // 'ɣ' 
			'textbabygamma': '02E0', // 'ˠ'
			'textramshorns': '0264', // 'ɤ'
			'texthvlig': '0195', // 'ƕ'
			'textcrh': '0127', // 'ħ'
			'texthth': '0266', // 'ɦ'
			'texththeng': '0267', // 'ɧ'
			'textturnh': '0265', // 'ɥ' 
			'textsch': '029C', // 'ʜ'
			';H': '029C', // 'ʜ'
			'i': '0131', // 'ı'
			'textbari': '0268', // 'ɨ' 
			'textiota': '0269', // 'ɩ'
			'textlhti': '027F', // 'ɿ'
			// 'textlhtlongi': '', // 
			'textvibyi': '0285', // 'ʅ'
			'textraisevibyi': '01AA', // 'ƪ'
			'textsci': '026A', // 'ɪ'
			'j': '0237', // 'ȷ' 
			'textctj': '029D', // 'ʝ'
			'textscj': '1D0A', // 'ᴊ'
			';J': '1D0A', // 'ᴊ'
			'textbardotlessj': '025F', // 'ɟ'
			'textObardotlessj': '0248', // 'Ɉ'
			'texthtbardotlessj': '0284', // 'ʄ'
			'!j': '0284', // 'ʄ'
			'texthtk': '0199', // 'ƙ'
			'textturnk': '029E', // 'ʞ'
			'*k': '029E', // 'ʞ'
			'textltilde': '026B', // 'ɫ'
			'|~l': '026B', // 'ɫ'
			'textbarl': '019A', // 'ƚ'
			'textbeltl': '026C', // 'ɬ'
			'textrtaill': '026D', // 'ɭ'
			':l': '026D', // 'ɭ'
			'textlyoghlig': '026E', // 'ɮ'
			'textOlyoghlig': 'A727', // 'ꜧ'
			'textscl': '029F', // 'ʟ'
			';L': '029F', // 'ʟ'
			'textlambda': '03BB', // 'λ'
			'textcrlambda': '019B', // 'ƛ'
			'textltailm': '0271', // 'ɱ' 
			'textturnm': '026F', // 'ɯ' 
			'textturnmrleg': '0270', // 'ɰ'
			'textnrleg': '019E', // 'ƞ'
			'~n': '00F1', // 'ñ',
			'textltailn': '0272', // 'ɲ'
			'ng': '014B', // 'ŋ'
			':n': '0273', // 'ɳ'
			'textrtailn': '0273', // 'ɳ'
			// 'textctn': 'AB3B', // 'ꬻ'
			'textscn': '0274', // 'ɴ'
			';N': '0274', // 'ɴ'
			'textbullseye': '0298', // 'ʘ'
			'!o': '0298', // 'ʘ'
			'textbaro': '0275', // 'ɵ' 
			'o': '00F8', // 'ø'
			'oe': '0153', // 'œ'
			'textscoelig': '0152', // 'Œ'
			'OE': '0152', // 'Œ'
			'textopeno': '0254', // 'ɔ' 
			// 'textturncelig': 'AB62', // 'ꭢ'
			'textomega': '03C9', // 'ω'
			// 'textscomega': 'AB65', // 'ꭥ'
			'textcloseomega': '0277', // 'ɷ'
			'textwynn': '01BF', // 'ƿ'
			'textthorn': '00FE', // 'þ'
			'th': '00FE', // 'þ'
			'texthtp': '01A5', // 'ƥ'
			'textphi': '03D5', // 'ϕ' 
			'texthtq': '02A0', // 'ʠ'
			'textscq': '0051', // 'Q'
			';Q': '0051', // 'Q'
			'textfishhookr': '027E', // 'ɾ' 
			'textlonglegr': '027C', // 'ɼ'
			'textrtailr': '027D', // 'ɽ'
			':r': '027D', // 'ɽ'
			'textturnr': '0279', // 'ɹ'
			'*r': '0279', // 'ɹ'
			'textturnrrtail': '027B', // 'ɻ'
			':R': '027B', // 'ɻ'
			'textturnlonglegr': '027A', // 'ɺ'
			'textscr': '0280', // 'ʀ'
			';R': '0280', // 'ʀ'
			'textinvscr': '0281', // 'ʁ' 
			'textrtails': '023F', // 'ȿ'
			':s': '023F', // 'ȿ'
			'textesh': '0283', // 'ʃ' 
			// 'textdoublebaresh': '0284', // 'ʄ'
			'textctesh': '0286', // 'ʆ'
			'texthtt': '01AD', // 'ƭ'
			'textlhookt': '01AB', // 'ƫ'
			'textrtailt': '0288', // 'ʈ'
			':t': '0288', // 'ʈ'
			'texttctclig': '02A8', // 'ʨ'
			'texttslig': '02A6', // 'ʦ'
			'textteshlig': '02A7', // 'ʧ'
			'textturnt': '0287', // 'ʇ'
			'*t': '0287', // 'ʇ'
			'textctt': '0236', // 'ȶ'
			'textcttctclig': ['0236', '0255'], // 'ȶɕ'
			'texttheta': '03F4', // 'ϴ' 
			'textbaru': '0289', // 'ʉ'
			'textupsilon': '028A', // 'ʊ'
			'textscu': '1D1C', // 'ᴜ'
			';U': '1D1C', // 'ᴜ'
			'textscriptv': '028B', // 'ʋ' 
			'textturnw': '028D', // 'ʍ'
			'*w': '028D', // 'ʍ'
			'textchi': '03C7', // 'χ' 
			'textturny': '028E', // 'ʎ'
			'textscy': '028F', // 'ʏ' 
			'textvibyy': '02AE', // 'ʮ'
			'textcommatailz': '0225', // 'ȥ'
			'textctz': '0291', // 'ʑ'
			'textrevyogh': '01B9', // 'ƹ'
			'textrtailz': '0290', // 'ʐ'
			':z': '0290', // 'ʐ'
			'textyogh': '0292', // 'ʒ' 
			'textctyogh': '0293', // 'ʓ'
			'textcrtwo': '01BB', // 'ƻ'
			'textglotstop': '0294', // 'ʔ' 
			'textraiseglotstop': '0242', // 'ɂ'
			'textbarglotstop': '02A1', // 'ʡ'
			'textinvglotstop': '0296', // 'ʖ'
			'textcrinvglotstop': '01BE', // 'ƾ'
			'textrevglotstop': '0295', // 'ʕ'
			'textbarrevglotstop': '02A2', // 'ʢ'
			'textpipe': '007C',    // |
			'textdoublebarpipe': '01C2', // ǂ
			'textdoublebarslash': '2260', // ≠
			'textdoublepipe': '01C1', // 'ǁ'
			'textprimstress': '02C8',    // ˈ
			'textsecstress': '02CC',   // ˌ 
			'textlengthmark': '02D0',  // ː
			'texthalflength': '02D1',  // ˑ
			'textvertline': '007C', // '|'
			'textdoublevertline': '2016', // '‖'
			't*': {
				accent: '035D', // '͝'
				location: "below",
				macro: "t*"
			},
			'textbottomtiebar': '035C', // '͜'
			'textglobfall': '2198', // '↘'
			'textglobrise': '2197', // '↗'
			'textdownstep': '2193', // '↓'
			'textupstep': '2191', // '↑'
			'`': {
				// accent: '0060', // `
				location: "above",
				macro: 'grave'
			}, 
			'\'': {
				// accent: '00B4', // 
				location: "above",
				macro: 'acute'
			},
			'^': {
				// accent: '',
				location: "above",
				macro: 'hat'
			},
			'~': {
				// accent: '0334', // ̴
				location: "above",
				macro: "tilde"
			},
			'"': {
				// accent: '0308', // ̈
				location: "above",
				macro: 'ddot'
			},
			'H': {
				accent: '02DD', // ˝
				location: "above",
				macro: "H"
			},
			'r': {
				accent: '030A', // ̊
				location: "above",
				macro: "r"
			},
			'v': {
				// accent: '02C7', // ˇ
				location: "above",
				macro: "check"
			},
			'u': {
				// accent: '',
				location: "above",
				macro: "breve"
			},
			'=': {
				// accent: '00AF',
				location: "above",
				macro: "bar"
			},
			'.': {
				// accent: '',
				location: "above",
				macro: "dot"
			},
			'c': {
				accent: '00B8', // ¸
				location: "below",
				macro: 'c'
			},
			'k': {
				accent: '02DB', // ˛
				location: "below",
				macro: 'k'
			},
			'textpolhook': {
				accent: '02DB', // ˛
				location: "below",
				macro: 'k'
			},
			'textdoublegrave': {
				accent: '030F', // ̏
				location: "above",
				macro: "textdoublegrave"
			},
			'H*': {
				accent: '030F', // ̏
				location: "above",
				macro: "textdoublegrave"
			},
			'textsubgrave': {
				accent: '0316', // ̖
				location: "below",
				macro: "textsubgrave"
			},
			'`*': {
				accent: '0316', // ̖
				location: "below",
				macro: "textsubgrave"
			},
			'textsubacute': {
				accent: '0317', // ̗
				location: "below",
				macro: "textsubacute"
			},
			'\'*': {
				accent: '0317', // ̗
				location: "below",
				macro: "textsubacute"
			},
			'textsubcircum': {
				accent: '032D', // ̭
				location: "below",
				macro: "textsubcircum"
			},
			'^*': {
				accent: '032D', // ̭
				location: "below",
				macro: "textsubcircum"
			},
			'|c': {
				accent: '0311', // ̑
				location: "above",
				macro: "textroundcap"
			},
			'textroundcap': {
				accent: '0311', // ̑
				location: "above",
				macro: "textroundcap"
			},
			'textacutemacron': {
				// accent: '',
				location: "combination",
				macro: ["acute", "bar"]
			},
			'\'=': {
				// accent: '',
				location: "combination",
				macro: ["acute", "bar"]
			},
			'textvbaraccent': {
				accent: '030D', // '̍'
				location: "above",
				macro: "textvbaraccent"
			},
			'textdoublevbaraccent': {
				accent: '030E', // '̎'
				location: "above",
				macro: "textdoublevbaraccent"
			},
			'textgravedot': {
				accent: ['0316', '0323'],
				location: "above",
				macro: "textgravedot"
			},
			'`.': {
				accent: ['0316', '0323'],
				location: "above",
				macro: "textgravedot"
			},
			'textdotacute': {
				accent: ['0323', '0317'],
				location: "above",
				macro: "textdotacute"
			},
			'\'.': {
				accent: ['0323', '0317'],
				location: "above",
				macro: "textdotacute"
			},
			'textcircumdot': {
				// accent: '',
				location: "combination",
				macro: ["hat", "dot"]
			},
			'^.': {
				// accent: '',
				location: "combination",
				macro: ["hat", "dot"]
			},
			'texttildedot': {
				// accent: '2E1F', // ⸟
				location: "combination",
				macro: ["tilde", "dot"]
			},
			'~.': {
				accent: '2E1F', // ⸟
				location: "above",
				macro: "texttildedot"
			},
			'textbrevemacron': {
				// accent: '',
				location: "combination",
				macro: ["breve", "bar"]
			},
			'u=': {
				// accent: '',
				location: "combination",
				macro: ["breve", "bar"]
			},
			'textringmacron': {
				// accent: '',
				location: "combination",
				macro: ["ring", "bar"]
			},
			'r=': {
				// accent: '',
				location: "combination",
				macro: ["ring", "bar"]
			},
			'textacutewedge': {
				// accent: '',
				location: "combination",
				macro: ["acutebelow", "check"]
			},
			'v\'': {
				// accent: '',
				location: "combination",
				macro: ["acutebelow", "check"]
			},
			'textdotbreve': {
				accent: '0310', // ̐
				location: "above",
				macro: "textdotbreve"
			},
			'textsubbridge': {
				accent: '032A', // ̪
				location: "below",
				macro: "textsubbridge"
			},
			'|[': {
				accent: '032A', // ̪
				location: "below",
				macro: "textsubbridge"
			},
			'textinvsubbridge': {
				accent: '033A', // ̺
				location: "below",
				macro: "textinvsubbridge"
			},
			'|]': {
				accent: '033A', // ̺
				location: "below",
				macro: "textinvsubbridge"
			},
			'textsubsquare': {
				accent: '033B', // ̻
				location: "below",
				macro: "textsubsquare"
			},
			'textsubrhalfring': {
				accent: '02D2', // ˒
				location: "below",
				macro: "textsubrhalfring"
			},
			'|)': {
				accent: '02D2', // ˒
				location: "below",
				macro: "textsubrhalfring"
			},
			'textsublhalfring': {
				accent: '02D3', // ˓
				location: "below",
				macro: "textsublhalfring"
			},
			'|(': {
				accent: '02D3', // ˓
				location: "below",
				macro: "textsublhalfring"
			},
			'(|w': {
				accent: '032B', // ̫
				location: "below",
				macro: "textsubw"
			},
			'textsubw': {
				accent: '032B', // ̫
				location: "below",
				macro: "textsubw"
			},
			'textoverw': {
				accent: '032B', // ̫
				location: "above",
				macro: "textoverw"
			},
			'|m': {
				accent: '033C', // ̼
				location: "below",
				macro: "textseagull"
			},
			'textseagull': {
				accent: '033C', // ̼
				location: "below",
				macro: "textseagull"
			},
			'textovercross': {
				accent: '033D', // ̽
				location: "above",
				macro: "textovercross"
			},
			'|x': {
				accent: '033D', // ̽
				location: "above",
				macro: "textovercross"
			},
			'textsubplus': {
				accent: '02D6', // ˖
				location: "below",
				macro: "textsubplus"
			},
			'|+': {
				accent: '02D6', // ˖
				location: "below",
				macro: "textsubplus"
			},
			'textraising': {
				accent: '02D4', // ˔
				location: "below",
				macro: "textraising"
			},
			'|\'': {
				accent: '02D4', // ˔
				location: "below",
				macro: "textraising"
			},
			'textlowering': {
				accent: '02D5', // ˕
				location: "below",
				macro: "textlowering"
			},
			'|`': {
				accent: '02D5', // ˕
				location: "below",
				macro: "textlowering"
			},
			'textadvancing': {
				accent: '0318', // ̘
				location: "below",
				macro: "textadvancing"
			},
			'|<': {
				accent: '0318', // ̘
				location: "below",
				macro: "textadvancing"
			},
			'textretracting': {
				accent: '0319', // ̙
				location: "below",
				macro: "textretracting"
			},
			'|>': {
				accent: '0319', // ̙
				location: "below",
				macro: "textretracting"
			},
			'textsubtilde': {
				accent: '007E', // ~
				location: "below",
				macro: "textsubtilde"
			},
			'~*': {
				accent: '007E', // ~
				location: "below",
				macro: "textsubtilde"
			},
			'textsubumlaut': {
				accent: '00A8', // ¨
				location: "below",
				macro: "textsubumlaut"
			},
			'"*': {
				accent: '00A8', // ¨
				location: "below",
				macro: "textsubumlaut"
			},
			'textsubring': {
				accent: '02F3', // ˳
				location: "below",
				macro: "textsubring"
			},
			'r*': {
				accent: '02F3', // ˳
				location: "below",
				macro: "textsubring"
			},
			'textsubwedge': {
				accent: '02C7', // ˇ
				location: "below",
				macro: "textsubwedge"
			},
			'v*': {
				accent: '02C7', // ˇ
				location: "below",
				macro: "textsubwedge"
			},
			'textsubbar': {
				accent: '00AF', // ¯
				location: "below",
				macro: "textsubbar"
			},
			'=*': {
				accent: '00AF', // ¯
				location: "below",
				macro: "textsubbar"
			},
			'textsubdot': {
				accent: '02D9', // ˙
				location: "below",
				macro: "textsubdot"
			},
			'.*': {
				accent: '02D9', // ˙
				location: "below",
				macro: "textsubdot"
			},
			'textsubarch': {
				accent: '0361', // ͡
				location: "below",
				macro: "textsubarch"
			},
			's': {
				accent: '030D', // ̩
				location: "below",
				macro: "textsyllabic"
			},
			'textsyllabic': {
				accent: '030D', // ̩
				location: "below",
				macro: "textsyllabic"
			},
			// 'textsuperimposetilde': {
			// 	accent: '',
			// 	location: "below"
			// },
			// '|~': {
			// 	accent: '',
			// 	location: "below"
			// },
			'textcorner': '02FA', // ˺
			'textopencorner': '02F9', // ˹
			'rhoticity': '02DE', // ˞
			'textceltpal': '02B9', // ʹ
			'textlptr': '1DFE', // ᷾
			'textrptr': '0350', // ͐
			// 'textrectangle': '', // 
			't': {
				accent: '0361', // ͡
				location: "above",
				macro: "texttoptiebar"
			},
			'texttoptiebar': {
				accent: '0361', // ͡
				location: "above",
				macro: "texttoptiebar"
			},
			'textrevapostrophe': '02BD', // ʽ
			// 'texthooktop': '', // 
			'textrthook': '0322', // ̢
			'textpalhook': '0321', // ̡
			'%': '0321', // ̡
			'textsuperscript': {
				// accent: '',
				location: "raise"
			},
			'&': '007E', // ~
			'$': '0024', // $
			'_': '005F' // _
		},


		/**
		 * Generate AST for string starting from `start` until `end`
		 * 
		 * @param {Int} start
		 * @param {Int} end
		 * @return {Array}
		 * @api private 
		 */

		GenerateAST: function(start, end) {
			var index = start
			var ast = []
			var cur = []
			while (index < end) {
				var c = this.string.charAt(index)
				if (c.match(/[a-z]/)) {
					cur.push(this.ParseSmallLetter(c))
				}
				else if (c.match(/[A-Z]/)) {
					cur.push(this.ParseCapitalLetter(c))
				}
				else if (c.match(/[0-9]/)) {
					cur.push(this.ParseNumber(c))
				}
				else if (c.match(/[`\"\'@!()\*+,-\/=?\[\]]/)) {
					var ret = this.ParseMiscCharacter(index)
					cur.push(ret[0])
					index = ret[1]
				}
				else if (c == '\\') {
					var ret = this.ParseMacro(index)
					cur.push(ret[0])
					index = ret[1]
				}
				else {
					cur.push(this.ParseSpace())
				}
				index++
			}
			for (var i = 0; i < cur.length; i++) {
				var subtree = cur[i]
				ast.push(subtree)
			}
			cur = []
			return ast
		},


		/**
		 * Add IPA macros from `MacroMap` to `TEX` definitions object.
		 *
		 * @api private
		 */

		AddMacros: function() {
			for (var macroKey in this.MacroMap) {
				var macro = this.MacroMap[macroKey]
				if (macro.accent && macro.accent.constructor === Array) {
					var accents = "\\kern2pt"
					for (var i = 0; i < macro.accent.length; i++) {
					 	accents += "\\kern2pt \\unicode{x" + macro.accent[i] + "}"
					} 
					MathJax.InputJax.TeX.Definitions.macros[macro.macro] = ['Macro','\\mathop{#1}\\limits^{\\textstyle' + accents + '}', 1]
					continue
				}
				if (macro.accent && macro.location === "above") {
					MathJax.InputJax.TeX.Definitions.macros[macro.macro] = ["Accent", macro.accent]
				}
				else if (macro.location === "below") {
					MathJax.InputJax.TeX.Definitions.macros["u" + macro.macro] = ["UnderOver", macro.accent]
				}
			}
			MathJax.InputJax.TeX.Definitions.macros["ring"] = ["Accent", "02F3"]
			MathJax.InputJax.TeX.Definitions.macros["acutebelow"] = ["Accent", "0317"]
		},


		/**
		 * Generate AST for \ipa{`string`} and return compiled TeX.
		 * 
		 * @return {String}
		 * @api private
		 */

		Execute: function() {
			this.AddMacros()
			this.tex = ""
			this.ast = this.GenerateAST(0, this.string.length)
			for (var i = 0; i < this.ast.length; i++) {
				var elem = this.ast[i]
				this.tex += this.Eval(elem)
			}
			return this.tex
		},


		/**
		 * Evaluate AST `ast` and return corresponding TeX.
		 * 
		 * @param {Array} ast
		 * @return {String}
		 * @api private
		 */

		Eval: function(ast) {
			switch (ast.type) {
				case "SimpleChar":
					return "\\unicode{x" + ast.val + "}"
				case "Macro":
					var innerMacro = ""
					for (var i = 0; i < ast.children.length; i++) {
						innerMacro += this.Eval(ast.children[i])
					}
					if (ast.val.macro && ast.val.macro.constructor === Array) {
						var tex = ""
						for (var i = 0; i < ast.val.macro.length; i++) {
							tex += "\\" + ast.val.macro[i] + "{"
						}
						tex += innerMacro
						for (var i = 0; i < ast.val.macro.length; i++) {
							tex += "}"
						}
						return tex
					}
					if (ast.val.location === "raise") {
						return "^{" + innerMacro + "}"
					}
					else if (ast.val.location === "above") {
						return "\\" + ast.val.macro + "{" + innerMacro + "}"

					} else if (ast.val.location === "below") {
						// Cedilla 
						if (ast.val.macro === "c") {
							if (innerMacro === "\\unicode{x0063}") 
								return "\\unicode{x00E7}" // c
							else if (innerMacro === "\\unicode{x0255}") 
								return "\\unicode{x00C7}" // C
							else if (innerMacro === "\\unicode{x0065}") 
								return "\\unicode{x0229}" // e
							else if (innerMacro === "\\unicode{x025B}") 
								return "\\unicode{x0228}" // E
							else if (innerMacro === "\\unicode{x0068}") 
								return "\\unicode{x1E29}" // h
							else if (innerMacro === "\\unicode{x0266}") 
								return "\\unicode{x1E28}" // H
							else if (innerMacro === "\\unicode{x0073}") 
								return "\\unicode{x015F}" // s
							else if (innerMacro === "\\unicode{x0283}") 
								return "\\unicode{x015E}" // S
							else if (innerMacro === "\\unicode{x0074}") 
								return "\\unicode{x0163}" // t
							else if (innerMacro === "\\unicode{03F4}") 
								return "\\unicode{x0162}" // T
						} 
						return "\\u" + ast.val.macro + "{" + innerMacro + "}"
					}
				case "MacroSymbol":
					if (ast.val && ast.val.constructor === Array) {
						var tex = ""
						for (var i = 0; i < ast.val.length; i++) {
							tex += "\\unicode{x" + ast.val[i] + "} \\kern-1pt"
						}
						return tex
					}
					return "\\unicode{x" + ast.val + "}"
				case "Space":
					return ""
			}
		},

		/**
		 * Create token to add to AST.
		 *
		 * @param {String} val The unicode value of the symbol 
		 * @param {String} type The type of the symbol (`Macro`, `MacroSymbol`, `Space`, `SimpleChar`)
		 * @param {Array} children The children of the current token, used for macros
		 * @return {Object} 
		 * @api private
		 */ 

		createSymbol: function(val, type, children) {
			return {
				val: val,
				type: type,
				children: children
			}
		},

		/**
		 * Parse a small letter input.
		 * 
		 * @param {String} c
		 * @return {Object} The token for small character with its unicode value
		 * @api private  
		 */

		ParseSmallLetter: function(c) {
			var val = this.SmallLetterCharacterMap[c]
			this.i++
			return this.createSymbol(val, "SimpleChar", [])
		},

		/**
		 * Parse a capital letter input.
		 * 
		 * @param {String} c
		 * @return {Object} The token for capital character with its unicode value
		 * @api private  
		 */

		ParseCapitalLetter: function(c) {
			var val = this.CapitalLetterCharacterMap[c]
			this.i++
			return this.createSymbol(val, "SimpleChar", [])
		},

		/**
		 * Find position of correpoding matching closing '{' for a macro from starting position `start`.
		 * 
		 * @param {Int} start
		 * @return {Int}
		 * @api private  
		 */

		 ParseNumber: function(c) {
			var val = this.NumberCharacterMap[c]
			this.i++
			return this.createSymbol(val, "SimpleChar", [])
		},

		/**
		 * Find position of correpoding matching closing '{' for a macro from starting position `start`.
		 * 
		 * @param {Int} start
		 * @return {Int}
		 * @api private  
		 */

		findMatchingBracket: function(start) {
			var counter = 0
			var pos = start
			for (var i = start; i < this.string.length; i++) {
				if (this.string[i] == '{') counter++
				if (this.string[i] == '}') counter--
				if (counter == 0) {
					pos = i
					break
				}
			}
			if (counter != 0 || pos === start) {
				TEX.Error(["MissingCloseBrace", "Missing closing brace."])
			}
			return pos
		},


		/**
		 * Parse a macro input.
		 * 
		 * @param {Int} start
		 * @return {Object} The token for macro with its unicode value and inner children 
		 * @api private  
		 */

		ParseMacro: function(start) {
			var macro = ""
			var macroStart = start + 1
			var currentIndex = macroStart
			while (currentIndex < this.string.length) {
				if (this.string[currentIndex] === '{' || this.string[currentIndex] === ' ' || this.string[currentIndex] === '}' || this.string[currentIndex] === '\\') {
					break
				}
				currentIndex++
			}
			var macroEnd = currentIndex
			macro = this.string.substr(macroStart, macroEnd - macroStart)
			if (!this.MacroMap[macro]) {
				TEX.Error(["UnrecognizedCommand"]["Don't support command: \'\\" + macro + "\'"])
			}

			var endingPosition = -1
			var children = []
			if (this.string[macroEnd] === '{') {
				endingPosition = this.findMatchingBracket(macroEnd)
				var internalMacroAST = this.GenerateAST(macroEnd + 1, endingPosition)
				for (var i = 0; i < internalMacroAST.length; i++) {
					children.push(internalMacroAST[i])
				}
			} else if (this.string[macroEnd] === ' ' || this.string[macroEnd] === '}') {
				endingPosition = macroEnd
			} else if(this.string[macroEnd] === '\\') {
				endingPosition = macroEnd - 1
			} else {
				endingPosition = currentIndex
			}

			this.i = endingPosition++
			if (children.length > 0)
				return [this.createSymbol(this.MacroMap[macro], "Macro", children), this.i]
			return [this.createSymbol(this.MacroMap[macro], "MacroSymbol", children), this.i]
		},


		/**
		 * Parse a miscellaneous character input.
		 * 
		 * @param {Int} i
		 * @return {Object} The token for the character with its unicode value
		 * @api private  
		 */

		ParseMiscCharacter: function(i) { 
			var f = this.string.charAt(i)
			if (i < this.string.length - 1 && f === this.string.charAt(i + 1)) {
				var s = this.string.charAt(i + 1)
				var symbol = "" + f + s
				if (this.MiscCharacterMap[symbol]) {
					i++
					return [this.createSymbol(this.MiscCharacterMap[symbol], "SimpleChar", []), i++]
				} else {
					return [this.createSymbol(this.MiscCharacterMap[f], "SimpleChar", []), i++]
				}
			}
			return [this.createSymbol(this.MiscCharacterMap[f], "SimpleChar", []), i++]
		},


		/**
		 * Parse a space character.
		 * 
		 * @return {Object} The token for space with no unicode value
		 * @api private  
		 */

		ParseSpace: function() {
			return this.createSymbol(' ', "Space", [])
		}
	})

	// Expose IPA.
	MathJax.Extension["ipa"].IPA = IPA

	/**
	 * Add IPA parsing macros to TEX.
	 * 
	 * @api private 
	 */
	TEX.Definitions.Add({
		macros: {
			textipa: 'IPA',
			tipa: 'IPA',
			ipa: 'IPA'
		}
	}, null, true)

	TEX.Parse.Augment({

		/**
		 * Implements \ipa and friends for input `name`.
		 *
		 * @param {String} name
		 * @api private
		 */

		IPA: function(name) {
			var arg = this.GetArgument(name).trim()
			var tex = IPA(arg).Execute()
			this.string = tex + this.string.substr(this.i)
			this.i = 0
		}
	})

	// IPA ready.
	MathJax.Hub.Startup.signal.Post("IPA Ready")
})

MathJax.Ajax.loadComplete("[MathJax]/extensions/ipa.js")