$(`#signUp`).click(() => {
    $(`.startPage`).css(`display`, `none`);
    $(`.signUpPage`).css(`display`, `flex`);
});

$(`#formCVV`).mouseenter(() => {
    $(`.front`).css(`transform`, `perspective(600px) rotateY(-180deg)`);
    $(`.back`).css(`transform`, `perspective(600px) rotateY(0deg)`);
});

$(`#formCVV`).mouseleave(() => {
    $(`.front`).css(`transform`, `perspective(600px) rotateY(0deg)`);
    $(`.back`).css(`transform`, `perspective(600px) rotateY(180deg)`);
});

$(`#cardNumber`).on(`input`, () => {
    $(`.PANConatiner`).text($(`#cardNumber`).val());
});

$(`#signUpLogin`).on(`input`, () => {
    $(`.fullName`).text($(`#signUpLogin`).val());
});

$(`#formMonth`).on(`input`, () => {
    $(`.month`).text($(`#formMonth`).val());
});

$(`#formYear`).on(`input`, () => {
    $(`.year`).text($(`#formYear`).val());
});

$(`#formCVV`).on(`input`, () => {
    $(`.backCVV`).text($(`#formCVV`).val());
});

$(`#signIn`).click(() => {
    $(`.startPage`).css(`display`, `none`);
    $(`.signInPage`).css(`display`, `flex`);
});

let side = `front`;

$(`.formCard`).mouseenter(() => {
    $(`#front`).css(`transform`, `perspective(600px) rotateY(0deg) rotateX(0deg)`);
    $(`#back`).css(`transform`, `perspective(600px) rotateY(180deg) rotateX(0deg)`);
    $(`.centerPAN`).text(centerPAN);
});

$(`.formCard`).mouseleave(() => {
    $(`#front`).css(`transform`, `perspective(600px) rotateY(0deg) rotateX(30deg)`);
    $(`#back`).css(`transform`, `perspective(600px) rotateY(180deg) rotateX(30deg)`);
    $(`.centerPAN`).text(`########`);
});

$(`.formCard`).click(() => {
    if (side === `front`) {
        $(`#front`).css(`transform`, `perspective(600px) rotateY(180deg) rotateX(0deg)`);
        $(`#back`).css(`transform`, `perspective(600px) rotateY(0deg) rotateX(0deg)`);
        side = `back`;
    } else if (side === `back`) {
        $(`#front`).css(`transform`, `perspective(600px) rotateY(0deg) rotateX(0deg)`);
        $(`#back`).css(`transform`, `perspective(600px) rotateY(180deg) rotateX(0deg)`);
        side = `front`;
    }
});



let usersLS = JSON.parse(localStorage.getItem(`usersLS`)) || [];

function UserCard(cards, cvv, login, mm, yy, password) {
    let balance = 100;
    let transactionLimit = 100;
    let historyLogs = [];
    let id = usersLS.length > 0 ? usersLS[usersLS.length - 1].id : 0;

    function recordOperation(type, value, time) {
        historyLogs.push({
            operationType: type,
            credits: value,
            operationTime: time
        });
        displayOperations(historyLogs);
    }

    function displayOperations(historyLogs) {
        $(`.historyOperationsContainer`).empty();
        for (let el of historyLogs) {
            $(`.historyOperationsContainer`).append(`
                <div class="historyOperation">
                    <div class="operationType">${el.operationType}</div> 
                    <div class="credits">${el.credits}</div> 
                    <div class="operationTime">${el.operationTime}</div>
                </div>
            `);
        }
    }

    return {
        getCardOptions() {
            id++;
            return {
                id,
                balance,
                transactionLimit,
                historyLogs,
                cards,
                cvv,
                login,
                mm,
                yy,
                password
            };
        },

        addUser() {
            id++;
            let user = {
                id,
                cardCost: balance,
                cards,
                cvv,
                login,
                mm,
                yy,
                password
            };

            usersLS.push(user);
            localStorage.setItem('usersLS', JSON.stringify(usersLS));
        },
    }
}

let user;
$(`#createCard`).click(() => {
    let exists = false;
    for (let el of usersLS) {
        if (el.cards == $(`#cardNumber`).val()) {
            exists = true;
            break;
        }
    }
    if (!exists) {
        let correctNumber = /^[0-9]+$/.test($(`#cardNumber`).val());
        let correctLogin = /^[A-Za-z]{3,}$/.test($(`#signUpLogin`).val());
        let correctPassword = /^[A-Za-z]{6,}$/.test($(`#signUpPassword`).val());

        if (correctNumber && $(`#formYear`).val() && $(`#formMonth`).val() && $(`#formCVV`).val().length == 3 && correctLogin && correctPassword) {
            user = new UserCard($(`#cardNumber`).val(), $(`#formCVV`).val(), $(`#signUpLogin`).val(), $(`#formMonth`).val(), $(`#formYear`).val(), $(`#signUpPassword`).val());
            user.addUser();
            $(`.mainPage`).css(`display`, `flex`);
            $(`.signUpPage`).css(`display`, `none`);
        }
    }
});

let centerPAN;

$(`#signInBtn`).click(() => {
    let login = $(`#signInLogin`).val();
    let password = $(`#signInPassword`).val();
    let userFound = false;

    for (let user of usersLS) {
        if (login === user.login && password === user.password) {
            userFound = true;
            $(`.mainPage`).css(`display`, `flex`);
            $(`.signInPage`).css(`display`, `none`);
            $(`.notificationContainer`).css(`display`, `none`);
            $(`.fullName`).text(user.login);
            $(`.month`).text(user.mm);
            $(`.year`).text(user.yy);
            $(`.backCVV`).text(user.cvv);
            $(`.startPAN`).text(user.cards.substring(0, 4));
            $(`.endPAN`).text(user.cards.substring(12, 16));
            centerPAN = user.cards.substring(4, 12);
            break;
        }
    }

    if (!userFound) {
        $(`.popupNotification`).css(`display`, `flex`);
        $(`#notification`).text(`Login or password is incorrect!`);
        setTimeout(() => {
            $(`.popupNotification`).css(`display`, `none`);
        }, 5000);
    }
});

$(`#homePageBtn`).addClass(`selectedPage`);
$(`#homePageBtn`).click(()=>{
    $(`#homePageBtn`).addClass(`selectedPage`);
    $(`#transfersPageBtn`).removeClass(`selectedPage`);
});

$(`#transfersPageBtn`).click(()=>{
    $(`#homePageBtn`).removeClass(`selectedPage`);
    $(`#transfersPageBtn`).addClass(`selectedPage`);
});