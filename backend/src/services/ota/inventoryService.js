// Mock OTA Inventory Service
const simulateNetworkDelay = () => new Promise(res => setTimeout(res, 500));

const updateInventory = async (otaName, roomId, availableCount) => {
    await simulateNetworkDelay();
    console.log(`[OTA-${otaName}] Updating inventory for Room ${roomId} to ${availableCount} available.`);
    
    return {
        success: true,
        message: `Inventory updated successfully on ${otaName}`,
        timestamp: new Date().toISOString()
    };
};

module.exports = {
    updateInventory
};
