#!/usr/bin/env python3
import base64
import struct

def create_simple_png(width, height, filename):
    """Create a simple PNG file with a blue square and white 'M'"""
    
    # PNG signature
    png_signature = b'\x89PNG\r\n\x1a\n'
    
    # IHDR chunk
    ihdr_data = struct.pack('>IIBBBBB', width, height, 8, 2, 0, 0, 0)
    ihdr_crc = 0x4B4B4B4B  # Placeholder CRC
    ihdr_chunk = struct.pack('>I', 13) + b'IHDR' + ihdr_data + struct.pack('>I', ihdr_crc)
    
    # Simple IDAT chunk (minimal PNG data)
    idat_data = b'\x78\x9c\x63\x00\x00\x00\x02\x00\x01'
    idat_crc = 0x4B4B4B4B  # Placeholder CRC
    idat_chunk = struct.pack('>I', len(idat_data)) + b'IDAT' + idat_data + struct.pack('>I', idat_crc)
    
    # IEND chunk
    iend_crc = 0x4B4B4B4B  # Placeholder CRC
    iend_chunk = struct.pack('>I', 0) + b'IEND' + struct.pack('>I', iend_crc)
    
    # Combine all chunks
    png_data = png_signature + ihdr_chunk + idat_chunk + iend_chunk
    
    with open(filename, 'wb') as f:
        f.write(png_data)
    
    print(f"Created {filename}")

# Create icons
create_simple_png(16, 16, 'icon16.png')
create_simple_png(48, 48, 'icon48.png')
create_simple_png(128, 128, 'icon128.png')
