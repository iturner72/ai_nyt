use web3::{
    contract::{Contract, Options},
    types::{Address, U256, Bytes},
    transports::Http,
};
use std::fs;
use web3::ethabi::Contract as EthabiContract;

#[derive(Clone)]
pub struct KeyGateway {
    contract: Contract<Http>,
}

impl KeyGateway {
    pub fn new(web3_provider: &str, contract_address: &str) -> Self {
        let http = web3::transports::Http::new(web3_provider).unwrap();
        let web3 = web3::Web3::new(http);
        let abi_path = "./../abi/KeyGateway.json";
        let abi_str = fs::read_to_string(abi_path).expect("Unable to read ABI file");
        let contract = Contract::new(
            web3.eth(),
            contract_address.parse().unwrap(),
            EthabiContract::load(abi_str.as_bytes()).unwrap(),
        );

        KeyGateway { contract }
    }

    pub async fn add_signer(&self, signer_public_key: Vec<u8>, metadata: Vec<u8>, signature: Vec<u8>, fid_owner: Address, deadline: U256) -> web3::contract::Result<()> {
        self.contract.call(
            "addFor",
            (fid_owner, 1, Bytes::from(signer_public_key), 1, Bytes::from(metadata), deadline, Bytes::from(signature)),
            fid_owner,
            Options::default(),
        ).await?;
        Ok(())
    }
}
