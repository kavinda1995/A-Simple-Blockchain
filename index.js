const SHA256 = require('crypto-js/sha256');

// creating class for Blockchain's block
class Block
{
    //defining mandatory properties for a block. 
    constructor(id, timestamp, data, previousHash){
        this.id = id; // Id is a identifier and also acts as a index here 
        this.timestamp = timestamp; // time and date of a block created
        this.data = data; // data resides inside the block (cash value transfered etc.). 
                         // This will be a object when we adding data to the block 
        this.previousHash = previousHash; // Hash value of the previosu block of the blockchain stored here for verification
        this.hash = this.setHash(); // Calculated hash for the block
    }

    // Function to define the hash of the block by hashing the aggregrated value of the 
    setHash(){
        let hash = SHA256(this.id + this.timestamp + JSON.stringify(this.data) + this.previousHash);
        // console.log("Calculated hash is: ",hash); // Print the hash object
        return hash.toString(); // Return the hash in a string format to set the hash
    }
}

class Blockchain
{
    constructor(){
        this.chain = []; // Initialise the blockchain as an array of blocks
        
        this.timestamp = new Date();
        this.chain.push(new Block(1, this.timestamp, { amount : 10000 }, "0")); // Creating the Genesis (Starting block of the chain)
    }

    // Get last block details
    getLastBlock(){
        return this.chain[this.chain.length - 1]; 
    }

    // Function to add new blocks to the blockchain
    addBlock(data){
        this.data = data;

        // Calling the check funds function
        if(this.checkFunds(parseInt(this.data.amount))){
            // And continue adding a block if the funds are suffiecient only
            this.id = this.getLastBlock().id + 1; // Getting the 
            this.timestamp = new Date();
            this.previousHash = this.getLastBlock().hash;

            // this.hash = setHash();

            let newBlock = new Block (this.id, this.timestamp, this.data, this.previousHash);
            this.hash = newBlock.setHash();

            this.chain.push(newBlock);
        }else{
            console.log("Funds aren't enough to make the transaction. Transaction cancelled. \n");
        }
    }

    checkFunds(amount){
        // Checking whether the funds are sufficient to make the transfer
        if(parseInt(this.getLastBlock().data.amount) >= amount){
            console.log("Funds are okay \n");
            return true;
        }else{
            return false;
        }
    }

    checkValidity(){
        for (let block = 1; block < this.chain.length; block++){
            // Checking if the block's own hash is correct
            if(this.chain[block].hash !== this.chain[block].setHash()){
                console.log("Error in Block number", block);
                return false;
            }
            
            // Checking if the block is tally with the previous block
            if(this.chain[block].previousHash !== this.chain[block-1].hash){
                console.log("Error in Block number", block);
                return false;
            }

            // If nothing wrong, Return true
            return true;
        }
    }

    viewChain(){
        console.log(JSON.stringify(this.chain, null, 4));
    }
}

let kavindaCoin = new Blockchain;

console.log("\n Blockchain at the init stage: ");
kavindaCoin.viewChain();

// Adding new blocks (Transactions)
kavindaCoin.addBlock({ amount : 1000 });
kavindaCoin.addBlock({ amount : 500 });

console.log("\n Blockchain after new blocks added:");
kavindaCoin.viewChain();

console.log("Is blockchain is valid?", kavindaCoin.checkValidity());

// Checking whether the validation works fine by tampering some data

kavindaCoin.chain[1].data = { amount : 5000 };

console.log("Is blockchain is still valid?", kavindaCoin.checkValidity());

// Checking whether the funds verification works

kavindaCoin.addBlock({ amount : 5000 });
console.log("\n Blockchain after transaction cancelled :");
kavindaCoin.viewChain();