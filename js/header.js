const header = document.getElementById("header");
let previousScrollPos = 0;
let currentScroll;
let revScroll = false;

const headerScroll = () => {
    currentScroll = window.scrollY;
    //console.log(currentScroll);
    if(previousScrollPos < currentScroll) {
        previousScrollPos = currentScroll;
        revScroll = false;   
    }
    if(!revScroll) {
        header.classList.remove("scrolledVisible");
        if(currentScroll < previousScrollPos) {
            revScroll = true;
        }
        console.log({previousScrollPos, currentScroll});
    } else {
        header.classList.add("scrolledVisible");
    }
}


window.addEventListener("scroll", headerScroll);
