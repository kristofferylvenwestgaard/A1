const bubbleLabel = document.getElementById("bubbleLabel");
const exitBubble = document.getElementById("quit");
const sticky = document.querySelector(".sticky");
const chatContainer = document.querySelector(".chatContainer");
const chat = document.querySelector(".chat");
let stickyBubble = false;

const handleChatBubble = () => {
    bubbleLabel.classList.remove("hidden");
    exitBubble.classList.remove("hidden");
    chat.classList.add("chatInteraction");

    setTimeout(() => {chat.classList.add("hidden")}, "400");

    //console.log(bubbleLabel.classList.contains("hidden"));
}

exitBubble.addEventListener("click", handleChatBubble);


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

