const header = document.getElementById("header");
let previousScrollPos = 0;
let currentScroll = window.scrollY;
let revScroll = false;

const headerScroll = () => {
    if(!revScroll) {
        previousScrollPos = currentScroll;
        if(currentScroll < previousScrollPos) {
            revScroll = true;
        }
    }
    console.log(currentScroll);
    if(revScroll) {
        header.classList.add("scrolledVisible");
        console.log(currentScroll);
    }
    revScroll = false;
    console.log(currentScroll);
}


window.addEventListener("scroll", headerScroll);