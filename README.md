# Project Dashboard

A simple dashboard for managing projects made with React and TypeScript.

## Installation

Download the correct file for your system (`.zip` on Mac, `.exe` on Windows) and install it. After that, it should run like any other application on your machine.

## Building

- Clone the repo or download the source code
- Use `npm ci` at the project root to install all dependencies
- Use `npm run make` to build the project for production
- Happy managing!

## How it's made

This project is built upon React 18 with the help of TypeScript and the Mantine UI library. It's then wrapped up in an Electron application for distribution as a desktop app. React and Electron are more tightly coupled than I'd like, but there isn't much else I can do about it other than introducing extra layers of abstraction; however, since I don't have any major plans for porting this to an actual website any time soon, it should be okay.

## Credits

- [React](https://reactjs.org/)
- [Electron](https://www.electronjs.org/)
  - Packaged with [Electron Forge](https://www.electronforge.io/)
- [Mantine](https://mantine.dev/)
  - Mantine is a simple, modern, and powerful React UI library for building user interfaces. Without it, I wouldn't be able to push this project out as fast as I do.
