let parcialTime = document.querySelector('.parcial-time')
let completeTime = document.querySelector('.ct-list')
let updateInterval = 15000
let darkModeCB = document.getElementById('darkModeCB')

let dayNames = [
    "Domingo",
    "Segunda-feira",
    "Terça-feira",
    "Quarta-feira",
    "Quinta-feira",
    "Sexta-feira",
    "Sábado"
    ""
]

let timesArray = [
    {                           // Domingo
        idle: true
    },
    {                           // Seguda feira
        times: [
            {
                startTime: '07:30:00',
                endTime: '09:00:00',
                name: "História 3",
                teacher: "Edivânia Granja",
                room: "B-09"
            },
            {
                startTime: '09:00:00',
                endTime: '12:15:00',
                name: "Projeto de Conclusão de Curso - PCC",
                teacher: "Laécio Costa",
                room: "B-09"
            }
        ]
    },
    {                           // Terça feira
        times: [
            {
                startTime: '07:30:00',
                endTime: '09:00:00',
                name: "Geografia 3",
                teacher: "Clésio Jonas",
                room: "B-09"
            },
            {
                startTime: "09:00:00",
                endTime: "10:45:00",
                name: "Higiene e Segurança do Trabalho",
                teacher: "Patrícia Bomfim",
                room: "B-09"
            },
            {
                startTime: "10:45:00",
                endTime: "12:15:00",
                name: "Administração de Sistemas Operacionais de Rede",
                teacher: "Babatunde Oresotu",
                room: "B-09"
            }
        ]
    },
    {                           // Quarta feira
        times: [
            {
                startTime: '07:30:00',
                endTime: '09:00:00',
                name: "Programação Web",
                teacher: "Felipe Correia",
                room: "B-09/B-04"
            },
            {
                startTime: "09:00:00",
                endTime: "10:45:00",
                name: "Sociologia 3",
                teacher: "Juliano Varela",
                room: "B-09"
            },
            {
                startTime: "10:45:00",
                endTime: "12:15:00",
                name: "Administração de SO de Redes",
                teacher: "Babatunde Oresotu",
                room: "B-09"
            }
        ]
    },
    {                           // Quinta feira
        times: [
            {
                startTime: '07:30:00',
                endTime: '09:00:00',
                name: "Eletrônica Aplicada",
                teacher: "Roberio Aguiar",
                room: "B-09"
            },
            {
                startTime: "09:00:00",
                endTime: "10:45:00",
                name: "Segurança da Informação",
                teacher: "Babatunde Oresotu",
                room: "B-04/B-09"
            },
            {
                startTime: "10:45:00",
                endTime: "12:15:00",
                name: "Língua Portuguesa 4",
                teacher: "Edilaine Sousa",
                room: "B-09"
            }
        ]
    },
    {                           // Sexta feira
        times: [
            {
                startTime: '07:30:00',
                endTime: '09:00:00',
                name: "Espanhol 2",
                teacher: "Karinine Carla",
                room: "B-09"
            },
            {
                startTime: "09:00:00",
                endTime: "10:45:00",
                name: "Programação Web",
                teacher: "Felipe Correia",
                room: "B-04/B-09"
            },
            {
                startTime: "10:45:00",
                endTime: "12:15:00",
                name: "Instalações Elétricas Aplicadas",
                teacher: "Roberio Aguiar",
                room: "B-09"
            }
        ]
    },
    {                         // Sábado
        idle: true
    }
]

let globalDate = null

function setTransitions() {
    let elements = document.querySelectorAll('.light, .dark')
    elements.forEach(el => {
        el.style.transition = 'all .6s ease-in-out'
    })
}
function getDayTitle(day) {
    if (day <= 6)
        return dayNames[day]
    else
        return dayNames[0]
}
function removeTimes() {
    let elements = document.querySelectorAll('.time-list > .time, .no-time, .ct-day')

    elements.forEach(el => {
        el.parentNode.removeChild(el)
    })
}
function getTimeFromSchoolTime(time) {
    let numbers = time.split(':')

    return [parseInt(numbers[0]), parseInt(numbers[1])]
}
function isTimeBetween(startTime, endTime, dateTime) {
    let start = new Date(`${dateTime.toDateString()} ${startTime}`)
    let end = new Date(`${dateTime.toDateString()} ${endTime}`)

    return (dateTime >= start && dateTime <= end)
}
function isTimeBefore(startTime, endTime, dateTime) {
    let start = new Date(`${dateTime.toDateString()} ${startTime}`)
    let end = new Date(`${dateTime.toDateString()} ${endTime}`)

    return (dateTime <= start)
}
function isTimeAfter(startTime, endTime, dateTime) {
    let start = new Date(`${dateTime.toDateString()} ${startTime}`)
    let end = new Date(`${dateTime.toDateString()} ${endTime}`)

    return (dateTime >= end)
}

function renderToday(update) {
    let now = globalDate ? globalDate : new Date();

    // Elemento dos horários de hoje
    let timeList = document.querySelector('.today > .time-list')

    // Define dia da semana
    let todayTitle = document.getElementById('time-day-today')
    todayTitle.innerHTML = `${getDayTitle(now.getDay())}, ${now.toLocaleDateString()}`


    let lastDay = timeList.dataset?.day

    let todayData = timesArray[now.getDay()]

    if (todayData.idle) {
        timeList.dataset.idle = true
        timeList.innerHTML = '<p class="no-time time-sub-title" style="margin: 15px">Sem horários definidos hoje</p>'
        renderTomorrow()
        return
    } else
        timeList.dataset.idle = false

    let recreate = lastDay != now.getDay() ? true : false

    if ((timeList.children.length < 2 && !update) || recreate) {   // Cria os horários
        console.log('Creating times', getDayTitle(now.getDay()));
        removeTimes()
        renderTomorrow();

        let scroll
        for (let i = 0; i <= todayData.times.length - 1; i++) {
            let timeEl = document.createElement('div'),
                timeData = todayData.times[i]
            timeEl.classList.add('time')
            timeEl.classList.add('light')
            timeEl.onclick = swipeLeft

            timeEl.dataset.startTime = timeData.startTime
            timeEl.dataset.endTime = timeData.endTime

            timeEl.innerHTML = `
                <div class="s-title">Carregando</div>
                <div class="time-hour">${timeData.startTime.substring(0, 5)} - ${timeData.endTime.substring(0, 5)}</div>
                <div class="time-name">${timeData.name}</div>
                <div class="time-teacher">
                    <div class="tt-title time-sub-title">Professor (a)</div>
                    <div class="tt-name time-sup-title">${timeData.teacher}</div>
                </div>
                <div class="time-room">
                    <div class="tr-title time-sub-title">Sala</div>
                    <div class="tr-name time-sup-title">${timeData.room}</div>
                </div>
                <div class="status">
                    <div class="pb-w hidden">
                        <div class="pb"></div>
                    </div>
                </div>
            `

            if (isTimeAfter(timeData.startTime, timeData.endTime, now)) {
                timeEl.querySelector('.s-title').innerHTML = 'Concluída'
            } else if (isTimeBetween(timeData.startTime, timeData.endTime, now)) {
                timeEl.classList.add('active')
                timeEl.querySelector('.s-title').innerHTML = 'Agora'
                timeEl.querySelector('.s-title').classList.add('active')
                timeEl.querySelector('.pb-w').classList.remove('hidden')

                let startDate = new Date(`${now.toDateString()} ${timeData.startTime}`)
                let endDate = new Date(`${now.toDateString()} ${timeData.endTime}`)

                let dateDiff = endDate.getTime() - startDate.getTime()
                let dateTravel = now.getTime() - startDate.getTime()

                let percentage = (dateTravel / dateDiff) * 100

                timeEl.querySelector('.pb').style.width = percentage + '%'
                scroll = timeEl

            } else if (isTimeBefore(timeData.startTime, timeData.endTime, now)) {
                timeEl.querySelector('.s-title').innerHTML = 'Não iniciada'
                timeEl.querySelector('.s-title').classList.remove('active')
            }
            timeList.appendChild(timeEl)
        }
        if (scroll)
            setTimeout(() => {
                scroll.scrollIntoView({ behavior: "smooth" })
            }, 1000);
    } else {                                        // Atualiza os horários
        console.log('Updating time', getDayTitle(now.getDay()));
        for (let i = 0; i <= todayData.times.length - 1; i++) {
            let timeEl = timeList.children[i]

            if (isTimeAfter(timeEl.dataset.startTime, timeEl.dataset.endTime, now)) {
                timeEl.querySelector('.s-title').innerHTML = 'Concluída'
                timeEl.querySelector('.s-title').classList.remove('active')
                timeEl.querySelector('.pb-w').classList.add('hidden')
                timeEl.classList.remove('active')
            } else if (isTimeBetween(timeEl.dataset.startTime, timeEl.dataset.endTime, now)) {
                timeEl.classList.add('active')
                timeEl.querySelector('.s-title').innerHTML = 'Agora'
                timeEl.querySelector('.s-title').classList.add('active')

                let startDate = new Date(`${now.toDateString()} ${timeEl.dataset.startTime}`)
                let endDate = new Date(`${now.toDateString()} ${timeEl.dataset.endTime}`)

                let dateDiff = endDate.getTime() - startDate.getTime()
                let dateTravel = now.getTime() - startDate.getTime()

                let percentage = (dateTravel / dateDiff) * 100

                timeEl.querySelector('.pb-w').classList.remove('hidden')
                timeEl.querySelector('.pb-w').children[0].style.width = percentage + '%'
            } else if (isTimeBefore(timeEl.dataset.startTime, timeEl.dataset.endTime, now)) {
                timeEl.classList.remove('active')
                timeEl.querySelector('.s-title').innerHTML = 'Não iniciada'
                timeEl.querySelector('.pb-w').classList.add('hidden')
            }
        }
    }
    timeList.dataset.day = now.getDay()

    if (globalDate)     // Data específica
        globalDate.setMinutes(globalDate.getMinutes() + 30)
}
function renderTomorrow() {
    let now = globalDate ? new Date(globalDate) : new Date();
    now.setDate(now.getDate() + 1)

    // Elemento dos horários de amanhã
    let timeList = document.querySelector('.tomorrow > .time-list')
    if (timeList.children.length > 1)
        return

    // Define dia da semana
    let tomorrowTitle = document.getElementById('time-day-tomorrow')
    tomorrowTitle.innerHTML = `${getDayTitle(now.getDay())}, ${now.toLocaleDateString()}`

    let tomorrowData = timesArray[now.getDay()]

    if (tomorrowData.idle) {
        timeList.dataset.idle = true
        timeList.innerHTML = '<p class="no-time time-sub-title" style="margin: 15px">Sem horários definidos para amanhã.</p>'
        return
    } else
        timeList.dataset.idle = false

    for (let i = 0; i <= tomorrowData.times.length - 1; i++) {
        let timeData = tomorrowData.times[i]

        let timeEl = document.createElement('div')
        timeEl.classList.add('time')
        timeEl.classList.add('light')
        timeEl.onclick = swipeRight

        timeEl.innerHTML = `
            <div class="s-title">Amanhã</div>
            <div class="time-hour">${timeData.startTime.substring(0, 5)} - ${timeData.endTime.substring(0, 5)}</div>
            <div class="time-name">${timeData.name}</div>
            <div class="time-teacher">
                <div class="tt-title time-sub-title">Professor (a)</div>
                <div class="tt-name time-sup-title">${timeData.teacher}</div>
            </div>
            <div class="time-room">
                <div class="tr-title time-sub-title">Sala</div>
                <div class="tr-name time-sup-title">${timeData.room}</div>
            </div>
            <div class="status">
                <div class="pb-w hidden">
                    <div class="pb"></div>
                </div>
            </div>
        `

        timeList.appendChild(timeEl)
    }
}

function renderDay(times) {
    let result = document.createElement('div')
    result.classList.add('ct-tl')

    for (let i = 0; i <= times.length - 1; i++) {
        let timeData = times[i]

        let timeEl = document.createElement('div')
        timeEl.classList.add('time')
        timeEl.classList.add('light')

        timeEl.innerHTML = `
        <div class="time-hour">${timeData.startTime.substring(0, 5)} - ${timeData.endTime.substring(0, 5)}</div>
        <div class="time-name">${timeData.name}</div>
        <div class="time-teacher">
            <div class="tt-title time-sub-title">Professor (a)</div>
            <div class="tt-name time-sup-title">${timeData.teacher}</div>
        </div>
        <div class="time-room">
            <div class="tr-title time-sub-title">Sala</div>
            <div class="tr-name time-sup-title">${timeData.room}</div>
        </div>
        `

        result.appendChild(timeEl)
    }

    return result
}

function renderCompleteTimes() {
    for (let i = 0; i <= timesArray.length - 1; i++) {
        let dayData = timesArray[i]

        if (dayData.idle)
            continue

        let dayEl = document.createElement('div')
        dayEl.classList.add('ct-day')

        dayEl.innerHTML = `
            <div class="ct-day-title">${getDayTitle(i)}</div>
        `

        let timesEl = renderDay(dayData.times)

        dayEl.appendChild(timesEl)

        completeTime.appendChild(dayEl)
    }
}

function renderTimes(update) {
    renderToday(update);
}

function swipeRight() {
    document.querySelector('.tomorrow').scrollIntoView({ behavior: "smooth", block: "nearest" })
}
function swipeLeft() {
    document.querySelector('.today').scrollIntoView({ behavior: "smooth", block: "nearest" })
}

function setDark() {
    let elements = document.querySelectorAll('.light')
    elements.forEach(el => {
        el.classList.remove('light')
        el.classList.add('dark')
    })

    localStorage.setItem('dark', 'true')
}
function setLight() {
    let elements = document.querySelectorAll('.dark')
    elements.forEach(el => {
        el.classList.remove('dark')
        el.classList.add('light')
    })

    localStorage.setItem('dark', 'false')
}


//debug function
function debugMode() {
  let container = document.querySelector('.debug');
  let containerDisplay = window.getComputedStyle(container).display;
  container.style.display = containerDisplay == 'block' ? 'none' : 'block';
}
window.onload = function () {
    removeTimes()
    renderTimes()
    renderCompleteTimes()
    setTransitions()
    darkModeCB.onchange = function (e) {
        let dark = e.target.checked

        if (dark) {
            // turn dark mode
            setDark()
        } else {
            // turn light mode
            setLight()
        }
    }

    //debug input
    let debugInput = document.querySelector('.debug > input');
    //debug controller
    let debugActivator = document.querySelector('.logo');
    debugActivator.addEventListener('dblclick', debugMode);
    debugInput.addEventListener('change', (e) => {
      globalDate = new Date(e.target.value); 
      renderTimes()
    })

    let isDarkDefined = (localStorage.getItem('dark') == 'true')
    if (isDarkDefined) {
        darkModeCB.checked = 'true'
        setDark()
    } else {
        setLight()
    }

    var job = setInterval(() => {
        renderTimes()
    }, updateInterval);

    /* var time = new Date(),
    secondsRemaining = (60 - time.getSeconds()) * 1000;

    setTimeout(function() {
        console.log('working');
        setInterval(renderTimes, 60000);
    }, secondsRemaining); */

    var elementBody = document.querySelector('body');
    var elementBtnIncreaseFont = document.getElementById('increase-font');
    var elementBtnDecreaseFont = document.getElementById('decrease-font');
    // Padrão de tamanho, equivale a 100% do valor definido no Body
    var fontSize = 100;
    // Valor de incremento ou decremento, equivale a 10% do valor do Body
    var increaseDecrease = 10;

    // Evento de click para aumentar a fonte
    elementBtnIncreaseFont.addEventListener('click', function(event) {
        fontSize = fontSize + increaseDecrease;
        elementBody.style.fontSize = fontSize + '%';
    });

    // Evento de click para diminuir a fonte
    elementBtnDecreaseFont.addEventListener('click', function(event) {
        fontSize = fontSize - increaseDecrease;
        elementBody.style.fontSize = fontSize + '%';
    });
}