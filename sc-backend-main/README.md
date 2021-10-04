# SC-Backend

## Introduction

Backend APIs for supply chain project

## Code Samples

 Express Router example
```
//Get Current Flow 
router.get('/flows/me', auth, async (req, res) => {
    try {
        res.send({ flow: req.user.flow[0] })
    } catch (e) {
        res.status(400).send(e.message)
    }
})
```

## Installation

Clone project 
```properties
git clone https://github.com/supply-chain-financing/sc-backend.git
```  
Use the package manager [npm](https://pip.pypa.io/en/stable/) to install package.
``` properties
npm install
```  


## Usage
To start the sc-backend server
```properties
npm start
```


