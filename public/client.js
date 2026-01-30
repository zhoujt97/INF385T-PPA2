// client.js
async function loadAvailableSlots() {
    try {
        const response = await fetch("/api/slots");
        const data = await response.json();
        
        // 只显示可用的时间段
        const availableSlots = data.filter(slot => slot.status === 'available');
        
        const container = document.getElementById('slots-display');
        if (availableSlots.length === 0) {
            container.innerHTML = '<p>No available slots at this time.</p>';
        } else {
            container.innerHTML = availableSlots.map(slot => 
                `<div style="border: 1px solid #4CAF50; margin: 10px; padding: 15px; border-radius: 5px;">
                    <p><strong>Slot #${slot.id}</strong></p>
                    <p>Time: ${slot.startTime} to ${slot.endTime}</p>
                    <button onclick="alert('Booking will be available in future assignment!')">Book This Slot</button>
                </div>`
            ).join('');
        }
    } catch (error) {
        console.error("Fetch error:", error);
    }
}
loadAvailableSlots();