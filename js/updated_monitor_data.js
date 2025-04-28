class FanControl {
    constructor(fanSpeed) {
        this._fanSpeed = fanSpeed;
    }
    set fanSpeed(fanSpeed) {
        this._fanSpeed = fanSpeed;
    }
    get fanSpeed() {
        return this._fanSpeed;
    }
}
const fanControl = new FanControl(0);

let isSending = false; // Prevents multiple simultaneous sends

async function validateInput() {
    const input = document.getElementById("fanSpeed");
    let x = Number(input.value);
    if (isNaN(x) || x < 0 || x > 100) {
        showToast("Invalid input. Value must be between 0 and 100.", "error");
        return false;
    }
    showToast("Valid input. Sending data...", "success");

    // Disable input temporarily
    input.disabled = true;
    await sendData(mapTo255PWM(x));
    input.disabled = false;
    return true;
}

function handleKeyPress(e) {
    const key = e.keyCode || e.which;
    if (key === 13) {
        validateInput();
    }
}

async function sendData(speed) {
    if (isSending) {
        console.warn("Already sending, wait...");
        return;
    }
    isSending = true;

    try {
        const response = await fetch(`https://remotewtl_fancontrol.sfsuishm.net/fanSpeed?fanSpeed=${speed}`);
        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }
        const fanSpeed = mapTo100Percentage(speed);
        showToast(`Data received. Fan speed: ${fanSpeed}`, "success");
        fanControl.fanSpeed = fanSpeed;
    } catch (error) {
        console.error("Failed to send data:", error);
        showToast("Failed to send data. Try again.", "error");
    } finally {
        isSending = false;
    }
}

function mapTo255PWM(value) {
    return Math.round((value / 100) * 255);
}

function mapTo100Percentage(value) {
    return Math.round((value / 255) * 100);
}

function showToast(message, type) {
    const toast = document.getElementById("toast");
    const toastBody = document.getElementById("toastBody");
    toast.className = "toast fade show";
    toastBody.innerHTML = message;
    toastBody.className = type === "success" ? "toast-body text-success" : "toast-body text-danger";
    $('.toast').toast({ delay: 2000 });
    $('.toast').toast('show');
}

