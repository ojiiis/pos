document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Sidebar Toggling Logic (for Mobile View) ---
    const sidebar = document.querySelector('.sidebar');
    const menuToggleBtn = document.querySelector('.menu-toggle-btn');
    const closeSidebarBtn = document.querySelector('.user-profile .close-btn');

    // Function to show the sidebar (Menu button click)
    const openSidebar = () => {
        sidebar.classList.add('active');
    };

    // Function to hide the sidebar (Close button or outside click)
    const closeSidebar = () => {
        sidebar.classList.remove('active');
    };

    // Event listeners for toggling
    if (menuToggleBtn) menuToggleBtn.addEventListener('click', openSidebar);
    if (closeSidebarBtn) closeSidebarBtn.addEventListener('click', closeSidebar);

    // Close sidebar if clicking outside of it on smaller screens
    document.addEventListener('click', (e) => {
        // Only run this logic if the sidebar is open and screen is small
        if (window.innerWidth <= 900 && sidebar.classList.contains('active')) {
            const isClickInsideSidebar = sidebar.contains(e.target);
            const isClickOnToggleBtn = menuToggleBtn && menuToggleBtn.contains(e.target);

            if (!isClickInsideSidebar && !isClickOnToggleBtn) {
                closeSidebar();
            }
        }
    });

    // --- 2. Product Detail Modal Logic ---
    const productCards = document.querySelectorAll('.product-card');
    const modalOverlay = document.getElementById('productDetailModal');
    const closeModalBtn = document.querySelector('.close-modal-btn');
    const detailQtyInput = document.querySelector('.detail-qty-input');
    const qtyModalMinusBtn = document.querySelector('.detail-quantity-control .qty-minus');
    const qtyModalPlusBtn = document.querySelector('.detail-quantity-control .qty-plus');
    const addToCartBtn = document.querySelector('.add-to-cart-btn');

    // Dummy function to update modal content based on clicked product
    const updateModalContent = (productCard) => {
        const name = productCard.querySelector('.product-name').textContent;
        // Assume price is stored in a data attribute or extracted reliably
        const priceText = productCard.querySelector('.product-price').textContent;
        const price = parseFloat(priceText.replace('$', ''));
        const tag = productCard.querySelector('.product-tag').textContent;

        // Update displayed elements
        document.querySelector('.detail-name').textContent = name;
        document.querySelector('.detail-tag').textContent = tag;
        document.querySelector('.detail-price').textContent = priceText;
        document.querySelector('.detail-description').textContent = 'Premium butter croissant with a crispy pastry crust and soft inside will melt away on your mouth!'; // Placeholder
        document.querySelector('.detail-img').src = productCard.querySelector('img').src; 

        // Reset quantity and store base price
        detailQtyInput.value = 1;
        addToCartBtn.textContent = `Add to Cart ($${price.toFixed(2)})`;
        addToCartBtn.dataset.basePrice = price; 
    };

    // Open Modal Listener
    productCards.forEach(card => {
        card.addEventListener('click', () => {
            updateModalContent(card);
            modalOverlay.classList.add('active');
        });
    });

    // Close Modal Listener
    if (closeModalBtn) closeModalBtn.addEventListener('click', () => {
        modalOverlay.classList.remove('active');
    });

    // Close modal when clicking outside of it
    if (modalOverlay) modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            modalOverlay.classList.remove('active');
        }
    });

    // --- 3. Modal Quantity Control Logic ---
    const updateQuantityAndTotal = () => {
        let currentQty = parseInt(detailQtyInput.value);
        const basePrice = parseFloat(addToCartBtn.dataset.basePrice);

        // Ensure quantity is a valid number >= 1
        if (isNaN(currentQty) || currentQty < 1) {
            currentQty = 1;
        }

        detailQtyInput.value = currentQty;
        
        const newTotal = (currentQty * basePrice).toFixed(2);
        addToCartBtn.textContent = `Add to Cart ($${newTotal})`;
    };

    if (qtyModalPlusBtn) qtyModalPlusBtn.addEventListener('click', () => {
        detailQtyInput.value = parseInt(detailQtyInput.value) + 1;
        updateQuantityAndTotal();
    });

    if (qtyModalMinusBtn) qtyModalMinusBtn.addEventListener('click', () => {
        let currentQty = parseInt(detailQtyInput.value);
        if (currentQty > 1) {
            detailQtyInput.value = currentQty - 1;
            updateQuantityAndTotal();
        }
    });

    // Listen for manual input changes
    if (detailQtyInput) detailQtyInput.addEventListener('change', updateQuantityAndTotal);

    // --- 4. Order Summary Item Quantity Controls (Simple increment/decrement) ---
    document.querySelectorAll('.order-item-detail').forEach(itemDetail => {
        const minusBtn = itemDetail.querySelector('.qty-minus');
        const plusBtn = itemDetail.querySelector('.qty-plus');
        const qtySpan = itemDetail.querySelector('.item-qty');
        
        const handleQtyChange = (delta) => {
            let currentQty = parseInt(qtySpan.textContent);
            let newQty = currentQty + delta;

            if (newQty >= 1) {
                qtySpan.textContent = newQty;
                // In a real app, a function to recalculate the totals would be called here.
                // For this exercise, we just update the visible quantity.
            } else if (newQty === 0) {
                // Optional: Remove item if quantity drops to zero
                itemDetail.remove();
            }
        };

        if (plusBtn) plusBtn.addEventListener('click', () => handleQtyChange(1));
        if (minusBtn) minusBtn.addEventListener('click', () => handleQtyChange(-1));
    });

});

document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Sidebar Toggling Logic (Reused for Mobile Navigation) ---
    const sidebar = document.querySelector('.sidebar');
    const menuToggleBtn = document.querySelector('.menu-toggle-btn');
    const closeSidebarBtn = document.querySelector('.user-profile .close-btn');

    const openSidebar = () => {
        sidebar.classList.add('active');
    };

    const closeSidebar = () => {
        sidebar.classList.remove('active');
    };

    if (menuToggleBtn) menuToggleBtn.addEventListener('click', openSidebar);
    if (closeSidebarBtn) closeSidebarBtn.addEventListener('click', closeSidebar);

    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 900 && sidebar.classList.contains('active')) {
            const isClickInsideSidebar = sidebar.contains(e.target);
            const isClickOnToggleBtn = menuToggleBtn && menuToggleBtn.contains(e.target);

            if (!isClickInsideSidebar && !isClickOnToggleBtn) {
                closeSidebar();
            }
        }
    });

    // --- 2. Table Filtering Logic ---
    const filterButtons = document.querySelectorAll('.filter-btn');
    const tableCards = document.querySelectorAll('.table-card');

    const filterTables = (filterType) => {
        tableCards.forEach(card => {
            // Extract the table status class, e.g., 'table-status-open'
            const statusClass = Array.from(card.classList).find(cls => cls.startsWith('table-status-'));
            // Convert to simple status string: 'open', 'occupied', etc.
            const status = statusClass ? statusClass.replace('table-status-', '') : 'unknown';
            
            // Check if the card should be visible
            const isVisible = filterType === 'all' || filterType === status;

            card.style.display = isVisible ? 'flex' : 'none';
        });
    };

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove 'active' from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add 'active' to the clicked button
            button.classList.add('active');
            
            // Get the filter type from the data attribute
            const filterType = button.dataset.filter;
            filterTables(filterType);
        });
    });

    // --- 3. Search Input Logic ---
    const searchInput = document.querySelector('.search-input');

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase().trim();
            
            // Ensure 'All Tables' filter is active when searching
            filterButtons.forEach(btn => btn.classList.remove('active'));
            document.querySelector('.filter-btn[data-filter="all"]').classList.add('active');


            tableCards.forEach(card => {
                const tableNumber = card.querySelector('.table-number').textContent.toLowerCase();
                const customerName = card.querySelector('.customer-name').textContent.toLowerCase();

                const matchesSearch = tableNumber.includes(searchTerm) || customerName.includes(searchTerm);
                
                // Hide or show based on search term
                card.style.display = matchesSearch ? 'flex' : 'none';
            });
        });
    }

    // --- 4. Initial Load: Apply 'All Tables' filter and ensure search is clear ---
    filterTables('all');

    // --- 5. Action Button Placeholder (e.g., View Order / New Order) ---
    document.querySelectorAll('.action-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent card click if there was one
            const tableCard = e.target.closest('.table-card');
            const tableNumber = tableCard.querySelector('.table-number').textContent;
            
            if (btn.classList.contains('new-order')) {
                alert(`Starting a new order for ${tableNumber}. (In a real app, this navigates to the POS screen)`);
            } else if (btn.classList.contains('view-order')) {
                alert(`Viewing active order details for ${tableNumber}.`);
            } else if (btn.classList.contains('confirm-reserve')) {
                alert(`Confirmed reservation for ${tableNumber}.`);
            }
        });
    });

});

document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Sidebar Toggling Logic (Reused for Mobile Navigation) ---
    const sidebar = document.querySelector('.sidebar');
    const menuToggleBtn = document.querySelector('.menu-toggle-btn');
    const closeSidebarBtn = document.querySelector('.user-profile .close-btn');

    const openSidebar = () => {
        sidebar.classList.add('active');
    };

    const closeSidebar = () => {
        sidebar.classList.remove('active');
    };

    if (menuToggleBtn) menuToggleBtn.addEventListener('click', openSidebar);
    if (closeSidebarBtn) closeSidebarBtn.addEventListener('click', closeSidebar);

    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 900 && sidebar.classList.contains('active')) {
            const isClickInsideSidebar = sidebar.contains(e.target);
            const isClickOnToggleBtn = menuToggleBtn && menuToggleBtn.contains(e.target);

            if (!isClickInsideSidebar && !isClickOnToggleBtn) {
                closeSidebar();
            }
        }
    });

    // --- 2. Date Range Selector ---
    const dateRangeSelector = document.querySelector('.date-range-selector .select-field');

    if (dateRangeSelector) {
        dateRangeSelector.addEventListener('change', (e) => {
            const selectedRange = e.target.value;
            alert(`Report data filtering for: ${selectedRange}. (In a real app, this would trigger an AJAX request to fetch new data.)`);

            // Example of showing a custom date picker if "Custom Range" is selected
            if (selectedRange === 'custom') {
                // Here you would typically reveal a hidden start/end date input field
                console.log('User selected Custom Range. Show date picker fields.');
            }
        });
    }

    // --- 3. Action Buttons (Refresh and Download) ---
    const refreshBtn = document.querySelector('.refresh-btn');
    const downloadBtn = document.querySelector('.download-btn');

    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            alert('Refreshing all report data...');
            // Reload metric cards and charts here
        });
    }

    if (downloadBtn) {
        downloadBtn.addEventListener('click', () => {
            alert('Downloading report data as CSV/PDF...');
            // Logic to initiate file download
        });
    }

    // --- 4. Chart Visualization Placeholder ---

    /**
     * NOTE: This is a placeholder function. In a live application, 
     * you would integrate a library like Chart.js, D3, or ApexCharts here.
     * The script would look for the placeholders and render actual charts.
     */
    const renderCharts = () => {
        const salesChartPlaceholder = document.querySelector('.sales-chart .chart-placeholder');
        const topItemsChartPlaceholder = document.querySelector('.top-items-chart .chart-placeholder');

        if (salesChartPlaceholder) {
            salesChartPlaceholder.innerHTML = 'Rendering Monthly Sales Trend Chart...'; 
            // Replace with actual chart initialization (e.g., new Chart(ctx, config);)
        }
        
        if (topItemsChartPlaceholder) {
            topItemsChartPlaceholder.innerHTML = 'Rendering Top 5 Best Sellers Chart...';
             // Replace with actual chart initialization (e.g., new Chart(ctx, config);)
        }
    };

    // Initialize charts upon page load
    renderCharts();
});


document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Sidebar Toggling Logic (Reused for Mobile Navigation) ---
    const sidebar = document.querySelector('.sidebar');
    const menuToggleBtn = document.querySelector('.menu-toggle-btn');
    const closeSidebarBtn = document.querySelector('.user-profile .close-btn');

    const openSidebar = () => {
        sidebar.classList.add('active');
    };

    const closeSidebar = () => {
        sidebar.classList.remove('active');
    };

    if (menuToggleBtn) menuToggleBtn.addEventListener('click', openSidebar);
    if (closeSidebarBtn) closeSidebarBtn.addEventListener('click', closeSidebar);

    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 900 && sidebar.classList.contains('active')) {
            const isClickInsideSidebar = sidebar.contains(e.target);
            const isClickOnToggleBtn = menuToggleBtn && menuToggleBtn.contains(e.target);

            if (!isClickInsideSidebar && !isClickOnToggleBtn) {
                closeSidebar();
            }
        }
    });

    // --- 2. Filtering and Search Logic ---
    const categoryFilter = document.querySelector('.category-filter');
    const statusFilter = document.querySelector('.status-filter');
    const searchInput = document.querySelector('.inventory-controls .search-input');
    const inventoryRows = document.querySelectorAll('.inventory-table tbody tr');

    const applyFilters = () => {
        const selectedCategory = categoryFilter.value.toLowerCase();
        const selectedStatus = statusFilter.value.toLowerCase();
        const searchTerm = searchInput.value.toLowerCase().trim();

        inventoryRows.forEach(row => {
            const category = row.querySelector('td[data-label="Category"]').textContent.toLowerCase();
            const statusClass = row.querySelector('td[data-label="Status"]').className.replace('status-', '').toLowerCase().trim();
            const itemName = row.querySelector('td[data-label="Item Name"]').textContent.toLowerCase();
            const sku = row.querySelector('td[data-label="SKU"]').textContent.toLowerCase();
            
            // Step 1: Filter by Category
            const matchesCategory = selectedCategory === 'all' || category === selectedCategory;

            // Step 2: Filter by Status
            const matchesStatus = selectedStatus === 'all' || statusClass.includes(selectedStatus);

            // Step 3: Filter by Search Term
            const matchesSearch = itemName.includes(searchTerm) || sku.includes(searchTerm);

            // Final Visibility
            const isVisible = matchesCategory && matchesStatus && matchesSearch;

            row.style.display = isVisible ? '' : 'none';
        });
    };

    // Event Listeners for Filters and Search
    if (categoryFilter) categoryFilter.addEventListener('change', applyFilters);
    if (statusFilter) statusFilter.addEventListener('change', applyFilters);
    if (searchInput) searchInput.addEventListener('input', applyFilters);

    // --- 3. Action Button Placeholders ---
    
    // Header Action Buttons
    const addNewItemBtn = document.querySelector('.add-item-btn');
    const receiveGoodsBtn = document.querySelector('.receive-goods-btn');
    const historyBtn = document.querySelector('.inventory-history-btn');
    
    if (addNewItemBtn) addNewItemBtn.addEventListener('click', () => {
        alert('Opening modal to add a new inventory item...');
    });

    if (receiveGoodsBtn) receiveGoodsBtn.addEventListener('click', () => {
        alert('Opening modal to process a new goods receipt...');
    });
    
    if (historyBtn) historyBtn.addEventListener('click', () => {
        alert('Viewing stock history log...');
    });
    
    // Table Edit Buttons
    document.querySelectorAll('.action-edit').forEach(button => {
        button.addEventListener('click', (e) => {
            const row = e.target.closest('tr');
            const itemName = row.querySelector('td[data-label="Item Name"]').textContent;
            alert(`Editing details for item: ${itemName}...`);
        });
    });

});

document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Sidebar Toggling Logic (Reused for Mobile Navigation) ---
    const sidebar = document.querySelector('.sidebar');
    const menuToggleBtn = document.querySelector('.menu-toggle-btn');
    const closeSidebarBtn = document.querySelector('.user-profile .close-btn');

    const openSidebar = () => {
        sidebar.classList.add('active');
    };

    const closeSidebar = () => {
        sidebar.classList.remove('active');
    };

    if (menuToggleBtn) menuToggleBtn.addEventListener('click', openSidebar);
    if (closeSidebarBtn) closeSidebarBtn.addEventListener('click', closeSidebar);

    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 900 && sidebar.classList.contains('active')) {
            const isClickInsideSidebar = sidebar.contains(e.target);
            const isClickOnToggleBtn = menuToggleBtn && menuToggleBtn.contains(e.target);

            if (!isClickInsideSidebar && !isClickOnToggleBtn) {
                closeSidebar();
            }
        }
    });

    // --- 2. Filtering and Search Logic ---
    const roleFilter = document.querySelector('.role-filter');
    const statusFilter = document.querySelector('.status-filter');
    const searchInput = document.querySelector('.teams-controls .search-input');
    const employeeRows = document.querySelectorAll('.teams-table tbody tr');

    const applyFilters = () => {
        const selectedRole = roleFilter.value.toLowerCase();
        const selectedStatus = statusFilter.value.toLowerCase();
        const searchTerm = searchInput.value.toLowerCase().trim();

        employeeRows.forEach(row => {
            const role = row.querySelector('td[data-label="Role"]').textContent.toLowerCase();
            // Get the text content of the status cell (e.g., "Active" or "Inactive")
            const status = row.querySelector('td[data-label="Status"]').textContent.toLowerCase(); 
            const name = row.querySelector('td[data-label="Name"]').textContent.toLowerCase();
            const id = row.querySelector('td[data-label="ID"]').textContent.toLowerCase();
            
            // Step 1: Filter by Role
            const matchesRole = selectedRole === 'all' || role === selectedRole;

            // Step 2: Filter by Status
            const matchesStatus = selectedStatus === 'all' || status === selectedStatus;

            // Step 3: Filter by Search Term
            const matchesSearch = name.includes(searchTerm) || id.includes(searchTerm);

            // Final Visibility
            const isVisible = matchesRole && matchesStatus && matchesSearch;

            row.style.display = isVisible ? '' : 'none';
        });
    };

    // Event Listeners for Filters and Search
    if (roleFilter) roleFilter.addEventListener('change', applyFilters);
    if (statusFilter) statusFilter.addEventListener('change', applyFilters);
    if (searchInput) searchInput.addEventListener('input', applyFilters);

    // --- 3. Action Button Placeholders ---
    
    // Header Action Buttons
    const addEmployeeBtn = document.querySelector('.add-employee-btn');
    const scheduleBtn = document.querySelector('.schedule-btn');
    const refreshBtn = document.querySelector('.refresh-btn');
    
    if (addEmployeeBtn) addEmployeeBtn.addEventListener('click', () => {
        alert('Opening modal to add a new employee profile...');
    });

    if (scheduleBtn) scheduleBtn.addEventListener('click', () => {
        alert('Navigating to the employee scheduling dashboard...');
    });
    
    if (refreshBtn) refreshBtn.addEventListener('click', () => {
        alert('Refreshing employee list data...');
    });
    
    // Table Edit Buttons
    document.querySelectorAll('.action-edit').forEach(button => {
        button.addEventListener('click', (e) => {
            const row = e.target.closest('tr');
            const employeeName = row.querySelector('td[data-label="Name"]').textContent;
            alert(`Opening edit profile modal for: ${employeeName}...`);
        });
    });

});


document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Sidebar Toggling Logic (Reused for Mobile Navigation) ---
    const sidebar = document.querySelector('.sidebar');
    const menuToggleBtn = document.querySelector('.menu-toggle-btn');
    const closeSidebarBtn = document.querySelector('.user-profile .close-btn');

    const openSidebar = () => {
        sidebar.classList.add('active');
    };

    const closeSidebar = () => {
        sidebar.classList.remove('active');
    };

    if (menuToggleBtn) menuToggleBtn.addEventListener('click', openSidebar);
    if (closeSidebarBtn) closeSidebarBtn.addEventListener('click', closeSidebar);

    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 900 && sidebar.classList.contains('active')) {
            const isClickInsideSidebar = sidebar.contains(e.target);
            const isClickOnToggleBtn = menuToggleBtn && menuToggleBtn.contains(e.target);

            if (!isClickInsideSidebar && !isClickOnToggleBtn) {
                closeSidebar();
            }
        }
    });

    // --- 2. Settings Sub-Navigation and Content Switching ---
    const settingNavItems = document.querySelectorAll('.setting-nav-item');
    const settingSections = document.querySelectorAll('.settings-content-area .setting-section');

    const switchSettingSection = (targetSectionId) => {
        // 1. Deactivate all navigation items
        settingNavItems.forEach(item => {
            item.classList.remove('active');
        });

        // 2. Hide all content sections
        settingSections.forEach(section => {
            section.classList.remove('active');
        });

        // 3. Activate the selected navigation item
        const activeNavItem = document.querySelector(`.setting-nav-item[data-setting="${targetSectionId}"]`);
        if (activeNavItem) {
            activeNavItem.classList.add('active');
        }

        // 4. Show the corresponding content section
        const activeSection = document.getElementById(targetSectionId);
        if (activeSection) {
            activeSection.classList.add('active');
        }
    };

    settingNavItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault(); // Stop default link behavior
            const targetSection = item.dataset.setting;
            switchSettingSection(targetSection);
        });
    });

    // --- 3. Header Action Placeholders ---
    
    const saveBtn = document.querySelector('.save-btn');
    const helpBtn = document.querySelector('.help-btn');

    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            // Get the ID of the currently active section
            const activeSection = document.querySelector('.setting-section.active');
            const sectionName = activeSection ? activeSection.querySelector('h3').textContent : 'System';
            
            alert(`Saving changes for ${sectionName} settings...`);
            // In a real application, AJAX request to save configuration would go here.
        });
    }

    if (helpBtn) {
        helpBtn.addEventListener('click', () => {
            alert('Opening documentation or help center for system settings...');
        });
    }
    
    // --- 4. Content Action Placeholders (Edit/Add buttons) ---
    document.querySelectorAll('.action-edit, .add-tax-btn, .add-device-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const actionText = e.target.textContent;
            
            if (actionText.includes('Edit') || actionText.includes('Configure') || actionText.includes('Troubleshoot')) {
                alert(`Opening configuration modal for: ${actionText}...`);
            } else if (actionText.includes('Add')) {
                alert(`Opening modal to ${actionText.toLowerCase()}...`);
            }
        });
    });

    // --- 5. Initialize: Ensure the 'general' section is shown on load ---
    switchSettingSection('general'); 

});

document.addEventListener('DOMContentLoaded', () => {
    
    // --- Global State Variables ---
    let isClockedIn = false;
    let isOnBreak = false;
    let cashFloat = 50.00; // Starting float for the drawer

    // --- DOM Elements ---
    const currentTimeEl = document.getElementById('current-time');
    const statusEl = document.getElementById('shift-status');
    const clockInBtn = document.querySelector('.clock-in-btn');
    const clockOutBtn = document.querySelector('.clock-out-btn');
    const startBreakBtn = document.querySelector('.start-break-btn');
    const endBreakBtn = document.querySelector('.end-break-btn');
    const endShiftBtn = document.querySelector('.end-shift-btn');
    const cashFloatEl = document.getElementById('cash-float');
    const historyList = document.querySelector('.history-list');

    // --- Time Functions ---
    const updateTime = () => {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const dateString = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        
        currentTimeEl.textContent = timeString;
        document.querySelector('.shift-date').textContent = dateString;
    };

    setInterval(updateTime, 1000);
    updateTime(); // Initial call

    // --- State and UI Update Function ---
    const updateUI = () => {
        // Update Buttons based on state
        clockInBtn.classList.toggle('disabled', isClockedIn);
        clockOutBtn.classList.toggle('disabled', !isClockedIn || isOnBreak);
        startBreakBtn.classList.toggle('disabled', !isClockedIn || isOnBreak);
        endBreakBtn.classList.toggle('disabled', !isClockedIn || !isOnBreak);
        
        // End shift button is available only when clocked in and not on break
        endShiftBtn.classList.toggle('disabled', !isClockedIn || isOnBreak);
        
        // Update Status Message
        if (!isClockedIn) {
            statusEl.textContent = 'Status: Off Shift. Clock in to begin your day.';
            statusEl.style.backgroundColor = 'var(--secondary-blue)';
        } else if (isOnBreak) {
            statusEl.textContent = 'Status: On Break. Ready to End Break.';
            statusEl.style.backgroundColor = '#FFEDD5'; // Light orange/yellow
            statusEl.style.color = 'orange';
        } else {
            statusEl.textContent = 'Status: Clocked In. Ready for work.';
            statusEl.style.backgroundColor = 'var(--D1FAE5)'; // Light green
            statusEl.style.color = 'var(--green-success)';
        }
        
        // Update Cash Float Display
        cashFloatEl.textContent = `$${cashFloat.toFixed(2)}`;
    };

    // --- History Log Function ---
    const logAction = (action) => {
        const time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        const newLog = document.createElement('div');
        newLog.classList.add('history-item');
        newLog.innerHTML = `<span>${action}</span><span>${time}</span>`;
        
        // Remove 'No activity' message if present
        if (historyList.querySelector('p')) {
            historyList.innerHTML = '';
        }
        
        historyList.prepend(newLog); // Add new entry to the top
    };

    // --- Event Listeners for Punches ---
    clockInBtn.addEventListener('click', () => {
        if (!isClockedIn) {
            isClockedIn = true;
            logAction('Clock In');
            alert(`Welcome, Jelly! Your shift has started. Starting cash float is $${cashFloat.toFixed(2)}.`);
            updateUI();
        }
    });

    clockOutBtn.addEventListener('click', () => {
        if (isClockedIn && !isOnBreak) {
            isClockedIn = false;
            logAction('Clock Out');
            alert('Clocked Out. Remember to End Shift & Count Drawer.');
            updateUI();
        }
    });

    startBreakBtn.addEventListener('click', () => {
        if (isClockedIn && !isOnBreak) {
            isOnBreak = true;
            logAction('Start Break');
            updateUI();
        }
    });

    endBreakBtn.addEventListener('click', () => {
        if (isClockedIn && isOnBreak) {
            isOnBreak = false;
            logAction('End Break');
            updateUI();
        }
    });

    // --- Cash Management Event Listeners ---
    document.querySelector('.open-drawer-btn').addEventListener('click', () => {
        alert('Physically triggering the cash drawer pop open.');
    });

    document.querySelector('.declare-tips-btn').addEventListener('click', () => {
        const tips = prompt('Enter the total tips declared for this shift:');
        if (tips !== null && !isNaN(parseFloat(tips)) && parseFloat(tips) >= 0) {
            const tipsAmount = parseFloat(tips).toFixed(2);
            alert(`Tips of $${tipsAmount} declared successfully.`);
            logAction(`Tips Declared ($${tipsAmount})`);
        } else if (tips !== null) {
            alert('Invalid amount entered.');
        }
    });

    endShiftBtn.addEventListener('click', () => {
        if (isClockedIn) {
            // Force clock out before ending shift
            isClockedIn = false;
            logAction('Clock Out (Automatic)');

            const finalCount = prompt('Enter the total cash counted in the drawer:');
            if (finalCount !== null && !isNaN(parseFloat(finalCount))) {
                const finalAmount = parseFloat(finalCount);
                const difference = finalAmount - cashFloat; // Simple check (ignores transactions/tips for simplicity)

                let message = `Shift Ended. Final Cash Count: $${finalAmount.toFixed(2)}.\n`;
                if (difference === 0) {
                    message += "Drawer is perfectly balanced!";
                } else if (difference > 0) {
                    message += `Drawer is OVER by $${difference.toFixed(2)}.`;
                } else {
                    message += `Drawer is SHORT by $${Math.abs(difference).toFixed(2)}.`;
                }
                alert(message);
                logAction(`Shift End (Balance: $${difference.toFixed(2)})`);
            } else if (finalCount !== null) {
                alert('Invalid cash amount entered.');
            }
            updateUI();
        }
    });
    
    // --- Initialize UI State ---
    updateUI();
});

document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Sidebar Toggling Logic (Reused for Mobile Navigation) ---
    const sidebar = document.querySelector('.sidebar');
    const menuToggleBtn = document.querySelector('.menu-toggle-btn');
    const closeSidebarBtn = document.querySelector('.user-profile .close-btn');

    const openSidebar = () => {
        sidebar.classList.add('active');
    };

    const closeSidebar = () => {
        sidebar.classList.remove('active');
    };

    if (menuToggleBtn) menuToggleBtn.addEventListener('click', openSidebar);
    if (closeSidebarBtn) closeSidebarBtn.addEventListener('click', closeSidebar);

    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 900 && sidebar.classList.contains('active')) {
            const isClickInsideSidebar = sidebar.contains(e.target);
            const isClickOnToggleBtn = menuToggleBtn && menuToggleBtn.contains(e.target);

            if (!isClickInsideSidebar && !isClickOnToggleBtn) {
                closeSidebar();
            }
        }
    });

    // --- 2. Filtering and Search Logic ---
    const tierFilter = document.querySelector('.tier-filter');
    const statusFilter = document.querySelector('.status-filter');
    const searchInput = document.querySelector('.customer-controls .search-input');
    const customerRows = document.querySelectorAll('.customer-table tbody tr');

    const applyFilters = () => {
        const selectedTier = tierFilter.value.toLowerCase();
        const selectedStatus = statusFilter.value.toLowerCase();
        const searchTerm = searchInput.value.toLowerCase().trim();

        customerRows.forEach(row => {
            const tier = row.querySelector('td[data-label="Tier"]').textContent.toLowerCase();
            const name = row.querySelector('td[data-label="Name"]').textContent.toLowerCase();
            const id = row.querySelector('td[data-label="ID"]').textContent.toLowerCase();
            // Note: Status filtering is simple here, usually requires checking a data attribute for 'active' or 'pending' rewards
            // For this example, we'll assume all customers are 'active' unless we implement deeper logic.

            // Step 1: Filter by Tier
            const matchesTier = selectedTier === 'all' || tier === selectedTier;

            // Step 2: Filter by Search Term (Name, ID, etc.)
            const matchesSearch = name.includes(searchTerm) || id.includes(searchTerm);

            // Final Visibility
            const isVisible = matchesTier && matchesSearch;

            row.style.display = isVisible ? '' : 'none';
        });
    };

    // Event Listeners for Filters and Search
    if (tierFilter) tierFilter.addEventListener('change', applyFilters);
    if (statusFilter) statusFilter.addEventListener('change', applyFilters);
    if (searchInput) searchInput.addEventListener('input', applyFilters);

    // --- 3. Action Button Placeholders ---
    
    // Header Action Buttons
    const addCustomerBtn = document.querySelector('.add-customer-btn');
    const campaignBtn = document.querySelector('.campaign-btn');
    const refreshBtn = document.querySelector('.refresh-btn');
    
    if (addCustomerBtn) addCustomerBtn.addEventListener('click', () => {
        alert('Opening modal to register a new customer/loyalty member...');
    });

    if (campaignBtn) campaignBtn.addEventListener('click', () => {
        alert('Navigating to the Loyalty Campaign Builder/Monitor...');
    });
    
    if (refreshBtn) refreshBtn.addEventListener('click', () => {
        alert('Refreshing customer data...');
    });
    
    // Table View Buttons
    document.querySelectorAll('.action-view').forEach(button => {
        button.addEventListener('click', (e) => {
            const row = e.target.closest('tr');
            const customerName = row.querySelector('td[data-label="Name"]').textContent;
            alert(`Opening detailed customer profile for: ${customerName}. This shows full spending history and loyalty balance.`);
        });
    });

});