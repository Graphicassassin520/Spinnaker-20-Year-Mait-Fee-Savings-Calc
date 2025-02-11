document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('calculate').addEventListener('click', calculateProjection);
    document.getElementById('printChart').addEventListener('click', function() {
        window.print();
    });
});

function calculateProjection() {
    // Retrieve user input values
    const guestName = document.getElementById('guestName').value;
    const currentLocationName = document.getElementById('currentLocation').value.trim();
    const maintenanceFee = parseFloat(document.getElementById('maintenanceFee').value) || 0;
    const newLocationName = document.getElementById('newLocation').value.trim();
    const maintenanceFee2 = parseFloat(document.getElementById('maintenanceFee2').value) || 0;
    const priceIncrease = (parseFloat(document.getElementById('priceIncrease').value) || 0) / 100;

    // Arrays for chart data and savings
    let data = [], data2 = [], labels = [], savingsData = [];
    let totalSavings = 0;
    let fee1 = maintenanceFee, fee2 = maintenanceFee2;

    // Calculate projections for 20 years
    for (let year = 1; year <= 20; year++) {
        fee1 *= (1 + priceIncrease);  // Increase by user-defined percentage
        fee2 *= (1 + 0.02);  // Fixed 2% increase for the new location
        data.push(fee1);
        data2.push(fee2);
        labels.push(`Year ${year}`);
        let annualSavings = fee1 - fee2;
        savingsData.push(annualSavings);
        totalSavings += annualSavings;
    }

    // Get canvas and resize (reduce to 81% of original size)
    const canvas = document.getElementById('myChart');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth * 0.81; 
    canvas.height = window.innerHeight * 0.32;  // Reduced height for printing

    // Destroy previous chart if exists
    if (window.myChart instanceof Chart) {
        window.myChart.destroy();
    }

    // Create Chart
    window.myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: currentLocationName || "Current Location",
                data: data,
                borderColor: '#FF6384',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                pointBackgroundColor: '#FF6384',
                fill: true,
                tension: 0.4,
            },
            {
                label: newLocationName || "New Location",
                data: data2,
                borderColor: '#36A2EB',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                pointBackgroundColor: '#36A2EB',
                fill: true,
                tension: 0.4,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,  // Prevent shrinking of the chart
            plugins: {
                legend: { position: 'top' },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) label += ': ';
                            label += formatNumberWithCommas(context.parsed.y);
                            return label;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Maintenance Fee ($)',
                        font: { size: 16 }
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Year',
                        font: { size: 16 }
                    }
                }
            }
        }
    });

    // Build the financial breakdown table dynamically
    let tableHtml = `<table class="results-table"><tr>
                     <th>Year</th>
                     <th>${currentLocationName || "Current Location"} Fee ($)</th>
                     <th>${newLocationName || "New Location"} Fee ($)</th>
                     <th>Savings ($)</th>
                   </tr>`;
    data.forEach((amount, index) => {
        tableHtml += `<tr>
                        <td>${index + 1}</td>
                        <td>${formatNumberWithCommas(amount)}</td>
                        <td>${formatNumberWithCommas(data2[index])}</td>
                        <td>${formatNumberWithCommas(savingsData[index])}</td>
                      </tr>`;
    });
    tableHtml += `<tr>
                  <td colspan="3">Total Savings over 20 Years:</td>
                  <td>${formatNumberWithCommas(totalSavings)}</td>
                </tr></table>`;
    document.getElementById('financialTable').innerHTML = tableHtml;

    // Display overall savings
    document.getElementById('savings').innerHTML = 
        `20-Year Savings with New Ownership: <strong>$${formatNumberWithCommas(Math.abs(totalSavings))}</strong>`;
}

// Helper function to format numbers with commas
function formatNumberWithCommas(number) {
    return number.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
