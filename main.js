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

function displayNotification(text) {
    $(`.popupNotification`).css(`display`, `flex`);
    $(`#notification`).text(text);
    setTimeout(() => {
        $(`.popupNotification`).css(`display`, `none`);
    }, 5000);
}

let usersLS = JSON.parse(localStorage.getItem('usersLS')) || [];

// Функція для генерації нового унікального ID
function generateNewId() {
    if (usersLS.length === 0) {
        return 1;
    }
    const maxId = Math.max(...usersLS.map(user => user.id));
    return maxId + 1;
}

function UserCard(cards, cvv, login, mm, yy, password, id, userBalance = 100) {
    if (id === undefined) {
        id = generateNewId();
    }

    let balance = userBalance;
    let transactionLimit = 100;
    let historyLogs = [];

    let storedUser = usersLS.find(user => user.id === id);
    if (storedUser) {
        balance = storedUser.balance;
        transactionLimit = storedUser.transactionLimit;
        historyLogs = storedUser.historyLogs;
    }

    function recordOperation(type, value, time) {
        historyLogs.push({
            operationType: type,
            credits: value,
            operationTime: time
        });
        updateLocalStorage();
        displayOperations(historyLogs);
    }

    function displayOperations(historyLogs) {
        $('.historyOperationsConteiner').empty();
        for (let el of historyLogs) {
            $('.historyOperationsConteiner').append(`
                <div class="historyOperation">
                    <div class="operationType">${el.operationType}</div> 
                    <div class="credits">${el.credits}₴</div> 
                    <div class="operationTime">${el.operationTime}</div>
                </div>
            `);
        }
    }

    function updateLocalStorage() {
        let updatedUser = {
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
        let userIndex = usersLS.findIndex(user => user.id === id);
        if (userIndex !== -1) {
            usersLS[userIndex] = updatedUser;
        } else {
            usersLS.push(updatedUser);
        }
        localStorage.setItem('usersLS', JSON.stringify(usersLS));
    }

    return {
        getCardOptions() {
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
            let user = {
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

            usersLS.push(user);
            localStorage.setItem('usersLS', JSON.stringify(usersLS));
        },

        putCredits(amount) {
            if (amount <= transactionLimit) {
                balance += amount;
                recordOperation('Received credits', amount, new Date().toLocaleString());
            } else {
                displayNotification('Exceeded limit!');
            }
        },

        takeCredits(amount) {
            if (amount <= transactionLimit) {
                if (amount <= balance) {
                    balance -= amount;
                    recordOperation('Withdrawal money', amount, new Date().toLocaleString());
                } else {
                    displayNotification('Sorry not enough money!');
                }
            } else {
                displayNotification('Exceeded limit!');
            }
        },

        setTransactionLimit(amount) {
            transactionLimit = amount;
            recordOperation('Change transaction limit', amount, new Date().toLocaleString());
        },

        transferCredits(amount, card) {
            let TAX = 0.005;
            let transferAmount = amount * TAX + amount;

            if (transferAmount <= balance && transferAmount <= transactionLimit) {
                this.takeCredits(transferAmount);
                card.putCredits(amount);
            } else {
                displayNotification('Exceeded limit or not enough money!');
            }
        },

        operationsDisplay(historyLogs) {
            displayOperations(historyLogs);
        }
    }
}

let user1;
let user2;
let centerPAN;
$('#createCard').click(() => {
    let exists = false;
    for (let el of usersLS) {
        if (el.cards == $('#cardNumber').val()) {
            exists = true;
            break;
        }
    }
    if (!exists) {
        let correctNumber = /^[0-9]+$/.test($('#cardNumber').val());
        let correctLogin = /^[A-Za-z]{3,}$/.test($('#signUpLogin').val());
        let correctPassword = /^[A-Za-z]{6,}$/.test($('#signUpPassword').val());

        if (correctNumber && $('#formYear').val() && $('#formMonth').val() && $('#formCVV').val().length == 3 && correctLogin && correctPassword) {
            user1 = new UserCard($('#cardNumber').val(), $('#formCVV').val(), $('#signUpLogin').val(), $('#formMonth').val(), $('#formYear').val(), $('#signUpPassword').val());
            user1.addUser();
            $('.mainPage').css('display', 'flex');
            $('.signUpPage').css('display', 'none');
            $('.notificationContainer').css('display', 'none');
            $('.fullName').text(user1.getCardOptions().login);
            $('.month').text(user1.getCardOptions().mm);
            $('.year').text(user1.getCardOptions().yy);
            $('.backCVV').text(user1.getCardOptions().cvv);
            $('.PANConatiner').empty();
            $('.PANConatiner').append(`
                <span class="startPAN">####</span>
                <span class="centerPAN">########</span>
                <span class="endPAN">#####</span>
            `);
            $('.startPAN').text(user1.getCardOptions().cards.substring(0, 4));
            $('.endPAN').text(user1.getCardOptions().cards.substring(12, 16));
            centerPAN = user1.getCardOptions().cards.substring(4, 12);
            $('.amountMoneyTransfer').text(user1.getCardOptions().balance.toFixed(2) + '₴');
            $('#balanceHomePage').text(user1.getCardOptions().balance.toFixed(2) + '₴');
            user1.operationsDisplay(user1.getCardOptions().historyLogs);
        }
    }
});

$('#signInBtn').click(() => {
    let userFound = false;

    for (let user of usersLS) {
        if ($('#signInLogin').val() === user.login && $('#signInPassword').val() === user.password) {
            userFound = true;
            user1 = new UserCard(user.cards, user.cvv, user.login, user.mm, user.yy, user.password, user.id, user.balance);
            $('.mainPage').css('display', 'flex');
            $('.signInPage').css('display', 'none');
            $('.notificationContainer').css('display', 'none');
            $('.fullName').text(user1.getCardOptions().login);
            $('.month').text(user1.getCardOptions().mm);
            $('.year').text(user1.getCardOptions().yy);
            $('.backCVV').text(user1.getCardOptions().cvv);
            $('.startPAN').text(user1.getCardOptions().cards.substring(0, 4));
            $('.endPAN').text(user1.getCardOptions().cards.substring(12, 16));
            centerPAN = user1.getCardOptions().cards.substring(4, 12);
            $('.amountMoneyTransfer').text(user1.getCardOptions().balance.toFixed(2) + '₴');
            $('#balanceHomePage').text(user1.getCardOptions().balance.toFixed(2) + '₴');
            user1.operationsDisplay(user1.getCardOptions().historyLogs);
            break;
        }
    }

    if (!userFound) {
        displayNotification('Login or password is incorrect!');
    }
});


$('.homePageBtn').addClass('selectedPage');
$('.homePageBtn').click(() => {
    $('.homePageBtn').addClass('selectedPage');
    $('.transfersPageBtn').removeClass('selectedPage');
    $('.creditTransfersPage').css('display', 'none');
    $('.homePage').css('display', 'flex');
});

$('.transfersPageBtn').click(() => {
    $('.homePageBtn').removeClass('selectedPage');
    $('.transfersPageBtn').addClass('selectedPage');
    $('.homePage').css('display', 'none');
    $('.creditTransfersPage').css('display', 'flex');
});

$('#searchBtn').click(() => {
    if ($('#inputSearchCard').val().length >= 16) {
        if ($('#inputSearchCard').val() != user1.getCardOptions().cards) {
            let userFound = false;

            for (let user of usersLS) {
                if (user.cards == $('#inputSearchCard').val()) {
                    user2 = new UserCard(user.cards, user.cvv, user.login, user.mm, user.yy, user.password, user.id, user.balance);
                    $('.creditTransfersContainer').css('display', 'none');
                    $('.moneyTransferContainer').css('display', 'flex');
                    $('#nameInfo').text(user2.getCardOptions().login);
                    $('#cardInfo').text(user2.getCardOptions().cards);
                    userFound = true;
                    break;
                }
            }

            if (!userFound) {
                displayNotification('There is no such user!');
            }
        } else {
            displayNotification('You can\'t send money to yourself!');
        }
    } else {
        displayNotification('Too few characters!');
    }
});


$('#Send').click(function () {
    if (user1.getCardOptions().balance > parseInt($('.transferAmount').val()) && user1.getCardOptions().transactionLimit > parseInt($('.transferAmount').val())) {
        user1.transferCredits(parseInt($('.transferAmount').val()), user2);
        $('.amountMoneyTransfer').text(user1.getCardOptions().balance.toFixed(2) + '₴');
        $('#balanceHomePage').text(user1.getCardOptions().balance.toFixed(2) + '₴');
        $('.moneyTransferContainer').css('display', 'none');
        $('.successfulOperationContainer').css('display', 'flex');
        if (!$('svg').hasClass('animate')) {
            $('svg').addClass('animate');

            setTimeout(function () {
                $('svg').removeClass('animate');
                $('.successfulOperationContainer').css('display', 'none');
                $('.creditTransfersContainer').css('display', 'flex');
            }, 1700);
        }
    } else {
        displayNotification('Exceeded limit!');
    }
});
