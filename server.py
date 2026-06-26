#!/usr/bin/env python3
import http.server
import socketserver
import os

PORT = 3000

# Change directory to the script's directory
os.chdir(os.path.dirname(os.path.abspath(__file__)))

Handler = http.server.SimpleHTTPRequestHandler

try:
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print(f"Server started at http://localhost:{PORT}")
        print(f"Press Ctrl+C to stop the server")
        httpd.serve_forever()
except KeyboardInterrupt:
    print("\nServer stopped")
except OSError as e:
    print(f"Error: {e}")
    print("Trying a different port...")
    # Try another port
    for port in range(3001, 3010):
        try:
            with socketserver.TCPServer(("", port), Handler) as httpd:
                print(f"Server started at http://localhost:{port}")
                print(f"Press Ctrl+C to stop the server")
                httpd.serve_forever()
                break
        except OSError:
            continue
