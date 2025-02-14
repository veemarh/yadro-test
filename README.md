# YADRO | Test

React application that displays and edits items by merging API data with local modifications stored in LocalStorage.

### Features

1. **Item List**
   - Displays items with details.
   - Merges API data with LocalStorage modifications.
   - Supports pagination.
   - Clicking an item opens its Details page.

2. **Item Details**
   - Shows full API data for a selected item.
   - Displays LocalStorage overrides if available.
   - Edit button opens the Edit Form.

3. **Edit Form**
   - Edits a subset of item fields with validation.
   - Saves changes to LocalStorage.
   - Updated data is reflected on List and Details pages.

### Implementation

- **Frontend:** React, React Router, react-hook-form, Yup.
- **Backend:** JSONPlaceholder API.
- **LocalStorage:** Overrides and persists user modifications.
- **Navigation:** Fully supports browser history.

### Installation & Running

```bash
npm install && npm start
