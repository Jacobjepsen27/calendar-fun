# Calendar fun

Build my own custom calendar.

Supports user specfic configurations such as:

- Timerange (e.g. 7-22 or 8-24),
- Validation callback functions (e.g. should not allow to overlap other events)
- isEventReadOnly callback function (e.g. cannot move/edit or click certain events)

This is a work in progress as I have dozens of features in the pipeline.

Features to do:

- Red "now" line to see current time on calendar
- Custom JSX element for styling event
- Dragging event to right/left border will change day/week (Requires a lot of refactoring)
- Event spanning multiple days (Create extra header to show events spanning all day)
- Events should change width and placement inside column if events are overlapping

![Alt text](/public/screenshot.png?raw=true "Optional Title")

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.
