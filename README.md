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

As stated above, this project is made with React and TypeScript. I chose TypeScript for one simple reason: I prefer strongly typed code. Nothing against JavaScript, it definitely has it's place, but I use TS where I can. As for the project itself, ut's a single page application where modals do all of the heavy lifting when it comes to things you'd usually route, like adding/editing a project, or managing settings. For the sake of my own sanity, I used a library called [Mantine](https://mantine.dev/) to keep styling (mostly) out of sight and out of mind. Mantine goes way beyond a simple component collection, providing new hooks, functions, and a myriad of simple and complex components for dealing with almost any situation you could think of. The main focus of this project is its functionality, not its looks, and a library like Mantine more than solves that problem. This entire application is wrapped up in [Electron](https://www.electronjs.org/) so that it can be run as a desktop app. I had originally tried to use [Tauri](https://tauri.studio/), but the incompleteness of their docs (especially around the Rust backend) and lack of good examples left me spending more time fighting with build tools and configuration than actually building the app.
