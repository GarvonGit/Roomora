// Mock OTA Pricing Service
const simulateNetworkDelay = () => new Promise(res => setTimeout(res, 500));

const updatePrice = async (otaName, roomId, newPrice) => {
    await simulateNetworkDelay();
    console.log(`[OTA-${otaName}] Updating price for Room ${roomId} to $${newPrice}.`);
    
    return {
        success: true,
        message: `Price updated successfully on ${otaName}`,
        timestamp: new Date().toISOString()
    };
};

module.exports = {
    updatePrice
};
