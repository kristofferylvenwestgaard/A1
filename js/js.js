const bubbleLabel = document.getElementById("bubbleLabel");
const exitBubble = document.getElementById("quit");
const sticky = document.querySelector(".sticky");
const chatContainer = document.querySelector(".chatContainer");
const chat = document.querySelector(".chat");
const buttonImg = document.querySelector(".btn-img");
const chatModal = document.querySelector(".chatModal");
const body = document.querySelector("body");
const exitModal = document.querySelector(".exitModal");
let stickyBubble = false;
let bodyOverflow = true;

const handleChatBubble = () => {
    chat.classList.add("chatInteraction");
    setTimeout(() => {chat.classList.add("hidden")}, "400");

    //console.log(bubbleLabel.classList.contains("hidden"));
}

const showHideChatModal = () => {
    chatModal.classList.toggle("hidden");
    if(bodyOverflow && window.innerWidth <= 600) {
        body.style.overflow = "hidden";
        bodyOverflow = false;
    } else {
        body.style.overflow = "auto";
        bodyOverflow = true;
    }
}

exitBubble.addEventListener("click", handleChatBubble);
buttonImg.addEventListener("click", showHideChatModal);
bubbleLabel.addEventListener("click", showHideChatModal);
exitModal.addEventListener("click", showHideChatModal);


//Sticky bottom

const handleSticky = () => {
    let scroll = window.scrollY;
    let pos = false;
    //console.log(scroll);

    if(scroll > 1000 ) {
        pos = true;
    } else {
        pos = false;
    }
    if(pos && !stickyBubble) {
        sticky.classList.remove("hidden");
        handleBubbleOnStickyBottom();
    } else if(!pos && stickyBubble){
        sticky.classList.add("hidden");
        handleBubbleOnStickyBottom();
    }
}

window.addEventListener("scroll", handleSticky);


//HandleBubble
const handleBubbleOnStickyBottom = () => {
    console.log(stickyBubble);
    if(!stickyBubble) {
        stickyBubble = true;
        //console.log(sticky.offsetHeight);
        let totalBottom = sticky.offsetHeight + 16;
        chatContainer.style.bottom = `${totalBottom}px`;
    } else {
        stickyBubble = false;
        //console.log(sticky.offsetHeight);
        chatContainer.style.bottom = `1rem`;
    }
}

