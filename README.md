# City Search Dropdown React Component

## Description

This project features a React component that provides a city search functionality with a dropdown list. Users can search for cities, select from a list of predefined cities, or enter a custom city name. The component is optimized for performance using React's memo and various hooks.

## Features

- Search for cities from a predefined list
- Autocomplete dropdown with filtered results
- Option to enter custom city names
- Responsive design with CSS styling
- Performance optimized using React hooks (useState, useCallback, useMemo)

## Installation

To use this component in your project, follow these steps:

1. Clone the repository:
   ```
   git clone https://github.com/your-username/your-repo-name.git
   ```

2. Navigate to the project directory:
   ```
   cd your-repo-name
   ```

3. Install the dependencies:
   ```
   npm install
   ```

## Usage

To use the CityDropdown component in your React application:

1. Import the component:
   ```jsx
   import CityDropdown from './path/to/CityDropdown';
   ```

2. Use the component in your JSX:
   ```jsx
   <CityDropdown onCitySelect={handleCitySelect} />
   ```

3. Implement the `handleCitySelect` function to process the selected city:
   ```jsx
   const handleCitySelect = (city) => {
     console.log('Selected city:', city);
     // Add your logic here
   };
   ```

## Dependencies

This project requires the following dependencies:

- React
- react-icons

Make sure to install these dependencies before using the component.

## Development

To start the development server:
