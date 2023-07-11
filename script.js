const fromLang = document.querySelector('#from-lang');
const toLang = document.querySelector('#to-lang');
const fromText = document.querySelector('#from-text');
const toText = document.querySelector('#to-text');
const btnTranslate = document.querySelector('#btnTranslate');
const exchange = document.querySelector('.exchange i');
const icons = document.querySelectorAll('.icons');

const snackBar = msg => {
    const snackBar = document.querySelector("#snackbar");
    snackBar.innerText = msg;
    snackBar.className = "show";
    setTimeout(() => { snackBar.className = snackBar.className.replace('show', ''); snackBar.innerText = ''; }, 3000);
}

let options = '';

for (const lang in languages)
    options += `<option value="${lang}">${languages[lang]}</option>`;

fromLang.innerHTML = options;
toLang.innerHTML = options;

fromLang.value = 'az-AZ';
toLang.value = 'en-GB';

btnTranslate.addEventListener('click', e => {

    const btn = e.target;

    btn.disabled = true;
    btn.innerHTML = '<div class="lds-dual-ring"></div>';

    setTimeout(() => {
        try {
            const q = fromText.value.trim();
            const firstLang = fromLang.value.trim();
            const secondLang = toLang.value.trim();

            if(!q) {
                throw new Error('Do not leave empty field');
            }

            if(typeof languages[firstLang] === 'undefined') {
                throw new Error('First language is not found');
            }

            if(typeof languages[secondLang] === 'undefined') {
                throw new Error('Secondary language is not found');
            }

            const url = `https://api.mymemory.translated.net/get?q=${q}&langpair=${firstLang}|${secondLang}`;

            fetch(url)
                .then(res => res.json())
                .then(data => {
                    //console.log(data);
                    const msg = data.responseData.translatedText;
                    if(data.responseStatus !== 200) {
                        throw new Error(msg);
                    }
                    toText.value = data.responseData.translatedText;
                })
                .catch(err => {
                    snackBar(err.message);
                });
        }
        catch (err) {
            snackBar(err.message);
        }

        btn.disabled = false;
        btn.innerHTML = 'Translate';
    }, 1500);
});

exchange.addEventListener('click', () => {
    const prevLang = fromLang.value;
    fromLang.value = toLang.value;
    toLang.value = prevLang;

    const prevText = fromText.value;
    fromText.value = toText.value;
    toText.value = prevText;
});

icons.forEach((icon) => {
    icon.addEventListener('click', e => {
        if(e.target.classList.contains('fa-copy')) {
            let value;
            if(e.target.id === 'from-copy') value = fromText.value.trim();
            else value = toText.value.trim();
            if(value) {
                navigator.clipboard.writeText(value);
                snackBar('Text copied');
            }
        }
        else {
            let valueLang, valueText;
            if(e.target.id === 'from-volume') {
                valueLang = fromLang.value;
                valueText = fromText.value.trim();
            }
            else {
                valueLang = toLang.value;
                valueText = toText.value.trim();
            }
            if(typeof languages[valueLang] !== 'undefined' && valueText) {
                const speakData = new SpeechSynthesisUtterance();
                speakData.lang = valueLang;
                speakData.text = valueText;
                speechSynthesis.speak(speakData);
            }
        }
    });
});