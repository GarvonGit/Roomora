// Mock OTA Booking Service
const simulateNetworkDelay = () => new Promise(res => setTimeout(res, 500));

const fetchBookings = async (otaName) => {
    await simulateNetworkDelay();
    console.log(`[OTA-${otaName}] Fetching new bookings...`);
    
    // Return mock bookings
    return [
        {
            guest_name: `Guest from ${otaName}`,
            room_type: "Standard Room",
            check_in: new Date().toISOString().split('T')[0],
            check_out: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
            ota_source: otaName,
            price: 200,
            status: 'Confirmed'
        }
    ];
};

module.exports = {
    fetchBookings
};
