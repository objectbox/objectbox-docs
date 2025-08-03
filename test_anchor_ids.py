#!/usr/bin/env python3
"""
Test script to check what anchor IDs the predict_docusaurus_anchor_id function generates
for specific headings to identify potential discrepancies.
"""

import sys
import os

# Add the Gitbook directory to the path so we can import the function
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'Gitbook'))

from convert_gitbook_to_mdx3 import predict_docusaurus_anchor_id

def test_anchor_ids():
    """Test the anchor ID generation for specific headings."""
    
    test_headings = [
        "## ObjectBox for Java - Advanced Setup",
        "## ObjectBox for Flutter/Dart - Advanced Setup",
        "### One-to-Many (1:N)",
        "### Many-to-Many (N:M)",
        "## ObjectBox Java - Data Observers and Reactive Extensions"
    ]
    
    print("Testing anchor ID generation:")
    print("=" * 60)
    
    for heading in test_headings:
        # Remove the markdown heading markers (##, ###) for the function
        heading_text = heading.lstrip('#').strip()
        anchor_id = predict_docusaurus_anchor_id(heading_text)
        
        print(f"Heading: {heading}")
        print(f"Text passed to function: '{heading_text}'")
        print(f"Generated anchor ID: '{anchor_id}'")
        print("-" * 40)

if __name__ == "__main__":
    test_anchor_ids()