const header = document.getElementById("header");
let previousScrollPos = 0;
let currentScroll;
let revScroll = false;

const headerScroll = () => {
    currentScroll = window.scrollY;
    console.log(currentScroll);
    if(!revScroll) {
        previousScrollPos = currentScroll;
        console.log(previousScrollPos);
        if(currentScroll < previousScrollPos) {
            revScroll = true;
            header.classList.add("scrolledVisible");
        }
    }
    revScroll = false;
    previousScrollPos = 0;
}


window.addEventListener("scroll", headerScroll);
