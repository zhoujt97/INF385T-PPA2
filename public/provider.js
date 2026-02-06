// provider.js - PPA3 版本
// 使用 XMLHttpRequest（符合 PPA3 要求，不使用 async/await）

function setMessage(text, kind) {
  const p = document.getElementById("message");
  p.textContent = text;
  p.className = kind; // "error" 或 "ok"
  
  // 3秒后自动隐藏消息
  setTimeout(() => {
    p.style.display = "none";
  }, 3000);
}

function addSlotRow(slot) {
  const tbody = document.getElementById("slotTableBody");
  const tr = document.createElement("tr");
  
  const tdId = document.createElement("td");
  const tdStart = document.createElement("td");
  const tdEnd = document.createElement("td");
  const tdStatus = document.createElement("td");
  
  tdId.textContent = slot.id;
  tdStart.textContent = slot.startTime;
  tdEnd.textContent = slot.endTime;
  tdStatus.textContent = slot.status;
  tdStatus.className = slot.status === "available" ? "status-available" : "status-booked";
  
  tr.appendChild(tdId);
  tr.appendChild(tdStart);
  tr.appendChild(tdEnd);
  tr.appendChild(tdStatus);
  
  tbody.appendChild(tr);
}

function parseJsonSafely(text) {
  try {
    return { ok: true, value: JSON.parse(text) };
  } catch (err) {
    return { ok: false, value: null };
  }
}

// 加载现有 slots
function loadSlots() {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", "/api/slots");
  
  xhr.onload = function () {
    if (xhr.status === 200) {
      const result = parseJsonSafely(xhr.responseText);
      if (result.ok) {
        const tbody = document.getElementById("slotTableBody");
        tbody.innerHTML = ""; // 清空现有内容
        result.value.forEach(slot => addSlotRow(slot));
      }
    }
  };
  
  xhr.send();
}

// POST /api/slots?startTime=...&endTime=...
function submitNewSlot(startTime, endTime) {
  const xhr = new XMLHttpRequest();
  const requestUrl =
    "/api/slots?startTime=" + encodeURIComponent(startTime) +
    "&endTime=" + encodeURIComponent(endTime);
  
  const createBtn = document.getElementById("createBtn");
  createBtn.disabled = true;
  createBtn.textContent = "Creating...";
  
  xhr.open("POST", requestUrl);
  
  xhr.onload = function () {
    createBtn.disabled = false;
    createBtn.textContent = "Create Slot";
    
    const result = parseJsonSafely(xhr.responseText);
    
    if (xhr.status === 201) {
      // 成功创建
      if (result.ok) {
        addSlotRow(result.value);
        setMessage("✅ Slot created successfully!", "ok");
        
        // 清空表单
        document.getElementById("startTime").value = "";
        document.getElementById("endTime").value = "";
        
        // 保持焦点
        document.getElementById("startTime").focus();
      }
    } else if (xhr.status === 400) {
      // 验证错误
      if (result.ok && result.value.error) {
        setMessage("❌ " + result.value.error, "error");
      } else {
        setMessage("❌ Invalid input", "error");
      }
    } else if (xhr.status === 409) {
      // 重复 slot
      if (result.ok && result.value.error) {
        setMessage("❌ " + result.value.error, "error");
      } else {
        setMessage("❌ Duplicate slot", "error");
      }
    } else {
      setMessage("❌ Unexpected error occurred", "error");
    }
  };
  
  xhr.onerror = function () {
    createBtn.disabled = false;
    createBtn.textContent = "Create Slot";
    setMessage("❌ Network error", "error");
  };
  
  xhr.send();
}

// 表单提交事件
document.getElementById("slotForm").addEventListener("submit", function (event) {
  event.preventDefault();
  const startTime = document.getElementById("startTime").value.trim();
  const endTime = document.getElementById("endTime").value.trim();
  
  if (!startTime || !endTime) {
    setMessage("❌ Please fill in both fields", "error");
    return;
  }
  
  submitNewSlot(startTime, endTime);
});

// 页面加载时加载现有 slots
window.onload = loadSlots;