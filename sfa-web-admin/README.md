# SFA Web Admin · Purchase Order Inquiry

React and Ant Design prototype for reviewing purchase order requests. Open this folder in VS Code.

## Run locally

Install Node.js 22 LTS (or newer) and open **Terminal → New Terminal** in VS Code:

```sh
npm ci
npm run dev
```

Open **http://127.0.0.1:8770/**. Changes to the source appear in the browser while the development server runs.

## Where to make updates

| File | What to edit |
| --- | --- |
| `src/main.jsx` | Sidebar menu, KPI cards, request table and filters, request detail screen, confirmation and rejection, and Ant Design theme settings. Search for `menus`, `columns`, `productColumns`, or `ConfigProvider` to find those sections. |
| `src/styles.css` | Layout, spacing, table density, and responsive styling. |
| `src/data.js` | Sample requests, including products, quantities, and activity history. |
| `package.json` | Dependencies and development/build commands. |

**Try the flow:** Under **Sale → Purchase Order Inquiry**, open a pending request and confirm or reject it. The status and activity history update.

Records and drafts are kept only while the page is open. Reloading restores the sample data. This prototype has no live SFA connection.

## Build for hosting

```sh
npm run build
npm run preview
```

The build output is in `dist/`. Editing this local copy does not update the hosted prototype.
