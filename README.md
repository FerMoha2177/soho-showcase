# Soho ShowCase

## Installation

Make sure to have node.js, npm and git installed on your system.

Run the following command to install the dependencies:

```bash
npm install
```

Currently I am working on the main.js file, which is a showcase of the survey data from the Soho survey.

I have the project organized in phases, each phase has its own folder and its own files. Physics and math are in the /physics folder, and the main.js file is in the root folder. The /data folder contains the survey data.

## Usage

To run the main sketch use the following command:

```bash
npm run dev:main
```

To add a new sketch, just add a new file to the /sketches folder and run it with the command:
```bash
npx canvas-sketch-cli sketches/<sketch_file_name>.js --open
```