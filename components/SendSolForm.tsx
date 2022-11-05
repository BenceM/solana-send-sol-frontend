import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import * as Web3 from "@solana/web3.js";
import { FC, useState } from "react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import styles from "../styles/Home.module.css";

export const SendSolForm: FC = () => {
	const { connection } = useConnection();
	const { publicKey, sendTransaction } = useWallet();
	const [txSig, setTxSig] = useState("");
	const link = () => {
		return txSig
			? `https://explorer.solana.com/tx/${txSig}?cluster=devnet`
			: "";
	};

	const sendSol = (event) => {
		event.preventDefault();
		if (!connection || !publicKey) {
			alert("Please connect your wallet first lol");
			return;
		}
		const transaction = new Web3.Transaction();
		const recipientPubKey = new Web3.PublicKey(event.target.recipient.value);
		const sendSolInstruction = Web3.SystemProgram.transfer({
			fromPubkey: publicKey,
			toPubkey: recipientPubKey,
			lamports: LAMPORTS_PER_SOL * event.target.amount.value,
		});
		transaction.add(sendSolInstruction);
		sendTransaction(transaction, connection).then((sig) => {
			setTxSig(sig);
		});
		console.log(
			`Send ${event.target.amount.value} SOL to ${event.target.recipient.value}`
		);
	};

	return (
		<div>
			{publicKey ? (
				<form onSubmit={sendSol} className={styles.form}>
					<label htmlFor="amount">Amount (in SOL) to send:</label>
					<input
						id="amount"
						type="text"
						className={styles.formField}
						placeholder="e.g. 0.1"
						required
					/>
					<br />
					<label htmlFor="recipient">Send SOL to:</label>
					<input
						id="recipient"
						type="text"
						className={styles.formField}
						placeholder="e.g. 4Zw1fXuYuJhWhu9KLEYMhiPEiqcpKd6akw3WRZCv84HA"
						required
					/>
					<button type="submit" className={styles.formButton}>
						Send
					</button>
				</form>
			) : (
				<span>Connect Your Wallet</span>
			)}
			{txSig ? (
				<div>
					<p>View your transaction on </p>
					<a href={link()}>Solana Explorer</a>
				</div>
			) : null}
		</div>
	);
};
