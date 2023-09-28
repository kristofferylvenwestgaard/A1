const bubble = document.getElementById("giosg-bubble");
const bubbleLabel = document.getElementById("bubbleLabel");
const exitBubble = document.getElementById("quit");
const sticky = document.querySelector(".sticky");
const chatContainer = document.querySelector(".chatContainer");


const handleChatBubble = () => {
    bubbleLabel.classList.toggle("hidden");
    exitBubble.classList.toggle("hidden");
    //console.log(bubbleLabel.classList.contains("hidden"));
}

exitBubble.addEventListener("click", handleChatBubble);


//Sticky bottom

const handleSticky = () => {
    let scroll = window.scrollY;
    let pos = false;
    //console.log(scroll);

    if(scroll > 2000 ) {
        pos = true;
    } else {
        pos = false;
    }
    if(pos) {
        sticky.classList.remove("hidden");
        handleBubbleOnStickyBottom();
    } else {
        sticky.classList.add("hidden");
        handleBubbleOnStickyBottom();
    }
}

window.addEventListener("scroll", handleSticky);


//HandleBubble

const handleBubbleOnStickyBottom = () => {
    if(!sticky.classList.contains("hidden")) {
        //console.log(sticky.offsetHeight);
        let totalBottom = sticky.offsetHeight + 16;
        chatContainer.style.bottom = `${totalBottom}px`;
    } else {
        //console.log(sticky.offsetHeight);
        chatContainer.style.bottom = `1rem`;
    }
}

