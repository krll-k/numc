const numcap = require('numcap'),
      fetch = require('node-fetch'),
      express = require('express'),
      app = express()

app.get('/:phone',  function (req,  res) {

var cities =[
    "barnaul", "bryansk", "volgograd", "voronezh", "ekat", "izhevsk", "irkutsk", "yola", "kazan", "kirov", "krsk", "kurgan", "kursk", "lipetsk", "mgn", "chelny", "nn", "omsk", "oren", "penza", "perm", "rostov", "ryazan", "samara", "saratov", "tver", "tomsk", "tula", "tmn", "ulsk", "ufa", "cheb", "chel", "yar"
];

if (/[^0-9]/.test(req.params.phone) == true || req.params.phone.length !== 11) {
    res.send("error")
} else {

let final = cities.map(city => domp(req.params.phone, city))

let ff = {}

Promise.all(final)
    .then(function(responses){
        for (var key in ff) {
            if (0 == parseInt(ff[key])) {
                delete ff[key];
            }
        }
        console.log(ff)
        res.send(ff)
    })

    async function domp(){
        var phone = arguments[0],
            city = arguments[1]

        var data = await fetch("https://api-profile.dom.ru/v1/unauth/contract-asterisked?contact="+phone+"&isActive=0",  {
          "headers": {
            "accept": "application/json,  text/plain,  */*",
            "accept-language": "ru-RU, ru;q=0.9, en-US;q=0.8, en;q=0.7, und;q=0.6, uk;q=0.5", 
            "authorization": "Bearer unauth",
            "cache-control": "no-cache",
            "domain": city,
            "pragma": "no-cache",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-site",
            "Referer": "https://"+city+".dom.ru/",
            "Referrer-Policy": "strict-origin-when-cross-origin"
          },
          "body": null,
          "method": "GET"
        }).then(function(res) {
            return res.json();
        }).then(async function(json) {
            if (json.code == "PARAM_IS_LOCKED") {
                console.log(city)
                reqqqq = await domp(phone, city)
                ff[city] = reqqqq
                return reqqqq
            }
            if (json.contacts.length >0) {
                    if (json.contacts.length >1 ) {
                        let newar = []
                        for (i = 0; json.contacts.length > i; i++) {
                            newar = newar + json.contacts[i].address.split('*').join('') + " | "
                        }
                        return json.contacts.length + "! " + newar
                    }
                return json.contacts[0].address.split('*').join('')
            }
            return json.contacts.length
        });

        ff[city] = data
        return data
    }
}
})


app.get('/r/:phone',  function (req,  res) {

    const finder = new numcap();

    if (req.params.phone.replace(/[^0-9]/g, '').length == 11) {
        finder.getData(req.params.phone,  function (err,  data) {
            console.log(err,  data);
            res.send(data.region)
        });
    } else {
        res.send("error")
    }

})

app.listen(3000)
