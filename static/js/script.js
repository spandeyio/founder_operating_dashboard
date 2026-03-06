document.addEventListener('DOMContentLoaded', () => {
    const chatContainer = document.getElementById('chat-container');
    const input = document.getElementById('message-input');
    const typing = document.getElementById('typing');
    const tableList = document.getElementById('table-list');
    const uploadForm = document.getElementById('upload-form');
    const uploadStatus = document.getElementById('upload-status');
    const sendBtn = document.getElementById('send-btn');
    
    // Sidebar elements
    const sidebar = document.getElementById('sidebar');
    const contextSuggestions = document.getElementById('context-suggestions');
    const currentTableName = document.getElementById('current-table-name');
    const suggestionList = document.getElementById('suggestion-list');

    if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    // Fetch tables on load
    if (tableList) {
        fetchTables();
    }

    async function fetchTables() {
        try {
            const response = await fetch('/tables');
            const data = await response.json();
            
            if (data.tables && data.tables.length > 0) {
                tableList.innerHTML = data.tables.map(t => `<li onclick="selectTable('${t}')">${t}</li>`).join('');
                // Automatically select the first table if none is selected
                setTimeout(() => window.selectTable(data.tables[0]), 100);
            } else {
                tableList.innerHTML = '<li>No tables found</li>';
            }
        } catch (error) {
            console.error('Error fetching tables:', error);
            tableList.innerHTML = '<li>Error loading tables</li>';
        }
    }

    // Table Selection Logic
    window.selectTable = function(tableName) {
        // Highlight active table
        const items = tableList.querySelectorAll('li');
        items.forEach(item => {
            if (item.innerText === tableName) item.classList.add('active');
            else item.classList.remove('active');
        });

        // Show suggestions
        currentTableName.innerText = tableName;
        contextSuggestions.style.display = 'block';
        
        // Generate prompts based on table name (heuristic)
        const prompts = getPromptsForTable(tableName);
        suggestionList.innerHTML = prompts.map(p => 
            `<div class="suggestion-item" onclick="usePrompt('${p.replace(/'/g, "\\'")}')">${p}</div>`
        ).join('');
    };

    function getPromptsForTable(tableName) {
        return [
            `Revenue Overview: Show me the total revenue over time from ${tableName} as a line chart.`,
            `User Growth: Create a bar chart showing Active Users per category in ${tableName}.`,
            `Anomaly Check: Are there any unusual spikes or drops in metrics like Revenue or Churn Rate in ${tableName}? Please highlight anomalies.`,
            `CAC Analysis: What is the average Customer Acquisition Cost by Category in ${tableName}?`,
            `Executive Dashboard: Generate a comprehensive Founder Dashboard for ${tableName} including key KPIs (Total Revenue, Avg CAC, Max Churn) and visual charts.`
        ];
    }

    // Upload Form Handler
    if (uploadForm) {
        uploadForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const tableName = document.getElementById('table-name').value.trim();
            const fileInput = document.getElementById('csv-file');
            
            if (!tableName || fileInput.files.length === 0) return;
            
            const formData = new FormData();
            formData.append('table_name', tableName);
            formData.append('file', fileInput.files[0]);
            
            uploadStatus.innerText = 'Uploading...';
            uploadStatus.style.color = 'var(--text-secondary)';
            
            try {
                const response = await fetch('/upload_csv', {
                    method: 'POST',
                    body: formData
                });
                const data = await response.json();
                
                if (response.ok) {
                    uploadStatus.innerText = 'Success!';
                    uploadStatus.style.color = 'var(--success)';
                    document.getElementById('table-name').value = '';
                    fileInput.value = '';
                    fetchTables(); // Refresh list
                    // Auto-select the new table
                    setTimeout(() => window.selectTable(tableName), 500);
                } else {
                    uploadStatus.innerText = 'Error: ' + data.detail;
                    uploadStatus.style.color = 'red';
                }
            } catch (error) {
                uploadStatus.innerText = 'Error uploading file.';
                uploadStatus.style.color = 'red';
            }
        });
    }

    // Global helper functions
    window.usePrompt = function(text) {
        if (input) {
            input.value = text;
            input.focus();
        }
    };
    
    window.sendMessage = async function() {
        const message = input.value.trim();
        if (!message) return;

        // Add User Message
        addMessage('user', message);
        input.value = '';
        
        // Show typing
        typing.style.display = 'flex';
        chatContainer.scrollTop = chatContainer.scrollHeight;

        try {
            const response = await fetch('/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: message })
            });
            const data = await response.json();
            
            // Add AI Message
            typing.style.display = 'none';
            addMessage('ai', data.response);
            
            // Evaluate scripts in response (for charts)
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = data.response;
            const scripts = tempDiv.getElementsByTagName('script');
            for (let script of scripts) {
                try {
                    eval(script.innerText);
                } catch (e) {
                    console.error("Error executing chart script", e);
                }
            }
        } catch (error) {
            console.error('Error:', error);
            typing.style.display = 'none';
            addMessage('ai', 'Error connecting to the analysis engine.');
        }
    };
    
    if (sendBtn) {
        sendBtn.addEventListener('click', window.sendMessage);
    }

    function addMessage(role, content) {
        const div = document.createElement('div');
        div.className = `message ${role}`;
        
        const avatar = document.createElement('div');
        avatar.className = 'avatar';
        avatar.innerText = role === 'user' ? 'U' : 'AI';
        
        const bubble = document.createElement('div');
        bubble.className = 'bubble';
        bubble.innerHTML = content;
        
        div.appendChild(avatar);
        div.appendChild(bubble);
        
        chatContainer.appendChild(div);
        // Trigger animation
        requestAnimationFrame(() => {
            div.style.opacity = '1';
            div.style.transform = 'translateY(0)';
        });
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    if (input) {
        // Auto-resize
        input.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = (this.scrollHeight) + 'px';
        });

        // Enter to send, Shift+Enter for new line
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                window.sendMessage();
                this.style.height = 'auto'; // Reset height
            }
        });
    }
});
