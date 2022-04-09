## Description

This PR adds 2 new components: one for the "shopping list" view and one for the "add item" view.

The NavLink element from React Router Dom allows us to detect which route is currently active and provides an isActive property which contains a boolean value. We've used the isActive property to provide conditional styling to the "add item" and "shopping list" links according to which link is currently active.

Documentation for React Router Dom can be found [here] (https://reactrouter.com/docs/en/v6/getting-started/overview).
A straightforward explanation of the NavLink element with example code can be found [here] (https://ultimatecourses.com/blog/active-navlink-inline-styles-with-react-router).

## Related Issue

closes #2

## Acceptance Criteria

- [x] react-router-dom has been added as a project dependency
- [x] Links are present and persistent at the bottom of the app: one for the “list” view, the other for the “add an item” view
- [x] When one of the links is clicked, the browser URL updates to represent the current view and a matching view component is displayed
- [x] Whichever view is selected, the corresponding link should display in bold text

## Type of Changes

<!-- Put an `✓` for the applicable box: -->

|     | Type                       |
| --- | -------------------------- |
|     | :bug: Bug fix              |
| ✓   | :sparkles: New feature     |
|     | :hammer: Refactoring       |
|     | :100: Add tests            |
| ✓   | :link: Update dependencies |
|     | :scroll: Docs              |

## Updates

## Testing Steps / QA Criteria

- From your terminal, pull down this branch with git pull origin la-ng-add-react-router-dom and check that branch out with git checkout la-ng-add-react-router-dom
- Then npm to install the newly added dependencies locally and npm start to launch the app.
- Click the links to "shopping list" and "add item" at the bottom of the page. Make sure the URL and link styling changes according to the current path.
