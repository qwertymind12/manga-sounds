function snd_search() {
    let inputValue = document.getElementById('searchbar').value
    inputValue = inputValue && inputValue.toLowerCase();

    let resultNode = document.getElementById('searchres');
    resultNode.innerHTML = '';

    if (!inputValue) {
        return;
    }

    let matchedIndexes = {};
    let matchingProps = ['snd_ru', 'snd_en', 'snd_hiragana', 'snd_katakana'];

    SOUNDS_DB.forEach(function (sound, index) {
        let isMatched = matchingProps.some(function (key) {
            return sound[key] && sound[key].toLowerCase().includes(inputValue);
        });
        if (!isMatched) {
            return;
        }
        let matchedKey = matchingProps.map(function (key) { return sound[key]; }).filter(Boolean).join(',');
        if (!matchedIndexes[matchedKey]) {
            matchedIndexes[matchedKey] = [index];
        } else {
            matchedIndexes[matchedKey].push(index);
        }
    });

    if (!Object.keys(matchedIndexes).length) {
        resultNode.innerHTML = '<div class="empty">Ничего не найдено</div>';
        return;
    }

    Object.keys(matchedIndexes).forEach(function (matchedKey) {
        let elementContainer = document.createElement('div');
        elementContainer.className += 'elem';

        let sound = SOUNDS_DB[matchedIndexes[matchedKey][0]];

        let primaryTitle = sound.snd_ru;
        let secondaryTitle = [sound.snd_en, sound.snd_hiragana, sound.snd_katakana].filter(Boolean).join(', ');
        elementContainer.innerHTML += '<div class="title"><b>' + primaryTitle + '</b> (' + secondaryTitle + ')';

        matchedIndexes[matchedKey].forEach(function (sndIndex, cntIndex) {
            sound = SOUNDS_DB[sndIndex];

            let prefix = matchedIndexes[matchedKey].length > 1 ? '' + (cntIndex + 1) + '. ' : '';
            ['trans_ru', 'rough', 'exact'].forEach(function (sndKey) {
                let value = sound[sndKey];
                if (value && value !== 'NULL' && value !== '-') {
                    elementContainer.innerHTML += '<div class="' + sndKey + '">' + prefix + value + '</div>';
                    prefix = '';
                }
            });
        });

        resultNode.appendChild(elementContainer);
    });
}

function snd_insertsymb(symb) {
    document.getElementById('searchbar').value += symb;
}

searchbar.onkeydown = function(event) {
    if (event.key === 'Enter') {
        snd_search();
    }
};
