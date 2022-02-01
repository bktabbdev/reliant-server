# Backend for Reliant Ag App

## Made with PostgreSQL, Node, Express

### **Things I've Learned**

- Running `fs.readFileSync(pathToFile, 'utf-8')` from a non-root directory , the dot in a file path (`./../sampleFile`) references the directory containing the file through which the node service is called, not the file itself
