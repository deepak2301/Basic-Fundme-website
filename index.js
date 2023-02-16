import { ethers } from "./ethers-5.6.esm.min.js"
import { abi, contractAddress } from "./constants.js"

let connectButton = document.getElementById("connect-Btn")
let fundButton = document.getElementById("fund-Btn")
let balanceButton = document.getElementById("balance-btn")
let withdrawbutton = document.getElementById("withdraw-btn")

balanceButton.onclick = getBalance
connectButton.onclick = connect
fundButton.onclick = fund
withdrawbutton.onclick = withdraw

async function connect() {
  if (typeof window.ethereum !== "undefined") {
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" })
    } catch (error) {
      console.log(error)
    }
    connectButton.innerText = "Connected!"
    const accounts = await ethereum.request({ method: "eth_accounts" })
    console.log(accounts)
  } else {
    connectButton.innerText = "Please Install Metamask"
  }
}
//*getbalance

async function getBalance() {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const balance = await provider.getBalance(contractAddress)
    console.log(ethers.utils.formatEther(balance))
  }
}

//*fund

async function fund() {
  const ethAmount = document.getElementById("ethAmount").value
  console.log(`Funding with ${ethAmount}....`)
  if (typeof window.ethereum !== "undefined") {
    //? What we need to send a transaction
    //* provider/connection to blockchain
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    //*signer/wallet/someone with some gas
    const signer = provider.getSigner()
    //* contract that we are interacting with
    const contract = new ethers.Contract(contractAddress, abi, signer)
    try {
      //* ABI & Address
      const transactionResponse = await contract.fund({
        value: ethers.utils.parseEther(ethAmount),
      })
      //* hey, wait for this tx to finish
      await listenForTxMine(transactionResponse, provider)
      console.log("Done!")
    } catch (error) {
      console.log(error)
    }
  }
}

function listenForTxMine(transactionResponse, provider) {
  console.log(`Mining ${transactionResponse.hash}....`)
  //*listen for this transaction to finish
  //* we get transactionReceipt when transactionResponse is finished
  return new Promise((resolve, reject) => {
    provider.once(transactionResponse.hash, (transactionreceipt) => {
      console.log(
        `Completed with ${transactionreceipt.confirmations}confirmations`
      )
      resolve()
    })
  })
}

async function withdraw() {
  if (typeof window.ethereum !== "undefined") {
    console.log("Withdrawing")
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    //* contract that we are interacting with
    const contract = new ethers.Contract(contractAddress, abi, signer)
    try {
      const transactionResponse = await contract.withdraw()
      await listenForTxMine(transactionResponse, provider)
    } catch (error) {
      console.log(error)
    }
  }
}
