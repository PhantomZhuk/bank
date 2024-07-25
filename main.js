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

let users = JSON.parse(localStorage.getItem('users')) || [];
function UserCard(id, cards, cvv, logins, mm, yy, passwords) {
    let balance = 100;
    let trancactionLimit = 100;
    let historyLogs = [];

    function recordOperation(type, value, time) {
        historyLogs.push({
            operationType: type,
            credits: value,
            operationTime: time
        });
    }

    return {
        getCardOptions() {
            return {
                id,
                balance,
                trancactionLimit,
                historyLogs
            }
        },

        addUser() {
            let user = {
                id,
                cardCost: balance,
                cards,
                cvv,
                logins,
                mm,
                yy,
                passwords
            }

            users.push(user);
            localStorage.setItem('users', JSON.stringify(users));
        },

        putCredits(amount) {
            if (amount <= trancactionLimit) {
                balance += amount
                recordOperation(`Received credits`, amount, new Date().toLocaleString());
            } else {
                console.log(`exceeded limit`)
            }
        },

        takeCredits(amount) {
            if (amount <= trancactionLimit) {
                if (amount <= balance) {
                    balance -= amount;
                    recordOperation('Withdrawal money', amount, new Date().toLocaleString())
                } else {
                    console.log(`sorry not enough money`)
                }
            } else {
                console.log(`exceeded limit`)
            }
        },

        setTransactionLimit(amount) {
            trancactionLimit = amount;
            recordOperation('Change transaction limit', amount, new Date().toLocaleString())
        },

        transferCredits(amount, card) {
            let TAX = 0.005;

            let transferAmount = amount * TAX + amount;

            if (transferAmount <= balance && transferAmount <= trancactionLimit) {
                if (transferAmount <= balance) {
                    this.takeCredits(transferAmount);
                    card.putCredits(amount);
                } else {
                    console.log(`sorry not enough money`);
                }
            } else {
                console.log(`exceeded limit`)
            }
        }
    }
}

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

let i = 1;
$(`#createCard`).click(() => {
    let exists = false;
    for (let el in users) {
        if (users[el].cards == $(`#cardNumber`).val()) {
            exists = true;
            break;
        }
    }
    if (!exists) {
        let correctNumber = false;
        if (/[0-9]/g.test($(`#cardNumber`).val())) {
            correctNumber = true;
        } else {
            correctNumber = false;
        }
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
        if (correctNumber == true && $(`#formYear`).val() && $(`#formMonth`).val() && $(`#formCVV`).val().length == 3 && correctLogin == true && correctPassword == true) {
            let user = new UserCard(i++, $(`#cardNumber`).val(), $(`#formCVV`).val(), $(`#signUpLogin`).val(), $(`#formMonth`).val(), $(`#formYear`).val(), $(`#signUpPassword`).val());
            user.addUser();
            $(`.mainPage`).css(`display`, `flex`);
            $(`.signUpPage`).css(`display`, `none`);
        }
    }
});

$(`#signIn`).click(() => {
    $(`.startPage`).css(`display`, `none`);
    $(`.signInPage`).css(`display`, `flex`);
});

let centerPAN;

$(`#signInBtn`).click(() => {
    let login = $(`#signInLogin`).val();
    let password = $(`#signInPassword`).val();
    let userFound = false;

    for (let user of users) {
        if (login === user.logins && password === user.passwords) {
            userFound = true;
            $(`.mainPage`).css(`display`, `flex`);
            $(`.signInPage`).css(`display`, `none`);
            $(`.notificationContainer`).css(`display`, `none`);
            $(`.fullName`).text(user.logins);
            $(`.month`).text(user.mm);
            $(`.year`).text(user.yy);
            $(`.backCVV`).text(user.cvv);
            $(`.startPAN`).text(user.cards.substring(0, 4));
            $(`.endPAN`).text(user.cards.substring(12, 16));
            centerPAN = user.cards.substring(4, 12)
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

let side = `front`;

$(`.formCard`).mouseenter(() => {
    $(`.front`).css(`transform`, `perspective(600px) rotateY(0deg) rotateX(0deg)`);
    $(`.back`).css(`transform`, `perspective(600px) rotateY(180deg) rotateX(0deg)`);
    $(`.centerPAN`).text(centerPAN);
});

$(`.formCard`).mouseleave(() => {
    $(`.front`).css(`transform`, `perspective(600px) rotateY(0deg) rotateX(30deg)`);
    $(`.back`).css(`transform`, `perspective(600px) rotateY(180deg) rotateX(30deg)`);
    $(`.centerPAN`).text(`########`);
});

$(`.formCard`).click(() => {
    if (side == `front`) {
        $(`.front`).css(`transform`, `perspective(600px) rotateY(180deg) rotateX(0deg)`);
        $(`.back`).css(`transform`, `perspective(600px) rotateY(0deg) rotateX(0deg)`);
        side = `back`
    }else if(side == `back`){
        $(`.front`).css(`transform`, `perspective(600px) rotateY(0deg) rotateX(0deg)`);
        $(`.back`).css(`transform`, `perspective(600px) rotateY(180deg) rotateX(0deg)`);
        side = `front`
    }
});