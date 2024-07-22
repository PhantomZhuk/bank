$(`#signUp`).click(() => {
    $(`.startPage`).css(`display`, `none`);
    $(`.signUpPage`).css(`display`, `flex`);
});

$(`#formCVV`).mouseenter(() => {
    $(`.front`).css(`transform`, `perspective(600px) rotateY(-180deg)`)
    $(`.back`).css(`transform`, `perspective(600px) rotateY(0deg)`)
});

$(`#formCVV`).mouseleave(() => {
    $(`.front`).css(`transform`, `perspective(600px) rotateY(0deg)`)
    $(`.back`).css(`transform`, `perspective(600px) rotateY(180deg)`)
});

$(`#cardNumber`).on(`input`, () => {
    $(`.PANConatiner`).text($(`#cardNumber`).val());
    if ($(`#cardNumber`).val().length > 16) {
        $(`.PANConatiner`).text(`Забагато цифр`);
    }
});

$(`#signUpLogin`).on(`input`, () => {
    $(`.fullName`).text($(`#signUpLogin`).val());
});

$(`#formMonth`).on(`input`, () => {
    $(`#month`).text($(`#formMonth`).val());
});

$(`#formYear`).on(`input`, () => {
    $(`#year`).text($(`#formYear`).val());
});

$(`#formCVV`).on(`input`, () => {
    $(`.backCVV`).text($(`#formCVV`).val());
});

let users = JSON.parse(localStorage.getItem('users')) || [];

function addUser() {
    let correctLogin;
    if (/[A-Za-z]/g.test($(`#signUpLogin`).val()) && $(`#signUpLogin`).val().length >= 3 && !/[!@#$%^&*()_+\-=\|?/><.,`~]/g.test($(`#signUpLogin`).val()) && !/[0-9]/g.test($(`#signUpLogin`).val()) && !/\s/g.test($(`#signUpLogin`).val())) {
        correctLogin = true;
    } else {
        correctLogin = false;
    }
    let correctPassword;
    if (/[A-Za-z]/g.test($(`#signUpPassword`).val()) && $(`#signUpPassword`).val().length >= 6 && !/\s/g.test($(`#signUpPassword`).val())) {
        correctPassword = true;
    } else {
        correctPassword = false;
    }
    if ($(`#cardNumber`).val().length == 16 && $(`#formYear`).val() && $(`#formMonth`).val() && $(`#formCVV`).val().length == 3 && correctLogin == true && correctPassword == true) {
        let user = {
            cardCost: 100,
            cards: $(`#cardNumber`).val(),
            cvv: $(`#formCVV`).val(),
            logins: $(`#signUpLogin`).val(),
            mm: $(`#formMonth`).val(),
            yy: $(`#formYear`).val(),
            passwords: $(`#signUpPassword`).val()
        }

        users.push(user);

        localStorage.setItem('users', JSON.stringify(users));
    }

}

$(`#createCard`).click(() => {
    addUser();
});