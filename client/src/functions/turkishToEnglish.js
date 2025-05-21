const turkishToEnglish=(text)=>{
        var charMap = {
          Ç: 'C',
          Ö: 'O',
          Ş: 'S',
          İ: 'I',
          Ü: 'U',
          Ğ: 'G',
          ç: 'c',
          ö: 'o',
          ş: 's',
          ı: 'i',
          ü: 'u',
          ğ: 'g'
        };
        
        let str_array = text.split('');
    
        for (var i = 0, len = str_array.length; i < len; i++) {
          str_array[i] = charMap[str_array[i]] || str_array[i];
        }
    
        let str = str_array.join('');
        var english = str.replace(/[çöşüğı]/gi, "");
        return english;
}

module.exports=turkishToEnglish;