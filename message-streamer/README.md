Prerequisites
1. Node.js Installed
2. npm or Yarn Installed

Make sure you have Node.js installed on your system along with npm. 
Check if Node.js is installed by running:
```bash
node -v
```
Check if npm is installed by running:
```bash
npm -v
```
1. First, Install the application dependencies
   *note: make sure you are inside the directory **message-streamer** that contains the frontend application*
    then run:
    ```bash
    npm install
    ```
   
3. Second, run the development server:

    ```bash
    npm run dev
    # or
    yarn dev
    # or
    pnpm dev
    # or
    bun dev
    ```
    
    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

4. Third, run the express server:

    ```bash
    cd server
    npm run server
    ```

The page auto-updates as you edit the `data.txt` file, but you have to stick to the format (AI, and Human)) before each message (please refer to the example in the `data.txt` file).
