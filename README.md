# MITRE ATT&CK Groups Lookup Chrome Extension

A Chrome browser extension that allows you to search for MITRE ATT&CK threat groups and retrieve their descriptions, aliases, and other relevant information.

## Features

- **Search Functionality**: Search for threat groups by name, alias, or description
- **Real-time Data**: Fetches data from MITRE ATT&CK's official STIX data
- **Caching**: Implements intelligent caching to reduce API calls
- **Highlighting**: Search terms are highlighted in results
- **Direct Links**: Click to view full details on the MITRE ATT&CK website
- **Responsive Design**: Clean, modern UI that works on different screen sizes

## Installation

1. **Download the Extension**:
   - Clone or download this repository to your local machine

2. **Load in Chrome**:
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" in the top right corner
   - Click "Load unpacked" and select the extension folder
   - The extension should now appear in your extensions list

3. **Pin the Extension** (Optional):
   - Click the puzzle piece icon in Chrome's toolbar
   - Find "MITRE ATT&CK Groups Lookup" and click the pin icon

## Usage

1. **Open the Extension**:
   - Click the extension icon in your Chrome toolbar
   - The popup window will open

2. **Search for Groups**:
   - Type a group name, alias, or partial name in the search box
   - Press Enter or click the "Search" button
   - Results will appear below with highlighted search terms

3. **View Details**:
   - Click "View on MITRE ATT&CK" to open the full group page
   - Each result shows the group name, ID, description, and aliases

## How It Works

The extension fetches data from MITRE ATT&CK's official STIX (Structured Threat Information eXpression) data source. It:

1. **Loads Data**: Fetches the latest group information from MITRE's GitHub repository
2. **Caches Results**: Stores data locally for faster subsequent searches
3. **Searches Intelligently**: Matches search terms against group names, aliases, and descriptions
4. **Displays Results**: Shows formatted results with highlighting and direct links

## Data Sources

- **Primary**: MITRE ATT&CK STIX data from [mitre/cti](https://github.com/mitre/cti)
- **Fallback**: Direct parsing from the MITRE ATT&CK website
- **Sample Data**: Included for demonstration when other sources are unavailable

## Technical Details

- **Manifest Version**: 3 (Chrome Extension Manifest V3)
- **Permissions**: 
  - `activeTab`: For potential future features
  - `storage`: For caching group data
  - `host_permissions`: Access to MITRE ATT&CK domains
- **Data Format**: STIX 2.1 JSON format
- **Caching**: 1-hour cache duration for optimal performance

## Troubleshooting

### Extension Not Loading
- Ensure you're using Chrome version 88 or later
- Check that Developer mode is enabled
- Verify all files are present in the extension folder

### No Search Results
- Check your internet connection
- Try refreshing the extension (disable and re-enable)
- The extension includes sample data as a fallback

### Data Not Updating
- The extension caches data for 1 hour
- Clear Chrome's extension storage to force a refresh
- Check if MITRE's data source is accessible

## Development

### File Structure
```
mitre-gang-lookup/
├── manifest.json          # Extension configuration
├── popup.html             # Main UI
├── popup.js               # Search functionality
├── styles.css             # Styling
├── icon16.png             # 16x16 icon (create these)
├── icon48.png             # 48x48 icon (create these)
├── icon128.png            # 128x128 icon (create these)
└── README.md              # This file
```

### Adding Icons
Create the following icon files:
- `icon16.png` (16x16 pixels)
- `icon48.png` (48x48 pixels) 
- `icon128.png` (128x128 pixels)

You can use any image editor or online icon generators to create these.

## License

This project is for educational and research purposes. MITRE ATT&CK data is used under MITRE's terms of use.

## Contributing

Feel free to submit issues, feature requests, or pull requests to improve this extension.

## Disclaimer

This extension is not officially affiliated with MITRE. It's a third-party tool that uses publicly available MITRE ATT&CK data. Always verify information from the official MITRE ATT&CK website.
