const breadcrumb = document.querySelector('.breadcrumb');

const left = document.querySelector('.left');
const leftContent = left.querySelector('.left-content');


let responsive = window.innerWidth <= 700, updated = false;
const [first, second, third] = document.querySelectorAll('.stick');
let stateBreadcrumb = false;

function toggleFirst() { first.classList.toggle('first-transform') }
function toggleSecond() { second.classList.toggle('second-transform') }
function toggleThird() { third.classList.toggle('third-transform') }

breadcrumb.addEventListener('click', function () {
    left.classList.toggle('left-active')
    leftContent.classList.toggle('left-content-active')
    toggleBreadcrumbAnimation()
    stateBreadcrumb = !stateBreadcrumb;
})

function toggleBreadcrumbAnimation() {
    toggleFirst()
    toggleSecond()
    toggleThird()
    breadcrumb.classList.toggle('breadcrumb-active')
}

function checkSmallScreen() {
    if (!updated && window.innerWidth <= 700) {
        updated = true;
        responsive = true;
    } else if (updated && window.innerWidth >= 700) {
        stateBreadcrumb = false;
        responsive = false;
        updated = false;
        if (first.classList.contains('first-transform')) toggleBreadcrumbAnimation()
    }
}

checkSmallScreen()

const details = document.querySelectorAll('details');
function detailClicked(s, a) {
    a.classList.toggle('arrow-rotate')
    s.classList.toggle('details-summary-straighten')
}
details.forEach(detail => {
    const arrow = detail.querySelector('.arrow');
    const summary = detail.querySelector('summary');

    if (arrow) {
        if (detail.getAttribute('open') != null) {
            detailClicked(summary, arrow)
        }

        summary.addEventListener('click', () => {
            detailClicked(summary, arrow)
        })
    }
})


// applications

const appContainer = document.querySelector('#app-container');


const main = document.querySelector('main');
const mainX = main.getBoundingClientRect().x;
const mainLeft = mainX - 10;

let firstC = appContainer.querySelector('.app-group');
let previous = [];

function addGroupHover() {
    for (const group of firstC.children) {
        const title = group.querySelector('.app-title');
        group.addEventListener('mouseover', function () {
            title.classList.add('app-title-active')
        })
        group.addEventListener('mouseout', function () {
            title.classList.remove('app-title-active')
        })
    }
}

addGroupHover()



function clearAppContainer() {
    previous = [];
    while (appContainer.children.length > 0) {
        appContainer.removeChild(appContainer.children[0])
    }
}
function hide(f) {
    f.style.right = -f.clientWidth + 'px';
}
function getPercentage(percentage) {
    return window.innerWidth * percentage / 100;
}

function getCopy(f) {
    return f.cloneNode(true);
}


hide(firstC)
let unedited = getCopy(firstC);



let moveIt = true;
async function move() {
    while (moveIt) {
        if (previous.length && ((!responsive && previous[0].getBoundingClientRect().right <= mainX) || (responsive && previous[0].getBoundingClientRect().right <= mainLeft))) {
            appContainer.removeChild(previous[0])
            previous.shift()
        }
        if ((!responsive && firstC.getBoundingClientRect().x <= mainLeft) || (responsive && firstC.getBoundingClientRect().right <= getPercentage(90))) {
            previous.push(firstC)
            let t = getCopy(unedited);
            appContainer.appendChild(t)
            firstC = t;
            // adding event listeners to newly created app group firstC
            addGroupHover()
        }
        await new Promise((resolve, reject) => { setTimeout(resolve, 100) })
    }
}
move();


let asdf = null;
window.addEventListener('resize', function () {
    checkSmallScreen()
    if (moveIt) {
        moveIt = false;
    }
    asdf && clearTimeout(asdf);
    asdf = setTimeout(() => {
        clearAppContainer();
        let t = getCopy(unedited);
        appContainer.appendChild(t)
        hide(t)
        unedited = getCopy(t);
        firstC = t;
        // adding tooltips to firstC
        addGroupHover()
        moveIt = true;
        move();
    }, 500)
})


const detailsLinks = document.querySelectorAll('.details-link');
detailsLinks.forEach(i=>{
    i.addEventListener('click', function() {
        const iDetail = document.querySelector(i.getAttribute('href'));
        detailClicked(iDetail.querySelector('summary'), iDetail.querySelector('.arrow'))
        iDetail.open = true;
    })
})