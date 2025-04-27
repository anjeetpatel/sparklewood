# AI Safety Incident Dashboard

This project is a professional frontend implementation of an AI Safety Incident Dashboard for HumanChain, focused on tracking, reporting, and managing AI safety incidents.

## Features

### Core Features
- **Dashboard Overview**: Visual metrics and statistics about incidents
- **Incident List Display**: View a list of AI safety incidents with their title, severity, status, and reported date
- **Filtering & Sorting**: Advanced filtering by severity, status, category, and sorting options
- **Search Functionality**: Search through incidents by title or description
- **View Details Toggle**: Expand/collapse incident descriptions
- **Report New Incident Form**: Submit new incidents with comprehensive validation
- **Incident Timeline**: Chronological view of incidents organized by month
- **Status Management**: Update incident status (New, In Review, Resolved)
- **Export Functionality**: Export incident data to CSV

### UI/UX Features
- **Responsive Design**: Works seamlessly on mobile and desktop devices
- **Dark Mode Support**: Toggle between light and dark themes
- **Visual Indicators**: Color-coded severity levels and status indicators
- **Loading States**: Skeleton loaders for better user experience
- **Animations**: Subtle animations for a more dynamic interface
- **Toast Notifications**: Feedback for user actions
- **Tabbed Interface**: Easy navigation between dashboard views

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Languages**: TypeScript, HTML, CSS
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Form Handling**: React Hook Form with Zod validation
- **State Management**: React useState hooks
- **Theming**: next-themes for dark mode support

## Installation and Setup

1. Clone the repository:
   \`\`\`bash
   git clone https://github.com/your-username/ai-safety-incident-dashboard.git
   cd ai-safety-incident-dashboard
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Run the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Design Decisions

- **Dashboard Layout**: Used a tabbed interface to organize different views (Dashboard, Incidents, Timeline)
- **Metrics Cards**: Added visual metrics for quick insights into incident data
- **Severity Color Coding**: Used green for Low, amber for Medium, and red for High severity for visual cues
- **Status Tracking**: Added status workflow (New → In Review → Resolved) with appropriate icons
- **Categorization**: Implemented incident categories for better organization
- **Timeline View**: Created a chronological view of incidents for historical tracking
- **Export Functionality**: Added CSV export for data analysis in external tools
- **Mobile-First Design**: Ensured the dashboard works well on all device sizes
- **Dark Mode**: Implemented theme switching for user preference

## Project Structure

- `app/`: Next.js app router pages and layouts
- `components/`: Reusable UI components
  - `dashboard-header.tsx`: Main navigation and app header
  - `dashboard-metrics.tsx`: Metrics cards for the dashboard
  - `incident-list.tsx`: Displays the list of incidents
  - `incident-timeline.tsx`: Chronological view of incidents
  - `filter-sort-controls.tsx`: Controls for filtering and sorting
  - `report-incident-form.tsx`: Form for submitting new incidents
  - `mode-toggle.tsx`: Dark/light mode toggle
  - `ui/`: shadcn/ui components
- `lib/`: Utility functions, data, and type definitions
- `hooks/`: Custom React hooks

## Future Improvements

- Add authentication for incident reporting
- Implement data persistence with a backend API
- Add incident assignment and user management
- Create more advanced analytics and trends visualization
- Implement real-time notifications for new incidents
- Add commenting and collaboration features
- Integrate with AI models for incident analysis and prediction
