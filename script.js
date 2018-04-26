const state = {
    deleting: false,
    creating: false,
    newBoxInfo: null,
    previewBox: null,
    mousemoveFunction: null,
    boxes: [
        {x: 10, y: 20, width: 100, height: 200, key: 1},
        {x: 30, y: 50, width: 400, height: 20, key: 2}
    ]
}

const max = (array) => array.reduce(
    (acc, val) => Math.max(acc, val), 
    null
);

const boxChange = new Event("boxChange");

const renderBoxes = (boxesInfo, DOMTarget) => {
    const boxesContainer = document.createElement("div");
    boxesContainer.classList.add("boxes__container");
    
    const boxNodes = boxesInfo.map(boxInfo => {
        const box = document.createElement("div");
        box.classList.add("boxes__box");
        box.style.position = "absolute";
        box.style.top = boxInfo.y;
        box.style.left = boxInfo.x;
        box.style.width = boxInfo.width;
        box.style.height = boxInfo.height;
        box.setAttribute("key", boxInfo.key);
        box.addEventListener("click", () => {
            console.log("clicked on box of key", boxInfo.key);
            if (state.deleting) {
                state.boxes = state.boxes.filter(b => b.key !== boxInfo.key);
                renderBoxes(state.boxes, document.querySelector(".boxes"));
                state.deleting = false;
                document.querySelector("body").style.cursor = "";
            }
        });
        return box;
    });

    boxNodes.forEach(box => {
       boxesContainer.appendChild(box);
    });

    DOMTarget.innerHTML = "";
    DOMTarget.appendChild(boxesContainer);
    console.log("boxNodes:", boxNodes);
}

window.addEventListener("load", () => {
    const addBox = document.querySelector(".toolbar__option--add-box");
    const deleteBox = document.querySelector(".toolbar__option--delete-box");
    const boxes = document.querySelector(".boxes");

    document.addEventListener(boxChange, () => {
        console.log("ALSKDJAKLSDJ");
        renderBoxes(state.boxes, boxes);
    });

    addBox.addEventListener("click", () => {
        if (document.getElementById("newbox")) { 
            boxes.removeChild(document.getElementById("newbox"));
        }
        document.removeEventListener("mousemove", state.mousemoveFunction);
        state.mousemoveFunction = null;


        const createBoxHandler = (event) => {

            if (event.target === addBox) return;
            else console.log("did not click on addBox");

            document.removeEventListener("mousemove", state.mousemoveFunction);
            state.mousemoveFunction = null;

            console.log("ausdhfuashdfu");

            state.creating = false;

            console.log("hello");

            const newId = max(state.boxes.map(box => box.key)) + 1;
            console.log("newId:", newId);

            if (state.newBoxInfo.x >= 0 && state.newBoxInfo.y >= 0) {
                console.log("the box is ok");
                state.boxes.push({...state.newBoxInfo, key: newId});
                renderBoxes(state.boxes, boxes);
            }

            window.removeEventListener("click", createBoxHandler);
        }
        window.addEventListener("click", createBoxHandler);

        console.log("I JUST STARTED CREATING");

        state.newBoxInfo = {width: 300, height: 300}

        const newBox = document.createElement("div");    
        boxes.appendChild(newBox);
        newBox.classList.add("boxes__box");
        newBox.style.position = "fixed";
        newBox.style.width = "300px";
        newBox.style.height = "300px";
        newBox.style.zIndex = "-1";
        newBox.id = "newbox";

        state.previewBox = newBox;

        let gate = false;

        const mousemoveFunction = (event) => {
            if (gate) return;
            gate = true;

            newBox.style.top = event.clientY + "px";
            newBox.style.left = event.clientX + "px";

            state.newBoxInfo.y = event.clientY - boxes.getBoundingClientRect().top;
            state.newBoxInfo.x = event.clientX - boxes.getBoundingClientRect().left;
            console.log(event);
            console.log("obj:", state.newBoxInfo);

            setTimeout(() => {gate = false}, 20);
        }
        state.mousemoveFunction = mousemoveFunction;

        document.addEventListener("mousemove", mousemoveFunction);
        document.dispatchEvent(new Event("mousemove"));

        setTimeout(()=>{state.creating = true;}, 200);
    });

    deleteBox.addEventListener("click", () => {
        state.deleting = true;
        document.querySelector("body").style.cursor = "not-allowed";
    });

    renderBoxes(state.boxes, boxes);
});