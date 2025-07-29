const XLSX = require('xlsx');

// Sample data
const data = [
    {
        id: 1,
        name: "Equipment 1",
        type: "Machine",
        latitude: 44.4268,
        longitude: 26.1025,
        status: "Operational"
    },
    {
        id: 2,
        name: "Equipment 2",
        type: "Sensor",
        latitude: 44.4280,
        longitude: 26.1040,
        status: "Maintenance Required"
    },
    {
        id: 3,
        name: "Equipment 3",
        type: "Tool",
        latitude: 44.4290,
        longitude: 26.1060,
        status: "Offline"
    }
];

// Create a new workbook
const workbook = XLSX.utils.book_new();

// Convert data to worksheet
const worksheet = XLSX.utils.json_to_sheet(data);

// Add worksheet to workbook
XLSX.utils.book_append_sheet(workbook, worksheet, "Equipment");

// Write to file
XLSX.writeFile(workbook, "public/equipment_data.xlsx");
console.log("Excel file has been generated successfully!");
