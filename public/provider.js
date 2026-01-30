// provider.js
async function loadSlots() {
    try {
        console.log("Fetching slots data...");
        // 向你的 API 端点发起请求
        const response = await fetch("/api/slots"); 
        const data = await response.json();
        
        console.log("Data received:", data);
        
        const container = document.getElementById('slots-display');
        
        if (!container) {
            console.error("Error: Could not find 'slots-display' element.");
            return;
        }

        // PPA 2: 使用 map 和 join 动态生成 HTML 块
        container.innerHTML = data.map(slot => `
            <div style="border: 1px solid #ddd; padding: 15px; margin: 10px 0; border-radius: 8px; background-color: #f9f9f9;">
                <p><strong>Slot ID:</strong> ${slot.id}</p>
                <p><strong>Time:</strong> ${slot.startTime} to ${slot.endTime}</p>
                <p><strong>Status:</strong> 
                    <span style="color: ${slot.status === 'available' ? 'green' : 'red'}; font-weight: bold;">
                        ${slot.status}
                    </span>
                </p>
            </div>
        `).join('');
        
        console.log("Slots rendered successfully!");
    } catch (error) {
        console.error("Fetch error:", error);
        document.getElementById('slots-display').innerHTML = "<p style='color: red;'>Error loading data. Check console.</p>";
    }
}

// 核心：确保 HTML 完全加载后再执行逻辑
window.onload = loadSlots;