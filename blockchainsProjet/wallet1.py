from wallet import Wallet

d=[
  {
    "private_key": "ee545b79474f35f5ccb9e9998bd46538f9cbdcd59ae904a33c2e57999f8da169",
    "public_key": "e9ebbb33bd812785e2dd897c9358370ef3ca05134dfb77b72d9d33ebb006e17c27a1520caebdc9ab6061961dbf6a73a13cebb2eb74744b891f722b509627d4a8",
    "address": "811bd01edf1565ab9ad16dcf85e51037da31c8c3dae718a7d6ccb2177aa97fdc"
  },
  {
    "private_key": "befd7dab72df3e694b684b670943f679a82fa8d0c82510be463102a378d304c1",
    "public_key": "b913faf0788392cf30c5fa53465b96830cebcf258eb500ffae89e2cdf5493fd06ee0fb0b67951977354d2d8bd0ddb9b538abe3133bb5d796a00d37fc4a98b268",
    "address": "4ba78f8e9d4acc54536d669a68feb54af6214f584664319e336a75ddf89ac183"
  },
  {
    "private_key": "4d054c92444984456ead031b9d2888b180f87c819343d53f36dae4ef88384fe8",
    "public_key": "eb25218145980e4a3a560b9fe5896458d1557350ca7d1a42ea5e7937e09183e7543686706de5a4b5f40bbf98f8fe87bd044f316464beb8d068428b686e1a5e32",
    "address": "ba7e743ff75fb34d7389d809307c72519157dfa9465826d84233f85fd3b602b4"
  }
]
private_key = "ee545b79474f35f5ccb9e9998bd46538f9cbdcd59ae904a33c2e57999f8da169"
public_key="e9ebbb33bd812785e2dd897c9358370ef3ca05134dfb77b72d9d33ebb006e17c27a1520caebdc9ab6061961dbf6a73a13cebb2eb74744b891f722b509627d4a8"
receiver = "b913faf0788392cf30c5fa53465b96830cebcf258eb500ffae89e2cdf5493fd06ee0fb0b67951977354d2d8bd0ddb9b538abe3133bb5d796a00d37fc4a98b268"
amount = 10
wallet = Wallet()
tx_data = f'{public_key}{receiver}{amount}'

# 3. Signature

signature =wallet.sign_transaction(private_key, tx_data)

print("Signature:", signature)


