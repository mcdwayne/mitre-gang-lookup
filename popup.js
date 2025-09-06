// MITRE ATT&CK Groups Lookup Extension
class MitreAttckLookup {
    constructor() {
        this.groupsData = null;
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadGroupsData();
    }

    bindEvents() {
        const searchBtn = document.getElementById('searchBtn');
        const searchInput = document.getElementById('searchInput');

        searchBtn.addEventListener('click', () => this.performSearch());
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.performSearch();
            }
        });
    }

    async loadGroupsData() {
        try {
            // Try to load from cache first
            const cached = await this.getCachedData();
            if (cached && this.isDataFresh(cached.timestamp)) {
                this.groupsData = cached.data;
                return;
            }

            // Load fresh data
            await this.fetchGroupsData();
        } catch (error) {
            console.error('Error loading groups data:', error);
            this.showError('Failed to load MITRE ATT&CK groups data. Please try again later.');
        }
    }

    async getCachedData() {
        return new Promise((resolve) => {
            chrome.storage.local.get(['mitreGroupsData'], (result) => {
                resolve(result.mitreGroupsData || null);
            });
        });
    }

    async setCachedData(data) {
        return new Promise((resolve) => {
            chrome.storage.local.set({
                mitreGroupsData: {
                    data: data,
                    timestamp: Date.now()
                }
            }, resolve);
        });
    }

    isDataFresh(timestamp) {
        const oneHour = 60 * 60 * 1000; // 1 hour in milliseconds
        return (Date.now() - timestamp) < oneHour;
    }

    async fetchGroupsData() {
        this.showLoading(true);
        
        try {
            // Fetch from MITRE ATT&CK STIX data
            const response = await fetch('https://raw.githubusercontent.com/mitre/cti/master/enterprise-attack/enterprise-attack.json');
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const stixData = await response.json();
            
            // Extract groups from STIX data
            this.groupsData = this.extractGroupsFromStix(stixData);
            
            // Cache the data
            await this.setCachedData(this.groupsData);
            
        } catch (error) {
            console.error('Error fetching groups data:', error);
            // Fallback: try to scrape from the website
            await this.fetchGroupsFromWebsite();
        } finally {
            this.showLoading(false);
        }
    }

    extractGroupsFromStix(stixData) {
        const groups = [];
        
        for (const object of stixData.objects) {
            if (object.type === 'intrusion-set') {
                const group = {
                    id: object.id,
                    name: object.name,
                    description: object.description || 'No description available',
                    aliases: object.aliases || [],
                    external_references: object.external_references || [],
                    created: object.created,
                    modified: object.modified
                };
                groups.push(group);
            }
        }
        
        return groups;
    }

    async fetchGroupsFromWebsite() {
        try {
            // This is a fallback method - in a real implementation, you might need to use a CORS proxy
            // or implement a background script to fetch the data
            const response = await fetch('https://attack.mitre.org/groups/');
            
            if (!response.ok) {
                throw new Error('Failed to fetch from website');
            }
            
            const html = await response.text();
            this.groupsData = this.parseGroupsFromHTML(html);
            
        } catch (error) {
            console.error('Error fetching from website:', error);
            // Use sample data as last resort
            this.groupsData = this.getSampleGroupsData();
        }
    }

    parseGroupsFromHTML(html) {
        // This is a simplified parser - in practice, you'd need more robust HTML parsing
        const groups = [];
        const groupRegex = /<a[^>]*href="\/groups\/([^"]+)">([^<]+)<\/a>/g;
        let match;
        
        while ((match = groupRegex.exec(html)) !== null) {
            groups.push({
                id: match[1],
                name: match[2],
                description: 'Description not available from HTML parsing',
                aliases: [],
                external_references: []
            });
        }
        
        return groups;
    }

    getSampleGroupsData() {
        // Sample data for demonstration
        return [
            {
                id: 'G0001',
                name: 'APT1',
                description: 'APT1 is a Chinese threat group that has been attributed to the 2nd Bureau of the People\'s Liberation Army (PLA) General Staff Department\'s 3rd Department (Military Unit Cover Designator (MUCD) 61398).',
                aliases: ['Comment Crew', 'Comment Panda', 'Shanghai Group'],
                external_references: []
            },
            {
                id: 'G0002',
                name: 'APT28',
                description: 'APT28 is a Russian threat group that has been active since at least 2004. The group has been attributed to the Russian General Staff Main Intelligence Directorate (GRU) 85th Main Special Service Center (GTsSS) Military Unit 26165.',
                aliases: ['Fancy Bear', 'Sofacy', 'Pawn Storm', 'Sednit', 'Tsar Team'],
                external_references: []
            }
        ];
    }

    performSearch() {
        const searchTerm = document.getElementById('searchInput').value.trim();
        
        if (!searchTerm) {
            this.showError('Please enter a search term');
            return;
        }

        if (!this.groupsData) {
            this.showError('Groups data not loaded yet. Please wait and try again.');
            return;
        }

        const results = this.searchGroups(searchTerm);
        this.displayResults(results, searchTerm);
    }

    searchGroups(searchTerm) {
        const term = searchTerm.toLowerCase();
        
        return this.groupsData.filter(group => {
            // Search in name
            if (group.name.toLowerCase().includes(term)) {
                return true;
            }
            
            // Search in aliases
            if (group.aliases.some(alias => alias.toLowerCase().includes(term))) {
                return true;
            }
            
            // Search in description
            if (group.description.toLowerCase().includes(term)) {
                return true;
            }
            
            return false;
        });
    }

    displayResults(results, searchTerm) {
        const resultsSection = document.getElementById('resultsSection');
        const errorSection = document.getElementById('errorSection');
        const resultsDiv = document.getElementById('results');
        
        // Hide error section
        errorSection.style.display = 'none';
        
        if (results.length === 0) {
            resultsDiv.innerHTML = `
                <div class="no-results">
                    <p>No groups found matching "${searchTerm}"</p>
                    <p>Try searching with different terms or check the spelling.</p>
                </div>
            `;
        } else {
            resultsDiv.innerHTML = results.map(group => this.createGroupCard(group, searchTerm)).join('');
        }
        
        resultsSection.style.display = 'block';
    }

    createGroupCard(group, searchTerm) {
        const highlightedName = this.highlightText(group.name, searchTerm);
        const highlightedDescription = this.highlightText(group.description, searchTerm);
        const aliasesHtml = group.aliases.length > 0 ? 
            `<div class="aliases">
                <strong>Aliases:</strong> ${group.aliases.map(alias => this.highlightText(alias, searchTerm)).join(', ')}
            </div>` : '';

        return `
            <div class="group-card">
                <div class="group-header">
                    <h3 class="group-name">${highlightedName}</h3>
                    <span class="group-id">${group.id}</span>
                </div>
                <div class="group-description">
                    ${highlightedDescription}
                </div>
                ${aliasesHtml}
                <div class="group-actions">
                    <a href="https://attack.mitre.org/groups/${group.id}" target="_blank" class="view-details-btn">
                        View on MITRE ATT&CK
                    </a>
                </div>
            </div>
        `;
    }

    highlightText(text, searchTerm) {
        if (!searchTerm) return text;
        
        const regex = new RegExp(`(${this.escapeRegExp(searchTerm)})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }

    escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    showLoading(show) {
        const loading = document.getElementById('loading');
        loading.style.display = show ? 'flex' : 'none';
    }

    showError(message) {
        const errorSection = document.getElementById('errorSection');
        const errorMessage = document.getElementById('errorMessage');
        const resultsSection = document.getElementById('resultsSection');
        
        errorMessage.textContent = message;
        errorSection.style.display = 'block';
        resultsSection.style.display = 'none';
    }
}

// Initialize the extension when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new MitreAttckLookup();
});
