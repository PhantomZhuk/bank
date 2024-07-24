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

$(`#signInBtn`).click(() => {
    for (let user of users) {
        if ($(`#signInLogin`).val() == user.logins && $(`#signInPassword`).val() == user.passwords) {
            $(`.mainPage`).css(`display`, `flex`);
            $(`.signInPage`).css(`display`, `none`);
            $(`.notificationContainer`).css(`display`, `none`);
        } else {
            
        }
    }
});