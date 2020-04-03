// TODO: delete this
var users = {
    "adminuser": {
        username: "adminuser",
        password: "p@ssword!",
        email: "admin@example.com",
        isAdmin: true,
        sid: "p3r9ihu6",
        bio: {
            firstName: "Sabrina",
            lastName: "Bryan",
            desc: "Professional procrastinator. Traveller ✈️ Book lover 📖 Obsessed with cheese 🧀. Life's uncertain. Eat dessert first. Sweet as sugar, tough as nails.",
            joinDate: "2020-02-23",
            display: "assets/images/faces/alexandru-zdrobau--djRG1vB1pw-unsplash.jpg"
        }
    },
    "jivanov": {
        username: "jivanov",
        password: "12345abcde!",
        email: "jivanov@example.com",
        isAdmin: false,
        sid: "7pbfhr71",
        bio: {
            firstName: "Janet",
            lastName: "Ivanov",
            desc: "L💖VE is in the air. Gifted napper, talker, and ice cream eater. Probably the best meat eater in the world. In a world where you can be anyone, be yourself.",
            joinDate: "2020-02-25",
            display: "assets/images/faces/igor-rand-Af9YhuGE7Qs-unsplash.jpg"
        }
    },
    "daisyb": {
        username: "daisyb",
        password: "Pa$$w0rd!",
        email: "daisyb@example.com",
        isAdmin: false,
        sid: "v3qbv50i",
        bio: {
            firstName: "Daisy",
            lastName: "Bright",
            desc: "99% caffeine. First I drink the coffee. Then I do the things. A balanced diet is a cookie in each hand. Thanks for checking in!",
            joinDate: "2020-02-24",
            display: "assets/images/faces/conor-obrien-nKZuhvCGGQU-unsplash.jpg"
        }
    },
    "shanef": {
        username: "shanef",
        password: "WhatPassword?",
        email: "shanef@example.com",
        isAdmin: false,
        sid: "zqwgup3u",
        bio: {
            firstName: "Shane",
            lastName: "Fisher",
            desc: "Anything but predictable. This is me. I eat cake for breakfast. In a world where you can be anyone, be yourself.",
            joinDate: "2020-02-27",
            display: "assets/images/faces/stephen-smithgall-vhQZXB5nL3o-unsplash.jpg"
        }
    },
    "alishan": {
        username: "alishan",
        password: "p@ssword",
        email: "alishan@example.com",
        isAdmin: false,
        sid: "iezwvvm4",
        bio: {
            firstName: "Alisha",
            lastName: "Natasha",
            desc: "Recovering ice cream addict. Take care of your body, it’s the only place you have to live. Life's uncertain. Eat dessert first. Spreading smiles. 🍩 worry 🐝 happy.",
            joinDate: "2020-02-23",
            display: "assets/images/faces/alexander-krivitskiy-nz8jK82uF2o-unsplash.jpg"
        }
    }
};

var sessions = {
    "p3r9ihu6": users["adminuser"],
    "7pbfhr71": users["jivanov"],
    "v3qbv50i": users["daisyb"],
    "zqwgup3u": users["shanef"],
    "iezwvvm4": users["alishan"]
};

// source: https://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function fromSession(sid) {
    return sessions[sid];
}

function authenticate(username, password) {
    var user = users[username];
    if (user) {
        if (user.password === password) {
            return user;
        }
    }

    return null;
}
