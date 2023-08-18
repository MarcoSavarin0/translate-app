const { response } = require('express');
const fetch = require('node-fetch')
require('dotenv').config();
const languageNames = {
    en: "English",
    es: "Spanish",
    fr: "French",
    de: "German",
    it: "Italian",
    pt: "Portuguese",
    ar: "Arabic",
    zh: "Chinese",
    ja: "Japanese",
    ko: "Korean",
    ru: "Russian",
    nl: "Dutch",
    sv: "Swedish",
    fi: "Finnish",
    da: "Danish",
    no: "Norwegian",
    pl: "Polish",
    tr: "Turkish",
    uk: "Ukrainian",
    el: "Greek",
    he: "Hebrew",
    id: "Indonesian",
    ms: "Malay",
    th: "Thai",
    vi: "Vietnamese",
    cs: "Czech",
    hu: "Hungarian",
    ro: "Romanian",
    sk: "Slovak",
    bg: "Bulgarian",
    hr: "Croatian",
    sl: "Slovenian",
    et: "Estonian",
    lv: "Latvian",
    lt: "Lithuanian",
    sr: "Serbian",
    is: "Icelandic",
    ga: "Irish",
    cy: "Welsh",
};
async function getLanguageNamesArray() {
    try {
        const response = await fetch('https://google-translate1.p.rapidapi.com/language/translate/v2/languages', {
            method: 'GET',
            headers: {
                'Accept-Encoding': 'application/gzip',
                'X-RapidAPI-Key': process.env.API_KEY,
                'X-RapidAPI-Host': process.env.API_HOST
            }
        });

        const data = await response.json();
        const languageCodes = data.data.languages.map(language => language.language);
        const languageNamesArray = languageCodes.map(code => languageNames[code] || code);
        return languageNamesArray;
    } catch (error) {
        console.error('Error:', error);
        return [];
    }
}

async function fetchApi(optionsBody, metodo){
    try{ 
    const response = await fetch('https://google-translate1.p.rapidapi.com/language/translate/v2',{
        method: metodo,
        headers:{
            'content-type': 'application/x-www-form-urlencoded',
            'Accept-Encoding': 'application/gzip',
            'X-RapidAPI-Key': process.env.API_KEY,
            'X-RapidAPI-Host': process.env.API_HOST
        },
        body: optionsBody
    })
    const data = await response.json();
    return data;
    }catch (error) {
        console.error("Error fetching video:", error);
        return null;
    }
}


module.exports = {
    index: async function(req,res){
        try {
            const select_textToTranslate = '';
            const select_textTranslate = '';
            const languageNamesArray = await getLanguageNamesArray();
            console.log(languageNamesArray[3]);
            res.render('index', { traducido: true, paises: languageNamesArray,select_textTranslate, select_textToTranslate  });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).send('Internal Server Error');
        }
        
    },
    translate: async function(req,res){
        try {
            const languageNamesArray = await getLanguageNamesArray();
    
            const select_textToTranslate = req.body.select_textToTranslate;
            const select_textTranslate = req.body.select_textTranslate;
    
         
            const selectedSourceLang = Object.keys(languageNames).find(key => languageNames[key] === select_textToTranslate);
            const selectedTargetLang = Object.keys(languageNames).find(key => languageNames[key] === select_textTranslate);
    
            const textToTranslate = req.body.textToTranslate;
            const encodedParams = new URLSearchParams();
            encodedParams.set('q', textToTranslate);
            encodedParams.set('target', selectedTargetLang);
            encodedParams.set('source', selectedSourceLang);
    
            fetchApi(encodedParams, 'POST')
                .then(result => {
                    if (result && result.data && result.data.translations && result.data.translations[0] && result.data.translations[0].translatedText.length > 0) {
                        res.render('index', { traducido: true, textoTraducido: result.data.translations[0].translatedText, old: textToTranslate, paises: languageNamesArray, select_textTranslate, select_textToTranslate });
                    } else {
                        res.render('index', { traducido: false, paises: languageNamesArray });
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    res.status(500).send('Internal Server Error');
                });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).send('Internal Server Error');
        }
    }
}