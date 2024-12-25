const users = [
    {
    id: 'santa-01',
    img: 'https://img101.pixhost.to/images/78/546456982_than.jpg',
    userName: 'asisten wanz:'
  },
    {
    id: 'user-01',
    img: 'https://img.freepik.com/premium-vector/beautiful-sports-girl-character-avatar-with-long-black-hair_491904-70.jpg',
    userName: 'anda'
  }
]

const initialMessages = [
  {
    id:'94c7f27e-e642-4765-b1ea-bb07009582fd',
    userId: 'santa-01',
    role: "assistant",
    content:
      "hallo halo disini asisten wanz!",
     createdAt: 1734277071060
  },
  {
    id:'6b974e10-7387-42b3-af77-b6b5a6072042',
    userId: 'santa-01',
    role: "assistant",
    content: "ada yang bisa asisten wanz bantu??",
    createdAt: 1734277071060
  },
]

function storeMessage () {
  sessionStorage.setItem('santaChatHistory', JSON.stringify(messages))
}

const storaged = sessionStorage.getItem('santaChatHistory')
const messages = storaged ? JSON.parse(storaged) : initialMessages
storeMessage()

//CHAT
const chat = document.getElementById('chat')
const groupedMessages=[]

 //render storaged messages
 messages.forEach(message=> {
   renderMessageOrGroup(message)
 })
scrollToLastMessage()

function scrollToLastMessage () {
  chat.scrollIntoView(
    {behavior: "smooth", block: "end", inline: "nearest"}
  )
}

function isPrevGroup(groupsArr, message) {
  const timeGap = 10*60*1000
  const lastGroup = groupsArr[groupsArr.length-1];
  const prevMessage = lastGroup?.messages.at(-1);
  return lastGroup && lastGroup.role === message.role && new Date(message.createdAt) - new Date(prevMessage.createdAt) <= timeGap
}

function isAI(role){
  return role === 'assistant'
}

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function createNewGroup (message) {
  const currentUser = users.find((el)=>el.id===message.userId)
  return {
      groupId: crypto.randomUUID(),
      role: message.role,
      avatar: currentUser.img,
      userName: currentUser.userName,
      messages: [message]
  }
}
//create a single message element
function createMessageElement(message,name, isSanta) {
  const timeStr = new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  const bgColor = isSanta ? 'bg-gray-100' : 'bg-cyan-100'
  return  `
       <p class="${bgColor} py-2 px-4 rounded flex flex-col gap-1 text-sm max-w-[195px]">
          <span class="font-semibold">${name}</span>
          <span>${message.content}</span>
          <span class="self-end text-gray-800/60 text-[12px]">${timeStr}</span>
       </p>
     `
}
//create message groupe element
function createGroupElement({groupId, avatar, role, userName, messages}) {
  const isSanta = isAI(role)

  const replayBlock = document.createElement('div');
  replayBlock.id = groupId
  replayBlock.classList.add('flex', 'gap-4');
  
  const replayInner = `
       ${isSanta? `<img src="${avatar}" class="self-end shrink-0 scale-x-[-1] object-cover w-[45px] h-[45px] rounded-full">`: ''}
      <div class="grow flex flex-col ${isSanta?'items-start':'items-end'} gap-2">
        ${messages.map((message)=>createMessageElement(message, userName, isSanta )).join('')}
      </div>
  `
  replayBlock.innerHTML = replayInner
  
  return replayBlock
}
function renderMessageOrGroup (message) {
  if(isPrevGroup(groupedMessages, message)) {
      const prev = groupedMessages.at(-1)
      prev.messages.push(message)
      const tempBlock = document.createElement('div');
      tempBlock.innerHTML = createMessageElement(message, prev.userName, isAI(message.role))
      document.querySelector(`[id="${prev.groupId}"] div`).append(tempBlock.firstElementChild)
    } else {
      const newGroup = createNewGroup(message)
      groupedMessages.push(newGroup)
      chat.append(createGroupElement(newGroup))
    }
}

function processMessage(message) {
  messages.push(message)
  storeMessage()
  renderMessageOrGroup(message)
  scrollToLastMessage()
}

const form = document.forms.sendMessage;
form.addEventListener('submit', (e)=> {
  e.preventDefault();
  const messageText = form.message.value.trim()
  const message = {
    id:crypto.randomUUID(),
    userId: 'user-01',
    role: "user",
    content:
      `${messageText}`,
     createdAt:  Date.now()
  }
  processMessage(message)
  form.reset()
  getSantasResponse()
})

function getSantasResponse() {
  fetch("https://api-proxy-lemon.vercel.app/proxy/santa", {
      method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ messages }),
  })
    .then(response=>response.json())
    .then(result=>{
    const santasRes = {
      ...result, 
      id: crypto.randomUUID(), 
      userId: 'santa-01', 
      createdAt: Date.now()
    }
    processMessage(santasRes)
  })
    .catch(error=>{
    console.log(error)
  })
}


/******Snow******/
class SnowFlakes {
  constructor(canvas, count) {
    this.canvas = canvas;
    this.count = count;
    this.ctx = this.canvas.getContext("2d");
    this.flakes = [];
    this.requestAnimationId = null;
    this.resizeTimeout = null;

    requestAnimationFrame(() => {
    this.resizeCanvas();
    this.generateFlakes();
  });
    window.addEventListener("resize", this.onResize.bind(this));
  }

  resizeCanvas() {
    const { clientWidth, clientHeight } = this.canvas.parentElement;
    this.canvas.width = clientWidth;
    this.canvas.height = clientHeight;
  }

  generateFlakes() {
    this.flakes.length = 0;
    for (let i = 0; i < this.count; i++) {
      this.flakes.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        size: Math.floor(Math.random() * Math.abs(25 - 8) + 8),
        speed: Math.random() * 1 + 0.1,
        acceleration: 0.0002,
        angle: Math.random() * Math.PI * 2,
        drift: Math.random() * 0.5,
      });
    }
  }

  addFlake(flake) {
    this.ctx.fillStyle = "white";
    this.ctx.font = `${flake.size}px Arial`;
    this.ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
    this.ctx.shadowBlur = 3;
    this.ctx.shadowOffsetX = 2;
    this.ctx.shadowOffsetY = 2;
    this.ctx.fillText("❅", flake.x, flake.y);
  }

  start() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.flakes.forEach((flake) => {
      this.addFlake(flake);
      flake.y += flake.speed;
      flake.speed += flake.acceleration;
      flake.x += Math.sin(flake.angle) * flake.drift;
      flake.angle += 0.01;

      if (flake.y > this.canvas.height) {
        flake.y = -(flake.size * Math.random() * 2);
        flake.x = Math.random() * this.canvas.width;
        flake.speed = Math.random() * 1 + 0.1;
      }
    });

    this.requestAnimationId = requestAnimationFrame(this.start.bind(this));
  }

  cancel() {
    if (this.requestAnimationId) cancelAnimationFrame(this.requestAnimationId);
  }

  destroy() {
    this.cancel();
    window.removeEventListener("resize", this.onResize.bind(this));
  }

  onResize() {
    clearTimeout(this.resizeTimeout);
    this.resizeTimeout = setTimeout(() => {
      if (this.requestAnimationId) {
        cancelAnimationFrame(this.requestAnimationId);
        this.requestAnimationId = null;
      }
      this.resizeCanvas();
      this.start();
    }, 200);
  }
}
const canvas = document.createElement('canvas');
document.body.append(canvas)
canvas.classList.add('absolute', 'inset-0', 'pointer-events-none')
const snow = new SnowFlakes(canvas, 30)
snow.start()
